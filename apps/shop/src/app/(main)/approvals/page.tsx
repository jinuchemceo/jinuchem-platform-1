'use client';

import { useState } from 'react';
import { CheckCircle, XCircle, Clock, Search, Eye, ShieldCheck } from 'lucide-react';
import { formatCurrency } from '@jinuchem/shared';

interface ApprovalItem {
  id: string;
  orderNumber: string;
  products: string;
  itemCount: number;
  totalAmount: number;
  requester: string;
  department: string;
  requestedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  note?: string;
}

const sampleApprovals: ApprovalItem[] = [
  {
    id: '1',
    orderNumber: 'ORD-20260319-001',
    products: 'Ethyl alcohol, Pure 500mL',
    itemCount: 3,
    totalAmount: 598830,
    requester: '김연구',
    department: '유기화학실험실',
    requestedAt: '2026-03-19',
    status: 'pending',
  },
  {
    id: '2',
    orderNumber: 'ORD-20260318-002',
    products: 'Methanol, HPLC Grade 4L',
    itemCount: 2,
    totalAmount: 177300,
    requester: '이분석',
    department: '분석화학실험실',
    requestedAt: '2026-03-18',
    status: 'pending',
  },
  {
    id: '3',
    orderNumber: 'ORD-20260317-003',
    products: 'PIPES, 고순도 25G',
    itemCount: 1,
    totalAmount: 503100,
    requester: '박실험',
    department: '생화학실험실',
    requestedAt: '2026-03-17',
    status: 'approved',
    note: '긴급 실험 건으로 승인',
  },
  {
    id: '4',
    orderNumber: 'ORD-20260316-001',
    products: 'Toluene 1L',
    itemCount: 1,
    totalAmount: 58860,
    requester: '최화학',
    department: '유기화학실험실',
    requestedAt: '2026-03-16',
    status: 'rejected',
    note: '예산 초과',
  },
];

type TabKey = 'pending' | 'approved' | 'rejected';

const tabs: { key: TabKey; label: string; icon: React.ReactNode }[] = [
  { key: 'pending', label: '결제대기', icon: <Clock size={14} /> },
  { key: 'approved', label: '승인완료', icon: <CheckCircle size={14} /> },
  { key: 'rejected', label: '거절', icon: <XCircle size={14} /> },
];

const statusColors: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-700',
  approved: 'bg-emerald-100 text-emerald-700',
  rejected: 'bg-red-100 text-red-700',
};

const statusLabels: Record<string, string> = {
  pending: '대기',
  approved: '승인',
  rejected: '거절',
};

export default function ApprovalsPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<ApprovalItem | null>(null);
  const [approvals, setApprovals] = useState(sampleApprovals);

  const filtered = approvals.filter((a) => {
    if (a.status !== activeTab) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        a.orderNumber.toLowerCase().includes(q) ||
        a.products.toLowerCase().includes(q) ||
        a.requester.includes(q)
      );
    }
    return true;
  });

  const handleApprove = (id: string) => {
    setApprovals((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'approved' as const, note: '승인 처리됨' } : a))
    );
  };

  const handleReject = (id: string) => {
    setApprovals((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'rejected' as const, note: '관리자 거절' } : a))
    );
  };

  const pendingCount = approvals.filter((a) => a.status === 'pending').length;
  const approvedCount = approvals.filter((a) => a.status === 'approved').length;
  const rejectedCount = approvals.filter((a) => a.status === 'rejected').length;
  const counts: Record<TabKey, number> = { pending: pendingCount, approved: approvedCount, rejected: rejectedCount };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[var(--text)]">결제하기</h1>
        <span className="text-sm text-[var(--text-secondary)]">
          결제 대기 {pendingCount}건
        </span>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 mb-6 border-b border-[var(--border)]">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-1.5 px-4 h-[42px] text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.key
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text)]'
            }`}
          >
            {tab.icon}
            {tab.label}
            <span className={`ml-1 px-1.5 py-0.5 rounded-full text-xs ${
              activeTab === tab.key ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'
            }`}>
              {counts[tab.key]}
            </span>
          </button>
        ))}

        <div className="ml-auto relative mb-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="주문번호/제품/요청자 검색"
            className="h-[38px] pl-9 pr-4 w-[220px] border border-[var(--border)] rounded-lg text-sm bg-[var(--bg-card)] text-[var(--text)]"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border)] overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-[var(--border)]">
              <th className="text-left px-4 py-3 font-medium text-[var(--text-secondary)]">주문번호</th>
              <th className="text-left px-4 py-3 font-medium text-[var(--text-secondary)]">제품</th>
              <th className="text-right px-4 py-3 font-medium text-[var(--text-secondary)]">금액</th>
              <th className="text-center px-4 py-3 font-medium text-[var(--text-secondary)]">요청자</th>
              <th className="text-center px-4 py-3 font-medium text-[var(--text-secondary)]">부서</th>
              <th className="text-center px-4 py-3 font-medium text-[var(--text-secondary)]">요청일</th>
              <th className="text-center px-4 py-3 font-medium text-[var(--text-secondary)]">상태</th>
              <th className="text-center px-4 py-3 font-medium text-[var(--text-secondary)]">처리</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item) => (
              <tr key={item.id} className="border-b border-[var(--border)] last:border-0 hover:bg-gray-50">
                <td className="px-4 py-3 font-mono text-xs text-[var(--text)]">{item.orderNumber}</td>
                <td className="px-4 py-3">
                  <span className="text-[var(--text)]">{item.products}</span>
                  {item.itemCount > 1 && (
                    <span className="text-[var(--text-secondary)] ml-1">외 {item.itemCount - 1}건</span>
                  )}
                </td>
                <td className="px-4 py-3 text-right font-medium text-[var(--text)]">
                  {formatCurrency(item.totalAmount)}
                </td>
                <td className="px-4 py-3 text-center text-[var(--text)]">{item.requester}</td>
                <td className="px-4 py-3 text-center text-[var(--text-secondary)]">{item.department}</td>
                <td className="px-4 py-3 text-center text-[var(--text-secondary)]">{item.requestedAt}</td>
                <td className="px-4 py-3 text-center">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[item.status]}`}>
                    {statusLabels[item.status]}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  {item.status === 'pending' ? (
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => handleApprove(item.id)}
                        className="h-[30px] px-3 bg-emerald-600 text-white text-xs font-medium rounded-lg hover:bg-emerald-700 flex items-center gap-1"
                      >
                        <CheckCircle size={12} /> 승인
                      </button>
                      <button
                        onClick={() => handleReject(item.id)}
                        className="h-[30px] px-3 bg-red-500 text-white text-xs font-medium rounded-lg hover:bg-red-600 flex items-center gap-1"
                      >
                        <XCircle size={12} /> 거절
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setSelectedItem(item)}
                      className="text-blue-600 hover:underline text-xs font-medium flex items-center gap-1 mx-auto"
                    >
                      <Eye size={12} /> 상세
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-[var(--text-secondary)]">
            <ShieldCheck size={40} className="mx-auto mb-3 opacity-30" />
            <p>해당 상태의 결제 건이 없습니다</p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center" onClick={() => setSelectedItem(null)}>
          <div className="bg-[var(--bg-card)] rounded-2xl w-[500px] p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-[var(--text)]">결제 상세</h2>
              <button onClick={() => setSelectedItem(null)} className="text-[var(--text-secondary)] hover:text-[var(--text)] text-xl">&times;</button>
            </div>
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div><span className="text-[var(--text-secondary)]">주문번호</span><p className="font-mono font-medium text-[var(--text)]">{selectedItem.orderNumber}</p></div>
                <div><span className="text-[var(--text-secondary)]">요청자</span><p className="font-medium text-[var(--text)]">{selectedItem.requester}</p></div>
                <div><span className="text-[var(--text-secondary)]">부서</span><p className="text-[var(--text)]">{selectedItem.department}</p></div>
                <div><span className="text-[var(--text-secondary)]">요청일</span><p className="text-[var(--text)]">{selectedItem.requestedAt}</p></div>
                <div><span className="text-[var(--text-secondary)]">금액</span><p className="font-bold text-[var(--text)]">{formatCurrency(selectedItem.totalAmount)}</p></div>
                <div><span className="text-[var(--text-secondary)]">상태</span><p><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[selectedItem.status]}`}>{statusLabels[selectedItem.status]}</span></p></div>
              </div>
              {selectedItem.note && (
                <div className="border-t border-[var(--border)] pt-3">
                  <span className="text-[var(--text-secondary)]">비고</span>
                  <p className="text-[var(--text)]">{selectedItem.note}</p>
                </div>
              )}
            </div>
            <button onClick={() => setSelectedItem(null)} className="mt-5 w-full h-[38px] bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700">
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
