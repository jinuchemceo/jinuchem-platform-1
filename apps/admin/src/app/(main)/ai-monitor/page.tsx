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
  Settings,
  Rocket,
  Calendar,
  History,
  Play,
  Pause,
  RotateCcw,
} from 'lucide-react';
import { AdminTabs } from '@/components/shared/AdminTabs';
import { StatCard } from '@/components/shared/StatCard';
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
  { id: '모델 관리', label: '모델 관리' },
];

// ---------------------------------------------------------------------------
// Model Management mock data
// ---------------------------------------------------------------------------
const modelVersions = [
  { engine: '추천 엔진', version: 'v2.4.0-beta', baseModel: 'Claude 3.5 Sonnet', deployedAt: '2026-03-28', status: '테스트', accuracy: 19.2, metricLabel: 'CTR' },
  { engine: '추천 엔진', version: 'v2.3.1', baseModel: 'Claude 3.5 Sonnet', deployedAt: '2026-03-15', status: '운영중', accuracy: 18.5, metricLabel: 'CTR' },
  { engine: '예측 엔진', version: 'v1.8.0', baseModel: 'Claude 3.5 Sonnet', deployedAt: '2026-03-10', status: '운영중', accuracy: 84.8, metricLabel: '정확도' },
  { engine: '예측 엔진', version: 'v1.7.2', baseModel: 'Claude 3 Haiku', deployedAt: '2026-02-20', status: '대기', accuracy: 81.3, metricLabel: '정확도' },
  { engine: '분석 엔진', version: 'v1.5.2', baseModel: 'Claude 3.5 Sonnet', deployedAt: '2026-03-08', status: '운영중', accuracy: 92.0, metricLabel: '정확도' },
  { engine: '분석 엔진', version: 'v1.4.0', baseModel: 'Claude 3 Haiku', deployedAt: '2026-01-15', status: '폐기', accuracy: 86.5, metricLabel: '정확도' },
  { engine: '지식 그래프', version: 'v1.2.0', baseModel: 'Claude 3.5 Sonnet', deployedAt: '2026-03-01', status: '운영중', accuracy: 95.2, metricLabel: '정확도' },
  { engine: '지식 그래프', version: 'v1.1.1', baseModel: 'Claude 3 Haiku', deployedAt: '2026-02-01', status: '폐기', accuracy: 89.7, metricLabel: '정확도' },
];

const deploymentHistory = [
  { engine: '추천 엔진', version: 'v2.4.0-beta', deployedAt: '2026-03-28 14:30', deployer: '김운영', rollback: false, duration: '3분 42초' },
  { engine: '추천 엔진', version: 'v2.3.1', deployedAt: '2026-03-15 10:15', deployer: '박관리', rollback: false, duration: '4분 18초' },
  { engine: '예측 엔진', version: 'v1.8.0', deployedAt: '2026-03-10 09:00', deployer: '김운영', rollback: false, duration: '5분 05초' },
  { engine: '분석 엔진', version: 'v1.5.2', deployedAt: '2026-03-08 16:45', deployer: '이시스템', rollback: false, duration: '3분 55초' },
  { engine: '지식 그래프', version: 'v1.2.0', deployedAt: '2026-03-01 11:20', deployer: '박관리', rollback: true, duration: '6분 12초' },
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
      {(() => {
        const dailyAI = [
          { date: '3/26', recommend: 142, predict: 53, analyze: 12, knowledge: 28 },
          { date: '3/27', recommend: 158, predict: 48, analyze: 15, knowledge: 32 },
          { date: '3/28', recommend: 135, predict: 61, analyze: 18, knowledge: 25 },
          { date: '3/29', recommend: 167, predict: 55, analyze: 11, knowledge: 30 },
          { date: '3/30', recommend: 148, predict: 62, analyze: 20, knowledge: 27 },
          { date: '3/31', recommend: 172, predict: 58, analyze: 14, knowledge: 35 },
          { date: '4/1', recommend: 155, predict: 50, analyze: 16, knowledge: 29 },
          { date: '4/2', recommend: 163, predict: 56, analyze: 19, knowledge: 33 },
        ];
        const maxVal = Math.max(...dailyAI.map(d => d.recommend + d.predict + d.analyze + d.knowledge));
        return (
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-[var(--text)]">일별 AI 호출량 추이</h2>
              <div className="flex gap-4 text-xs text-[var(--text-secondary)]">
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-orange-500" />추천</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-purple-500" />예측</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />분석</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-blue-500" />지식그래프</span>
              </div>
            </div>
            <div className="flex items-end gap-3 h-56">
              {dailyAI.map(d => {
                const total = d.recommend + d.predict + d.analyze + d.knowledge;
                return (
                  <div key={d.date} className="flex-1 flex flex-col items-center gap-1 group relative">
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">{total}건</div>
                    <div className="w-full flex flex-col justify-end" style={{ height: '200px' }}>
                      <div className="w-full bg-blue-500 rounded-t-sm" style={{ height: `${(d.knowledge / maxVal) * 200}px` }} />
                      <div className="w-full bg-emerald-500" style={{ height: `${(d.analyze / maxVal) * 200}px` }} />
                      <div className="w-full bg-purple-500" style={{ height: `${(d.predict / maxVal) * 200}px` }} />
                      <div className="w-full bg-orange-500 rounded-b-sm" style={{ height: `${(d.recommend / maxVal) * 200}px` }} />
                    </div>
                    <span className="text-xs text-[var(--text-secondary)]">{d.date}</span>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })()}

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

        {/* Chart - 예측 정확도 추이 */}
        {(() => {
          const accuracyData = [
            { month: '10월', consumption: 88, budget: 82, reorder: 64 },
            { month: '11월', consumption: 90, budget: 85, reorder: 67 },
            { month: '12월', consumption: 87, budget: 83, reorder: 65 },
            { month: '1월', consumption: 91, budget: 86, reorder: 68 },
            { month: '2월', consumption: 93, budget: 87, reorder: 70 },
            { month: '3월', consumption: 92, budget: 87, reorder: 69 },
          ];
          return (
            <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold text-[var(--text)]">예측 정확도 추이</h2>
                <div className="flex gap-4 text-xs text-[var(--text-secondary)]">
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-blue-500" />소모량</span>
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-amber-500" />예산</span>
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-teal-500" />재주문</span>
                </div>
              </div>
              <div className="flex items-end gap-4 h-52">
                {accuracyData.map(d => (
                  <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full flex items-end justify-center gap-1" style={{ height: '180px' }}>
                      <div className="w-1/4 bg-blue-500 rounded-t-sm" style={{ height: `${d.consumption * 1.8}px` }} title={`소모량 ${d.consumption}%`} />
                      <div className="w-1/4 bg-amber-500 rounded-t-sm" style={{ height: `${d.budget * 1.8}px` }} title={`예산 ${d.budget}%`} />
                      <div className="w-1/4 bg-teal-500 rounded-t-sm" style={{ height: `${d.reorder * 1.8}px` }} title={`재주문 ${d.reorder}%`} />
                    </div>
                    <span className="text-xs text-[var(--text-secondary)]">{d.month}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}
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

      {/* Chart - 리포트 유형 분포 */}
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5">
        <h2 className="text-base font-semibold text-[var(--text)] mb-4">리포트 유형 분포</h2>
        <div className="space-y-3">
          {[
            { type: '구매 패턴 분석', count: 34, pct: 38, color: 'bg-blue-500' },
            { type: '트렌드 분석', count: 22, pct: 25, color: 'bg-purple-500' },
            { type: '계절성 분석', count: 18, pct: 20, color: 'bg-emerald-500' },
            { type: '비용 최적화', count: 15, pct: 17, color: 'bg-amber-500' },
          ].map(item => (
            <div key={item.type} className="flex items-center gap-3">
              <span className="text-sm text-[var(--text)] w-28 shrink-0">{item.type}</span>
              <div className="flex-1 bg-[var(--bg)] rounded-full h-6 overflow-hidden">
                <div className={`${item.color} h-full rounded-full flex items-center justify-end pr-2 transition-all`} style={{ width: `${item.pct}%` }}>
                  <span className="text-xs text-white font-medium">{item.count}건</span>
                </div>
              </div>
              <span className="text-xs text-[var(--text-secondary)] w-10 text-right">{item.pct}%</span>
            </div>
          ))}
        </div>
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
                    <button onClick={() => alert(`리포트 "${rpt.orgName} - ${rpt.type}" 다운로드를 시작합니다.`)} className="text-orange-600 hover:text-orange-700 transition-colors">
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

      {/* Chart - 관계 유형 분포 */}
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5">
        <h2 className="text-base font-semibold text-[var(--text)] mb-4">관계 유형 분포</h2>
        <div className="space-y-3">
          {[
            { type: '호환성(Compatible)', count: 1523, pct: 33, color: 'bg-blue-500' },
            { type: '대체품(Substitute)', count: 1245, pct: 27, color: 'bg-emerald-500' },
            { type: '반응물(Reactant)', count: 876, pct: 19, color: 'bg-purple-500' },
            { type: '유도체(Derivative)', count: 589, pct: 13, color: 'bg-amber-500' },
            { type: '기타(Other)', count: 334, pct: 8, color: 'bg-gray-400' },
          ].map(item => (
            <div key={item.type} className="flex items-center gap-3">
              <span className="text-sm text-[var(--text)] w-40 shrink-0">{item.type}</span>
              <div className="flex-1 bg-[var(--bg)] rounded-full h-6 overflow-hidden">
                <div className={`${item.color} h-full rounded-full flex items-center justify-end pr-2 transition-all`} style={{ width: `${item.pct}%` }}>
                  <span className="text-xs text-white font-medium">{item.count.toLocaleString()}</span>
                </div>
              </div>
              <span className="text-xs text-[var(--text-secondary)] w-10 text-right">{item.pct}%</span>
            </div>
          ))}
        </div>
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
// Tab 6: Model Management
// ---------------------------------------------------------------------------
function ModelManagementTab() {
  const statusColors: Record<string, string> = {
    '운영중': 'bg-emerald-100 text-emerald-700',
    '대기': 'bg-amber-100 text-amber-700',
    '테스트': 'bg-blue-100 text-blue-700',
    '폐기': 'bg-gray-100 text-gray-500',
  };

  const statusDot: Record<string, string> = {
    '운영중': 'bg-emerald-500',
    '대기': 'bg-amber-500',
    '테스트': 'bg-blue-500',
    '폐기': 'bg-gray-400',
  };

  return (
    <div className="space-y-6">
      {/* 모델 버전 목록 */}
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Settings size={18} className="text-orange-600" />
            <h2 className="text-base font-semibold text-[var(--text)]">모델 버전 목록</h2>
          </div>
          <span className="text-xs text-[var(--text-secondary)]">총 {modelVersions.length}개 버전</span>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--border)]">
              <th className="text-left px-4 py-2.5 font-semibold text-[var(--text-secondary)]">엔진</th>
              <th className="text-left px-4 py-2.5 font-semibold text-[var(--text-secondary)]">버전</th>
              <th className="text-left px-4 py-2.5 font-semibold text-[var(--text-secondary)]">기반 모델</th>
              <th className="text-left px-4 py-2.5 font-semibold text-[var(--text-secondary)]">배포일</th>
              <th className="text-center px-4 py-2.5 font-semibold text-[var(--text-secondary)]">상태</th>
              <th className="text-left px-4 py-2.5 font-semibold text-[var(--text-secondary)]">성능 지표</th>
              <th className="text-center px-4 py-2.5 font-semibold text-[var(--text-secondary)]">액션</th>
            </tr>
          </thead>
          <tbody>
            {modelVersions.map((m, idx) => (
              <tr key={`${m.engine}-${m.version}`} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--bg)] transition-colors">
                <td className="px-4 py-3 text-[var(--text)] font-medium whitespace-nowrap">{m.engine}</td>
                <td className="px-4 py-3">
                  <span className="font-mono text-xs bg-orange-50 text-orange-700 px-2 py-0.5 rounded">{m.version}</span>
                </td>
                <td className="px-4 py-3 text-[var(--text-secondary)] text-xs">{m.baseModel}</td>
                <td className="px-4 py-3 text-[var(--text-secondary)] text-xs whitespace-nowrap">{m.deployedAt}</td>
                <td className="px-4 py-3 text-center">
                  <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-0.5 rounded-full font-medium ${statusColors[m.status] ?? 'bg-gray-100 text-gray-700'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${statusDot[m.status] ?? 'bg-gray-400'}`} />
                    {m.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${m.accuracy >= 90 ? 'bg-emerald-500' : m.accuracy >= 70 ? 'bg-blue-500' : m.accuracy >= 50 ? 'bg-amber-500' : 'bg-orange-500'}`}
                        style={{ width: `${Math.min(m.accuracy, 100)}%` }}
                      />
                    </div>
                    <span className="text-xs font-mono text-[var(--text)]">{m.accuracy}%</span>
                    <span className="text-xs text-[var(--text-secondary)]">{m.metricLabel}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-center">
                  <div className="flex items-center justify-center gap-1">
                    {m.status === '운영중' && (
                      <button onClick={() => alert(`${m.engine} ${m.version} 롤백을 진행합니다.`)} className="h-[38px] px-2.5 text-xs text-gray-500 hover:text-orange-600 transition-colors" title="롤백">
                        <RotateCcw size={14} />
                      </button>
                    )}
                    {m.status === '대기' && (
                      <button onClick={() => alert(`${m.engine} ${m.version} 배포를 시작합니다.`)} className="h-[38px] px-2.5 text-xs text-blue-600 hover:text-blue-700 transition-colors" title="배포">
                        <Rocket size={14} />
                      </button>
                    )}
                    {m.status === '테스트' && (
                      <button onClick={() => alert(`${m.engine} ${m.version}을 운영 환경으로 승격합니다.`)} className="h-[38px] px-2.5 text-xs text-emerald-600 hover:text-emerald-700 transition-colors" title="승격">
                        <Play size={14} />
                      </button>
                    )}
                    {m.status === '폐기' && (
                      <span className="text-xs text-gray-300">-</span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* A/B 테스트 현황 */}
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <GitBranch size={18} className="text-orange-600" />
          <h2 className="text-base font-semibold text-[var(--text)]">A/B 테스트 현황</h2>
        </div>
        <div className="border border-[var(--border)] rounded-lg p-5 bg-[var(--bg)]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-[var(--text)]">추천 엔진 v2.3.1 vs v2.4.0-beta</h3>
              <p className="text-xs text-[var(--text-secondary)] mt-1">2026-03-28 시작 -- 진행중</p>
            </div>
            <span className="inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full font-medium bg-blue-100 text-blue-700">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
              진행중
            </span>
          </div>

          {/* Traffic Split */}
          <div className="mb-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-[var(--text-secondary)]">트래픽 분배</span>
            </div>
            <div className="flex h-3 rounded-full overflow-hidden">
              <div className="bg-blue-500 flex items-center justify-center" style={{ width: '80%' }}>
                <span className="text-[10px] text-white font-medium">Control 80%</span>
              </div>
              <div className="bg-orange-500 flex items-center justify-center" style={{ width: '20%' }}>
                <span className="text-[10px] text-white font-medium">Test 20%</span>
              </div>
            </div>
          </div>

          {/* Metrics Comparison */}
          <div className="grid grid-cols-3 gap-4">
            <div className="border border-[var(--border)] rounded-lg p-3 bg-[var(--bg-card)]">
              <div className="text-xs text-[var(--text-secondary)] mb-2">CTR</div>
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-xs text-[var(--text-secondary)]">Control (v2.3.1)</div>
                  <div className="text-sm font-bold text-[var(--text)]">18.5%</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-[var(--text-secondary)]">Test (v2.4.0-beta)</div>
                  <div className="text-sm font-bold text-emerald-600">19.2%</div>
                </div>
              </div>
              <div className="flex items-center gap-1 mt-1">
                <ArrowUpRight size={12} className="text-emerald-600" />
                <span className="text-xs text-emerald-600 font-medium">+0.7%p</span>
              </div>
            </div>
            <div className="border border-[var(--border)] rounded-lg p-3 bg-[var(--bg-card)]">
              <div className="text-xs text-[var(--text-secondary)] mb-2">평균 응답시간</div>
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-xs text-[var(--text-secondary)]">Control</div>
                  <div className="text-sm font-bold text-[var(--text)]">1.2s</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-[var(--text-secondary)]">Test</div>
                  <div className="text-sm font-bold text-amber-600">1.4s</div>
                </div>
              </div>
              <div className="flex items-center gap-1 mt-1">
                <ArrowUpRight size={12} className="text-amber-600" />
                <span className="text-xs text-amber-600 font-medium">+0.2s</span>
              </div>
            </div>
            <div className="border border-[var(--border)] rounded-lg p-3 bg-[var(--bg-card)]">
              <div className="text-xs text-[var(--text-secondary)] mb-2">호출당 비용</div>
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-xs text-[var(--text-secondary)]">Control</div>
                  <div className="text-sm font-bold text-[var(--text)]">$0.072</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-[var(--text-secondary)]">Test</div>
                  <div className="text-sm font-bold text-amber-600">$0.085</div>
                </div>
              </div>
              <div className="flex items-center gap-1 mt-1">
                <ArrowUpRight size={12} className="text-amber-600" />
                <span className="text-xs text-amber-600 font-medium">+18.1%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 모델 배포 이력 */}
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <History size={18} className="text-orange-600" />
          <h2 className="text-base font-semibold text-[var(--text)]">모델 배포 이력</h2>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--border)]">
              <th className="text-left px-4 py-2.5 font-semibold text-[var(--text-secondary)]">엔진</th>
              <th className="text-left px-4 py-2.5 font-semibold text-[var(--text-secondary)]">버전</th>
              <th className="text-left px-4 py-2.5 font-semibold text-[var(--text-secondary)]">배포일</th>
              <th className="text-left px-4 py-2.5 font-semibold text-[var(--text-secondary)]">배포자</th>
              <th className="text-center px-4 py-2.5 font-semibold text-[var(--text-secondary)]">롤백 여부</th>
              <th className="text-right px-4 py-2.5 font-semibold text-[var(--text-secondary)]">소요시간</th>
            </tr>
          </thead>
          <tbody>
            {deploymentHistory.map((d, idx) => (
              <tr key={`${d.engine}-${d.version}-${idx}`} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--bg)] transition-colors">
                <td className="px-4 py-3 text-[var(--text)] font-medium whitespace-nowrap">{d.engine}</td>
                <td className="px-4 py-3">
                  <span className="font-mono text-xs bg-orange-50 text-orange-700 px-2 py-0.5 rounded">{d.version}</span>
                </td>
                <td className="px-4 py-3 text-[var(--text-secondary)] text-xs whitespace-nowrap">{d.deployedAt}</td>
                <td className="px-4 py-3 text-[var(--text)]">{d.deployer}</td>
                <td className="px-4 py-3 text-center">
                  {d.rollback ? (
                    <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-700 font-medium">
                      <RotateCcw size={10} />
                      롤백
                    </span>
                  ) : (
                    <span className="text-xs text-gray-400">-</span>
                  )}
                </td>
                <td className="px-4 py-3 text-right font-mono text-xs text-[var(--text)]">{d.duration}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 배포 스케줄 */}
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Calendar size={18} className="text-orange-600" />
          <h2 className="text-base font-semibold text-[var(--text)]">배포 스케줄</h2>
        </div>
        <div className="border border-dashed border-[var(--border)] rounded-lg p-5 bg-[var(--bg)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center">
                <Rocket size={22} className="text-orange-600" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-[var(--text)]">예측 엔진 v1.9.0</h3>
                <p className="text-xs text-[var(--text-secondary)] mt-0.5">Claude 3.5 Sonnet -- 소모량 예측 정확도 개선</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-bold text-[var(--text)]">2026-04-07 10:00</div>
              <div className="text-xs text-[var(--text-secondary)] mt-0.5">배포자: 김운영</div>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-3">
            <div className="flex-1 bg-[var(--bg-card)] rounded-full h-2 overflow-hidden">
              <div className="h-full rounded-full bg-orange-500" style={{ width: '60%' }} />
            </div>
            <span className="text-xs text-[var(--text-secondary)]">테스트 진행률 60%</span>
          </div>
          <div className="mt-3 flex gap-2">
            <button onClick={() => alert('A/B 테스트 스케줄 수정 화면으로 이동합니다.')} className="h-[38px] px-4 text-xs font-medium rounded-lg border border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--bg-card)] transition-colors">
              스케줄 수정
            </button>
            <button onClick={() => alert('즉시 배포를 시작합니다.')} className="h-[38px] px-4 text-xs font-medium rounded-lg bg-orange-600 text-white hover:bg-orange-700 transition-colors">
              즉시 배포
            </button>
          </div>
        </div>
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
      {aiMonitorTab === '모델 관리' && <ModelManagementTab />}
    </div>
  );
}
