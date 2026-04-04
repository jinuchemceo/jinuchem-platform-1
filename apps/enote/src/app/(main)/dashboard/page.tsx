'use client';

import { Clock, DollarSign, Wallet, Users, CheckSquare, BarChart3, CircleAlert, CircleCheck, Info } from 'lucide-react';
import Link from 'next/link';

const statCards = [
  { label: '승인대기', value: '4건', sub: '\u20a91,892,400 대기 중', icon: <Clock size={18} />, color: '#f59e0b', border: '#f59e0b' },
  { label: '이번달 집행액', value: '\u20a98,450,000', sub: '월 예산의 56%', icon: <DollarSign size={18} />, color: '#3b82f6', border: '#3b82f6' },
  { label: '잔여예산', value: '\u20a96,550,000', sub: '연간 잔여 43.7%', icon: <Wallet size={18} />, color: '#10b981', border: '#10b981' },
  { label: '연구실원', value: '8명', sub: '활성 6 / 비활성 2', icon: <Users size={18} />, color: '#fff', border: '#6366f1', accent: true },
];

const approvalRequests = [
  { name: '김연구', product: 'Sodium hydroxide 1kg x5', amount: '\u20a9228,000', date: '04-03' },
  { name: '박석사', product: 'PIPES 25G + Toluene 2.5L', amount: '\u20a9635,400', date: '04-03' },
  { name: '이박사', product: 'Acetone ACS 25mL x10', amount: '\u20a9878,000', date: '04-02' },
  { name: '최학생', product: 'Methanol HPLC 1L x3', amount: '\u20a9151,000', date: '04-01' },
];

const budgetBars = [
  { label: '시약', used: '\u20a95,200,000', total: '\u20a98,000,000', pct: 65, color: '#3b82f6' },
  { label: '소모품', used: '\u20a92,100,000', total: '\u20a94,000,000', pct: 52.5, color: '#10b981' },
  { label: '장비', used: '\u20a91,150,000', total: '\u20a93,000,000', pct: 38.3, color: '#f59e0b' },
];

export default function PIDashboard() {
  return (
    <div>
      <h1 className="text-xl font-bold text-gray-900 mb-1">PI 대시보드</h1>
      <p className="text-sm text-gray-500 mb-6">김지누 PI -- 유기합성 연구실 관리 현황</p>

      {/* Stat Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="rounded-xl p-5 border border-gray-200"
            style={{
              borderLeft: `4px solid ${card.border}`,
              background: card.accent ? 'linear-gradient(135deg, #3b82f6, #8b5cf6)' : '#fff',
              color: card.accent ? '#fff' : 'inherit',
            }}
          >
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs" style={{ color: card.accent ? 'rgba(255,255,255,.8)' : '#94a3b8' }}>{card.label}</span>
              <span style={{ color: card.accent ? 'rgba(255,255,255,.7)' : card.color }}>{card.icon}</span>
            </div>
            <div className="text-2xl font-extrabold tracking-tight">{card.value}</div>
            <div className="text-xs mt-1" style={{ color: card.accent ? 'rgba(255,255,255,.7)' : '#94a3b8' }}>{card.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-[1fr_340px] gap-6">
        {/* Left */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-100">
              <h3 className="text-[15px] font-bold text-gray-900">최근 승인 요청</h3>
              <Link href="/approvals" className="text-sm text-blue-600 hover:underline">전체보기 &rarr;</Link>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[11px] text-gray-400 uppercase border-b border-gray-100">
                  <th className="text-left py-2 font-semibold">요청자</th>
                  <th className="text-left py-2 font-semibold">제품</th>
                  <th className="text-left py-2 font-semibold">금액</th>
                  <th className="text-left py-2 font-semibold">요청일</th>
                  <th className="text-left py-2 font-semibold">액션</th>
                </tr>
              </thead>
              <tbody>
                {approvalRequests.map((r, i) => (
                  <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-3 text-gray-700">{r.name}</td>
                    <td className="py-3 text-gray-700">{r.product}</td>
                    <td className="py-3 text-gray-700">{r.amount}</td>
                    <td className="py-3 text-gray-500">{r.date}</td>
                    <td className="py-3 flex gap-1.5">
                      <button className="px-3 py-1 text-xs font-semibold bg-blue-500 text-white rounded-md hover:bg-blue-600">승인</button>
                      <button className="px-3 py-1 text-xs font-medium border border-red-300 text-red-500 rounded-md hover:bg-red-50">반려</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-[15px] font-bold text-gray-900 mb-4 pb-3 border-b border-gray-100">예산 소진율</h3>
            <div className="space-y-4">
              {budgetBars.map((b) => (
                <div key={b.label}>
                  <div className="flex justify-between text-sm text-gray-500 mb-1.5">
                    <span>{b.label}</span>
                    <span>{b.used} / {b.total}</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${b.pct}%`, background: b.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-[15px] font-bold text-gray-900 mb-3">이번달 주문</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">총 주문</span><strong>23건</strong></div>
              <div className="flex justify-between"><span className="text-gray-500">승인 완료</span><strong className="text-green-600">19건</strong></div>
              <div className="flex justify-between"><span className="text-gray-500">배송 중</span><strong className="text-blue-600">3건</strong></div>
              <div className="flex justify-between"><span className="text-gray-500">반려</span><strong className="text-red-500">1건</strong></div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-[15px] font-bold text-gray-900 mb-3">빠른 실행</h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: '승인 관리', href: '/approvals', icon: <CheckSquare size={18} /> },
                { label: '예산 관리', href: '/budget', icon: <DollarSign size={18} /> },
                { label: '연구실원 관리', href: '/members', icon: <Users size={18} /> },
                { label: '보고서', href: '/reports', icon: <BarChart3 size={18} /> },
              ].map((a) => (
                <Link key={a.label} href={a.href} className="flex flex-col items-center gap-1.5 py-3 border border-gray-200 rounded-lg text-gray-500 text-xs hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                  <span className="text-blue-500">{a.icon}</span>
                  <span>{a.label}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-[15px] font-bold text-gray-900 mb-3">알림</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2 p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-xs">
                <CircleAlert size={14} />
                <span>김연구 시약 구매 한도 90% 도달</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 bg-blue-50 border border-blue-200 rounded-lg text-blue-800 text-xs">
                <Info size={14} />
                <span>4월 예산 배분 검토 필요</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 bg-green-50 border border-green-200 rounded-lg text-green-800 text-xs">
                <CircleCheck size={14} />
                <span>3월 예산 정산 완료</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
