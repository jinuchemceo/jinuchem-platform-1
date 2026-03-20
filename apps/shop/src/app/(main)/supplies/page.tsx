'use client';

import { useState, useMemo } from 'react';
import { Search, Grid3X3, List, Truck, ChevronDown, ChevronRight, RefreshCw, Package } from 'lucide-react';
import { sampleSupplies } from '@/lib/mock-data';
import { formatCurrency, SUPPLY_CATEGORIES } from '@jinuchem/shared';
import type { SupplyCardData } from '@jinuchem/shared';

type ViewMode = 'grid' | 'list';

const categories = SUPPLY_CATEGORIES;

export default function SupplyOrderPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortBy, setSortBy] = useState('popular');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const [sameDayOnly, setSameDayOnly] = useState(false);
  const [subscriptionOnly, setSubscriptionOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredSupplies = useMemo(() => {
    let result = [...sampleSupplies];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (s) => s.name.toLowerCase().includes(q) || s.catalogNo?.toLowerCase().includes(q)
      );
    }

    if (selectedCategory) {
      const cat = categories.find((c) => c.id === selectedCategory);
      if (cat) {
        result = result.filter((s) => s.categoryName === cat.name);
      }
    }

    if (sameDayOnly) {
      result = result.filter((s) => s.variants.some((v) => v.sameDayShip));
    }

    if (subscriptionOnly) {
      result = result.filter((s) => s.subscriptionAvailable);
    }

    switch (sortBy) {
      case 'price_asc':
        result.sort((a, b) => (a.variants[0]?.listPrice ?? 0) - (b.variants[0]?.listPrice ?? 0));
        break;
      case 'price_desc':
        result.sort((a, b) => (b.variants[0]?.listPrice ?? 0) - (a.variants[0]?.listPrice ?? 0));
        break;
    }

    return result;
  }, [searchQuery, selectedCategory, sameDayOnly, subscriptionOnly, sortBy]);

  const toggleCategory = (id: string) => {
    setExpandedCategories((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[var(--text)]">소모품 주문</h1>
        <span className="text-sm text-[var(--text-secondary)]">
          총 {filteredSupplies.length}개 제품
        </span>
      </div>

      {/* Search + Sort + View */}
      <div className="flex items-center gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
          <input
            type="search"
            placeholder="소모품명, 카탈로그번호 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 h-[38px] border border-[var(--border)] rounded-lg bg-[var(--bg-card)] text-sm focus:outline-none focus:border-[var(--primary)] text-[var(--text)]"
          />
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="h-[38px] px-3 border border-[var(--border)] rounded-lg bg-[var(--bg-card)] text-sm text-[var(--text)]"
        >
          <option value="popular">인기순</option>
          <option value="price_asc">가격낮은순</option>
          <option value="price_desc">가격높은순</option>
        </select>
        <div className="flex border border-[var(--border)] rounded-lg overflow-hidden">
          <button
            onClick={() => setViewMode('grid')}
            className={`w-[38px] h-[38px] flex items-center justify-center ${viewMode === 'grid' ? 'bg-slate-800 text-white' : 'bg-[var(--bg-card)] text-[var(--text-secondary)]'}`}
          >
            <Grid3X3 size={16} />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`w-[38px] h-[38px] flex items-center justify-center ${viewMode === 'list' ? 'bg-slate-800 text-white' : 'bg-[var(--bg-card)] text-[var(--text-secondary)]'}`}
          >
            <List size={16} />
          </button>
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex gap-6">
        {/* Left Filter Panel */}
        <aside className="w-[220px] shrink-0 space-y-4">
          {/* Delivery + Subscription */}
          <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border)] p-4 space-y-3">
            <h3 className="text-sm font-semibold text-[var(--text)]">배송 / 구독</h3>
            <label className="flex items-center gap-2 text-sm text-[var(--text)] cursor-pointer">
              <input type="checkbox" checked={sameDayOnly} onChange={(e) => setSameDayOnly(e.target.checked)} className="accent-blue-600" />
              당일출고 가능
            </label>
            <label className="flex items-center gap-2 text-sm text-[var(--text)] cursor-pointer">
              <input type="checkbox" checked={subscriptionOnly} onChange={(e) => setSubscriptionOnly(e.target.checked)} className="accent-blue-600" />
              정기배송 가능
            </label>
          </div>

          {/* Category Tree */}
          <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border)] p-4">
            <h3 className="text-sm font-semibold text-[var(--text)] mb-3">카테고리</h3>
            <button
              onClick={() => setSelectedCategory(null)}
              className={`w-full text-left px-2 py-1.5 text-sm rounded-lg mb-1 ${
                !selectedCategory ? 'bg-blue-50 text-blue-600 font-medium' : 'text-[var(--text)] hover:bg-gray-50'
              }`}
            >
              전체
            </button>
            {categories.map((cat) => (
              <div key={cat.id}>
                <button
                  onClick={() => { setSelectedCategory(cat.id); toggleCategory(cat.id); }}
                  className={`w-full flex items-center justify-between px-2 py-1.5 text-sm rounded-lg ${
                    selectedCategory === cat.id ? 'bg-blue-50 text-blue-600 font-medium' : 'text-[var(--text)] hover:bg-gray-50'
                  }`}
                >
                  <span>{cat.name}</span>
                  <span className="text-xs text-[var(--text-secondary)]">
                    {cat.subcategories.length}
                  </span>
                </button>
                {expandedCategories[cat.id] && (
                  <div className="ml-4 mt-0.5 space-y-0.5">
                    {cat.subcategories.map((sub) => (
                      <button
                        key={sub}
                        className="w-full text-left px-2 py-1 text-xs text-[var(--text-secondary)] hover:text-[var(--text)] rounded"
                      >
                        {sub}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-4 gap-4">
              {filteredSupplies.map((supply) => (
                <SupplyGridCard key={supply.id} supply={supply} />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredSupplies.map((supply) => (
                <SupplyListCard key={supply.id} supply={supply} />
              ))}
            </div>
          )}

          {filteredSupplies.length === 0 && (
            <div className="text-center py-20 text-[var(--text-secondary)]">
              <Package size={48} className="mx-auto mb-4 opacity-30" />
              <p className="text-lg font-medium mb-1">검색 결과가 없습니다</p>
              <p className="text-sm">다른 검색어나 필터 조건을 시도해주세요</p>
            </div>
          )}

          {filteredSupplies.length > 0 && (
            <div className="flex items-center justify-center gap-1 mt-8">
              {[1, 2].map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-9 h-9 rounded-full text-sm font-medium transition-colors ${
                    currentPage === page ? 'border-2 border-slate-800 text-slate-800' : 'text-[var(--text-secondary)] hover:bg-gray-100'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ========== Grid Card ========== */
function SupplyGridCard({ supply }: { supply: SupplyCardData }) {
  const firstVariant = supply.variants[0];
  const price = firstVariant?.listPrice ?? 0;

  return (
    <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border)] p-4 hover:shadow-md transition-shadow cursor-pointer group">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-blue-600 font-medium">{supply.supplierName}</span>
        <span className="text-xs text-[var(--text-secondary)] bg-gray-100 px-2 py-0.5 rounded-full">
          {supply.categoryName}
        </span>
      </div>

      <h3 className="text-sm font-semibold text-[var(--text)] mb-3 line-clamp-2 min-h-[40px] group-hover:text-blue-600">
        {supply.name}
      </h3>

      <p className="text-xs text-[var(--text-secondary)] mb-2">{supply.catalogNo}</p>

      <div className="text-base font-bold text-[var(--text)] mb-2">{formatCurrency(price)}</div>

      <div className="flex items-center gap-3 mb-3">
        {firstVariant?.sameDayShip && (
          <div className="flex items-center gap-1">
            <Truck size={12} className="text-emerald-600" />
            <span className="text-xs text-emerald-600 font-medium">당일출고</span>
          </div>
        )}
        {supply.subscriptionAvailable && (
          <div className="flex items-center gap-1">
            <RefreshCw size={12} className="text-violet-600" />
            <span className="text-xs text-violet-600 font-medium">정기배송</span>
          </div>
        )}
      </div>

      <button
        className="w-full h-[34px] bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition-colors"
        onClick={(e) => { e.stopPropagation(); alert('장바구니에 추가되었습니다'); }}
      >
        장바구니 담기
      </button>
    </div>
  );
}

/* ========== List Card ========== */
function SupplyListCard({ supply }: { supply: SupplyCardData }) {
  const firstVariant = supply.variants[0];
  const price = firstVariant?.listPrice ?? 0;

  return (
    <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border)] p-4 flex gap-4 items-center hover:shadow-md transition-shadow cursor-pointer group">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs text-blue-600 font-medium">{supply.supplierName}</span>
          <span className="text-xs text-[var(--text-secondary)]">|</span>
          <span className="text-xs text-[var(--text-secondary)]">{supply.catalogNo}</span>
          <span className="text-xs text-[var(--text-secondary)] bg-gray-100 px-2 py-0.5 rounded-full ml-auto">
            {supply.categoryName}
          </span>
        </div>
        <h3 className="text-sm font-semibold text-[var(--text)] group-hover:text-blue-600">{supply.name}</h3>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        {firstVariant?.sameDayShip && (
          <div className="flex items-center gap-1">
            <Truck size={12} className="text-emerald-600" />
            <span className="text-xs text-emerald-600">당일출고</span>
          </div>
        )}
        {supply.subscriptionAvailable && (
          <div className="flex items-center gap-1">
            <RefreshCw size={12} className="text-violet-600" />
            <span className="text-xs text-violet-600">정기배송</span>
          </div>
        )}
      </div>
      <div className="text-right shrink-0">
        <span className="text-base font-bold text-[var(--text)]">{formatCurrency(price)}</span>
        <br />
        <button className="mt-1 h-[34px] px-4 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition-colors">
          장바구니 담기
        </button>
      </div>
    </div>
  );
}
