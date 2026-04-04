'use client';

import { useState } from 'react';
import { Plus, Pencil, Search } from 'lucide-react';
import Link from 'next/link';

interface Product {
  catalogNo: string;
  name: string;
  casNo: string;
  category: string;
  variants: number;
  status: '판매중' | '품절' | '단종';
}

const sampleProducts: Product[] = [
  { catalogNo: 'JC-SC-001', name: 'Sodium Chloride (NaCl)', casNo: '7647-14-5', category: '무기염', variants: 4, status: '판매중' },
  { catalogNo: 'JC-ET-002', name: 'Ethanol (C2H5OH)', casNo: '64-17-5', category: '알코올', variants: 3, status: '판매중' },
  { catalogNo: 'JC-AC-003', name: 'Acetonitrile (CH3CN)', casNo: '75-05-8', category: '유기용매', variants: 5, status: '판매중' },
  { catalogNo: 'JC-MT-004', name: 'Methanol (CH3OH)', casNo: '67-56-1', category: '알코올', variants: 4, status: '판매중' },
  { catalogNo: 'JC-SA-005', name: 'Sulfuric Acid (H2SO4)', casNo: '7664-93-9', category: '무기산', variants: 2, status: '판매중' },
  { catalogNo: 'JC-TL-006', name: 'Toluene (C7H8)', casNo: '108-88-3', category: '유기용매', variants: 3, status: '품절' },
  { catalogNo: 'JC-HX-007', name: 'Hexane (C6H14)', casNo: '110-54-3', category: '유기용매', variants: 2, status: '판매중' },
  { catalogNo: 'JC-HA-008', name: 'Hydrochloric Acid (HCl)', casNo: '7647-01-0', category: '무기산', variants: 3, status: '판매중' },
  { catalogNo: 'JC-PH-012', name: 'Potassium Hydroxide (KOH)', casNo: '1310-58-3', category: '무기염기', variants: 2, status: '단종' },
  { catalogNo: 'JC-IP-015', name: 'Isopropanol (C3H8O)', casNo: '67-63-0', category: '알코올', variants: 3, status: '판매중' },
];

const statusStyles: Record<string, string> = {
  '판매중': 'bg-green-100 text-green-700',
  '품절': 'bg-red-100 text-red-700',
  '단종': 'bg-gray-100 text-gray-500',
};

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('전체');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 8;

  const allFiltered = sampleProducts
    .filter(p => statusFilter === '전체' || p.status === statusFilter)
    .filter(p =>
      !searchQuery ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.catalogNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.casNo.includes(searchQuery)
    );
  const totalPages = Math.ceil(allFiltered.length / perPage);
  const filtered = allFiltered.slice((currentPage - 1) * perPage, currentPage * perPage);

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };
  const toggleAll = () => {
    if (selectedIds.size === filtered.length) setSelectedIds(new Set());
    else setSelectedIds(new Set(filtered.map(p => p.catalogNo)));
  };

  const counts = {
    '전체': sampleProducts.length,
    '판매중': sampleProducts.filter(p => p.status === '판매중').length,
    '품절': sampleProducts.filter(p => p.status === '품절').length,
    '단종': sampleProducts.filter(p => p.status === '단종').length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>제품 목록</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>등록된 제품을 관리합니다</p>
        </div>
        <Link
          href="/products/new"
          className="h-[38px] px-5 bg-purple-600 text-white text-sm font-semibold rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
          style={{ textDecoration: 'none' }}
        >
          <Plus size={16} /> 제품 등록
        </Link>
      </div>

      {/* Status Tabs */}
      <div className="flex gap-2">
        {(['전체', '판매중', '품절', '단종'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setStatusFilter(tab)}
            className={`px-4 py-2 text-sm rounded-lg border transition-colors ${
              statusFilter === tab ? 'bg-purple-600 text-white border-purple-600' : 'hover:bg-gray-50'
            }`}
            style={statusFilter !== tab ? { borderColor: 'var(--border)', color: 'var(--text-secondary)', background: 'var(--bg-card)' } : {}}
          >
            {tab}
            <span className={`ml-1.5 text-xs font-bold px-1.5 py-0.5 rounded-full ${statusFilter === tab ? 'bg-white/20' : 'bg-gray-100'}`}>
              {counts[tab]}
            </span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-secondary)' }} />
        <input
          type="search"
          placeholder="카탈로그번호, 제품명, CAS번호 검색..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 h-[38px] border rounded-lg text-sm focus:outline-none"
          style={{ borderColor: 'var(--border)', background: 'var(--bg)', color: 'var(--text)' }}
        />
      </div>

      {/* Table */}
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-gray-50" style={{ borderColor: 'var(--border)' }}>
              <th className="w-10 px-3 py-3"><input type="checkbox" checked={selectedIds.size === filtered.length && filtered.length > 0} onChange={toggleAll} className="accent-purple-600" /></th>
              <th className="text-left px-5 py-3 font-medium" style={{ color: 'var(--text-secondary)' }}>카탈로그번호</th>
              <th className="text-left px-5 py-3 font-medium" style={{ color: 'var(--text-secondary)' }}>제품명</th>
              <th className="text-left px-5 py-3 font-medium" style={{ color: 'var(--text-secondary)' }}>CAS No.</th>
              <th className="text-left px-5 py-3 font-medium" style={{ color: 'var(--text-secondary)' }}>카테고리</th>
              <th className="text-center px-5 py-3 font-medium" style={{ color: 'var(--text-secondary)' }}>규격 수</th>
              <th className="text-center px-5 py-3 font-medium" style={{ color: 'var(--text-secondary)' }}>상태</th>
              <th className="text-center px-5 py-3 font-medium" style={{ color: 'var(--text-secondary)' }}>관리</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(p => (
              <tr key={p.catalogNo} className="border-b last:border-0 hover:bg-gray-50 transition-colors" style={{ borderColor: 'var(--border)' }}>
                <td className="w-10 px-3 py-3"><input type="checkbox" checked={selectedIds.has(p.catalogNo)} onChange={() => toggleSelect(p.catalogNo)} className="accent-purple-600" /></td>
                <td className="px-5 py-3 font-medium" style={{ color: 'var(--primary)' }}>{p.catalogNo}</td>
                <td className="px-5 py-3 font-medium" style={{ color: 'var(--text)' }}>{p.name}</td>
                <td className="px-5 py-3" style={{ color: 'var(--text-secondary)' }}>{p.casNo}</td>
                <td className="px-5 py-3" style={{ color: 'var(--text)' }}>{p.category}</td>
                <td className="px-5 py-3 text-center" style={{ color: 'var(--text)' }}>{p.variants}개</td>
                <td className="px-5 py-3 text-center">
                  <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[p.status]}`}>{p.status}</span>
                </td>
                <td className="px-5 py-3 text-center">
                  <button className="w-8 h-8 inline-flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors" style={{ color: 'var(--text-secondary)' }}>
                    <Pencil size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-1">
          <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
            className="w-9 h-9 flex items-center justify-center rounded-full text-sm hover:bg-gray-100 disabled:opacity-30" style={{ color: 'var(--text-secondary)' }}>&lt;</button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <button key={p} onClick={() => setCurrentPage(p)}
              className={`w-9 h-9 flex items-center justify-center rounded-full text-sm font-medium ${currentPage === p ? 'bg-purple-600 text-white' : 'hover:bg-gray-100'}`}
              style={currentPage !== p ? { color: 'var(--text-secondary)' } : {}}>{p}</button>
          ))}
          <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
            className="w-9 h-9 flex items-center justify-center rounded-full text-sm hover:bg-gray-100 disabled:opacity-30" style={{ color: 'var(--text-secondary)' }}>&gt;</button>
        </div>
      )}

      {/* Selected count */}
      {selectedIds.size > 0 && (
        <div className="flex items-center gap-3 p-3 rounded-lg text-sm" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
          <span className="font-semibold">{selectedIds.size}개 선택됨</span>
          <button className="px-3 py-1 rounded-lg text-xs font-semibold border hover:bg-gray-50" style={{ borderColor: 'var(--border)', color: 'var(--text)' }}>일괄 판매중지</button>
          <button className="px-3 py-1 rounded-lg text-xs font-semibold border hover:bg-gray-50" style={{ borderColor: 'var(--border)', color: 'var(--text)' }}>일괄 삭제</button>
        </div>
      )}
    </div>
  );
}
