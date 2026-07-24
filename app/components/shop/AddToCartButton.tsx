'use client';

import { useCartStore } from '../../lib/cartStore';
import { Product, ProductVariant } from '../../shop/products';
import { Plus, Minus, ShoppingCart } from 'lucide-react';
import { useState, useEffect } from 'react';

type Props = {
  product: Product;
  selectedVariant?: ProductVariant | null;
};

export default function AddToCartButton({ product, selectedVariant: initialSelectedVariant }: Props) {
  const [internalSelectedVariant, setInternalSelectedVariant] = useState<ProductVariant | null>(() => {
    if (product.variants && product.variants.length > 0) {
      return product.variants[0];
    }
    return null;
  });
  
  const selectedVariant = initialSelectedVariant !== undefined ? initialSelectedVariant : internalSelectedVariant;
  
  const cartItemId = selectedVariant ? `${product.id}-${selectedVariant.size}` : product.id;

  const { addItem, updateQuantity, removeItem } = useCartStore();
  const item = useCartStore((s) => s.items.find((i) => i.cartItemId === cartItemId));
  const qty = item?.quantity || 0;
  const [mounted, setMounted] = useState(false);
  const [displayQty, setDisplayQty] = useState(0);

  useEffect(() => {
    setMounted(true);
    setDisplayQty(qty);
  }, [qty]);

  const handleDecrease = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (displayQty <= 1) {
      removeItem(cartItemId);
    } else {
      updateQuantity(cartItemId, displayQty - 1);
    }
  };

  const hasVariants = product.variants && product.variants.length > 0;
  const needsVariant = hasVariants && !selectedVariant;
  
  const handleAddClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (needsVariant) {
      return;
    }
    
    if (displayQty === 0) {
      addItem(product, 1, cartItemId, selectedVariant);
    } else {
      updateQuantity(cartItemId, displayQty + 1);
    }
  };

  // Show quantity controls when item is in cart
  if (mounted && displayQty > 0) {
    return (
      <div className="flex items-center justify-between bg-blue-700 text-white rounded-lg overflow-hidden">
        <button
          onClick={handleDecrease}
          className="flex-1 py-3 hover:bg-blue-800 transition-colors flex items-center justify-center"
          aria-label="Decrease quantity"
        >
          <Minus size={18} />
        </button>
        <span className="flex-1 text-center text-sm font-bold py-3">
          {displayQty}
        </span>
        <button
          onClick={handleAddClick}
          className="flex-1 py-3 hover:bg-blue-800 transition-colors flex items-center justify-center"
          aria-label="Increase quantity"
        >
          <Plus size={18} />
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {/* Show variant selector if product has variants but none selected */}
      {hasVariants && !selectedVariant && (
        <select
          onChange={(e) => {
            const size = e.target.value;
            const variant = product.variants?.find(v => v.size === size);
            if (variant) setInternalSelectedVariant(variant);
          }}
          className="w-full text-sm border border-gray-200 rounded-lg p-2 bg-white"
          value=""
        >
          <option value="" disabled>Select size</option>
          {product.variants?.map((v) => (
            <option key={v.size} value={v.size}>
              {v.size} – KSh {v.price.toLocaleString()}
            </option>
          ))}
        </select>
      )}
      
      <button
        onClick={handleAddClick}
        className={`
          w-full flex items-center justify-center gap-2 py-3 rounded-lg font-bold text-sm transition-all
          ${needsVariant 
            ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
            : 'bg-blue-700 text-white hover:bg-blue-800 active:scale-[0.98]'}
        `}
        aria-label={`Add ${product.name} to cart`}
        disabled={needsVariant}
      >
        <ShoppingCart size={18} />
        {needsVariant ? 'Select Size' : 'Add to Cart'}
      </button>
    </div>
  );
}
