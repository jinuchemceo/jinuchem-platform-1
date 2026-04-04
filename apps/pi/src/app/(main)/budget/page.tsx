'use client';

import { useState } from 'react';
import { DollarSign, TrendingUp, Wallet, Calculator, Download, ChevronLeft, ChevronRight } from 'lucide-react';

const statCards = [
  { label: '연간 예산', value: '15,000,000', sub: '2026년도 총 배정액', icon: <DollarSign size={18} />, color: '#3b82f6', border: '#3b82f6' },
  { label: '집행액', value: '8,450,000', sub: '전년동기 대비 +12%', icon: <TrendingUp size={18} />, color: '#10b981', border: '#10b981' },
  { label: '잔여 예산', value: '6,550,000', sub: '잔여율 43.7%', icon: <Wallet size={18} />, color: '#f59e0b', border: '#f59e0b' },
  { label: '월 평균 집행', value: '2,816,667', sub: '3개월 기준', icon: <Calculator size={18} />, color: '#8b5cf6', border: '#8b5cf6' },
];

const categoryBudget = [
  { category: '시약', budget: 8000000, used: 5200000, color: '#3b82f6' },
  { category: '소모품', budget: 4000000, used: 2100000, color: '#10b981' },
  { category: '장비', budget: 3000000, used: 1150000, color: '#f59e0b' },
];

const monthlyData = [
  { month: '1월', amount: 2450000 },
  { month: '2월', amount: 3120000 },
  { month: '3월', amount: 2880000 },
  { month: '4월', amount: 1200000 },
];

const recentTransactions = [
  { date: '2026-04-03', desc: 'Sodium hydroxide 1kg x5', category: '시약', amount: 228000, requester: '김연구' },
  { date: '2026-04-03', desc: 'PIPES 25G + Toluene 2.5L', category: '시약', amount: 635400, requester: '박석사' },
  { date: '2026-04-01', desc: 'Nitrile Gloves M x20box', category: '소모품', amount: 180000, requester: '최학생' },
  { date: '2026-03-28', desc: 'PBS Buffer 500mL x10', category: '시약', amount: 320000, requester: '최학생' },
  { date: '2026-03-25', desc: 'Pipette Tips 1000uL x5pk', category: '소모품', amount: 125000, requester: '이박사' },
];

const maxMonthly = Math.max(...monthlyData.map(d => d.amount));

export default function BudgetPage() {
  const [period, setPeriod] = useState('2026');

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900 mb-1">예산 관리</h1>
          <p className="text-sm text-gray-500">연구실 예산 현황 및 집행 내역을 관리합니다.</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={period}
            onChange={e => setPeriod(e.target.value)}
            className="h-[38px] px-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="2026">2026년</option>
            <option value="2025">2025년</option>
          </select>
          <button className="h-[38px] px-4 bg-white border border-gray-300 text-gray-600 rounded-lg text-sm hover:bg-gray-50 flex items-center gap-1.5">
            <Download size={14} /> 엑셀 다운로드
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {statCards.map(card => (
          <div
            key={card.label}
            className="rounded-xl p-5 bg-white border border-gray-200"
            style={{ borderLeft: `4px solid ${card.border}` }}
          >
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs text-gray-400">{card.label}</span>
              <span style={{ color: card.color }}>{card.icon}</span>
            </div>
            <div className="text-2xl font-extrabold tracking-tight text-gray-900">{card.value}원</div>
            <div className="text-xs mt-1 text-gray-400">{card.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* Category Budget */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h2 className="text-sm font-bold text-gray-900 mb-4">품목별 예산 현황</h2>
          <div className="space-y-4">
            {categoryBudget.map(cat => {
              const pct = Math.round((cat.used / cat.budget) * 100);
              return (
                <div key={cat.category}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-medium text-gray-700">{cat.category}</span>
                    <span className="text-xs text-gray-500">
                      {(cat.used / 10000).toLocaleString()}만 / {(cat.budget / 10000).toLocaleString()}만원 ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${pct}%`, backgroundColor: cat.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Monthly Bar Chart */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h2 className="text-sm font-bold text-gray-900 mb-4">월별 집행 추이</h2>
          <div className="flex items-end gap-4 h-[160px]">
            {monthlyData.map(d => {
              const heightPct = (d.amount / maxMonthly) * 100;
              return (
                <div key={d.month} className="flex-1 flex flex-col items-center justify-end h-full">
                  <span className="text-xs text-gray-500 mb-1">{(d.amount / 10000).toFixed(0)}만</span>
                  <div
                    className="w-full rounded-t-md bg-blue-500 transition-all"
                    style={{ height: `${heightPct}%`, minHeight: 8 }}
                  />
                  <span className="text-xs text-gray-500 mt-2">{d.month}</span>
                </div>
              );
            })}
            {['5월','6월','7월','8월','9월','10월','11월','12월'].map(m => (
              <div key={m} className="flex-1 flex flex-col items-center justify-end h-full">
                <div className="w-full rounded-t-md bg-gray-100 h-2" />
                <span className="text-xs text-gray-300 mt-2">{m}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Transactions Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-sm font-bold text-gray-900">최근 집행 내역</h2>
          <button className="text-xs text-blue-600 hover:underline">전체보기</button>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-gray-500">날짜</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">내역</th>
              <th className="px-4 py-3 text-center font-medium text-gray-500">품목</th>
              <th className="px-4 py-3 text-right font-medium text-gray-500">금액</th>
              <th className="px-4 py-3 text-center font-medium text-gray-500">요청자</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {recentTransactions.map((t, i) => (
              <tr key={i} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-500">{t.date}</td>
                <td className="px-4 py-3 text-gray-900">{t.desc}</td>
                <td className="px-4 py-3 text-center">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${t.category === '시약' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                    {t.category}
                  </span>
                </td>
                <td className="px-4 py-3 text-right font-medium text-gray-900">{t.amount.toLocaleString()}원</td>
                <td className="px-4 py-3 text-center text-gray-600">{t.requester}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center gap-1 mt-6">
        <button className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 text-gray-400 hover:bg-gray-100"><ChevronLeft size={14} /></button>
        <button className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-500 text-white text-sm font-medium">1</button>
        <button className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 text-gray-600 text-sm hover:bg-gray-100">2</button>
        <button className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 text-gray-400 hover:bg-gray-100"><ChevronRight size={14} /></button>
      </div>
    </div>
  );
}
