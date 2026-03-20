'use client';

import {
  Users,
  ShoppingCart,
  UserCheck,
  Package,
  Activity,
  BrainCircuit,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Circle,
} from 'lucide-react';

const stats = [
  { label: 'DAU (일일 활성 사용자)', value: '245', change: '+12%', up: true, icon: <Users size={20} /> },
  { label: '월간 거래량', value: '45,230,000', prefix: '\u20a9', change: '+8.3%', up: true, icon: <ShoppingCart size={20} /> },
  { label: '활성 사용자', value: '1,234', change: '+5.1%', up: true, icon: <UserCheck size={20} /> },
  { label: '등록 제품', value: '8,456', change: '+23', up: true, icon: <Package size={20} /> },
  { label: 'API 호출', value: '12,340/일', change: '+15%', up: true, icon: <Activity size={20} /> },
  { label: 'AI 생성', value: '456건', change: '-3%', up: false, icon: <BrainCircuit size={20} /> },
];

const platformHealth = [
  { name: 'JINU Shop', status: 'online', uptime: '99.9%', response: '145ms' },
  { name: 'JINU E-Note', status: 'online', uptime: '99.8%', response: '189ms' },
  { name: 'Supplier Portal', status: 'online', uptime: '99.7%', response: '156ms' },
  { name: 'External API v1', status: 'online', uptime: '99.95%', response: '92ms' },
];

const recentAlerts = [
  { id: 1, type: 'warning', message: 'API Rate Limit 80% 도달 - 서울대 연구팀 (Pro Tier)', time: '5분 전' },
  { id: 2, type: 'info', message: '신규 공급사 등록 요청 - (주)한국시약', time: '12분 전' },
  { id: 3, type: 'error', message: 'Supplier Sync 배치 실패 - TCI 가격 동기화', time: '23분 전' },
  { id: 4, type: 'info', message: 'AI 추천 모델 v2.3 배포 완료', time: '1시간 전' },
  { id: 5, type: 'warning', message: '제품 재고 부족 알림 - Sigma-Aldrich A2153 (5건)', time: '2시간 전' },
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--text)]">운영 대시보드</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">JINUCHEM 통합 플랫폼 운영 현황</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-3 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center text-orange-600">
                {stat.icon}
              </div>
              <div className={`flex items-center gap-1 text-xs font-medium ${stat.up ? 'text-emerald-600' : 'text-red-500'}`}>
                {stat.up ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {stat.change}
              </div>
            </div>
            <div className="text-2xl font-bold text-[var(--text)]">
              {stat.prefix}{stat.value}
            </div>
            <div className="text-xs text-[var(--text-secondary)] mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Chart Placeholder - Daily Orders */}
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5">
          <h2 className="text-base font-semibold text-[var(--text)] mb-4">일별 주문 추이</h2>
          <div className="h-48 bg-[var(--bg)] rounded-lg flex items-center justify-center border border-dashed border-[var(--border)]">
            <span className="text-sm text-[var(--text-secondary)]">차트 영역 (일별 주문량 추이 그래프)</span>
          </div>
        </div>

        {/* Chart Placeholder - Category Sales */}
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5">
          <h2 className="text-base font-semibold text-[var(--text)] mb-4">카테고리별 매출</h2>
          <div className="h-48 bg-[var(--bg)] rounded-lg flex items-center justify-center border border-dashed border-[var(--border)]">
            <span className="text-sm text-[var(--text-secondary)]">차트 영역 (카테고리별 매출 분포 그래프)</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Platform Health */}
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5">
          <h2 className="text-base font-semibold text-[var(--text)] mb-4">플랫폼 상태</h2>
          <div className="space-y-3">
            {platformHealth.map((platform) => (
              <div key={platform.name} className="flex items-center justify-between py-2.5 border-b border-[var(--border)] last:border-0">
                <div className="flex items-center gap-3">
                  <Circle size={10} className="fill-emerald-500 text-emerald-500" />
                  <span className="text-sm font-medium text-[var(--text)]">{platform.name}</span>
                </div>
                <div className="flex items-center gap-4 text-xs text-[var(--text-secondary)]">
                  <span>Uptime {platform.uptime}</span>
                  <span>Avg {platform.response}</span>
                  <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium">
                    정상
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Alerts */}
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5">
          <h2 className="text-base font-semibold text-[var(--text)] mb-4">최근 알림</h2>
          <div className="space-y-3">
            {recentAlerts.map((alert) => (
              <div key={alert.id} className="flex items-start gap-3 py-2.5 border-b border-[var(--border)] last:border-0">
                <div className={`mt-0.5 ${
                  alert.type === 'error' ? 'text-red-500' :
                  alert.type === 'warning' ? 'text-amber-500' :
                  'text-blue-500'
                }`}>
                  <AlertTriangle size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[var(--text)] leading-snug">{alert.message}</p>
                  <p className="text-xs text-[var(--text-secondary)] mt-1">{alert.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
