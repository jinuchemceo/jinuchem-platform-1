'use client';

import { useState } from 'react';
import {
  Package,
  AlertTriangle,
  Clock,
  Search,
  ShoppingCart,
  RefreshCw,
  CheckCircle,
  Filter,
} from 'lucide-react';

type InventoryStatus = '전체' | '정상' | '부족' | '만료임박';

interface InventoryItem {
  id: string;
  name: string;
  cas: string;
  quantity: string;
  unit: string;
  location: string;
  expiryDate: string;
  status: '정상' | '부족' | '만료임박';
  statusColor: string;
  lotNumber: string;
}

const inventoryItems: InventoryItem[] = [
  {
    id: 'INV-001',
    name: 'Acetonitrile (HPLC grade)',
    cas: '75-05-8',
    quantity: '120',
    unit: 'mL',
    location: 'A-1-03',
    expiryDate: '2027-06-15',
    status: '부족',
    statusColor: 'bg-amber-100 text-amber-700',
    lotNumber: 'ACN-2025-112',
  },
  {
    id: 'INV-002',
    name: 'Methanol (ACS grade)',
    cas: '67-56-1',
    quantity: '85',
    unit: 'mL',
    location: 'A-1-04',
    expiryDate: '2027-03-20',
    status: '부족',
    statusColor: 'bg-amber-100 text-amber-700',
    lotNumber: 'MeOH-2025-089',
  },
  {
    id: 'INV-003',
    name: 'Ethanol (99.5%)',
    cas: '64-17-5',
    quantity: '2500',
    unit: 'mL',
    location: 'A-2-01',
    expiryDate: '2028-01-10',
    status: '정상',
    statusColor: 'bg-green-100 text-green-700',
    lotNumber: 'EtOH-2025-201',
  },
  {
    id: 'INV-004',
    name: 'Sodium Hydroxide',
    cas: '1310-73-2',
    quantity: '15',
    unit: 'g',
    location: 'B-2-05',
    expiryDate: '2027-12-30',
    status: '부족',
    statusColor: 'bg-amber-100 text-amber-700',
    lotNumber: 'NaOH-2025-067',
  },
  {
    id: 'INV-005',
    name: 'Hydrochloric acid (37%)',
    cas: '7647-01-0',
    quantity: '450',
    unit: 'mL',
    location: 'C-1-02',
    expiryDate: '2027-09-15',
    status: '정상',
    statusColor: 'bg-green-100 text-green-700',
    lotNumber: 'HCl-2025-033',
  },
  {
    id: 'INV-006',
    name: 'Titanium(IV) isopropoxide',
    cas: '546-68-9',
    quantity: '25',
    unit: 'mL',
    location: 'B-3-01',
    expiryDate: '2026-05-10',
    status: '만료임박',
    statusColor: 'bg-red-100 text-red-700',
    lotNumber: 'TTIP-2024-015',
  },
  {
    id: 'INV-007',
    name: 'Ampicillin sodium salt',
    cas: '69-52-3',
    quantity: '500',
    unit: 'mg',
    location: 'D-1-01 (냉장)',
    expiryDate: '2026-04-20',
    status: '만료임박',
    statusColor: 'bg-red-100 text-red-700',
    lotNumber: 'AMP-2024-098',
  },
  {
    id: 'INV-008',
    name: 'DMSO',
    cas: '67-68-5',
    quantity: '200',
    unit: 'mL',
    location: 'A-3-02',
    expiryDate: '2028-06-30',
    status: '정상',
    statusColor: 'bg-green-100 text-green-700',
    lotNumber: 'DMSO-2025-144',
  },
];

const statusTabs: InventoryStatus[] = ['전체', '정상', '부족', '만료임박'];

export default function LabInventoryPage() {
  const [activeTab, setActiveTab] = useState<InventoryStatus>('전체');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = inventoryItems.filter((item) => {
    const matchStatus = activeTab === '전체' || item.status === activeTab;
    const matchSearch =
      !searchQuery ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.cas.includes(searchQuery);
    return matchStatus && matchSearch;
  });

  const totalCount = inventoryItems.length;
  const lowCount = inventoryItems.filter((i) => i.status === '부족').length;
  const expiringCount = inventoryItems.filter((i) => i.status === '만료임박').length;

  const statusCount = (status: InventoryStatus) => {
    if (status === '전체') return inventoryItems.length;
    return inventoryItems.filter((i) => i.status === status).length;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text)]">시약장</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">실험실 보유 시약을 관리하고 JINU Shop과 동기화합니다.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)] bg-[var(--bg)] px-3 py-1.5 rounded-lg border border-[var(--border)]">
            <CheckCircle size={12} className="text-green-500" />
            마지막 동기화: 2026-03-20 09:30
          </div>
          <button className="flex items-center gap-2 px-4 h-[var(--btn-height)] text-sm font-medium text-teal-600 border border-teal-200 rounded-lg hover:bg-teal-50 transition-colors">
            <RefreshCw size={14} />
            동기화
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-teal-100 text-teal-600 flex items-center justify-center">
            <Package size={20} />
          </div>
          <div>
            <p className="text-sm text-[var(--text-secondary)]">총 보유</p>
            <p className="text-xl font-bold text-[var(--text)]">{totalCount}종</p>
          </div>
        </div>
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center">
            <AlertTriangle size={20} />
          </div>
          <div>
            <p className="text-sm text-[var(--text-secondary)]">부족</p>
            <p className="text-xl font-bold text-amber-600">{lowCount}종</p>
          </div>
        </div>
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-red-100 text-red-600 flex items-center justify-center">
            <Clock size={20} />
          </div>
          <div>
            <p className="text-sm text-[var(--text-secondary)]">만료 임박</p>
            <p className="text-xl font-bold text-red-600">{expiringCount}종</p>
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl">
        <div className="p-4 border-b border-[var(--border)] flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="시약명 또는 CAS번호로 검색..."
              className="w-full pl-10 pr-4 h-[var(--btn-height)] border border-[var(--border)] rounded-lg bg-[var(--bg)] text-sm focus:outline-none focus:border-teal-500 text-[var(--text)]"
            />
          </div>
        </div>

        {/* Status Tabs */}
        <div className="flex border-b border-[var(--border)] px-4">
          {statusTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab
                  ? 'border-teal-600 text-teal-600'
                  : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text)]'
              }`}
            >
              {tab} ({statusCount(tab)})
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 text-xs text-[var(--text-secondary)]">
                <th className="text-left px-5 py-3 font-medium">시약명</th>
                <th className="text-left px-5 py-3 font-medium">CAS No.</th>
                <th className="text-right px-5 py-3 font-medium">수량</th>
                <th className="text-left px-5 py-3 font-medium">위치</th>
                <th className="text-left px-5 py-3 font-medium">유효기간</th>
                <th className="text-left px-5 py-3 font-medium">Lot No.</th>
                <th className="text-center px-5 py-3 font-medium">상태</th>
                <th className="text-center px-5 py-3 font-medium">주문</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3 text-sm font-medium text-[var(--text)]">{item.name}</td>
                  <td className="px-5 py-3 text-sm font-mono text-[var(--text-secondary)]">{item.cas}</td>
                  <td className="px-5 py-3 text-sm text-right text-[var(--text)]">
                    {item.quantity} {item.unit}
                  </td>
                  <td className="px-5 py-3 text-sm text-[var(--text-secondary)]">{item.location}</td>
                  <td className="px-5 py-3 text-sm text-[var(--text-secondary)]">{item.expiryDate}</td>
                  <td className="px-5 py-3 text-xs font-mono text-[var(--text-secondary)]">{item.lotNumber}</td>
                  <td className="px-5 py-3 text-center">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${item.statusColor}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-center">
                    {(item.status === '부족' || item.status === '만료임박') && (
                      <a
                        href={`http://localhost:3000/order?cas=${item.cas}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-3 h-7 text-xs font-medium text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
                      >
                        <ShoppingCart size={12} />
                        Shop 주문
                      </a>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="py-12 text-center text-sm text-[var(--text-secondary)]">
            검색 결과가 없습니다.
          </div>
        )}
      </div>
    </div>
  );
}
