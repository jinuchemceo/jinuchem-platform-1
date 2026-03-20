'use client';

import {
  Database,
  Search,
  TrendingUp,
  ArrowUpRight,
  Circle,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';

const pipelineStats = [
  { label: 'DataEvent', value: '12,345건', desc: '오늘 수집', change: '+8%', icon: <Database size={20} /> },
  { label: 'SearchLog', value: '2,345건', desc: '오늘 수집', change: '+15%', icon: <Search size={20} /> },
  { label: 'PriceHistory', value: '567건', desc: '오늘 수집', change: '+3%', icon: <TrendingUp size={20} /> },
];

const batchJobs = [
  {
    id: 1,
    name: 'ai-batch-recommend',
    desc: 'AI 추천 배치 생성',
    schedule: '매일 03:00',
    lastRun: '2026-03-20 03:00',
    nextRun: '2026-03-21 03:00',
    status: '성공',
    duration: '12분 34초',
  },
  {
    id: 2,
    name: 'ai-batch-predict',
    desc: 'AI 소모량 예측 배치',
    schedule: '매주 월요일 04:00',
    lastRun: '2026-03-17 04:00',
    nextRun: '2026-03-24 04:00',
    status: '성공',
    duration: '28분 15초',
  },
  {
    id: 3,
    name: 'data-aggregate',
    desc: '일별 데이터 집계',
    schedule: '매일 00:00',
    lastRun: '2026-03-20 00:00',
    nextRun: '2026-03-21 00:00',
    status: '성공',
    duration: '5분 42초',
  },
  {
    id: 4,
    name: 'supplier-sync',
    desc: '공급사 가격/재고 동기화',
    schedule: '6시간마다',
    lastRun: '2026-03-20 06:00',
    nextRun: '2026-03-20 12:00',
    status: '실패',
    duration: '3분 18초',
  },
  {
    id: 5,
    name: 'knowledge-graph-update',
    desc: '지식 그래프 노드 갱신',
    schedule: '매일 05:00',
    lastRun: '2026-03-20 05:00',
    nextRun: '2026-03-21 05:00',
    status: '성공',
    duration: '45분 22초',
  },
  {
    id: 6,
    name: 'search-index-rebuild',
    desc: '검색 인덱스 재구축',
    schedule: '매일 02:00',
    lastRun: '2026-03-20 02:00',
    nextRun: '2026-03-21 02:00',
    status: '실행중',
    duration: '-',
  },
];

const errorLogs = [
  { id: 1, job: 'supplier-sync', error: 'TCI API 응답 타임아웃 (30s 초과)', time: '2026-03-20 06:03:18', severity: 'error' },
  { id: 2, job: 'supplier-sync', error: 'Alfa Aesar 가격 데이터 형식 변경 감지', time: '2026-03-19 18:00:05', severity: 'warning' },
  { id: 3, job: 'ai-batch-recommend', error: 'Claude API Rate Limit 도달 (5분 대기 후 재시도 성공)', time: '2026-03-20 03:12:45', severity: 'warning' },
  { id: 4, job: 'data-aggregate', error: '중복 DataEvent 감지 (자동 dedupe 처리)', time: '2026-03-20 00:15:33', severity: 'info' },
];

const statusColors: Record<string, { bg: string; dot: string }> = {
  성공: { bg: 'bg-emerald-100 text-emerald-700', dot: 'fill-emerald-500 text-emerald-500' },
  실패: { bg: 'bg-red-100 text-red-700', dot: 'fill-red-500 text-red-500' },
  실행중: { bg: 'bg-blue-100 text-blue-700', dot: 'fill-blue-500 text-blue-500' },
};

const severityColors: Record<string, string> = {
  error: 'text-red-500',
  warning: 'text-amber-500',
  info: 'text-blue-500',
};

export default function DataPipelinePage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text)]">데이터 파이프라인</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">데이터 수집 및 배치 작업 모니터링</p>
        </div>
        <button className="h-[var(--btn-height)] px-4 bg-[var(--bg)] border border-[var(--border)] text-[var(--text)] rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors flex items-center gap-2">
          <RefreshCw size={16} />
          새로고침
        </button>
      </div>

      {/* Pipeline Status Cards */}
      <div className="grid grid-cols-3 gap-4">
        {pipelineStats.map((stat) => (
          <div key={stat.label} className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center text-orange-600">
                {stat.icon}
              </div>
              <div className="flex items-center gap-1 text-xs font-medium text-emerald-600">
                <ArrowUpRight size={14} />
                {stat.change}
              </div>
            </div>
            <div className="text-2xl font-bold text-[var(--text)]">{stat.value}</div>
            <div className="text-xs text-[var(--text-secondary)] mt-1">{stat.label} - {stat.desc}</div>
          </div>
        ))}
      </div>

      {/* Batch Jobs Table */}
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-[var(--border)]">
          <h2 className="text-base font-semibold text-[var(--text)]">배치 작업 현황</h2>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[var(--bg)] border-b border-[var(--border)]">
              <th className="text-left px-5 py-3 font-semibold text-[var(--text-secondary)]">작업명</th>
              <th className="text-left px-5 py-3 font-semibold text-[var(--text-secondary)]">주기</th>
              <th className="text-left px-5 py-3 font-semibold text-[var(--text-secondary)]">마지막 실행</th>
              <th className="text-left px-5 py-3 font-semibold text-[var(--text-secondary)]">다음 실행</th>
              <th className="text-left px-5 py-3 font-semibold text-[var(--text-secondary)]">상태</th>
              <th className="text-left px-5 py-3 font-semibold text-[var(--text-secondary)]">소요시간</th>
            </tr>
          </thead>
          <tbody>
            {batchJobs.map((job) => {
              const statusStyle = statusColors[job.status] || statusColors['성공'];
              return (
                <tr key={job.id} className="border-b border-[var(--border)] hover:bg-[var(--bg)] transition-colors">
                  <td className="px-5 py-3.5">
                    <div>
                      <div className="font-mono text-xs text-orange-600 font-medium">{job.name}</div>
                      <div className="text-xs text-[var(--text-secondary)] mt-0.5">{job.desc}</div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-[var(--text)]">{job.schedule}</td>
                  <td className="px-5 py-3.5 text-[var(--text-secondary)]">{job.lastRun}</td>
                  <td className="px-5 py-3.5 text-[var(--text-secondary)]">{job.nextRun}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <Circle size={8} className={statusStyle.dot} />
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusStyle.bg}`}>
                        {job.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-[var(--text-secondary)]">{job.duration}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Error Logs */}
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5">
        <h2 className="text-base font-semibold text-[var(--text)] mb-4">최근 오류 로그</h2>
        <div className="space-y-3">
          {errorLogs.map((log) => (
            <div key={log.id} className="flex items-start gap-3 py-3 border-b border-[var(--border)] last:border-0">
              <div className={`mt-0.5 ${severityColors[log.severity]}`}>
                <AlertTriangle size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs text-orange-600 font-medium">{log.job}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${
                    log.severity === 'error' ? 'bg-red-100 text-red-700' :
                    log.severity === 'warning' ? 'bg-amber-100 text-amber-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {log.severity.toUpperCase()}
                  </span>
                </div>
                <p className="text-sm text-[var(--text)]">{log.error}</p>
                <p className="text-xs text-[var(--text-secondary)] mt-1">{log.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
