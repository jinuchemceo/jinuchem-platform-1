'use client';

import { useState } from 'react';
import { Search, ToggleLeft, ToggleRight, Download } from 'lucide-react';

interface InventoryEntry {
  catalogNo: string;
  name: string;
  size: string;
  stockQty: number;
  sameDayShip: boolean;
  deliveryDate: string;
}

const sampleInventory: InventoryEntry[] = [
  { catalogNo: 'JC-SC-001', name: 'Sodium Chloride', size: '100g', stockQty: 150, sameDayShip: true, deliveryDate: '2026-03-21' },
  { catalogNo: 'JC-SC-001', name: 'Sodium Chloride', size: '500g', stockQty: 85, sameDayShip: true, deliveryDate: '2026-03-21' },
  { catalogNo: 'JC-SC-001', name: 'Sodium Chloride', size: '1kg', stockQty: 42, sameDayShip: true, deliveryDate: '2026-03-21' },
  { catalogNo: 'JC-ET-002', name: 'Ethanol (200 Proof)', size: '500mL', stockQty: 60, sameDayShip: true, deliveryDate: '2026-03-21' },
  { catalogNo: 'JC-ET-002', name: 'Ethanol (200 Proof)', size: '4L', stockQty: 25, sameDayShip: false, deliveryDate: '2026-03-24' },
  { catalogNo: 'JC-AC-003', name: 'Acetonitrile (HPLC)', size: '1L', stockQty: 38, sameDayShip: true, deliveryDate: '2026-03-21' },
  { catalogNo: 'JC-AC-003', name: 'Acetonitrile (HPLC)', size: '2.5L', stockQty: 12, sameDayShip: false, deliveryDate: '2026-03-25' },
  { catalogNo: 'JC-MT-004', name: 'Methanol (ACS Grade)', size: '2.5L', stockQty: 55, sameDayShip: true, deliveryDate: '2026-03-21' },
  { catalogNo: 'JC-MT-004', name: 'Methanol (ACS Grade)', size: '4L', stockQty: 0, sameDayShip: false, deliveryDate: '2026-04-01' },
  { catalogNo: 'JC-SA-005', name: 'Sulfuric Acid (98%)', size: '2.5L', stockQty: 8, sameDayShip: false, deliveryDate: '2026-03-26' },
  { catalogNo: 'JC-TL-006', name: 'Toluene (ACS Grade)', size: '4L', stockQty: 0, sameDayShip: false, deliveryDate: '2026-04-05' },
  { catalogNo: 'JC-HX-007', name: 'Hexane (HPLC Grade)', size: '4L', stockQty: 20, sameDayShip: true, deliveryDate: '2026-03-21' },
];

export default function InventoryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [inventoryData, setInventoryData] = useState(sampleInventory);
  const [statusFilter, setStatusFilter] = useState<'전체' | '정상' | '부족' | '품절'>('전체');

  const toggleSameDayShip = (index: number) => {
    setInventoryData(prev => prev.map((item, i) => i === index ? { ...item, sameDayShip: !item.sameDayShip } : item));
  };

  const totalSKU = inventoryData.length;
  const outOfStock = inventoryData.filter(i => i.stockQty === 0).length;
  const lowStock = inventoryData.filter(i => i.stockQty > 0 && i.stockQty < 15).length;
  const normal = totalSKU - outOfStock - lowStock;

  const counts = { '전체': totalSKU, '정상': normal, '부족': lowStock, '품절': outOfStock };

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 8;

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  };

  const allFiltered = inventoryData
    .filter(i => {
      if (statusFilter === '품절') return i.stockQty === 0;
      if (statusFilter === '부족') return i.stockQty > 0 && i.stockQty < 15;
      if (statusFilter === '정상') return i.stockQty >= 15;
      return true;
    })
    .filter(i =>
      !searchQuery ||
      i.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.catalogNo.toLowerCase().includes(searchQuery.toLowerCase())
    );
  const totalPages = Math.ceil(allFiltered.length / perPage);
  const filtered = allFiltered.slice((currentPage - 1) * perPage, currentPage * perPage);
  const toggleAll = () => {
    if (selectedIds.size === filtered.length) setSelectedIds(new Set());
    else setSelectedIds(new Set(filtered.map((i, idx) => `${i.catalogNo}-${i.size}`)));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>재고 관리</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>제품별 재고 수량과 출고 설정을 관리합니다</p>
        </div>
        <button
          className="flex items-center gap-1.5 px-4 h-[38px] border rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors"
          style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
        >
          <Download size={14} /> 엑셀 일괄 수정
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5">
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>총 SKU</p>
          <p className="text-2xl font-bold mt-1" style={{ color: 'var(--text)' }}>{totalSKU}</p>
        </div>
        <div className="bg-[var(--bg-card)] border-l-3 border border-[var(--border)] rounded-xl p-5" style={{ borderLeftColor: 'var(--warning)', borderLeftWidth: 3 }}>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>재고 부족</p>
          <p className="text-2xl font-bold mt-1" style={{ color: 'var(--warning)' }}>{lowStock}</p>
        </div>
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5" style={{ borderLeftColor: 'var(--danger)', borderLeftWidth: 3 }}>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>품절</p>
          <p className="text-2xl font-bold mt-1" style={{ color: 'var(--danger)' }}>{outOfStock}</p>
        </div>
      </div>

      {/* Filter + Search */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex gap-2">
          {(['전체', '정상', '부족', '품절'] as const).map(tab => (
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
        <div className="relative flex-1 max-w-xs">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-secondary)' }} />
          <input
            type="search"
            placeholder="제품명, 카탈로그번호 검색..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 h-[38px] border rounded-lg text-sm focus:outline-none"
            style={{ borderColor: 'var(--border)', background: 'var(--bg)', color: 'var(--text)' }}
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-gray-50" style={{ borderColor: 'var(--border)' }}>
              <th className="w-10 px-3 py-3"><input type="checkbox" checked={selectedIds.size === filtered.length && filtered.length > 0} onChange={toggleAll} className="accent-purple-600" /></th>
              <th className="text-left px-5 py-3 font-medium" style={{ color: 'var(--text-secondary)' }}>카탈로그번호</th>
              <th className="text-left px-5 py-3 font-medium" style={{ color: 'var(--text-secondary)' }}>제품명</th>
              <th className="text-center px-5 py-3 font-medium" style={{ color: 'var(--text-secondary)' }}>규격</th>
              <th className="text-center px-5 py-3 font-medium" style={{ color: 'var(--text-secondary)' }}>재고 수량</th>
              <th className="text-center px-5 py-3 font-medium" style={{ color: 'var(--text-secondary)' }}>상태</th>
              <th className="text-center px-5 py-3 font-medium" style={{ color: 'var(--text-secondary)' }}>당일출고</th>
              <th className="text-center px-5 py-3 font-medium" style={{ color: 'var(--text-secondary)' }}>납품예정일</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item, index) => (
              <tr key={`${item.catalogNo}-${item.size}`} className="border-b last:border-0 hover:bg-gray-50 transition-colors" style={{ borderColor: 'var(--border)' }}>
                <td className="w-10 px-3 py-3"><input type="checkbox" checked={selectedIds.has(`${item.catalogNo}-${item.size}`)} onChange={() => toggleSelect(`${item.catalogNo}-${item.size}`)} className="accent-purple-600" /></td>
                <td className="px-5 py-3 font-medium" style={{ color: 'var(--primary)' }}>{item.catalogNo}</td>
                <td className="px-5 py-3" style={{ color: 'var(--text)' }}>{item.name}</td>
                <td className="px-5 py-3 text-center" style={{ color: 'var(--text)' }}>{item.size}</td>
                <td className="px-5 py-3 text-center">
                  <span className={`font-semibold ${item.stockQty === 0 ? 'text-red-500' : item.stockQty < 15 ? 'text-orange-500' : ''}`} style={item.stockQty >= 15 ? { color: 'var(--text)' } : {}}>
                    {item.stockQty}
                  </span>
                </td>
                <td className="px-5 py-3 text-center">
                  {item.stockQty === 0 && <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-600">품절</span>}
                  {item.stockQty > 0 && item.stockQty < 15 && <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-600">부족</span>}
                  {item.stockQty >= 15 && <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">정상</span>}
                </td>
                <td className="px-5 py-3 text-center">
                  <button onClick={() => toggleSameDayShip(index)} className="inline-flex items-center justify-center">
                    {item.sameDayShip
                      ? <ToggleRight size={24} style={{ color: 'var(--primary)' }} />
                      : <ToggleLeft size={24} className="text-gray-300" />
                    }
                  </button>
                </td>
                <td className="px-5 py-3 text-center" style={{ color: 'var(--text-secondary)' }}>{item.deliveryDate}</td>
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
    </div>
  );
}
