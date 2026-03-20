import { create } from 'zustand';

interface FavoriteItem {
  productId: string;
  productName: string;
  productType: 'reagent' | 'supply';
  supplierName: string;
  catalogNo?: string;
  casNumber?: string;
  formula?: string;
  price: number;
  addedAt: string;
}

interface FavoriteState {
  favorites: FavoriteItem[];
  isFavorite: (productId: string) => boolean;
  toggleFavorite: (item: Omit<FavoriteItem, 'addedAt'>) => boolean; // returns new state
  removeFavorite: (productId: string) => void;
  getFavoriteCount: () => number;
}

export const useFavoriteStore = create<FavoriteState>((set, get) => ({
  favorites: [],

  isFavorite: (productId: string) => {
    return get().favorites.some((f) => f.productId === productId);
  },

  toggleFavorite: (item) => {
    const exists = get().favorites.some((f) => f.productId === item.productId);
    if (exists) {
      set((state) => ({
        favorites: state.favorites.filter((f) => f.productId !== item.productId),
      }));
      return false;
    } else {
      set((state) => ({
        favorites: [...state.favorites, { ...item, addedAt: new Date().toISOString() }],
      }));
      return true;
    }
  },

  removeFavorite: (productId: string) => {
    set((state) => ({
      favorites: state.favorites.filter((f) => f.productId !== productId),
    }));
  },

  getFavoriteCount: () => get().favorites.length,
}));
