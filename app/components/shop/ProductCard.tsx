'use client';

import Link from 'next/link';
import { useSearchParams, usePathname } from 'next/navigation';
import Image from 'next/image';
import { useState } from 'react';
import AddToCartButton from './AddToCartButton';
import { Product, ProductVariant } from '@/app/shop/products';

type Props = {
  product: Product;
  view?: 'grid' | 'list';
};

export default function ProductCard({ product, view = 'grid' }: Props) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  
  const currentPage = searchParams.get('page');
  
  // Pre-select first variant for products with variants
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(() => {
    if (product.variants && product.variants.length > 0) {
      return product.variants[0];
    }
    return null;
  });

  const getDetailLink = (variantSize?: string) => {
    const basePath = `/shop/${product.slug}`;
    const params = new URLSearchParams();
    
    if (currentPage && currentPage !== '1') {
      params.set('page', currentPage);
    }
    params.set('from', pathname);
    
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

  const hasVariants = product.variants && product.variants.length > 0;
  const displayPrice = selectedVariant ? selectedVariant.price : (product.price ?? 0);
  const displayUnit = selectedVariant ? selectedVariant.size : (product.unit ?? '');

  // Grid View - Simplified
  if (view === 'grid') {
    return (
      <div className="group flex flex-col bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
        <Link href={detailLinkWithVariant || detailLink} className="relative aspect-square bg-gray-50 overflow-hidden">
          <Image
            src={product.image || `/images/${product.slug}.jpg`}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </Link>
        
        <div className="p-3 flex flex-col gap-2">
          <Link href={detailLinkWithVariant || detailLink} className="text-sm font-medium text-gray-900 hover:text-blue-700 line-clamp-2 min-h-[2.5rem]">
            {product.name}
          </Link>
          
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-bold text-blue-700">Ksh {displayPrice.toLocaleString()}</span>
            {displayUnit && <span className="text-xs text-gray-500">/ {displayUnit}</span>}
          </div>

          {hasVariants && (
            <select
              value={selectedVariant?.size ?? ''}
              onChange={handleVariantChange}
              className="w-full text-xs border border-gray-200 rounded-lg p-2 bg-white"
            >
              {product.variants?.map(v => (
                <option key={v.size} value={v.size}>
                  {v.size} - Ksh {v.price.toLocaleString()}
                </option>
              ))}
            </select>
          )}

          <AddToCartButton product={product} selectedVariant={selectedVariant} />
        </div>
      </div>
    );
  }

  // List View - Simplified
  return (
    <div className="group flex flex-row items-center gap-4 py-4 border-b border-gray-100 last:border-0">
      <Link href={detailLinkWithVariant || detailLink} className="relative w-24 h-24 sm:w-32 sm:h-32 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
        <Image
          src={product.image || `/images/${product.slug}.jpg`}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 96px, 128px"
          className="object-cover"
        />
      </Link>

      <div className="flex-1 min-w-0">
        <Link href={detailLinkWithVariant || detailLink} className="text-base font-medium text-gray-900 hover:text-blue-700 line-clamp-2">
          {product.name}
        </Link>
        {product.description && (
          <p className="text-sm text-gray-500 line-clamp-1 mt-1">{product.description}</p>
        )}
        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-lg font-bold text-blue-700">Ksh {displayPrice.toLocaleString()}</span>
          {displayUnit && <span className="text-xs text-gray-500">/ {displayUnit}</span>}
        </div>
      </div>

      <div className="flex-shrink-0">
        {hasVariants && (
          <select
            value={selectedVariant?.size ?? ''}
            onChange={handleVariantChange}
            className="text-xs border border-gray-200 rounded-lg p-2 bg-white mb-2 w-full"
          >
            {product.variants?.map(v => (
              <option key={v.size} value={v.size}>
                {v.size} - Ksh {v.price.toLocaleString()}
              </option>
            ))}
          </select>
        )}
        <AddToCartButton product={product} selectedVariant={selectedVariant} />
      </div>
    </div>
  );
}
