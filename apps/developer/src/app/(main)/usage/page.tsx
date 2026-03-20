'use client';

import {
  Activity,
  Calendar,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  AlertTriangle,
} from 'lucide-react';

const usageStats = [
  { label: '오늘 호출', value: '234', limit: '5,000', percent: 4.7, change: '+12%', up: true, icon: <Activity size={20} /> },
  { label: '이번달 호출', value: '5,678', limit: '150,000', percent: 3.8, change: '+8%', up: true, icon: <Calendar size={20} /> },
  { label: '평균 응답 시간', value: '145ms', limit: null, percent: null, change: '-5ms', up: true, icon: <Clock size={20} /> },
];

const topEndpoints = [
  { endpoint: 'GET /api/v1/products', calls: 1456, avgLatency: '92ms', errorRate: '0.1%' },
  { endpoint: 'GET /api/v1/products/search', calls: 1123, avgLatency: '134ms', errorRate: '0.2%' },
  { endpoint: 'GET /api/v1/chemicals/:cas', calls: 890, avgLatency: '108ms', errorRate: '0.1%' },
  { endpoint: 'POST /api/v1/ai/recommend', calls: 567, avgLatency: '1.2s', errorRate: '0.5%' },
  { endpoint: 'GET /api/v1/pricing/:productId', calls: 456, avgLatency: '85ms', errorRate: '0.0%' },
  { endpoint: 'POST /api/v1/ai/predict', calls: 234, avgLatency: '2.1s', errorRate: '0.3%' },
  { endpoint: 'GET /api/v1/knowledge/:cas/relations', calls: 189, avgLatency: '156ms', errorRate: '0.1%' },
  { endpoint: 'POST /api/v1/ai/analytics', calls: 123, avgLatency: '3.5s', errorRate: '0.8%' },
];

const errorLogs = [
  { id: 1, time: '10:15:32', endpoint: 'POST /api/v1/ai/recommend', status: 429, message: 'Rate Limit Exceeded', ip: '203.xxx.xxx.15' },
  { id: 2, time: '09:48:15', endpoint: 'GET /api/v1/products/999999', status: 404, message: 'Product Not Found', ip: '203.xxx.xxx.15' },
  { id: 3, time: '08:30:45', endpoint: 'POST /api/v1/ai/analytics', status: 500, message: 'Internal Server Error', ip: '203.xxx.xxx.15' },
  { id: 4, time: '08:22:10', endpoint: 'GET /api/v1/chemicals/invalid', status: 400, message: 'Invalid CAS Number Format', ip: '203.xxx.xxx.15' },
];

const statusColors: Record<number, string> = {
  400: 'bg-amber-100 text-amber-700',
  404: 'bg-gray-100 text-gray-600',
  429: 'bg-orange-100 text-orange-700',
  500: 'bg-red-100 text-red-700',
};

export default function UsagePage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--text)]">사용량</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">API 사용량 현황 및 모니터링</p>
      </div>

      {/* Usage Stats */}
      <div className="grid grid-cols-3 gap-4">
        {usageStats.map((stat) => (
          <div key={stat.label} className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                {stat.icon}
              </div>
              <div className={`flex items-center gap-1 text-xs font-medium ${stat.up ? 'text-emerald-600' : 'text-red-500'}`}>
                {stat.up ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {stat.change}
              </div>
            </div>
            <div className="text-2xl font-bold text-[var(--text)]">{stat.value}</div>
            {stat.limit && (
              <div className="mt-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-[var(--text-secondary)]">{stat.label}</span>
                  <span className="text-xs text-[var(--text-secondary)]">{stat.value} / {stat.limit}</span>
                </div>
                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full"
                    style={{ width: `${stat.percent}%` }}
                  />
                </div>
              </div>
            )}
            {!stat.limit && (
              <div className="text-xs text-[var(--text-secondary)] mt-1">{stat.label}</div>
            )}
          </div>
        ))}
      </div>

      {/* Daily Usage Chart */}
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5">
        <h2 className="text-base font-semibold text-[var(--text)] mb-4">일별 API 호출량</h2>
        <div className="h-48 bg-[var(--bg)] rounded-lg flex items-center justify-center border border-dashed border-[var(--border)]">
          <span className="text-sm text-[var(--text-secondary)]">차트 영역 (최근 30일 일별 API 호출량 추이 그래프)</span>
        </div>
      </div>

      {/* Top Endpoints */}
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-[var(--border)]">
          <h2 className="text-base font-semibold text-[var(--text)]">엔드포인트별 사용량</h2>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[var(--bg)] border-b border-[var(--border)]">
              <th className="text-left px-5 py-3 font-semibold text-[var(--text-secondary)]">엔드포인트</th>
              <th className="text-right px-5 py-3 font-semibold text-[var(--text-secondary)]">호출수 (이번달)</th>
              <th className="text-right px-5 py-3 font-semibold text-[var(--text-secondary)]">평균 응답</th>
              <th className="text-right px-5 py-3 font-semibold text-[var(--text-secondary)]">에러율</th>
            </tr>
          </thead>
          <tbody>
            {topEndpoints.map((ep) => {
              const parts = ep.endpoint.split(' ');
              const method = parts[0];
              const path = parts.slice(1).join(' ');
              return (
                <tr key={ep.endpoint} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--bg)] transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${
                        method === 'GET' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {method}
                      </span>
                      <code className="font-mono text-xs text-[var(--text)]">{path}</code>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-right font-medium text-[var(--text)]">{ep.calls.toLocaleString()}</td>
                  <td className="px-5 py-3.5 text-right text-[var(--text-secondary)]">{ep.avgLatency}</td>
                  <td className="px-5 py-3.5 text-right text-[var(--text-secondary)]">{ep.errorRate}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Error Log */}
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle size={18} className="text-amber-500" />
          <h2 className="text-base font-semibold text-[var(--text)]">최근 에러 로그</h2>
          <span className="text-xs text-[var(--text-secondary)]">(오늘)</span>
        </div>
        <div className="space-y-3">
          {errorLogs.map((log) => (
            <div key={log.id} className="flex items-start gap-4 py-3 border-b border-[var(--border)] last:border-0">
              <span className="text-xs font-mono text-[var(--text-secondary)] mt-0.5 w-16 shrink-0">{log.time}</span>
              <span className={`text-xs font-bold px-2 py-0.5 rounded shrink-0 ${statusColors[log.status] || ''}`}>
                {log.status}
              </span>
              <div className="flex-1 min-w-0">
                <code className="text-xs font-mono text-[var(--text)]">{log.endpoint}</code>
                <p className="text-xs text-[var(--text-secondary)] mt-0.5">{log.message}</p>
              </div>
              <span className="text-xs font-mono text-[var(--text-secondary)] shrink-0">{log.ip}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
