'use client';

import { useState } from 'react';
import {
  TrendingUp,
  BarChart3,
  ShoppingCart,
  Users,
} from 'lucide-react';

const fmt = (n: number) => '₩' + n.toLocaleString();

const monthlyRevenue = [
  { month: '1월', value: 12500000 },
  { month: '2월', value: 14200000 },
  { month: '3월', value: 18450000 },
  { month: '4월', value: 6800000 },
];
const maxRevenue = Math.max(...monthlyRevenue.map(m => m.value));

const topProducts = [
  { rank: 1, name: 'Ethyl alcohol, Pure 500mL', revenue: 7595472, orders: 48 },
  { rank: 2, name: 'Methanol, HPLC Grade 4L', revenue: 3447500, orders: 35 },
  { rank: 3, name: 'Dichloromethane, ACS 2.5L', revenue: 3190000, orders: 22 },
  { rank: 4, name: 'Acetone, ACS Reagent 2.5L', revenue: 2546200, orders: 29 },
  { rank: 5, name: 'Toluene, HPLC Grade 2.5L', revenue: 1848000, orders: 14 },
];
const maxProductRevenue = topProducts[0].revenue;

const categoryData = [
  { name: '용매', pct: 42, color: 'bg-purple-500' },
  { name: '유기화합물', pct: 28, color: 'bg-purple-500' },
  { name: '무기화합물', pct: 15, color: 'bg-green-500' },
  { name: '생화학시약', pct: 10, color: 'bg-amber-500' },
  { name: '기타', pct: 5, color: 'bg-red-500' },
];

const funnelData = [
  { product: 'Ethyl alcohol, Pure 500mL', views: 1245, cart: 312, orders: 48, rate: 3.9 },
  { product: 'Methanol, HPLC Grade 4L', views: 890, cart: 198, orders: 35, rate: 3.9 },
  { product: 'Acetone, ACS Reagent 2.5L', views: 756, cart: 145, orders: 29, rate: 3.8 },
  { product: 'Dichloromethane, ACS 2.5L', views: 523, cart: 87, orders: 22, rate: 4.2 },
  { product: 'Toluene, HPLC Grade 2.5L', views: 412, cart: 65, orders: 14, rate: 3.4 },
];

const topOrgs = [
  { rank: 1, name: '서울대학교', orders: 15, revenue: 4850000, lastOrder: '2026-04-02' },
  { rank: 2, name: 'KAIST', orders: 12, revenue: 3920000, lastOrder: '2026-04-01' },
  { rank: 3, name: 'LG화학', orders: 8, revenue: 3180000, lastOrder: '2026-03-31' },
  { rank: 4, name: '포항공대', orders: 7, revenue: 1890000, lastOrder: '2026-04-01' },
  { rank: 5, name: '연세대학교', orders: 6, revenue: 1560000, lastOrder: '2026-03-29' },
];

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState<'sales' | 'orders' | 'products' | 'customers'>('sales');

  const tabs = [
    { label: '매출 분석', value: 'sales' as const },
    { label: '주문 분석', value: 'orders' as const },
    { label: '상품 분석', value: 'products' as const },
    { label: '고객 분석', value: 'customers' as const },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[var(--text)]">통계/분석</h1>

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
          </button>
        ))}
      </div>

      {/* Sales Tab */}
      {activeTab === 'sales' && (
        <div className="space-y-6">
          <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-xl p-6">
            <h3 className="text-lg font-bold mb-4">매출 추이</h3>
            <div className="flex items-end gap-6 h-52 px-4">
              {monthlyRevenue.map(m => (
                <div key={m.month} className="flex-1 flex flex-col items-center gap-2">
                  <span className="text-xs text-[var(--text-secondary)]">{fmt(m.value / 10000)}만</span>
                  <div className="w-full bg-purple-500 rounded-t-md transition-all hover:bg-purple-600" style={{ height: `${(m.value / maxRevenue) * 100}%`, minHeight: 4 }} />
                  <span className="text-xs text-[var(--text-secondary)]">{m.month}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-xl p-6">
              <h3 className="text-lg font-bold mb-4">제품별 매출 TOP 5</h3>
              <div className="space-y-4">
                {topProducts.map(p => (
                  <div key={p.rank} className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-[var(--text-secondary)]">{p.rank}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">{p.name}</p>
                      <p className="text-xs text-[var(--text-secondary)]">{fmt(p.revenue)}</p>
                    </div>
                    <div className="w-28 h-1.5 bg-gray-100 rounded-full">
                      <div className="h-full bg-purple-500 rounded-full" style={{ width: `${(p.revenue / maxProductRevenue) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-xl p-6">
              <h3 className="text-lg font-bold mb-4">카테고리별 매출 비중</h3>
              <div className="space-y-3">
                {categoryData.map(c => (
                  <div key={c.name} className="flex items-center gap-3">
                    <span className={`w-3 h-3 rounded-sm ${c.color} shrink-0`} />
                    <span className="text-sm flex-1">{c.name}</span>
                    <strong className="text-sm">{c.pct}%</strong>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-xl p-5">
              <p className="text-sm text-[var(--text-secondary)]">총 주문 건수</p>
              <p className="text-2xl font-bold mt-1">58건</p><p className="text-xs text-[var(--text-secondary)]">이번 달</p>
            </div>
            <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-xl p-5">
              <p className="text-sm text-[var(--text-secondary)]">평균 주문금액</p>
              <p className="text-2xl font-bold mt-1">₩318,100</p>
            </div>
            <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-xl p-5">
              <p className="text-sm text-[var(--text-secondary)]">취소/반품률</p>
              <p className="text-2xl font-bold mt-1 text-green-600">3.4%</p>
            </div>
            <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-xl p-5">
              <p className="text-sm text-[var(--text-secondary)]">평균 리드타임</p>
              <p className="text-2xl font-bold mt-1">1.8일</p>
            </div>
          </div>
          <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-xl p-6">
            <h3 className="text-lg font-bold mb-4">일별 주문 건수</h3>
            <div className="flex items-end gap-4 h-40 px-4">
              {[{d:'월',v:6},{d:'화',v:9},{d:'수',v:11},{d:'목',v:8},{d:'금',v:7}].map(d => (
                <div key={d.d} className="flex-1 flex flex-col items-center gap-2">
                  <span className="text-xs font-bold">{d.v}</span>
                  <div className="w-full bg-purple-500 rounded-t-md" style={{ height: `${(d.v / 11) * 100}%`, minHeight: 4 }} />
                  <span className="text-xs text-[var(--text-secondary)]">{d.d}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Products Tab */}
      {activeTab === 'products' && (
        <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-xl p-6">
          <h3 className="text-lg font-bold mb-4">제품별 퍼널 분석</h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-[var(--border)]">
                <th className="text-left px-4 py-3 font-semibold text-[var(--text-secondary)]">제품명</th>
                <th className="text-right px-4 py-3 font-semibold text-[var(--text-secondary)]">조회수</th>
                <th className="text-right px-4 py-3 font-semibold text-[var(--text-secondary)]">장바구니</th>
                <th className="text-right px-4 py-3 font-semibold text-[var(--text-secondary)]">주문</th>
                <th className="text-right px-4 py-3 font-semibold text-[var(--text-secondary)]">전환율</th>
              </tr>
            </thead>
            <tbody>
              {funnelData.map(f => (
                <tr key={f.product} className="border-b border-[var(--border)]">
                  <td className="px-4 py-3 font-medium">{f.product}</td>
                  <td className="px-4 py-3 text-right">{f.views.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right">{f.cart}</td>
                  <td className="px-4 py-3 text-right">{f.orders}</td>
                  <td className="px-4 py-3 text-right font-bold text-green-600">{f.rate}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Customers Tab */}
      {activeTab === 'customers' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-xl p-5">
              <p className="text-sm text-[var(--text-secondary)]">총 구매 기관</p>
              <p className="text-2xl font-bold mt-1">24</p>
            </div>
            <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-xl p-5">
              <p className="text-sm text-[var(--text-secondary)]">신규 고객 비율</p>
              <p className="text-2xl font-bold mt-1">32%</p>
            </div>
            <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-xl p-5">
              <p className="text-sm text-[var(--text-secondary)]">재구매율</p>
              <p className="text-2xl font-bold mt-1 text-green-600">68%</p>
            </div>
          </div>
          <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-xl p-6">
            <h3 className="text-lg font-bold mb-4">구매 기관 TOP 5</h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-[var(--border)]">
                  <th className="text-left px-4 py-3 font-semibold text-[var(--text-secondary)]">순위</th>
                  <th className="text-left px-4 py-3 font-semibold text-[var(--text-secondary)]">기관명</th>
                  <th className="text-right px-4 py-3 font-semibold text-[var(--text-secondary)]">주문 건수</th>
                  <th className="text-right px-4 py-3 font-semibold text-[var(--text-secondary)]">총 매출</th>
                  <th className="text-right px-4 py-3 font-semibold text-[var(--text-secondary)]">최근 주문</th>
                </tr>
              </thead>
              <tbody>
                {topOrgs.map(o => (
                  <tr key={o.rank} className="border-b border-[var(--border)]">
                    <td className="px-4 py-3"><span className="w-6 h-6 rounded-full bg-gray-100 inline-flex items-center justify-center text-xs font-bold">{o.rank}</span></td>
                    <td className="px-4 py-3 font-medium">{o.name}</td>
                    <td className="px-4 py-3 text-right">{o.orders}건</td>
                    <td className="px-4 py-3 text-right font-semibold">{fmt(o.revenue)}</td>
                    <td className="px-4 py-3 text-right">{o.lastOrder}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
