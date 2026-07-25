'use client';

import { Product, ProductVariant, ProductCategory } from '../../shop/products';
import { Plus, Minus } from 'lucide-react';
import { GiShoppingCart } from 'react-icons/gi';
import { useState, useEffect } from 'react';

type Props = {
  product: Product;
  selectedVariant?: ProductVariant | null; // optional variant
  variant?: 'full' | 'minimal';
};

const WHATSAPP_NUMBER = '254790407508'; // Mwapat Autospares WhatsApp number

export default function AddToCartButton({ product, selectedVariant: initialSelectedVariant, variant = 'full' }: Props) {
  // If product has variants but no initial selectedVariant, manage selection internally
  const [internalSelectedVariant, setInternalSelectedVariant] = useState<ProductVariant | null>(() => {
    if (product.variants && product.variants.length > 0) {
      return product.variants[0];
    }
    return null;
  });
  
  // Use internal state if no initial variant provided, otherwise use provided variant
  const selectedVariant = initialSelectedVariant !== undefined ? initialSelectedVariant : internalSelectedVariant;
  
  // Handler for when this component manages its own variant selection
  const handleInternalVariantChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const size = e.target.value;
    const variant = product.variants?.find(v => v.size === size);
    if (variant) setInternalSelectedVariant(variant);
  };
  
  // Check if product has variants but none selected (user needs to select size)
  const hasVariants = product.variants && product.variants.length > 0;
  const needsVariant = hasVariants && !selectedVariant;
  const showOwnSelector = hasVariants && !selectedVariant && initialSelectedVariant === undefined;
  
  // Handle add to cart - redirect to WhatsApp
  const handleAddClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (needsVariant) {
      // Can't add without selecting a variant
      return;
    }
    
    const displayPrice = selectedVariant ? selectedVariant.price : (product.price ?? 0);
    const displayUnit = selectedVariant ? selectedVariant.size : (product.unit ?? '');
    const itemName = selectedVariant 
      ? `${product.name} (${selectedVariant.size})` 
      : product.name;
    
    const message = `Hello! I'm interested in ordering:\n\n${itemName}\nPrice: KSh ${displayPrice.toLocaleString()} ${displayUnit}\n\nPlease confirm availability and delivery details.`;
    
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`, '_blank');
  };

  return (
    <div className="flex flex-col gap-2">
      {/* Show variant selector if product has variants but none selected */}
      {showOwnSelector && (
        <select
          onChange={handleInternalVariantChange}
          className="w-full text-sm border border-stone-200 p-2  bg-white text-stone-900"
          value=""
        >
          <option value="" disabled>Select size</option>
          {product.variants!.map((v) => (
            <option key={v.size} value={v.size}>
              {v.size} – KSh {v.price.toLocaleString()}
            </option>
          ))}
        </select>
      )}
      
      <button
        onClick={handleAddClick}
        className={`
          flex items-center justify-center gap-3 transition-all duration-500  tracking-[0.1em] text-sm
          active:scale-95 active:bg-blue-800
          ${variant === 'minimal'
            ? 'md:py-3 py-2 px-10 bg-transparent border border-blue-700 text-blue-700 active:bg-blue-700 active:text-white hover:bg-blue-700/90 hover:text-white'
            : 'w-full md:py-4 py-2 bg-blue-700/90 text-white active:bg-blue-800 hover:bg-blue-800 '}
          ${needsVariant ? 'opacity-50 cursor-not-allowed' : ''}
          touch-manipulation
        `}
        aria-label={`Order ${product.name} on WhatsApp`}
        disabled={needsVariant}
      >
        <GiShoppingCart size={16} />
        <span>{variant === 'minimal' ? 'Order' : 'Order Now'}</span>
      </button>
    </div>
  );
}
