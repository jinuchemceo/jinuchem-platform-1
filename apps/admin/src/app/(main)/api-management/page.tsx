'use client';

import { useState, useMemo } from 'react';
import {
  Building2,
  KeyRound,
  Activity,
  AlertCircle,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  EyeOff,
  Copy,
  RefreshCw,
  Trash2,
  Search,
  Clock,
  XCircle,
  CheckCircle,
  Edit,
  Shield,
  Zap,
  X,
} from 'lucide-react';
import { AdminTabs } from '@/components/shared/AdminTabs';
import { Modal } from '@/components/shared/Modal';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Pagination } from '@/components/shared/Pagination';
import { StatCard } from '@/components/shared/StatCard';
import { ChartPlaceholder } from '@/components/shared/ChartPlaceholder';
import { FilterBar } from '@/components/shared/FilterBar';
import {
  mockApiKeys,
  mockEndpointUsage,
  mockApiErrors,
  mockRateLimits,
  mockCustomLimits,
} from '@/lib/admin-mock-data';
import { useAdminStore } from '@/stores/adminStore';

const TABS = [
  { id: 'API Key', label: 'API Key 관리' },
  { id: '사용량', label: '사용량 모니터링' },
  { id: '에러', label: '에러 로그' },
  { id: 'Rate Limit', label: 'Rate Limit 설정' },
];

const TIERS = ['전체', 'Free', 'Basic', 'Pro', 'Enterprise'] as const;
const STATUS_FILTERS = ['전체', '활성', '비활성'] as const;
const ERROR_CODE_FILTERS = ['전체', '400', '401', '403', '404', '429', '500', '502', '503'] as const;
const TIME_RANGES = ['1일', '1주', '1개월', '3개월'] as const;

const tierColors: Record<string, string> = {
  Free: 'bg-gray-100 text-gray-600',
  Basic: 'bg-blue-100 text-blue-700',
  Pro: 'bg-purple-100 text-purple-700',
  Enterprise: 'bg-orange-100 text-orange-700',
};

const SCOPE_LABELS: Record<string, string> = {
  products: '제품 API',
  prices: '가격 API',
  inventory: '재고 API',
  recommend: '추천 API',
  predict: '예측 API',
  analyze: '분석 API',
  knowledge: '지식그래프 API',
  batch: '배치 API',
};

const ALL_SCOPES = ['products', 'prices', 'recommend', 'analyze', 'knowledge'];

const KEYS_PER_PAGE = 6;
const ERRORS_PER_PAGE = 8;

export default function ApiManagementPage() {
  const { apiManagementTab, setApiManagementTab, openModal, closeModal, activeModal, modalData } = useAdminStore();

  // Tab 1 state
  const [keySearch, setKeySearch] = useState('');
  const [tierFilter, setTierFilter] = useState('전체');
  const [statusFilter, setStatusFilter] = useState('전체');
  const [keyPage, setKeyPage] = useState(1);
  const [revealedKey, setRevealedKey] = useState(false);

  // Tab 2 state
  const [timeRange, setTimeRange] = useState<string>('1주');

  // Tab 3 state
  const [errorSearch, setErrorSearch] = useState('');
  const [errorCodeFilter, setErrorCodeFilter] = useState('전체');
  const [errorPage, setErrorPage] = useState(1);

  // Tab 4 state
  const [editingTier, setEditingTier] = useState<string | null>(null);
  const [editedLimits, setEditedLimits] = useState<Record<string, { daily: string; ratePerMin: string; burst: string }>>({});

  // Issue modal state
  const [issueOrg, setIssueOrg] = useState('');
  const [issueTier, setIssueTier] = useState('Basic');
  const [issueScopes, setIssueScopes] = useState<string[]>(['products', 'prices']);
  const [issueExpiry, setIssueExpiry] = useState('90일');

  // Custom limit modal state
  const [customOrg, setCustomOrg] = useState('');
  const [customDaily, setCustomDaily] = useState('');
  const [customBurst, setCustomBurst] = useState('');
  const [customReason, setCustomReason] = useState('');

  // Filtered API keys
  const filteredKeys = useMemo(() => {
    return mockApiKeys.filter((k) => {
      if (keySearch && !k.org.toLowerCase().includes(keySearch.toLowerCase())) return false;
      if (tierFilter !== '전체' && k.tier !== tierFilter) return false;
      if (statusFilter !== '전체' && k.status !== statusFilter) return false;
      return true;
    });
  }, [keySearch, tierFilter, statusFilter]);

  const keyTotalPages = Math.ceil(filteredKeys.length / KEYS_PER_PAGE);
  const pagedKeys = filteredKeys.slice((keyPage - 1) * KEYS_PER_PAGE, keyPage * KEYS_PER_PAGE);

  // Filtered errors
  const filteredErrors = useMemo(() => {
    return mockApiErrors.filter((e) => {
      if (errorSearch && !e.endpoint.toLowerCase().includes(errorSearch.toLowerCase())) return false;
      if (errorCodeFilter !== '전체' && String(e.statusCode) !== errorCodeFilter) return false;
      return true;
    });
  }, [errorSearch, errorCodeFilter]);

  const errorTotalPages = Math.ceil(filteredErrors.length / ERRORS_PER_PAGE);
  const pagedErrors = filteredErrors.slice((errorPage - 1) * ERRORS_PER_PAGE, errorPage * ERRORS_PER_PAGE);

  // Error stats
  const todayErrors = mockApiErrors.filter((e) => e.timestamp.startsWith('2026-03-20'));
  const count4xx = todayErrors.filter((e) => e.statusCode >= 400 && e.statusCode < 500).length;
  const count5xx = todayErrors.filter((e) => e.statusCode >= 500).length;
  const avgLatency = todayErrors.length > 0 ? Math.round(todayErrors.reduce((s, e) => s + e.latency, 0) / todayErrors.length) : 0;

  const usagePercent = (usage: number, limit: number) => (limit > 0 ? (usage / limit) * 100 : 0);

  const usageBarColor = (pct: number) =>
    pct > 80 ? 'bg-red-500' : pct > 50 ? 'bg-amber-500' : 'bg-emerald-500';

  const handleCopyKey = () => {
    navigator.clipboard.writeText('jk_live_full_key_example_1234567890abcdef');
  };

  // Toggle scope for issue modal
  const toggleIssueScope = (scope: string) => {
    setIssueScopes((prev) => (prev.includes(scope) ? prev.filter((s) => s !== scope) : [...prev, scope]));
  };

  // Start inline editing for rate limit
  const startEditTier = (tier: string) => {
    const row = mockRateLimits.find((r) => r.tier === tier);
    if (row) {
      setEditedLimits((prev) => ({
        ...prev,
        [tier]: { daily: row.daily, ratePerMin: row.ratePerMin, burst: row.burst },
      }));
      setEditingTier(tier);
    }
  };

  const cancelEditTier = () => {
    setEditingTier(null);
  };

  const saveEditTier = () => {
    // Mock save
    setEditingTier(null);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text)]">API 관리</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">외부 API v1 운영 현황</p>
        </div>
      </div>

      {/* Tabs */}
      <AdminTabs tabs={TABS} activeTab={apiManagementTab} onTabChange={setApiManagementTab} />

      {/* ================================================================ */}
      {/* Tab 1: API Key 관리 */}
      {/* ================================================================ */}
      {apiManagementTab === 'API Key' && (
        <div className="space-y-6">
          {/* Stat Cards */}
          <div className="grid grid-cols-4 gap-4">
            <StatCard icon={<Building2 size={20} />} label="등록 기관" value="23개" change="+3" up />
            <StatCard icon={<KeyRound size={20} />} label="활성 Key" value="31개" change="+5" up />
            <StatCard icon={<Activity size={20} />} label="오늘 호출" value="4,567건" change="+12%" up />
            <StatCard icon={<AlertCircle size={20} />} label="에러율" value="0.3%" change="-0.1%" up />
          </div>

          {/* Filters + Issue Button */}
          <FilterBar searchValue={keySearch} onSearchChange={(v) => { setKeySearch(v); setKeyPage(1); }} searchPlaceholder="기관명으로 검색...">
            {/* Tier pills */}
            <div className="flex items-center gap-1.5">
              {TIERS.map((t) => (
                <button
                  key={t}
                  onClick={() => { setTierFilter(t); setKeyPage(1); }}
                  className={`h-[var(--btn-height)] px-3 text-xs font-medium rounded-full transition-colors ${
                    tierFilter === t
                      ? 'bg-orange-600 text-white'
                      : 'bg-[var(--bg)] border border-[var(--border)] text-[var(--text-secondary)] hover:bg-gray-100'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Status filter */}
            <div className="flex items-center gap-1.5">
              {STATUS_FILTERS.map((s) => (
                <button
                  key={s}
                  onClick={() => { setStatusFilter(s); setKeyPage(1); }}
                  className={`h-[var(--btn-height)] px-3 text-xs font-medium rounded-full transition-colors ${
                    statusFilter === s
                      ? 'bg-gray-900 text-white'
                      : 'bg-[var(--bg)] border border-[var(--border)] text-[var(--text-secondary)] hover:bg-gray-100'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>

            {/* Issue button */}
            <button
              onClick={() => { setIssueOrg(''); setIssueTier('Basic'); setIssueScopes(['products', 'prices']); setIssueExpiry('90일'); openModal('keyIssue'); }}
              className="h-[var(--btn-height)] px-4 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors flex items-center gap-2 ml-auto"
            >
              <Plus size={16} />
              Key 발급
            </button>
          </FilterBar>

          {/* API Key Table */}
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[var(--bg)] border-b border-[var(--border)]">
                  <th className="text-left px-5 py-3 font-semibold text-[var(--text-secondary)]">기관명</th>
                  <th className="text-left px-5 py-3 font-semibold text-[var(--text-secondary)]">API Key</th>
                  <th className="text-left px-5 py-3 font-semibold text-[var(--text-secondary)]">Tier</th>
                  <th className="text-left px-5 py-3 font-semibold text-[var(--text-secondary)]">일일 사용량</th>
                  <th className="text-left px-5 py-3 font-semibold text-[var(--text-secondary)]">Scopes</th>
                  <th className="text-left px-5 py-3 font-semibold text-[var(--text-secondary)]">상태</th>
                  <th className="text-left px-5 py-3 font-semibold text-[var(--text-secondary)]">발급일</th>
                  <th className="text-center px-5 py-3 font-semibold text-[var(--text-secondary)]">관리</th>
                </tr>
              </thead>
              <tbody>
                {pagedKeys.map((key) => {
                  const pct = usagePercent(key.dailyUsage, key.dailyLimit);
                  return (
                    <tr key={key.id} className="border-b border-[var(--border)] hover:bg-[var(--bg)] transition-colors">
                      <td className="px-5 py-3.5 font-medium text-[var(--text)]">{key.org}</td>
                      <td className="px-5 py-3.5 font-mono text-xs text-[var(--text-secondary)]">{key.keyPreview}</td>
                      <td className="px-5 py-3.5">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${tierColors[key.tier]}`}>{key.tier}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${usageBarColor(pct)}`} style={{ width: `${Math.min(pct, 100)}%` }} />
                          </div>
                          <span className="text-xs text-[var(--text-secondary)] whitespace-nowrap">
                            {key.dailyUsage.toLocaleString()}/{key.dailyLimit.toLocaleString()} ({Math.round(pct)}%)
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-xs text-[var(--text-secondary)]">{key.scopes.length}개</td>
                      <td className="px-5 py-3.5">
                        <StatusBadge status={key.status} />
                      </td>
                      <td className="px-5 py-3.5 text-[var(--text-secondary)]">{key.created}</td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => { setRevealedKey(false); openModal('keyDetail', key); }}
                            className="w-8 h-8 flex items-center justify-center rounded-lg text-[var(--text-secondary)] hover:bg-gray-100 transition-colors"
                            title="상세보기"
                          >
                            <Eye size={16} />
                          </button>
                          <button className="w-8 h-8 flex items-center justify-center rounded-lg text-[var(--text-secondary)] hover:bg-gray-100 transition-colors" title="수정">
                            <Edit size={16} />
                          </button>
                          <button className="w-8 h-8 flex items-center justify-center rounded-lg text-red-400 hover:bg-red-50 transition-colors" title="삭제">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {pagedKeys.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-5 py-12 text-center text-[var(--text-secondary)]">검색 결과가 없습니다.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <Pagination currentPage={keyPage} totalPages={keyTotalPages} onPageChange={setKeyPage} />

          {/* Key Detail Modal */}
          <Modal isOpen={activeModal === 'keyDetail'} onClose={closeModal} title="API Key 상세" size="lg">
            {modalData && (
              <div className="space-y-5">
                {/* Header info */}
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-semibold text-[var(--text)]">{modalData.org}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${tierColors[modalData.tier]}`}>{modalData.tier}</span>
                  <StatusBadge status={modalData.status} />
                </div>

                {/* Full key */}
                <div className="bg-[var(--bg)] border border-[var(--border)] rounded-lg p-4">
                  <div className="text-xs text-[var(--text-secondary)] mb-2">API Key</div>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 text-sm font-mono text-[var(--text)] break-all">
                      {revealedKey ? 'jk_live_full_key_example_1234567890abcdef' : modalData.keyPreview}
                    </code>
                    <button onClick={() => setRevealedKey(!revealedKey)} className="w-8 h-8 flex items-center justify-center rounded-lg text-[var(--text-secondary)] hover:bg-gray-100 transition-colors">
                      {revealedKey ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                    <button onClick={handleCopyKey} className="w-8 h-8 flex items-center justify-center rounded-lg text-[var(--text-secondary)] hover:bg-gray-100 transition-colors">
                      <Copy size={16} />
                    </button>
                  </div>
                </div>

                {/* Scopes */}
                <div>
                  <div className="text-xs text-[var(--text-secondary)] mb-2">Scopes</div>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(SCOPE_LABELS).map(([key, label]) => (
                      <div key={key} className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full ${modalData.scopes.includes(key) ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-400'}`}>
                        {modalData.scopes.includes(key) ? <CheckCircle size={12} /> : <XCircle size={12} />}
                        {label}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Usage stats */}
                <div className="grid grid-cols-4 gap-4">
                  <div className="bg-[var(--bg)] rounded-lg p-3 text-center">
                    <div className="text-lg font-bold text-[var(--text)]">{modalData.dailyUsage.toLocaleString()}</div>
                    <div className="text-xs text-[var(--text-secondary)]">오늘 호출</div>
                  </div>
                  <div className="bg-[var(--bg)] rounded-lg p-3 text-center">
                    <div className="text-lg font-bold text-[var(--text)]">{(modalData.dailyUsage * 28).toLocaleString()}</div>
                    <div className="text-xs text-[var(--text-secondary)]">월간 호출</div>
                  </div>
                  <div className="bg-[var(--bg)] rounded-lg p-3 text-center">
                    <div className="text-lg font-bold text-[var(--text)]">{modalData.created}</div>
                    <div className="text-xs text-[var(--text-secondary)]">발급일</div>
                  </div>
                  <div className="bg-[var(--bg)] rounded-lg p-3 text-center">
                    <div className="text-lg font-bold text-[var(--text)] text-sm">{modalData.lastUsed}</div>
                    <div className="text-xs text-[var(--text-secondary)]">마지막 사용</div>
                  </div>
                </div>

                {/* Chart */}
                <ChartPlaceholder title="일별 사용량 추이" height="h-40" />

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 pt-3 border-t border-[var(--border)]">
                  <button className="h-[var(--btn-height)] px-4 bg-[var(--bg)] border border-[var(--border)] rounded-lg text-sm font-medium text-[var(--text)] hover:bg-gray-100 transition-colors flex items-center gap-2">
                    <RefreshCw size={14} />
                    Key 회전
                  </button>
                  <button className="h-[var(--btn-height)] px-4 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors flex items-center gap-2">
                    <Trash2 size={14} />
                    폐기
                  </button>
                </div>
              </div>
            )}
          </Modal>

          {/* Key Issue Modal */}
          <Modal isOpen={activeModal === 'keyIssue'} onClose={closeModal} title="API Key 발급" size="md">
            <div className="space-y-5">
              {/* Organization */}
              <div>
                <label className="block text-sm font-medium text-[var(--text)] mb-1.5">기관 선택</label>
                <select
                  value={issueOrg}
                  onChange={(e) => setIssueOrg(e.target.value)}
                  className="w-full h-[var(--btn-height)] px-3 text-sm bg-[var(--bg)] border border-[var(--border)] rounded-lg text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="">기관을 선택하세요</option>
                  {mockApiKeys.map((k) => (
                    <option key={k.id} value={k.org}>{k.org}</option>
                  ))}
                </select>
              </div>

              {/* Tier */}
              <div>
                <label className="block text-sm font-medium text-[var(--text)] mb-1.5">Tier</label>
                <select
                  value={issueTier}
                  onChange={(e) => setIssueTier(e.target.value)}
                  className="w-full h-[var(--btn-height)] px-3 text-sm bg-[var(--bg)] border border-[var(--border)] rounded-lg text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  {['Free', 'Basic', 'Pro', 'Enterprise'].map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              {/* Scopes */}
              <div>
                <label className="block text-sm font-medium text-[var(--text)] mb-1.5">Scopes</label>
                <div className="space-y-2">
                  {ALL_SCOPES.map((scope) => (
                    <label key={scope} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={issueScopes.includes(scope)}
                        onChange={() => toggleIssueScope(scope)}
                        className="w-4 h-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                      />
                      <span className="text-sm text-[var(--text)]">{SCOPE_LABELS[scope]}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Expiry */}
              <div>
                <label className="block text-sm font-medium text-[var(--text)] mb-1.5">유효기간</label>
                <select
                  value={issueExpiry}
                  onChange={(e) => setIssueExpiry(e.target.value)}
                  className="w-full h-[var(--btn-height)] px-3 text-sm bg-[var(--bg)] border border-[var(--border)] rounded-lg text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  {['30일', '90일', '1년', '무제한'].map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[var(--border)]">
                <button onClick={closeModal} className="h-[var(--btn-height)] px-4 bg-[var(--bg)] border border-[var(--border)] rounded-lg text-sm font-medium text-[var(--text)] hover:bg-gray-100 transition-colors">
                  취소
                </button>
                <button onClick={closeModal} className="h-[var(--btn-height)] px-4 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors flex items-center gap-2">
                  <KeyRound size={14} />
                  발급
                </button>
              </div>
            </div>
          </Modal>
        </div>
      )}

      {/* ================================================================ */}
      {/* Tab 2: 사용량 모니터링 */}
      {/* ================================================================ */}
      {apiManagementTab === '사용량' && (
        <div className="space-y-6">
          {/* Time range selector */}
          <div className="flex items-center gap-2">
            {TIME_RANGES.map((r) => (
              <button
                key={r}
                onClick={() => setTimeRange(r)}
                className={`h-[var(--btn-height)] px-4 text-sm font-medium rounded-full transition-colors ${
                  timeRange === r
                    ? 'bg-orange-600 text-white'
                    : 'bg-[var(--bg)] border border-[var(--border)] text-[var(--text-secondary)] hover:bg-gray-100'
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          {/* Chart */}
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5">
            <h2 className="text-base font-semibold text-[var(--text)] mb-4">API 호출량 추이</h2>
            <ChartPlaceholder title="API 호출량 추이" height="h-64" />
          </div>

          {/* Endpoint usage table */}
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-[var(--border)]">
              <h2 className="text-base font-semibold text-[var(--text)]">엔드포인트별 사용량</h2>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[var(--bg)] border-b border-[var(--border)]">
                  <th className="text-left px-5 py-3 font-semibold text-[var(--text-secondary)]">Endpoint</th>
                  <th className="text-left px-5 py-3 font-semibold text-[var(--text-secondary)]">Method</th>
                  <th className="text-right px-5 py-3 font-semibold text-[var(--text-secondary)]">Total Calls</th>
                  <th className="text-right px-5 py-3 font-semibold text-[var(--text-secondary)]">Avg Latency</th>
                  <th className="text-right px-5 py-3 font-semibold text-[var(--text-secondary)]">Error Rate</th>
                  <th className="text-center px-5 py-3 font-semibold text-[var(--text-secondary)]">Trend</th>
                </tr>
              </thead>
              <tbody>
                {mockEndpointUsage.map((ep) => (
                  <tr key={ep.endpoint} className="border-b border-[var(--border)] hover:bg-[var(--bg)] transition-colors">
                    <td className="px-5 py-3.5 font-mono text-xs text-[var(--text)]">{ep.endpoint}</td>
                    <td className="px-5 py-3.5">
                      <span className={`text-xs px-2 py-0.5 rounded font-medium ${ep.method === 'GET' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'}`}>
                        {ep.method}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right text-[var(--text)] font-medium">{ep.totalCalls.toLocaleString()}</td>
                    <td className="px-5 py-3.5 text-right text-[var(--text-secondary)]">{ep.avgLatency.toLocaleString()}ms</td>
                    <td className="px-5 py-3.5 text-right">
                      <span className={`font-medium ${ep.errorRate > 5 ? 'text-red-600' : ep.errorRate > 2 ? 'text-amber-600' : 'text-emerald-600'}`}>
                        {ep.errorRate}%
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <div className={`inline-flex items-center gap-1 text-xs font-medium ${ep.trend === '증가' ? 'text-emerald-600' : ep.trend === '감소' ? 'text-red-500' : 'text-[var(--text-secondary)]'}`}>
                        {ep.trend === '증가' ? <ArrowUpRight size={14} /> : ep.trend === '감소' ? <ArrowDownRight size={14} /> : null}
                        {ep.trend}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Top consumers table */}
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-[var(--border)]">
              <h2 className="text-base font-semibold text-[var(--text)]">Top 사용 기관</h2>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[var(--bg)] border-b border-[var(--border)]">
                  <th className="text-left px-5 py-3 font-semibold text-[var(--text-secondary)]">기관</th>
                  <th className="text-left px-5 py-3 font-semibold text-[var(--text-secondary)]">Tier</th>
                  <th className="text-right px-5 py-3 font-semibold text-[var(--text-secondary)]">오늘 호출</th>
                  <th className="text-right px-5 py-3 font-semibold text-[var(--text-secondary)]">이번달 호출</th>
                  <th className="text-left px-5 py-3 font-semibold text-[var(--text-secondary)]">한도 사용률</th>
                </tr>
              </thead>
              <tbody>
                {[...mockApiKeys].sort((a, b) => b.dailyUsage - a.dailyUsage).slice(0, 5).map((k) => {
                  const pct = usagePercent(k.dailyUsage, k.dailyLimit);
                  return (
                    <tr key={k.id} className="border-b border-[var(--border)] hover:bg-[var(--bg)] transition-colors">
                      <td className="px-5 py-3.5 font-medium text-[var(--text)]">{k.org}</td>
                      <td className="px-5 py-3.5">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${tierColors[k.tier]}`}>{k.tier}</span>
                      </td>
                      <td className="px-5 py-3.5 text-right text-[var(--text)] font-medium">{k.dailyUsage.toLocaleString()}</td>
                      <td className="px-5 py-3.5 text-right text-[var(--text-secondary)]">{(k.dailyUsage * 28).toLocaleString()}</td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${usageBarColor(pct)}`} style={{ width: `${Math.min(pct, 100)}%` }} />
                          </div>
                          <span className="text-xs text-[var(--text-secondary)]">{Math.round(pct)}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================================================================ */}
      {/* Tab 3: 에러 로그 */}
      {/* ================================================================ */}
      {apiManagementTab === '에러' && (
        <div className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-4 gap-4">
            <StatCard icon={<XCircle size={20} />} label="오늘 에러" value={`${todayErrors.length}건`} change="+2" up={false} />
            <StatCard icon={<Shield size={20} />} label="4xx 비율" value={`${count4xx}건`} change="-1" up />
            <StatCard icon={<AlertCircle size={20} />} label="5xx 비율" value={`${count5xx}건`} change="+1" up={false} />
            <StatCard icon={<Clock size={20} />} label="평균 응답시간" value={`${avgLatency.toLocaleString()}ms`} change="-12%" up />
          </div>

          {/* Filters */}
          <FilterBar searchValue={errorSearch} onSearchChange={(v) => { setErrorSearch(v); setErrorPage(1); }} searchPlaceholder="엔드포인트로 검색...">
            <div className="flex items-center gap-1.5 flex-wrap">
              {ERROR_CODE_FILTERS.map((code) => (
                <button
                  key={code}
                  onClick={() => { setErrorCodeFilter(code); setErrorPage(1); }}
                  className={`h-[var(--btn-height)] px-3 text-xs font-medium rounded-full transition-colors ${
                    errorCodeFilter === code
                      ? 'bg-orange-600 text-white'
                      : 'bg-[var(--bg)] border border-[var(--border)] text-[var(--text-secondary)] hover:bg-gray-100'
                  }`}
                >
                  {code}
                </button>
              ))}
            </div>
          </FilterBar>

          {/* Error log table */}
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[var(--bg)] border-b border-[var(--border)]">
                  <th className="text-left px-5 py-3 font-semibold text-[var(--text-secondary)]">시간</th>
                  <th className="text-left px-5 py-3 font-semibold text-[var(--text-secondary)]">기관</th>
                  <th className="text-left px-5 py-3 font-semibold text-[var(--text-secondary)]">Endpoint</th>
                  <th className="text-left px-5 py-3 font-semibold text-[var(--text-secondary)]">Method</th>
                  <th className="text-center px-5 py-3 font-semibold text-[var(--text-secondary)]">Status</th>
                  <th className="text-left px-5 py-3 font-semibold text-[var(--text-secondary)]">Error Message</th>
                  <th className="text-right px-5 py-3 font-semibold text-[var(--text-secondary)]">Latency</th>
                </tr>
              </thead>
              <tbody>
                {pagedErrors.map((err) => {
                  const is4xx = err.statusCode >= 400 && err.statusCode < 500;
                  const is5xx = err.statusCode >= 500;
                  return (
                    <tr key={err.id} className="border-b border-[var(--border)] hover:bg-[var(--bg)] transition-colors">
                      <td className="px-5 py-3.5 text-xs text-[var(--text-secondary)] whitespace-nowrap">{err.timestamp}</td>
                      <td className="px-5 py-3.5 text-[var(--text)] font-medium text-xs">{err.org}</td>
                      <td className="px-5 py-3.5 font-mono text-xs text-[var(--text-secondary)]">{err.endpoint}</td>
                      <td className="px-5 py-3.5">
                        <span className={`text-xs px-2 py-0.5 rounded font-medium ${err.method === 'GET' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'}`}>
                          {err.method}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-center">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${is5xx ? 'bg-red-100 text-red-700' : is4xx ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600'}`}>
                          {err.statusCode}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-xs text-[var(--text-secondary)] max-w-[300px] truncate" title={err.errorMessage}>{err.errorMessage}</td>
                      <td className="px-5 py-3.5 text-right text-xs text-[var(--text-secondary)]">{err.latency.toLocaleString()}ms</td>
                    </tr>
                  );
                })}
                {pagedErrors.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-5 py-12 text-center text-[var(--text-secondary)]">검색 결과가 없습니다.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <Pagination currentPage={errorPage} totalPages={errorTotalPages} onPageChange={setErrorPage} />
        </div>
      )}

      {/* ================================================================ */}
      {/* Tab 4: Rate Limit 설정 */}
      {/* ================================================================ */}
      {apiManagementTab === 'Rate Limit' && (
        <div className="space-y-6">
          {/* Tier rate limits table */}
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-[var(--border)]">
              <h2 className="text-base font-semibold text-[var(--text)]">Tier별 Rate Limit</h2>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[var(--bg)] border-b border-[var(--border)]">
                  <th className="text-left px-5 py-3 font-semibold text-[var(--text-secondary)]">Tier</th>
                  <th className="text-right px-5 py-3 font-semibold text-[var(--text-secondary)]">일일 한도</th>
                  <th className="text-right px-5 py-3 font-semibold text-[var(--text-secondary)]">분당 (Burst)</th>
                  <th className="text-left px-5 py-3 font-semibold text-[var(--text-secondary)]">Endpoints</th>
                  <th className="text-right px-5 py-3 font-semibold text-[var(--text-secondary)]">가격</th>
                  <th className="text-center px-5 py-3 font-semibold text-[var(--text-secondary)]">관리</th>
                </tr>
              </thead>
              <tbody>
                {mockRateLimits.map((rl) => {
                  const isEditing = editingTier === rl.tier;
                  const edited = editedLimits[rl.tier];
                  return (
                    <tr key={rl.tier} className="border-b border-[var(--border)] hover:bg-[var(--bg)] transition-colors">
                      <td className="px-5 py-3.5">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${tierColors[rl.tier]}`}>{rl.tier}</span>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        {isEditing ? (
                          <input
                            value={edited?.daily ?? rl.daily}
                            onChange={(e) => setEditedLimits((prev) => ({ ...prev, [rl.tier]: { ...prev[rl.tier], daily: e.target.value } }))}
                            className="w-24 h-8 px-2 text-sm text-right bg-[var(--bg)] border border-orange-400 rounded text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-orange-500"
                          />
                        ) : (
                          <span className="text-[var(--text)] font-medium">{rl.daily}</span>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        {isEditing ? (
                          <div className="flex items-center justify-end gap-1">
                            <input
                              value={edited?.ratePerMin ?? rl.ratePerMin}
                              onChange={(e) => setEditedLimits((prev) => ({ ...prev, [rl.tier]: { ...prev[rl.tier], ratePerMin: e.target.value } }))}
                              className="w-16 h-8 px-2 text-sm text-right bg-[var(--bg)] border border-orange-400 rounded text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                            <span className="text-[var(--text-secondary)] text-xs">/</span>
                            <input
                              value={edited?.burst ?? rl.burst}
                              onChange={(e) => setEditedLimits((prev) => ({ ...prev, [rl.tier]: { ...prev[rl.tier], burst: e.target.value } }))}
                              className="w-16 h-8 px-2 text-sm text-right bg-[var(--bg)] border border-orange-400 rounded text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                          </div>
                        ) : (
                          <span className="text-[var(--text)]">{rl.ratePerMin} / {rl.burst}</span>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-[var(--text-secondary)]">{rl.endpoints}</td>
                      <td className="px-5 py-3.5 text-right text-[var(--text-secondary)]">{rl.price}</td>
                      <td className="px-5 py-3.5 text-center">
                        {isEditing ? (
                          <div className="flex items-center justify-center gap-1">
                            <button onClick={saveEditTier} className="h-7 px-3 bg-orange-600 text-white text-xs rounded font-medium hover:bg-orange-700 transition-colors">저장</button>
                            <button onClick={cancelEditTier} className="h-7 px-3 bg-[var(--bg)] border border-[var(--border)] text-xs rounded font-medium text-[var(--text-secondary)] hover:bg-gray-100 transition-colors">취소</button>
                          </div>
                        ) : (
                          <button onClick={() => startEditTier(rl.tier)} className="w-8 h-8 flex items-center justify-center rounded-lg text-[var(--text-secondary)] hover:bg-gray-100 transition-colors mx-auto">
                            <Edit size={16} />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Custom overrides */}
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-[var(--border)] flex items-center justify-between">
              <h2 className="text-base font-semibold text-[var(--text)]">커스텀 Rate Limit 오버라이드</h2>
              <button
                onClick={() => { setCustomOrg(''); setCustomDaily(''); setCustomBurst(''); setCustomReason(''); openModal('customLimit'); }}
                className="h-[var(--btn-height)] px-4 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors flex items-center gap-2"
              >
                <Plus size={16} />
                커스텀 규칙 추가
              </button>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[var(--bg)] border-b border-[var(--border)]">
                  <th className="text-left px-5 py-3 font-semibold text-[var(--text-secondary)]">기관</th>
                  <th className="text-left px-5 py-3 font-semibold text-[var(--text-secondary)]">기본 Tier</th>
                  <th className="text-right px-5 py-3 font-semibold text-[var(--text-secondary)]">커스텀 일일 한도</th>
                  <th className="text-right px-5 py-3 font-semibold text-[var(--text-secondary)]">커스텀 Burst</th>
                  <th className="text-left px-5 py-3 font-semibold text-[var(--text-secondary)]">사유</th>
                  <th className="text-center px-5 py-3 font-semibold text-[var(--text-secondary)]">관리</th>
                </tr>
              </thead>
              <tbody>
                {mockCustomLimits.map((cl) => (
                  <tr key={cl.id} className="border-b border-[var(--border)] hover:bg-[var(--bg)] transition-colors">
                    <td className="px-5 py-3.5 font-medium text-[var(--text)]">{cl.org}</td>
                    <td className="px-5 py-3.5">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${tierColors[cl.tier] || 'bg-gray-100 text-gray-600'}`}>{cl.tier}</span>
                    </td>
                    <td className="px-5 py-3.5 text-right text-[var(--text)] font-medium">{cl.customDaily.toLocaleString()}</td>
                    <td className="px-5 py-3.5 text-right text-[var(--text)]">{cl.customBurst.toLocaleString()}</td>
                    <td className="px-5 py-3.5 text-xs text-[var(--text-secondary)] max-w-[280px] truncate" title={cl.reason}>{cl.reason}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => { setCustomOrg(cl.org); setCustomDaily(String(cl.customDaily)); setCustomBurst(String(cl.customBurst)); setCustomReason(cl.reason); openModal('customLimit'); }}
                          className="w-8 h-8 flex items-center justify-center rounded-lg text-[var(--text-secondary)] hover:bg-gray-100 transition-colors"
                        >
                          <Edit size={16} />
                        </button>
                        <button className="w-8 h-8 flex items-center justify-center rounded-lg text-red-400 hover:bg-red-50 transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {mockCustomLimits.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-5 py-12 text-center text-[var(--text-secondary)]">커스텀 규칙이 없습니다.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Custom Limit Modal */}
          <Modal isOpen={activeModal === 'customLimit'} onClose={closeModal} title="커스텀 Rate Limit 설정" size="md">
            <div className="space-y-5">
              {/* Org */}
              <div>
                <label className="block text-sm font-medium text-[var(--text)] mb-1.5">기관 선택</label>
                <select
                  value={customOrg}
                  onChange={(e) => setCustomOrg(e.target.value)}
                  className="w-full h-[var(--btn-height)] px-3 text-sm bg-[var(--bg)] border border-[var(--border)] rounded-lg text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="">기관을 선택하세요</option>
                  {mockApiKeys.map((k) => (
                    <option key={k.id} value={k.org}>{k.org} ({k.tier})</option>
                  ))}
                </select>
              </div>

              {/* Tier (readonly) */}
              {customOrg && (
                <div>
                  <label className="block text-sm font-medium text-[var(--text)] mb-1.5">기본 Tier</label>
                  <div className="h-[var(--btn-height)] px-3 flex items-center text-sm bg-gray-50 border border-[var(--border)] rounded-lg text-[var(--text-secondary)]">
                    {mockApiKeys.find((k) => k.org === customOrg)?.tier ?? '-'}
                  </div>
                </div>
              )}

              {/* Custom daily */}
              <div>
                <label className="block text-sm font-medium text-[var(--text)] mb-1.5">커스텀 일일 한도</label>
                <input
                  type="number"
                  value={customDaily}
                  onChange={(e) => setCustomDaily(e.target.value)}
                  placeholder="예: 80000"
                  className="w-full h-[var(--btn-height)] px-3 text-sm bg-[var(--bg)] border border-[var(--border)] rounded-lg text-[var(--text)] placeholder:text-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              {/* Custom burst */}
              <div>
                <label className="block text-sm font-medium text-[var(--text)] mb-1.5">커스텀 Burst (분당)</label>
                <input
                  type="number"
                  value={customBurst}
                  onChange={(e) => setCustomBurst(e.target.value)}
                  placeholder="예: 1500"
                  className="w-full h-[var(--btn-height)] px-3 text-sm bg-[var(--bg)] border border-[var(--border)] rounded-lg text-[var(--text)] placeholder:text-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              {/* Reason */}
              <div>
                <label className="block text-sm font-medium text-[var(--text)] mb-1.5">사유</label>
                <textarea
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  rows={3}
                  placeholder="커스텀 한도 적용 사유를 입력하세요"
                  className="w-full px-3 py-2 text-sm bg-[var(--bg)] border border-[var(--border)] rounded-lg text-[var(--text)] placeholder:text-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                />
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[var(--border)]">
                <button onClick={closeModal} className="h-[var(--btn-height)] px-4 bg-[var(--bg)] border border-[var(--border)] rounded-lg text-sm font-medium text-[var(--text)] hover:bg-gray-100 transition-colors">
                  취소
                </button>
                <button onClick={closeModal} className="h-[var(--btn-height)] px-4 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors flex items-center gap-2">
                  <Zap size={14} />
                  저장
                </button>
              </div>
            </div>
          </Modal>
        </div>
      )}
    </div>
  );
}
