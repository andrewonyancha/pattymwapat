'use client';

import { useSearchParams, useRouter } from 'next/navigation'; // add useRouter
import { useMemo, Suspense, useState, useEffect } from 'react';
import { products } from '../shop/products';
import { getDynamicProductsAll, Product as FirebaseProduct } from '../lib/firebase/products';
import ProductCard from '@/app/components/shop/ProductCard';
import MoreViewToggle from '../components/shop/MoreViewToggle';
import { ChevronLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

const ITEMS_PER_PAGE = 20;

function OtherProductsContent() {
  const router = useRouter(); // new
  const searchParams = useSearchParams();
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
  const [initialValues, setInitialValues] = useState({ searchQuery });

  // Reset to page 1 when search actually changes (not on initial load or back navigation)
  useEffect(() => {
    // Only reset if we've captured initial values and the filter actually changed
    if (initialValues.searchQuery !== undefined) {
      const searchChanged = searchQuery !== initialValues.searchQuery;
      
      if (searchChanged) {
        const currentPageInUrl = pageParam ? parseInt(pageParam, 10) : 1;
        if (currentPageInUrl !== 1) {
          const params = new URLSearchParams(searchParams.toString());
          params.set('page', '1');
          router.replace(`?${params.toString()}`, { scroll: false });
        }
      }
    } else {
      // Capture initial values on first render
      setInitialValues({ searchQuery });
    }
  }, [searchQuery, initialValues, pageParam, router, searchParams]);

  // Combine static and dynamic products
  const allProducts = useMemo(() => {
    const staticWithFlag = products.map(p => ({ ...p, isStatic: true }));
    const dynamicWithFlag = dynamicProducts
      .filter(p => p.category === 'Other')
      .map(p => ({ ...p, isStatic: false }));
    
    const productMap = new Map<string, FirebaseProduct | typeof staticWithFlag[0]>();
    staticWithFlag.forEach(p => productMap.set(p.id, p));
    dynamicWithFlag.forEach(p => productMap.set(p.id, p));
    
    return Array.from(productMap.values());
  }, [dynamicProducts]);

  // Filter products to "Other" and apply search
  const filteredProducts = useMemo(() => {
    let result = allProducts.filter((p) => p.category === 'Other');

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query)
      );
    }
    
    return result;
  }, [allProducts, searchQuery]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  const handlePageChange = (page: number) => {
    // Update URL with new page
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    router.push(`?${params.toString()}`, { scroll: false });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-7xl mx-auto px-1 py-2">
      {/* Page Header */}
      <div className="mb-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase tracking-[0.4em] text-stone-400 font-bold block">
            Category / tools & equipment
          </span>
          <MoreViewToggle />
        </div>
      </div>

      {/* Loading indicator */}
      {loading && (
        <div className="flex items-center justify-center py-4 mb-4">
          <Loader2 className="h-5 w-5 animate-spin text-blue-600 mr-2" />
          <span className="text-sm text-gray-500">Loading additional products...</span>
        </div>
      )}

      {/* Search Results Header */}
      {searchQuery && (
        <div className="mb-2 bg-gray-50 p-4 ">
          <h2 className="text-lg font-semibold text-gray-800">
            Search Results for "{searchQuery}"
          </h2>
          <p className="text-gray-600 mt-1">
            Found {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} in Tools & Equipment
          </p>
        </div>
      )}

      {/* Products */}
      {paginatedProducts.length === 0 ? (
        <div className="text-center bg-gray-50 ">
          <p className="text-gray-500 text-lg mb-2">
            {searchQuery
              ? `No products found for "${searchQuery}" in Tools & Equipment`
              : 'No products currently available in Tools & Equipment.'}
          </p>
          {searchQuery && (
            <p className="text-gray-400">
              Try different keywords or check back later for new additions
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

      {/* Back to all products link */}
      <footer className="mt-12 py-4 border-t border-stone-100">
        <Link
          href="/shop"
          className="group inline-flex items-center gap-4 text-[10px] uppercase tracking-[0.4em] text-stone-400 hover:text-stone-900 transition-all duration-500"
        >
          <div className="w-10 h-10 rounded-full border border-stone-100 flex items-center justify-center group-hover:bg-blue-700 group-hover:border-white transition-all">
            <ChevronLeft size={14} className="group-hover:text-white transition-colors" />
          </div>
          Return to All Collections
        </Link>
      </footer>
    </div>
  );
}

function OtherProductsLoading() {
  return (
    <div className="max-w-7xl mx-auto px-1 py-8">
      <div className="mb-8">
        <div className="h-8 bg-gray-200 rounded w-64 mb-2 animate-pulse" />
        <div className="h-4 bg-gray-200 rounded w-96 mb-4 animate-pulse" />
        <div className="flex items-center justify-between mt-4">
          <div className="h-4 bg-gray-200 rounded w-32 animate-pulse" />
          <div className="h-8 bg-gray-200 rounded w-24 animate-pulse" />
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-gray-200  h-64 animate-pulse" />
        ))}
      </div>
    </div>
  );
}

export default function OtherProductsPage() {
  return (
    <Suspense fallback={<OtherProductsLoading />}>
      <OtherProductsContent />
    </Suspense>
  );
}