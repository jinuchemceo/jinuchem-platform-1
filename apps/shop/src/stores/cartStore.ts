// ================================================================
// 장바구니 Zustand 스토어
// Phase 2에서 Supabase 연동 예정
// ================================================================

import { create } from 'zustand';

export interface CartItem {
  id: string;
  productId: string;
  productName: string;
  catalogNo: string;
  supplierName: string;
  variantId: string;
  size: string;
  unit: string;
  unitPrice: number;
  quantity: number;
  formula?: string;
}

interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'id'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],

  addItem: (item) => {
    const existing = get().items.find(
      (i) => i.productId === item.productId && i.variantId === item.variantId
    );
    if (existing) {
      set((state) => ({
        items: state.items.map((i) =>
          i.id === existing.id
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        ),
      }));
    } else {
      const newItem: CartItem = {
        ...item,
        id: `cart-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      };
      set((state) => ({ items: [...state.items, newItem] }));
    }
  },

  removeItem: (id) => {
    set((state) => ({ items: state.items.filter((i) => i.id !== id) }));
  },

  updateQuantity: (id, quantity) => {
    if (quantity < 1) return;
    set((state) => ({
      items: state.items.map((i) => (i.id === id ? { ...i, quantity } : i)),
    }));
  },

  clearCart: () => set({ items: [] }),

  getTotal: () => {
    return get().items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  },

  getItemCount: () => {
    return get().items.reduce((sum, item) => sum + item.quantity, 0);
  },
}));
