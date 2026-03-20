'use client';

import { useState } from 'react';
import { FileText, Download, Building2, CreditCard, Search, CheckSquare } from 'lucide-react';
import { formatCurrency } from '@jinuchem/shared';

interface OrderDoc {
  id: string;
  orderNumber: string;
  products: string;
  totalAmount: number;
  orderedAt: string;
  status: string;
}

const sampleOrderDocs: OrderDoc[] = [
  { id: '1', orderNumber: 'ORD-20260317-001', products: 'Ethyl alcohol, Pure 500mL 외 2건', totalAmount: 598830, orderedAt: '2026-03-17', status: '배송중' },
  { id: '2', orderNumber: 'ORD-20260315-003', products: 'Acetone, ACS Grade 2.5L', totalAmount: 96580, orderedAt: '2026-03-15', status: '배송완료' },
  { id: '3', orderNumber: 'ORD-20260312-002', products: 'PIPES, 고순도 5G', totalAmount: 248820, orderedAt: '2026-03-12', status: '배송완료' },
  { id: '4', orderNumber: 'ORD-20260310-001', products: 'Methanol, HPLC Grade 4L', totalAmount: 175890, orderedAt: '2026-03-10', status: '배송완료' },
  { id: '5', orderNumber: 'ORD-20260305-004', products: 'Sodium Hydroxide 1kg', totalAmount: 98670, orderedAt: '2026-03-05', status: '배송완료' },
];

export default function DocumentsPage() {
  const [period, setPeriod] = useState('1m');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const filtered = sampleOrderDocs.filter((o) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return o.orderNumber.toLowerCase().includes(q) || o.products.toLowerCase().includes(q);
    }
    return true;
  });

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    if (selectedIds.length === filtered.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filtered.map((o) => o.id));
    }
  };

  const handleIssue = (docType: string) => {
    if (selectedIds.length === 0) {
      alert('주문을 선택해주세요');
      return;
    }
    alert(`${docType} ${selectedIds.length}건 발급이 요청되었습니다`);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[var(--text)]">증빙서류</h1>
      </div>

      {/* Period Filters */}
      <div className="flex items-center gap-3 mb-6">
        {['1w', '1m', '3m', '6m'].map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`h-[38px] px-4 text-sm rounded-lg border transition-colors ${
              period === p ? 'bg-blue-600 text-white border-blue-600' : 'border-[var(--border)] text-[var(--text)] hover:border-blue-400'
            }`}
          >
            {p === '1w' ? '1주일' : p === '1m' ? '1개월' : p === '3m' ? '3개월' : '6개월'}
          </button>
        ))}
        <input type="date" defaultValue="2026-01-01" className="h-[38px] px-3 border border-[var(--border)] rounded-lg text-sm bg-[var(--bg-card)] text-[var(--text)]" />
        <span className="text-[var(--text-secondary)]">~</span>
        <input type="date" defaultValue="2026-03-20" className="h-[38px] px-3 border border-[var(--border)] rounded-lg text-sm bg-[var(--bg-card)] text-[var(--text)]" />

        <div className="relative ml-auto">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="주문번호/제품명 검색"
            className="h-[38px] pl-9 pr-4 w-[200px] border border-[var(--border)] rounded-lg text-sm bg-[var(--bg-card)] text-[var(--text)]"
          />
        </div>
      </div>

      {/* Order List */}
      <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border)] overflow-hidden mb-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-[var(--border)]">
              <th className="w-[40px] px-4 py-3">
                <input
                  type="checkbox"
                  checked={selectedIds.length === filtered.length && filtered.length > 0}
                  onChange={toggleAll}
                  className="accent-blue-600"
                />
              </th>
              <th className="text-left px-4 py-3 font-medium text-[var(--text-secondary)]">주문번호</th>
              <th className="text-left px-4 py-3 font-medium text-[var(--text-secondary)]">제품</th>
              <th className="text-right px-4 py-3 font-medium text-[var(--text-secondary)]">금액</th>
              <th className="text-center px-4 py-3 font-medium text-[var(--text-secondary)]">주문일</th>
              <th className="text-center px-4 py-3 font-medium text-[var(--text-secondary)]">상태</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((order) => (
              <tr
                key={order.id}
                className={`border-b border-[var(--border)] last:border-0 hover:bg-gray-50 cursor-pointer ${
                  selectedIds.includes(order.id) ? 'bg-blue-50' : ''
                }`}
                onClick={() => toggleSelect(order.id)}
              >
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(order.id)}
                    onChange={() => toggleSelect(order.id)}
                    className="accent-blue-600"
                    onClick={(e) => e.stopPropagation()}
                  />
                </td>
                <td className="px-4 py-3 font-mono text-xs text-[var(--text)]">{order.orderNumber}</td>
                <td className="px-4 py-3 text-[var(--text)]">{order.products}</td>
                <td className="px-4 py-3 text-right font-medium text-[var(--text)]">{formatCurrency(order.totalAmount)}</td>
                <td className="px-4 py-3 text-center text-[var(--text-secondary)]">{order.orderedAt}</td>
                <td className="px-4 py-3 text-center">
                  <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">{order.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Issue Documents Section */}
      <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border)] p-5">
        <div className="flex items-center gap-2 mb-4">
          <CheckSquare size={16} className="text-blue-600" />
          <h2 className="text-base font-semibold text-[var(--text)]">
            선택 항목 증빙서류 발급
            {selectedIds.length > 0 && (
              <span className="ml-2 text-sm font-normal text-blue-600">({selectedIds.length}건 선택)</span>
            )}
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Document Issue Buttons */}
          <div>
            <p className="text-sm text-[var(--text-secondary)] mb-3">거래 증빙서류</p>
            <div className="flex gap-2">
              <button
                onClick={() => handleIssue('견적서')}
                className="h-[38px] px-4 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 flex items-center gap-1.5"
              >
                <FileText size={14} /> 견적서
              </button>
              <button
                onClick={() => handleIssue('거래명세서')}
                className="h-[38px] px-4 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 flex items-center gap-1.5"
              >
                <FileText size={14} /> 거래명세서
              </button>
              <button
                onClick={() => handleIssue('납품확인서')}
                className="h-[38px] px-4 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 flex items-center gap-1.5"
              >
                <FileText size={14} /> 납품확인서
              </button>
            </div>
          </div>

          {/* Company Documents */}
          <div>
            <p className="text-sm text-[var(--text-secondary)] mb-3">회사 서류</p>
            <div className="flex gap-2">
              <button
                onClick={() => alert('사업자등록증 다운로드')}
                className="h-[38px] px-4 border border-[var(--border)] text-[var(--text)] text-sm rounded-lg hover:border-blue-400 flex items-center gap-1.5"
              >
                <Building2 size={14} /> 사업자등록증
              </button>
              <button
                onClick={() => alert('통장사본 다운로드')}
                className="h-[38px] px-4 border border-[var(--border)] text-[var(--text)] text-sm rounded-lg hover:border-blue-400 flex items-center gap-1.5"
              >
                <CreditCard size={14} /> 통장사본
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center gap-1 mt-6">
        {[1].map((page) => (
          <button key={page} className="w-9 h-9 rounded-full text-sm font-medium border-2 border-slate-800 text-slate-800">
            {page}
          </button>
        ))}
      </div>
    </div>
  );
}
