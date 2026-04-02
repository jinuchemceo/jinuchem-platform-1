import { create } from 'zustand';
import type { SupplierOrder, OrderStatus } from '@/types';
import { mockOrders } from '@/lib/mock-data';

interface OrderState {
  orders: SupplierOrder[];
  activeTab: '전체' | OrderStatus;
  selectedOrderId: string | null;
  isLoading: boolean;
  isMock: boolean;

  fetchOrders: () => Promise<void>;
  setActiveTab: (tab: '전체' | OrderStatus) => void;
  selectOrder: (id: string | null) => void;
  updateOrderStatus: (id: string, status: OrderStatus) => void;

  getFilteredOrders: () => SupplierOrder[];
  getOrderCounts: () => Record<string, number>;
  getSelectedOrder: () => SupplierOrder | undefined;
}

export const useOrderStore = create<OrderState>((set, get) => ({
  orders: mockOrders,
  activeTab: '전체',
  selectedOrderId: null,
  isLoading: false,
  isMock: true,

  fetchOrders: async () => {
    set({ isLoading: true });
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      set({ orders: data.orders, isMock: !!data._mock, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  setActiveTab: (tab) => set({ activeTab: tab }),
  selectOrder: (id) => set({ selectedOrderId: id }),

  updateOrderStatus: (id, status) =>
    set((state) => ({
      orders: state.orders.map((o) =>
        o.id === id ? { ...o, status } : o
      ),
    })),

  getFilteredOrders: () => {
    const { orders, activeTab } = get();
    if (activeTab === '전체') return orders;
    return orders.filter((o) => o.status === activeTab);
  },

  getOrderCounts: () => {
    const { orders } = get();
    const counts: Record<string, number> = { '전체': orders.length };
    for (const o of orders) {
      counts[o.status] = (counts[o.status] || 0) + 1;
    }
    return counts;
  },

  getSelectedOrder: () => {
    const { orders, selectedOrderId } = get();
    return orders.find((o) => o.id === selectedOrderId);
  },
}));
