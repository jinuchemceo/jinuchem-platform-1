'use client';

import { useState } from 'react';
import { Search, Plus, Package, AlertTriangle, Clock, FlaskConical, X, MapPin } from 'lucide-react';
import { formatCurrency } from '@jinuchem/shared';

interface InventoryItem {
  id: string;
  name: string;
  casNumber: string;
  quantity: number;
  unit: string;
  location: string;
  expiryDate: string;
  minStock: number;
  status: 'normal' | 'low' | 'expired';
}

const sampleInventory: InventoryItem[] = [
  { id: '1', name: 'Ethyl alcohol, Pure', casNumber: '64-17-5', quantity: 3, unit: 'L', location: 'A-1-03', expiryDate: '2027-06-15', minStock: 1, status: 'normal' },
  { id: '2', name: 'Acetone, ACS Grade', casNumber: '67-64-1', quantity: 0.5, unit: 'L', location: 'A-2-01', expiryDate: '2027-03-20', minStock: 1, status: 'low' },
  { id: '3', name: 'Methanol, HPLC Grade', casNumber: '67-56-1', quantity: 2, unit: 'L', location: 'B-1-05', expiryDate: '2026-04-10', minStock: 1, status: 'normal' },
  { id: '4', name: 'Sodium Hydroxide', casNumber: '1310-73-2', quantity: 500, unit: 'g', location: 'C-3-02', expiryDate: '2026-03-25', minStock: 200, status: 'expired' },
  { id: '5', name: 'Hydrochloric Acid', casNumber: '7647-01-0', quantity: 200, unit: 'mL', location: 'D-1-01', expiryDate: '2027-12-01', minStock: 500, status: 'low' },
  { id: '6', name: 'PIPES', casNumber: '5625-37-6', quantity: 10, unit: 'g', location: 'E-2-04', expiryDate: '2028-01-30', minStock: 5, status: 'normal' },
];

const statusConfig: Record<string, { label: string; color: string }> = {
  normal: { label: '정상', color: 'bg-emerald-100 text-emerald-700' },
  low: { label: '부족', color: 'bg-amber-100 text-amber-700' },
  expired: { label: '만료', color: 'bg-red-100 text-red-700' },
};

export default function InventoryPage() {
  const [items, setItems] = useState(sampleInventory);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [formName, setFormName] = useState('');
  const [formCas, setFormCas] = useState('');
  const [formQty, setFormQty] = useState('');
  const [formUnit, setFormUnit] = useState('mL');
  const [formLocation, setFormLocation] = useState('');
  const [formExpiry, setFormExpiry] = useState('');
  const [formMinStock, setFormMinStock] = useState('');

  const filtered = items.filter((item) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.name.toLowerCase().includes(q) ||
      item.casNumber.includes(q) ||
      item.location.toLowerCase().includes(q)
    );
  });

  const totalCount = items.length;
  const lowCount = items.filter((i) => i.status === 'low').length;
  const expiredCount = items.filter((i) => i.status === 'expired').length;

  const handleAdd = () => {
    if (!formName || !formCas) return;
    const newItem: InventoryItem = {
      id: String(Date.now()),
      name: formName,
      casNumber: formCas,
      quantity: Number(formQty) || 0,
      unit: formUnit,
      location: formLocation,
      expiryDate: formExpiry,
      minStock: Number(formMinStock) || 0,
      status: 'normal',
    };
    setItems((prev) => [newItem, ...prev]);
    setShowAddModal(false);
    setFormName(''); setFormCas(''); setFormQty(''); setFormUnit('mL'); setFormLocation(''); setFormExpiry(''); setFormMinStock('');
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[var(--text)]">내 시약장</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="h-[38px] px-4 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 flex items-center gap-1.5"
        >
          <Plus size={14} /> 시약 추가
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border)] p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
            <Package size={20} className="text-blue-600" />
          </div>
          <div>
            <p className="text-xs text-[var(--text-secondary)]">총 보유</p>
            <p className="text-xl font-bold text-[var(--text)]">{totalCount}종</p>
          </div>
        </div>
        <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border)] p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
            <AlertTriangle size={20} className="text-amber-600" />
          </div>
          <div>
            <p className="text-xs text-[var(--text-secondary)]">부족 항목</p>
            <p className="text-xl font-bold text-amber-600">{lowCount}종</p>
          </div>
        </div>
        <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border)] p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
            <Clock size={20} className="text-red-600" />
          </div>
          <div>
            <p className="text-xs text-[var(--text-secondary)]">만료 임박</p>
            <p className="text-xl font-bold text-red-600">{expiredCount}종</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="시약명, CAS번호, 위치 검색..."
          className="w-full pl-10 pr-4 h-[38px] border border-[var(--border)] rounded-lg bg-[var(--bg-card)] text-sm text-[var(--text)]"
        />
      </div>

      {/* Table */}
      <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border)] overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-[var(--border)]">
              <th className="text-left px-4 py-3 font-medium text-[var(--text-secondary)]">시약명</th>
              <th className="text-left px-4 py-3 font-medium text-[var(--text-secondary)]">CAS No.</th>
              <th className="text-right px-4 py-3 font-medium text-[var(--text-secondary)]">보유량</th>
              <th className="text-center px-4 py-3 font-medium text-[var(--text-secondary)]">위치</th>
              <th className="text-center px-4 py-3 font-medium text-[var(--text-secondary)]">유효기한</th>
              <th className="text-right px-4 py-3 font-medium text-[var(--text-secondary)]">최소 재고</th>
              <th className="text-center px-4 py-3 font-medium text-[var(--text-secondary)]">상태</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item) => (
              <tr key={item.id} className="border-b border-[var(--border)] last:border-0 hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-[var(--text)]">{item.name}</td>
                <td className="px-4 py-3 font-mono text-xs text-[var(--text-secondary)]">{item.casNumber}</td>
                <td className="px-4 py-3 text-right text-[var(--text)]">
                  {item.quantity} {item.unit}
                </td>
                <td className="px-4 py-3 text-center">
                  <span className="inline-flex items-center gap-1 text-[var(--text-secondary)]">
                    <MapPin size={12} /> {item.location}
                  </span>
                </td>
                <td className="px-4 py-3 text-center text-[var(--text-secondary)]">{item.expiryDate}</td>
                <td className="px-4 py-3 text-right text-[var(--text-secondary)]">
                  {item.minStock} {item.unit}
                </td>
                <td className="px-4 py-3 text-center">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusConfig[item.status].color}`}>
                    {statusConfig[item.status].label}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-[var(--text-secondary)]">
            <FlaskConical size={40} className="mx-auto mb-3 opacity-30" />
            <p>검색 결과가 없습니다</p>
          </div>
        )}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center" onClick={() => setShowAddModal(false)}>
          <div className="bg-[var(--bg-card)] rounded-2xl w-[520px] p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-[var(--text)]">시약 추가</h2>
              <button onClick={() => setShowAddModal(false)} className="text-[var(--text-secondary)] hover:text-[var(--text)]">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--text)] mb-1.5">시약명</label>
                <input
                  type="text" value={formName} onChange={(e) => setFormName(e.target.value)}
                  placeholder="시약명을 입력하세요"
                  className="w-full h-[38px] px-3 border border-[var(--border)] rounded-lg bg-[var(--bg)] text-sm text-[var(--text)]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text)] mb-1.5">CAS 번호</label>
                <input
                  type="text" value={formCas} onChange={(e) => setFormCas(e.target.value)}
                  placeholder="예: 64-17-5"
                  className="w-full h-[38px] px-3 border border-[var(--border)] rounded-lg bg-[var(--bg)] text-sm text-[var(--text)]"
                />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-medium text-[var(--text)] mb-1.5">수량</label>
                  <input
                    type="number" value={formQty} onChange={(e) => setFormQty(e.target.value)}
                    placeholder="0"
                    className="w-full h-[38px] px-3 border border-[var(--border)] rounded-lg bg-[var(--bg)] text-sm text-[var(--text)]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text)] mb-1.5">단위</label>
                  <select
                    value={formUnit} onChange={(e) => setFormUnit(e.target.value)}
                    className="w-full h-[38px] px-3 border border-[var(--border)] rounded-lg bg-[var(--bg)] text-sm text-[var(--text)]"
                  >
                    <option value="mL">mL</option>
                    <option value="L">L</option>
                    <option value="g">g</option>
                    <option value="kg">kg</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text)] mb-1.5">최소 재고</label>
                  <input
                    type="number" value={formMinStock} onChange={(e) => setFormMinStock(e.target.value)}
                    placeholder="0"
                    className="w-full h-[38px] px-3 border border-[var(--border)] rounded-lg bg-[var(--bg)] text-sm text-[var(--text)]"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-[var(--text)] mb-1.5">보관 위치</label>
                  <input
                    type="text" value={formLocation} onChange={(e) => setFormLocation(e.target.value)}
                    placeholder="예: A-1-03"
                    className="w-full h-[38px] px-3 border border-[var(--border)] rounded-lg bg-[var(--bg)] text-sm text-[var(--text)]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text)] mb-1.5">유효기한</label>
                  <input
                    type="date" value={formExpiry} onChange={(e) => setFormExpiry(e.target.value)}
                    className="w-full h-[38px] px-3 border border-[var(--border)] rounded-lg bg-[var(--bg)] text-sm text-[var(--text)]"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-2 mt-5">
              <button onClick={() => setShowAddModal(false)} className="flex-1 h-[38px] border border-[var(--border)] text-[var(--text-secondary)] text-sm rounded-lg hover:border-blue-400">
                취소
              </button>
              <button onClick={handleAdd} className="flex-1 h-[38px] bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700">
                추가하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
