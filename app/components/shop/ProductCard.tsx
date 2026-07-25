'use client';

import Link from 'next/link';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import Image from 'next/image';
import { useState } from 'react';
import AddToCartButton from './AddToCartButton';
import { Product, ProductVariant, ProductCategory } from '@/app/shop/products';
import { ChevronRight, Expand } from 'lucide-react';

type Props = {
  product: Product;
  view?: 'grid' | 'list';
};

export default function ProductCard({ product, view = 'grid' }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  
  // Get current page from URL to preserve pagination when navigating to product
  // Only include page param if it's not page 1 (to avoid unnecessary query params)
  const currentPage = searchParams.get('page');
  
  // State for selected variant (if any)
  // Pre-select first variant for categories with variants
  const [selectedVariant, setSelectedVariant] = useState<
    ProductVariant | null
  >(() => {
    if (product.variants && product.variants.length > 0) {
      return product.variants[0];
    }
    return null;
  });

  // Build detail link with pagination and variant info
  const getDetailLink = (variantSize?: string) => {
    const basePath = `/shop/${product.slug}`;
    const params = new URLSearchParams();
    
    // Add page if not page 1
    if (currentPage && currentPage !== '1') {
      params.set('page', currentPage);
    }
    
    // Add from path
    params.set('from', pathname);
    
    // Add selected variant size if any
    if (variantSize) {
      params.set('variant', variantSize);
    }
    
    const queryString = params.toString();
    return queryString ? `${basePath}?${queryString}` : basePath;
  };
  
  const detailLink = getDetailLink();
  const detailLinkWithVariant = selectedVariant ? getDetailLink(selectedVariant.size) : null;

  const handleVariantChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const size = e.target.value;
    const variant = product.variants?.find(v => v.size === size);
    if (variant) setSelectedVariant(variant);
  };

  // Determine display price and unit
  // For products with variants where no variant is selected, show "Select size"
  const hasVariants = product.variants && product.variants.length > 0;
  const showSelectPrompt = hasVariants && !selectedVariant;
  const displayPrice = selectedVariant ? selectedVariant.price : (product.price ?? 0);
  const displayUnit = selectedVariant ? selectedVariant.size : (product.unit ?? '');

  if (view === 'list') {
    return (
      <div className="group flex flex-row items-stretch gap-4 sm:gap-10 py-8 border-b border-stone-100 last:border-0 overflow-hidden">
        {/* Image with overlay */}
        <div className="relative w-32 sm:w-40 aspect-[3/2] bg-stone-50 overflow-hidden flex-shrink-0">
          <Image
            src={product.image || `/images/${product.slug}.jpg`}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 128px, 160px"
            className="object-cover transition-transform duration-1000 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/5" />
          <Link
            href={detailLinkWithVariant || detailLink}
            className="absolute inset-0 sm:hidden"
            aria-label={`View ${product.name} details`}
          />
        </div>

        <div className="flex-1 flex flex-col justify-between py-1 min-w-0 max-w-[calc(100%-theme(spacing.28)-theme(spacing.4))] sm:max-w-[calc(100%-theme(spacing.52)-theme(spacing.10))]">
          <div className="space-y-1">
            <p className="text-[9px] sm:text-[10px]  tracking-[0.3em] text-stone-400 truncate">
              our Collection
            </p>
            <Link
              href={detailLinkWithVariant || detailLink}
              className="block text-base font-light tracking-tight text-stone-900 hover:text-stone-600 transition-colors leading-tight break-words"
            >
              {product.name}
            </Link>
            {product.description && (
              <p className="text-[11px] sm:text-[12px] text-stone-500 line-clamp-2 font-light leading-relaxed">
                {product.description}
              </p>
            )}
            <p className="text-[10px] text-stone-400  tracking-widest sm:hidden">
              {displayUnit}
            </p>
          </div>

          <div className="flex flex-col gap-4">
            {/* Variant selector for list view (if any) */}
            {product.variants && product.variants.length > 0 && (
              <select
                value={selectedVariant?.size ?? ''}
                onChange={handleVariantChange}
                className="w-auto min-w-[120px] text-xs border border-stone-200 p-1 bg-white"
              >
                {!selectedVariant && <option value="" disabled>Select size</option>}
                {product.variants.map(v => (
                  <option key={v.size} value={v.size}>
                    {v.size} – Ksh.{v.price}
                  </option>
                ))}
              </select>
            )}

            <div className="flex items-center">
              <div className="w-[180px] flex-shrink-0">
                <AddToCartButton
                  product={product}
                  selectedVariant={selectedVariant}
                  variant="minimal"
                />
              </div>

              
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── GRID VIEW ────────────────────────────────────────────────
  return (
    <div className="group relative flex flex-col bg-white">
      <Link
        href={detailLinkWithVariant || detailLink}
        className="relative aspect-[4/5] bg-stone-50 overflow-hidden mb-4 block"
        prefetch={false}
      >
        <Image
          src={product.image || `/images/${product.slug}.jpg`}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110"
          priority={false}
        />
        <div className="absolute inset-0 bg-black/5" />

        {/* Buttons container */}
        <div
          className={`
            absolute md:bottom-4 bottom-0 md:left-4 left-0 md:right-4 right-0
            sm:translate-y-4 sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100
            translate-y-0 opacity-100
            transition-all duration-300
            pointer-events-auto
          `}
          onClick={(e) => e.stopPropagation()}
        >
          {/* If product has variants, show size selector above button */}
          {product.variants && product.variants.length > 0 && (
            <div className="mb-2">
              <select
                value={selectedVariant?.size ?? ''}
                onChange={handleVariantChange}
                className="w-auto min-w-[120px] text-xs border border-stone-200 p-1 
                 bg-white/90 backdrop-blur-sm"
                onClick={(e) => e.stopPropagation()}
              >
                {!selectedVariant && <option value="" disabled>Select size</option>}
                {product.variants.map(v => (
                  <option key={v.size} value={v.size}>
                    {v.size} – Ksh.{v.price}
                  </option>
                ))}
              </select>
            </div>
          )}
          <AddToCartButton product={product} selectedVariant={selectedVariant} />
        </div>

        {/* Expand button */}
        <div
          className={`
            absolute top-4 right-4
            hidden sm:block
            sm:opacity-0 sm:group-hover:opacity-100
            transition-opacity duration-300
            pointer-events-auto
          `}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => router.push(detailLink)}
            className="block p-2 bg-white/90 backdrop-blur-md hover:bg-white transition-colors"
            aria-label={`View ${product.name} details`}
          >
            <Expand size={18} className="text-stone-800" />
          </button>
        </div>
      </Link>

      <div className="flex flex-col items-center text-center space-y-1">
        <Link
          href={detailLinkWithVariant || detailLink}
          className="text-sm font-light tracking-wide text-stone-800 hover:text-stone-500 transition-colors "
        >
          {product.name}
        </Link>
        {product.description && (
          <p className="text-[11px] sm:text-[12px] text-stone-500 line-clamp-2 font-light leading-relaxed">
            {product.description}
          </p>
        )}
      </div>
    </div>
  );
}