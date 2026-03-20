'use client';

import Link from 'next/link';
import {
  FlaskConical,
  BookOpen,
  Package,
  ClipboardList,
  Plus,
  PlayCircle,
  ShoppingCart,
  AlertTriangle,
  ArrowRight,
  Clock,
} from 'lucide-react';

const stats = [
  { label: '진행중 실험', value: '3건', icon: <FlaskConical size={20} />, color: 'bg-teal-100 text-teal-600' },
  { label: '프로토콜', value: '12개', icon: <BookOpen size={20} />, color: 'bg-blue-100 text-blue-600' },
  { label: '시약장 보유', value: '25종', icon: <Package size={20} />, color: 'bg-violet-100 text-violet-600' },
  { label: '이번주 사용', value: '8건', icon: <ClipboardList size={20} />, color: 'bg-amber-100 text-amber-600' },
];

const recentExperiments = [
  {
    id: 'EXP-2026-042',
    title: 'TiO2 나노입자 합성 최적화',
    status: '진행중',
    statusColor: 'bg-teal-100 text-teal-700',
    date: '2026-03-20',
    reagentCount: 5,
  },
  {
    id: 'EXP-2026-041',
    title: 'HPLC 분석법 유효성 검증',
    status: '진행중',
    statusColor: 'bg-teal-100 text-teal-700',
    date: '2026-03-19',
    reagentCount: 3,
  },
  {
    id: 'EXP-2026-040',
    title: '항균 코팅 소재 특성 평가',
    status: '완료',
    statusColor: 'bg-blue-100 text-blue-700',
    date: '2026-03-18',
    reagentCount: 7,
  },
  {
    id: 'EXP-2026-039',
    title: 'PCR 프라이머 효율 테스트',
    status: '초안',
    statusColor: 'bg-gray-100 text-gray-700',
    date: '2026-03-17',
    reagentCount: 2,
  },
];

const quickActions = [
  { label: '새 실험 시작', icon: <Plus size={18} />, href: '/experiments?new=true', color: 'bg-teal-600 text-white hover:bg-teal-700' },
  { label: '프로토콜에서 시작', icon: <PlayCircle size={18} />, href: '/protocols', color: 'bg-white text-teal-600 border border-teal-200 hover:bg-teal-50' },
  { label: '시약 주문', icon: <ShoppingCart size={18} />, href: 'http://localhost:3000/order', color: 'bg-white text-blue-600 border border-blue-200 hover:bg-blue-50', external: true },
  { label: '사용 기록', icon: <ClipboardList size={18} />, href: '/usage', color: 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50' },
];

const lowStockAlerts = [
  { name: 'Acetonitrile (HPLC grade)', cas: '75-05-8', remaining: '120 mL', threshold: '200 mL' },
  { name: 'Methanol (ACS grade)', cas: '67-56-1', remaining: '85 mL', threshold: '500 mL' },
  { name: 'Sodium Hydroxide', cas: '1310-73-2', remaining: '15 g', threshold: '50 g' },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--text)]">대시보드</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">실험 현황과 시약장 상태를 한눈에 확인하세요.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5 flex items-center gap-4"
          >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.color}`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-sm text-[var(--text-secondary)]">{stat.label}</p>
              <p className="text-xl font-bold text-[var(--text)]">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Experiments */}
        <div className="lg:col-span-2 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl">
          <div className="flex items-center justify-between p-5 border-b border-[var(--border)]">
            <h2 className="text-base font-semibold text-[var(--text)]">최근 실험</h2>
            <Link href="/experiments" className="text-sm text-teal-600 hover:text-teal-700 flex items-center gap-1">
              전체보기 <ArrowRight size={14} />
            </Link>
          </div>
          <div className="divide-y divide-[var(--border)]">
            {recentExperiments.map((exp) => (
              <div key={exp.id} className="flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[var(--text-secondary)] font-mono">{exp.id}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${exp.statusColor}`}>
                      {exp.status}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-[var(--text)] mt-1">{exp.title}</p>
                </div>
                <div className="text-right shrink-0 ml-4">
                  <p className="text-xs text-[var(--text-secondary)] flex items-center gap-1">
                    <Clock size={12} />
                    {exp.date}
                  </p>
                  <p className="text-xs text-[var(--text-secondary)] mt-1">
                    시약 {exp.reagentCount}종
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5">
            <h2 className="text-base font-semibold text-[var(--text)] mb-4">빠른 실행</h2>
            <div className="space-y-2">
              {quickActions.map((action) =>
                action.external ? (
                  <a
                    key={action.label}
                    href={action.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-3 w-full px-4 h-[var(--btn-height)] text-sm font-medium rounded-lg transition-colors ${action.color}`}
                  >
                    {action.icon}
                    {action.label}
                  </a>
                ) : (
                  <Link
                    key={action.label}
                    href={action.href}
                    className={`flex items-center gap-3 w-full px-4 h-[var(--btn-height)] text-sm font-medium rounded-lg transition-colors ${action.color}`}
                  >
                    {action.icon}
                    {action.label}
                  </Link>
                )
              )}
            </div>
          </div>

          {/* Low Stock Alerts */}
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle size={16} className="text-amber-500" />
              <h2 className="text-base font-semibold text-[var(--text)]">부족 시약 알림</h2>
            </div>
            <div className="space-y-3">
              {lowStockAlerts.map((item) => (
                <div key={item.cas} className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-sm font-medium text-[var(--text)]">{item.name}</p>
                  <p className="text-xs text-[var(--text-secondary)] mt-0.5">CAS: {item.cas}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-amber-700 font-medium">
                      잔량: {item.remaining} / 기준: {item.threshold}
                    </span>
                  </div>
                </div>
              ))}
              <a
                href="http://localhost:3000/order"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full h-[var(--btn-height)] text-sm font-medium text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors mt-2"
              >
                <ShoppingCart size={14} />
                JINU Shop에서 주문하기
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
