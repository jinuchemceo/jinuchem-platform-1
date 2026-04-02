'use client';

import { useState } from 'react';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  FileText,
  Download,
  Calendar,
} from 'lucide-react';

import type { SettlementStatus } from '@/types';
import { mockSettlements, formatCurrency } from '@/lib/mock-data';

const sampleSettlements = mockSettlements;

const statusStyles: Record<SettlementStatus, string> = {
  '예정': 'bg-amber-50 text-amber-700',
  '완료': 'bg-green-50 text-green-700',
  '보류': 'bg-red-50 text-red-700',
};

export default function SettlementPage() {
  const [activeTab, setActiveTab] = useState<'전체' | SettlementStatus>('전체');
  const [activeSection, setActiveSection] = useState<'settlement' | 'tax'>('settlement');

  const totalSales = sampleSettlements.reduce((a, s) => a + s.totalSales, 0);
  const totalFees = sampleSettlements.reduce((a, s) => a + s.platformFee + s.paymentFee, 0);
  const totalDeductions = sampleSettlements.reduce((a, s) => a + s.deduction, 0);
  const totalNet = sampleSettlements.reduce((a, s) => a + s.netAmount, 0);

  const filtered = activeTab === '전체' ? sampleSettlements : sampleSettlements.filter(s => s.status === activeTab);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text)]">정산 관리</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">매출, 수수료, 정산 내역을 관리합니다</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveSection('settlement')}
            className={`px-4 h-[38px] text-sm font-semibold rounded-lg border transition-colors ${activeSection === 'settlement' ? 'bg-purple-600 text-white border-purple-600' : 'border-[var(--border)] hover:bg-gray-50'}`}
          >
            정산 내역
          </button>
          <button
            onClick={() => setActiveSection('tax')}
            className={`px-4 h-[38px] text-sm font-semibold rounded-lg border transition-colors ${activeSection === 'tax' ? 'bg-purple-600 text-white border-purple-600' : 'border-[var(--border)] hover:bg-gray-50'}`}
          >
            세금/증빙
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-xl p-5">
          <p className="text-sm text-[var(--text-secondary)]">이번 달 총 매출</p>
          <p className="text-2xl font-bold mt-1">{formatCurrency(totalSales)}</p>
        </div>
        <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-xl p-5">
          <p className="text-sm text-[var(--text-secondary)]">총 수수료</p>
          <p className="text-2xl font-bold mt-1">{formatCurrency(totalFees)}</p>
          <p className="text-xs text-[var(--text-secondary)] mt-1">플랫폼 3.5% + 결제 1.0%</p>
        </div>
        <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-xl p-5">
          <p className="text-sm text-[var(--text-secondary)]">공제액 (반품/취소)</p>
          <p className="text-2xl font-bold mt-1">{formatCurrency(totalDeductions)}</p>
        </div>
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl p-5 text-white">
          <p className="text-sm text-purple-100">순 정산액</p>
          <p className="text-2xl font-bold mt-1">{formatCurrency(totalNet)}</p>
        </div>
      </div>

      {activeSection === 'settlement' ? (
        <>
          {/* Settlement Tabs */}
          <div className="flex gap-2">
            {(['전체', '예정', '완료', '보류'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm rounded-lg border transition-colors ${
                  activeTab === tab
                    ? 'bg-purple-600 text-white border-purple-600'
                    : 'bg-[var(--card-bg)] text-[var(--text-secondary)] border-[var(--border)] hover:bg-gray-50'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Settlement Table */}
          <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-[var(--border)]">
                  <th className="text-left px-4 py-3 font-semibold text-[var(--text-secondary)]">정산기간</th>
                  <th className="text-left px-4 py-3 font-semibold text-[var(--text-secondary)]">총 매출</th>
                  <th className="text-left px-4 py-3 font-semibold text-[var(--text-secondary)]">수수료</th>
                  <th className="text-left px-4 py-3 font-semibold text-[var(--text-secondary)]">공제</th>
                  <th className="text-left px-4 py-3 font-semibold text-[var(--text-secondary)]">정산금액</th>
                  <th className="text-left px-4 py-3 font-semibold text-[var(--text-secondary)]">정산일</th>
                  <th className="text-left px-4 py-3 font-semibold text-[var(--text-secondary)]">상태</th>
                  <th className="text-left px-4 py-3 font-semibold text-[var(--text-secondary)]">상세</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(s => (
                  <tr key={s.id} className="border-b border-[var(--border)] hover:bg-purple-50/30 transition-colors">
                    <td className="px-4 py-3">{s.periodStart} ~ {s.periodEnd}</td>
                    <td className="px-4 py-3">{formatCurrency(s.totalSales)}</td>
                    <td className="px-4 py-3">{formatCurrency(s.platformFee + s.paymentFee)}</td>
                    <td className="px-4 py-3">{s.deduction > 0 ? formatCurrency(s.deduction) : '-'}</td>
                    <td className="px-4 py-3 font-bold">{formatCurrency(s.netAmount)}</td>
                    <td className="px-4 py-3">{s.paidDate || s.scheduledDate}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusStyles[s.status]}`}>{s.status}</span>
                    </td>
                    <td className="px-4 py-3">
                      <button className="px-3 py-1.5 border border-[var(--border)] text-xs font-semibold rounded-lg hover:bg-gray-50">상세</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        /* Tax / Documents Section */
        <div className="space-y-6">
          <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-xl p-6">
            <h3 className="text-lg font-bold mb-4">전자세금계산서</h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-[var(--border)]">
                  <th className="text-left px-4 py-3 font-semibold text-[var(--text-secondary)]">발행번호</th>
                  <th className="text-left px-4 py-3 font-semibold text-[var(--text-secondary)]">발행일</th>
                  <th className="text-left px-4 py-3 font-semibold text-[var(--text-secondary)]">공급가액</th>
                  <th className="text-left px-4 py-3 font-semibold text-[var(--text-secondary)]">세액</th>
                  <th className="text-left px-4 py-3 font-semibold text-[var(--text-secondary)]">합계</th>
                  <th className="text-left px-4 py-3 font-semibold text-[var(--text-secondary)]">다운로드</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-[var(--border)]">
                  <td className="px-4 py-3 font-mono text-xs">TAX-2026-03-001</td>
                  <td className="px-4 py-3">2026-03-31</td>
                  <td className="px-4 py-3">₩16,772,727</td>
                  <td className="px-4 py-3">₩1,677,273</td>
                  <td className="px-4 py-3 font-bold">₩18,450,000</td>
                  <td className="px-4 py-3"><button className="flex items-center gap-1 text-purple-600 text-xs font-semibold"><Download size={14} /> PDF</button></td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-xl p-6">
            <h3 className="text-lg font-bold mb-4">사업자 서류 관리</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="border border-dashed border-[var(--border)] rounded-lg p-6 text-center">
                <FileText size={24} className="mx-auto mb-2 text-[var(--text-secondary)]" />
                <p className="text-sm font-semibold">사업자등록증</p>
                <p className="text-xs text-green-600 mt-1">등록 완료</p>
              </div>
              <div className="border border-dashed border-[var(--border)] rounded-lg p-6 text-center">
                <FileText size={24} className="mx-auto mb-2 text-[var(--text-secondary)]" />
                <p className="text-sm font-semibold">통장사본</p>
                <p className="text-xs text-green-600 mt-1">등록 완료</p>
              </div>
              <div className="border border-dashed border-[var(--border)] rounded-lg p-6 text-center">
                <FileText size={24} className="mx-auto mb-2 text-[var(--text-secondary)]" />
                <p className="text-sm font-semibold">통신판매업 신고증</p>
                <p className="text-xs text-green-600 mt-1">등록 완료</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
