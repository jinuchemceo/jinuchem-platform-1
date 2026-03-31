'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, SlidersHorizontal, Grid3X3, List, ChevronDown, Truck, FlaskConical, ShoppingCart, Heart, AlertTriangle } from 'lucide-react';
import { CardStructureImage } from '@/components/products/CardStructureImage';
import { StructureSearchModal } from '@/components/products/StructureSearchModal';
import { sampleReagents, supplierList, gradeList } from '@/lib/mock-data';
import { formatCurrency } from '@jinuchem/shared';
import { useCartStore } from '@/stores/cartStore';
import { useFavoriteStore } from '@/stores/favoriteStore';
import type { ReagentCardData } from '@jinuchem/shared';

type ViewMode = 'grid' | 'list';

export default function ReagentOrderPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortBy, setSortBy] = useState('popular');
  const [selectedSuppliers, setSelectedSuppliers] = useState<string[]>([]);
  const [selectedGrades, setSelectedGrades] = useState<string[]>([]);
  const [sameDayOnly, setSameDayOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [supplierSearch, setSupplierSearch] = useState('');
  const [toast, setToast] = useState<string | null>(null);
  const [showStructureSearch, setShowStructureSearch] = useState(false);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const filteredReagents = useMemo(() => {
    let result = [...sampleReagents];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.casNumber?.includes(q) ||
          r.formula?.toLowerCase().includes(q) ||
          r.catalogNo?.toLowerCase().includes(q)
      );
    }

    if (selectedSuppliers.length > 0) {
      result = result.filter((r) => selectedSuppliers.includes(r.supplierName));
    }

    if (selectedGrades.length > 0) {
      result = result.filter((r) => r.grade && selectedGrades.includes(r.grade));
    }

    if (sameDayOnly) {
      result = result.filter((r) => r.variants.some((v) => v.sameDayShip));
    }

    switch (sortBy) {
      case 'price_asc':
        result.sort((a, b) => (a.variants[0]?.listPrice ?? 0) - (b.variants[0]?.listPrice ?? 0));
        break;
      case 'price_desc':
        result.sort((a, b) => (b.variants[0]?.listPrice ?? 0) - (a.variants[0]?.listPrice ?? 0));
        break;
      case 'newest':
        result.reverse();
        break;
    }

    return result;
  }, [searchQuery, selectedSuppliers, selectedGrades, sameDayOnly, sortBy]);

  const filteredSuppliers = supplierList.filter((s) =>
    s.toLowerCase().includes(supplierSearch.toLowerCase())
  );

  const toggleSupplier = (name: string) => {
    setSelectedSuppliers((prev) =>
      prev.includes(name) ? prev.filter((s) => s !== name) : [...prev, name]
    );
  };

  const toggleGrade = (grade: string) => {
    setSelectedGrades((prev) =>
      prev.includes(grade) ? prev.filter((g) => g !== grade) : [...prev, grade]
    );
  };

  return (
    <div>
      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[var(--text)]">시약 주문</h1>
        <span className="text-sm text-[var(--text-secondary)]">
          총 {filteredReagents.length}개 제품
        </span>
      </div>

      {/* Search + Sort + View */}
      <div className="flex items-center gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
          <input
            type="search"
            placeholder="시약명, CAS번호, 분자식, 카탈로그번호..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 h-[38px] border border-[var(--border)] rounded-lg bg-[var(--bg-card)] text-sm focus:outline-none focus:border-[var(--primary)] text-[var(--text)]"
          />
        </div>
        <button
          onClick={() => setShowStructureSearch(true)}
          className="h-[38px] px-4 bg-slate-800 text-white text-sm font-medium rounded-lg hover:bg-slate-700 transition-colors"
        >
          구조식 검색
        </button>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="h-[38px] px-3 border border-[var(--border)] rounded-lg bg-[var(--bg-card)] text-sm text-[var(--text)] cursor-pointer"
        >
          <option value="popular">인기순</option>
          <option value="price_asc">가격낮은순</option>
          <option value="price_desc">가격높은순</option>
          <option value="newest">최신순</option>
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

      {/* Main Layout: Filter + Grid */}
      <div className="flex gap-6">
        {/* Left Filter Panel */}
        <aside className="w-[220px] shrink-0 space-y-4">
          {/* Same Day Filter */}
          <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border)] p-4">
            <h3 className="text-sm font-semibold text-[var(--text)] mb-3">배송</h3>
            <label className="flex items-center gap-2 text-sm text-[var(--text)] cursor-pointer">
              <input
                type="checkbox"
                checked={sameDayOnly}
                onChange={(e) => setSameDayOnly(e.target.checked)}
                className="accent-blue-600"
              />
              당일출고 가능
            </label>
          </div>

          {/* Grade Filter */}
          <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border)] p-4">
            <h3 className="text-sm font-semibold text-[var(--text)] mb-3">등급</h3>
            <div className="space-y-2">
              {gradeList.map((grade) => (
                <label key={grade} className="flex items-center gap-2 text-sm text-[var(--text)] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedGrades.includes(grade)}
                    onChange={() => toggleGrade(grade)}
                    className="accent-blue-600"
                  />
                  {grade}
                </label>
              ))}
            </div>
          </div>

          {/* Supplier Filter */}
          <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border)] p-4">
            <h3 className="text-sm font-semibold text-[var(--text)] mb-3">공급사</h3>
            <input
              type="text"
              placeholder="공급사 검색..."
              value={supplierSearch}
              onChange={(e) => setSupplierSearch(e.target.value)}
              className="w-full h-[32px] px-3 mb-3 border border-[var(--border)] rounded-lg text-xs bg-[var(--bg)] text-[var(--text)]"
            />
            <div className="space-y-2 max-h-[200px] overflow-y-auto">
              {filteredSuppliers.map((supplier) => (
                <label key={supplier} className="flex items-center gap-2 text-sm text-[var(--text)] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedSuppliers.includes(supplier)}
                    onChange={() => toggleSupplier(supplier)}
                    className="accent-blue-600"
                  />
                  {supplier}
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* Product Grid / List */}
        <div className="flex-1">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-4 gap-4">
              {filteredReagents.map((reagent) => (
                <ReagentGridCard key={reagent.id} reagent={reagent} showToast={showToast} />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredReagents.map((reagent) => (
                <ReagentListCard key={reagent.id} reagent={reagent} showToast={showToast} />
              ))}
            </div>
          )}

          {/* Empty State */}
          {filteredReagents.length === 0 && (
            <div className="text-center py-20 text-[var(--text-secondary)]">
              <FlaskConical size={48} className="mx-auto mb-4 opacity-30" />
              <p className="text-lg font-medium mb-1">검색 결과가 없습니다</p>
              <p className="text-sm">다른 검색어나 필터 조건을 시도해주세요</p>
            </div>
          )}

          {/* Pagination */}
          {filteredReagents.length > 0 && (
            <div className="flex items-center justify-center gap-1 mt-8">
              {[1, 2, 3].map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-9 h-9 rounded-full text-sm font-medium transition-colors ${
                    currentPage === page
                      ? 'border-2 border-slate-800 text-slate-800'
                      : 'text-[var(--text-secondary)] hover:bg-gray-100'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button className="w-9 h-9 rounded-full text-sm text-[var(--text-secondary)] hover:bg-gray-100">
                &gt;
              </button>
              <button className="w-9 h-9 rounded-full text-sm text-[var(--text-secondary)] hover:bg-gray-100">
                &gt;&gt;
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-800 text-white px-6 py-3 rounded-lg shadow-xl text-sm z-50 animate-fade-in">
          {toast}
        </div>
      )}

      {/* Structure Search Modal */}
      <StructureSearchModal
        isOpen={showStructureSearch}
        onClose={() => setShowStructureSearch(false)}
        onSearch={(query, type) => {
          setSearchQuery(query);
          setShowStructureSearch(false);
        }}
      />
    </div>
  );
}

/* ========== Grid Card ========== */
function ReagentGridCard({ reagent, showToast }: { reagent: ReagentCardData; showToast: (msg: string) => void }) {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const addToCart = useCartStore((s) => s.addItem);
  const { isFavorite: checkFav, toggleFavorite } = useFavoriteStore();
  const isFav = checkFav(reagent.id);
  const variant = reagent.variants[selectedIdx] || reagent.variants[0];
  const price = variant?.salePrice ?? variant?.listPrice ?? 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!variant) return;
    addToCart({
      productId: reagent.id,
      productName: reagent.name,
      catalogNo: reagent.catalogNo || '',
      supplierName: reagent.supplierName,
      variantId: variant.id,
      size: variant.size,
      unit: variant.unit,
      unitPrice: variant.salePrice ?? variant.listPrice,
      quantity: 1,
      formula: reagent.formula,
    });
    showToast(`${reagent.name} ${variant.size}${variant.unit} 장바구니에 추가`);
  };

  return (
    <Link href={`/order/${reagent.id}`} className="block bg-[var(--bg-card)] rounded-xl border border-[var(--border)] overflow-hidden hover:shadow-md transition-shadow cursor-pointer group">
      {/* Supplier Badge + Heart */}
      <div className="px-4 pt-3 pb-1 flex items-center justify-between">
        <span className="text-xs text-blue-600 font-medium">{reagent.supplierName}</span>
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            const added = toggleFavorite({ productId: reagent.id, productName: reagent.name, productType: 'reagent', supplierName: reagent.supplierName, catalogNo: reagent.catalogNo, casNumber: reagent.casNumber, formula: reagent.formula, price: variant?.salePrice ?? variant?.listPrice ?? 0 });
            showToast(added ? `${reagent.name} 즐겨찾기에 추가` : `${reagent.name} 즐겨찾기에서 제거`);
          }}
          className={`transition-colors ${isFav ? 'text-red-500' : 'text-[var(--text-secondary)] hover:text-red-400'}`}
        >
          <Heart size={14} fill={isFav ? 'currentColor' : 'none'} />
        </button>
      </div>

      {/* Structure Image (PubChem) */}
      <CardStructureImage
        casNumber={reagent.casNumber}
        fallbackFormula={reagent.formula}
        className="h-[140px] mx-3 rounded-lg mb-2"
      />

      {/* Info */}
      <div className="px-4 pb-4">
        <h3 className="text-sm font-semibold text-[var(--text)] mb-1 line-clamp-1 group-hover:text-blue-600">
          {reagent.name}
        </h3>
        <p className="text-xs text-[var(--text-secondary)] mb-1">CAS: {reagent.casNumber}</p>
        <p className="text-xs text-[var(--text-secondary)] mb-2">{reagent.formula} / MW: {reagent.molWeight}</p>

        <div className="flex items-baseline gap-2">
          {variant?.salePrice && (
            <span className="text-xs text-[var(--text-secondary)] line-through">
              {formatCurrency(variant.listPrice)}
            </span>
          )}
          <span className="text-sm font-bold text-[var(--text)]">{formatCurrency(price)}</span>
        </div>

        {variant?.sameDayShip && (
          <div className="flex items-center gap-1 mt-2">
            <Truck size={12} className="text-emerald-600" />
            <span className="text-xs text-emerald-600 font-medium">당일출고</span>
          </div>
        )}

        {reagent.shippingRestriction && (
          <div className="flex items-center gap-1 mt-1.5 px-2 py-1 bg-orange-50 border border-orange-200 rounded-md">
            <AlertTriangle size={12} className="text-orange-600 shrink-0" />
            <span className="text-xs text-orange-700 font-medium">{reagent.shippingRestriction.type}</span>
          </div>
        )}

        {/* Variant Selector + Cart Button */}
        <div className="flex gap-2 mt-3" onClick={(e) => e.preventDefault()}>
          {reagent.variants.length > 1 && (
            <select
              value={selectedIdx}
              onChange={(e) => { e.stopPropagation(); setSelectedIdx(Number(e.target.value)); }}
              onClick={(e) => e.stopPropagation()}
              className="flex-1 h-[34px] px-2 border border-[var(--border)] rounded-lg text-xs bg-[var(--bg-card)] text-[var(--text)] min-w-0"
            >
              {reagent.variants.map((v, i) => (
                <option key={v.id} value={i}>{v.size}{v.unit}</option>
              ))}
            </select>
          )}
          <button
            className={`${reagent.variants.length > 1 ? '' : 'w-full'} flex-1 h-[34px] bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-1`}
            onClick={handleAddToCart}
          >
            <ShoppingCart size={12} />
            담기
          </button>
        </div>
      </div>
    </Link>
  );
}

/* ========== List Card ========== */
function ReagentListCard({ reagent, showToast }: { reagent: ReagentCardData; showToast: (msg: string) => void }) {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const addToCart = useCartStore((s) => s.addItem);
  const variant = reagent.variants[selectedIdx] || reagent.variants[0];
  const price = variant?.salePrice ?? variant?.listPrice ?? 0;

  const handleAddToCart = () => {
    if (!variant) return;
    addToCart({
      productId: reagent.id,
      productName: reagent.name,
      catalogNo: reagent.catalogNo || '',
      supplierName: reagent.supplierName,
      variantId: variant.id,
      size: variant.size,
      unit: variant.unit,
      unitPrice: variant.salePrice ?? variant.listPrice,
      quantity: 1,
      formula: reagent.formula,
    });
    showToast(`${reagent.name} ${variant.size}${variant.unit} 장바구니에 추가`);
  };

  return (
    <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border)] p-4 flex gap-4 items-center hover:shadow-md transition-shadow cursor-pointer group">
      {/* Structure (PubChem) */}
      <CardStructureImage
        casNumber={reagent.casNumber}
        fallbackFormula={reagent.formula}
        className="w-[100px] h-[100px] rounded-lg shrink-0"
      />

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs text-blue-600 font-medium">{reagent.supplierName}</span>
          <span className="text-xs text-[var(--text-secondary)]">|</span>
          <span className="text-xs text-[var(--text-secondary)]">{reagent.catalogNo}</span>
        </div>
        <h3 className="text-sm font-semibold text-[var(--text)] mb-1 group-hover:text-blue-600">
          {reagent.name}
        </h3>
        <p className="text-xs text-[var(--text-secondary)]">
          CAS: {reagent.casNumber} | {reagent.formula} | MW: {reagent.molWeight} | {reagent.grade} | {reagent.purity}
        </p>
      </div>

      {/* Price + Actions */}
      <div className="text-right shrink-0 space-y-2">
        <div>
          {variant?.salePrice && (
            <span className="text-xs text-[var(--text-secondary)] line-through mr-2">
              {formatCurrency(variant.listPrice)}
            </span>
          )}
          <span className="text-base font-bold text-[var(--text)]">{formatCurrency(price)}</span>
        </div>
        {variant?.sameDayShip && (
          <div className="flex items-center justify-end gap-1">
            <Truck size={12} className="text-emerald-600" />
            <span className="text-xs text-emerald-600 font-medium">당일출고</span>
          </div>
        )}
        {reagent.shippingRestriction && (
          <div className="flex items-center justify-end gap-1 px-2 py-1 bg-orange-50 border border-orange-200 rounded-md w-fit ml-auto">
            <AlertTriangle size={12} className="text-orange-600 shrink-0" />
            <span className="text-xs text-orange-700 font-medium">{reagent.shippingRestriction.type}</span>
          </div>
        )}
        <div className="flex gap-2 justify-end">
          {reagent.variants.length > 1 && (
            <select
              value={selectedIdx}
              onChange={(e) => setSelectedIdx(Number(e.target.value))}
              className="h-[34px] px-2 border border-[var(--border)] rounded-lg text-xs bg-[var(--bg-card)] text-[var(--text)]"
            >
              {reagent.variants.map((v, i) => (
                <option key={v.id} value={i}>{v.size}{v.unit}</option>
              ))}
            </select>
          )}
          <button
            onClick={handleAddToCart}
            className="h-[34px] px-4 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1"
          >
            <ShoppingCart size={12} /> 담기
          </button>
        </div>
      </div>
    </div>
  );
}
