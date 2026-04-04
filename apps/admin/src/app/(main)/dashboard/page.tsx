'use client';

import { useState } from 'react';
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
  RefreshCw,
  TrendingUp,
  Calendar,
  Clock,
  ExternalLink,
  Bell,
  CheckCircle2,
  XCircle,
  Info,
  Settings,
  Eye,
  EyeOff,
  Download,
  GripVertical,
  X,
  BarChart3,
  Crown,
  Store,
} from 'lucide-react';

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const stats = [
  { label: 'DAU (일일 활성 사용자)', value: '245', change: '+12%', up: true, icon: <Users size={20} /> },
  { label: '월간 거래량', value: '45,230,000', prefix: '\u20a9', change: '+8.3%', up: true, icon: <ShoppingCart size={20} /> },
  { label: '활성 사용자', value: '1,234', change: '+5.1%', up: true, icon: <UserCheck size={20} /> },
  { label: '등록 제품', value: '8,456', change: '+23', up: true, icon: <Package size={20} /> },
  { label: 'API 호출', value: '12,340/일', change: '+15%', up: true, icon: <Activity size={20} /> },
  { label: 'AI 생성', value: '456건', change: '-3%', up: false, icon: <BrainCircuit size={20} /> },
];

const dailyOrders = [
  { day: '3/26', orders: 32, amount: 4200 },
  { day: '3/27', orders: 45, amount: 5800 },
  { day: '3/28', orders: 28, amount: 3600 },
  { day: '3/29', orders: 56, amount: 7200 },
  { day: '3/30', orders: 42, amount: 5400 },
  { day: '3/31', orders: 38, amount: 4900 },
  { day: '4/1', orders: 51, amount: 6600 },
  { day: '4/2', orders: 47, amount: 6100 },
];

const categorySales = [
  { name: '유기화합물', amount: 18500, pct: 35, color: 'bg-orange-500' },
  { name: '무기화합물', amount: 12300, pct: 23, color: 'bg-blue-500' },
  { name: '생화학시약', amount: 8900, pct: 17, color: 'bg-emerald-500' },
  { name: '분석용시약', amount: 6200, pct: 12, color: 'bg-purple-500' },
  { name: '실험소모품', amount: 4800, pct: 9, color: 'bg-amber-500' },
  { name: '기타', amount: 2100, pct: 4, color: 'bg-gray-400' },
];

const platformHealth = [
  { name: 'JINU Shop', status: 'online', uptime: '99.9%', response: '145ms', cpu: 23, memory: 61 },
  { name: 'JINU E-Note', status: 'online', uptime: '99.8%', response: '189ms', cpu: 18, memory: 54 },
  { name: 'Supplier Portal', status: 'online', uptime: '99.7%', response: '156ms', cpu: 12, memory: 42 },
  { name: 'External API v1', status: 'online', uptime: '99.95%', response: '92ms', cpu: 31, memory: 68 },
];

const recentAlerts = [
  { id: 1, type: 'warning', message: 'API Rate Limit 80% 도달 - 서울대 연구팀 (Pro Tier)', time: '5분 전' },
  { id: 2, type: 'info', message: '신규 공급사 등록 요청 - (주)한국시약', time: '12분 전' },
  { id: 3, type: 'error', message: 'Supplier Sync 배치 실패 - TCI 가격 동기화', time: '23분 전' },
  { id: 4, type: 'info', message: 'AI 추천 모델 v2.3 배포 완료', time: '1시간 전' },
  { id: 5, type: 'warning', message: '제품 재고 부족 알림 - Sigma-Aldrich A2153 (5건)', time: '2시간 전' },
];

const recentOrders = [
  { id: 'ORD-20260402-001', customer: '서울대 화학과', items: 3, total: 1250000, status: '처리중' },
  { id: 'ORD-20260402-002', customer: 'KAIST 바이오', items: 7, total: 3450000, status: '배송중' },
  { id: 'ORD-20260401-015', customer: '삼성SDI 연구소', items: 12, total: 8900000, status: '완료' },
  { id: 'ORD-20260401-014', customer: '연세대 약학과', items: 2, total: 680000, status: '결제대기' },
  { id: 'ORD-20260401-013', customer: 'LG화학 기초연구', items: 5, total: 2100000, status: '완료' },
];

const monthlySales = [
  { month: '2025/11', revenue: 3800, orders: 280 },
  { month: '2025/12', revenue: 4200, orders: 310 },
  { month: '2026/01', revenue: 3500, orders: 265 },
  { month: '2026/02', revenue: 3900, orders: 295 },
  { month: '2026/03', revenue: 4520, orders: 342 },
  { month: '2026/04', revenue: 4100, orders: 318 },
];

const topCustomers = [
  { rank: 1, name: '서울대 화학과', orders: 156, amount: 45200000, trend: '+12%' },
  { rank: 2, name: 'KAIST 바이오', orders: 134, amount: 38900000, trend: '+8%' },
  { rank: 3, name: '삼성SDI 연구소', orders: 98, amount: 32100000, trend: '+15%' },
  { rank: 4, name: '연세대 약학과', orders: 87, amount: 24500000, trend: '-3%' },
  { rank: 5, name: 'LG화학 기초연구', orders: 76, amount: 21800000, trend: '+5%' },
];

const supplierOverview = [
  { name: 'Sigma-Aldrich', activeProducts: 2340, monthlyOrders: 89, fulfillmentRate: 98.2, status: 'online' },
  { name: 'TCI', activeProducts: 1890, monthlyOrders: 67, fulfillmentRate: 96.5, status: 'online' },
  { name: 'Alfa Aesar', activeProducts: 1560, monthlyOrders: 54, fulfillmentRate: 94.8, status: 'sync' },
  { name: '대정화금', activeProducts: 980, monthlyOrders: 43, fulfillmentRate: 97.1, status: 'online' },
  { name: '삼전순약', activeProducts: 450, monthlyOrders: 21, fulfillmentRate: 91.3, status: 'offline' },
];

const quickActions = [
  { label: '신규 주문', count: 12, path: '/customers' },
  { label: '결제 대기', count: 5, path: '/customers' },
  { label: '공급사 요청', count: 3, path: '/suppliers-mgmt' },
  { label: '문의 미답변', count: 8, path: '/board' },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Widget definitions
// ---------------------------------------------------------------------------
type WidgetId = 'stats' | 'quickActions' | 'orderChart' | 'categorySales' | 'platformHealth' | 'alerts' | 'recentOrders' | 'salesAnalytics' | 'topCustomers' | 'supplierPerformance';

const widgetDefs: { id: WidgetId; label: string }[] = [
  { id: 'stats', label: '통계 카드' },
  { id: 'quickActions', label: '빠른 액션' },
  { id: 'orderChart', label: '일별 주문 추이' },
  { id: 'categorySales', label: '카테고리별 매출' },
  { id: 'platformHealth', label: '플랫폼 상태' },
  { id: 'alerts', label: '최근 알림' },
  { id: 'recentOrders', label: '최근 주문' },
  { id: 'salesAnalytics', label: '매출 분석' },
  { id: 'topCustomers', label: '주요 고객' },
  { id: 'supplierPerformance', label: '공급사 현황' },
];

const defaultVisible: Record<WidgetId, boolean> = {
  stats: true, quickActions: true, orderChart: true, categorySales: true,
  platformHealth: true, alerts: true, recentOrders: true,
  salesAnalytics: true, topCustomers: true, supplierPerformance: true,
};

// ---------------------------------------------------------------------------
// CSV Export helper
// ---------------------------------------------------------------------------
function exportTableCsv(filename: string, headers: string[], rows: string[][]) {
  const bom = '\uFEFF';
  const csv = [headers.join(','), ...rows.map(r => r.map(c => `"${c}"`).join(','))].join('\n');
  const blob = new Blob([bom + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

export default function AdminDashboardPage() {
  const [orderChartMode, setOrderChartMode] = useState<'orders' | 'amount'>('orders');
  const maxOrder = Math.max(...dailyOrders.map((d) => orderChartMode === 'orders' ? d.orders : d.amount));
  const [showWidgetPanel, setShowWidgetPanel] = useState(false);
  const [visibleWidgets, setVisibleWidgets] = useState<Record<WidgetId, boolean>>(defaultVisible);

  const toggleWidget = (id: WidgetId) => {
    setVisibleWidgets(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleExportOrders = () => {
    exportTableCsv('recent_orders.csv',
      ['주문번호', '고객', '품목수', '금액', '상태'],
      recentOrders.map(o => [o.id, o.customer, String(o.items), String(o.total), o.status])
    );
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text)]">운영 대시보드</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">JINUCHEM 통합 플랫폼 운영 현황</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)]">
            <Clock size={14} />
            <span>마지막 갱신: {new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
          <button
            onClick={() => setShowWidgetPanel(!showWidgetPanel)}
            className={`h-[var(--btn-height)] px-3 text-sm border rounded-lg flex items-center gap-1.5 transition-colors ${
              showWidgetPanel ? 'bg-orange-600 text-white border-orange-600' : 'bg-[var(--bg-card)] border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text)]'
            }`}
          >
            <Settings size={14} />
            위젯 설정
          </button>
          <button
            onClick={() => window.location.reload()}
            className="h-[var(--btn-height)] px-3 text-sm bg-[var(--bg-card)] border border-[var(--border)] rounded-lg flex items-center gap-1.5 text-[var(--text-secondary)] hover:text-[var(--text)] transition-colors"
          >
            <RefreshCw size={14} />
            새로고침
          </button>
        </div>
      </div>

      {/* Widget Customization Panel */}
      {showWidgetPanel && (
        <div className="bg-[var(--bg-card)] border border-orange-200 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-[var(--text)]">대시보드 위젯 설정</h3>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setVisibleWidgets(defaultVisible)}
                className="text-xs text-orange-600 hover:text-orange-700 font-medium"
              >
                전체 표시
              </button>
              <button
                onClick={() => setShowWidgetPanel(false)}
                className="text-[var(--text-secondary)] hover:text-[var(--text)]"
              >
                <X size={16} />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-5 gap-3">
            {widgetDefs.map(w => (
              <button
                key={w.id}
                onClick={() => toggleWidget(w.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition-colors ${
                  visibleWidgets[w.id]
                    ? 'bg-orange-50 border-orange-200 text-orange-700'
                    : 'bg-[var(--bg)] border-[var(--border)] text-[var(--text-secondary)]'
                }`}
              >
                {visibleWidgets[w.id] ? <Eye size={14} /> : <EyeOff size={14} />}
                {w.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Stat Cards */}
      {visibleWidgets.stats && <div className="grid grid-cols-3 gap-4">
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
      </div>}

      {/* Quick Actions */}
      {visibleWidgets.quickActions && <div className="grid grid-cols-4 gap-4">
        {quickActions.map((action) => (
          <a key={action.label} href={action.path} className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-4 flex items-center justify-between hover:border-orange-300 transition-colors group">
            <span className="text-sm font-medium text-[var(--text)]">{action.label}</span>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-orange-600">{action.count}</span>
              <ExternalLink size={14} className="text-[var(--text-secondary)] group-hover:text-orange-600 transition-colors" />
            </div>
          </a>
        ))}
      </div>}

      {(visibleWidgets.orderChart || visibleWidgets.categorySales) && <div className="grid grid-cols-2 gap-6">
        {/* Daily Orders Bar Chart */}
        {visibleWidgets.orderChart && <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-[var(--text)]">일별 주문 추이</h2>
            <div className="flex items-center gap-1 bg-[var(--bg)] rounded-lg p-0.5 border border-[var(--border)]">
              <button
                onClick={() => setOrderChartMode('orders')}
                className={`px-2.5 py-1 text-xs rounded-md transition-colors ${orderChartMode === 'orders' ? 'bg-orange-600 text-white' : 'text-[var(--text-secondary)] hover:text-[var(--text)]'}`}
              >
                주문수
              </button>
              <button
                onClick={() => setOrderChartMode('amount')}
                className={`px-2.5 py-1 text-xs rounded-md transition-colors ${orderChartMode === 'amount' ? 'bg-orange-600 text-white' : 'text-[var(--text-secondary)] hover:text-[var(--text)]'}`}
              >
                금액
              </button>
            </div>
          </div>
          <div className="h-48 flex items-end gap-2">
            {dailyOrders.map((d) => {
              const val = orderChartMode === 'orders' ? d.orders : d.amount;
              const pct = (val / maxOrder) * 100;
              return (
                <div key={d.day} className="flex-1 flex flex-col items-center gap-1 group">
                  <span className="text-[10px] text-[var(--text-secondary)] opacity-0 group-hover:opacity-100 transition-opacity">
                    {orderChartMode === 'orders' ? `${val}건` : `${(val / 10000).toFixed(0)}만`}
                  </span>
                  <div className="w-full flex justify-center">
                    <div
                      className="w-8 bg-orange-500 rounded-t-md transition-all duration-300 hover:bg-orange-600 min-h-[4px]"
                      style={{ height: `${Math.max(pct * 1.5, 4)}px` }}
                    />
                  </div>
                  <span className="text-[10px] text-[var(--text-secondary)]">{d.day}</span>
                </div>
              );
            })}
          </div>
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-[var(--border)]">
            <div className="flex items-center gap-1 text-xs text-emerald-600">
              <TrendingUp size={12} />
              <span>전주 대비 +18.5%</span>
            </div>
            <span className="text-xs text-[var(--text-secondary)]">최근 8일</span>
          </div>
        </div>}

        {/* Category Sales Horizontal Bar Chart */}
        {visibleWidgets.categorySales && <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-[var(--text)]">카테고리별 매출</h2>
            <span className="text-xs text-[var(--text-secondary)]">이번 달 기준</span>
          </div>
          <div className="space-y-3">
            {categorySales.map((cat) => (
              <div key={cat.name} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-[var(--text)]">{cat.name}</span>
                  <span className="text-xs text-[var(--text-secondary)]">
                    {(cat.amount / 10000).toFixed(0)}만원 ({cat.pct}%)
                  </span>
                </div>
                <div className="h-2 bg-[var(--bg)] rounded-full overflow-hidden">
                  <div
                    className={`h-full ${cat.color} rounded-full transition-all duration-500`}
                    style={{ width: `${cat.pct * 2.5}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-[var(--border)]">
            <span className="text-xs font-medium text-[var(--text)]">총 매출</span>
            <span className="text-sm font-bold text-orange-600">
              {(categorySales.reduce((s, c) => s + c.amount, 0) / 10000).toLocaleString()}만원
            </span>
          </div>
        </div>}
      </div>}

      {(visibleWidgets.platformHealth || visibleWidgets.alerts) && <div className="grid grid-cols-2 gap-6">
        {/* Platform Health */}
        {visibleWidgets.platformHealth && <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5">
          <h2 className="text-base font-semibold text-[var(--text)] mb-4">플랫폼 상태</h2>
          <div className="space-y-3">
            {platformHealth.map((platform) => (
              <div key={platform.name} className="py-2.5 border-b border-[var(--border)] last:border-0">
                <div className="flex items-center justify-between mb-2">
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
                <div className="flex items-center gap-4 ml-[22px]">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-[10px] text-[var(--text-secondary)]">CPU</span>
                      <span className="text-[10px] text-[var(--text-secondary)]">{platform.cpu}%</span>
                    </div>
                    <div className="h-1.5 bg-[var(--bg)] rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all ${platform.cpu > 70 ? 'bg-red-500' : platform.cpu > 50 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${platform.cpu}%` }} />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-[10px] text-[var(--text-secondary)]">Memory</span>
                      <span className="text-[10px] text-[var(--text-secondary)]">{platform.memory}%</span>
                    </div>
                    <div className="h-1.5 bg-[var(--bg)] rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all ${platform.memory > 80 ? 'bg-red-500' : platform.memory > 60 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${platform.memory}%` }} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>}

        {/* Recent Alerts */}
        {visibleWidgets.alerts && <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-[var(--text)]">최근 알림</h2>
            <span className="flex items-center gap-1 text-xs text-orange-600 font-medium">
              <Bell size={12} />
              {recentAlerts.length}건
            </span>
          </div>
          <div className="space-y-3">
            {recentAlerts.map((alert) => (
              <div key={alert.id} className="flex items-start gap-3 py-2.5 border-b border-[var(--border)] last:border-0">
                <div className={`mt-0.5 ${
                  alert.type === 'error' ? 'text-red-500' :
                  alert.type === 'warning' ? 'text-amber-500' :
                  'text-blue-500'
                }`}>
                  {alert.type === 'error' ? <XCircle size={16} /> :
                   alert.type === 'warning' ? <AlertTriangle size={16} /> :
                   <Info size={16} />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[var(--text)] leading-snug">{alert.message}</p>
                  <p className="text-xs text-[var(--text-secondary)] mt-1">{alert.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>}
      </div>}

      {/* Recent Orders Table */}
      {visibleWidgets.recentOrders && <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-[var(--text)]">최근 주문</h2>
          <div className="flex items-center gap-3">
            <button
              onClick={handleExportOrders}
              className="text-xs text-[var(--text-secondary)] hover:text-orange-600 font-medium flex items-center gap-1 transition-colors"
            >
              <Download size={12} />
              CSV 내보내기
            </button>
            <a href="/customers" className="text-xs text-orange-600 hover:text-orange-700 font-medium flex items-center gap-1">
              전체보기 <ExternalLink size={12} />
            </a>
          </div>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-[var(--border)]">
              <th className="text-left text-xs font-medium text-[var(--text-secondary)] pb-3">주문번호</th>
              <th className="text-left text-xs font-medium text-[var(--text-secondary)] pb-3">고객</th>
              <th className="text-center text-xs font-medium text-[var(--text-secondary)] pb-3">품목수</th>
              <th className="text-right text-xs font-medium text-[var(--text-secondary)] pb-3">금액</th>
              <th className="text-center text-xs font-medium text-[var(--text-secondary)] pb-3">상태</th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.map((order) => (
              <tr key={order.id} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--bg)] transition-colors">
                <td className="py-3 text-sm font-mono text-orange-600">{order.id}</td>
                <td className="py-3 text-sm text-[var(--text)]">{order.customer}</td>
                <td className="py-3 text-sm text-center text-[var(--text-secondary)]">{order.items}</td>
                <td className="py-3 text-sm text-right font-medium text-[var(--text)]">
                  {order.total.toLocaleString()}원
                </td>
                <td className="py-3 text-center">
                  <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${
                    order.status === '완료' ? 'bg-emerald-100 text-emerald-700' :
                    order.status === '배송중' ? 'bg-blue-100 text-blue-700' :
                    order.status === '처리중' ? 'bg-amber-100 text-amber-700' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>}

      {/* Sales Analytics + Top Customers */}
      {(visibleWidgets.salesAnalytics || visibleWidgets.topCustomers) && <div className="grid grid-cols-2 gap-6">
        {/* Monthly Sales Analytics */}
        {visibleWidgets.salesAnalytics && <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BarChart3 size={16} className="text-orange-600" />
              <h2 className="text-base font-semibold text-[var(--text)]">월별 매출 추이</h2>
            </div>
            <span className="text-xs text-[var(--text-secondary)]">최근 6개월</span>
          </div>
          <div className="h-48 flex items-end gap-3">
            {monthlySales.map((d) => {
              const maxRevenue = Math.max(...monthlySales.map(s => s.revenue));
              const maxOrders = Math.max(...monthlySales.map(s => s.orders));
              const revPct = (d.revenue / maxRevenue) * 100;
              const ordPct = (d.orders / maxOrders) * 100;
              return (
                <div key={d.month} className="flex-1 flex flex-col items-center gap-1 group">
                  <span className="text-[10px] text-[var(--text-secondary)] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {d.revenue.toLocaleString()}만 / {d.orders}건
                  </span>
                  <div className="w-full flex justify-center gap-1">
                    <div
                      className="w-3.5 bg-orange-400 rounded-t-sm transition-all duration-300 hover:bg-orange-500 min-h-[4px]"
                      title={`매출: ${d.revenue.toLocaleString()}만원`}
                      style={{ height: `${Math.max(revPct * 1.5, 4)}px` }}
                    />
                    <div
                      className="w-3.5 bg-blue-400 rounded-t-sm transition-all duration-300 hover:bg-blue-500 min-h-[4px]"
                      title={`주문: ${d.orders}건`}
                      style={{ height: `${Math.max(ordPct * 1.5, 4)}px` }}
                    />
                  </div>
                  <span className="text-[10px] text-[var(--text-secondary)]">{d.month}</span>
                </div>
              );
            })}
          </div>
          <div className="flex items-center gap-4 mt-2 mb-3">
            <div className="flex items-center gap-1.5 text-[10px] text-[var(--text-secondary)]">
              <div className="w-2.5 h-2.5 bg-orange-400 rounded-sm" />
              매출(만원)
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-[var(--text-secondary)]">
              <div className="w-2.5 h-2.5 bg-blue-400 rounded-sm" />
              주문수(건)
            </div>
          </div>
          <div className="flex items-center justify-between pt-3 border-t border-[var(--border)]">
            <div className="flex items-center gap-1 text-xs text-emerald-600">
              <TrendingUp size={12} />
              <span>전월 대비 +12.3%</span>
            </div>
            <span className="text-xs text-[var(--text-secondary)]">연간 목표 달성률 <span className="font-semibold text-orange-600">67%</span></span>
          </div>
        </div>}

        {/* Top Customers */}
        {visibleWidgets.topCustomers && <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Crown size={16} className="text-orange-600" />
              <h2 className="text-base font-semibold text-[var(--text)]">기관별 구매 순위 (Top 5)</h2>
            </div>
            <span className="text-xs text-[var(--text-secondary)]">최근 6개월 누적</span>
          </div>
          <div className="space-y-3">
            {topCustomers.map((c) => {
              const maxAmount = topCustomers[0].amount;
              const barPct = (c.amount / maxAmount) * 100;
              const isPositive = c.trend.startsWith('+');
              return (
                <div key={c.rank} className="flex items-center gap-3">
                  <span className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold ${
                    c.rank === 1 ? 'bg-orange-100 text-orange-700' :
                    c.rank === 2 ? 'bg-gray-100 text-gray-600' :
                    c.rank === 3 ? 'bg-amber-50 text-amber-700' :
                    'bg-[var(--bg)] text-[var(--text-secondary)]'
                  }`}>
                    {c.rank}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-[var(--text)] truncate">{c.name}</span>
                      <div className="flex items-center gap-3 ml-2 shrink-0">
                        <span className="text-xs text-[var(--text-secondary)]">{c.orders}건</span>
                        <span className="text-xs font-medium text-[var(--text)]">{(c.amount / 10000).toLocaleString()}만원</span>
                        <span className={`flex items-center gap-0.5 text-xs font-medium ${isPositive ? 'text-emerald-600' : 'text-red-500'}`}>
                          {isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                          {c.trend}
                        </span>
                      </div>
                    </div>
                    <div className="h-1.5 bg-[var(--bg)] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-orange-500 rounded-full transition-all duration-500"
                        style={{ width: `${barPct}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex items-center justify-end mt-4 pt-3 border-t border-[var(--border)]">
            <a href="/customers" className="text-xs text-orange-600 hover:text-orange-700 font-medium flex items-center gap-1">
              전체보기 <ExternalLink size={12} />
            </a>
          </div>
        </div>}
      </div>}

      {/* Supplier Performance */}
      {visibleWidgets.supplierPerformance && <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Store size={16} className="text-orange-600" />
            <h2 className="text-base font-semibold text-[var(--text)]">공급사 현황</h2>
          </div>
          <span className="text-xs text-[var(--text-secondary)]">실시간</span>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-[var(--border)]">
              <th className="text-left text-xs font-medium text-[var(--text-secondary)] pb-3">공급사</th>
              <th className="text-center text-xs font-medium text-[var(--text-secondary)] pb-3">상태</th>
              <th className="text-right text-xs font-medium text-[var(--text-secondary)] pb-3">등록 제품</th>
              <th className="text-right text-xs font-medium text-[var(--text-secondary)] pb-3">월 주문</th>
              <th className="text-right text-xs font-medium text-[var(--text-secondary)] pb-3">이행률</th>
            </tr>
          </thead>
          <tbody>
            {supplierOverview.map((s) => (
              <tr key={s.name} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--bg)] transition-colors">
                <td className="py-3 text-sm font-medium text-[var(--text)]">{s.name}</td>
                <td className="py-3 text-center">
                  <span className="inline-flex items-center gap-1.5">
                    <Circle size={8} className={`${
                      s.status === 'online' ? 'fill-emerald-500 text-emerald-500' :
                      s.status === 'sync' ? 'fill-amber-500 text-amber-500' :
                      'fill-red-500 text-red-500'
                    }`} />
                    <span className={`text-xs ${
                      s.status === 'online' ? 'text-emerald-600' :
                      s.status === 'sync' ? 'text-amber-600' :
                      'text-red-500'
                    }`}>
                      {s.status === 'online' ? '연결됨' : s.status === 'sync' ? '동기화중' : '오프라인'}
                    </span>
                  </span>
                </td>
                <td className="py-3 text-sm text-right text-[var(--text-secondary)]">{s.activeProducts.toLocaleString()}</td>
                <td className="py-3 text-sm text-right text-[var(--text-secondary)]">{s.monthlyOrders}건</td>
                <td className="py-3 text-right">
                  <span className={`text-sm font-medium ${
                    s.fulfillmentRate >= 97 ? 'text-emerald-600' :
                    s.fulfillmentRate >= 94 ? 'text-amber-600' :
                    'text-red-500'
                  }`}>
                    {s.fulfillmentRate}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex items-center justify-end mt-4 pt-3 border-t border-[var(--border)]">
          <a href="/suppliers-mgmt" className="text-xs text-orange-600 hover:text-orange-700 font-medium flex items-center gap-1">
            공급자 관리 <ExternalLink size={12} />
          </a>
        </div>
      </div>}
    </div>
  );
}
