'use client';

import { useState, useMemo } from 'react';
import { Heart, ShoppingCart, Trash2, FlaskConical, Search } from 'lucide-react';
import { sampleReagents } from '@/lib/mock-data';
import { formatCurrency } from '@jinuchem/shared';
import { useCartStore } from '@/stores/cartStore';
import Link from 'next/link';

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState(sampleReagents.slice(0, 5));
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState<string | null>(null);
  const addToCart = useCartStore((s) => s.addItem);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const filteredFavorites = useMemo(() => {
    if (!searchQuery) return favorites;
    const q = searchQuery.toLowerCase();
    return favorites.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.casNumber?.toLowerCase().includes(q) ||
        r.formula?.toLowerCase().includes(q) ||
        r.catalogNo?.toLowerCase().includes(q)
    );
  }, [favorites, searchQuery]);

  const removeFromFavorites = (id: string) => {
    setFavorites((prev) => prev.filter((r) => r.id !== id));
  };

  const handleAddToCart = (reagent: typeof sampleReagents[0]) => {
    const firstVariant = reagent.variants[0];
    if (!firstVariant) return;
    addToCart({
      productId: reagent.id,
      productName: reagent.name,
      catalogNo: reagent.catalogNo || '',
      supplierName: reagent.supplierName,
      variantId: firstVariant.id,
      size: firstVariant.size,
      unit: firstVariant.unit,
      unitPrice: firstVariant.salePrice ?? firstVariant.listPrice,
      quantity: 1,
      formula: reagent.formula,
    });
    showToast(`${reagent.name} 장바구니에 추가`);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[var(--text)]">즐겨찾기</h1>
        <span className="text-sm text-[var(--text-secondary)]">
          {searchQuery
            ? `검색 결과 ${filteredFavorites.length}개 / 전체 ${favorites.length}개`
            : `총 ${favorites.length}개 시약`}
        </span>
      </div>

      {/* Search Bar */}
      {favorites.length > 0 && (
        <div className="relative max-w-md mb-6">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="제품명, CAS번호로 검색..."
            className="w-full pl-10 pr-4 h-[38px] border border-[var(--border)] rounded-lg bg-[var(--bg-card)] text-sm text-[var(--text)] focus:outline-none focus:border-[var(--primary)]"
          />
        </div>
      )}

      {favorites.length === 0 ? (
        <div className="text-center py-20 text-[var(--text-secondary)]">
          <Heart size={48} className="mx-auto mb-4 opacity-30" />
          <p className="text-lg font-medium mb-1">즐겨찾기가 비어있습니다</p>
          <p className="text-sm mb-4">자주 구매하는 시약을 즐겨찾기에 추가해보세요</p>
          <Link
            href="/order"
            className="inline-flex items-center gap-1.5 h-[38px] px-4 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
          >
            <FlaskConical size={14} /> 시약 주문하러 가기
          </Link>
        </div>
      ) : filteredFavorites.length === 0 ? (
        <div className="text-center py-20 text-[var(--text-secondary)]">
          <Search size={48} className="mx-auto mb-4 opacity-30" />
          <p className="text-lg font-medium mb-1">검색 결과가 없습니다</p>
          <p className="text-sm">다른 검색어를 시도해주세요</p>
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-4">
          {filteredFavorites.map((reagent) => {
            const firstVariant = reagent.variants[0];
            const price = firstVariant?.salePrice ?? firstVariant?.listPrice ?? 0;

            return (
              <div key={reagent.id} className="bg-[var(--bg-card)] rounded-xl border border-[var(--border)] overflow-hidden hover:shadow-md transition-shadow group">
                {/* Supplier Badge + Remove */}
                <div className="px-4 pt-3 pb-1 flex items-center justify-between">
                  <span className="text-xs text-blue-600 font-medium">{reagent.supplierName}</span>
                  <button
                    onClick={() => removeFromFavorites(reagent.id)}
                    className="text-red-400 hover:text-red-600 transition-colors"
                    title="즐겨찾기 해제"
                  >
                    <Heart size={16} fill="currentColor" />
                  </button>
                </div>

                {/* Structure Image */}
                <Link href={`/order/${reagent.id}`}>
                  <div className="h-[140px] flex items-center justify-center bg-gray-50 mx-3 rounded-lg mb-2 cursor-pointer">
                    <span className="text-3xl font-mono text-gray-300">{reagent.formula || '?'}</span>
                  </div>
                </Link>

                {/* Info */}
                <div className="px-4 pb-4">
                  <Link href={`/order/${reagent.id}`}>
                    <h3 className="text-sm font-semibold text-[var(--text)] mb-1 line-clamp-1 group-hover:text-blue-600 cursor-pointer">
                      {reagent.name}
                    </h3>
                  </Link>
                  <p className="text-xs text-[var(--text-secondary)] mb-1">CAS: {reagent.casNumber}</p>
                  <p className="text-xs text-[var(--text-secondary)] mb-2">{reagent.formula} / MW: {reagent.molWeight}</p>

                  <div className="flex items-baseline gap-2 mb-3">
                    {firstVariant?.salePrice && (
                      <span className="text-xs text-[var(--text-secondary)] line-through">
                        {formatCurrency(firstVariant.listPrice)}
                      </span>
                    )}
                    <span className="text-sm font-bold text-[var(--text)]">{formatCurrency(price)}</span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAddToCart(reagent)}
                      className="flex-1 h-[34px] bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-1"
                    >
                      <ShoppingCart size={12} /> 장바구니
                    </button>
                    <button
                      onClick={() => removeFromFavorites(reagent.id)}
                      className="w-[34px] h-[34px] border border-[var(--border)] rounded-lg flex items-center justify-center text-[var(--text-secondary)] hover:text-red-500 hover:border-red-300"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-800 text-white px-6 py-3 rounded-lg shadow-xl text-sm z-50 animate-fade-in">
          {toast}
        </div>
      )}
    </div>
  );
}
