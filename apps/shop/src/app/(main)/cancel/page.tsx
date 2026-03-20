'use client';

import { useState } from 'react';
import { Search, X, Plus, PackageX } from 'lucide-react';
import { formatCurrency } from '@jinuchem/shared';

interface CancelItem {
  id: string;
  receiptNumber: string;
  orderNumber: string;
  products: string;
  reason: string;
  refundAmount: number;
  status: 'received' | 'processing' | 'completed';
  requestedAt: string;
}

const sampleCancelItems: CancelItem[] = [
  {
    id: '1',
    receiptNumber: 'CAN-20260318-001',
    orderNumber: 'ORD-20260315-003',
    products: 'Acetone, ACS Grade 2.5L',
    reason: '단순 변심',
    refundAmount: 96580,
    status: 'completed',
    requestedAt: '2026-03-18',
  },
  {
    id: '2',
    receiptNumber: 'CAN-20260317-001',
    orderNumber: 'ORD-20260310-001',
    products: 'Methanol, HPLC Grade 4L',
    reason: '주문 실수',
    refundAmount: 88650,
    status: 'processing',
    requestedAt: '2026-03-17',
  },
  {
    id: '3',
    receiptNumber: 'CAN-20260316-002',
    orderNumber: 'ORD-20260312-002',
    products: 'PIPES, 고순도 5G',
    reason: '수량 오류',
    refundAmount: 248820,
    status: 'received',
    requestedAt: '2026-03-16',
  },
];

const statusLabels: Record<string, string> = { received: '접수', processing: '처리중', completed: '완료' };
const statusColors: Record<string, string> = { received: 'bg-blue-100 text-blue-700', processing: 'bg-amber-100 text-amber-700', completed: 'bg-emerald-100 text-emerald-700' };

export default function CancelPage() {
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formOrderNo, setFormOrderNo] = useState('');
  const [formReason, setFormReason] = useState('');

  const filtered = sampleCancelItems.filter((item) => {
    if (statusFilter !== 'all' && item.status !== statusFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        item.receiptNumber.toLowerCase().includes(q) ||
        item.orderNumber.toLowerCase().includes(q) ||
        item.products.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[var(--text)]">취소 내역</h1>
        <button
          onClick={() => setShowModal(true)}
          className="h-[38px] px-4 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 flex items-center gap-1.5"
        >
          <Plus size={14} /> 취소 신청
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-6">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-[38px] px-3 border border-[var(--border)] rounded-lg bg-[var(--bg-card)] text-sm text-[var(--text)]"
        >
          <option value="all">전체 상태</option>
          <option value="received">접수</option>
          <option value="processing">처리중</option>
          <option value="completed">완료</option>
        </select>

        <div className="relative ml-auto">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="접수번호/주문번호 검색"
            className="h-[38px] pl-9 pr-4 w-[200px] border border-[var(--border)] rounded-lg text-sm bg-[var(--bg-card)] text-[var(--text)]"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border)] overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-[var(--border)]">
              <th className="text-left px-4 py-3 font-medium text-[var(--text-secondary)]">접수번호</th>
              <th className="text-left px-4 py-3 font-medium text-[var(--text-secondary)]">주문번호</th>
              <th className="text-left px-4 py-3 font-medium text-[var(--text-secondary)]">제품</th>
              <th className="text-left px-4 py-3 font-medium text-[var(--text-secondary)]">사유</th>
              <th className="text-right px-4 py-3 font-medium text-[var(--text-secondary)]">환불금액</th>
              <th className="text-center px-4 py-3 font-medium text-[var(--text-secondary)]">상태</th>
              <th className="text-center px-4 py-3 font-medium text-[var(--text-secondary)]">신청일</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item) => (
              <tr key={item.id} className="border-b border-[var(--border)] last:border-0 hover:bg-gray-50">
                <td className="px-4 py-3 font-mono text-xs text-[var(--text)]">{item.receiptNumber}</td>
                <td className="px-4 py-3 font-mono text-xs text-[var(--text-secondary)]">{item.orderNumber}</td>
                <td className="px-4 py-3 text-[var(--text)]">{item.products}</td>
                <td className="px-4 py-3 text-[var(--text-secondary)]">{item.reason}</td>
                <td className="px-4 py-3 text-right font-medium text-[var(--text)]">{formatCurrency(item.refundAmount)}</td>
                <td className="px-4 py-3 text-center">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[item.status]}`}>
                    {statusLabels[item.status]}
                  </span>
                </td>
                <td className="px-4 py-3 text-center text-[var(--text-secondary)]">{item.requestedAt}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-[var(--text-secondary)]">
            <PackageX size={40} className="mx-auto mb-3 opacity-30" />
            <p>해당 조건의 취소 내역이 없습니다</p>
          </div>
        )}
      </div>

      {/* Cancel Request Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center" onClick={() => setShowModal(false)}>
          <div className="bg-[var(--bg-card)] rounded-2xl w-[520px] p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-[var(--text)]">취소 신청</h2>
              <button onClick={() => setShowModal(false)} className="text-[var(--text-secondary)] hover:text-[var(--text)] text-xl">&times;</button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--text)] mb-1.5">관련 주문번호</label>
                <select
                  value={formOrderNo}
                  onChange={(e) => setFormOrderNo(e.target.value)}
                  className="w-full h-[38px] px-3 border border-[var(--border)] rounded-lg bg-[var(--bg)] text-sm text-[var(--text)]"
                >
                  <option value="">주문을 선택하세요</option>
                  <option value="ORD-20260317-001">ORD-20260317-001 - Ethyl alcohol, Pure 500mL</option>
                  <option value="ORD-20260315-003">ORD-20260315-003 - Acetone, ACS Grade 2.5L</option>
                  <option value="ORD-20260312-002">ORD-20260312-002 - PIPES, 고순도 5G</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text)] mb-1.5">취소 사유</label>
                <select
                  value={formReason}
                  onChange={(e) => setFormReason(e.target.value)}
                  className="w-full h-[38px] px-3 border border-[var(--border)] rounded-lg bg-[var(--bg)] text-sm text-[var(--text)]"
                >
                  <option value="">사유를 선택하세요</option>
                  <option value="단순 변심">단순 변심</option>
                  <option value="주문 실수">주문 실수</option>
                  <option value="수량 오류">수량 오류</option>
                  <option value="배송 지연">배송 지연</option>
                  <option value="기타">기타</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text)] mb-1.5">상세 설명</label>
                <textarea
                  rows={3}
                  placeholder="상세 사유를 입력하세요..."
                  className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--bg)] text-sm text-[var(--text)] resize-none"
                />
              </div>
            </div>

            <div className="flex gap-2 mt-5">
              <button onClick={() => setShowModal(false)} className="flex-1 h-[38px] border border-[var(--border)] text-[var(--text-secondary)] text-sm rounded-lg hover:border-blue-400">
                닫기
              </button>
              <button
                onClick={() => { alert('취소가 신청되었습니다'); setShowModal(false); }}
                className="flex-1 h-[38px] bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
              >
                취소 신청하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
