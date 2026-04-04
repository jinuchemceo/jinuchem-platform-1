'use client';

import { TrendingUp, ShoppingBag, Building, Users, Download } from 'lucide-react';

const statCards = [
  { label: '이번달 총 구매액', value: '8,450,000', sub: '전월 대비 +8.2%', icon: <TrendingUp size={18} />, color: '#3b82f6', border: '#3b82f6' },
  { label: '이번달 주문 건수', value: '25건', sub: '전월 대비 +3건', icon: <ShoppingBag size={18} />, color: '#10b981', border: '#10b981' },
  { label: '주요 공급사', value: '3사', sub: 'Sigma, TCI, Alfa', icon: <Building size={18} />, color: '#f59e0b', border: '#f59e0b' },
  { label: '활성 주문자', value: '6명', sub: '총 8명 중', icon: <Users size={18} />, color: '#8b5cf6', border: '#8b5cf6' },
];

const categoryBars = [
  { label: '유기시약', pct: 42, amount: '3,549,000', color: '#3b82f6' },
  { label: '무기시약', pct: 23, amount: '1,943,500', color: '#10b981' },
  { label: '용매', pct: 18, amount: '1,521,000', color: '#f59e0b' },
  { label: '소모품', pct: 12, amount: '1,014,000', color: '#8b5cf6' },
  { label: '기타', pct: 5, amount: '422,500', color: '#94a3b8' },
];

const supplierBars = [
  { label: 'Sigma-Aldrich', pct: 48, amount: '4,056,000', color: '#3b82f6' },
  { label: 'TCI', pct: 30, amount: '2,535,000', color: '#10b981' },
  { label: 'Alfa Aesar', pct: 22, amount: '1,859,000', color: '#f59e0b' },
];

const memberPurchases = [
  { name: '이박사', orders: 7, amount: '1,245,000', pct: 14.7 },
  { name: '김연구', orders: 5, amount: '987,400', pct: 11.7 },
  { name: '정연구', orders: 4, amount: '523,000', pct: 6.2 },
  { name: '박석사', orders: 3, amount: '412,000', pct: 4.9 },
  { name: '최학생', orders: 2, amount: '151,000', pct: 1.8 },
  { name: '한석사', orders: 1, amount: '89,000', pct: 1.1 },
];

const monthlyBudget = [
  { month: '1월', budget: 1250000, used: 2450000 },
  { month: '2월', budget: 1250000, used: 3120000 },
  { month: '3월', budget: 1250000, used: 2880000 },
  { month: '4월', budget: 1250000, used: 1200000 },
];

const maxUsed = Math.max(...monthlyBudget.map(m => m.used));

export default function ReportsPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900 mb-1">보고서 / 분석</h1>
          <p className="text-sm text-gray-500">연구실 구매 현황을 분석하고 리포트를 생성합니다.</p>
        </div>
        <div className="flex items-center gap-2">
          <select className="h-[38px] px-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>2026년 4월</option>
            <option>2026년 3월</option>
            <option>2026년 2월</option>
            <option>2026년 1월</option>
          </select>
          <button className="h-[38px] px-4 bg-white border border-gray-300 text-gray-600 rounded-lg text-sm hover:bg-gray-50 flex items-center gap-1.5">
            <Download size={14} /> PDF 다운로드
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {statCards.map(card => (
          <div key={card.label} className="rounded-xl p-5 bg-white border border-gray-200" style={{ borderLeft: `4px solid ${card.border}` }}>
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs text-gray-400">{card.label}</span>
              <span style={{ color: card.color }}>{card.icon}</span>
            </div>
            <div className="text-2xl font-extrabold tracking-tight text-gray-900">{card.value}</div>
            <div className="text-xs mt-1 text-gray-400">{card.sub}</div>
          </div>
        ))}
      </div>

      {/* 2x2 Grid */}
      <div className="grid grid-cols-2 gap-6">
        {/* Category Purchase Ratio */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h2 className="text-sm font-bold text-gray-900 mb-4">품목별 구매 비율</h2>
          <div className="space-y-3">
            {categoryBars.map(b => (
              <div key={b.label}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-700">{b.label}</span>
                  <span className="text-xs text-gray-500">{b.amount}원 ({b.pct}%)</span>
                </div>
                <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${b.pct}%`, backgroundColor: b.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Supplier Purchase Ratio */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h2 className="text-sm font-bold text-gray-900 mb-4">공급사별 구매 비율</h2>
          <div className="space-y-3">
            {supplierBars.map(b => (
              <div key={b.label}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-700">{b.label}</span>
                  <span className="text-xs text-gray-500">{b.amount}원 ({b.pct}%)</span>
                </div>
                <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${b.pct}%`, backgroundColor: b.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Member Purchases */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h2 className="text-sm font-bold text-gray-900 mb-4">연구원별 구매 현황</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="pb-2 text-left font-medium text-gray-500">이름</th>
                <th className="pb-2 text-center font-medium text-gray-500">주문</th>
                <th className="pb-2 text-right font-medium text-gray-500">금액</th>
                <th className="pb-2 text-right font-medium text-gray-500">비율</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {memberPurchases.map(m => (
                <tr key={m.name}>
                  <td className="py-2 text-gray-900">{m.name}</td>
                  <td className="py-2 text-center text-gray-600">{m.orders}건</td>
                  <td className="py-2 text-right font-medium text-gray-900">{m.amount}원</td>
                  <td className="py-2 text-right text-gray-500">{m.pct}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Budget Execution Trend */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h2 className="text-sm font-bold text-gray-900 mb-4">예산 집행 추이</h2>
          <div className="flex items-end gap-6 h-[200px]">
            {monthlyBudget.map(d => {
              const h = (d.used / maxUsed) * 100;
              return (
                <div key={d.month} className="flex-1 flex flex-col items-center justify-end h-full">
                  <span className="text-xs text-gray-500 mb-1">{(d.used / 10000).toFixed(0)}만</span>
                  <div className="w-full rounded-t-md bg-blue-500" style={{ height: `${h}%`, minHeight: 8 }} />
                  <div className="w-full h-0.5 bg-red-300 mt-0.5" title="월 예산선" />
                  <span className="text-xs text-gray-500 mt-2">{d.month}</span>
                </div>
              );
            })}
            {['5월','6월','7월','8월','9월','10월','11월','12월'].map(m => (
              <div key={m} className="flex-1 flex flex-col items-center justify-end h-full">
                <div className="w-full rounded-t-md bg-gray-100 h-2" />
                <div className="w-full h-0.5 bg-red-100 mt-0.5" />
                <span className="text-xs text-gray-300 mt-2">{m}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
            <span className="flex items-center gap-1"><span className="w-3 h-3 bg-blue-500 rounded" /> 집행액</span>
            <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-red-300 inline-block" style={{ width: 12 }} /> 월 예산선</span>
          </div>
        </div>
      </div>
    </div>
  );
}
