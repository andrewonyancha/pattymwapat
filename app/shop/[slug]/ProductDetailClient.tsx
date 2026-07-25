'use client';

import Image from 'next/image';
import AddToCartButton from '@/app/components/shop/AddToCartButton';
import { Product, ProductVariant } from '../../shop/products';
import { ChevronLeft, ShieldCheck, Truck, Leaf } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

type Props = {
  product: Product;
  backHref: string;
  selectedVariant?: ProductVariant | null;
};

export default function ProductDetailClient({ product, backHref, selectedVariant: initialVariant }: Props) {
  const router = useRouter();
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    initialVariant || null
  );

  const handleVariantChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const size = e.target.value;
    const variant = product.variants?.find(v => v.size === size);
    if (variant) setSelectedVariant(variant);
  };

  const displayPrice = selectedVariant ? selectedVariant.price : (product.price ?? 0);
  const displayUnit = selectedVariant ? selectedVariant.size : (product.unit ?? '');

  return (
    <div className="min-h-screen bg-[#FDFDFD] pb-20">
      <div className="max-w-7xl mx-auto py-4 px-2 md:px-4">
        <button
          onClick={() => router.back()}
          className="group inline-flex items-center gap-2 text-[10px]  tracking-[0.3em] text-stone-400 hover:text-stone-900 transition-colors cursor-pointer bg-transparent border-none p-0"
        >
          <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          Back to Collection
        </button>
      </div>

      <div className="max-w-7xl mx-auto md:px-4 px-2">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          
          <div className="lg:col-span-7">
            <div className="relative aspect-[3/2] bg-stone-50 overflow-hidden shadow-sm">
              <Image
                src={product.image || `/images/${product.slug}.jpg`}
                alt={product.name}
                fill
                className="object-cover grayscale-[0.1] hover:grayscale-0 transition-all duration-1000"
                priority
                sizes="(max-width: 1024px) 100vw, 800px"
              />
              <div className="absolute inset-0 bg-black/5 pointer-events-none" />
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col pt-0">
            <div className="mb-0">
              <span className="text-[10px]  tracking-[0.3em] text-stone-400 block mb-1">
                {product.category}
              </span>
              <h1 className="text-3xl md:text-4xl font-light tracking-tight text-stone-900 leading-tight mb-6">
                {product.name}
              </h1>
              
              {product.variants && product.variants.length > 0 && (
                <div className="mb-4">
                  <select
                    id="variant-select"
                    value={selectedVariant?.size ?? ''}
                    onChange={handleVariantChange}
                    className="w-auto min-w-[180px] text-sm border border-stone-200 p-2 rounded bg-white text-stone-900"
                  >
                    {product.variants.map((variant) => (
                      <option key={variant.size} value={variant.size}>
                        {variant.size} – KSh {variant.price.toLocaleString()}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              
              <div className="flex items-baseline gap-3">
                <span className="text-xl font-light text-stone-900">
                  KSh {displayPrice.toLocaleString()}
                </span>
                <span className="text-sm text-stone-400 italic font-serif">
                   {displayUnit}
                </span>
              </div>
            </div>

            <div className="prose prose-stone prose-sm mb-8">
              <p className="text-stone-500 leading-relaxed font-light text-base">
                {product.description || `Premium quality ${product.name} designed for durability and performance. Sourced from trusted manufacturers to ensure reliability and customer satisfaction.`}
              </p>
            </div>

            <div className="mt-auto space-y-6">
              <div className="max-w-md">
                <AddToCartButton product={product} selectedVariant={selectedVariant} />
              </div>
              
              <div className="pt-4 border-t border-stone-100">
                <p className="text-[10px]  tracking-[0.2em] text-stone-400 leading-relaxed">
                  Complimentary delivery on curated orders over KSh 5,000 within Nairobi Metropolitan area.
                </p>
              </div>

              <div className="flex gap-6 pt-2">
                <Feature icon={<ShieldCheck size={18} />} text="Quality Assured" />
                <Feature icon={<Truck size={18} />} text="Fast Delivery" />
                <Feature icon={<Leaf size={18} />} text="Fresh from Farm" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Feature({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-2 text-[10px]  tracking-[0.2em] text-stone-400">
      {icon}
      <span>{text}</span>
    </div>
  );
}