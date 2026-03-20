'use client';

import {
  Building2,
  KeyRound,
  Activity,
  AlertCircle,
  Plus,
  ArrowUpRight,
  MoreHorizontal,
} from 'lucide-react';

const apiStats = [
  { label: '등록 기관', value: '23개', change: '+3', icon: <Building2 size={20} /> },
  { label: '활성 Key', value: '31개', change: '+5', icon: <KeyRound size={20} /> },
  { label: '오늘 호출', value: '4,567건', change: '+12%', icon: <Activity size={20} /> },
  { label: '에러율', value: '0.3%', change: '-0.1%', icon: <AlertCircle size={20} /> },
];

const apiKeys = [
  { id: 1, org: '서울대학교 화학과', keyPreview: 'jk_live_snu...8f3a', tier: 'Pro', dailyUsage: 1250, dailyLimit: 5000, status: '활성', created: '2026-01-15' },
  { id: 2, org: 'KAIST 생명공학과', keyPreview: 'jk_live_kai...2b7c', tier: 'Basic', dailyUsage: 340, dailyLimit: 1000, status: '활성', created: '2026-02-01' },
  { id: 3, org: '연세대학교 약학과', keyPreview: 'jk_live_yon...9d4e', tier: 'Pro', dailyUsage: 890, dailyLimit: 5000, status: '활성', created: '2026-01-20' },
  { id: 4, org: 'POSTECH 화학공학과', keyPreview: 'jk_live_pos...1a6f', tier: 'Enterprise', dailyUsage: 2100, dailyLimit: 50000, status: '활성', created: '2025-12-10' },
  { id: 5, org: '고려대학교 신소재공학부', keyPreview: 'jk_live_kor...5c8d', tier: 'Basic', dailyUsage: 120, dailyLimit: 1000, status: '활성', created: '2026-02-15' },
  { id: 6, org: '(주)바이오텍연구소', keyPreview: 'jk_live_bio...3e2a', tier: 'Free', dailyUsage: 45, dailyLimit: 100, status: '활성', created: '2026-03-01' },
  { id: 7, org: '한양대학교 화학과', keyPreview: 'jk_live_hyu...7b1c', tier: 'Basic', dailyUsage: 0, dailyLimit: 1000, status: '비활성', created: '2026-01-05' },
  { id: 8, org: '성균관대학교 약학과', keyPreview: 'jk_live_skk...4d9f', tier: 'Pro', dailyUsage: 670, dailyLimit: 5000, status: '활성', created: '2026-02-20' },
];

const tierColors: Record<string, string> = {
  Free: 'bg-gray-100 text-gray-600',
  Basic: 'bg-blue-100 text-blue-700',
  Pro: 'bg-purple-100 text-purple-700',
  Enterprise: 'bg-orange-100 text-orange-700',
};

const rateLimits = [
  { tier: 'Free', daily: '100', ratePerMin: '10', endpoints: '기본 4개', price: '무료' },
  { tier: 'Basic', daily: '1,000', ratePerMin: '30', endpoints: '8개', price: '\u20a950,000/월' },
  { tier: 'Pro', daily: '5,000', ratePerMin: '100', endpoints: '12개 (전체)', price: '\u20a9200,000/월' },
  { tier: 'Enterprise', daily: '50,000', ratePerMin: '500', endpoints: '12개 + 커스텀', price: '별도 협의' },
];

export default function ApiManagementPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text)]">API 관리</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">외부 API v1 운영 현황</p>
        </div>
        <button className="h-[var(--btn-height)] px-4 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors flex items-center gap-2">
          <Plus size={16} />
          Key 발급
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-4 gap-4">
        {apiStats.map((stat) => (
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

      {/* API Key Table */}
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-[var(--border)]">
          <h2 className="text-base font-semibold text-[var(--text)]">API Key 목록</h2>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[var(--bg)] border-b border-[var(--border)]">
              <th className="text-left px-5 py-3 font-semibold text-[var(--text-secondary)]">기관명</th>
              <th className="text-left px-5 py-3 font-semibold text-[var(--text-secondary)]">API Key</th>
              <th className="text-left px-5 py-3 font-semibold text-[var(--text-secondary)]">Tier</th>
              <th className="text-left px-5 py-3 font-semibold text-[var(--text-secondary)]">일일 사용량</th>
              <th className="text-left px-5 py-3 font-semibold text-[var(--text-secondary)]">상태</th>
              <th className="text-left px-5 py-3 font-semibold text-[var(--text-secondary)]">발급일</th>
              <th className="text-center px-5 py-3 font-semibold text-[var(--text-secondary)]">관리</th>
            </tr>
          </thead>
          <tbody>
            {apiKeys.map((key) => {
              const usagePercent = (key.dailyUsage / key.dailyLimit) * 100;
              return (
                <tr key={key.id} className="border-b border-[var(--border)] hover:bg-[var(--bg)] transition-colors">
                  <td className="px-5 py-3.5 font-medium text-[var(--text)]">{key.org}</td>
                  <td className="px-5 py-3.5 font-mono text-xs text-[var(--text-secondary)]">{key.keyPreview}</td>
                  <td className="px-5 py-3.5">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${tierColors[key.tier]}`}>
                      {key.tier}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${usagePercent > 80 ? 'bg-red-500' : usagePercent > 50 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                          style={{ width: `${Math.min(usagePercent, 100)}%` }}
                        />
                      </div>
                      <span className="text-xs text-[var(--text-secondary)]">
                        {key.dailyUsage.toLocaleString()}/{key.dailyLimit.toLocaleString()}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      key.status === '활성' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {key.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-[var(--text-secondary)]">{key.created}</td>
                  <td className="px-5 py-3.5 text-center">
                    <button className="w-8 h-8 flex items-center justify-center rounded-lg text-[var(--text-secondary)] hover:bg-gray-100 transition-colors mx-auto">
                      <MoreHorizontal size={16} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Top Endpoints */}
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5">
          <h2 className="text-base font-semibold text-[var(--text)] mb-4">인기 엔드포인트</h2>
          <div className="h-48 bg-[var(--bg)] rounded-lg flex items-center justify-center border border-dashed border-[var(--border)]">
            <span className="text-sm text-[var(--text-secondary)]">차트 영역 (엔드포인트별 호출량 그래프)</span>
          </div>
        </div>

        {/* Rate Limit Settings */}
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5">
          <h2 className="text-base font-semibold text-[var(--text)] mb-4">Tier별 Rate Limit 설정</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th className="text-left py-2.5 font-semibold text-[var(--text-secondary)]">Tier</th>
                <th className="text-right py-2.5 font-semibold text-[var(--text-secondary)]">일일 한도</th>
                <th className="text-right py-2.5 font-semibold text-[var(--text-secondary)]">분당</th>
                <th className="text-right py-2.5 font-semibold text-[var(--text-secondary)]">가격</th>
              </tr>
            </thead>
            <tbody>
              {rateLimits.map((tier) => (
                <tr key={tier.tier} className="border-b border-[var(--border)] last:border-0">
                  <td className="py-2.5">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${tierColors[tier.tier]}`}>
                      {tier.tier}
                    </span>
                  </td>
                  <td className="py-2.5 text-right text-[var(--text)]">{tier.daily}</td>
                  <td className="py-2.5 text-right text-[var(--text)]">{tier.ratePerMin}</td>
                  <td className="py-2.5 text-right text-[var(--text-secondary)]">{tier.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
