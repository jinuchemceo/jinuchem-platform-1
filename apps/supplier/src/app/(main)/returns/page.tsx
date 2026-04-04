'use client';

import { useState } from 'react';
import {
  RotateCcw,
  XCircle,
  CheckCircle2,
  Clock,
  AlertTriangle,
  X,
} from 'lucide-react';

import type { ReturnRequest, ReturnStatus, ReturnType } from '@/types';
import { mockReturns, formatCurrency } from '@/lib/mock-data';

const statusStyles: Record<ReturnStatus, string> = {
  '접수': 'bg-amber-50 text-amber-700',
  '처리중': 'bg-purple-50 text-purple-700',
  '완료': 'bg-green-50 text-green-700',
};

const typeStyles: Record<ReturnType, string> = {
  '취소': 'bg-red-50 text-red-700',
  '반품': 'bg-amber-50 text-amber-700',
};

export default function ReturnsPage() {
  const [activeTab, setActiveTab] = useState<'전체' | ReturnStatus>('전체');
  const [showModal, setShowModal] = useState(false);
  const [selectedReturn, setSelectedReturn] = useState<ReturnRequest | null>(null);

  const tabs: { label: string; value: '전체' | ReturnStatus; count: number }[] = [
    { label: '전체', value: '전체', count: mockReturns.length },
    { label: '접수', value: '접수', count: mockReturns.filter(r => r.status === '접수').length },
    { label: '처리중', value: '처리중', count: mockReturns.filter(r => r.status === '처리중').length },
    { label: '완료', value: '완료', count: mockReturns.filter(r => r.status === '완료').length },
  ];

  const filteredReturns = activeTab === '전체' ? mockReturns : mockReturns.filter(r => r.status === activeTab);

  const handleProcess = (item: ReturnRequest) => {
    setSelectedReturn(item);
    setShowModal(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text)]">반품/취소 관리</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">반품 및 취소 요청을 처리합니다</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 flex-wrap">
        {tabs.map(tab => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`px-4 py-2 text-sm rounded-lg border transition-colors flex items-center gap-2 ${
              activeTab === tab.value
                ? 'bg-purple-600 text-white border-purple-600'
                : 'bg-[var(--card-bg)] text-[var(--text-secondary)] border-[var(--border)] hover:bg-gray-50'
            }`}
          >
            {tab.label}
            <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${
              activeTab === tab.value ? 'bg-white/20' : tab.value === '접수' ? 'bg-red-500 text-white' : 'bg-gray-100'
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-[var(--border)]">
              <th className="text-left px-4 py-3 font-semibold text-[var(--text-secondary)]">접수번호</th>
              <th className="text-left px-4 py-3 font-semibold text-[var(--text-secondary)]">유형</th>
              <th className="text-left px-4 py-3 font-semibold text-[var(--text-secondary)]">원 주문번호</th>
              <th className="text-left px-4 py-3 font-semibold text-[var(--text-secondary)]">요청자 / 기관</th>
              <th className="text-left px-4 py-3 font-semibold text-[var(--text-secondary)]">제품</th>
              <th className="text-left px-4 py-3 font-semibold text-[var(--text-secondary)]">사유</th>
              <th className="text-left px-4 py-3 font-semibold text-[var(--text-secondary)]">환불금액</th>
              <th className="text-left px-4 py-3 font-semibold text-[var(--text-secondary)]">상태</th>
              <th className="text-left px-4 py-3 font-semibold text-[var(--text-secondary)]">관리</th>
            </tr>
          </thead>
          <tbody>
            {filteredReturns.map(item => (
              <tr key={item.id} className="border-b border-[var(--border)] hover:bg-purple-50/30 transition-colors">
                <td className="px-4 py-3 font-mono text-xs">{item.id}</td>
                <td className="px-4 py-3">
                  <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${typeStyles[item.type]}`}>
                    {item.type}
                  </span>
                </td>
                <td className="px-4 py-3 font-mono text-xs">{item.orderId}</td>
                <td className="px-4 py-3">{item.requester} ({item.org})</td>
                <td className="px-4 py-3">{item.product}</td>
                <td className="px-4 py-3 text-[var(--text-secondary)]">{item.reason}</td>
                <td className="px-4 py-3 font-semibold">{formatCurrency(item.refundAmount)}</td>
                <td className="px-4 py-3">
                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusStyles[item.status]}`}>
                    {item.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {item.status === '접수' ? (
                    <button
                      onClick={() => handleProcess(item)}
                      className="px-3 py-1.5 bg-purple-600 text-white text-xs font-semibold rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      처리
                    </button>
                  ) : (
                    <button className="px-3 py-1.5 border border-[var(--border)] text-xs font-semibold rounded-lg hover:bg-gray-50 transition-colors">
                      상세
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Process Modal */}
      {showModal && selectedReturn && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center" onClick={() => setShowModal(false)}>
          <div className="bg-[var(--card-bg)] rounded-xl w-full max-w-lg mx-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)]">
              <h2 className="text-lg font-bold">반품/취소 처리</h2>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-gray-100 rounded-lg">
                <X size={18} />
              </button>
            </div>
            <div className="px-6 py-4 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="text-[var(--text-secondary)]">접수번호</span><p className="font-semibold">{selectedReturn.id}</p></div>
                <div><span className="text-[var(--text-secondary)]">유형</span><p className="font-semibold">{selectedReturn.type}</p></div>
                <div><span className="text-[var(--text-secondary)]">요청자</span><p className="font-semibold">{selectedReturn.requester} ({selectedReturn.org})</p></div>
                <div><span className="text-[var(--text-secondary)]">제품</span><p className="font-semibold">{selectedReturn.product}</p></div>
                <div className="col-span-2"><span className="text-[var(--text-secondary)]">사유</span><p className="font-semibold">{selectedReturn.reason}</p></div>
                <div><span className="text-[var(--text-secondary)]">환불금액</span><p className="font-semibold text-purple-600">{formatCurrency(selectedReturn.refundAmount)}</p></div>
              </div>
              <div>
                <label className="text-sm font-semibold text-[var(--text-secondary)] block mb-1.5">처리 메모</label>
                <textarea className="w-full h-20 px-3 py-2 border border-[var(--border)] rounded-lg text-sm resize-none focus:outline-none focus:border-purple-500" placeholder="처리 사유를 입력하세요" />
              </div>
            </div>
            <div className="flex justify-end gap-2 px-6 py-4 border-t border-[var(--border)]">
              <button onClick={() => setShowModal(false)} className="px-4 h-[38px] border border-[var(--border)] rounded-lg text-sm font-semibold hover:bg-gray-50">
                거절
              </button>
              <button onClick={() => { setShowModal(false); }} className="px-4 h-[38px] bg-purple-600 text-white rounded-lg text-sm font-semibold hover:bg-purple-700">
                승인 처리
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
