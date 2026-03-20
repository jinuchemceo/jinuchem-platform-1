'use client';

import { useState } from 'react';
import { Plus, Copy, Check, Eye, EyeOff, MoreHorizontal } from 'lucide-react';

const apiKeys = [
  { id: 1, name: '프로덕션 Key', keyPreview: 'jk_live_snu...8f3a', tier: 'Pro', created: '2026-01-15', lastUsed: '2026-03-20 09:15', status: '활성' },
  { id: 2, name: '테스트 Key', keyPreview: 'jk_test_dev...2b7c', tier: 'Free', created: '2026-02-01', lastUsed: '2026-03-19 17:30', status: '활성' },
  { id: 3, name: '스테이징 Key', keyPreview: 'jk_live_stg...9d4e', tier: 'Basic', created: '2026-02-15', lastUsed: '2026-03-18 14:20', status: '비활성' },
];

const tierComparison = [
  { tier: 'Free', daily: '100', ratePerMin: '10', endpoints: '기본 4개', support: '커뮤니티', price: '무료' },
  { tier: 'Basic', daily: '1,000', ratePerMin: '30', endpoints: '8개', support: '이메일', price: '\u20a950,000/월' },
  { tier: 'Pro', daily: '5,000', ratePerMin: '100', endpoints: '12개 (전체)', support: '우선 지원', price: '\u20a9200,000/월' },
  { tier: 'Enterprise', daily: '50,000', ratePerMin: '500', endpoints: '12개 + 커스텀', support: '전담 매니저', price: '별도 협의' },
];

const tierColors: Record<string, string> = {
  Free: 'bg-gray-100 text-gray-600',
  Basic: 'bg-blue-100 text-blue-700',
  Pro: 'bg-purple-100 text-purple-700',
  Enterprise: 'bg-orange-100 text-orange-700',
};

export default function KeysPage() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text)]">API Keys</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">API Key 관리 및 발급</p>
        </div>
        <button className="h-[var(--btn-height)] px-4 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-2">
          <Plus size={16} />
          새 API Key 발급
        </button>
      </div>

      {/* Current Keys */}
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-[var(--border)]">
          <h2 className="text-base font-semibold text-[var(--text)]">내 API Keys</h2>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[var(--bg)] border-b border-[var(--border)]">
              <th className="text-left px-5 py-3 font-semibold text-[var(--text-secondary)]">이름</th>
              <th className="text-left px-5 py-3 font-semibold text-[var(--text-secondary)]">API Key</th>
              <th className="text-left px-5 py-3 font-semibold text-[var(--text-secondary)]">Tier</th>
              <th className="text-left px-5 py-3 font-semibold text-[var(--text-secondary)]">발급일</th>
              <th className="text-left px-5 py-3 font-semibold text-[var(--text-secondary)]">마지막 사용</th>
              <th className="text-left px-5 py-3 font-semibold text-[var(--text-secondary)]">상태</th>
              <th className="text-center px-5 py-3 font-semibold text-[var(--text-secondary)]">관리</th>
            </tr>
          </thead>
          <tbody>
            {apiKeys.map((key) => (
              <tr key={key.id} className="border-b border-[var(--border)] hover:bg-[var(--bg)] transition-colors">
                <td className="px-5 py-3.5 font-medium text-[var(--text)]">{key.name}</td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2">
                    <code className="font-mono text-xs text-[var(--text-secondary)] bg-[var(--bg)] px-2 py-1 rounded">
                      {key.keyPreview}
                    </code>
                    <button
                      onClick={handleCopy}
                      className="w-7 h-7 flex items-center justify-center rounded text-[var(--text-secondary)] hover:bg-gray-100 transition-colors"
                    >
                      {copied ? <Check size={14} /> : <Copy size={14} />}
                    </button>
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${tierColors[key.tier]}`}>
                    {key.tier}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-[var(--text-secondary)]">{key.created}</td>
                <td className="px-5 py-3.5 text-[var(--text-secondary)]">{key.lastUsed}</td>
                <td className="px-5 py-3.5">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    key.status === '활성' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {key.status}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-center">
                  <button className="w-8 h-8 flex items-center justify-center rounded-lg text-[var(--text-secondary)] hover:bg-gray-100 transition-colors mx-auto">
                    <MoreHorizontal size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Tier Comparison */}
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5">
        <h2 className="text-base font-semibold text-[var(--text)] mb-4">Tier 비교</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--border)]">
              <th className="text-left px-4 py-3 font-semibold text-[var(--text-secondary)]">Tier</th>
              <th className="text-center px-4 py-3 font-semibold text-[var(--text-secondary)]">일일 한도</th>
              <th className="text-center px-4 py-3 font-semibold text-[var(--text-secondary)]">분당 제한</th>
              <th className="text-center px-4 py-3 font-semibold text-[var(--text-secondary)]">엔드포인트</th>
              <th className="text-center px-4 py-3 font-semibold text-[var(--text-secondary)]">지원</th>
              <th className="text-right px-4 py-3 font-semibold text-[var(--text-secondary)]">가격</th>
            </tr>
          </thead>
          <tbody>
            {tierComparison.map((tier) => (
              <tr key={tier.tier} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--bg)] transition-colors">
                <td className="px-4 py-3.5">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${tierColors[tier.tier]}`}>
                    {tier.tier}
                  </span>
                </td>
                <td className="px-4 py-3.5 text-center text-[var(--text)] font-medium">{tier.daily}</td>
                <td className="px-4 py-3.5 text-center text-[var(--text)]">{tier.ratePerMin}</td>
                <td className="px-4 py-3.5 text-center text-[var(--text)]">{tier.endpoints}</td>
                <td className="px-4 py-3.5 text-center text-[var(--text-secondary)]">{tier.support}</td>
                <td className="px-4 py-3.5 text-right font-semibold text-[var(--text)]">{tier.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
