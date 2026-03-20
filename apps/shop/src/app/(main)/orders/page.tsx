'use client';

import { useState } from 'react';
import { Search, Download, Eye, Calendar, ChevronDown, ClipboardList, Trash2 } from 'lucide-react';
import { formatCurrency, ORDER_STATUS_LABEL, ORDER_STATUS_COLOR } from '@jinuchem/shared';

interface OrderData {
  id: string;
  orderNumber: string;
  products: string;
  itemCount: number;
  totalAmount: number;
  status: string;
  orderedAt: string;
  deliveryDate?: string;
}

const sampleOrders: OrderData[] = [
  { id: '1', orderNumber: 'ORD-20260317-001', products: 'Ethyl alcohol, Pure 500mL', itemCount: 3, totalAmount: 598830, status: 'shipping', orderedAt: '2026-03-17', deliveryDate: '2026-03-21' },
  { id: '2', orderNumber: 'ORD-20260315-003', products: 'Acetone, ACS Grade 2.5L', itemCount: 1, totalAmount: 96580, status: 'delivered', orderedAt: '2026-03-15' },
  { id: '3', orderNumber: 'ORD-20260312-002', products: 'PIPES, 고순도 5G', itemCount: 1, totalAmount: 248820, status: 'delivered', orderedAt: '2026-03-12' },
  { id: '4', orderNumber: 'ORD-20260310-001', products: 'Methanol, HPLC Grade 4L', itemCount: 2, totalAmount: 175890, status: 'delivered', orderedAt: '2026-03-10' },
  { id: '5', orderNumber: 'ORD-20260305-004', products: 'Sodium Hydroxide 1kg', itemCount: 1, totalAmount: 98670, status: 'delivered', orderedAt: '2026-03-05' },
];

const statusColors: Record<string, string> = {
  payment_pending: 'bg-amber-100 text-amber-700',
  payment_done: 'bg-blue-100 text-blue-700',
  preparing: 'bg-indigo-100 text-indigo-700',
  shipping: 'bg-violet-100 text-violet-700',
  delivered: 'bg-emerald-100 text-emerald-700',
  cancelled: 'bg-red-100 text-red-700',
};

export default function OrdersPage() {
  const [period, setPeriod] = useState('1m');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<OrderData | null>(null);
  const [selectedOrders, setSelectedOrders] = useState<Set<string>>(new Set());
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handlePeriodClick = (p: string) => {
    setPeriod(p);
    setStartDate('');
    setEndDate('');
  };

  const handleDateSearch = () => {
    if (startDate || endDate) {
      setPeriod('custom');
    }
  };

  const filtered = sampleOrders.filter((o) => {
    if (statusFilter !== 'all' && o.status !== statusFilter) return false;
    if (searchQuery && !o.orderNumber.includes(searchQuery) && !o.products.includes(searchQuery)) return false;
    // Date range filter
    if (startDate && o.orderedAt < startDate) return false;
    if (endDate && o.orderedAt > endDate) return false;
    // Period-based filter (when not using custom date)
    if (period !== 'custom') {
      const now = new Date();
      let cutoff = new Date();
      if (period === '1w') cutoff.setDate(now.getDate() - 7);
      else if (period === '1m') cutoff.setMonth(now.getMonth() - 1);
      else if (period === '3m') cutoff.setMonth(now.getMonth() - 3);
      else if (period === '6m') cutoff.setMonth(now.getMonth() - 6);
      const cutoffStr = cutoff.toISOString().split('T')[0];
      if (o.orderedAt < cutoffStr) return false;
    }
    return true;
  });

  const allSelected = filtered.length > 0 && filtered.every((o) => selectedOrders.has(o.id));

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedOrders(new Set());
    } else {
      setSelectedOrders(new Set(filtered.map((o) => o.id)));
    }
  };

  const toggleSelectOrder = (id: string) => {
    setSelectedOrders((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[var(--text)]">주문 내역</h1>
        <div className="flex items-center gap-2">
          {selectedOrders.size > 0 && (
            <button
              disabled
              className="h-[38px] px-4 border border-red-300 text-sm text-red-400 rounded-lg flex items-center gap-1.5 cursor-not-allowed opacity-60"
            >
              <Trash2 size={14} /> 선택 삭제
            </button>
          )}
          <button className="h-[38px] px-4 border border-[var(--border)] text-sm text-[var(--text-secondary)] rounded-lg hover:border-blue-400 flex items-center gap-1.5">
            <Download size={14} />
            {selectedOrders.size > 0
              ? `선택 내보내기 (${selectedOrders.size}건)`
              : '전체 내보내기'}
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-6">
        {['1w', '1m', '3m', '6m'].map((p) => (
          <button
            key={p}
            onClick={() => handlePeriodClick(p)}
            className={`h-[38px] px-4 text-sm rounded-lg border transition-colors ${
              period === p ? 'bg-blue-600 text-white border-blue-600' : 'border-[var(--border)] text-[var(--text)] hover:border-blue-400'
            }`}
          >
            {p === '1w' ? '1주일' : p === '1m' ? '1개월' : p === '3m' ? '3개월' : '6개월'}
          </button>
        ))}
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="h-[38px] px-3 border border-[var(--border)] rounded-lg text-sm bg-[var(--bg-card)] text-[var(--text)]"
        />
        <span className="text-[var(--text-secondary)]">~</span>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="h-[38px] px-3 border border-[var(--border)] rounded-lg text-sm bg-[var(--bg-card)] text-[var(--text)]"
        />
        <button
          onClick={handleDateSearch}
          className="h-[38px] px-5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 flex items-center gap-1.5"
        >
          <Search size={14} /> 조회
        </button>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-[38px] px-3 border border-[var(--border)] rounded-lg bg-[var(--bg-card)] text-sm text-[var(--text)] ml-auto"
        >
          <option value="all">전체 상태</option>
          {Object.entries(ORDER_STATUS_LABEL).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>

        <div className="relative">
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

      {/* Order Table */}
      <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border)] overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-[var(--border)]">
              <th className="w-10 px-4 py-3">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={toggleSelectAll}
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
              </th>
              <th className="text-left px-4 py-3 font-medium text-[var(--text-secondary)]">주문번호</th>
              <th className="text-left px-4 py-3 font-medium text-[var(--text-secondary)]">제품</th>
              <th className="text-right px-4 py-3 font-medium text-[var(--text-secondary)]">금액</th>
              <th className="text-center px-4 py-3 font-medium text-[var(--text-secondary)]">상태</th>
              <th className="text-center px-4 py-3 font-medium text-[var(--text-secondary)]">주문일</th>
              <th className="text-center px-4 py-3 font-medium text-[var(--text-secondary)]">납품예정</th>
              <th className="text-center px-4 py-3 font-medium text-[var(--text-secondary)]">상세</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((order) => (
              <tr key={order.id} className="border-b border-[var(--border)] last:border-0 hover:bg-gray-50">
                <td className="w-10 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selectedOrders.has(order.id)}
                    onChange={() => toggleSelectOrder(order.id)}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                </td>
                <td className="px-4 py-3 font-mono text-xs text-[var(--text)]">{order.orderNumber}</td>
                <td className="px-4 py-3">
                  <span className="text-[var(--text)]">{order.products}</span>
                  {order.itemCount > 1 && (
                    <span className="text-[var(--text-secondary)] ml-1">외 {order.itemCount - 1}건</span>
                  )}
                </td>
                <td className="px-4 py-3 text-right font-medium text-[var(--text)]">
                  {formatCurrency(order.totalAmount)}
                </td>
                <td className="px-4 py-3 text-center">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[order.status] || ''}`}>
                    {ORDER_STATUS_LABEL[order.status]}
                  </span>
                </td>
                <td className="px-4 py-3 text-center text-[var(--text-secondary)]">{order.orderedAt}</td>
                <td className="px-4 py-3 text-center text-[var(--text-secondary)]">{order.deliveryDate || '-'}</td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="text-blue-600 hover:underline text-xs font-medium flex items-center gap-1 mx-auto"
                  >
                    <Eye size={12} /> 상세보기
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-[var(--text-secondary)]">
            <ClipboardList size={40} className="mx-auto mb-3 opacity-30" />
            <p>해당 조건의 주문이 없습니다</p>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center" onClick={() => setSelectedOrder(null)}>
          <div className="bg-[var(--bg-card)] rounded-2xl w-[600px] max-h-[80vh] overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-[var(--text)]">주문 상세</h2>
              <button onClick={() => setSelectedOrder(null)} className="text-[var(--text-secondary)] hover:text-[var(--text)] text-xl">&times;</button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="text-[var(--text-secondary)]">주문번호</span><p className="font-mono font-medium text-[var(--text)]">{selectedOrder.orderNumber}</p></div>
                <div><span className="text-[var(--text-secondary)]">주문일</span><p className="font-medium text-[var(--text)]">{selectedOrder.orderedAt}</p></div>
                <div><span className="text-[var(--text-secondary)]">상태</span><p><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[selectedOrder.status]}`}>{ORDER_STATUS_LABEL[selectedOrder.status]}</span></p></div>
                <div><span className="text-[var(--text-secondary)]">결제금액</span><p className="font-bold text-[var(--text)]">{formatCurrency(selectedOrder.totalAmount)}</p></div>
              </div>

              <div className="border-t border-[var(--border)] pt-4">
                <h3 className="text-sm font-semibold text-[var(--text)] mb-3">주문 품목</h3>
                <div className="bg-[var(--bg)] rounded-lg p-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[var(--text)]">{selectedOrder.products}</span>
                    <span className="font-medium text-[var(--text)]">{formatCurrency(selectedOrder.totalAmount)}</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-[var(--border)] pt-4">
                <h3 className="text-sm font-semibold text-[var(--text)] mb-3">배송지 정보</h3>
                <div className="text-sm text-[var(--text-secondary)] space-y-1">
                  <p>경상국립대학교 화학과 유기화학실험실</p>
                  <p>경상남도 진주시 진주대로501 자연과학대학 3층 302호</p>
                  <p>김연구 / 055-772-1234</p>
                </div>
              </div>

              <div className="border-t border-[var(--border)] pt-4">
                <h3 className="text-sm font-semibold text-[var(--text)] mb-3">결제 정보</h3>
                <div className="text-sm text-[var(--text-secondary)] space-y-1">
                  <p>청구기관: 경상국립대학교 산학협력단</p>
                  <p>PO번호: 20260317-김연구</p>
                </div>
              </div>
            </div>

            <button onClick={() => setSelectedOrder(null)} className="mt-6 w-full h-[38px] bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700">
              닫기
            </button>
          </div>
        </div>
      )}

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
