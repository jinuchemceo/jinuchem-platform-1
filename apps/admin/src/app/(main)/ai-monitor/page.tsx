'use client';

import { useState } from 'react';
import {
  Sparkles,
  TrendingUp,
  FileBarChart,
  GitBranch,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  Cpu,
  Clock,
  CheckCircle,
  XCircle,
  Target,
  BarChart3,
  Brain,
  Zap,
  Download,
} from 'lucide-react';
import { AdminTabs } from '@/components/shared/AdminTabs';
import { StatCard } from '@/components/shared/StatCard';
import { ChartPlaceholder } from '@/components/shared/ChartPlaceholder';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Pagination } from '@/components/shared/Pagination';
import {
  mockRecommendations,
  mockPredictions,
  mockReports,
  mockKnowledgeNodes,
} from '@/lib/admin-mock-data';
import { useAdminStore } from '@/stores/adminStore';

// ---------------------------------------------------------------------------
// Type colors
// ---------------------------------------------------------------------------
const typeColors: Record<string, string> = {
  추천: 'bg-blue-100 text-blue-700',
  예측: 'bg-purple-100 text-purple-700',
  분석: 'bg-emerald-100 text-emerald-700',
  지식그래프: 'bg-amber-100 text-amber-700',
};

// ---------------------------------------------------------------------------
// Static data
// ---------------------------------------------------------------------------
const recentGenerations = [
  { id: 1, type: '추천', target: '서울대 화학과 김연구', input: '구매이력 기반 시약 추천', tokens: 2340, latency: '1.2s', time: '10:15' },
  { id: 2, type: '예측', target: 'KAIST 생명공학과', input: '2분기 소모량 예측', tokens: 3100, latency: '2.1s', time: '09:48' },
  { id: 3, type: '분석', target: '연세대 약학과', input: '구매 패턴 분석 리포트', tokens: 5420, latency: '3.8s', time: '09:30' },
  { id: 4, type: '추천', target: 'POSTECH 화학공학과 정화학', input: '대체시약 추천', tokens: 1890, latency: '0.9s', time: '09:22' },
  { id: 5, type: '지식그래프', target: 'System', input: 'Acetone 관계 노드 생성', tokens: 4200, latency: '2.5s', time: '09:00' },
  { id: 6, type: '예측', target: '고려대 신소재공학부', input: '재주문 시점 예측', tokens: 2780, latency: '1.7s', time: '08:45' },
  { id: 7, type: '추천', target: 'KAIST 생명공학과 박실험', input: '실험 프로토콜 기반 추천', tokens: 3050, latency: '1.5s', time: '08:30' },
];

const costBreakdown = [
  { engine: '추천 엔진', calls: 1234, inputTokens: '2.4M', outputTokens: '890K', cost: 89.20 },
  { engine: '예측 엔진', calls: 456, inputTokens: '1.8M', outputTokens: '650K', cost: 62.50 },
  { engine: '분석 엔진', calls: 89, inputTokens: '3.2M', outputTokens: '1.2M', cost: 45.80 },
  { engine: '지식 그래프', calls: 567, inputTokens: '1.5M', outputTokens: '420K', cost: 37.06 },
];

const tabs = [
  { id: '개요', label: '개요' },
  { id: '추천 엔진', label: '추천 엔진' },
  { id: '예측 엔진', label: '예측 엔진' },
  { id: '분석 리포트', label: '분석 리포트' },
  { id: '지식 그래프', label: '지식 그래프' },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function ProgressBar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
      <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
    </div>
  );
}

function TypeBadge({ type }: { type: string }) {
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium inline-block ${typeColors[type] ?? 'bg-gray-100 text-gray-700'}`}>
      {type}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Tab 1: Overview
// ---------------------------------------------------------------------------
function OverviewTab() {
  const totalCost = costBreakdown.reduce((s, r) => s + r.cost, 0);
  const totalCalls = costBreakdown.reduce((s, r) => s + r.calls, 0);

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-5 gap-4">
        <StatCard icon={<Sparkles size={20} />} label="추천 생성" value="1,234건" change="+12%" up />
        <StatCard icon={<TrendingUp size={20} />} label="예측 생성" value="456건" change="+8%" up />
        <StatCard icon={<FileBarChart size={20} />} label="분석 리포트" value="89건" change="+15%" up />
        <StatCard icon={<GitBranch size={20} />} label="지식그래프 노드" value="2,345개" change="+145" up />
        <StatCard icon={<DollarSign size={20} />} label="이번 달 API 비용" value="234.56" change="+5.2%" up={false} prefix="$" />
      </div>

      {/* Daily usage chart */}
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5">
        <h2 className="text-base font-semibold text-[var(--text)] mb-4">일별 AI 호출량 추이</h2>
        <ChartPlaceholder title="일별 AI 호출량 추이" height="h-56" />
      </div>

      {/* Cost breakdown */}
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-[var(--text)]">엔진별 비용 내역</h2>
          <span className="text-xs text-[var(--text-secondary)]">이번 달 기준</span>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--border)]">
              <th className="text-left px-4 py-2.5 font-semibold text-[var(--text-secondary)]">엔진</th>
              <th className="text-right px-4 py-2.5 font-semibold text-[var(--text-secondary)]">호출 수</th>
              <th className="text-right px-4 py-2.5 font-semibold text-[var(--text-secondary)]">Input Tokens</th>
              <th className="text-right px-4 py-2.5 font-semibold text-[var(--text-secondary)]">Output Tokens</th>
              <th className="text-right px-4 py-2.5 font-semibold text-[var(--text-secondary)]">비용</th>
            </tr>
          </thead>
          <tbody>
            {costBreakdown.map((row) => (
              <tr key={row.engine} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--bg)] transition-colors">
                <td className="px-4 py-3 text-[var(--text)] font-medium">{row.engine}</td>
                <td className="px-4 py-3 text-right font-mono text-xs text-[var(--text)]">{row.calls.toLocaleString()}</td>
                <td className="px-4 py-3 text-right font-mono text-xs text-[var(--text)]">{row.inputTokens}</td>
                <td className="px-4 py-3 text-right font-mono text-xs text-[var(--text)]">{row.outputTokens}</td>
                <td className="px-4 py-3 text-right font-mono text-xs text-[var(--text)]">${row.cost.toFixed(2)}</td>
              </tr>
            ))}
            <tr className="bg-[var(--bg)]">
              <td className="px-4 py-3 font-bold text-[var(--text)]">합계</td>
              <td className="px-4 py-3 text-right font-mono text-xs font-bold text-[var(--text)]">{totalCalls.toLocaleString()}</td>
              <td className="px-4 py-3 text-right font-mono text-xs font-bold text-[var(--text)]">8.9M</td>
              <td className="px-4 py-3 text-right font-mono text-xs font-bold text-[var(--text)]">3.16M</td>
              <td className="px-4 py-3 text-right font-mono text-xs font-bold text-[var(--text)]">${totalCost.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Recent AI Generations */}
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-[var(--text)]">최근 AI 생성 로그</h2>
          <span className="text-xs text-[var(--text-secondary)]">오늘 기준</span>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--border)]">
              <th className="text-left px-4 py-2.5 font-semibold text-[var(--text-secondary)]">유형</th>
              <th className="text-left px-4 py-2.5 font-semibold text-[var(--text-secondary)]">대상</th>
              <th className="text-left px-4 py-2.5 font-semibold text-[var(--text-secondary)]">입력</th>
              <th className="text-right px-4 py-2.5 font-semibold text-[var(--text-secondary)]">토큰</th>
              <th className="text-right px-4 py-2.5 font-semibold text-[var(--text-secondary)]">지연</th>
              <th className="text-right px-4 py-2.5 font-semibold text-[var(--text-secondary)]">시각</th>
            </tr>
          </thead>
          <tbody>
            {recentGenerations.map((gen) => (
              <tr key={gen.id} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--bg)] transition-colors">
                <td className="px-4 py-3"><TypeBadge type={gen.type} /></td>
                <td className="px-4 py-3 text-[var(--text)]">{gen.target}</td>
                <td className="px-4 py-3 text-[var(--text-secondary)]">{gen.input}</td>
                <td className="px-4 py-3 text-right font-mono text-xs text-[var(--text)]">{gen.tokens.toLocaleString()}</td>
                <td className="px-4 py-3 text-right text-[var(--text-secondary)]">{gen.latency}</td>
                <td className="px-4 py-3 text-right text-[var(--text-secondary)]">{gen.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Model Version */}
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5">
        <h2 className="text-base font-semibold text-[var(--text)] mb-4">모델 버전 정보</h2>
        <div className="grid grid-cols-4 gap-4">
          {[
            { name: '추천 엔진', version: 'v2.3.1', date: '2026-03-15 배포', icon: <Sparkles size={16} /> },
            { name: '예측 엔진', version: 'v1.8.0', date: '2026-03-10 배포', icon: <TrendingUp size={16} /> },
            { name: '분석 엔진', version: 'v1.5.2', date: '2026-03-08 배포', icon: <FileBarChart size={16} /> },
            { name: '지식 그래프', version: 'v1.2.0', date: '2026-03-01 배포', icon: <GitBranch size={16} /> },
          ].map((m) => (
            <div key={m.name} className="p-4 bg-[var(--bg)] rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-orange-600">{m.icon}</span>
                <span className="text-xs text-[var(--text-secondary)]">{m.name}</span>
              </div>
              <div className="text-sm font-bold text-[var(--text)]">{m.version}</div>
              <div className="text-xs text-[var(--text-secondary)] mt-1">{m.date}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Tab 2: Recommendation Engine
// ---------------------------------------------------------------------------
function RecommendTab() {
  const [page, setPage] = useState(1);
  const perPage = 6;
  const totalPages = Math.ceil(mockRecommendations.length / perPage);
  const paged = mockRecommendations.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="space-y-6">
      {/* Performance metrics */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5">
          <h2 className="text-base font-semibold text-[var(--text)] mb-4">추천 엔진 성능</h2>
          <div className="space-y-5">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-[var(--text-secondary)]">추천 CTR (Click-Through Rate)</span>
                <span className="text-sm font-bold text-[var(--text)]">18.5%</span>
              </div>
              <ProgressBar value={18.5} max={100} color="bg-orange-500" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-[var(--text-secondary)]">대체시약 채택률</span>
                <span className="text-sm font-bold text-[var(--text)]">32%</span>
              </div>
              <ProgressBar value={32} max={100} color="bg-emerald-500" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-[var(--text-secondary)]">재구매 추천 정확도</span>
                <span className="text-sm font-bold text-[var(--text)]">74.2%</span>
              </div>
              <ProgressBar value={74.2} max={100} color="bg-blue-500" />
            </div>
          </div>
        </div>

        {/* Model version card */}
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5">
          <h2 className="text-base font-semibold text-[var(--text)] mb-4">모델 정보</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[var(--text-secondary)]">현재 버전</span>
              <span className="text-sm font-bold text-[var(--text)]">v2.3.1</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-[var(--text-secondary)]">배포일</span>
              <span className="text-sm text-[var(--text)]">2026-03-15</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-[var(--text-secondary)]">배포 시점 CTR</span>
              <span className="text-sm text-[var(--text)]">16.8%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-[var(--text-secondary)]">현재 CTR</span>
              <span className="text-sm font-bold text-emerald-600">18.5% (+1.7%)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-[var(--text-secondary)]">기반 모델</span>
              <span className="text-sm text-[var(--text)]">Claude 3.5 Sonnet</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-[var(--text-secondary)]">평균 지연</span>
              <span className="text-sm text-[var(--text)]">1.2s</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations table */}
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-[var(--text)]">최근 추천 내역</h2>
          <span className="text-xs text-[var(--text-secondary)]">총 {mockRecommendations.length}건</span>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--border)]">
              <th className="text-left px-4 py-2.5 font-semibold text-[var(--text-secondary)]">사용자</th>
              <th className="text-left px-4 py-2.5 font-semibold text-[var(--text-secondary)]">추천 제품</th>
              <th className="text-center px-4 py-2.5 font-semibold text-[var(--text-secondary)]">점수</th>
              <th className="text-center px-4 py-2.5 font-semibold text-[var(--text-secondary)]">클릭</th>
              <th className="text-right px-4 py-2.5 font-semibold text-[var(--text-secondary)]">시각</th>
            </tr>
          </thead>
          <tbody>
            {paged.map((rec) => (
              <tr key={rec.id} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--bg)] transition-colors">
                <td className="px-4 py-3 text-[var(--text)] font-medium whitespace-nowrap">{rec.userName}</td>
                <td className="px-4 py-3 text-[var(--text-secondary)] max-w-xs truncate">{rec.products.join(', ')}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${rec.score >= 0.9 ? 'bg-emerald-500' : rec.score >= 0.8 ? 'bg-blue-500' : rec.score >= 0.7 ? 'bg-amber-500' : 'bg-red-400'}`}
                        style={{ width: `${rec.score * 100}%` }}
                      />
                    </div>
                    <span className="text-xs font-mono text-[var(--text)]">{rec.score.toFixed(2)}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-center">
                  {rec.clicked ? (
                    <CheckCircle size={16} className="text-emerald-500 mx-auto" />
                  ) : (
                    <XCircle size={16} className="text-gray-300 mx-auto" />
                  )}
                </td>
                <td className="px-4 py-3 text-right text-[var(--text-secondary)] whitespace-nowrap">{rec.timestamp}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-4">
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Tab 3: Prediction Engine
// ---------------------------------------------------------------------------
function PredictTab() {
  const [page, setPage] = useState(1);
  const perPage = 6;
  const totalPages = Math.ceil(mockPredictions.length / perPage);
  const paged = mockPredictions.slice((page - 1) * perPage, page * perPage);

  const predTypeColors: Record<string, string> = {
    소모량: 'bg-blue-100 text-blue-700',
    예산: 'bg-purple-100 text-purple-700',
    재주문: 'bg-amber-100 text-amber-700',
  };

  function errorColor(err: number) {
    if (err > 20) return 'text-red-600';
    if (err > 10) return 'text-amber-600';
    return 'text-emerald-600';
  }

  return (
    <div className="space-y-6">
      {/* Performance metrics */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5">
          <h2 className="text-base font-semibold text-[var(--text)] mb-4">예측 엔진 성능</h2>
          <div className="space-y-5">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-[var(--text-secondary)]">소모량 MAPE (평균 절대 백분위 오차)</span>
                <span className="text-sm font-bold text-[var(--text)]">15.2%</span>
              </div>
              <ProgressBar value={84.8} max={100} color="bg-purple-500" />
              <p className="text-xs text-[var(--text-secondary)] mt-1">목표: 20% 이하 (달성)</p>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-[var(--text-secondary)]">예산 예측 정확도</span>
                <span className="text-sm font-bold text-[var(--text)]">87%</span>
              </div>
              <ProgressBar value={87} max={100} color="bg-amber-500" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-[var(--text-secondary)]">재주문 시점 정확도</span>
                <span className="text-sm font-bold text-[var(--text)]">69.5%</span>
              </div>
              <ProgressBar value={69.5} max={100} color="bg-teal-500" />
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5">
          <h2 className="text-base font-semibold text-[var(--text)] mb-4">예측 정확도 추이</h2>
          <ChartPlaceholder title="예측 정확도 추이" height="h-52" />
        </div>
      </div>

      {/* Predictions table */}
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-[var(--text)]">최근 예측 내역</h2>
          <span className="text-xs text-[var(--text-secondary)]">총 {mockPredictions.length}건</span>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--border)]">
              <th className="text-left px-4 py-2.5 font-semibold text-[var(--text-secondary)]">기관</th>
              <th className="text-left px-4 py-2.5 font-semibold text-[var(--text-secondary)]">유형</th>
              <th className="text-right px-4 py-2.5 font-semibold text-[var(--text-secondary)]">예측값</th>
              <th className="text-right px-4 py-2.5 font-semibold text-[var(--text-secondary)]">실제값</th>
              <th className="text-right px-4 py-2.5 font-semibold text-[var(--text-secondary)]">오차율</th>
              <th className="text-center px-4 py-2.5 font-semibold text-[var(--text-secondary)]">신뢰도</th>
              <th className="text-right px-4 py-2.5 font-semibold text-[var(--text-secondary)]">시각</th>
            </tr>
          </thead>
          <tbody>
            {paged.map((pred) => (
              <tr key={pred.id} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--bg)] transition-colors">
                <td className="px-4 py-3 text-[var(--text)] font-medium whitespace-nowrap">{pred.orgName}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${predTypeColors[pred.type] ?? ''}`}>
                    {pred.type}
                  </span>
                </td>
                <td className="px-4 py-3 text-right font-mono text-xs text-[var(--text)]">
                  {pred.type === '예산' ? `${(pred.predicted / 10000).toLocaleString()}만원` : pred.predicted.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-right font-mono text-xs text-[var(--text)]">
                  {pred.type === '예산' ? `${(pred.actual / 10000).toLocaleString()}만원` : pred.actual.toLocaleString()}
                </td>
                <td className={`px-4 py-3 text-right font-mono text-xs font-medium ${errorColor(pred.error)}`}>
                  {pred.error.toFixed(1)}%
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-14 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${pred.confidence >= 0.85 ? 'bg-emerald-500' : pred.confidence >= 0.75 ? 'bg-blue-500' : 'bg-amber-500'}`}
                        style={{ width: `${pred.confidence * 100}%` }}
                      />
                    </div>
                    <span className="text-xs font-mono text-[var(--text)]">{(pred.confidence * 100).toFixed(0)}%</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-right text-[var(--text-secondary)] whitespace-nowrap">{pred.timestamp}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-4">
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Tab 4: Analysis Reports
// ---------------------------------------------------------------------------
function ReportsTab() {
  const reportTypeColors: Record<string, string> = {
    구매패턴: 'blue',
    트렌드: 'purple',
    계절성: 'amber',
  };

  const reportStatusColors: Record<string, string> = {
    완료: 'emerald',
    생성중: 'blue',
    실패: 'red',
  };

  const completedCount = mockReports.filter((r) => r.status === '완료').length;
  const thisMonthCount = mockReports.filter((r) => r.generatedAt.startsWith('2026-03')).length;
  // Most popular type
  const typeCounts: Record<string, number> = {};
  mockReports.forEach((r) => { typeCounts[r.type] = (typeCounts[r.type] || 0) + 1; });
  const popularType = Object.entries(typeCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '-';

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <StatCard icon={<FileBarChart size={20} />} label="전체 리포트" value={`${mockReports.length}건`} change="+15%" up />
        <StatCard icon={<Clock size={20} />} label="이번 달" value={`${thisMonthCount}건`} change="+3건" up />
        <StatCard icon={<BarChart3 size={20} />} label="인기 유형" value={popularType} change="40%" up />
      </div>

      {/* Chart */}
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5">
        <h2 className="text-base font-semibold text-[var(--text)] mb-4">리포트 유형 분포</h2>
        <ChartPlaceholder title="리포트 유형 분포" height="h-48" />
      </div>

      {/* Reports table */}
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-[var(--text)]">분석 리포트 목록</h2>
          <span className="text-xs text-[var(--text-secondary)]">완료 {completedCount}건</span>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--border)]">
              <th className="text-left px-4 py-2.5 font-semibold text-[var(--text-secondary)]">기관</th>
              <th className="text-left px-4 py-2.5 font-semibold text-[var(--text-secondary)]">리포트 유형</th>
              <th className="text-left px-4 py-2.5 font-semibold text-[var(--text-secondary)]">기간</th>
              <th className="text-center px-4 py-2.5 font-semibold text-[var(--text-secondary)]">상태</th>
              <th className="text-right px-4 py-2.5 font-semibold text-[var(--text-secondary)]">생성일시</th>
              <th className="text-center px-4 py-2.5 font-semibold text-[var(--text-secondary)]">액션</th>
            </tr>
          </thead>
          <tbody>
            {mockReports.map((rpt) => (
              <tr key={rpt.id} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--bg)] transition-colors">
                <td className="px-4 py-3 text-[var(--text)] font-medium whitespace-nowrap">{rpt.orgName}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={rpt.type} colorMap={reportTypeColors} />
                </td>
                <td className="px-4 py-3 text-[var(--text-secondary)]">{rpt.period}</td>
                <td className="px-4 py-3 text-center">
                  <StatusBadge status={rpt.status} colorMap={reportStatusColors} />
                </td>
                <td className="px-4 py-3 text-right text-[var(--text-secondary)] whitespace-nowrap">{rpt.generatedAt}</td>
                <td className="px-4 py-3 text-center">
                  {rpt.status === '완료' ? (
                    <button className="text-orange-600 hover:text-orange-700 transition-colors">
                      <Download size={16} />
                    </button>
                  ) : (
                    <span className="text-gray-300">
                      <Download size={16} />
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Tab 5: Knowledge Graph
// ---------------------------------------------------------------------------
function KnowledgeTab() {
  const sourceColors: Record<string, string> = {
    PubChem: 'blue',
    Manual: 'amber',
    AI: 'purple',
  };

  // Derive source badge from the source string
  function getSourceBadge(src: string) {
    if (src.includes('ChemSpider')) return 'PubChem';
    if (src.includes('PubChem')) return 'PubChem';
    if (src.includes('AI')) return 'AI';
    return 'Manual';
  }

  const totalRelations = mockKnowledgeNodes.reduce((s, n) => s + n.relationsCount, 0);
  const totalProperties = mockKnowledgeNodes.reduce((s, n) => s + n.propertiesCount, 0);

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard icon={<Brain size={20} />} label="전체 노드" value={`${mockKnowledgeNodes.length.toLocaleString()}개`} change="+145" up />
        <StatCard icon={<GitBranch size={20} />} label="전체 엣지" value="4,567개" change="+312" up />
        <StatCard icon={<Clock size={20} />} label="마지막 갱신" value="2시간 전" change="" up />
        <StatCard icon={<Zap size={20} />} label="소스" value="3개" change="" up />
      </div>

      {/* Chart */}
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5">
        <h2 className="text-base font-semibold text-[var(--text)] mb-4">관계 유형 분포</h2>
        <ChartPlaceholder title="관계 유형 분포" height="h-48" />
      </div>

      {/* Nodes table */}
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-[var(--text)]">최근 추가 노드</h2>
          <span className="text-xs text-[var(--text-secondary)]">총 {mockKnowledgeNodes.length}개</span>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--border)]">
              <th className="text-left px-4 py-2.5 font-semibold text-[var(--text-secondary)]">CAS Number</th>
              <th className="text-left px-4 py-2.5 font-semibold text-[var(--text-secondary)]">물질명</th>
              <th className="text-right px-4 py-2.5 font-semibold text-[var(--text-secondary)]">관계 수</th>
              <th className="text-right px-4 py-2.5 font-semibold text-[var(--text-secondary)]">속성 수</th>
              <th className="text-center px-4 py-2.5 font-semibold text-[var(--text-secondary)]">소스</th>
              <th className="text-right px-4 py-2.5 font-semibold text-[var(--text-secondary)]">추가일</th>
            </tr>
          </thead>
          <tbody>
            {mockKnowledgeNodes.map((node) => (
              <tr key={node.id} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--bg)] transition-colors">
                <td className="px-4 py-3">
                  <span className="font-mono text-xs bg-orange-50 text-orange-700 px-2 py-0.5 rounded">{node.casNumber}</span>
                </td>
                <td className="px-4 py-3 text-[var(--text)] font-medium">{node.name}</td>
                <td className="px-4 py-3 text-right font-mono text-xs text-[var(--text)]">{node.relationsCount}</td>
                <td className="px-4 py-3 text-right font-mono text-xs text-[var(--text)]">{node.propertiesCount}</td>
                <td className="px-4 py-3 text-center">
                  <StatusBadge status={getSourceBadge(node.source)} colorMap={sourceColors} />
                </td>
                <td className="px-4 py-3 text-right text-[var(--text-secondary)] whitespace-nowrap">{node.addedAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Page
// ---------------------------------------------------------------------------
export default function AiMonitorPage() {
  const { aiMonitorTab, setAiMonitorTab } = useAdminStore();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--text)]">AI 모니터링</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">AI 엔진 (Claude API) 운영 현황</p>
      </div>

      {/* Tabs */}
      <AdminTabs tabs={tabs} activeTab={aiMonitorTab} onTabChange={setAiMonitorTab} />

      {/* Tab Content */}
      {aiMonitorTab === '개요' && <OverviewTab />}
      {aiMonitorTab === '추천 엔진' && <RecommendTab />}
      {aiMonitorTab === '예측 엔진' && <PredictTab />}
      {aiMonitorTab === '분석 리포트' && <ReportsTab />}
      {aiMonitorTab === '지식 그래프' && <KnowledgeTab />}
    </div>
  );
}
