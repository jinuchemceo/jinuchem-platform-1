'use client';

import {
  TrendingUp,
  ShoppingCart,
  FileText,
  Truck,
  ArrowUpRight,
  ArrowDownRight,
  Package,
  BarChart3,
} from 'lucide-react';
import Link from 'next/link';

const statCards = [
  {
    title: '이번달 매출',
    value: '₩12,450,000',
    change: '+12.5%',
    trend: 'up' as const,
    icon: <TrendingUp size={20} />,
    color: 'purple',
  },
  {
    title: '미처리 주문',
    value: '5건',
    change: '+2건',
    trend: 'up' as const,
    icon: <ShoppingCart size={20} />,
    color: 'orange',
  },
  {
    title: '대기 견적',
    value: '3건',
    change: '-1건',
    trend: 'down' as const,
    icon: <FileText size={20} />,
    color: 'blue',
  },
  {
    title: '이번달 출고',
    value: '28건',
    change: '+5건',
    trend: 'up' as const,
    icon: <Truck size={20} />,
    color: 'green',
  },
];

const colorMap: Record<string, { bg: string; icon: string }> = {
  purple: { bg: 'bg-purple-50', icon: 'text-purple-600' },
  orange: { bg: 'bg-orange-50', icon: 'text-orange-600' },
  blue: { bg: 'bg-purple-50', icon: 'text-purple-600' },
  green: { bg: 'bg-green-50', icon: 'text-green-600' },
};

const recentOrders = [
  { id: 'ORD-2026-0315', customer: '서울대학교 화학과', items: 'Sodium Chloride 외 2건', amount: '₩1,250,000', date: '2026-03-19', status: '신규주문' },
  { id: 'ORD-2026-0314', customer: 'KAIST 생명과학과', items: 'Ethanol 외 1건', amount: '₩680,000', date: '2026-03-18', status: '준비중' },
  { id: 'ORD-2026-0313', customer: '연세대학교 약학대학', items: 'Acetonitrile 외 3건', amount: '₩2,100,000', date: '2026-03-17', status: '출고완료' },
  { id: 'ORD-2026-0312', customer: '포항공대 신소재공학과', items: 'Methanol 외 1건', amount: '₩450,000', date: '2026-03-16', status: '배송완료' },
  { id: 'ORD-2026-0311', customer: '고려대학교 화공생명공학과', items: 'Toluene 외 4건', amount: '₩3,200,000', date: '2026-03-15', status: '배송완료' },
];

const statusStyles: Record<string, string> = {
  '신규주문': 'bg-blue-100 text-purple-700',
  '준비중': 'bg-yellow-100 text-yellow-700',
  '출고완료': 'bg-blue-100 text-purple-700',
  '배송완료': 'bg-green-100 text-green-700',
};

const topProducts = [
  { rank: 1, name: 'Sodium Chloride (NaCl)', catalog: 'JC-SC-001', orders: 45, revenue: '₩4,500,000' },
  { rank: 2, name: 'Ethanol (C2H5OH)', catalog: 'JC-ET-002', orders: 38, revenue: '₩3,800,000' },
  { rank: 3, name: 'Acetonitrile (CH3CN)', catalog: 'JC-AC-003', orders: 32, revenue: '₩3,200,000' },
  { rank: 4, name: 'Methanol (CH3OH)', catalog: 'JC-MT-004', orders: 28, revenue: '₩2,100,000' },
  { rank: 5, name: 'Sulfuric Acid (H2SO4)', catalog: 'JC-SA-005', orders: 25, revenue: '₩1,875,000' },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--text)]">대시보드</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">공급사 현황을 한눈에 확인하세요</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => {
          const colors = colorMap[card.color];
          return (
            <div
              key={card.title}
              className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-[var(--text-secondary)]">{card.title}</span>
                <div className={`w-9 h-9 rounded-lg ${colors.bg} ${colors.icon} flex items-center justify-center`}>
                  {card.icon}
                </div>
              </div>
              <div className="text-2xl font-bold text-[var(--text)]">{card.value}</div>
              <div className="flex items-center gap-1 mt-1">
                {card.trend === 'up' ? (
                  <ArrowUpRight size={14} className="text-green-500" />
                ) : (
                  <ArrowDownRight size={14} className="text-red-500" />
                )}
                <span className={`text-xs font-medium ${card.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                  {card.change}
                </span>
                <span className="text-xs text-[var(--text-secondary)] ml-1">전월 대비</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)]">
            <h2 className="text-base font-semibold text-[var(--text)]">최근 주문</h2>
            <Link href="/orders" className="text-sm text-purple-600 hover:text-purple-700 font-medium">
              전체보기
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border)]">
                  <th className="text-left px-5 py-3 text-[var(--text-secondary)] font-medium">주문번호</th>
                  <th className="text-left px-5 py-3 text-[var(--text-secondary)] font-medium">고객사</th>
                  <th className="text-left px-5 py-3 text-[var(--text-secondary)] font-medium">주문내역</th>
                  <th className="text-right px-5 py-3 text-[var(--text-secondary)] font-medium">금액</th>
                  <th className="text-center px-5 py-3 text-[var(--text-secondary)] font-medium">상태</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-[var(--border)] last:border-0 hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3 font-medium text-purple-600">{order.id}</td>
                    <td className="px-5 py-3 text-[var(--text)]">{order.customer}</td>
                    <td className="px-5 py-3 text-[var(--text-secondary)]">{order.items}</td>
                    <td className="px-5 py-3 text-right font-medium text-[var(--text)]">{order.amount}</td>
                    <td className="px-5 py-3 text-center">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[order.status]}`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Monthly Revenue Chart Placeholder */}
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)]">
              <h2 className="text-base font-semibold text-[var(--text)]">월별 매출 추이</h2>
              <BarChart3 size={18} className="text-[var(--text-secondary)]" />
            </div>
            <div className="p-5">
              <div className="flex items-end gap-2 h-40">
                {[65, 45, 78, 52, 88, 70, 95, 60, 82, 75, 90, 100].map((value, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className={`w-full rounded-t ${index === 11 ? 'bg-purple-500' : 'bg-purple-200'}`}
                      style={{ height: `${value}%` }}
                    />
                    <span className="text-[10px] text-[var(--text-secondary)]">
                      {index + 1}월
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top 5 Products */}
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)]">
              <h2 className="text-base font-semibold text-[var(--text)]">인기 제품 TOP 5</h2>
              <Package size={18} className="text-[var(--text-secondary)]" />
            </div>
            <div className="divide-y divide-[var(--border)]">
              {topProducts.map((product) => (
                <div key={product.rank} className="flex items-center gap-3 px-5 py-3">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    product.rank <= 3 ? 'bg-blue-100 text-purple-700' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {product.rank}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[var(--text)] truncate">{product.name}</p>
                    <p className="text-xs text-[var(--text-secondary)]">{product.catalog} / {product.orders}건 주문</p>
                  </div>
                  <span className="text-sm font-semibold text-[var(--text)] shrink-0">{product.revenue}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
