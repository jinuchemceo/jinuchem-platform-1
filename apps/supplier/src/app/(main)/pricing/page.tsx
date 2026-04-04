'use client';

import { useState } from 'react';
import { Pencil, Search, Download, Plus } from 'lucide-react';

interface PriceEntry {
  catalogNo: string;
  name: string;
  size: string;
  listPrice: string;
  salePrice: string;
  discountRate: string;
  validUntil: string;
}

const samplePrices: PriceEntry[] = [
  { catalogNo: 'JC-SC-001', name: 'Sodium Chloride', size: '100g', listPrice: '₩8,000', salePrice: '₩6,800', discountRate: '15%', validUntil: '2026-06-30' },
  { catalogNo: 'JC-SC-001', name: 'Sodium Chloride', size: '500g', listPrice: '₩15,000', salePrice: '₩12,750', discountRate: '15%', validUntil: '2026-06-30' },
  { catalogNo: 'JC-SC-001', name: 'Sodium Chloride', size: '1kg', listPrice: '₩25,000', salePrice: '₩21,250', discountRate: '15%', validUntil: '2026-06-30' },
  { catalogNo: 'JC-ET-002', name: 'Ethanol (200 Proof)', size: '500mL', listPrice: '₩35,000', salePrice: '₩31,500', discountRate: '10%', validUntil: '2026-06-30' },
  { catalogNo: 'JC-ET-002', name: 'Ethanol (200 Proof)', size: '4L', listPrice: '₩85,000', salePrice: '₩76,500', discountRate: '10%', validUntil: '2026-06-30' },
  { catalogNo: 'JC-AC-003', name: 'Acetonitrile (HPLC)', size: '1L', listPrice: '₩65,000', salePrice: '₩58,500', discountRate: '10%', validUntil: '2026-06-30' },
  { catalogNo: 'JC-AC-003', name: 'Acetonitrile (HPLC)', size: '2.5L', listPrice: '₩120,000', salePrice: '₩102,000', discountRate: '15%', validUntil: '2026-06-30' },
  { catalogNo: 'JC-MT-004', name: 'Methanol (ACS Grade)', size: '2.5L', listPrice: '₩65,000', salePrice: '₩55,250', discountRate: '15%', validUntil: '2026-06-30' },
  { catalogNo: 'JC-MT-004', name: 'Methanol (ACS Grade)', size: '4L', listPrice: '₩75,000', salePrice: '₩67,500', discountRate: '10%', validUntil: '2026-06-30' },
  { catalogNo: 'JC-SA-005', name: 'Sulfuric Acid (98%)', size: '2.5L', listPrice: '₩95,000', salePrice: '₩85,500', discountRate: '10%', validUntil: '2026-06-30' },
];

const promos = [
  { name: '신규 연구실 환영 할인', type: '쿠폰', discount: '10%', period: '2026-04-01 ~ 04-30', usage: '12 / 100', active: true },
  { name: '용매 5+1 이벤트', type: '묶음', discount: '1개 무료', period: '2026-04-01 ~ 04-15', usage: '3 / 50', active: true },
];

export default function PricingPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSection, setActiveSection] = useState<'price' | 'promo'>('price');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 8;

  const allFiltered = samplePrices.filter(p =>
    !searchQuery ||
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.catalogNo.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const totalPages = Math.ceil(allFiltered.length / perPage);
  const filtered = allFiltered.slice((currentPage - 1) * perPage, currentPage * perPage);

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  };
  const toggleAll = () => {
    if (selectedIds.size === filtered.length) setSelectedIds(new Set());
    else setSelectedIds(new Set(filtered.map(p => `${p.catalogNo}-${p.size}`)));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>가격 / 프로모션</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>제품 가격과 프로모션을 관리합니다</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveSection('price')}
            className={`px-4 h-[38px] text-sm font-semibold rounded-lg border transition-colors ${activeSection === 'price' ? 'bg-purple-600 text-white border-purple-600' : 'hover:bg-gray-50'}`}
            style={activeSection !== 'price' ? { borderColor: 'var(--border)', color: 'var(--text)' } : {}}
          >
            가격 관리
          </button>
          <button
            onClick={() => setActiveSection('promo')}
            className={`px-4 h-[38px] text-sm font-semibold rounded-lg border transition-colors ${activeSection === 'promo' ? 'bg-purple-600 text-white border-purple-600' : 'hover:bg-gray-50'}`}
            style={activeSection !== 'promo' ? { borderColor: 'var(--border)', color: 'var(--text)' } : {}}
          >
            프로모션
          </button>
        </div>
      </div>

      {activeSection === 'price' ? (
        <>
          {/* Actions */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative flex-1 max-w-sm">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-secondary)' }} />
              <input
                type="search"
                placeholder="카탈로그번호, 제품명 검색..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 h-[38px] border rounded-lg text-sm focus:outline-none"
                style={{ borderColor: 'var(--border)', background: 'var(--bg)', color: 'var(--text)' }}
              />
            </div>
            <button
              className="flex items-center gap-1.5 px-4 h-[38px] border rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors"
              style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
            >
              일괄 가격 변경
            </button>
            <button
              className="flex items-center gap-1.5 px-4 h-[38px] border rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors"
              style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
            >
              <Download size={14} /> XLS 내보내기
            </button>
          </div>

          {/* Price Table */}
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50" style={{ borderColor: 'var(--border)' }}>
                  <th className="w-10 px-3 py-3"><input type="checkbox" checked={selectedIds.size === filtered.length && filtered.length > 0} onChange={toggleAll} className="accent-purple-600" /></th>
                  <th className="text-left px-5 py-3 font-medium" style={{ color: 'var(--text-secondary)' }}>카탈로그번호</th>
                  <th className="text-left px-5 py-3 font-medium" style={{ color: 'var(--text-secondary)' }}>제품명</th>
                  <th className="text-center px-5 py-3 font-medium" style={{ color: 'var(--text-secondary)' }}>규격</th>
                  <th className="text-right px-5 py-3 font-medium" style={{ color: 'var(--text-secondary)' }}>정가</th>
                  <th className="text-right px-5 py-3 font-medium" style={{ color: 'var(--text-secondary)' }}>판매가</th>
                  <th className="text-center px-5 py-3 font-medium" style={{ color: 'var(--text-secondary)' }}>할인율</th>
                  <th className="text-center px-5 py-3 font-medium" style={{ color: 'var(--text-secondary)' }}>유효기간</th>
                  <th className="text-center px-5 py-3 font-medium" style={{ color: 'var(--text-secondary)' }}>관리</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(p => (
                  <tr key={`${p.catalogNo}-${p.size}`} className="border-b last:border-0 hover:bg-gray-50 transition-colors" style={{ borderColor: 'var(--border)' }}>
                    <td className="w-10 px-3 py-3"><input type="checkbox" checked={selectedIds.has(`${p.catalogNo}-${p.size}`)} onChange={() => toggleSelect(`${p.catalogNo}-${p.size}`)} className="accent-purple-600" /></td>
                    <td className="px-5 py-3 font-medium" style={{ color: 'var(--primary)' }}>{p.catalogNo}</td>
                    <td className="px-5 py-3" style={{ color: 'var(--text)' }}>{p.name}</td>
                    <td className="px-5 py-3 text-center" style={{ color: 'var(--text)' }}>{p.size}</td>
                    <td className="px-5 py-3 text-right line-through" style={{ color: 'var(--text-secondary)' }}>{p.listPrice}</td>
                    <td className="px-5 py-3 text-right font-semibold" style={{ color: 'var(--text)' }}>{p.salePrice}</td>
                    <td className="px-5 py-3 text-center">
                      <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-600">{p.discountRate}</span>
                    </td>
                    <td className="px-5 py-3 text-center" style={{ color: 'var(--text-secondary)' }}>{p.validUntil}</td>
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
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-1">
              <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="w-9 h-9 flex items-center justify-center rounded-full text-sm hover:bg-gray-100 disabled:opacity-30" style={{ color: 'var(--text-secondary)' }}>&lt;</button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => setCurrentPage(p)} className={`w-9 h-9 flex items-center justify-center rounded-full text-sm font-medium ${currentPage === p ? 'bg-purple-600 text-white' : 'hover:bg-gray-100'}`} style={currentPage !== p ? { color: 'var(--text-secondary)' } : {}}>{p}</button>
              ))}
              <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="w-9 h-9 flex items-center justify-center rounded-full text-sm hover:bg-gray-100 disabled:opacity-30" style={{ color: 'var(--text-secondary)' }}>&gt;</button>
            </div>
          )}
        </>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-end">
            <button className="flex items-center gap-1.5 px-4 h-[38px] bg-purple-600 text-white text-sm font-semibold rounded-lg hover:bg-purple-700 transition-colors">
              <Plus size={16} /> 프로모션 추가
            </button>
          </div>
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50" style={{ borderColor: 'var(--border)' }}>
                  <th className="text-left px-5 py-3 font-medium" style={{ color: 'var(--text-secondary)' }}>프로모션명</th>
                  <th className="text-center px-5 py-3 font-medium" style={{ color: 'var(--text-secondary)' }}>유형</th>
                  <th className="text-center px-5 py-3 font-medium" style={{ color: 'var(--text-secondary)' }}>할인</th>
                  <th className="text-center px-5 py-3 font-medium" style={{ color: 'var(--text-secondary)' }}>기간</th>
                  <th className="text-center px-5 py-3 font-medium" style={{ color: 'var(--text-secondary)' }}>사용횟수</th>
                  <th className="text-center px-5 py-3 font-medium" style={{ color: 'var(--text-secondary)' }}>상태</th>
                  <th className="text-center px-5 py-3 font-medium" style={{ color: 'var(--text-secondary)' }}>관리</th>
                </tr>
              </thead>
              <tbody>
                {promos.map(p => (
                  <tr key={p.name} className="border-b last:border-0 hover:bg-gray-50 transition-colors" style={{ borderColor: 'var(--border)' }}>
                    <td className="px-5 py-3 font-medium" style={{ color: 'var(--text)' }}>{p.name}</td>
                    <td className="px-5 py-3 text-center" style={{ color: 'var(--text)' }}>{p.type}</td>
                    <td className="px-5 py-3 text-center font-semibold" style={{ color: 'var(--primary)' }}>{p.discount}</td>
                    <td className="px-5 py-3 text-center" style={{ color: 'var(--text-secondary)' }}>{p.period}</td>
                    <td className="px-5 py-3 text-center" style={{ color: 'var(--text)' }}>{p.usage}</td>
                    <td className="px-5 py-3 text-center">
                      <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">활성</span>
                    </td>
                    <td className="px-5 py-3 text-center">
                      <button className="px-3 py-1.5 text-xs font-semibold rounded-lg border hover:bg-gray-50 transition-colors" style={{ borderColor: 'var(--border)', color: 'var(--text)' }}>
                        수정
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
