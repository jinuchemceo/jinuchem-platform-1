'use client';

import { useState } from 'react';
import { Search, Plus, Upload, MoreHorizontal, Filter } from 'lucide-react';

const suppliers = ['전체', 'Sigma-Aldrich', 'Alfa Aesar', 'TCI', 'Daejung', 'Samchun'];
const categories = ['전체', '유기화합물', '무기화합물', '분석용시약', '실험소모품', '안전장비'];

const products = [
  { id: 1, catalogNo: 'SA-A2153', name: 'Acetone', supplier: 'Sigma-Aldrich', category: '유기화합물', type: '시약', variants: 4, status: '판매중' },
  { id: 2, catalogNo: 'AA-010290', name: 'Sodium Hydroxide', supplier: 'Alfa Aesar', category: '무기화합물', type: '시약', variants: 3, status: '판매중' },
  { id: 3, catalogNo: 'TCI-A0003', name: 'Acetic Acid', supplier: 'TCI', category: '유기화합물', type: '시약', variants: 5, status: '판매중' },
  { id: 4, catalogNo: 'DJ-4019', name: 'Ethanol', supplier: 'Daejung', category: '유기화합물', type: '시약', variants: 6, status: '판매중' },
  { id: 5, catalogNo: 'SC-7732', name: 'Sulfuric Acid', supplier: 'Samchun', category: '무기화합물', type: '시약', variants: 2, status: '판매중' },
  { id: 6, catalogNo: 'SA-M1775', name: 'Methanol', supplier: 'Sigma-Aldrich', category: '유기화합물', type: '시약', variants: 4, status: '일시품절' },
  { id: 7, catalogNo: 'SUP-GL100', name: '니트릴 장갑 (M)', supplier: '-', category: '안전장비', type: '소모품', variants: 3, status: '판매중' },
  { id: 8, catalogNo: 'SUP-PP050', name: '마이크로피펫 팁 (200uL)', supplier: '-', category: '실험소모품', type: '소모품', variants: 2, status: '판매중' },
  { id: 9, catalogNo: 'AA-012345', name: 'Hydrochloric Acid', supplier: 'Alfa Aesar', category: '무기화합물', type: '시약', variants: 3, status: '판매중' },
  { id: 10, catalogNo: 'TCI-T0001', name: 'Toluene', supplier: 'TCI', category: '유기화합물', type: '시약', variants: 4, status: '판매중단' },
];

export default function ProductsPage() {
  const [selectedSupplier, setSelectedSupplier] = useState('전체');
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = products.filter((p) => {
    const matchesSupplier = selectedSupplier === '전체' || p.supplier === selectedSupplier;
    const matchesCategory = selectedCategory === '전체' || p.category === selectedCategory;
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.catalogNo.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSupplier && matchesCategory && matchesSearch;
  });

  const statusColors: Record<string, string> = {
    판매중: 'bg-emerald-100 text-emerald-700',
    일시품절: 'bg-amber-100 text-amber-700',
    판매중단: 'bg-red-100 text-red-700',
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text)]">제품 관리</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">등록 제품 {products.length}건</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="h-[var(--btn-height)] px-4 bg-[var(--bg)] border border-[var(--border)] text-[var(--text)] rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors flex items-center gap-2">
            <Upload size={16} />
            CSV 일괄 업로드
          </button>
          <button className="h-[var(--btn-height)] px-4 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors flex items-center gap-2">
            <Plus size={16} />
            제품 등록
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-4 space-y-3">
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="제품명, 카탈로그 번호 검색..."
              className="w-full pl-10 pr-4 h-[var(--btn-height)] border border-[var(--border)] rounded-lg bg-[var(--bg)] text-sm focus:outline-none focus:border-orange-500 text-[var(--text)]"
            />
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Filter size={14} className="text-[var(--text-secondary)]" />
            <span className="text-xs text-[var(--text-secondary)] font-medium">공급사</span>
            <select
              value={selectedSupplier}
              onChange={(e) => setSelectedSupplier(e.target.value)}
              className="h-[var(--btn-height)] px-3 border border-[var(--border)] rounded-lg bg-[var(--bg)] text-sm text-[var(--text)]"
            >
              {suppliers.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-[var(--text-secondary)] font-medium">카테고리</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="h-[var(--btn-height)] px-3 border border-[var(--border)] rounded-lg bg-[var(--bg)] text-sm text-[var(--text)]"
            >
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Product Table */}
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[var(--bg)] border-b border-[var(--border)]">
              <th className="text-left px-5 py-3 font-semibold text-[var(--text-secondary)]">카탈로그 번호</th>
              <th className="text-left px-5 py-3 font-semibold text-[var(--text-secondary)]">제품명</th>
              <th className="text-left px-5 py-3 font-semibold text-[var(--text-secondary)]">공급사</th>
              <th className="text-left px-5 py-3 font-semibold text-[var(--text-secondary)]">카테고리</th>
              <th className="text-left px-5 py-3 font-semibold text-[var(--text-secondary)]">유형</th>
              <th className="text-center px-5 py-3 font-semibold text-[var(--text-secondary)]">규격수</th>
              <th className="text-left px-5 py-3 font-semibold text-[var(--text-secondary)]">상태</th>
              <th className="text-center px-5 py-3 font-semibold text-[var(--text-secondary)]">관리</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr key={product.id} className="border-b border-[var(--border)] hover:bg-[var(--bg)] transition-colors">
                <td className="px-5 py-3.5 font-mono text-xs text-orange-600 font-medium">{product.catalogNo}</td>
                <td className="px-5 py-3.5 font-medium text-[var(--text)]">{product.name}</td>
                <td className="px-5 py-3.5 text-[var(--text-secondary)]">{product.supplier}</td>
                <td className="px-5 py-3.5 text-[var(--text)]">{product.category}</td>
                <td className="px-5 py-3.5">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    product.type === '시약' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {product.type}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-center text-[var(--text)]">{product.variants}</td>
                <td className="px-5 py-3.5">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[product.status] || ''}`}>
                    {product.status}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-center">
                  <button className="w-8 h-8 flex items-center justify-center rounded-lg text-[var(--text-secondary)] hover:bg-gray-100 transition-colors mx-auto">
                    <MoreHorizontal size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
