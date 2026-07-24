'use client';

import { useSearchParams, useRouter } from 'next/navigation'; // add useRouter
import { useState, useEffect, useMemo, Suspense } from 'react';
import { products as staticProducts } from './products';
import { getDynamicProductsAll, Product as FirebaseProduct } from '../lib/firebase/products';
import CategoryFilter from '@/app/components/shop/CategoryFilter';
import ViewToggle from '@/app/components/shop/ViewToggle';
import ProductCard from '@/app/components/shop/ProductCard';
import { Loader2 } from 'lucide-react';

export const dynamic = 'force-dynamic';

const ITEMS_PER_PAGE = 20;

function ShopContent() {
  const router = useRouter(); // new
  const searchParams = useSearchParams();
  const category = searchParams.get('category') || 'All';
  const subcategory = searchParams.get('subcategory') || '';
  const view = (searchParams.get('view') || 'grid') as 'grid' | 'list';
  const searchQuery = searchParams.get('search') || '';
  const pageParam = searchParams.get('page');

  // State for dynamic products and pagination
  const [dynamicProducts, setDynamicProducts] = useState<FirebaseProduct[]>([]);
  const [loading, setLoading] = useState(true);
  // Initialize currentPage from URL params
  const [currentPage, setCurrentPage] = useState(() => {
    return pageParam ? parseInt(pageParam, 10) || 1 : 1;
  });

  // Fetch dynamic products on mount
  useEffect(() => {
    const fetchDynamicProducts = async () => {
      setLoading(true);
      try {
        const products = await getDynamicProductsAll(true);
        setDynamicProducts(products);
      } catch (error) {
        console.error('Error fetching dynamic products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDynamicProducts();
  }, []);

  // Sync currentPage with URL's page parameter (for back/forward navigation)
  useEffect(() => {
    const page = pageParam ? parseInt(pageParam, 10) : 1;
    setCurrentPage(page);
  }, [pageParam]);

  // Track initial values to detect actual changes
  const [initialValues, setInitialValues] = useState({ category, subcategory, searchQuery });
  
  // Track whether a page param existed when category was first selected
  const [hadPageParamWhenCategoryChanged, setHadPageParamWhenCategoryChanged] = useState(false);

  // Reset to page 1 when category, subcategory or search actually changes
  useEffect(() => {
    // Only reset if we've captured initial values and the filter actually changed
    if (initialValues.category !== undefined) {
      const categoryChanged = category !== initialValues.category;
      const subcategoryChanged = subcategory !== initialValues.subcategory;
      const searchChanged = searchQuery !== initialValues.searchQuery;
      
      if (categoryChanged || subcategoryChanged || searchChanged) {
        const currentPageInUrl = pageParam ? parseInt(pageParam, 10) : 1;
        
        // Only reset to page 1 if there was NO page parameter originally
        if (currentPageInUrl !== 1 && !hadPageParamWhenCategoryChanged) {
          const params = new URLSearchParams(searchParams.toString());
          params.set('page', '1');
          router.replace(`?${params.toString()}`, { scroll: false });
        }
        
        // After category/search changes, update the flag for the next change
        setHadPageParamWhenCategoryChanged(!!pageParam);
      }
    } else {
      // Capture initial values on first render
      setInitialValues({ category, subcategory, searchQuery });
      // Record whether page param exists on initial load
      setHadPageParamWhenCategoryChanged(!!pageParam);
    }
  }, [category, subcategory, searchQuery, initialValues, pageParam, router, searchParams, hadPageParamWhenCategoryChanged]);

  // Combine static and dynamic products (same as before)
  const allProducts = useMemo(() => {
    const staticWithFlag = staticProducts.map(p => ({ ...p, isStatic: true }));
    const dynamicWithFlag = dynamicProducts.map(p => ({ ...p, isStatic: false }));
    const productMap = new Map<string, FirebaseProduct | typeof staticWithFlag[0]>();
    staticWithFlag.forEach(p => productMap.set(p.id, p));
    dynamicWithFlag.forEach(p => productMap.set(p.id, p));
    return Array.from(productMap.values());
  }, [dynamicProducts]);

  // Filter products with subcategory support
  const filteredProducts = useMemo(() => {
    let result = category === 'All'
      ? allProducts
      : allProducts.filter((p) => p.category === category);

    // Apply subcategory filter if present
    if (subcategory && result.length > 0) {
      result = result.filter((p) => p.subcategory === subcategory);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query) ||
          (product.subcategory && product.subcategory.toLowerCase().includes(query))
      );
    }
    return result;
  }, [allProducts, category, subcategory, searchQuery]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  const handlePageChange = (page: number) => {
    // Update URL with new page (creates history entry)
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    router.push(`?${params.toString()}`, { scroll: false });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-7xl mx-auto px-1 py-4">
      {/* Search Results Header */}
      {searchQuery && (
        <div className="mb-6">
          <h1 className="text-xl font-bold text-gray-800">
            Search Results for "{searchQuery}"
          </h1>
          <p className="text-gray-600 mt-1">
            Found {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
          </p>
        </div>
      )}

      {/* Controls row */}
      <div className="flex items-center justify-between mb-4">
        <div className="md:hidden">
          <CategoryFilter mobileMode />
        </div>
        <div className="hidden md:block">
          <CategoryFilter />
        </div>
        <ViewToggle />
      </div>

      {/* Loading indicator */}
      {loading && (
        <div className="flex items-center justify-center py-4 mb-4">
          <Loader2 className="h-5 w-5 animate-spin text-blue-600 mr-2" />
          <span className="text-sm text-gray-500">Loading additional products...</span>
        </div>
      )}

      {/* Products */}
      {paginatedProducts.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-500 text-lg mb-2">
            {searchQuery
              ? `No products found for "${searchQuery}"`
              : 'No products found.'}
          </p>
          {searchQuery && (
            <p className="text-gray-400">
              Try different keywords or browse our categories
            </p>
          )}
        </div>
      ) : view === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
          {paginatedProducts.map((p) => (
            <ProductCard key={p.id} product={p} view="grid" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
          {paginatedProducts.map((p) => (
            <ProductCard key={p.id} product={p} view="list" />
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            Previous
          </button>
          
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum: number;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              
              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`w-10 h-10 text-sm font-medium transition-colors ${
                    currentPage === pageNum
                      ? 'bg-blue-700 text-white'
                      : 'border border-gray-300 hover:bg-gray-100'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>
          
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

function ShopLoading() {
  return (
    <div className="max-w-7xl mx-auto px-1 py-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="bg-gray-200  h-48 animate-pulse" />
        ))}
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<ShopLoading />}>
      <ShopContent />
    </Suspense>
  );
}