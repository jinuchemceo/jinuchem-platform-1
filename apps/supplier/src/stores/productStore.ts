import { create } from 'zustand';
import type { SupplierProduct, ProductStatus } from '@/types';
import { mockProducts } from '@/lib/mock-data';

interface ProductState {
  products: SupplierProduct[];
  activeTab: '전체' | ProductStatus;
  searchQuery: string;
  isLoading: boolean;

  fetchProducts: () => Promise<void>;
  setActiveTab: (tab: '전체' | ProductStatus) => void;
  setSearchQuery: (query: string) => void;
  updateStock: (id: string, stock: number) => void;
  updateProductStatus: (id: string, status: ProductStatus) => void;

  getFilteredProducts: () => SupplierProduct[];
  getProductCounts: () => Record<string, number>;
  getLowStockProducts: () => SupplierProduct[];
  getOutOfStockCount: () => number;
}

export const useProductStore = create<ProductState>((set, get) => ({
  products: mockProducts,
  activeTab: '전체',
  searchQuery: '',
  isLoading: false,

  fetchProducts: async () => {
    set({ isLoading: true });
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      set({ products: data.products, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  setActiveTab: (tab) => set({ activeTab: tab }),
  setSearchQuery: (query) => set({ searchQuery: query }),

  updateStock: (id, stock) =>
    set((state) => ({
      products: state.products.map((p) =>
        p.id === id
          ? { ...p, stock, status: stock === 0 ? '품절' as ProductStatus : p.status }
          : p
      ),
    })),

  updateProductStatus: (id, status) =>
    set((state) => ({
      products: state.products.map((p) =>
        p.id === id ? { ...p, status } : p
      ),
    })),

  getFilteredProducts: () => {
    const { products, activeTab, searchQuery } = get();
    let filtered = products;

    if (activeTab !== '전체') {
      filtered = filtered.filter((p) => p.status === activeTab);
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.cas.includes(q) ||
          p.catalogNo.toLowerCase().includes(q)
      );
    }

    return filtered;
  },

  getProductCounts: () => {
    const { products } = get();
    const counts: Record<string, number> = { '전체': products.length };
    for (const p of products) {
      counts[p.status] = (counts[p.status] || 0) + 1;
    }
    return counts;
  },

  getLowStockProducts: () => {
    const { products } = get();
    return products.filter((p) => p.stock > 0 && p.stock <= 5);
  },

  getOutOfStockCount: () => {
    const { products } = get();
    return products.filter((p) => p.stock === 0).length;
  },
}));
