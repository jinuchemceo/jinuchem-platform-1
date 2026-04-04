import {
  ShoppingCart,
  ClipboardList,
  Truck,
  TrendingUp,
  Beaker,
  Zap,
  FileText,
  RotateCcw,
  Search,
} from 'lucide-react';
import BannerPopup from '@/components/BannerPopup';

export default function DashboardPage() {
  return (
    <div>
      <BannerPopup />
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[var(--text)]">대시보드</h1>
        <span className="text-sm text-[var(--text-secondary)]">
          김연구님의 연구원 대시보드
        </span>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard
          icon={<ShoppingCart size={20} />}
          label="장바구니"
          value="3개"
          sub="W542,400"
        />
        <StatCard
          icon={<ClipboardList size={20} />}
          label="주문내역"
          value="2건"
          sub="주문 및 배송 현황"
        />
        <StatCard
          icon={<Truck size={20} />}
          label="배송 중"
          value="1건"
          sub="내일 도착 예정"
        />
        <StatCard
          icon={<TrendingUp size={20} />}
          label="이번 달 주문"
          value="W1,285,000"
          sub="+12% vs 지난달"
          highlight
        />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border)] p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-[var(--text)]">최근 주문</h2>
            <a href="/orders" className="text-sm text-blue-600 hover:underline">전체보기</a>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th className="text-left py-2 text-[var(--text-secondary)] font-medium">주문번호</th>
                <th className="text-left py-2 text-[var(--text-secondary)] font-medium">제품</th>
                <th className="text-left py-2 text-[var(--text-secondary)] font-medium">금액</th>
                <th className="text-left py-2 text-[var(--text-secondary)] font-medium">상태</th>
                <th className="text-left py-2 text-[var(--text-secondary)] font-medium">날짜</th>
              </tr>
            </thead>
            <tbody>
              <OrderRow
                number="ORD-20260317-001"
                product="Ethyl alcohol, Pure 500mL 외 2건"
                amount="W542,400"
                status="배송중"
                statusColor="violet"
                date="2026-03-17"
              />
              <OrderRow
                number="ORD-20260315-003"
                product="Acetone, ACS Grade 2.5L"
                amount="W87,800"
                status="배송완료"
                statusColor="emerald"
                date="2026-03-15"
              />
              <OrderRow
                number="ORD-20260312-002"
                product="PIPES, 고순도 5G"
                amount="W226,200"
                status="배송완료"
                statusColor="emerald"
                date="2026-03-12"
              />
            </tbody>
          </table>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border)] p-5">
            <h2 className="text-lg font-semibold text-[var(--text)] mb-4">빠른 실행</h2>
            <div className="space-y-2">
              <QuickAction icon={<Beaker size={16} />} label="프로토콜 주문" />
              <QuickAction icon={<FileText size={16} />} label="새 견적 요청" />
              <QuickAction icon={<RotateCcw size={16} />} label="재구매" />
              <QuickAction icon={<Search size={16} />} label="카탈로그 검색" />
            </div>
          </div>

          {/* Budget */}
          <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border)] p-5">
            <h2 className="text-lg font-semibold text-[var(--text)] mb-2">이번 달 예산</h2>
            <p className="text-xs text-[var(--text-secondary)] mb-3">연구실 시약 구매 예산</p>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-2xl font-bold text-[var(--text)]">W1,285,000</span>
              <span className="text-sm text-[var(--text-secondary)]">/ W3,000,000</span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full mb-3">
              <div className="h-2 bg-emerald-500 rounded-full" style={{ width: '43%' }} />
            </div>
            <div className="flex gap-4 text-xs text-[var(--text-secondary)]">
              <span>시약 W985,000 / 소모품 W300,000</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  sub,
  highlight,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border p-5 ${
        highlight
          ? 'bg-gradient-to-r from-blue-600 to-violet-600 border-transparent text-white'
          : 'bg-[var(--bg-card)] border-[var(--border)]'
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <span className={`text-sm ${highlight ? 'text-blue-100' : 'text-[var(--text-secondary)]'}`}>
          {label}
        </span>
        <span className={highlight ? 'text-blue-200' : 'text-[var(--text-secondary)]'}>{icon}</span>
      </div>
      <div className={`text-2xl font-bold mb-1 ${highlight ? 'text-white' : 'text-[var(--text)]'}`}>
        {value}
      </div>
      <div className={`text-xs ${highlight ? 'text-blue-200' : 'text-[var(--text-secondary)]'}`}>
        {sub}
      </div>
    </div>
  );
}

function OrderRow({
  number,
  product,
  amount,
  status,
  statusColor,
  date,
}: {
  number: string;
  product: string;
  amount: string;
  status: string;
  statusColor: string;
  date: string;
}) {
  const colorMap: Record<string, string> = {
    violet: 'bg-violet-100 text-violet-700',
    emerald: 'bg-emerald-100 text-emerald-700',
    amber: 'bg-amber-100 text-amber-700',
    blue: 'bg-blue-100 text-blue-700',
  };

  return (
    <tr className="border-b border-[var(--border)] last:border-0">
      <td className="py-3 text-[var(--text)] font-mono text-xs">{number}</td>
      <td className="py-3 text-[var(--text)]">{product}</td>
      <td className="py-3 text-[var(--text)] font-medium">{amount}</td>
      <td className="py-3">
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${colorMap[statusColor]}`}>
          {status}
        </span>
      </td>
      <td className="py-3 text-[var(--text-secondary)]">{date}</td>
    </tr>
  );
}

function QuickAction({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button className="flex items-center gap-3 w-full px-4 py-3 text-sm text-[var(--text)] bg-[var(--bg)] rounded-lg border border-[var(--border)] hover:border-blue-400 transition-colors">
      <span className="text-[var(--text-secondary)]">{icon}</span>
      {label}
    </button>
  );
}
