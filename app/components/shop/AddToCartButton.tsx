'use client';

import { useCartStore } from '../../lib/cartStore';
import { Product, ProductVariant, ProductCategory } from '../../shop/products';
import { Plus, Minus } from 'lucide-react';
import { GiShoppingCart } from 'react-icons/gi';
import { useState, useEffect } from 'react';

type Props = {
  product: Product;
  selectedVariant?: ProductVariant | null; // optional variant
  variant?: 'full' | 'minimal';
};

export default function AddToCartButton({ product, selectedVariant: initialSelectedVariant, variant = 'full' }: Props) {
  // If product has variants but no initial selectedVariant, manage selection internally
  // This handles the case where user must select a size (e.g., Engine Parts with variants)
  const [internalSelectedVariant, setInternalSelectedVariant] = useState<ProductVariant | null>(() => {
    if (product.variants && product.variants.length > 0) {
      // Pre-select first variant for products with variants
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
  
  // Compute a unique cart item ID – if variant exists, combine product ID and variant size
  const cartItemId = selectedVariant ? `${product.id}-${selectedVariant.size}` : product.id;

  const { addItem, updateQuantity, removeItem } = useCartStore();
  const item = useCartStore((s) => s.items.find((i) => i.cartItemId === cartItemId));
  const qty = item?.quantity || 0;
  const [isMobile, setIsMobile] = useState(false);

  // Prevent hydration mismatch by only rendering cart state after mount
  const [mounted, setMounted] = useState(false);
  const [displayQty, setDisplayQty] = useState(0);

  useEffect(() => {
    setMounted(true);
    setDisplayQty(qty);
  }, [qty]);

  // Detect mobile devices
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleDecrease = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (displayQty <= 1) {
      removeItem(cartItemId);
    } else {
      updateQuantity(cartItemId, displayQty - 1);
    }
  };

  // Check if product has variants but none selected (user needs to select size)
  const hasVariants = product.variants && product.variants.length > 0;
  const needsVariant = hasVariants && !selectedVariant;
  const showOwnSelector = hasVariants && !selectedVariant && initialSelectedVariant === undefined;
  
  // Handle add to cart - prevent if no variant selected
  const handleAddClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (needsVariant) {
      // Can't add without selecting a variant
      return;
    }
    
    if (displayQty === 0) {
      addItem(product, 1, cartItemId, selectedVariant);
    } else {
      updateQuantity(cartItemId, displayQty + 1);
    }
  };

  if (mounted && displayQty > 0) {
    return (
      <div className="relative flex items-center justify-between bg-blue-700/90 text-white md:py-4 py-2 w-full overflow-hidden ring-1 ring-white/10">
        <button
          onClick={handleDecrease}
          className="absolute inset-y-0 left-0 w-1/4 active:bg-blue-800 hover:bg-blue-800 transition-colors touch-manipulation z-10"
          aria-label="Decrease quantity"
        />
        <div className="w-1/4 flex items-center justify-center border-r border-white/10 pointer-events-none z-20">
          <Minus size={14} />
        </div>
        <span className="flex-1 text-center text-sm tracking-[0.1em] font-medium uppercase pointer-events-none select-none z-20">
          {displayQty}
        </span>
        <button
          onClick={handleAddClick}
          className="absolute inset-y-0 right-0 w-1/4 active:bg-blue-800 hover:bg-blue-800 transition-colors touch-manipulation z-10"
          aria-label="Increase quantity"
        />
        <div className="w-1/4 flex items-center justify-center border-l border-white/10 pointer-events-none z-20">
          <Plus size={14} />
        </div>
      </div>
    );
  }

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
          flex items-center justify-center gap-3 transition-all duration-500 uppercase tracking-[0.1em] text-sm
          active:scale-95 active:bg-blue-800
          ${variant === 'minimal'
            ? 'md:py-3 py-2 px-10 bg-transparent border border-blue-700 text-blue-700 active:bg-blue-700 active:text-white hover:bg-blue-700/90 hover:text-white'
            : 'w-full md:py-4 py-2 bg-blue-700/90 text-white active:bg-blue-800 hover:bg-blue-800 '}
          ${needsVariant ? 'opacity-50 cursor-not-allowed' : ''}
          touch-manipulation
        `}
        aria-label={`Add ${product.name} to cart`}
        disabled={needsVariant}
      >
        <GiShoppingCart size={16} />
        <span>{isMobile ? 'Add' : 'Add'}</span>
      </button>
    </div>
  );
}