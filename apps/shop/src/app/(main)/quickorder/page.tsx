'use client';

import { useState } from 'react';
import { Search, Upload, Plus, Trash2, ShoppingCart, FlaskConical } from 'lucide-react';
import { formatCurrency } from '@jinuchem/shared';
import { sampleReagents } from '@/lib/mock-data';

interface QuickOrderItem {
  id: string;
  catalogNo: string;
  productName: string;
  supplierName: string;
  specialNote: string;
  sdsAvailable: boolean;
  coaAvailable: boolean;
  size: string;
  quantity: number;
  selected: boolean;
}

export default function QuickOrderPage() {
  const [searchType, setSearchType] = useState('catalog');
  const [searchInput, setSearchInput] = useState('');
  const [items, setItems] = useState<QuickOrderItem[]>([
    { id: '1', catalogNo: '459844', productName: 'Ethanol absolute', supplierName: 'Sigma-Aldrich', specialNote: '', sdsAvailable: true, coaAvailable: true, size: '500mL', quantity: 2, selected: true },
    { id: '2', catalogNo: 'A0003', productName: 'Acetone, ACS Grade', supplierName: 'TCI', specialNote: '', sdsAvailable: true, coaAvailable: false, size: '25mL', quantity: 1, selected: true },
    { id: '3', catalogNo: 'P0058', productName: 'PIPES, 고순도', supplierName: 'TCI', specialNote: '항공규제', sdsAvailable: true, coaAvailable: false, size: '5G', quantity: 1, selected: false },
  ]);

  const handleSearch = () => {
    if (!searchInput.trim()) return;
    const match = sampleReagents.find(
      (r) => r.catalogNo?.toLowerCase() === searchInput.toLowerCase() ||
             r.casNumber === searchInput ||
             r.name.toLowerCase().includes(searchInput.toLowerCase())
    );
    if (match) {
      const newItem: QuickOrderItem = {
        id: String(Date.now()),
        catalogNo: match.catalogNo || '',
        productName: match.name,
        supplierName: match.supplierName,
        specialNote: '',
        sdsAvailable: true,
        coaAvailable: match.supplierName === 'Sigma-Aldrich',
        size: match.variants[0]?.size + match.variants[0]?.unit || '',
        quantity: 1,
        selected: true,
      };
      setItems([...items, newItem]);
      setSearchInput('');
    }
  };

  const removeItem = (id: string) => setItems(items.filter((i) => i.id !== id));
  const toggleSelect = (id: string) => setItems(items.map((i) => i.id === id ? { ...i, selected: !i.selected } : i));
  const updateQuantity = (id: string, qty: number) => setItems(items.map((i) => i.id === id ? { ...i, quantity: Math.max(1, qty) } : i));

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
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="내용을 입력해 주세요."
            className="flex-1 h-[38px] px-4 border border-[var(--border)] rounded-lg text-sm bg-[var(--bg-card)] text-[var(--text)]"
          />
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
        {items.length > 0 && (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border)]">
                  <th className="text-left py-2 px-3 font-medium text-[var(--text-secondary)] w-[50px]">선택</th>
                  <th className="text-left py-2 px-3 font-medium text-[var(--text-secondary)] w-[100px]">제품번호</th>
                  <th className="text-left py-2 px-3 font-medium text-[var(--text-secondary)]">제품명</th>
                  <th className="text-left py-2 px-3 font-medium text-[var(--text-secondary)] w-[100px]">특이사항</th>
                  <th className="text-left py-2 px-3 font-medium text-[var(--text-secondary)] w-[100px]">제품정보</th>
                  <th className="text-left py-2 px-3 font-medium text-[var(--text-secondary)] w-[100px]">용량</th>
                  <th className="text-left py-2 px-3 font-medium text-[var(--text-secondary)] w-[80px]">수량</th>
                  <th className="w-[40px]"></th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="border-b border-[var(--border)] last:border-0">
                    <td className="py-3 px-3">
                      <input type="checkbox" checked={item.selected} onChange={() => toggleSelect(item.id)} className="accent-blue-600" />
                    </td>
                    <td className="py-3 px-3 font-mono text-[var(--text)]">{item.catalogNo}</td>
                    <td className="py-3 px-3">
                      <div className="font-medium text-[var(--text)]">{item.productName}</div>
                      <div className="text-xs text-[var(--text-secondary)]">{item.supplierName}</div>
                    </td>
                    <td className="py-3 px-3">
                      {item.specialNote ? (
                        <span className="text-xs text-red-600 font-medium bg-red-50 px-2 py-0.5 rounded">{item.specialNote}</span>
                      ) : <span className="text-[var(--text-secondary)]">-</span>}
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex gap-2">
                        {item.sdsAvailable && <span className="text-xs text-blue-600 font-medium cursor-pointer hover:underline">SDS</span>}
                        {item.coaAvailable && <span className="text-xs text-blue-600 font-medium cursor-pointer hover:underline">COA</span>}
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <select className="h-[32px] px-2 border border-[var(--border)] rounded text-xs bg-[var(--bg-card)] text-[var(--text)]">
                        <option>{item.size}</option>
                      </select>
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
                    <td className="py-3 px-3">
                      <button onClick={() => removeItem(item.id)} className="text-[var(--text-secondary)] hover:text-red-500">
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex justify-end gap-3 mt-4">
          <button className="h-[38px] px-5 border border-[var(--border)] text-sm text-[var(--text)] rounded-lg hover:bg-gray-50">
            초기화
          </button>
          <button className="h-[38px] px-5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 flex items-center gap-2">
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
    </div>
  );
}
