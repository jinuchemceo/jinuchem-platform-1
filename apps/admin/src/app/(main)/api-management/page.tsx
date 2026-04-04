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
  Heart,
  Bell,
  AlertTriangle,
  Wifi,
  WifiOff,
} from 'lucide-react';
import { AdminTabs } from '@/components/shared/AdminTabs';
import { Modal } from '@/components/shared/Modal';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Pagination } from '@/components/shared/Pagination';
import { StatCard } from '@/components/shared/StatCard';
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
  { id: '헬스체크', label: '헬스체크' },
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
                          <button onClick={() => { setRevealedKey(false); openModal('keyDetail', key); }} className="w-8 h-8 flex items-center justify-center rounded-lg text-[var(--text-secondary)] hover:bg-gray-100 transition-colors" title="수정">
                            <Edit size={16} />
                          </button>
                          <button onClick={() => { if (confirm(`"${key.org}" API 키를 삭제하시겠습니까?`)) { /* mock delete */ } }} className="w-8 h-8 flex items-center justify-center rounded-lg text-red-400 hover:bg-red-50 transition-colors" title="삭제">
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

                {/* 일별 사용량 미니 차트 */}
                <div>
                  <h3 className="text-sm font-medium text-[var(--text)] mb-2">일별 사용량 추이</h3>
                  <div className="flex items-end gap-1 h-24">
                    {[45, 62, 38, 71, 55, 80, 67].map((v, i) => (
                      <div key={i} className="flex-1 bg-orange-500 rounded-t-sm opacity-70 hover:opacity-100 transition-opacity" style={{ height: `${v}%` }} title={`${v}건`} />
                    ))}
                  </div>
                  <div className="flex justify-between mt-1 text-[10px] text-[var(--text-secondary)]">
                    <span>3/27</span><span>3/28</span><span>3/29</span><span>3/30</span><span>3/31</span><span>4/1</span><span>4/2</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 pt-3 border-t border-[var(--border)]">
                  <button onClick={() => alert('API Key가 회전되었습니다. 새 키가 발급됩니다.')} className="h-[var(--btn-height)] px-4 bg-[var(--bg)] border border-[var(--border)] rounded-lg text-sm font-medium text-[var(--text)] hover:bg-gray-100 transition-colors flex items-center gap-2">
                    <RefreshCw size={14} />
                    Key 회전
                  </button>
                  <button onClick={() => { if (confirm('이 API Key를 폐기하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) { closeModal(); } }} className="h-[var(--btn-height)] px-4 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors flex items-center gap-2">
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

          {/* Chart - API 호출량 추이 */}
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-[var(--text)]">API 호출량 추이</h2>
              <div className="flex gap-4 text-xs text-[var(--text-secondary)]">
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-orange-500" />성공</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-red-400" />실패</span>
              </div>
            </div>
            {(() => {
              const apiDaily = [
                { date: '3/26', success: 4200, fail: 120 },
                { date: '3/27', success: 4800, fail: 95 },
                { date: '3/28', success: 3900, fail: 150 },
                { date: '3/29', success: 5100, fail: 88 },
                { date: '3/30', success: 4600, fail: 110 },
                { date: '3/31', success: 5300, fail: 72 },
                { date: '4/1', success: 4400, fail: 130 },
                { date: '4/2', success: 4900, fail: 98 },
              ];
              const maxVal = Math.max(...apiDaily.map(d => d.success + d.fail));
              return (
                <div className="flex items-end gap-3 h-56">
                  {apiDaily.map(d => {
                    const total = d.success + d.fail;
                    return (
                      <div key={d.date} className="flex-1 flex flex-col items-center gap-1 group relative">
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">{total.toLocaleString()}건</div>
                        <div className="w-full flex flex-col justify-end" style={{ height: '200px' }}>
                          <div className="w-full bg-red-400 rounded-t-sm" style={{ height: `${(d.fail / maxVal) * 200}px` }} />
                          <div className="w-full bg-orange-500 rounded-b-sm" style={{ height: `${(d.success / maxVal) * 200}px` }} />
                        </div>
                        <span className="text-xs text-[var(--text-secondary)]">{d.date}</span>
                      </div>
                    );
                  })}
                </div>
              );
            })()}
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
                        <button onClick={() => { if (confirm(`"${cl.org}" 커스텀 규칙을 삭제하시겠습니까?`)) { /* mock delete */ } }} className="w-8 h-8 flex items-center justify-center rounded-lg text-red-400 hover:bg-red-50 transition-colors">
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

      {/* ================================================================ */}
      {/* Tab 5: 헬스체크 */}
      {/* ================================================================ */}
      {apiManagementTab === '헬스체크' && <HealthCheckTab />}
    </div>
  );
}

/* ================================================================ */
/* HealthCheckTab Component                                         */
/* ================================================================ */
function HealthCheckTab() {
  const services = [
    { name: 'JINU Shop API', status: '정상' as const, responseTime: '85ms', uptime: 99.98 },
    { name: 'E-Note API', status: '정상' as const, responseTime: '92ms', uptime: 99.95 },
    { name: 'Supplier API', status: '경고' as const, responseTime: '245ms', uptime: 99.82 },
    { name: 'External API v1', status: '정상' as const, responseTime: '68ms', uptime: 99.99 },
    { name: 'AI Engine', status: '정상' as const, responseTime: '1.2s', uptime: 99.90 },
  ];

  const [alertRules, setAlertRules] = useState([
    { id: 1, name: '응답시간 초과', condition: '응답시간 > 500ms', severity: '경고' as const, channel: 'Slack #ops-alert', active: true },
    { id: 2, name: '에러율 급증', condition: '에러율 > 5%', severity: '위험' as const, channel: 'Slack + Email', active: true },
    { id: 3, name: '연속 실패 감지', condition: '연속 실패 > 3회', severity: '위험' as const, channel: 'Slack + PagerDuty', active: true },
    { id: 4, name: 'Rate Limit 임계', condition: 'Rate Limit 80% 도달', severity: '정보' as const, channel: 'Slack #ops-info', active: false },
  ]);

  const incidents = [
    { id: 1, time: '2026-04-03 09:42', service: 'Supplier API', type: '응답 지연', severity: '경고' as const, duration: '12분', resolved: true },
    { id: 2, time: '2026-04-02 22:15', service: 'AI Engine', type: '타임아웃', severity: '위험' as const, duration: '8분', resolved: true },
    { id: 3, time: '2026-04-02 14:30', service: 'External API v1', type: '429 급증', severity: '정보' as const, duration: '5분', resolved: true },
    { id: 4, time: '2026-04-01 11:05', service: 'Supplier API', type: '502 에러', severity: '위험' as const, duration: '23분', resolved: true },
    { id: 5, time: '2026-04-01 08:20', service: 'JINU Shop API', type: '응답 지연', severity: '경고' as const, duration: '3분', resolved: true },
  ];

  const responseTimeTrend = [
    { label: '09:00', value: 95 },
    { label: '10:00', value: 110 },
    { label: '11:00', value: 88 },
    { label: '12:00', value: 245 },
    { label: '13:00', value: 180 },
    { label: '14:00', value: 120 },
    { label: '15:00', value: 105 },
    { label: '16:00', value: 98 },
  ];
  const maxResponse = Math.max(...responseTimeTrend.map((d) => d.value));
  const chartHeight = 200;
  const warningThreshold = 500;

  const statusDot = (status: '정상' | '경고' | '장애') => {
    if (status === '정상') return 'bg-emerald-500';
    if (status === '경고') return 'bg-amber-500';
    return 'bg-red-500';
  };

  const statusBg = (status: '정상' | '경고' | '장애') => {
    if (status === '정상') return 'bg-emerald-50 border-emerald-200';
    if (status === '경고') return 'bg-amber-50 border-amber-200';
    return 'bg-red-50 border-red-200';
  };

  const severityStyle = (severity: '경고' | '위험' | '정보') => {
    if (severity === '위험') return 'bg-red-100 text-red-700';
    if (severity === '경고') return 'bg-amber-100 text-amber-700';
    return 'bg-blue-100 text-blue-700';
  };

  return (
    <div className="space-y-6">
      {/* ---- 서비스 상태 대시보드 ---- */}
      <div>
        <h2 className="text-base font-semibold text-[var(--text)] mb-4 flex items-center gap-2">
          <Heart size={18} className="text-orange-600" />
          서비스 상태 대시보드
        </h2>
        <div className="grid grid-cols-5 gap-4">
          {services.map((svc) => (
            <div key={svc.name} className={`border rounded-xl p-4 ${statusBg(svc.status)}`}>
              <div className="flex items-center gap-2 mb-3">
                <span className={`w-2.5 h-2.5 rounded-full ${statusDot(svc.status)} animate-pulse`} />
                <span className="text-xs font-semibold text-[var(--text)]">{svc.status}</span>
              </div>
              <h3 className="text-sm font-medium text-[var(--text)] mb-1 truncate" title={svc.name}>{svc.name}</h3>
              <div className="text-xs text-[var(--text-secondary)] mb-1">응답시간: <span className="font-medium text-[var(--text)]">{svc.responseTime}</span></div>
              <div className="text-xs text-[var(--text-secondary)] mb-2">Uptime: <span className="font-medium text-[var(--text)]">{svc.uptime}%</span></div>
              {/* Uptime progress bar */}
              <div className="w-full h-1.5 bg-white/60 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${svc.status === '경고' ? 'bg-amber-500' : 'bg-emerald-500'}`}
                  style={{ width: `${svc.uptime}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ---- 이상 탐지 알림 규칙 ---- */}
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-[var(--border)] flex items-center gap-2">
          <Bell size={18} className="text-orange-600" />
          <h2 className="text-base font-semibold text-[var(--text)]">이상 탐지 알림 규칙</h2>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[var(--bg)] border-b border-[var(--border)]">
              <th className="text-left px-5 py-3 font-semibold text-[var(--text-secondary)]">규칙명</th>
              <th className="text-left px-5 py-3 font-semibold text-[var(--text-secondary)]">조건</th>
              <th className="text-center px-5 py-3 font-semibold text-[var(--text-secondary)]">심각도</th>
              <th className="text-left px-5 py-3 font-semibold text-[var(--text-secondary)]">알림 채널</th>
              <th className="text-center px-5 py-3 font-semibold text-[var(--text-secondary)]">상태</th>
            </tr>
          </thead>
          <tbody>
            {alertRules.map((rule) => (
              <tr key={rule.id} className="border-b border-[var(--border)] hover:bg-[var(--bg)] transition-colors">
                <td className="px-5 py-3.5 font-medium text-[var(--text)]">{rule.name}</td>
                <td className="px-5 py-3.5 text-xs font-mono text-[var(--text-secondary)]">{rule.condition}</td>
                <td className="px-5 py-3.5 text-center">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${severityStyle(rule.severity)}`}>
                    {rule.severity}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-xs text-[var(--text-secondary)]">{rule.channel}</td>
                <td className="px-5 py-3.5 text-center">
                  <button
                    onClick={() => setAlertRules((prev) => prev.map((r) => r.id === rule.id ? { ...r, active: !r.active } : r))}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                      rule.active ? 'bg-orange-600' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${
                        rule.active ? 'translate-x-4' : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ---- 최근 인시던트 ---- */}
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-[var(--border)] flex items-center gap-2">
          <AlertTriangle size={18} className="text-orange-600" />
          <h2 className="text-base font-semibold text-[var(--text)]">최근 인시던트</h2>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[var(--bg)] border-b border-[var(--border)]">
              <th className="text-left px-5 py-3 font-semibold text-[var(--text-secondary)]">시각</th>
              <th className="text-left px-5 py-3 font-semibold text-[var(--text-secondary)]">서비스</th>
              <th className="text-left px-5 py-3 font-semibold text-[var(--text-secondary)]">유형</th>
              <th className="text-center px-5 py-3 font-semibold text-[var(--text-secondary)]">심각도</th>
              <th className="text-right px-5 py-3 font-semibold text-[var(--text-secondary)]">지속시간</th>
              <th className="text-center px-5 py-3 font-semibold text-[var(--text-secondary)]">상태</th>
            </tr>
          </thead>
          <tbody>
            {incidents.map((inc) => (
              <tr key={inc.id} className="border-b border-[var(--border)] hover:bg-[var(--bg)] transition-colors">
                <td className="px-5 py-3.5 text-xs text-[var(--text-secondary)] whitespace-nowrap">{inc.time}</td>
                <td className="px-5 py-3.5 font-medium text-[var(--text)]">{inc.service}</td>
                <td className="px-5 py-3.5 text-xs text-[var(--text-secondary)]">{inc.type}</td>
                <td className="px-5 py-3.5 text-center">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${severityStyle(inc.severity)}`}>
                    {inc.severity}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-right text-xs text-[var(--text-secondary)]">{inc.duration}</td>
                <td className="px-5 py-3.5 text-center">
                  {inc.resolved ? (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600">
                      <CheckCircle size={14} />
                      해결
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-600">
                      <Activity size={14} />
                      진행중
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ---- 응답시간 추이 ---- */}
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Activity size={18} className="text-orange-600" />
          <h2 className="text-base font-semibold text-[var(--text)]">응답시간 추이 (평균)</h2>
        </div>

        <div className="relative">
          {/* Warning threshold line */}
          <div
            className="absolute left-0 right-0 border-t border-dashed border-red-300 z-10 pointer-events-none"
            style={{ bottom: `${(warningThreshold / (maxResponse * 1.2)) * chartHeight}px` }}
          >
            <span className="absolute -top-3 right-0 text-[10px] text-red-400 font-medium">500ms (경고)</span>
          </div>

          {/* Bar chart */}
          <div className="flex items-end gap-3" style={{ height: `${chartHeight}px` }}>
            {responseTimeTrend.map((d) => {
              const barHeight = (d.value / (maxResponse * 1.2)) * chartHeight;
              const isWarning = d.value > 200;
              return (
                <div key={d.label} className="flex-1 flex flex-col items-center gap-1 group relative">
                  <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-20">
                    {d.value}ms
                  </div>
                  <div className="w-full flex flex-col justify-end" style={{ height: `${chartHeight}px` }}>
                    <div
                      className={`w-full rounded-t-sm transition-opacity hover:opacity-80 ${isWarning ? 'bg-amber-500' : 'bg-orange-500'}`}
                      style={{ height: `${barHeight}px` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          {/* X-axis labels */}
          <div className="flex justify-between mt-2 px-1">
            {responseTimeTrend.map((d) => (
              <span key={d.label} className="text-[10px] text-[var(--text-secondary)] flex-1 text-center">{d.label}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
