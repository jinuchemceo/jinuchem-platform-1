'use client';

import { useState } from 'react';
import {
  DollarSign,
  TrendingUp,
  FileText,
  Download,
  Calendar,
  X,
  ChevronRight,
} from 'lucide-react';

import type { Settlement, SettlementStatus } from '@/types';
import { mockSettlements, formatCurrency } from '@/lib/mock-data';

const statusStyles: Record<SettlementStatus, string> = {
  '예정': 'bg-amber-50 text-amber-700',
  '완료': 'bg-green-50 text-green-700',
  '보류': 'bg-red-50 text-red-700',
};

const taxInvoices = [
  { id: 'TAX-2026-03-001', date: '2026-03-31', supply: 16772727, tax: 1677273, total: 18450000 },
  { id: 'TAX-2026-02-001', date: '2026-02-28', supply: 12909091, tax: 1290909, total: 14200000 },
  { id: 'TAX-2026-01-001', date: '2026-01-31', supply: 11363636, tax: 1136364, total: 12500000 },
];

type Period = '이번 달' | '지난 달' | '최근 3개월' | '최근 6개월';

export default function SettlementPage() {
  const [activeTab, setActiveTab] = useState<'전체' | SettlementStatus>('전체');
  const [activeSection, setActiveSection] = useState<'settlement' | 'tax'>('settlement');
  const [period, setPeriod] = useState<Period>('이번 달');
  const [detailSettlement, setDetailSettlement] = useState<Settlement | null>(null);
  const [showRequestModal, setShowRequestModal] = useState(false);

  const totalSales = mockSettlements.reduce((a, s) => a + s.totalSales, 0);
  const totalPlatformFee = mockSettlements.reduce((a, s) => a + s.platformFee, 0);
  const totalPaymentFee = mockSettlements.reduce((a, s) => a + s.paymentFee, 0);
  const totalFees = totalPlatformFee + totalPaymentFee;
  const totalDeductions = mockSettlements.reduce((a, s) => a + s.deduction, 0);
  const totalNet = mockSettlements.reduce((a, s) => a + s.netAmount, 0);

  const filtered = activeTab === '전체' ? mockSettlements : mockSettlements.filter(s => s.status === activeTab);

  const feeRate = totalSales > 0 ? ((totalFees / totalSales) * 100).toFixed(1) : '0';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>정산 관리</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>매출, 수수료, 정산 내역을 관리합니다</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveSection('settlement')}
            className={`px-4 h-[38px] text-sm font-semibold rounded-lg border transition-colors ${activeSection === 'settlement' ? 'bg-purple-600 text-white border-purple-600' : 'hover:bg-gray-50'}`}
            style={activeSection !== 'settlement' ? { borderColor: 'var(--border)', color: 'var(--text)' } : {}}
          >
            정산 내역
          </button>
          <button
            onClick={() => setActiveSection('tax')}
            className={`px-4 h-[38px] text-sm font-semibold rounded-lg border transition-colors ${activeSection === 'tax' ? 'bg-purple-600 text-white border-purple-600' : 'hover:bg-gray-50'}`}
            style={activeSection !== 'tax' ? { borderColor: 'var(--border)', color: 'var(--text)' } : {}}
          >
            세금/증빙
          </button>
          <button
            onClick={() => setShowRequestModal(true)}
            className="flex items-center gap-1.5 px-4 h-[38px] bg-purple-600 text-white text-sm font-semibold rounded-lg hover:bg-purple-700 transition-colors"
          >
            <DollarSign size={16} /> 정산 요청하기
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5">
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>이번 달 총 매출</p>
          <p className="text-2xl font-bold mt-1" style={{ color: 'var(--text)' }}>{formatCurrency(totalSales)}</p>
          <p className="text-xs mt-1 flex items-center gap-1" style={{ color: 'var(--success)' }}>
            <TrendingUp size={12} /> +12.5% 전월 대비
          </p>
        </div>
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5">
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>총 수수료</p>
          <p className="text-2xl font-bold mt-1" style={{ color: 'var(--text)' }}>{formatCurrency(totalFees)}</p>
          <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
            플랫폼 {formatCurrency(totalPlatformFee)} + 결제 {formatCurrency(totalPaymentFee)}
          </p>
        </div>
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5">
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>공제액 (반품/취소)</p>
          <p className="text-2xl font-bold mt-1" style={{ color: 'var(--text)' }}>{formatCurrency(totalDeductions)}</p>
          <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
            {mockSettlements.filter(s => s.deduction > 0).length}건 공제 발생
          </p>
        </div>
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl p-5 text-white">
          <p className="text-sm text-purple-100">순 정산액</p>
          <p className="text-2xl font-bold mt-1">{formatCurrency(totalNet)}</p>
          <p className="text-xs mt-1 text-purple-200">수수료율 {feeRate}%</p>
        </div>
      </div>

      {activeSection === 'settlement' ? (
        <>
          {/* Period + Tabs + Export */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex gap-2">
              {(['전체', '예정', '완료', '보류'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 text-sm rounded-lg border transition-colors ${
                    activeTab === tab
                      ? 'bg-purple-600 text-white border-purple-600'
                      : 'hover:bg-gray-50'
                  }`}
                  style={activeTab !== tab ? { borderColor: 'var(--border)', color: 'var(--text-secondary)', background: 'var(--bg-card)' } : {}}
                >
                  {tab}
                  <span className={`ml-1.5 text-xs font-bold px-1.5 py-0.5 rounded-full ${
                    activeTab === tab ? 'bg-white/20' : 'bg-gray-100'
                  }`}>
                    {tab === '전체' ? mockSettlements.length : mockSettlements.filter(s => s.status === tab).length}
                  </span>
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <select
                value={period}
                onChange={e => setPeriod(e.target.value as Period)}
                className="h-[38px] px-3 border rounded-lg text-sm"
                style={{ borderColor: 'var(--border)', color: 'var(--text)', background: 'var(--bg-card)' }}
              >
                <option>이번 달</option>
                <option>지난 달</option>
                <option>최근 3개월</option>
                <option>최근 6개월</option>
              </select>
              <button
                className="flex items-center gap-1.5 px-4 h-[38px] border rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors"
                style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
              >
                <Download size={14} /> XLS 내보내기
              </button>
            </div>
          </div>

          {/* Fee Structure Bar */}
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5">
            <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-secondary)' }}>수수료 구조</h3>
            <div className="flex items-center gap-3 text-xs mb-2">
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-purple-500" /> 순 정산액</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-amber-500" /> 플랫폼 수수료 (3.5%)</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-blue-500" /> 결제 수수료 (1.0%)</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-red-400" /> 공제액</span>
            </div>
            <div className="flex h-6 rounded-lg overflow-hidden">
              <div className="bg-purple-500" style={{ width: `${(totalNet / totalSales) * 100}%` }} />
              <div className="bg-amber-500" style={{ width: `${(totalPlatformFee / totalSales) * 100}%` }} />
              <div className="bg-blue-500" style={{ width: `${(totalPaymentFee / totalSales) * 100}%` }} />
              <div className="bg-red-400" style={{ width: `${(totalDeductions / totalSales) * 100}%` }} />
            </div>
            <div className="flex justify-between mt-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
              <span>총 매출 {formatCurrency(totalSales)}</span>
              <span>순 정산 {formatCurrency(totalNet)} ({((totalNet / totalSales) * 100).toFixed(1)}%)</span>
            </div>
          </div>

          {/* Settlement Table */}
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2" style={{ borderColor: 'var(--border)' }}>
                  <th className="text-left px-4 py-3 font-semibold" style={{ color: 'var(--text-secondary)' }}>정산기간</th>
                  <th className="text-right px-4 py-3 font-semibold" style={{ color: 'var(--text-secondary)' }}>총 매출</th>
                  <th className="text-right px-4 py-3 font-semibold" style={{ color: 'var(--text-secondary)' }}>플랫폼 수수료</th>
                  <th className="text-right px-4 py-3 font-semibold" style={{ color: 'var(--text-secondary)' }}>결제 수수료</th>
                  <th className="text-right px-4 py-3 font-semibold" style={{ color: 'var(--text-secondary)' }}>공제</th>
                  <th className="text-right px-4 py-3 font-semibold" style={{ color: 'var(--text-secondary)' }}>정산금액</th>
                  <th className="text-center px-4 py-3 font-semibold" style={{ color: 'var(--text-secondary)' }}>정산일</th>
                  <th className="text-center px-4 py-3 font-semibold" style={{ color: 'var(--text-secondary)' }}>상태</th>
                  <th className="text-center px-4 py-3 font-semibold" style={{ color: 'var(--text-secondary)' }}>상세</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(s => (
                  <tr key={s.id} className="border-b hover:bg-gray-50 transition-colors" style={{ borderColor: 'var(--border)' }}>
                    <td className="px-4 py-3" style={{ color: 'var(--text)' }}>{s.periodStart} ~ {s.periodEnd}</td>
                    <td className="px-4 py-3 text-right" style={{ color: 'var(--text)' }}>{formatCurrency(s.totalSales)}</td>
                    <td className="px-4 py-3 text-right" style={{ color: 'var(--text-secondary)' }}>{formatCurrency(s.platformFee)}</td>
                    <td className="px-4 py-3 text-right" style={{ color: 'var(--text-secondary)' }}>{formatCurrency(s.paymentFee)}</td>
                    <td className="px-4 py-3 text-right" style={{ color: s.deduction > 0 ? 'var(--danger)' : 'var(--text-secondary)' }}>{s.deduction > 0 ? '-' + formatCurrency(s.deduction) : '-'}</td>
                    <td className="px-4 py-3 text-right font-bold" style={{ color: 'var(--text)' }}>{formatCurrency(s.netAmount)}</td>
                    <td className="px-4 py-3 text-center" style={{ color: 'var(--text-secondary)' }}>{s.paidDate || s.scheduledDate}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusStyles[s.status]}`}>{s.status}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => setDetailSettlement(s)}
                        className="px-3 py-1.5 text-xs font-semibold rounded-lg border hover:bg-gray-50 transition-colors"
                        style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
                      >
                        상세
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2" style={{ borderColor: 'var(--border)', background: 'var(--bg)' }}>
                  <td className="px-4 py-3 font-bold" style={{ color: 'var(--text)' }}>합계</td>
                  <td className="px-4 py-3 text-right font-bold" style={{ color: 'var(--text)' }}>{formatCurrency(totalSales)}</td>
                  <td className="px-4 py-3 text-right font-semibold" style={{ color: 'var(--text-secondary)' }}>{formatCurrency(totalPlatformFee)}</td>
                  <td className="px-4 py-3 text-right font-semibold" style={{ color: 'var(--text-secondary)' }}>{formatCurrency(totalPaymentFee)}</td>
                  <td className="px-4 py-3 text-right font-semibold" style={{ color: 'var(--danger)' }}>{totalDeductions > 0 ? '-' + formatCurrency(totalDeductions) : '-'}</td>
                  <td className="px-4 py-3 text-right font-bold" style={{ color: 'var(--primary)' }}>{formatCurrency(totalNet)}</td>
                  <td colSpan={3} />
                </tr>
              </tfoot>
            </table>
          </div>
        </>
      ) : (
        /* Tax / Documents Section */
        <div className="space-y-6">
          {/* Tax Invoices */}
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold" style={{ color: 'var(--text)' }}>전자세금계산서</h3>
              <button
                className="flex items-center gap-1.5 px-3 h-[34px] border rounded-lg text-xs font-semibold hover:bg-gray-50 transition-colors"
                style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
              >
                <Download size={12} /> 일괄 다운로드
              </button>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2" style={{ borderColor: 'var(--border)' }}>
                  <th className="text-left px-4 py-3 font-semibold" style={{ color: 'var(--text-secondary)' }}>발행번호</th>
                  <th className="text-center px-4 py-3 font-semibold" style={{ color: 'var(--text-secondary)' }}>발행일</th>
                  <th className="text-right px-4 py-3 font-semibold" style={{ color: 'var(--text-secondary)' }}>공급가액</th>
                  <th className="text-right px-4 py-3 font-semibold" style={{ color: 'var(--text-secondary)' }}>세액</th>
                  <th className="text-right px-4 py-3 font-semibold" style={{ color: 'var(--text-secondary)' }}>합계</th>
                  <th className="text-center px-4 py-3 font-semibold" style={{ color: 'var(--text-secondary)' }}>다운로드</th>
                </tr>
              </thead>
              <tbody>
                {taxInvoices.map(inv => (
                  <tr key={inv.id} className="border-b hover:bg-gray-50 transition-colors" style={{ borderColor: 'var(--border)' }}>
                    <td className="px-4 py-3 font-mono text-xs" style={{ color: 'var(--primary)' }}>{inv.id}</td>
                    <td className="px-4 py-3 text-center" style={{ color: 'var(--text)' }}>{inv.date}</td>
                    <td className="px-4 py-3 text-right" style={{ color: 'var(--text)' }}>{formatCurrency(inv.supply)}</td>
                    <td className="px-4 py-3 text-right" style={{ color: 'var(--text-secondary)' }}>{formatCurrency(inv.tax)}</td>
                    <td className="px-4 py-3 text-right font-bold" style={{ color: 'var(--text)' }}>{formatCurrency(inv.total)}</td>
                    <td className="px-4 py-3 text-center">
                      <button className="flex items-center gap-1 mx-auto text-xs font-semibold" style={{ color: 'var(--primary)' }}>
                        <Download size={14} /> PDF
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Transaction Reports */}
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold" style={{ color: 'var(--text)' }}>거래명세서</h3>
              <button
                className="flex items-center gap-1.5 px-3 h-[34px] border rounded-lg text-xs font-semibold hover:bg-gray-50 transition-colors"
                style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
              >
                <Download size={12} /> 일괄 다운로드
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {['2026년 3월', '2026년 2월', '2026년 1월'].map(month => (
                <div key={month} className="flex items-center justify-between p-4 border rounded-xl" style={{ borderColor: 'var(--border)' }}>
                  <div className="flex items-center gap-3">
                    <FileText size={20} style={{ color: 'var(--text-secondary)' }} />
                    <div>
                      <p className="text-sm font-medium" style={{ color: 'var(--text)' }}>{month}</p>
                      <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>거래명세서</p>
                    </div>
                  </div>
                  <button className="text-xs font-semibold" style={{ color: 'var(--primary)' }}>
                    <Download size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Document Management */}
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-6">
            <h3 className="text-base font-bold mb-4" style={{ color: 'var(--text)' }}>사업자 서류 관리</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { name: '사업자등록증', status: '등록 완료', date: '2025-06-15' },
                { name: '통장사본', status: '등록 완료', date: '2025-06-15' },
                { name: '통신판매업 신고증', status: '등록 완료', date: '2025-06-15' },
              ].map(doc => (
                <div key={doc.name} className="border border-dashed rounded-xl p-5 text-center" style={{ borderColor: 'var(--border)' }}>
                  <FileText size={24} className="mx-auto mb-2" style={{ color: 'var(--text-secondary)' }} />
                  <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{doc.name}</p>
                  <p className="text-xs mt-1 font-semibold" style={{ color: 'var(--success)' }}>{doc.status}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-tertiary)' }}>등록일: {doc.date}</p>
                  <button className="mt-3 text-xs font-semibold px-3 py-1 rounded-lg" style={{ color: 'var(--primary)', background: 'var(--primary-light)' }}>변경</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {detailSettlement && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setDetailSettlement(null)}>
          <div className="bg-[var(--bg-card)] rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
              <div>
                <h2 className="text-lg font-bold" style={{ color: 'var(--text)' }}>정산 상세</h2>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{detailSettlement.periodStart} ~ {detailSettlement.periodEnd}</p>
              </div>
              <button onClick={() => setDetailSettlement(null)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100">
                <X size={18} />
              </button>
            </div>
            <div className="px-6 py-5 space-y-5">
              {/* Summary */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="p-3 rounded-lg" style={{ background: 'var(--bg)' }}>
                  <p style={{ color: 'var(--text-secondary)' }}>총 매출</p>
                  <p className="text-lg font-bold mt-0.5" style={{ color: 'var(--text)' }}>{formatCurrency(detailSettlement.totalSales)}</p>
                </div>
                <div className="p-3 rounded-lg" style={{ background: 'var(--bg)' }}>
                  <p style={{ color: 'var(--text-secondary)' }}>순 정산액</p>
                  <p className="text-lg font-bold mt-0.5" style={{ color: 'var(--primary)' }}>{formatCurrency(detailSettlement.netAmount)}</p>
                </div>
              </div>

              {/* Fee Breakdown */}
              <div>
                <h4 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-secondary)' }}>수수료 내역</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between py-2 border-b" style={{ borderColor: 'var(--border)' }}>
                    <span style={{ color: 'var(--text)' }}>플랫폼 수수료 (3.5%)</span>
                    <span style={{ color: 'var(--text)' }}>-{formatCurrency(detailSettlement.platformFee)}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b" style={{ borderColor: 'var(--border)' }}>
                    <span style={{ color: 'var(--text)' }}>결제 수수료 (1.0%)</span>
                    <span style={{ color: 'var(--text)' }}>-{formatCurrency(detailSettlement.paymentFee)}</span>
                  </div>
                  {detailSettlement.deduction > 0 && (
                    <div className="flex justify-between py-2 border-b" style={{ borderColor: 'var(--border)' }}>
                      <span style={{ color: 'var(--danger)' }}>반품/취소 공제</span>
                      <span style={{ color: 'var(--danger)' }}>-{formatCurrency(detailSettlement.deduction)}</span>
                    </div>
                  )}
                  <div className="flex justify-between py-2 font-bold">
                    <span style={{ color: 'var(--text)' }}>최종 정산금액</span>
                    <span style={{ color: 'var(--primary)' }}>{formatCurrency(detailSettlement.netAmount)}</span>
                  </div>
                </div>
              </div>

              {/* Sample Order Breakdown */}
              <div>
                <h4 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-secondary)' }}>주문별 내역</h4>
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b" style={{ borderColor: 'var(--border)' }}>
                      <th className="text-left px-3 py-2 font-semibold" style={{ color: 'var(--text-secondary)' }}>주문번호</th>
                      <th className="text-right px-3 py-2 font-semibold" style={{ color: 'var(--text-secondary)' }}>주문금액</th>
                      <th className="text-right px-3 py-2 font-semibold" style={{ color: 'var(--text-secondary)' }}>수수료</th>
                      <th className="text-right px-3 py-2 font-semibold" style={{ color: 'var(--text-secondary)' }}>정산금액</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { id: 'ORD-2026-0325', amount: 1250000, fee: 56250, net: 1193750 },
                      { id: 'ORD-2026-0326', amount: 680000, fee: 30600, net: 649400 },
                      { id: 'ORD-2026-0327', amount: 2100000, fee: 94500, net: 2005500 },
                      { id: 'ORD-2026-0328', amount: 250000, fee: 11250, net: 238750 },
                    ].map(o => (
                      <tr key={o.id} className="border-b" style={{ borderColor: 'var(--border)' }}>
                        <td className="px-3 py-2 font-mono" style={{ color: 'var(--primary)' }}>{o.id}</td>
                        <td className="px-3 py-2 text-right" style={{ color: 'var(--text)' }}>{formatCurrency(o.amount)}</td>
                        <td className="px-3 py-2 text-right" style={{ color: 'var(--text-secondary)' }}>-{formatCurrency(o.fee)}</td>
                        <td className="px-3 py-2 text-right font-semibold" style={{ color: 'var(--text)' }}>{formatCurrency(o.net)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Status */}
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>정산 상태:</span>
                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusStyles[detailSettlement.status]}`}>
                    {detailSettlement.status}
                  </span>
                </div>
                <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  {detailSettlement.status === '완료' ? '입금일: ' + detailSettlement.paidDate : '예정일: ' + detailSettlement.scheduledDate}
                </span>
              </div>
            </div>
            <div className="flex justify-end gap-2 px-6 py-4 border-t" style={{ borderColor: 'var(--border)' }}>
              <button
                className="flex items-center gap-1.5 px-4 h-[38px] border rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors"
                style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
              >
                <Download size={14} /> PDF 다운로드
              </button>
              <button onClick={() => setDetailSettlement(null)} className="px-4 h-[38px] bg-purple-600 text-white rounded-lg text-sm font-semibold hover:bg-purple-700 transition-colors">
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Settlement Request Modal */}
      {showRequestModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setShowRequestModal(false)}>
          <div className="bg-[var(--bg-card)] rounded-2xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
              <h2 className="text-lg font-bold" style={{ color: 'var(--text)' }}>정산 요청</h2>
              <button onClick={() => setShowRequestModal(false)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100">
                <X size={18} />
              </button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div className="p-4 rounded-xl" style={{ background: 'var(--bg)' }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>정산 가능 금액</span>
                  <span className="text-xl font-bold" style={{ color: 'var(--primary)' }}>{formatCurrency(totalNet - mockSettlements.filter(s => s.status === '완료').reduce((a, s) => a + s.netAmount, 0))}</span>
                </div>
                <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>미정산 주문 건에 대한 정산 요청입니다</p>
              </div>
              <div>
                <label className="text-xs font-semibold block mb-1.5" style={{ color: 'var(--text-secondary)' }}>정산 유형</label>
                <select className="w-full h-[38px] px-3 border rounded-lg text-sm" style={{ borderColor: 'var(--border)', color: 'var(--text)', background: 'var(--bg-card)' }}>
                  <option>정기 정산 (주간)</option>
                  <option>빠른 정산 (즉시)</option>
                  <option>월간 정산</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold block mb-1.5" style={{ color: 'var(--text-secondary)' }}>입금 계좌</label>
                <div className="flex items-center gap-3 p-3 border rounded-lg" style={{ borderColor: 'var(--border)' }}>
                  <span className="text-sm font-medium" style={{ color: 'var(--text)' }}>국민은행 123-456-789012 (Sigma-Aldrich Korea)</span>
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold block mb-1.5" style={{ color: 'var(--text-secondary)' }}>요청 메모 (선택)</label>
                <textarea className="w-full h-16 px-3 py-2 border rounded-lg text-sm resize-none focus:outline-none" style={{ borderColor: 'var(--border)', color: 'var(--text)', background: 'var(--bg-card)' }} placeholder="정산 관련 요청사항을 입력하세요" />
              </div>
              <div className="p-3 rounded-lg text-xs" style={{ background: 'rgba(255,149,0,0.1)', color: '#FF9500' }}>
                빠른 정산 선택 시 수수료 0.5%가 추가로 차감됩니다.
              </div>
            </div>
            <div className="flex justify-end gap-2 px-6 py-4 border-t" style={{ borderColor: 'var(--border)' }}>
              <button onClick={() => setShowRequestModal(false)} className="px-4 h-[38px] border rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors" style={{ borderColor: 'var(--border)', color: 'var(--text)' }}>
                취소
              </button>
              <button onClick={() => setShowRequestModal(false)} className="px-5 h-[38px] bg-purple-600 text-white rounded-lg text-sm font-semibold hover:bg-purple-700 transition-colors">
                정산 요청
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
