// lib/firebase/orders.ts
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  getDocs,
  doc,
  getDoc,
  updateDoc,
  serverTimestamp,
  limit,
  startAfter,
  QueryDocumentSnapshot
} from 'firebase/firestore';
import { db, isFirebaseConfigured, auth } from './config';
import { User } from 'firebase/auth';

// ============ CACHING SYSTEM ============
// Simple in-memory cache with TTL to reduce Firebase reads

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

class QueryCache {
  private cache = new Map<string, CacheEntry<any>>();
  private readonly TTL_MS = 60 * 1000; // 1 minute cache TTL

  private getKey(prefix: string, ...args: any[]): string {
    return `${prefix}:${args.join(':')}`;
  }

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
    // Remove all entries starting with prefix
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
const orderCache = new QueryCache();

// In-flight request deduplication
const pendingRequests = new Map<string, Promise<any>>();

function dedupeRequest<T>(key: string, requestFn: () => Promise<T>): Promise<T> {
  // If there's already a pending request, return it
  if (pendingRequests.has(key)) {
    return pendingRequests.get(key) as Promise<T>;
  }
  
  // Create new request
  const promise = requestFn().finally(() => {
    pendingRequests.delete(key);
  });
  
  pendingRequests.set(key, promise);
  return promise;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  unit?: string;
  variant?: string; // store variant size (e.g., "350ml", "1L")
}

export interface Order {
  id?: string;
  userId: string;
  userEmail: string;
  userName: string;
  phone: string;
  address: string;
  deliveryNotes?: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  paymentReference: string;
  paymentMethod: 'card' | 'mobile' | 'cash';
  status: OrderStatus;
  paymentStatus?: 'pending' | 'paid' | 'unpaid';
  // Dispatch-related fields (industry standard)
  driverName?: string;      // Name of delivery driver
  driverPhone?: string;     // Driver's phone number
  dispatchDate?: any;       // When order was dispatched
  estimatedDelivery?: any; // Expected delivery time
  actualDeliveryDate?: any; // When actually delivered
  deliveryFailed?: boolean; // If delivery attempt failed
  deliveryFailReason?: string; // Why delivery failed
  createdAt: any;
}

export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'dispatched' | 'delivered' | 'cancelled';

export const saveOrder = async (
  user: User,
  orderData: Omit<Order, 'id' | 'userId' | 'userEmail' | 'createdAt' | 'status'>
): Promise<{ orderId?: string; error?: string }> => {
  if (!isFirebaseConfigured || !db) {
    return { error: 'Firebase is not configured' };
  }

  try {
    // Force token refresh to ensure we have a valid, non-expired token
    // This is critical because Firestore security rules rely on request.auth.uid
    await user.getIdToken(true);

    // Cash orders start with 'pending' status until payment is confirmed
    const isCashOrder = orderData.paymentMethod === 'cash';
    
    const docRef = await addDoc(collection(db, 'orders'), {
      userId: user.uid,
      userEmail: user.email || '',
      userName: orderData.userName,
      phone: orderData.phone,
      address: orderData.address,
      deliveryNotes: orderData.deliveryNotes || '',
      items: orderData.items,
      subtotal: orderData.subtotal,
      deliveryFee: orderData.deliveryFee,
      total: orderData.total,
      paymentReference: orderData.paymentReference,
      paymentMethod: orderData.paymentMethod,
      status: isCashOrder ? 'pending' : 'confirmed',
      paymentStatus: isCashOrder ? 'pending' : 'paid',
      createdAt: serverTimestamp(),
    });

    // Invalidate user orders cache after new order
    orderCache.invalidate('userOrders');
    orderCache.invalidate('allOrders');

    return { orderId: docRef.id };
  } catch (error: any) {
    console.error('Error saving order:', error);
    return { error: error.message };
  }
};

// Get user orders with caching
// Cache TTL: 1 minute to reduce Firebase reads
// When user places an order, cache is invalidated

export const getUserOrders = async (userId: string, useCache = true): Promise<Order[]> => {
  const firestore = db;
  if (!isFirebaseConfigured || !firestore) {
    return [];
  }

  const cacheKey = `userOrders:${userId}`;

  // Check cache first
  if (useCache) {
    const cached = orderCache.get<Order[]>(cacheKey);
    if (cached) {
      console.log('[Cache] Returning cached user orders');
      return cached;
    }
  }

  // Deduplicate concurrent requests
  return dedupeRequest(cacheKey, async () => {
    try {
      // Refresh token to ensure it's valid for security rules
      if (auth?.currentUser) {
        await auth.currentUser.getIdToken(true);
      }

      const q = query(
        collection(firestore, 'orders'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const orders: Order[] = [];

      querySnapshot.forEach((doc) => {
        orders.push({
          id: doc.id,
          ...doc.data(),
        } as Order);
      });

      // Cache the result
      orderCache.set(cacheKey, orders);
      console.log('[Firebase] Fetched user orders from Firestore');

      return orders;
    } catch (error) {
      console.error('Error fetching orders:', error);
      return [];
    }
  });
};

export const getOrderByReference = async (reference: string, userId: string): Promise<Order | null> => {
  const firestore = db;
  if (!isFirebaseConfigured || !firestore) {
    return null;
  }

  // This one doesn't need heavy caching since it's a specific lookup
  // But we can use deduplication to prevent multiple calls
  const cacheKey = `orderRef:${reference}:${userId}`;

  const cached = orderCache.get<Order>(cacheKey);
  if (cached) {
    return cached;
  }

  return dedupeRequest(cacheKey, async () => {
    try {
      // Refresh token to ensure it's valid for security rules
      if (auth?.currentUser) {
        await auth.currentUser.getIdToken(true);
      }

      const q = query(
        collection(firestore, 'orders'),
        where('paymentReference', '==', reference),
        where('userId', '==', userId)
      );

      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        const order = {
          id: doc.id,
          ...doc.data(),
        } as Order;
        
        // Cache for a shorter time (30 seconds)
        orderCache.set(cacheKey, order);
        return order;
      }

      return null;
    } catch (error) {
      console.error('Error fetching order:', error);
      return null;
    }
  });
};

// Get all orders with pagination (for admin)
// This is more efficient than fetching all at once
export interface PaginatedOrdersResult {
  orders: Order[];
  lastDoc: QueryDocumentSnapshot | null;
  hasMore: boolean;
  totalCount: number;
}

export const getAllOrders = async (
  pageSize = 20,
  lastDocSnapshot?: QueryDocumentSnapshot | null,
  useCache = true
): Promise<PaginatedOrdersResult> => {
  const firestore = db;
  if (!isFirebaseConfigured || !firestore) {
    return { orders: [], lastDoc: null, hasMore: false, totalCount: 0 };
  }

  // Generate cache key based on pagination state
  const cacheKey = lastDocSnapshot 
    ? `allOrders:page:${pageSize}:${lastDocSnapshot.id}`
    : `allOrders:page:${pageSize}:start`;

  // Only use cache for first page
  if (useCache && !lastDocSnapshot) {
    const cached = orderCache.get<PaginatedOrdersResult>(cacheKey);
    if (cached) {
      console.log('[Cache] Returning cached all orders');
      return cached;
    }
  }

  return dedupeRequest(cacheKey, async () => {
    try {
      // Refresh token to ensure it's valid for security rules
      if (auth?.currentUser) {
        await auth.currentUser.getIdToken(true);
      }

      let q;
      
      if (lastDocSnapshot) {
        // Paginated query
        q = query(
          collection(firestore, 'orders'),
          orderBy('createdAt', 'desc'),
          startAfter(lastDocSnapshot),
          limit(pageSize)
        );
      } else {
        // First page
        q = query(
          collection(firestore, 'orders'),
          orderBy('createdAt', 'desc'),
          limit(pageSize)
        );
      }

      const querySnapshot = await getDocs(q);
      const orders: Order[] = [];

      querySnapshot.forEach((doc) => {
        orders.push({
          id: doc.id,
          ...doc.data(),
        } as Order);
      });

      const lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1] || null;
      const hasMore = querySnapshot.docs.length === pageSize;

      const result: PaginatedOrdersResult = {
        orders,
        lastDoc,
        hasMore,
        totalCount: orders.length
      };

      // Cache first page only
      if (!lastDocSnapshot) {
        orderCache.set(cacheKey, result);
        console.log('[Firebase] Fetched first page of orders from Firestore');
      }

      return result;
    } catch (error) {
      console.error('Error fetching all orders:', error);
      return { orders: [], lastDoc: null, hasMore: false, totalCount: 0 };
    }
  });
};

// Legacy function for backwards compatibility - fetches all orders (use with caution)
export const getAllOrdersLegacy = async (): Promise<Order[]> => {
  const firestore = db;
  if (!isFirebaseConfigured || !firestore) {
    return [];
  }

  const cacheKey = 'allOrders:legacy';
  
  const cached = orderCache.get<Order[]>(cacheKey);
  if (cached) {
    return cached;
  }

  try {
    const q = query(
      collection(firestore, 'orders'),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const orders: Order[] = [];

    querySnapshot.forEach((doc) => {
      orders.push({
        id: doc.id,
        ...doc.data(),
      } as Order);
    });

    orderCache.set(cacheKey, orders);
    return orders;
  } catch (error) {
    console.error('Error fetching all orders:', error);
    return [];
  }
};

// Update order status (for admin)
export const updateOrderStatus = async (
  orderId: string,
  status: OrderStatus
): Promise<{ success: boolean; error?: string }> => {
  const firestore = db;
  if (!isFirebaseConfigured || !firestore) {
    return { success: false, error: 'Firebase is not configured' };
  }

  try {
    // Refresh token to ensure it's valid for security rules
    if (auth?.currentUser) {
      await auth.currentUser.getIdToken(true);
    }
    
    const orderRef = doc(firestore, 'orders', orderId);
    
    // Auto-set actual delivery date when status changes to delivered
    const updateData: any = { status };
    if (status === 'delivered') {
      updateData.actualDeliveryDate = serverTimestamp();
      updateData.deliveryFailed = false;
    }
    
    await updateDoc(orderRef, updateData);
    
    // Invalidate caches after status update
    orderCache.invalidate('allOrders');
    orderCache.invalidate('userOrders');
    
    console.log('[Cache] Invalidated order caches after status update');
    return { success: true };
  } catch (error: any) {
    console.error('Error updating order status:', error);
    return { success: false, error: error.message };
  }
};

// Update dispatch info (driver, estimated delivery, etc.)
export const updateDispatchInfo = async (
  orderId: string,
  dispatchData: {
    driverName?: string;
    driverPhone?: string;
    estimatedDelivery?: Date;
  }
): Promise<{ success: boolean; error?: string }> => {
  const firestore = db;
  if (!isFirebaseConfigured || !firestore) {
    return { success: false, error: 'Firebase is not configured' };
  }

  try {
    // Refresh token to ensure it's valid for security rules
    if (auth?.currentUser) {
      await auth.currentUser.getIdToken(true);
    }
    
    const orderRef = doc(firestore, 'orders', orderId);
    const updateData: any = {};
    
    if (dispatchData.driverName !== undefined) {
      updateData.driverName = dispatchData.driverName;
    }
    if (dispatchData.driverPhone !== undefined) {
      updateData.driverPhone = dispatchData.driverPhone;
    }
    if (dispatchData.estimatedDelivery !== undefined) {
      updateData.estimatedDelivery = dispatchData.estimatedDelivery;
    }
    
    await updateDoc(orderRef, updateData);
    
    // Invalidate caches
    orderCache.invalidate('allOrders');
    orderCache.invalidate('userOrders');
    
    return { success: true };
  } catch (error: any) {
    console.error('Error updating dispatch info:', error);
    return { success: false, error: error.message };
  }
};

// Mark order as dispatched (sets dispatch date)
export const markOrderDispatched = async (
  orderId: string
): Promise<{ success: boolean; error?: string }> => {
  const firestore = db;
  if (!isFirebaseConfigured || !firestore) {
    return { success: false, error: 'Firebase is not configured' };
  }

  try {
    // Refresh token to ensure it's valid for security rules
    if (auth?.currentUser) {
      await auth.currentUser.getIdToken(true);
    }
    
    const orderRef = doc(firestore, 'orders', orderId);
    await updateDoc(orderRef, {
      status: 'dispatched',
      dispatchDate: serverTimestamp()
    });
    
    orderCache.invalidate('allOrders');
    orderCache.invalidate('userOrders');
    
    return { success: true };
  } catch (error: any) {
    console.error('Error marking order as dispatched:', error);
    return { success: false, error: error.message };
  }
};

// Cancel dispatch (undo dispatched status)
export const cancelDispatch = async (
  orderId: string
): Promise<{ success: boolean; error?: string }> => {
  const firestore = db;
  if (!isFirebaseConfigured || !firestore) {
    return { success: false, error: 'Firebase is not configured' };
  }

  try {
    // Refresh token to ensure it's valid for security rules
    if (auth?.currentUser) {
      await auth.currentUser.getIdToken(true);
    }
    
    const orderRef = doc(firestore, 'orders', orderId);
    await updateDoc(orderRef, {
      status: 'pending',
      dispatchDate: null,
      driverName: null,
      driverPhone: null
    });
    
    orderCache.invalidate('allOrders');
    orderCache.invalidate('userOrders');
    
    return { success: true };
  } catch (error: any) {
    console.error('Error canceling dispatch:', error);
    return { success: false, error: error.message };
  }
};

// Mark cash order as paid (for admin)
export const markCashOrderAsPaid = async (
  orderId: string
): Promise<{ success: boolean; error?: string }> => {
  const firestore = db;
  if (!isFirebaseConfigured || !firestore) {
    return { success: false, error: 'Firebase is not configured' };
  }

  try {
    const orderRef = doc(firestore, 'orders', orderId);
    await updateDoc(orderRef, { 
      status: 'confirmed' // Update status only - payment confirmed
    });
    
    // Invalidate caches after update
    orderCache.invalidate('allOrders');
    orderCache.invalidate('userOrders');
    
    console.log('[Cache] Invalidated order caches after cash payment');
    return { success: true };
  } catch (error: any) {
    console.error('Error marking cash order as paid:', error);
    return { success: false, error: error.message };
  }
};

// Cancel/Reverse cash payment (for admin)
export const cancelCashPayment = async (
  orderId: string
): Promise<{ success: boolean; error?: string }> => {
  const firestore = db;
  if (!isFirebaseConfigured || !firestore) {
    return { success: false, error: 'Firebase is not configured' };
  }

  try {
    const orderRef = doc(firestore, 'orders', orderId);
    await updateDoc(orderRef, { 
      status: 'pending' // Revert status only - payment cancelled
    });
    
    // Invalidate caches after update
    orderCache.invalidate('allOrders');
    orderCache.invalidate('userOrders');
    
    console.log('[Cache] Invalidated order caches after canceling cash payment');
    return { success: true };
  } catch (error: any) {
    console.error('Error canceling cash payment:', error);
    return { success: false, error: error.message };
  }
};

// Export cache for manual invalidation if needed
export const invalidateOrderCache = () => {
  orderCache.invalidate('userOrders');
  orderCache.invalidate('allOrders');
  orderCache.clear();
  console.log('[Cache] All order caches cleared');
};
