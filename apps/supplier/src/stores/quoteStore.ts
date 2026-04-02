import { create } from 'zustand';
import type { SupplierQuote, QuoteStatus } from '@/types';
import { mockQuotes } from '@/lib/mock-data';

interface QuoteState {
  quotes: SupplierQuote[];
  activeTab: '전체' | QuoteStatus;
  selectedQuoteId: string | null;
  isLoading: boolean;

  fetchQuotes: () => Promise<void>;
  setActiveTab: (tab: '전체' | QuoteStatus) => void;
  selectQuote: (id: string | null) => void;
  updateQuoteStatus: (id: string, status: QuoteStatus) => void;

  getFilteredQuotes: () => SupplierQuote[];
  getQuoteCounts: () => Record<string, number>;
  getPendingCount: () => number;
  getSelectedQuote: () => SupplierQuote | undefined;
}

export const useQuoteStore = create<QuoteState>((set, get) => ({
  quotes: mockQuotes,
  activeTab: '전체',
  selectedQuoteId: null,
  isLoading: false,

  fetchQuotes: async () => {
    set({ isLoading: true });
    try {
      const res = await fetch('/api/quotes');
      const data = await res.json();
      set({ quotes: data.quotes, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  setActiveTab: (tab) => set({ activeTab: tab }),
  selectQuote: (id) => set({ selectedQuoteId: id }),

  updateQuoteStatus: (id, status) =>
    set((state) => ({
      quotes: state.quotes.map((q) =>
        q.id === id ? { ...q, status } : q
      ),
    })),

  getFilteredQuotes: () => {
    const { quotes, activeTab } = get();
    if (activeTab === '전체') return quotes;
    return quotes.filter((q) => q.status === activeTab);
  },

  getQuoteCounts: () => {
    const { quotes } = get();
    const counts: Record<string, number> = { '전체': quotes.length };
    for (const q of quotes) {
      counts[q.status] = (counts[q.status] || 0) + 1;
    }
    return counts;
  },

  getPendingCount: () => {
    const { quotes } = get();
    return quotes.filter((q) => q.status === '대기중').length;
  },

  getSelectedQuote: () => {
    const { quotes, selectedQuoteId } = get();
    return quotes.find((q) => q.id === selectedQuoteId);
  },
}));
