'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { Search, Upload, Plus, Trash2, ShoppingCart, FlaskConical, FileText, Zap } from 'lucide-react';
import { formatCurrency } from '@jinuchem/shared';
import { sampleReagents } from '@/lib/mock-data';
import { useCartStore } from '@/stores/cartStore';
import type { VariantSummary } from '@jinuchem/shared';

interface QuickOrderItem {
  id: string;
  productId: string;
  catalogNo: string;
  productName: string;
  supplierName: string;
  casNumber: string;
  formula: string;
  specialNote: string;
  sdsAvailable: boolean;
  coaAvailable: boolean;
  variants: VariantSummary[];
  selectedVariantId: string;
  selectedSize: string;
  unitPrice: number;
  quantity: number;
  selected: boolean;
}

export default function QuickOrderPage() {
  const [searchType, setSearchType] = useState('catalog');
  const [searchInput, setSearchInput] = useState('');
  const [items, setItems] = useState<QuickOrderItem[]>([]);
  const [toast, setToast] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const addToCart = useCartStore((s) => s.addItem);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  // Autocomplete suggestions
  const suggestions = useMemo(() => {
    if (!searchInput.trim() || searchInput.trim().length < 1) return [];
    const q = searchInput.trim().toLowerCase();
    return sampleReagents.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.casNumber?.includes(q) ||
        r.catalogNo?.toLowerCase().includes(q) ||
        r.formula?.toLowerCase().includes(q)
    ).slice(0, 6);
  }, [searchInput]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const addProduct = (match: typeof sampleReagents[0]) => {
    if (items.some((i) => i.productId === match.id)) {
      showToast('이미 추가된 제품입니다.');
      return;
    }

    const firstVariant = match.variants[0];
    const newItem: QuickOrderItem = {
      id: String(Date.now()),
      productId: match.id,
      catalogNo: match.catalogNo || '',
      productName: match.name,
      supplierName: match.supplierName,
      casNumber: match.casNumber || '',
      formula: match.formula || '',
      specialNote: '',
      sdsAvailable: true,
      coaAvailable: match.supplierName === 'Sigma-Aldrich',
      variants: match.variants,
      selectedVariantId: firstVariant?.id || '',
      selectedSize: `${firstVariant?.size}${firstVariant?.unit}`,
      unitPrice: firstVariant?.salePrice ?? firstVariant?.listPrice ?? 0,
      quantity: 1,
      selected: true,
    };
    setItems([...items, newItem]);
    setSearchInput('');
    setShowDropdown(false);
    showToast(`${match.name} 추가되었습니다.`);
  };

  const handleSearch = () => {
    if (!searchInput.trim()) return;
    const q = searchInput.trim().toLowerCase();
    const match = sampleReagents.find(
      (r) =>
        r.catalogNo?.toLowerCase() === q ||
        r.casNumber === searchInput.trim() ||
        r.name.toLowerCase().includes(q)
    );

    if (!match) {
      showToast('제품을 찾을 수 없습니다. 다른 검색어를 시도해주세요.');
      return;
    }

    addProduct(match);
  };

  const removeItem = (id: string) => setItems(items.filter((i) => i.id !== id));

  const toggleSelect = (id: string) =>
    setItems(items.map((i) => (i.id === id ? { ...i, selected: !i.selected } : i)));

  const updateQuantity = (id: string, qty: number) =>
    setItems(items.map((i) => (i.id === id ? { ...i, quantity: Math.max(1, qty) } : i)));

  const updateVariant = (id: string, variantId: string) => {
    setItems(
      items.map((i) => {
        if (i.id !== id) return i;
        const variant = i.variants.find((v) => v.id === variantId);
        if (!variant) return i;
        return {
          ...i,
          selectedVariantId: variantId,
          selectedSize: `${variant.size}${variant.unit}`,
          unitPrice: variant.salePrice ?? variant.listPrice,
        };
      })
    );
  };

  const resetAll = () => {
    setItems([]);
    setSearchInput('');
  };

  const selectedItems = items.filter((i) => i.selected);
  const totalAmount = selectedItems.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);

  const handleAddToCart = () => {
    if (selectedItems.length === 0) {
      showToast('선택된 제품이 없습니다.');
      return;
    }
    selectedItems.forEach((item) => {
      const variant = item.variants.find((v) => v.id === item.selectedVariantId);
      addToCart({
        productId: item.productId,
        productName: item.productName,
        catalogNo: item.catalogNo,
        supplierName: item.supplierName,
        variantId: item.selectedVariantId,
        size: variant?.size || '',
        unit: variant?.unit || '',
        unitPrice: item.unitPrice,
        quantity: item.quantity,
        formula: item.formula,
      });
    });
    showToast(`${selectedItems.length}개 제품이 장바구니에 추가되었습니다.`);
  };

  const handleDirectOrder = () => {
    if (selectedItems.length === 0) {
      showToast('선택된 제품이 없습니다.');
      return;
    }
    showToast(`${selectedItems.length}개 제품 바로 주문을 진행합니다.`);
  };

  const handleQuoteRequest = () => {
    if (selectedItems.length === 0) {
      showToast('선택된 제품이 없습니다.');
      return;
    }
    showToast(`${selectedItems.length}개 제품 견적 요청을 보냈습니다.`);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[var(--text)]">빠른 주문</h1>
        <span className="text-sm text-[var(--text-secondary)]">제품을 검색하여 빠르게 견적/주문하세요</span>
      </div>

      {/* Search Section */}
      <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border)] p-5 mb-6">
        <h3 className="text-base font-semibold text-[var(--text)] mb-4">제품 검색</h3>
        <div className="flex gap-2 mb-4">
          <select
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
            className="h-[38px] px-3 w-[140px] border border-[var(--border)] rounded-lg bg-[var(--bg-card)] text-sm text-[var(--text)]"
          >
            <option value="catalog">제품번호</option>
            <option value="name">제품명</option>
            <option value="cas">CAS No.</option>
            <option value="formula">분자식</option>
            <option value="keyword">키워드</option>
          </select>
          <div className="relative flex-1" ref={dropdownRef}>
            <input
              ref={inputRef}
              type="text"
              value={searchInput}
              onChange={(e) => {
                setSearchInput(e.target.value);
                setShowDropdown(true);
              }}
              onFocus={() => setShowDropdown(true)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="내용을 입력해 주세요."
              className="w-full h-[38px] px-4 border border-[var(--border)] rounded-lg text-sm bg-[var(--bg-card)] text-[var(--text)]"
            />
            {/* Autocomplete Dropdown */}
            {showDropdown && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-[var(--bg-card)] border border-[var(--border)] rounded-lg shadow-xl z-50 max-h-[280px] overflow-y-auto">
                {suggestions.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => addProduct(r)}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-blue-50 transition-colors border-b border-[var(--border)] last:border-0"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[var(--text)] truncate">{r.name}</p>
                      <p className="text-xs text-[var(--text-secondary)]">
                        {r.supplierName} | CAS: {r.casNumber} | {r.formula}
                      </p>
                    </div>
                    <span className="text-xs text-blue-600 font-medium shrink-0">{r.catalogNo}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          <button onClick={handleSearch} className="h-[38px] px-5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700">
            견적 추가
          </button>
          <button className="h-[38px] px-5 border border-[var(--border)] text-sm text-[var(--text)] rounded-lg hover:border-blue-400">
            구조식 검색
          </button>
        </div>
        <p className="text-xs text-[var(--text-secondary)]">
          제품정보에서 재고 확인 필수! 특이사항이 표기된 경우에는 담당자와 협의하여야 합니다. (하단을 참조하세요)
        </p>

        {/* Results Table */}
        {items.length > 0 ? (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border)]">
                  <th className="text-left py-2 px-3 font-medium text-[var(--text-secondary)] w-[50px]">선택</th>
                  <th className="text-left py-2 px-3 font-medium text-[var(--text-secondary)] w-[100px]">제품번호</th>
                  <th className="text-left py-2 px-3 font-medium text-[var(--text-secondary)]">제품명</th>
                  <th className="text-left py-2 px-3 font-medium text-[var(--text-secondary)] w-[100px]">CAS No.</th>
                  <th className="text-left py-2 px-3 font-medium text-[var(--text-secondary)] w-[110px]">분자식</th>
                  <th className="text-left py-2 px-3 font-medium text-[var(--text-secondary)] w-[100px]">제품정보</th>
                  <th className="text-left py-2 px-3 font-medium text-[var(--text-secondary)] w-[130px]">용량</th>
                  <th className="text-right py-2 px-3 font-medium text-[var(--text-secondary)] w-[100px]">단가</th>
                  <th className="text-left py-2 px-3 font-medium text-[var(--text-secondary)] w-[80px]">수량</th>
                  <th className="text-right py-2 px-3 font-medium text-[var(--text-secondary)] w-[110px]">소계</th>
                  <th className="w-[40px]"></th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className={`border-b border-[var(--border)] last:border-0 ${item.selected ? '' : 'opacity-50'}`}>
                    <td className="py-3 px-3">
                      <input type="checkbox" checked={item.selected} onChange={() => toggleSelect(item.id)} className="accent-blue-600" />
                    </td>
                    <td className="py-3 px-3 font-mono text-[var(--text)]">{item.catalogNo}</td>
                    <td className="py-3 px-3">
                      <div className="font-medium text-[var(--text)]">{item.productName}</div>
                      <div className="text-xs text-[var(--text-secondary)]">{item.supplierName}</div>
                    </td>
                    <td className="py-3 px-3 text-xs font-mono text-[var(--text)]">{item.casNumber}</td>
                    <td className="py-3 px-3 text-xs text-[var(--text)]">{item.formula}</td>
                    <td className="py-3 px-3">
                      <div className="flex gap-2">
                        {item.sdsAvailable && <span className="text-xs text-blue-600 font-medium cursor-pointer hover:underline">SDS</span>}
                        {item.coaAvailable && <span className="text-xs text-blue-600 font-medium cursor-pointer hover:underline">COA</span>}
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <select
                        value={item.selectedVariantId}
                        onChange={(e) => updateVariant(item.id, e.target.value)}
                        className="h-[32px] px-2 w-full border border-[var(--border)] rounded text-xs bg-[var(--bg-card)] text-[var(--text)]"
                      >
                        {item.variants.map((v) => (
                          <option key={v.id} value={v.id}>
                            {v.size}{v.unit} {v.stockQty > 0 ? `(재고 ${v.stockQty})` : '(품절)'}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="py-3 px-3 text-right text-[var(--text)]">
                      {formatCurrency(item.unitPrice)}
                    </td>
                    <td className="py-3 px-3">
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                        min={1}
                        className="w-[60px] h-[32px] px-2 text-center border border-[var(--border)] rounded text-sm bg-[var(--bg-card)] text-[var(--text)]"
                      />
                    </td>
                    <td className="py-3 px-3 text-right font-medium text-[var(--text)]">
                      {formatCurrency(item.unitPrice * item.quantity)}
                    </td>
                    <td className="py-3 px-3">
                      <button onClick={() => removeItem(item.id)} className="text-[var(--text-secondary)] hover:text-red-500">
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* 합계 */}
            {selectedItems.length > 0 && (
              <div className="mt-3 pt-3 border-t border-[var(--border)] flex items-center justify-between px-3">
                <span className="text-sm text-[var(--text-secondary)]">
                  선택 {selectedItems.length}개 / 전체 {items.length}개
                </span>
                <div className="text-right">
                  <span className="text-sm text-[var(--text-secondary)] mr-2">합계 (VAT 별도)</span>
                  <span className="text-lg font-bold text-[var(--text)]">{formatCurrency(totalAmount)}</span>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="mt-4 py-12 text-center text-[var(--text-secondary)]">
            <FlaskConical size={40} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">검색하여 제품을 추가하세요</p>
            <p className="text-xs mt-1">제품번호, 제품명, CAS번호로 검색할 수 있습니다</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={resetAll}
            className="h-[38px] px-5 border border-[var(--border)] text-sm text-[var(--text)] rounded-lg hover:bg-gray-50"
          >
            초기화
          </button>
          <button
            onClick={handleQuoteRequest}
            disabled={selectedItems.length === 0}
            className="h-[38px] px-5 border border-blue-600 text-blue-600 text-sm font-medium rounded-lg hover:bg-blue-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <FileText size={14} />
            견적 요청
          </button>
          <button
            onClick={handleDirectOrder}
            disabled={selectedItems.length === 0}
            className="h-[38px] px-5 border-2 border-blue-600 text-blue-600 text-sm font-medium rounded-lg hover:bg-blue-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Zap size={14} />
            바로 주문하기
          </button>
          <button
            onClick={handleAddToCart}
            disabled={selectedItems.length === 0}
            className="h-[38px] px-5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <ShoppingCart size={14} />
            장바구니에 추가
          </button>
        </div>
      </div>

      {/* CSV Upload */}
      <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border)] p-5">
        <h3 className="text-base font-semibold text-[var(--text)] mb-2">CSV / 엑셀 파일 업로드</h3>
        <p className="text-xs text-[var(--text-secondary)] mb-4">
          카탈로그번호, 수량이 포함된 파일을 업로드하여 한번에 주문할 수 있습니다.
        </p>
        <div className="border-2 border-dashed border-[var(--border)] rounded-xl p-10 text-center hover:border-blue-400 transition-colors cursor-pointer">
          <Upload size={32} className="mx-auto mb-3 text-[var(--text-secondary)]" />
          <p className="text-sm text-[var(--text)]">CSV 또는 Excel 파일을 드래그하세요</p>
          <p className="text-xs text-[var(--text-secondary)] mt-1">또는 클릭하여 파일 선택</p>
          <p className="text-xs text-[var(--text-secondary)] mt-3">지원 형식: .csv, .xlsx | 최대 10MB</p>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-800 text-white px-6 py-3 rounded-lg shadow-xl text-sm z-50 animate-fade-in">
          {toast}
        </div>
      )}
    </div>
  );
}
