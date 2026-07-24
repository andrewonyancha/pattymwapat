import { db, isFirebaseConfigured } from './config';
import { 
  collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc, 
  query, orderBy, serverTimestamp, limit, startAfter, QueryDocumentSnapshot,
  where
} from 'firebase/firestore';

// ============ CACHING SYSTEM ============
// Simple in-memory cache with TTL to reduce Firebase reads

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

class ProductQueryCache {
  private cache = new Map<string, CacheEntry<any>>();
  private readonly TTL_MS = 60 * 1000; // 1 minute cache TTL

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;
    
    // Check if cache is expired
    if (Date.now() - entry.timestamp > this.TTL_MS) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.data as T;
  }

  set(key: string, data: any): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  invalidate(prefix: string): void {
    for (const key of this.cache.keys()) {
      if (key.startsWith(prefix)) {
        this.cache.delete(key);
      }
    }
  }

  clear(): void {
    this.cache.clear();
  }
}

// Singleton cache instance
const productCache = new ProductQueryCache();

// In-flight request deduplication
const pendingProductRequests = new Map<string, Promise<any>>();

function dedupeProductRequest<T>(key: string, requestFn: () => Promise<T>): Promise<T> {
  if (pendingProductRequests.has(key)) {
    return pendingProductRequests.get(key) as Promise<T>;
  }
  
  const promise = requestFn().finally(() => {
    pendingProductRequests.delete(key);
  });
  
  pendingProductRequests.set(key, promise);
  return promise;
}

export type Product = {
  id: string;
  name: string;
  slug: string;
  category: 'Engine Parts' | 'Brake Systems' | 'Tires & Wheels' | 'Electrical' | 'Filters' | 'Body Parts';
  subcategory?: string;
  price: number;
  unit: string;
  image?: string;
  isStatic?: boolean;
  createdAt?: any;
  updatedAt?: any;
};

const PRODUCTS_COLLECTION = 'products';

// Get paginated dynamic products from Firestore with caching
export interface PaginatedProductsResult {
  products: Product[];
  lastDoc: QueryDocumentSnapshot | null;
  hasMore: boolean;
}

export async function getDynamicProducts(
  pageSize = 20,
  lastDocSnapshot?: QueryDocumentSnapshot | null,
  useCache = true
): Promise<PaginatedProductsResult> {
  const firestore = db;
  if (!isFirebaseConfigured || !firestore) {
    return { products: [], lastDoc: null, hasMore: false };
  }

  const cacheKey = lastDocSnapshot 
    ? `dynamicProducts:page:${pageSize}:${lastDocSnapshot.id}`
    : `dynamicProducts:page:${pageSize}:start`;

  // Only use cache for first page
  if (useCache && !lastDocSnapshot) {
    const cached = productCache.get<PaginatedProductsResult>(cacheKey);
    if (cached) {
      console.log('[Cache] Returning cached dynamic products');
      return cached;
    }
  }

  return dedupeProductRequest(cacheKey, async () => {
    try {
      let q;
      
      if (lastDocSnapshot) {
        q = query(
          collection(firestore, PRODUCTS_COLLECTION),
          orderBy("createdAt", "desc"),
          startAfter(lastDocSnapshot),
          limit(pageSize)
        );
      } else {
        q = query(
          collection(firestore, PRODUCTS_COLLECTION),
          orderBy("createdAt", "desc"),
          limit(pageSize)
        );
      }

      const snapshot = await getDocs(q);
      
      const products: Product[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        isStatic: false
      } as Product));

      const lastDoc = snapshot.docs[snapshot.docs.length - 1] || null;
      const hasMore = snapshot.docs.length === pageSize;

      const result: PaginatedProductsResult = {
        products,
        lastDoc,
        hasMore
      };

      // Cache first page only
      if (!lastDocSnapshot) {
        productCache.set(cacheKey, result);
        console.log('[Firebase] Fetched first page of dynamic products from Firestore');
      }

      return result;
    } catch (error) {
      console.error('Error fetching dynamic products:', error);
      return { products: [], lastDoc: null, hasMore: false };
    }
  });
}

// Legacy function - returns all dynamic products with caching
export async function getDynamicProductsAll(useCache = true): Promise<Product[]> {
  const firestore = db;
  if (!isFirebaseConfigured || !firestore) {
    return [];
  }

  const cacheKey = 'dynamicProducts:all';

  if (useCache) {
    const cached = productCache.get<Product[]>(cacheKey);
    if (cached) {
      console.log('[Cache] Returning cached all dynamic products');
      return cached;
    }
  }

  return dedupeProductRequest(cacheKey, async () => {
    try {
      const q = query(
        collection(firestore, PRODUCTS_COLLECTION), 
        orderBy("createdAt", "desc")
      );
      const snapshot = await getDocs(q);
      
      const products = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        isStatic: false
      } as Product));

      productCache.set(cacheKey, products);
      console.log('[Firebase] Fetched all dynamic products from Firestore');
      
      return products;
    } catch (error) {
      console.error('Error fetching dynamic products:', error);
      return [];
    }
  });
}

// Keep original function for backwards compatibility
export async function getDynamicProductsLegacy(): Promise<Product[]> {
  return getDynamicProductsAll(false); // Don't cache for legacy calls
}

export async function getProductById(id: string): Promise<Product | null> {
  const firestore = db;
  if (!firestore) return null;
  
  const cacheKey = `product:${id}`;
  const cached = productCache.get<Product>(cacheKey);
  if (cached) {
    return cached;
  }

  try {
    const ref = doc(firestore, PRODUCTS_COLLECTION, id);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;
    
    const product = { id: snap.id, ...snap.data(), isStatic: false } as Product;
    productCache.set(cacheKey, product);
    return product;
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    return null;
  }
}

// Get a single product by slug from Firestore
export async function getProductBySlug(slug: string): Promise<Product | null> {
  const firestore = db;
  if (!isFirebaseConfigured || !firestore) {
    return null;
  }

  const cacheKey = `product:slug:${slug}`;
  const cached = productCache.get<Product>(cacheKey);
  if (cached) {
    return cached;
  }

  try {
    const q = query(
      collection(firestore, PRODUCTS_COLLECTION),
      where('slug', '==', slug),
      limit(1)
    );
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) return null;
    
    const doc = snapshot.docs[0];
    const product = { id: doc.id, ...doc.data(), isStatic: false } as Product;
    productCache.set(cacheKey, product);
    return product;
  } catch (error) {
    console.error('Error fetching product by slug:', error);
    return null;
  }
}

export async function createProduct(data: Omit<Product, 'id' | 'isStatic'>): Promise<string> {
  const firestore = db;
  if (!firestore) throw new Error("Firestore not initialized");
  
  try {
    const docRef = await addDoc(collection(firestore, PRODUCTS_COLLECTION), {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    // Invalidate products cache
    productCache.invalidate('dynamicProducts');
    
    return docRef.id;
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
}

export async function updateProduct(id: string, data: Partial<Product>): Promise<void> {
  const firestore = db;
  if (!firestore) throw new Error("Firestore not initialized");
  
  try {
    const ref = doc(firestore, PRODUCTS_COLLECTION, id);
    await updateDoc(ref, {
      ...data,
      updatedAt: serverTimestamp(),
    });

    // Invalidate products cache
    productCache.invalidate('dynamicProducts');
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
}

export async function deleteProduct(id: string): Promise<void> {
  const firestore = db;
  if (!firestore) return;
  
  try {
    await deleteDoc(doc(firestore, PRODUCTS_COLLECTION, id));
    
    // Invalidate products cache
    productCache.invalidate('dynamicProducts');
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
}

// Export cache for manual invalidation
export const invalidateProductCache = () => {
  productCache.invalidate('dynamicProducts');
  productCache.clear();
  console.log('[Cache] All product caches cleared');
};
