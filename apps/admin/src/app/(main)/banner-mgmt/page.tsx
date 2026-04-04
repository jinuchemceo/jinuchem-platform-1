'use client';

import { useState, useMemo } from 'react';
import {
  Image,
  Plus,
  Edit,
  Trash2,
  Eye,
  Search,
  Filter,
  Calendar,
  Upload,
  X,
  GripVertical,
  ExternalLink,
  BarChart3,
  TrendingUp,
  MousePointerClick,
  Monitor,
  Smartphone,
  Users,
  Clock,
  CheckCircle,
  ToggleLeft,
  ToggleRight,
  Link,
  Maximize,
  Minimize,
  Hash,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  Info,
  RefreshCw,
  ChevronRight,
} from 'lucide-react';
import { AdminTabs } from '@/components/shared/AdminTabs';
import { Modal } from '@/components/shared/Modal';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Pagination } from '@/components/shared/Pagination';
import { StatCard } from '@/components/shared/StatCard';

// =============================================================================
// Constants
// =============================================================================

const TABS = [
  { id: 'list', label: '배너 목록' },
  { id: 'create', label: '배너 등록' },
  { id: 'schedule', label: '노출 스케줄' },
  { id: 'stats', label: '성과 분석' },
];

const BANNER_TYPE_COLORS: Record<string, string> = {
  '이벤트': 'blue',
  '공지': 'amber',
  '프로모션': 'emerald',
  '시스템': 'purple',
};

const BANNER_STATUS_COLORS: Record<string, string> = {
  '활성': 'emerald',
  '비활성': 'gray',
  '예약': 'blue',
  '종료': 'red',
};

const fmt = (n: number) => n.toLocaleString('ko-KR');

// =============================================================================
// Types
// =============================================================================

interface Banner {
  id: string;
  title: string;
  description: string;
  type: '이벤트' | '공지' | '프로모션' | '시스템';
  status: '활성' | '비활성' | '예약' | '종료';
  startDate: string;
  endDate: string;
  views: number;
  clicks: number;
  closeCount: number;
  allowHideToday: boolean;
  priority: number;
  imageGradient: string;
}

// =============================================================================
// Mock Data
// =============================================================================

const initialBanners: Banner[] = [
  { id: 'BN-001', title: '봄맞이 시약 할인전', description: '유기화합물 전 품목 15% 할인! 3월 한정 특별 프로모션입니다.', type: '프로모션', status: '활성', startDate: '2026-04-01', endDate: '2026-04-30', views: 12340, clicks: 1850, closeCount: 8900, allowHideToday: true, priority: 1, imageGradient: 'from-blue-500 to-purple-600' },
  { id: 'BN-002', title: '신규 가입 혜택', description: '첫 주문 시 10% 할인 쿠폰을 드립니다. 지금 바로 시작하세요!', type: '이벤트', status: '활성', startDate: '2026-03-15', endDate: '2026-05-31', views: 8920, clicks: 2130, closeCount: 5340, allowHideToday: true, priority: 2, imageGradient: 'from-emerald-500 to-teal-600' },
  { id: 'BN-003', title: '시스템 정기점검 안내', description: '4월 10일(목) 02:00~06:00 서버 점검이 진행됩니다.', type: '시스템', status: '활성', startDate: '2026-04-08', endDate: '2026-04-10', views: 3450, clicks: 120, closeCount: 3100, allowHideToday: false, priority: 0, imageGradient: 'from-amber-500 to-orange-600' },
  { id: 'BN-004', title: 'JINU E-Note 연동 안내', description: '전자실험노트와 시약장이 연동됩니다. 자세한 내용을 확인하세요.', type: '공지', status: '비활성', startDate: '2026-03-01', endDate: '2026-03-31', views: 15600, clicks: 4200, closeCount: 12300, allowHideToday: true, priority: 3, imageGradient: 'from-violet-500 to-indigo-600' },
  { id: 'BN-005', title: '대량구매 특별 할인', description: '100만원 이상 주문 시 추가 5% 할인 적용', type: '프로모션', status: '예약', startDate: '2026-04-15', endDate: '2026-05-15', views: 0, clicks: 0, closeCount: 0, allowHideToday: true, priority: 4, imageGradient: 'from-rose-500 to-pink-600' },
  { id: 'BN-006', title: '여름 시약 보관 가이드', description: '고온 시기 시약 보관 주의사항을 확인하세요.', type: '공지', status: '예약', startDate: '2026-06-01', endDate: '2026-08-31', views: 0, clicks: 0, closeCount: 0, allowHideToday: true, priority: 5, imageGradient: 'from-cyan-500 to-blue-600' },
  { id: 'BN-007', title: '연말 결산 할인', description: '12월 한정 전 품목 20% 할인', type: '프로모션', status: '종료', startDate: '2025-12-01', endDate: '2025-12-31', views: 23400, clicks: 5670, closeCount: 18900, allowHideToday: true, priority: 6, imageGradient: 'from-red-500 to-rose-600' },
  { id: 'BN-008', title: '고객 만족도 설문', description: '설문에 참여하시면 쿠폰을 드립니다.', type: '이벤트', status: '종료', startDate: '2026-02-01', endDate: '2026-02-28', views: 9800, clicks: 3210, closeCount: 7650, allowHideToday: true, priority: 7, imageGradient: 'from-orange-500 to-amber-600' },
];

// =============================================================================
// Daily stats mock (14 days)
// =============================================================================

const dailyStats = [
  { date: '03/21', views: 4200, clicks: 980 },
  { date: '03/22', views: 3800, clicks: 870 },
  { date: '03/23', views: 5100, clicks: 1200 },
  { date: '03/24', views: 4600, clicks: 1050 },
  { date: '03/25', views: 5300, clicks: 1340 },
  { date: '03/26', views: 4900, clicks: 1180 },
  { date: '03/27', views: 5500, clicks: 1420 },
  { date: '03/28', views: 6200, clicks: 1560 },
  { date: '03/29', views: 5800, clicks: 1390 },
  { date: '03/30', views: 6500, clicks: 1650 },
  { date: '03/31', views: 5900, clicks: 1480 },
  { date: '04/01', views: 6800, clicks: 1720 },
  { date: '04/02', views: 7100, clicks: 1810 },
  { date: '04/03', views: 5810, clicks: 1530 },
];

// =============================================================================
// Helper
// =============================================================================

function getCTR(views: number, clicks: number): string {
  if (views === 0) return '0.0';
  return ((clicks / views) * 100).toFixed(1);
}

function getCloseRate(views: number, closeCount: number): string {
  if (views === 0) return '0.0';
  return ((closeCount / views) * 100).toFixed(1);
}

function getRemainingDays(endDate: string): number {
  const now = new Date('2026-04-03');
  const end = new Date(endDate);
  const diff = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  return diff;
}

// =============================================================================
// Component
// =============================================================================

export default function BannerMgmtPage() {
  const [activeTab, setActiveTab] = useState('list');
  const [banners, setBanners] = useState<Banner[]>(initialBanners);
  const [toast, setToast] = useState<string | null>(null);

  // --- Tab 1 state ---
  const [statusFilter, setStatusFilter] = useState('전체');
  const [searchQuery, setSearchQuery] = useState('');
  const [previewBanner, setPreviewBanner] = useState<Banner | null>(null);
  const [listPage, setListPage] = useState(1);

  // --- Tab 2 state ---
  const [formTitle, setFormTitle] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formType, setFormType] = useState<Banner['type']>('이벤트');
  const [formLink, setFormLink] = useState('');
  const [formStartDate, setFormStartDate] = useState('');
  const [formEndDate, setFormEndDate] = useState('');
  const [formPriority, setFormPriority] = useState(0);
  const [formAllowHide, setFormAllowHide] = useState(true);
  const [formTargetShop, setFormTargetShop] = useState(true);
  const [formTargetSupplier, setFormTargetSupplier] = useState(false);
  const [formPopupSize, setFormPopupSize] = useState('중');
  const [createPreviewOpen, setCreatePreviewOpen] = useState(false);

  // --- Tab 3 state ---
  const [maxSimultaneous, setMaxSimultaneous] = useState(1);
  const [showNonLoggedIn, setShowNonLoggedIn] = useState(false);
  const [showOnMobile, setShowOnMobile] = useState(true);

  // --- Toast helper ---
  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  // --- Filtered banners ---
  const filteredBanners = useMemo(() => {
    return banners.filter((b) => {
      if (statusFilter !== '전체' && b.status !== statusFilter) return false;
      if (searchQuery && !b.title.includes(searchQuery) && !b.id.includes(searchQuery)) return false;
      return true;
    });
  }, [banners, statusFilter, searchQuery]);

  const totalListPages = Math.ceil(filteredBanners.length / 4);
  const pagedBanners = filteredBanners.slice((listPage - 1) * 4, listPage * 4);

  // --- Handlers ---
  const handleDelete = (id: string) => {
    setBanners((prev) => prev.filter((b) => b.id !== id));
    showToast('배너가 삭제되었습니다.');
  };

  const handleToggleHideToday = (id: string) => {
    setBanners((prev) =>
      prev.map((b) => (b.id === id ? { ...b, allowHideToday: !b.allowHideToday } : b))
    );
  };

  const handleCreateBanner = () => {
    if (!formTitle.trim()) {
      showToast('배너 제목을 입력해주세요.');
      return;
    }
    if (!formStartDate || !formEndDate) {
      showToast('노출 기간을 설정해주세요.');
      return;
    }
    const newBanner: Banner = {
      id: `BN-${String(banners.length + 1).padStart(3, '0')}`,
      title: formTitle,
      description: formDesc,
      type: formType,
      status: '예약',
      startDate: formStartDate,
      endDate: formEndDate,
      views: 0,
      clicks: 0,
      closeCount: 0,
      allowHideToday: formAllowHide,
      priority: formPriority,
      imageGradient: 'from-gray-500 to-gray-600',
    };
    setBanners((prev) => [...prev, newBanner]);
    showToast('배너가 등록되었습니다.');
    handleResetForm();
    setActiveTab('list');
  };

  const handleResetForm = () => {
    setFormTitle('');
    setFormDesc('');
    setFormType('이벤트');
    setFormLink('');
    setFormStartDate('');
    setFormEndDate('');
    setFormPriority(0);
    setFormAllowHide(true);
    setFormTargetShop(true);
    setFormTargetSupplier(false);
    setFormPopupSize('중');
  };

  // --- Active / scheduled banners for schedule tab ---
  const scheduleBanners = useMemo(
    () => banners.filter((b) => b.status === '활성' || b.status === '예약').sort((a, b) => a.priority - b.priority),
    [banners]
  );

  // --- Stats aggregates ---
  const totalViews = banners.reduce((s, b) => s + b.views, 0);
  const totalClicks = banners.reduce((s, b) => s + b.clicks, 0);
  const totalCloses = banners.reduce((s, b) => s + b.closeCount, 0);
  const avgCTR = totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(1) : '0.0';
  const avgCloseRate = totalViews > 0 ? ((totalCloses / totalViews) * 100).toFixed(1) : '0.0';

  const bestBanner = useMemo(() => {
    const withViews = banners.filter((b) => b.views > 0);
    if (withViews.length === 0) return null;
    return withViews.reduce((best, b) => {
      const bestCTR = best.views > 0 ? best.clicks / best.views : 0;
      const bCTR = b.views > 0 ? b.clicks / b.views : 0;
      return bCTR > bestCTR ? b : best;
    });
  }, [banners]);

  // --- Week schedule helper ---
  const weekDays = ['월', '화', '수', '목', '금', '토', '일'];
  const weekDates = useMemo(() => {
    const base = new Date('2026-03-30'); // Monday
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(base);
      d.setDate(base.getDate() + i);
      return d;
    });
  }, []);

  const isInRange = (banner: Banner, date: Date): boolean => {
    const start = new Date(banner.startDate);
    const end = new Date(banner.endDate);
    return date >= start && date <= end;
  };

  const isToday = (date: Date): boolean => {
    const today = new Date('2026-04-03');
    return date.toDateString() === today.toDateString();
  };

  // ==========================================================================
  // Render: Preview Modal
  // ==========================================================================

  const renderPreviewModal = (banner: Banner | null, open: boolean, onClose: () => void) => {
    if (!open || !banner) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/60" onClick={onClose} />
        <div className="relative w-full max-w-lg mx-4 bg-[var(--bg-card)] rounded-xl shadow-2xl overflow-hidden">
          {/* Banner image area */}
          <div className={`relative aspect-video bg-gradient-to-br ${banner.imageGradient} flex items-center justify-center`}>
            <div className="absolute inset-0 bg-black/20" />
            <div className="relative text-center px-6">
              <h3 className="text-2xl font-bold text-white mb-2">{banner.title}</h3>
              <p className="text-white/80 text-sm">{banner.description}</p>
            </div>
            <button
              onClick={onClose}
              className="absolute top-3 right-3 w-8 h-8 bg-black/30 rounded-full flex items-center justify-center text-white hover:bg-black/50 transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            <p className="text-sm text-[var(--text-secondary)] mb-4">{banner.description}</p>
            <button
              onClick={() => {
                showToast('링크 이동 (미리보기)');
              }}
              className="w-full h-[var(--btn-height)] bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <ExternalLink size={16} />
              자세히 보기
            </button>
          </div>

          {/* Bottom: hide today + close */}
          <div className="border-t border-[var(--border)] px-6 py-4 flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                disabled={!banner.allowHideToday}
              />
              <span className="text-sm text-[var(--text-secondary)]">
                오늘 하루 안보기
              </span>
            </label>
            <button
              onClick={onClose}
              className="h-[var(--btn-height)] px-4 border border-[var(--border)] rounded-lg text-sm text-[var(--text-secondary)] hover:bg-gray-100 transition-colors"
            >
              닫기
            </button>
          </div>
        </div>
      </div>
    );
  };

  // ==========================================================================
  // Render: Tab 1 - Banner List
  // ==========================================================================

  const renderListTab = () => {
    const activeBanners = banners.filter((b) => b.status === '활성').length;
    const scheduledBanners = banners.filter((b) => b.status === '예약').length;

    return (
      <div className="space-y-6">
        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={<Image size={20} />}
            label="전체 배너"
            value={String(banners.length)}
            change="+2 이번 달"
            up={true}
            prefix=""
          />
          <StatCard
            icon={<CheckCircle size={20} />}
            label="활성 배너"
            value={String(activeBanners)}
            change="정상 운영중"
            up={true}
          />
          <StatCard
            icon={<Clock size={20} />}
            label="예약 배너"
            value={String(scheduledBanners)}
            change="대기중"
            up={true}
          />
          <StatCard
            icon={<Eye size={20} />}
            label="총 노출수"
            value={fmt(totalViews)}
            change="+12.3%"
            up={true}
          />
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-[var(--text-secondary)]" />
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setListPage(1);
              }}
              className="h-[var(--btn-height)] px-3 border border-[var(--border)] rounded-lg bg-[var(--bg-card)] text-sm text-[var(--text)]"
            >
              <option>전체</option>
              <option>활성</option>
              <option>비활성</option>
              <option>예약</option>
              <option>종료</option>
            </select>
          </div>
          <div className="relative flex-1 max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
            <input
              type="text"
              placeholder="배너 제목 또는 ID 검색..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setListPage(1);
              }}
              className="w-full h-[var(--btn-height)] pl-9 pr-3 border border-[var(--border)] rounded-lg bg-[var(--bg-card)] text-sm text-[var(--text)] placeholder:text-[var(--text-secondary)]"
            />
          </div>
          <button
            onClick={() => {
              setActiveTab('create');
            }}
            className="h-[var(--btn-height)] px-4 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors flex items-center gap-2"
          >
            <Plus size={16} />
            새 배너 등록
          </button>
        </div>

        {/* Banner Card Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {pagedBanners.map((banner) => (
            <div
              key={banner.id}
              className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl overflow-hidden"
            >
              {/* Image placeholder */}
              <div className={`relative aspect-video bg-gradient-to-br ${banner.imageGradient} flex items-center justify-center`}>
                <div className="absolute inset-0 bg-black/20" />
                <div className="relative text-center px-6">
                  <p className="text-white/70 text-xs mb-1">{banner.id}</p>
                  <h4 className="text-lg font-bold text-white">{banner.title}</h4>
                </div>
                <div className="absolute top-3 left-3">
                  <StatusBadge status={banner.type} colorMap={BANNER_TYPE_COLORS} />
                </div>
                <div className="absolute top-3 right-3">
                  <StatusBadge status={banner.status} colorMap={BANNER_STATUS_COLORS} />
                </div>
              </div>

              {/* Card body */}
              <div className="p-4 space-y-3">
                {/* Description */}
                <p className="text-sm text-[var(--text-secondary)] line-clamp-2">
                  {banner.description}
                </p>

                {/* Target */}
                <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                  <Target size={13} />
                  <span>JINU Shop 대시보드 팝업</span>
                </div>

                {/* Period */}
                <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                  <Calendar size={13} />
                  <span>{banner.startDate} ~ {banner.endDate}</span>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-4 gap-2 py-2 border-t border-b border-[var(--border)]">
                  <div className="text-center">
                    <div className="text-xs text-[var(--text-secondary)]">노출수</div>
                    <div className="text-sm font-semibold text-[var(--text)]">{fmt(banner.views)}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-[var(--text-secondary)]">클릭수</div>
                    <div className="text-sm font-semibold text-[var(--text)]">{fmt(banner.clicks)}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-[var(--text-secondary)]">CTR</div>
                    <div className="text-sm font-semibold text-blue-600">{getCTR(banner.views, banner.clicks)}%</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-[var(--text-secondary)]">닫기율</div>
                    <div className="text-sm font-semibold text-[var(--text)]">{getCloseRate(banner.views, banner.closeCount)}%</div>
                  </div>
                </div>

                {/* Hide today toggle */}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[var(--text-secondary)]">오늘 하루 안보기 허용</span>
                  <button
                    onClick={() => handleToggleHideToday(banner.id)}
                    className="text-[var(--text-secondary)] hover:text-orange-600 transition-colors"
                  >
                    {banner.allowHideToday ? (
                      <ToggleRight size={24} className="text-orange-600" />
                    ) : (
                      <ToggleLeft size={24} />
                    )}
                  </button>
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => showToast(`${banner.title} 수정 모드`)}
                    className="flex-1 h-[var(--btn-height)] border border-[var(--border)] rounded-lg text-sm text-[var(--text)] hover:bg-gray-100 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Edit size={14} />
                    수정
                  </button>
                  <button
                    onClick={() => setPreviewBanner(banner)}
                    className="flex-1 h-[var(--btn-height)] border border-[var(--border)] rounded-lg text-sm text-[var(--text)] hover:bg-gray-100 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Eye size={14} />
                    미리보기
                  </button>
                  <button
                    onClick={() => handleDelete(banner.id)}
                    className="h-[var(--btn-height)] px-3 border border-red-200 rounded-lg text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center justify-center"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty state */}
        {filteredBanners.length === 0 && (
          <div className="text-center py-16 text-[var(--text-secondary)]">
            <Image size={48} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">검색 결과가 없습니다.</p>
          </div>
        )}

        {/* Pagination */}
        {totalListPages > 1 && (
          <Pagination currentPage={listPage} totalPages={totalListPages} onPageChange={setListPage} />
        )}
      </div>
    );
  };

  // ==========================================================================
  // Render: Tab 2 - Banner Creation
  // ==========================================================================

  const renderCreateTab = () => {
    const previewFormBanner: Banner = {
      id: 'PREVIEW',
      title: formTitle || '배너 제목',
      description: formDesc || '배너 설명이 여기에 표시됩니다.',
      type: formType,
      status: '예약',
      startDate: formStartDate || '2026-04-01',
      endDate: formEndDate || '2026-04-30',
      views: 0,
      clicks: 0,
      closeCount: 0,
      allowHideToday: formAllowHide,
      priority: formPriority,
      imageGradient: 'from-orange-500 to-amber-600',
    };

    return (
      <div className="space-y-6">
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-6">
          <h3 className="text-lg font-semibold text-[var(--text)] mb-6 flex items-center gap-2">
            <Plus size={20} className="text-orange-600" />
            새 배너 등록
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left column: form fields */}
            <div className="space-y-5">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-[var(--text)] mb-1.5">배너 제목</label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="배너 제목을 입력하세요"
                  className="w-full h-[var(--btn-height)] px-3 border border-[var(--border)] rounded-lg bg-[var(--bg)] text-sm text-[var(--text)] placeholder:text-[var(--text-secondary)]"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-[var(--text)] mb-1.5">배너 설명</label>
                <textarea
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  placeholder="배너 설명을 입력하세요"
                  rows={3}
                  className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--bg)] text-sm text-[var(--text)] placeholder:text-[var(--text-secondary)] resize-none"
                />
              </div>

              {/* Type */}
              <div>
                <label className="block text-sm font-medium text-[var(--text)] mb-1.5">배너 유형</label>
                <select
                  value={formType}
                  onChange={(e) => setFormType(e.target.value as Banner['type'])}
                  className="w-full h-[var(--btn-height)] px-3 border border-[var(--border)] rounded-lg bg-[var(--bg)] text-sm text-[var(--text)]"
                >
                  <option value="이벤트">이벤트</option>
                  <option value="공지">공지</option>
                  <option value="프로모션">프로모션</option>
                  <option value="시스템">시스템</option>
                </select>
              </div>

              {/* Image upload area */}
              <div>
                <label className="block text-sm font-medium text-[var(--text)] mb-1.5">배너 이미지</label>
                <div
                  className="border-2 border-dashed border-[var(--border)] rounded-xl p-8 text-center cursor-pointer hover:border-orange-400 hover:bg-orange-50/30 transition-colors"
                  onClick={() => showToast('이미지 업로드 (데모)')}
                >
                  <Upload size={32} className="mx-auto mb-2 text-[var(--text-secondary)]" />
                  <p className="text-sm text-[var(--text-secondary)]">클릭 또는 드래그하여 이미지를 업로드하세요</p>
                  <p className="text-xs text-[var(--text-secondary)] mt-1">권장 크기: 800 x 450px (16:9)</p>
                </div>
              </div>

              {/* Link URL */}
              <div>
                <label className="block text-sm font-medium text-[var(--text)] mb-1.5">링크 URL</label>
                <div className="relative">
                  <Link size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
                  <input
                    type="text"
                    value={formLink}
                    onChange={(e) => setFormLink(e.target.value)}
                    placeholder="https://..."
                    className="w-full h-[var(--btn-height)] pl-9 pr-3 border border-[var(--border)] rounded-lg bg-[var(--bg)] text-sm text-[var(--text)] placeholder:text-[var(--text-secondary)]"
                  />
                </div>
              </div>
            </div>

            {/* Right column: more fields */}
            <div className="space-y-5">
              {/* Period */}
              <div>
                <label className="block text-sm font-medium text-[var(--text)] mb-1.5">노출 기간</label>
                <div className="flex items-center gap-2">
                  <input
                    type="date"
                    value={formStartDate}
                    onChange={(e) => setFormStartDate(e.target.value)}
                    className="flex-1 h-[var(--btn-height)] px-3 border border-[var(--border)] rounded-lg bg-[var(--bg)] text-sm text-[var(--text)]"
                  />
                  <span className="text-[var(--text-secondary)] text-sm">~</span>
                  <input
                    type="date"
                    value={formEndDate}
                    onChange={(e) => setFormEndDate(e.target.value)}
                    className="flex-1 h-[var(--btn-height)] px-3 border border-[var(--border)] rounded-lg bg-[var(--bg)] text-sm text-[var(--text)]"
                  />
                </div>
              </div>

              {/* Priority */}
              <div>
                <label className="block text-sm font-medium text-[var(--text)] mb-1.5">우선순위</label>
                <input
                  type="number"
                  value={formPriority}
                  onChange={(e) => setFormPriority(Number(e.target.value))}
                  min={0}
                  className="w-full h-[var(--btn-height)] px-3 border border-[var(--border)] rounded-lg bg-[var(--bg)] text-sm text-[var(--text)]"
                />
                <p className="text-xs text-[var(--text-secondary)] mt-1">숫자가 낮을수록 먼저 표시됩니다</p>
              </div>

              {/* Allow hide today */}
              <div>
                <label className="block text-sm font-medium text-[var(--text)] mb-1.5">오늘 하루 안보기 허용</label>
                <button
                  onClick={() => setFormAllowHide(!formAllowHide)}
                  className="flex items-center gap-2 text-sm text-[var(--text)]"
                >
                  {formAllowHide ? (
                    <ToggleRight size={28} className="text-orange-600" />
                  ) : (
                    <ToggleLeft size={28} className="text-[var(--text-secondary)]" />
                  )}
                  <span>{formAllowHide ? '허용' : '비허용'}</span>
                </button>
              </div>

              {/* Target platform */}
              <div>
                <label className="block text-sm font-medium text-[var(--text)] mb-1.5">대상 플랫폼</label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formTargetShop}
                      onChange={(e) => setFormTargetShop(e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                    />
                    <span className="text-sm text-[var(--text)]">JINU Shop</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formTargetSupplier}
                      onChange={(e) => setFormTargetSupplier(e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                    />
                    <span className="text-sm text-[var(--text)]">Supplier Portal</span>
                  </label>
                </div>
              </div>

              {/* Popup size */}
              <div>
                <label className="block text-sm font-medium text-[var(--text)] mb-1.5">팝업 크기</label>
                <select
                  value={formPopupSize}
                  onChange={(e) => setFormPopupSize(e.target.value)}
                  className="w-full h-[var(--btn-height)] px-3 border border-[var(--border)] rounded-lg bg-[var(--bg)] text-sm text-[var(--text)]"
                >
                  <option value="소">소 (400px)</option>
                  <option value="중">중 (520px)</option>
                  <option value="대">대 (680px)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3 mt-8 pt-6 border-t border-[var(--border)]">
            <button
              onClick={() => setCreatePreviewOpen(true)}
              className="h-[var(--btn-height)] px-5 border border-[var(--border)] rounded-lg text-sm text-[var(--text)] hover:bg-gray-100 transition-colors flex items-center gap-2"
            >
              <Eye size={16} />
              미리보기
            </button>
            <div className="flex-1" />
            <button
              onClick={handleResetForm}
              className="h-[var(--btn-height)] px-5 border border-[var(--border)] rounded-lg text-sm text-[var(--text-secondary)] hover:bg-gray-100 transition-colors flex items-center gap-2"
            >
              <RefreshCw size={14} />
              초기화
            </button>
            <button
              onClick={handleCreateBanner}
              className="h-[var(--btn-height)] px-6 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors flex items-center gap-2"
            >
              <Plus size={16} />
              등록
            </button>
          </div>
        </div>

        {/* Preview modal for create form */}
        {renderPreviewModal(
          {
            id: 'PREVIEW',
            title: formTitle || '배너 제목',
            description: formDesc || '배너 설명이 여기에 표시됩니다.',
            type: formType,
            status: '예약',
            startDate: formStartDate || '2026-04-01',
            endDate: formEndDate || '2026-04-30',
            views: 0,
            clicks: 0,
            closeCount: 0,
            allowHideToday: formAllowHide,
            priority: formPriority,
            imageGradient: 'from-orange-500 to-amber-600',
          },
          createPreviewOpen,
          () => setCreatePreviewOpen(false)
        )}
      </div>
    );
  };

  // ==========================================================================
  // Render: Tab 3 - Schedule
  // ==========================================================================

  const renderScheduleTab = () => {
    const barColors: Record<string, string> = {
      '활성': 'bg-emerald-400',
      '예약': 'bg-blue-400',
    };

    return (
      <div className="space-y-6">
        {/* Weekly calendar view */}
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5">
          <h3 className="text-sm font-semibold text-[var(--text)] mb-4 flex items-center gap-2">
            <Calendar size={16} className="text-orange-600" />
            주간 스케줄 (2026.03.30 ~ 2026.04.05)
          </h3>

          {/* Header row */}
          <div className="grid grid-cols-8 gap-1 mb-2">
            <div className="text-xs text-[var(--text-secondary)] font-medium py-2 px-2">배너</div>
            {weekDays.map((day, i) => (
              <div
                key={day}
                className={`text-xs font-medium py-2 px-2 text-center rounded-lg ${
                  isToday(weekDates[i]) ? 'bg-orange-100 text-orange-700' : 'text-[var(--text-secondary)]'
                }`}
              >
                <div>{day}</div>
                <div className="text-[10px] mt-0.5">
                  {weekDates[i].getMonth() + 1}/{weekDates[i].getDate()}
                </div>
              </div>
            ))}
          </div>

          {/* Banner rows */}
          {scheduleBanners.map((banner) => (
            <div key={banner.id} className="grid grid-cols-8 gap-1 mb-1">
              <div className="text-xs text-[var(--text)] py-2 px-2 truncate flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${barColors[banner.status] || 'bg-gray-300'}`} />
                {banner.title}
              </div>
              {weekDates.map((date, i) => {
                const inRange = isInRange(banner, date);
                return (
                  <div
                    key={i}
                    className={`py-2 rounded-md ${
                      inRange
                        ? `${barColors[banner.status] || 'bg-gray-200'} ${
                            isToday(date) ? 'ring-2 ring-orange-500 ring-offset-1' : ''
                          }`
                        : 'bg-[var(--bg)]'
                    }`}
                  />
                );
              })}
            </div>
          ))}

          {scheduleBanners.length === 0 && (
            <p className="text-sm text-[var(--text-secondary)] text-center py-8">활성 또는 예약 배너가 없습니다.</p>
          )}
        </div>

        {/* Active schedule list */}
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5">
          <h3 className="text-sm font-semibold text-[var(--text)] mb-4 flex items-center gap-2">
            <GripVertical size={16} className="text-orange-600" />
            우선순위 관리
          </h3>
          <p className="text-xs text-[var(--text-secondary)] mb-4 flex items-start gap-1.5">
            <Info size={13} className="mt-0.5 shrink-0" />
            우선순위가 높은(숫자가 낮은) 배너가 먼저 표시됩니다. 동시 활성 배너가 여러 개일 경우 가장 높은 우선순위 배너만 팝업으로 표시됩니다.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border)]">
                  <th className="text-left py-3 px-3 text-xs font-medium text-[var(--text-secondary)]">순서</th>
                  <th className="text-left py-3 px-3 text-xs font-medium text-[var(--text-secondary)]">배너명</th>
                  <th className="text-left py-3 px-3 text-xs font-medium text-[var(--text-secondary)]">우선순위</th>
                  <th className="text-left py-3 px-3 text-xs font-medium text-[var(--text-secondary)]">시작일</th>
                  <th className="text-left py-3 px-3 text-xs font-medium text-[var(--text-secondary)]">종료일</th>
                  <th className="text-left py-3 px-3 text-xs font-medium text-[var(--text-secondary)]">남은일수</th>
                  <th className="text-left py-3 px-3 text-xs font-medium text-[var(--text-secondary)]">상태</th>
                </tr>
              </thead>
              <tbody>
                {scheduleBanners.map((banner, idx) => {
                  const remaining = getRemainingDays(banner.endDate);
                  return (
                    <tr key={banner.id} className="border-b border-[var(--border)] hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <GripVertical size={14} className="text-[var(--text-secondary)] cursor-grab" />
                          <span className="text-xs text-[var(--text-secondary)]">{idx + 1}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 font-medium text-[var(--text)]">{banner.title}</td>
                      <td className="py-3 px-3">
                        <span className="inline-flex items-center gap-1 text-xs bg-orange-50 text-orange-700 px-2 py-0.5 rounded-full">
                          <Hash size={11} />
                          {banner.priority}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-[var(--text-secondary)]">{banner.startDate}</td>
                      <td className="py-3 px-3 text-[var(--text-secondary)]">{banner.endDate}</td>
                      <td className="py-3 px-3">
                        <span className={`text-xs font-medium ${remaining <= 7 ? 'text-red-600' : 'text-[var(--text)]'}`}>
                          {remaining > 0 ? `${remaining}일` : '만료'}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <StatusBadge status={banner.status} colorMap={BANNER_STATUS_COLORS} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Display rules */}
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5">
          <h3 className="text-sm font-semibold text-[var(--text)] mb-4 flex items-center gap-2">
            <Monitor size={16} className="text-orange-600" />
            노출 규칙
          </h3>

          <div className="space-y-4">
            {/* Max simultaneous */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[var(--text)]">동시 표시 최대 배너 수</p>
                <p className="text-xs text-[var(--text-secondary)]">한 번에 팝업으로 표시할 수 있는 최대 배너 수</p>
              </div>
              <input
                type="number"
                value={maxSimultaneous}
                onChange={(e) => setMaxSimultaneous(Number(e.target.value))}
                min={1}
                max={5}
                className="w-20 h-[var(--btn-height)] px-3 border border-[var(--border)] rounded-lg bg-[var(--bg)] text-sm text-[var(--text)] text-center"
              />
            </div>

            {/* Non-logged-in toggle */}
            <div className="flex items-center justify-between border-t border-[var(--border)] pt-4">
              <div>
                <p className="text-sm font-medium text-[var(--text)]">비로그인 사용자에게 표시</p>
                <p className="text-xs text-[var(--text-secondary)]">로그인하지 않은 방문자에게도 팝업을 표시합니다</p>
              </div>
              <button
                onClick={() => setShowNonLoggedIn(!showNonLoggedIn)}
                className="transition-colors"
              >
                {showNonLoggedIn ? (
                  <ToggleRight size={28} className="text-orange-600" />
                ) : (
                  <ToggleLeft size={28} className="text-[var(--text-secondary)]" />
                )}
              </button>
            </div>

            {/* Mobile toggle */}
            <div className="flex items-center justify-between border-t border-[var(--border)] pt-4">
              <div>
                <p className="text-sm font-medium text-[var(--text)]">모바일에서 표시</p>
                <p className="text-xs text-[var(--text-secondary)]">모바일 화면에서 팝업 배너를 표시합니다</p>
              </div>
              <button
                onClick={() => setShowOnMobile(!showOnMobile)}
                className="transition-colors"
              >
                {showOnMobile ? (
                  <ToggleRight size={28} className="text-orange-600" />
                ) : (
                  <ToggleLeft size={28} className="text-[var(--text-secondary)]" />
                )}
              </button>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-[var(--border)] flex justify-end">
            <button
              onClick={() => showToast('노출 규칙이 저장되었습니다.')}
              className="h-[var(--btn-height)] px-5 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors"
            >
              규칙 저장
            </button>
          </div>
        </div>
      </div>
    );
  };

  // ==========================================================================
  // Render: Tab 4 - Stats
  // ==========================================================================

  const renderStatsTab = () => {
    const maxDailyViews = Math.max(...dailyStats.map((d) => d.views));
    const bannersWithViews = banners.filter((b) => b.views > 0).sort((a, b) => {
      const aCTR = a.views > 0 ? a.clicks / a.views : 0;
      const bCTR = b.views > 0 ? b.clicks / b.views : 0;
      return bCTR - aCTR;
    });

    return (
      <div className="space-y-6">
        {/* Summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={<Eye size={20} />}
            label="총 노출수"
            value={fmt(totalViews)}
            change="+15.2%"
            up={true}
          />
          <StatCard
            icon={<MousePointerClick size={20} />}
            label="총 클릭수"
            value={fmt(totalClicks)}
            change="+8.7%"
            up={true}
          />
          <StatCard
            icon={<TrendingUp size={20} />}
            label="평균 CTR"
            value={`${avgCTR}%`}
            change="+2.1%p"
            up={true}
          />
          <StatCard
            icon={<X size={20} />}
            label="평균 닫기율"
            value={`${avgCloseRate}%`}
            change="-1.3%p"
            up={false}
          />
        </div>

        {/* CTR comparison bar chart */}
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5">
          <h3 className="text-sm font-semibold text-[var(--text)] mb-4 flex items-center gap-2">
            <BarChart3 size={16} className="text-orange-600" />
            배너별 성과 비교 (CTR)
          </h3>

          <div className="space-y-3">
            {bannersWithViews.map((banner) => {
              const ctr = parseFloat(getCTR(banner.views, banner.clicks));
              const maxCTR = Math.max(...bannersWithViews.map((b) => parseFloat(getCTR(b.views, b.clicks))));
              const widthPct = maxCTR > 0 ? (ctr / maxCTR) * 100 : 0;

              return (
                <div key={banner.id} className="flex items-center gap-3">
                  <div className="w-40 shrink-0 text-xs text-[var(--text)] truncate">{banner.title}</div>
                  <div className="flex-1 bg-[var(--bg)] rounded-full h-6 relative overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-orange-400 to-orange-600 rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                      style={{ width: `${Math.max(widthPct, 8)}%` }}
                    >
                      <span className="text-[10px] font-medium text-white">{ctr}%</span>
                    </div>
                  </div>
                  <div className="w-12 text-right">
                    <StatusBadge status={banner.type} colorMap={BANNER_TYPE_COLORS} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Daily views/clicks chart */}
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5">
          <h3 className="text-sm font-semibold text-[var(--text)] mb-4 flex items-center gap-2">
            <TrendingUp size={16} className="text-orange-600" />
            일별 노출/클릭 추이 (14일)
          </h3>

          {/* Legend */}
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm bg-orange-400" />
              <span className="text-xs text-[var(--text-secondary)]">노출수</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm bg-blue-500" />
              <span className="text-xs text-[var(--text-secondary)]">클릭수</span>
            </div>
          </div>

          <div className="flex items-end gap-1.5 h-48">
            {dailyStats.map((day, i) => {
              const viewHeight = maxDailyViews > 0 ? (day.views / maxDailyViews) * 100 : 0;
              const clickHeight = maxDailyViews > 0 ? (day.clicks / maxDailyViews) * 100 : 0;

              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
                  <div className="w-full flex items-end justify-center gap-[2px]" style={{ height: '160px' }}>
                    <div
                      className="flex-1 bg-orange-400 rounded-t-sm max-w-[14px] transition-all"
                      style={{ height: `${viewHeight}%` }}
                      title={`노출: ${fmt(day.views)}`}
                    />
                    <div
                      className="flex-1 bg-blue-500 rounded-t-sm max-w-[14px] transition-all"
                      style={{ height: `${clickHeight}%` }}
                      title={`클릭: ${fmt(day.clicks)}`}
                    />
                  </div>
                  <span className="text-[9px] text-[var(--text-secondary)] mt-1">{day.date}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Best performing banner */}
        {bestBanner && (
          <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-[var(--text)] mb-3 flex items-center gap-2">
              <TrendingUp size={16} className="text-orange-600" />
              최고 성과 배너
            </h3>
            <div className="flex items-center gap-4">
              <div className={`w-20 h-14 rounded-lg bg-gradient-to-br ${bestBanner.imageGradient} flex items-center justify-center`}>
                <Image size={20} className="text-white" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-[var(--text)]">{bestBanner.title}</h4>
                <p className="text-xs text-[var(--text-secondary)] mt-0.5">{bestBanner.description}</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-orange-600">{getCTR(bestBanner.views, bestBanner.clicks)}%</div>
                <div className="text-xs text-[var(--text-secondary)]">CTR</div>
              </div>
            </div>
          </div>
        )}

        {/* Performance table */}
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5">
          <h3 className="text-sm font-semibold text-[var(--text)] mb-4 flex items-center gap-2">
            <BarChart3 size={16} className="text-orange-600" />
            배너 성과 테이블
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border)]">
                  <th className="text-left py-3 px-3 text-xs font-medium text-[var(--text-secondary)]">배너명</th>
                  <th className="text-left py-3 px-3 text-xs font-medium text-[var(--text-secondary)]">유형</th>
                  <th className="text-right py-3 px-3 text-xs font-medium text-[var(--text-secondary)]">노출수</th>
                  <th className="text-right py-3 px-3 text-xs font-medium text-[var(--text-secondary)]">클릭수</th>
                  <th className="text-right py-3 px-3 text-xs font-medium text-[var(--text-secondary)]">CTR(%)</th>
                  <th className="text-right py-3 px-3 text-xs font-medium text-[var(--text-secondary)]">닫기수</th>
                  <th className="text-right py-3 px-3 text-xs font-medium text-[var(--text-secondary)]">닫기율(%)</th>
                  <th className="text-right py-3 px-3 text-xs font-medium text-[var(--text-secondary)]">전환수</th>
                </tr>
              </thead>
              <tbody>
                {banners
                  .filter((b) => b.views > 0)
                  .sort((a, b) => b.views - a.views)
                  .map((banner) => {
                    const ctr = getCTR(banner.views, banner.clicks);
                    const closeRate = getCloseRate(banner.views, banner.closeCount);
                    const conversions = Math.round(banner.clicks * 0.12); // mock 12% conversion

                    return (
                      <tr key={banner.id} className="border-b border-[var(--border)] hover:bg-gray-50 transition-colors">
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2">
                            <div className={`w-8 h-6 rounded bg-gradient-to-br ${banner.imageGradient}`} />
                            <span className="font-medium text-[var(--text)]">{banner.title}</span>
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <StatusBadge status={banner.type} colorMap={BANNER_TYPE_COLORS} />
                        </td>
                        <td className="py-3 px-3 text-right text-[var(--text)]">{fmt(banner.views)}</td>
                        <td className="py-3 px-3 text-right text-[var(--text)]">{fmt(banner.clicks)}</td>
                        <td className="py-3 px-3 text-right">
                          <span className={`font-medium ${parseFloat(ctr) >= 20 ? 'text-emerald-600' : parseFloat(ctr) >= 10 ? 'text-blue-600' : 'text-[var(--text)]'}`}>
                            {ctr}%
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right text-[var(--text)]">{fmt(banner.closeCount)}</td>
                        <td className="py-3 px-3 text-right text-[var(--text-secondary)]">{closeRate}%</td>
                        <td className="py-3 px-3 text-right text-[var(--text)]">{fmt(conversions)}</td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // ==========================================================================
  // Main Render
  // ==========================================================================

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--text)]">배너 관리</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          JINU Shop 대시보드에 표시되는 팝업 배너를 관리합니다.
        </p>
      </div>

      {/* Tabs */}
      <AdminTabs tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Tab content */}
      {activeTab === 'list' && renderListTab()}
      {activeTab === 'create' && renderCreateTab()}
      {activeTab === 'schedule' && renderScheduleTab()}
      {activeTab === 'stats' && renderStatsTab()}

      {/* Preview modal (Tab 1) */}
      {renderPreviewModal(previewBanner, !!previewBanner, () => setPreviewBanner(null))}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-gray-900 text-white px-5 py-3 rounded-xl shadow-lg text-sm flex items-center gap-2 animate-in slide-in-from-bottom-2">
          <CheckCircle size={16} className="text-emerald-400" />
          {toast}
        </div>
      )}
    </div>
  );
}
