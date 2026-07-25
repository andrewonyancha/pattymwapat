'use client';

import { useCartStore } from '@/app/lib/cartStore';
import { X, Trash2, ChevronRight, ShoppingBag } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { GiShoppingCart } from "react-icons/gi";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: Props) {
  const { 
    items, 
    removeItem, 
    updateQuantity, 
    getTotalItems, 
    getTotalPrice 
  } = useCartStore();

  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();

  // Prevent hydration mismatch by only rendering cart content after mount
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Show consistent placeholder during SSR and before mount
  const displayTotalItems = mounted ? totalItems : 0;
  const displayTotalPrice = mounted ? totalPrice : 0;
  const displayItems = mounted ? items : [];

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[9998] bg-stone-900/40 backdrop-blur-sm transition-opacity duration-500 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 bottom-0 z-[9999] w-full max-w-[450px] bg-white shadow-2xl transform transition-transform duration-500 ease-[cubic-bezier(0.32,0,0.67,0)] ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header - Minimal & Elegant */}
          <div className="flex items-center justify-between px-8 py-6 border-b border-stone-100">
            <div className="flex items-baseline gap-2">
              <h2 className="text-xl font-light tracking-widest uppercase text-stone-900">
                Your Bag
              </h2>
              <span className="text-xs text-stone-400 font-medium">({displayTotalItems} items)</span>
            </div>
            <button
              onClick={onClose}
              className="group p-2 -mr-2 transition-colors"
              aria-label="Close cart"
            >
              <X size={24} className="text-stone-400 group-hover:text-stone-900 transition-colors" />
            </button>
          </div>

          {/* Items Container */}
          <div className="flex-1 overflow-y-auto px-8 py-6 scrollbar-hide">
            {displayItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="w-16 h-16 bg-stone-50  flex items-center justify-center mb-4">
                  <GiShoppingCart size={24} className="text-stone-300" />
                </div>
                <p className="text-stone-900 font-light uppercase tracking-widest mb-2">Empty Bag</p>
                <button 
                  onClick={onClose}
                  className="text-sm text-stone-400 hover:text-stone-900 underline underline-offset-4 transition-colors"
                >
                  Continue Browsing
                </button>
              </div>
            ) : (
              <div className="space-y-8">
                {displayItems.map((item) => (
                  <div key={item.cartItemId} className="group flex gap-6">
                    {/* Image - Subtle border and ratio */}
                    <div className="relative w-24 aspect-[3/2] flex-shrink-0 bg-stone-50 overflow-hidden">
                      <Image
                        src={item.product.image || `/images/${item.product.slug}.jpg`}
                        alt={item.product.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 flex flex-col py-1">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="text-sm font-medium uppercase tracking-wider text-stone-900 leading-tight">
                          {item.product.name}
                        </h3>
                        <button
                          onClick={() => removeItem(item.cartItemId)}
                          className="text-red-600 hover:text-red-800 transition-colors"
                          aria-label="Remove item"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      
                      <p className="text-xs text-stone-400 mb-auto">
                        {item.selectedVariant 
                          ? `${item.selectedVariant.size} – KSh ${item.selectedVariant.price.toLocaleString()}` 
                          : `Ksh ${item.product.price ?? 'N/A'} / ${item.product.unit ?? ''}`}
                      </p>

                      <div className="flex items-center justify-between mt-4">
                        {/* Elegant Quantity Picker */}
                        <div className="flex items-center border border-stone-200 px-2 py-1">
                          <button
                            onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                            className="w-6 h-6 flex items-center justify-center text-stone-400 hover:text-stone-900 transition-colors"
                          >
                            −
                          </button>
                          <span className="w-8 text-center text-xs font-medium text-stone-800">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                            className="w-6 h-6 flex items-center justify-center text-stone-400 hover:text-stone-900 transition-colors"
                          >
                            +
                          </button>
                        </div>
                        
                        <span className="text-sm font-medium text-stone-900">
                          KSh {((item.selectedVariant ? item.selectedVariant.price : (item.product.price ?? 0)) * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer - High Contrast & Clean */}
          {displayItems.length > 0 && (
            <div className="px-8 pt-6 pb-10 border-t border-stone-100 bg-stone-50/50">
              <div className="space-y-2 mb-6">
                <div className="flex justify-between text-xs uppercase tracking-widest text-stone-400">
                  <span>Subtotal</span>
                  <span>KSh {displayTotalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-base uppercase tracking-[0.2em] font-light text-stone-900">Total</span>
                  <span className="text-xl font-medium text-stone-900">KSh {displayTotalPrice.toLocaleString()}</span>
                </div>
                <p className="text-[10px] text-stone-400 italic">Shipping and taxes calculated at checkout.</p>
              </div>

              <Link href="/checkout" onClick={onClose}>
                <button className="group relative w-full bg-blue-700 text-white py-4 px-6 overflow-hidden transition-all duration-300 hover:bg-blue-800">
                  <div className="flex items-center justify-center gap-2 text-xs uppercase tracking-[0.3em] font-bold">
                    Checkout Now
                    <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}