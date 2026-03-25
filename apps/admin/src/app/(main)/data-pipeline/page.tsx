'use client';

import { useState } from 'react';
import {
  Database,
  Search,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  Circle,
  AlertTriangle,
  RefreshCw,
  Play,
  Clock,
  HardDrive,
  BarChart3,
  MousePointer,
  ShoppingCart,
  Eye,
  Filter,
  Calendar,
  Minus,
  Zap,
  FileSearch,
} from 'lucide-react';
import { AdminTabs } from '@/components/shared/AdminTabs';
import { Modal } from '@/components/shared/Modal';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Pagination } from '@/components/shared/Pagination';
import { StatCard } from '@/components/shared/StatCard';
import { ChartPlaceholder } from '@/components/shared/ChartPlaceholder';
import { FilterBar } from '@/components/shared/FilterBar';
import {
  mockDataEvents,
  mockSearchLogs,
  mockPriceHistory,
  mockBatchJobs,
} from '@/lib/admin-mock-data';
import { useAdminStore } from '@/stores/adminStore';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const tabs = [
  { id: 'overview', label: '개요' },
  { id: 'dataEvent', label: 'DataEvent' },
  { id: 'searchLog', label: 'SearchLog' },
  { id: 'priceHistory', label: 'PriceHistory' },
  { id: 'batchJobs', label: '배치 작업' },
];

const sourceAppColors: Record<string, string> = {
  Shop: 'bg-blue-100 text-blue-700',
  ENote: 'bg-teal-100 text-teal-700',
  Supplier: 'bg-purple-100 text-purple-700',
  Admin: 'bg-orange-100 text-orange-700',
};

const eventTypeColors: Record<string, string> = {
  page_view: 'bg-gray-100 text-gray-700',
  click: 'bg-blue-100 text-blue-700',
  order: 'bg-emerald-100 text-emerald-700',
  search: 'bg-amber-100 text-amber-700',
  cart_add: 'bg-purple-100 text-purple-700',
};

const searchTypeColors: Record<string, string> = {
  '시약명': 'bg-blue-100 text-blue-700',
  'CAS': 'bg-orange-100 text-orange-700',
  '분자식': 'bg-purple-100 text-purple-700',
  '카탈로그번호': 'bg-teal-100 text-teal-700',
};

const statusDotColors: Record<string, string> = {
  '성공': 'fill-emerald-500 text-emerald-500',
  '실패': 'fill-red-500 text-red-500',
  '실행중': 'fill-blue-500 text-blue-500',
  '대기': 'fill-amber-500 text-amber-500',
};

const severityBadge: Record<string, string> = {
  error: 'bg-red-100 text-red-700',
  warning: 'bg-amber-100 text-amber-700',
  info: 'bg-blue-100 text-blue-700',
};

const errorLogs = [
  { id: 1, job: 'supplier-sync', severity: 'error', message: 'TCI API 응답 타임아웃 (30s 초과)', time: '2026-03-20 06:03:18' },
  { id: 2, job: 'supplier-sync', severity: 'warning', message: 'Alfa Aesar 가격 데이터 형식 변경 감지', time: '2026-03-19 18:00:05' },
  { id: 3, job: 'ai-batch-recommend', severity: 'warning', message: 'Claude API Rate Limit 도달 (5분 대기 후 재시도 성공)', time: '2026-03-20 03:12:45' },
  { id: 4, job: 'data-aggregate', severity: 'info', message: '중복 DataEvent 감지 (자동 dedupe 처리)', time: '2026-03-20 00:15:33' },
];

const eventTypeBreakdown = [
  { type: 'page_view', label: 'page_view', today: '5,234', week: '35,678', trend: '+12%' },
  { type: 'click', label: 'click', today: '3,456', week: '24,123', trend: '+8%' },
  { type: 'order', label: 'order', today: '234', week: '1,567', trend: '+15%' },
  { type: 'search', label: 'search', today: '2,345', week: '16,234', trend: '+5%' },
  { type: 'cart_add', label: 'cart_add', today: '1,076', week: '7,543', trend: '+10%' },
];

const zeroResultSearches = [
  { query: 'tert-butyllithium 1M in pentane', count: 18, lastSearched: '2026-03-20 09:45' },
  { query: 'Grubbs catalyst 3rd gen', count: 12, lastSearched: '2026-03-20 08:22' },
  { query: 'deuterated chloroform-d 99.96%', count: 9, lastSearched: '2026-03-19 16:55' },
  { query: 'palladium on carbon 5%', count: 7, lastSearched: '2026-03-19 14:10' },
];

const jobExecutionHistory = [
  { date: '2026-03-20 03:00', status: '성공', duration: '12분 34초', records: 4580, error: '' },
  { date: '2026-03-19 03:00', status: '성공', duration: '11분 58초', records: 4320, error: '' },
  { date: '2026-03-18 03:00', status: '성공', duration: '13분 10초', records: 4670, error: '' },
  { date: '2026-03-17 03:00', status: '실패', duration: '8분 22초', records: 2100, error: 'Claude API 응답 오류 (500)' },
  { date: '2026-03-16 03:00', status: '성공', duration: '12분 05초', records: 4490, error: '' },
  { date: '2026-03-15 03:00', status: '성공', duration: '12분 44초', records: 4510, error: '' },
  { date: '2026-03-14 03:00', status: '성공', duration: '11분 30초', records: 4200, error: '' },
  { date: '2026-03-13 03:00', status: '성공', duration: '12분 18초', records: 4380, error: '' },
  { date: '2026-03-12 03:00', status: '성공', duration: '13분 02초', records: 4600, error: '' },
  { date: '2026-03-11 03:00', status: '성공', duration: '11분 55초', records: 4150, error: '' },
];

const PAGE_SIZE = 8;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatPrice(n: number) {
  return n.toLocaleString('ko-KR');
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function DataPipelinePage() {
  const { dataPipelineTab, setDataPipelineTab } = useAdminStore();

  // Tab state
  const activeTab = dataPipelineTab === 'DataEvent' ? 'dataEvent' :
    dataPipelineTab === 'SearchLog' ? 'searchLog' :
    dataPipelineTab === 'PriceHistory' ? 'priceHistory' :
    dataPipelineTab === '배치 작업' ? 'batchJobs' :
    dataPipelineTab === '개요' ? 'overview' :
    dataPipelineTab;

  function handleTabChange(id: string) {
    const labelMap: Record<string, string> = {
      overview: '개요',
      dataEvent: 'DataEvent',
      searchLog: 'SearchLog',
      priceHistory: 'PriceHistory',
      batchJobs: '배치 작업',
    };
    setDataPipelineTab(labelMap[id] ?? id);
  }

  // DataEvent filters
  const [deSourceFilter, setDeSourceFilter] = useState<string>('전체');
  const [deTypeFilter, setDeTypeFilter] = useState<string>('전체');
  const [dePage, setDePage] = useState(1);
  const [eventDetailPayload, setEventDetailPayload] = useState<string | null>(null);

  // SearchLog
  const [slSearch, setSlSearch] = useState('');

  // PriceHistory filters
  const [phSupplier, setPhSupplier] = useState<string>('전체');
  const [phDirection, setPhDirection] = useState<string>('전체');
  const [phPage, setPhPage] = useState(1);

  // BatchJob modal
  const [selectedJob, setSelectedJob] = useState<typeof mockBatchJobs[number] | null>(null);

  // ---------- Filtered data ----------

  const filteredEvents = mockDataEvents.filter((e) => {
    if (deSourceFilter !== '전체' && e.sourceApp !== deSourceFilter) return false;
    if (deTypeFilter !== '전체' && e.eventType !== deTypeFilter) return false;
    return true;
  });
  const deTotalPages = Math.max(1, Math.ceil(filteredEvents.length / PAGE_SIZE));
  const pagedEvents = filteredEvents.slice((dePage - 1) * PAGE_SIZE, dePage * PAGE_SIZE);

  const filteredSearchLogs = mockSearchLogs.filter((s) =>
    slSearch === '' || s.query.toLowerCase().includes(slSearch.toLowerCase())
  );

  const filteredPrices = mockPriceHistory.filter((p) => {
    if (phSupplier !== '전체' && p.supplier !== phSupplier) return false;
    if (phDirection !== '전체' && p.direction !== phDirection) return false;
    return true;
  });
  const phTotalPages = Math.max(1, Math.ceil(filteredPrices.length / PAGE_SIZE));
  const pagedPrices = filteredPrices.slice((phPage - 1) * PAGE_SIZE, phPage * PAGE_SIZE);

  const suppliers = ['전체', ...Array.from(new Set(mockPriceHistory.map((p) => p.supplier)))];

  // ---------- Render helpers ----------

  const pillBtn = (label: string, active: boolean, onClick: () => void) => (
    <button
      key={label}
      onClick={onClick}
      className={`px-3 h-[var(--btn-height)] text-xs font-medium rounded-full transition-colors ${
        active
          ? 'bg-orange-600 text-white'
          : 'bg-[var(--bg)] border border-[var(--border)] text-[var(--text-secondary)] hover:bg-gray-100'
      }`}
    >
      {label}
    </button>
  );

  const thCell = 'text-left px-5 py-3 font-semibold text-[var(--text-secondary)] text-xs';
  const tdCell = 'px-5 py-3.5 text-sm';

  // =========================================================================
  // TAB 1: 개요
  // =========================================================================

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid grid-cols-3 gap-4">
        <StatCard icon={<Database size={20} />} label="DataEvent - 오늘 수집" value="12,345건" change="+8%" up />
        <StatCard icon={<Search size={20} />} label="SearchLog - 오늘 수집" value="2,345건" change="+15%" up />
        <StatCard icon={<TrendingUp size={20} />} label="PriceHistory - 오늘 수집" value="567건" change="+3%" up />
      </div>

      {/* Data volume chart */}
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5">
        <h2 className="text-base font-semibold text-[var(--text)] mb-4">데이터 수집 추이</h2>
        <ChartPlaceholder title="일별 데이터 수집량 추이" height="h-56" />
      </div>

      {/* Storage stats */}
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <HardDrive size={18} className="text-orange-600" />
          <h2 className="text-base font-semibold text-[var(--text)]">스토리지 현황</h2>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <div className="text-xs text-[var(--text-secondary)] mb-1">총 레코드 수</div>
            <div className="text-xl font-bold text-[var(--text)]">15,257건</div>
          </div>
          <div>
            <div className="text-xs text-[var(--text-secondary)] mb-1">DB 사용량</div>
            <div className="text-xl font-bold text-[var(--text)]">2.4 GB</div>
          </div>
          <div>
            <div className="text-xs text-[var(--text-secondary)] mb-1">일평균 증가량</div>
            <div className="text-xl font-bold text-[var(--text)]">+1,245건 / 일</div>
          </div>
          <div>
            <div className="text-xs text-[var(--text-secondary)] mb-1">월간 성장률</div>
            <div className="text-xl font-bold text-emerald-600">+12.5%</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Recent batch jobs (compact) */}
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-[var(--border)] flex items-center gap-2">
            <Clock size={16} className="text-orange-600" />
            <h2 className="text-sm font-semibold text-[var(--text)]">최근 배치 작업</h2>
          </div>
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-[var(--bg)] border-b border-[var(--border)]">
                <th className={thCell}>작업명</th>
                <th className={thCell}>상태</th>
                <th className={thCell}>소요시간</th>
                <th className={thCell}>마지막 실행</th>
              </tr>
            </thead>
            <tbody>
              {mockBatchJobs.slice(0, 3).map((job) => (
                <tr key={job.id} className="border-b border-[var(--border)]">
                  <td className="px-5 py-2.5 font-mono text-orange-600 font-medium">{job.name}</td>
                  <td className="px-5 py-2.5">
                    <div className="flex items-center gap-1.5">
                      <Circle size={7} className={statusDotColors[job.status]} />
                      <StatusBadge status={job.status} />
                    </div>
                  </td>
                  <td className="px-5 py-2.5 text-[var(--text-secondary)]">{job.duration}</td>
                  <td className="px-5 py-2.5 text-[var(--text-secondary)]">{job.lastRun}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Recent errors (compact) */}
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-[var(--border)] flex items-center gap-2">
            <AlertTriangle size={16} className="text-red-500" />
            <h2 className="text-sm font-semibold text-[var(--text)]">최근 오류</h2>
          </div>
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-[var(--bg)] border-b border-[var(--border)]">
                <th className={thCell}>작업명</th>
                <th className={thCell}>심각도</th>
                <th className={thCell}>메시지</th>
                <th className={thCell}>시간</th>
              </tr>
            </thead>
            <tbody>
              {errorLogs.slice(0, 3).map((log) => (
                <tr key={log.id} className="border-b border-[var(--border)]">
                  <td className="px-5 py-2.5 font-mono text-orange-600 font-medium">{log.job}</td>
                  <td className="px-5 py-2.5">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${severityBadge[log.severity]}`}>
                      {log.severity.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-5 py-2.5 text-[var(--text)] max-w-[200px] truncate">{log.message}</td>
                  <td className="px-5 py-2.5 text-[var(--text-secondary)] whitespace-nowrap">{log.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // =========================================================================
  // TAB 2: DataEvent
  // =========================================================================

  const renderDataEvent = () => (
    <div className="space-y-6">
      {/* Stats row */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard icon={<Database size={20} />} label="오늘 전체 이벤트" value="12,345" change="+8%" up />
        <StatCard icon={<ShoppingCart size={20} />} label="Shop 이벤트" value="7,890" change="+12%" up />
        <StatCard icon={<FileSearch size={20} />} label="ENote 이벤트" value="2,345" change="+5%" up />
        <StatCard icon={<Zap size={20} />} label="Supplier 이벤트" value="1,567" change="+3%" up />
      </div>

      {/* Filters */}
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-4 space-y-3">
        <div className="flex items-center gap-2 flex-wrap">
          <Filter size={14} className="text-[var(--text-secondary)]" />
          <span className="text-xs font-medium text-[var(--text-secondary)] mr-1">Source App</span>
          {['전체', 'Shop', 'ENote', 'Supplier', 'Admin'].map((s) =>
            pillBtn(s, deSourceFilter === s, () => { setDeSourceFilter(s); setDePage(1); })
          )}
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <BarChart3 size={14} className="text-[var(--text-secondary)]" />
          <span className="text-xs font-medium text-[var(--text-secondary)] mr-1">Event Type</span>
          {['전체', 'page_view', 'click', 'order', 'search', 'cart_add'].map((t) =>
            pillBtn(t, deTypeFilter === t, () => { setDeTypeFilter(t); setDePage(1); })
          )}
        </div>
      </div>

      {/* Event type breakdown */}
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-[var(--border)]">
          <h2 className="text-sm font-semibold text-[var(--text)]">이벤트 유형별 집계</h2>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[var(--bg)] border-b border-[var(--border)]">
              <th className={thCell}>Event Type</th>
              <th className={thCell}>오늘</th>
              <th className={thCell}>이번 주</th>
              <th className={thCell}>추이</th>
            </tr>
          </thead>
          <tbody>
            {eventTypeBreakdown.map((row) => (
              <tr key={row.type} className="border-b border-[var(--border)] hover:bg-[var(--bg)] transition-colors">
                <td className={tdCell}>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${eventTypeColors[row.type]}`}>
                    {row.label}
                  </span>
                </td>
                <td className={`${tdCell} font-medium text-[var(--text)]`}>{row.today}</td>
                <td className={`${tdCell} text-[var(--text-secondary)]`}>{row.week}</td>
                <td className={tdCell}>
                  <span className="flex items-center gap-1 text-emerald-600 text-xs font-medium">
                    <ArrowUpRight size={14} />
                    {row.trend}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Recent events table */}
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-[var(--border)]">
          <h2 className="text-sm font-semibold text-[var(--text)]">최근 이벤트</h2>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[var(--bg)] border-b border-[var(--border)]">
              <th className={thCell}>Timestamp</th>
              <th className={thCell}>사용자</th>
              <th className={thCell}>Source App</th>
              <th className={thCell}>Event Type</th>
              <th className={thCell}>Payload</th>
              <th className={thCell}>상세</th>
            </tr>
          </thead>
          <tbody>
            {pagedEvents.map((ev) => (
              <tr key={ev.id} className="border-b border-[var(--border)] hover:bg-[var(--bg)] transition-colors">
                <td className={`${tdCell} text-[var(--text-secondary)] whitespace-nowrap`}>{ev.timestamp}</td>
                <td className={`${tdCell} text-[var(--text)] font-medium`}>{ev.userName}</td>
                <td className={tdCell}>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${sourceAppColors[ev.sourceApp]}`}>
                    {ev.sourceApp}
                  </span>
                </td>
                <td className={tdCell}>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${eventTypeColors[ev.eventType]}`}>
                    {ev.eventType}
                  </span>
                </td>
                <td className={`${tdCell} text-[var(--text-secondary)] max-w-[280px]`}>
                  <span className="block truncate font-mono text-xs">
                    {ev.payload.length > 80 ? ev.payload.slice(0, 80) + '...' : ev.payload}
                  </span>
                </td>
                <td className={tdCell}>
                  <button
                    onClick={() => setEventDetailPayload(ev.payload)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-[var(--text-secondary)] hover:bg-gray-100 transition-colors"
                  >
                    <Eye size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="px-5 py-4 border-t border-[var(--border)] flex justify-center">
          <Pagination currentPage={dePage} totalPages={deTotalPages} onPageChange={setDePage} />
        </div>
      </div>

      {/* Event Detail Modal */}
      <Modal isOpen={eventDetailPayload !== null} onClose={() => setEventDetailPayload(null)} title="이벤트 상세 Payload" size="lg">
        <pre className="text-sm font-mono bg-[var(--bg)] border border-[var(--border)] rounded-lg p-4 whitespace-pre-wrap break-all text-[var(--text)]">
          {eventDetailPayload ? JSON.stringify(JSON.parse(eventDetailPayload), null, 2) : ''}
        </pre>
      </Modal>
    </div>
  );

  // =========================================================================
  // TAB 3: SearchLog
  // =========================================================================

  const renderSearchLog = () => (
    <div className="space-y-6">
      {/* Stats row */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard icon={<Search size={20} />} label="오늘 전체 검색" value="2,345" change="+15%" up />
        <StatCard icon={<BarChart3 size={20} />} label="평균 결과 수" value="24.5" change="+2.1%" up />
        <StatCard icon={<MousePointer size={20} />} label="CTR (클릭률)" value="45.2%" change="+3.5%" up />
        <StatCard icon={<AlertTriangle size={20} />} label="Zero-result 비율" value="8.3%" change="-1.2%" up />
      </div>

      {/* Popular searches */}
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-[var(--border)]">
          <h2 className="text-sm font-semibold text-[var(--text)]">인기 검색어</h2>
        </div>
        <FilterBar searchValue={slSearch} onSearchChange={setSlSearch} searchPlaceholder="검색어로 필터..." />
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[var(--bg)] border-b border-[var(--border)]">
              <th className={thCell}>#</th>
              <th className={thCell}>검색어</th>
              <th className={thCell}>검색 횟수</th>
              <th className={thCell}>평균 결과</th>
              <th className={thCell}>CTR</th>
              <th className={thCell}>검색 유형</th>
              <th className={thCell}>마지막 검색</th>
            </tr>
          </thead>
          <tbody>
            {filteredSearchLogs.map((log, idx) => (
              <tr key={log.query} className="border-b border-[var(--border)] hover:bg-[var(--bg)] transition-colors">
                <td className={`${tdCell} text-[var(--text-secondary)] font-medium`}>{idx + 1}</td>
                <td className={`${tdCell} font-bold text-[var(--text)]`}>{log.query}</td>
                <td className={`${tdCell} text-[var(--text)]`}>{log.count.toLocaleString()}</td>
                <td className={`${tdCell} text-[var(--text-secondary)]`}>{log.avgResults}</td>
                <td className={tdCell}>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden max-w-[80px]">
                      <div
                        className="h-full bg-orange-500 rounded-full"
                        style={{ width: `${Math.min(100, log.ctr)}%` }}
                      />
                    </div>
                    <span className="text-xs text-[var(--text)] font-medium">{log.ctr}%</span>
                  </div>
                </td>
                <td className={tdCell}>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${searchTypeColors[log.searchType]}`}>
                    {log.searchType}
                  </span>
                </td>
                <td className={`${tdCell} text-[var(--text-secondary)] whitespace-nowrap`}>{log.lastSearched}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Zero-result searches */}
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-[var(--border)] flex items-center gap-2">
          <AlertTriangle size={16} className="text-amber-500" />
          <h2 className="text-sm font-semibold text-[var(--text)]">검색 결과 없음 (카탈로그 개선 필요)</h2>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[var(--bg)] border-b border-[var(--border)]">
              <th className={thCell}>검색어</th>
              <th className={thCell}>검색 횟수</th>
              <th className={thCell}>마지막 검색</th>
              <th className={thCell}>액션</th>
            </tr>
          </thead>
          <tbody>
            {zeroResultSearches.map((item) => (
              <tr key={item.query} className="border-b border-[var(--border)] hover:bg-[var(--bg)] transition-colors">
                <td className={`${tdCell} font-medium text-[var(--text)]`}>{item.query}</td>
                <td className={`${tdCell} text-[var(--text)]`}>{item.count}</td>
                <td className={`${tdCell} text-[var(--text-secondary)] whitespace-nowrap`}>{item.lastSearched}</td>
                <td className={tdCell}>
                  <button className="h-[var(--btn-height)] px-3 text-xs font-medium rounded-lg bg-orange-50 text-orange-600 border border-orange-200 hover:bg-orange-100 transition-colors">
                    제품 추가
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Search type distribution chart */}
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5">
        <h2 className="text-sm font-semibold text-[var(--text)] mb-4">검색 유형 분포</h2>
        <ChartPlaceholder title="검색 유형 분포" height="h-48" />
      </div>
    </div>
  );

  // =========================================================================
  // TAB 4: PriceHistory
  // =========================================================================

  const renderPriceHistory = () => (
    <div className="space-y-6">
      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        <StatCard icon={<TrendingUp size={20} />} label="오늘 기록 수" value="567" change="+3%" up />
        <StatCard icon={<Database size={20} />} label="추적 제품 수" value="234" change="+5%" up />
        <StatCard icon={<Zap size={20} />} label="가격 변동 건" value="45" change="+12%" up />
      </div>

      {/* Filters */}
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-4">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <Filter size={14} className="text-[var(--text-secondary)]" />
            <span className="text-xs font-medium text-[var(--text-secondary)]">공급사</span>
            <select
              value={phSupplier}
              onChange={(e) => { setPhSupplier(e.target.value); setPhPage(1); }}
              className="h-[var(--btn-height)] px-3 text-sm bg-[var(--bg)] border border-[var(--border)] rounded-lg text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              {suppliers.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-[var(--text-secondary)]">방향</span>
            {['전체', '인상', '인하', '동일'].map((d) =>
              pillBtn(d, phDirection === d, () => { setPhDirection(d); setPhPage(1); })
            )}
          </div>
        </div>
      </div>

      {/* Recent price changes table */}
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-[var(--border)]">
          <h2 className="text-sm font-semibold text-[var(--text)]">최근 가격 변동</h2>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[var(--bg)] border-b border-[var(--border)]">
              <th className={thCell}>제품명</th>
              <th className={thCell}>공급사</th>
              <th className={thCell}>이전 가격</th>
              <th className={thCell}>변경 가격</th>
              <th className={thCell}>변동률</th>
              <th className={thCell}>기록일</th>
            </tr>
          </thead>
          <tbody>
            {pagedPrices.map((p) => {
              const isUp = p.direction === '인상';
              const isDown = p.direction === '인하';
              const changeColor = isUp ? 'text-red-500' : isDown ? 'text-emerald-600' : 'text-gray-500';
              const ChangeIcon = isUp ? TrendingUp : isDown ? TrendingDown : Minus;
              return (
                <tr key={p.id} className="border-b border-[var(--border)] hover:bg-[var(--bg)] transition-colors">
                  <td className={`${tdCell} font-medium text-[var(--text)]`}>{p.productName}</td>
                  <td className={`${tdCell} text-[var(--text-secondary)]`}>{p.supplier}</td>
                  <td className={`${tdCell} text-[var(--text-secondary)]`}>{'\u20A9'}{formatPrice(p.previousPrice)}</td>
                  <td className={`${tdCell} font-medium text-[var(--text)]`}>{'\u20A9'}{formatPrice(p.newPrice)}</td>
                  <td className={tdCell}>
                    <span className={`flex items-center gap-1 text-xs font-medium ${changeColor}`}>
                      <ChangeIcon size={14} />
                      {p.changePercent === 0 ? '0%' : `${p.changePercent > 0 ? '+' : ''}${p.changePercent}%`}
                    </span>
                  </td>
                  <td className={`${tdCell} text-[var(--text-secondary)] whitespace-nowrap`}>{p.recordedAt}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="px-5 py-4 border-t border-[var(--border)] flex justify-center">
          <Pagination currentPage={phPage} totalPages={phTotalPages} onPageChange={setPhPage} />
        </div>
      </div>

      {/* Chart placeholder */}
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5">
        <h2 className="text-sm font-semibold text-[var(--text)] mb-4">공급사별 가격 변동 현황</h2>
        <ChartPlaceholder title="공급사별 가격 변동 현황" height="h-48" />
      </div>
    </div>
  );

  // =========================================================================
  // TAB 5: 배치 작업
  // =========================================================================

  const renderBatchJobs = () => (
    <div className="space-y-6">
      {/* Batch jobs table */}
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-[var(--border)]">
          <h2 className="text-sm font-semibold text-[var(--text)]">배치 작업 현황</h2>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[var(--bg)] border-b border-[var(--border)]">
              <th className={thCell}>작업명</th>
              <th className={thCell}>주기</th>
              <th className={thCell}>마지막 실행</th>
              <th className={thCell}>다음 실행</th>
              <th className={thCell}>상태</th>
              <th className={thCell}>소요시간</th>
              <th className={thCell}>액션</th>
            </tr>
          </thead>
          <tbody>
            {mockBatchJobs.map((job) => (
              <tr key={job.id} className="border-b border-[var(--border)] hover:bg-[var(--bg)] transition-colors">
                <td className={tdCell}>
                  <div>
                    <div className="font-mono text-xs text-orange-600 font-medium">{job.name}</div>
                    <div className="text-xs text-[var(--text-secondary)] mt-0.5">{job.desc}</div>
                  </div>
                </td>
                <td className={`${tdCell} text-[var(--text)]`}>{job.schedule}</td>
                <td className={`${tdCell} text-[var(--text-secondary)] whitespace-nowrap`}>{job.lastRun}</td>
                <td className={`${tdCell} text-[var(--text-secondary)] whitespace-nowrap`}>{job.nextRun}</td>
                <td className={tdCell}>
                  <div className="flex items-center gap-1.5">
                    <Circle size={7} className={statusDotColors[job.status] ?? statusDotColors['성공']} />
                    <StatusBadge status={job.status} />
                  </div>
                </td>
                <td className={`${tdCell} text-[var(--text-secondary)]`}>{job.duration}</td>
                <td className={tdCell}>
                  <div className="flex items-center gap-1">
                    <button
                      className="h-[var(--btn-height)] px-3 text-xs font-medium rounded-lg bg-orange-50 text-orange-600 border border-orange-200 hover:bg-orange-100 transition-colors flex items-center gap-1"
                    >
                      <Play size={12} />
                      수동 실행
                    </button>
                    <button
                      onClick={() => setSelectedJob(job)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg text-[var(--text-secondary)] hover:bg-gray-100 transition-colors"
                    >
                      <Eye size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Job Detail Modal */}
      <Modal isOpen={selectedJob !== null} onClose={() => setSelectedJob(null)} title={selectedJob ? `${selectedJob.name} 상세` : ''} size="xl">
        {selectedJob && (
          <div className="space-y-5">
            {/* Header info */}
            <div className="flex items-center gap-3">
              <span className="font-mono text-sm text-orange-600 font-bold">{selectedJob.name}</span>
              <StatusBadge status={selectedJob.status} />
            </div>

            {/* Info grid */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-xs text-[var(--text-secondary)] mb-1">설명</div>
                <div className="text-[var(--text)] font-medium">{selectedJob.desc}</div>
              </div>
              <div>
                <div className="text-xs text-[var(--text-secondary)] mb-1">스케줄</div>
                <div className="text-[var(--text)] font-medium">{selectedJob.schedule}</div>
              </div>
              <div>
                <div className="text-xs text-[var(--text-secondary)] mb-1">마지막 실행</div>
                <div className="text-[var(--text)]">{selectedJob.lastRun}</div>
              </div>
              <div>
                <div className="text-xs text-[var(--text-secondary)] mb-1">다음 실행</div>
                <div className="text-[var(--text)]">{selectedJob.nextRun}</div>
              </div>
            </div>

            {/* Execution history */}
            <div>
              <h3 className="text-sm font-semibold text-[var(--text)] mb-3">실행 이력 (최근 10회)</h3>
              <div className="border border-[var(--border)] rounded-lg overflow-hidden">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-[var(--bg)] border-b border-[var(--border)]">
                      <th className={thCell}>실행일</th>
                      <th className={thCell}>상태</th>
                      <th className={thCell}>소요시간</th>
                      <th className={thCell}>처리 레코드</th>
                      <th className={thCell}>오류 메시지</th>
                    </tr>
                  </thead>
                  <tbody>
                    {jobExecutionHistory.map((h, idx) => (
                      <tr key={idx} className="border-b border-[var(--border)]">
                        <td className="px-5 py-2.5 text-[var(--text-secondary)] whitespace-nowrap">{h.date}</td>
                        <td className="px-5 py-2.5">
                          <StatusBadge status={h.status} />
                        </td>
                        <td className="px-5 py-2.5 text-[var(--text-secondary)]">{h.duration}</td>
                        <td className="px-5 py-2.5 text-[var(--text)] font-medium">{h.records.toLocaleString()}</td>
                        <td className="px-5 py-2.5 text-red-500">{h.error || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Manual run button */}
            <div className="flex justify-end pt-2">
              <button className="h-[var(--btn-height)] px-4 text-sm font-medium rounded-lg bg-orange-600 text-white hover:bg-orange-700 transition-colors flex items-center gap-2">
                <Play size={14} />
                수동 실행
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );

  // =========================================================================
  // Main Render
  // =========================================================================

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text)]">데이터 파이프라인</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">데이터 수집, 검색 로그, 가격 이력, 배치 작업 모니터링</p>
        </div>
        <button className="h-[var(--btn-height)] px-4 bg-[var(--bg)] border border-[var(--border)] text-[var(--text)] rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors flex items-center gap-2">
          <RefreshCw size={16} />
          새로고침
        </button>
      </div>

      {/* Tabs */}
      <AdminTabs
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />

      {/* Tab Content */}
      {activeTab === 'overview' && renderOverview()}
      {activeTab === 'dataEvent' && renderDataEvent()}
      {activeTab === 'searchLog' && renderSearchLog()}
      {activeTab === 'priceHistory' && renderPriceHistory()}
      {activeTab === 'batchJobs' && renderBatchJobs()}
    </div>
  );
}
