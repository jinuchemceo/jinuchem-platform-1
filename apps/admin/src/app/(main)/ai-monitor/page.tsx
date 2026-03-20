'use client';

import {
  Sparkles,
  TrendingUp,
  FileBarChart,
  GitBranch,
  ArrowUpRight,
} from 'lucide-react';

const aiStats = [
  { label: '추천 생성', value: '1,234건', change: '+12%', icon: <Sparkles size={20} /> },
  { label: '예측 생성', value: '456건', change: '+8%', icon: <TrendingUp size={20} /> },
  { label: '분석 리포트', value: '89건', change: '+15%', icon: <FileBarChart size={20} /> },
  { label: '지식 그래프 노드', value: '2,345개', change: '+145', icon: <GitBranch size={20} /> },
];

const recentGenerations = [
  { id: 1, type: '추천', target: '서울대 화학과 김연구', input: '구매이력 기반 시약 추천', tokens: 2340, latency: '1.2s', time: '10:15' },
  { id: 2, type: '예측', target: 'KAIST 생명공학과', input: '2분기 소모량 예측', tokens: 3100, latency: '2.1s', time: '09:48' },
  { id: 3, type: '분석', target: '연세대 약학과', input: '구매 패턴 분석 리포트', tokens: 5420, latency: '3.8s', time: '09:30' },
  { id: 4, type: '추천', target: 'POSTECH 화학공학과 정화학', input: '대체시약 추천', tokens: 1890, latency: '0.9s', time: '09:22' },
  { id: 5, type: '지식그래프', target: 'System', input: 'Acetone 관계 노드 생성', tokens: 4200, latency: '2.5s', time: '09:00' },
  { id: 6, type: '예측', target: '고려대 신소재공학부', input: '재주문 시점 예측', tokens: 2780, latency: '1.7s', time: '08:45' },
  { id: 7, type: '추천', target: 'KAIST 생명공학과 박실험', input: '실험 프로토콜 기반 추천', tokens: 3050, latency: '1.5s', time: '08:30' },
];

const typeColors: Record<string, string> = {
  추천: 'bg-blue-100 text-blue-700',
  예측: 'bg-purple-100 text-purple-700',
  분석: 'bg-emerald-100 text-emerald-700',
  지식그래프: 'bg-amber-100 text-amber-700',
};

export default function AiMonitorPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--text)]">AI 모니터링</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">AI 엔진 (Claude API) 운영 현황</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-4 gap-4">
        {aiStats.map((stat) => (
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
            <div className="text-xs text-[var(--text-secondary)] mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Recommendation Accuracy */}
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5">
          <h2 className="text-base font-semibold text-[var(--text)] mb-4">추천 엔진 성능</h2>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-[var(--text-secondary)]">추천 CTR (Click-Through Rate)</span>
                <span className="text-sm font-bold text-[var(--text)]">18.5%</span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-orange-500 rounded-full" style={{ width: '18.5%' }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-[var(--text-secondary)]">대체시약 채택률</span>
                <span className="text-sm font-bold text-[var(--text)]">32%</span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '32%' }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-[var(--text-secondary)]">재구매 추천 정확도</span>
                <span className="text-sm font-bold text-[var(--text)]">74.2%</span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: '74.2%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Prediction Accuracy */}
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5">
          <h2 className="text-base font-semibold text-[var(--text)] mb-4">예측 엔진 성능</h2>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-[var(--text-secondary)]">소모량 MAPE (평균 절대 백분위 오차)</span>
                <span className="text-sm font-bold text-[var(--text)]">15.2%</span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-purple-500 rounded-full" style={{ width: '84.8%' }} />
              </div>
              <p className="text-xs text-[var(--text-secondary)] mt-1">목표: 20% 이하 (달성)</p>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-[var(--text-secondary)]">예산 예측 정확도</span>
                <span className="text-sm font-bold text-[var(--text)]">87%</span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: '87%' }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-[var(--text-secondary)]">재주문 시점 정확도</span>
                <span className="text-sm font-bold text-[var(--text)]">69.5%</span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-teal-500 rounded-full" style={{ width: '69.5%' }} />
              </div>
            </div>
          </div>
        </div>
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
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${typeColors[gen.type] || ''}`}>
                    {gen.type}
                  </span>
                </td>
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
          <div className="p-4 bg-[var(--bg)] rounded-lg">
            <div className="text-xs text-[var(--text-secondary)] mb-1">추천 엔진</div>
            <div className="text-sm font-bold text-[var(--text)]">v2.3.1</div>
            <div className="text-xs text-[var(--text-secondary)] mt-1">2026-03-15 배포</div>
          </div>
          <div className="p-4 bg-[var(--bg)] rounded-lg">
            <div className="text-xs text-[var(--text-secondary)] mb-1">예측 엔진</div>
            <div className="text-sm font-bold text-[var(--text)]">v1.8.0</div>
            <div className="text-xs text-[var(--text-secondary)] mt-1">2026-03-10 배포</div>
          </div>
          <div className="p-4 bg-[var(--bg)] rounded-lg">
            <div className="text-xs text-[var(--text-secondary)] mb-1">분석 엔진</div>
            <div className="text-sm font-bold text-[var(--text)]">v1.5.2</div>
            <div className="text-xs text-[var(--text-secondary)] mt-1">2026-03-08 배포</div>
          </div>
          <div className="p-4 bg-[var(--bg)] rounded-lg">
            <div className="text-xs text-[var(--text-secondary)] mb-1">지식 그래프</div>
            <div className="text-sm font-bold text-[var(--text)]">v1.2.0</div>
            <div className="text-xs text-[var(--text-secondary)] mt-1">2026-03-01 배포</div>
          </div>
        </div>
      </div>
    </div>
  );
}
