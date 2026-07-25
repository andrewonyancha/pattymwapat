// lib/cartStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Product, ProductVariant } from '../shop/products'; // adjust path if needed

export interface CartItem {
  product: Product;
  quantity: number;
  cartItemId: string; // unique ID to support variants
  selectedVariant?: ProductVariant | null; // store selected variant info
}

interface CartState {
  items: CartItem[];
  addItem: (product: Product, quantity?: number, cartItemId?: string, selectedVariant?: ProductVariant | null) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  removeItem: (cartItemId: string) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, quantity = 1, cartItemId, selectedVariant) => {
        const itemId = cartItemId || (selectedVariant ? `${product.id}-${selectedVariant.size}` : product.id);
        set((state) => {
          const existing = state.items.find((i) => i.cartItemId === itemId);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.cartItemId === itemId
                  ? { ...i, quantity: i.quantity + quantity }
                  : i
              ),
            };
          }
          return {
            items: [...state.items, { product, quantity, cartItemId: itemId, selectedVariant }],
          };
        });
      },

      updateQuantity: (cartItemId, quantity) => {
        if (quantity < 0) return;
        set((state) => {
          if (quantity === 0) {
            return {
              items: state.items.filter((i) => i.cartItemId !== cartItemId),
            };
          }
          return {
            items: state.items.map((i) =>
              i.cartItemId === cartItemId ? { ...i, quantity } : i
            ),
          };
        });
      },

      removeItem: (cartItemId) => {
        set((state) => ({
          items: state.items.filter((i) => i.cartItemId !== cartItemId),
        }));
      },

      clearCart: () => set({ items: [] }),

      getTotalItems: () => {
        return get().items.reduce((sum, i) => sum + i.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce(
          (sum, i) => {
            const price = i.selectedVariant ? i.selectedVariant.price : (i.product.price || 0);
            return sum + price * i.quantity;
          },
          0
        );
      },
    }),
    {
      name: 'Mwapat-cart',               // unique key in localStorage
      storage: createJSONStorage(() => localStorage),
      // Optional: only persist when on client (helps avoid SSR mismatches)
      partialize: (state) => ({ items: state.items }),
    }
  )
);