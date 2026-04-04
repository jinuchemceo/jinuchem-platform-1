'use client';

import { useState, useMemo } from 'react';
import {
  Ticket,
  Plus,
  Edit,
  Trash2,
  Eye,
  Copy,
  Search,
  Filter,
  Calendar,
  Percent,
  DollarSign,
  TrendingUp,
  BarChart3,
  Tag,
  Zap,
  Users,
  ShoppingCart,
  Award,
  Clock,
  CheckCircle,
  XCircle,
  Pause,
  Gift,
  Megaphone,
  Hash,
  RefreshCw,
  Download,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { AdminTabs } from '@/components/shared/AdminTabs';
import { Modal } from '@/components/shared/Modal';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Pagination } from '@/components/shared/Pagination';
import { StatCard } from '@/components/shared/StatCard';

// =============================================================================
// Constants
// =============================================================================

const ITEMS_PER_PAGE = 8;

const TABS = [
  { id: 'coupons', label: '쿠폰 관리' },
  { id: 'campaigns', label: '프로모션 캠페인' },
  { id: 'codes', label: '할인코드 관리' },
  { id: 'stats', label: '프로모션 성과' },
];

const COUPON_STATUS_COLORS: Record<string, string> = {
  '활성': 'emerald',
  '만료': 'gray',
  '중지': 'red',
};

const COUPON_TYPE_COLORS: Record<string, string> = {
  '정액': 'blue',
  '정률': 'purple',
};

const CAMPAIGN_TYPE_COLORS: Record<string, string> = {
  '기간한정': 'blue',
  '대량구매': 'purple',
  '신규가입': 'emerald',
  '시즌': 'amber',
};

const CAMPAIGN_STATUS_COLORS: Record<string, string> = {
  '진행중': 'emerald',
  '예약': 'blue',
  '종료': 'gray',
};

const CODE_STATUS_COLORS: Record<string, string> = {
  '활성': 'emerald',
  '만료': 'gray',
  '소진': 'red',
};

const fmt = (n: number) => n.toLocaleString('ko-KR');

// =============================================================================
// Mock Data: Coupons
// =============================================================================

interface Coupon {
  id: string;
  name: string;
  discountType: '정액' | '정률';
  discountValue: number;
  minOrderAmount: number;
  maxDiscountAmount: number | null;
  issuedCount: number;
  usedCount: number;
  startDate: string;
  endDate: string;
  status: '활성' | '만료' | '중지';
  target: string;
}

const mockCoupons: Coupon[] = [
  {
    id: 'CPN-001', name: '신규가입 할인', discountType: '정액', discountValue: 10000,
    minOrderAmount: 50000, maxDiscountAmount: null, issuedCount: 450, usedCount: 182,
    startDate: '2026-01-01', endDate: '2026-06-30', status: '활성', target: '전체',
  },
  {
    id: 'CPN-002', name: '첫구매 10% 쿠폰', discountType: '정률', discountValue: 10,
    minOrderAmount: 100000, maxDiscountAmount: 50000, issuedCount: 320, usedCount: 98,
    startDate: '2026-01-15', endDate: '2026-07-15', status: '활성', target: '전체',
  },
  {
    id: 'CPN-003', name: '대량주문 할인', discountType: '정률', discountValue: 15,
    minOrderAmount: 500000, maxDiscountAmount: 200000, issuedCount: 85, usedCount: 42,
    startDate: '2026-02-01', endDate: '2026-08-31', status: '활성', target: '전체',
  },
  {
    id: 'CPN-004', name: '시약 전문 할인', discountType: '정액', discountValue: 20000,
    minOrderAmount: 200000, maxDiscountAmount: null, issuedCount: 200, usedCount: 67,
    startDate: '2026-01-01', endDate: '2026-12-31', status: '활성', target: '시약 카테고리',
  },
  {
    id: 'CPN-005', name: '기관 특별 쿠폰', discountType: '정률', discountValue: 20,
    minOrderAmount: 1000000, maxDiscountAmount: 500000, issuedCount: 30, usedCount: 18,
    startDate: '2026-03-01', endDate: '2026-09-30', status: '활성', target: '특정 기관',
  },
  {
    id: 'CPN-006', name: '봄맞이 특별 할인', discountType: '정액', discountValue: 15000,
    minOrderAmount: 100000, maxDiscountAmount: null, issuedCount: 500, usedCount: 234,
    startDate: '2026-03-01', endDate: '2026-03-31', status: '만료', target: '전체',
  },
  {
    id: 'CPN-007', name: '소모품 전용 쿠폰', discountType: '정률', discountValue: 8,
    minOrderAmount: 50000, maxDiscountAmount: 30000, issuedCount: 180, usedCount: 55,
    startDate: '2026-02-15', endDate: '2026-05-15', status: '활성', target: '소모품 카테고리',
  },
  {
    id: 'CPN-008', name: '재구매 감사 쿠폰', discountType: '정액', discountValue: 30000,
    minOrderAmount: 300000, maxDiscountAmount: null, issuedCount: 150, usedCount: 89,
    startDate: '2026-01-01', endDate: '2026-06-30', status: '활성', target: '재구매 고객',
  },
  {
    id: 'CPN-009', name: '2025 연말 특가', discountType: '정률', discountValue: 25,
    minOrderAmount: 200000, maxDiscountAmount: 100000, issuedCount: 280, usedCount: 280,
    startDate: '2025-11-01', endDate: '2025-12-31', status: '만료', target: '전체',
  },
  {
    id: 'CPN-010', name: 'VIP 회원 전용', discountType: '정률', discountValue: 12,
    minOrderAmount: 150000, maxDiscountAmount: 80000, issuedCount: 145, usedCount: 0,
    startDate: '2026-04-01', endDate: '2026-04-30', status: '중지', target: 'VIP 회원',
  },
];

// =============================================================================
// Mock Data: Campaigns
// =============================================================================

interface Campaign {
  id: string;
  name: string;
  type: '기간한정' | '대량구매' | '신규가입' | '시즌';
  description: string;
  discountSummary: string;
  startDate: string;
  endDate: string;
  participants: number;
  salesImpact: number;
  status: '진행중' | '예약' | '종료';
  targetAudience: string;
  rules: string;
}

const mockCampaigns: Campaign[] = [
  {
    id: 'CMP-001', name: '2026 봄학기 연구실 세팅 프로모션', type: '시즌',
    description: '신학기 연구실 세팅에 필요한 시약/소모품 대상 특별 할인 캠페인',
    discountSummary: '전 품목 15% 할인', startDate: '2026-03-01', endDate: '2026-04-30',
    participants: 342, salesImpact: 18500000, status: '진행중',
    targetAudience: '대학교 연구실', rules: '최소 주문금액 200,000원 이상, 1회 최대 할인 300,000원',
  },
  {
    id: 'CMP-002', name: '대량구매 할인 페스티벌', type: '대량구매',
    description: '500만원 이상 대량 주문 시 추가 할인 + 무료배송 혜택',
    discountSummary: '500만 이상 20% + 무료배송', startDate: '2026-04-01', endDate: '2026-04-15',
    participants: 28, salesImpact: 45200000, status: '진행중',
    targetAudience: '기업 연구소', rules: '주문 금액 500만원 이상, 시약/소모품 전 품목 적용',
  },
  {
    id: 'CMP-003', name: '신규가입 웰컴 이벤트', type: '신규가입',
    description: '신규 회원가입 후 첫 주문 시 특별 할인 혜택 제공',
    discountSummary: '첫 주문 20% + 무료배송', startDate: '2026-01-01', endDate: '2026-12-31',
    participants: 567, salesImpact: 12300000, status: '진행중',
    targetAudience: '신규 회원', rules: '가입 후 30일 이내 첫 주문, 최대 할인 50,000원',
  },
  {
    id: 'CMP-004', name: '여름 실험시즌 특별전', type: '시즌',
    description: '여름 실험 시즌 대비 인기 시약 및 소모품 특가 판매',
    discountSummary: '인기 100종 최대 30% 할인', startDate: '2026-06-01', endDate: '2026-08-31',
    participants: 0, salesImpact: 0, status: '예약',
    targetAudience: '전체 회원', rules: '선정 100종 품목 한정, 재고 소진 시 종료',
  },
  {
    id: 'CMP-005', name: '기관 연간 계약 할인', type: '대량구매',
    description: '연간 구매 계약 체결 기관 대상 상시 할인 프로그램',
    discountSummary: '연간 계약 시 10~25% 할인', startDate: '2026-01-01', endDate: '2026-12-31',
    participants: 15, salesImpact: 89000000, status: '진행중',
    targetAudience: '계약 기관', rules: '연간 최소 구매금액 2,000만원 이상',
  },
  {
    id: 'CMP-006', name: '2025 연말 결산 세일', type: '기간한정',
    description: '2025년 연말 재고 소진 및 결산 특가 이벤트',
    discountSummary: '재고 상품 최대 50% 할인', startDate: '2025-12-01', endDate: '2025-12-31',
    participants: 892, salesImpact: 32100000, status: '종료',
    targetAudience: '전체 회원', rules: '재고 한정, 교환/반품 불가',
  },
  {
    id: 'CMP-007', name: '추석맞이 감사 이벤트', type: '기간한정',
    description: '추석 연휴 전 특별 할인 및 사은품 증정 이벤트',
    discountSummary: '전 품목 10% + 사은품', startDate: '2026-09-15', endDate: '2026-09-25',
    participants: 0, salesImpact: 0, status: '예약',
    targetAudience: '전체 회원', rules: '100,000원 이상 주문 시 사은품 증정',
  },
  {
    id: 'CMP-008', name: '연구비 집행 시즌 특가', type: '기간한정',
    description: '연말 연구비 집행 시즌 대상 특별 할인',
    discountSummary: '300만 이상 15% 추가 할인', startDate: '2025-10-01', endDate: '2025-11-30',
    participants: 423, salesImpact: 56700000, status: '종료',
    targetAudience: '대학교/연구기관', rules: '연구비 증빙 가능 기관 한정',
  },
];

// =============================================================================
// Mock Data: Discount Codes
// =============================================================================

interface DiscountCode {
  id: string;
  code: string;
  discountType: '정액' | '정률';
  discountValue: number;
  usedCount: number;
  usageLimit: number;
  createdAt: string;
  expiresAt: string;
  status: '활성' | '만료' | '소진';
}

const mockDiscountCodes: DiscountCode[] = [
  { id: 'DC-001', code: 'JINU-WELC-2026', discountType: '정액', discountValue: 10000, usedCount: 156, usageLimit: 500, createdAt: '2026-01-01', expiresAt: '2026-06-30', status: '활성' },
  { id: 'DC-002', code: 'JINU-SPRG-A1B2', discountType: '정률', discountValue: 15, usedCount: 89, usageLimit: 200, createdAt: '2026-03-01', expiresAt: '2026-04-30', status: '활성' },
  { id: 'DC-003', code: 'JINU-BULK-X9Y8', discountType: '정률', discountValue: 20, usedCount: 34, usageLimit: 50, createdAt: '2026-02-15', expiresAt: '2026-05-15', status: '활성' },
  { id: 'DC-004', code: 'JINU-VIP1-K3L4', discountType: '정액', discountValue: 50000, usedCount: 12, usageLimit: 30, createdAt: '2026-01-15', expiresAt: '2026-12-31', status: '활성' },
  { id: 'DC-005', code: 'JINU-FREE-SHIP', discountType: '정액', discountValue: 5000, usedCount: 300, usageLimit: 300, createdAt: '2026-01-01', expiresAt: '2026-03-31', status: '소진' },
  { id: 'DC-006', code: 'JINU-NEWB-M5N6', discountType: '정률', discountValue: 10, usedCount: 45, usageLimit: 100, createdAt: '2026-02-01', expiresAt: '2026-07-31', status: '활성' },
  { id: 'DC-007', code: 'JINU-XMAS-2025', discountType: '정률', discountValue: 25, usedCount: 200, usageLimit: 200, createdAt: '2025-12-01', expiresAt: '2025-12-31', status: '만료' },
  { id: 'DC-008', code: 'JINU-LAB0-P7Q8', discountType: '정액', discountValue: 30000, usedCount: 67, usageLimit: 150, createdAt: '2026-03-15', expiresAt: '2026-06-15', status: '활성' },
  { id: 'DC-009', code: 'JINU-SMPL-R1S2', discountType: '정액', discountValue: 8000, usedCount: 210, usageLimit: 250, createdAt: '2026-01-20', expiresAt: '2026-04-20', status: '활성' },
  { id: 'DC-010', code: 'JINU-INST-T3U4', discountType: '정률', discountValue: 18, usedCount: 100, usageLimit: 100, createdAt: '2025-11-01', expiresAt: '2026-02-28', status: '소진' },
  { id: 'DC-011', code: 'JINU-FALL-V5W6', discountType: '정률', discountValue: 12, usedCount: 78, usageLimit: 120, createdAt: '2025-09-01', expiresAt: '2025-11-30', status: '만료' },
  { id: 'DC-012', code: 'JINU-APRIL-Z9A0', discountType: '정액', discountValue: 15000, usedCount: 23, usageLimit: 200, createdAt: '2026-04-01', expiresAt: '2026-04-30', status: '활성' },
];

// =============================================================================
// Mock Data: Performance Stats
// =============================================================================

interface MonthlyDiscount {
  month: string;
  coupon: number;
  promotion: number;
  code: number;
}

const mockMonthlyDiscounts: MonthlyDiscount[] = [
  { month: '2025-11', coupon: 3200000, promotion: 4500000, code: 1800000 },
  { month: '2025-12', coupon: 4800000, promotion: 6200000, code: 2400000 },
  { month: '2026-01', coupon: 3900000, promotion: 5100000, code: 2100000 },
  { month: '2026-02', coupon: 4100000, promotion: 5800000, code: 1900000 },
  { month: '2026-03', coupon: 5200000, promotion: 7300000, code: 2800000 },
  { month: '2026-04', coupon: 4500000, promotion: 6400000, code: 2200000 },
];

interface DiscountTypeBreakdown {
  type: string;
  amount: number;
  count: number;
  color: string;
}

const mockDiscountTypes: DiscountTypeBreakdown[] = [
  { type: '정액할인', amount: 18500000, count: 1245, color: 'bg-orange-500' },
  { type: '정률할인', amount: 15800000, count: 892, color: 'bg-purple-500' },
  { type: '무료배송', amount: 6200000, count: 2340, color: 'bg-blue-500' },
  { type: '사은품', amount: 4730000, count: 567, color: 'bg-emerald-500' },
];

interface TopPromotion {
  name: string;
  usageCount: number;
  totalDiscount: number;
  salesContribution: number;
  roi: number;
}

const mockTopPromotions: TopPromotion[] = [
  { name: '기관 연간 계약 할인', usageCount: 1523, totalDiscount: 12400000, salesContribution: 89000000, roi: 7.2 },
  { name: '대량구매 할인 페스티벌', usageCount: 892, totalDiscount: 8900000, salesContribution: 45200000, roi: 5.1 },
  { name: '연말 결산 세일', usageCount: 2134, totalDiscount: 7800000, salesContribution: 32100000, roi: 4.1 },
  { name: '봄학기 연구실 세팅', usageCount: 1245, totalDiscount: 5600000, salesContribution: 18500000, roi: 3.3 },
  { name: '신규가입 웰컴 이벤트', usageCount: 567, totalDiscount: 4200000, salesContribution: 12300000, roi: 2.9 },
  { name: '재구매 감사 쿠폰', usageCount: 345, totalDiscount: 3100000, salesContribution: 8900000, roi: 2.4 },
];

// =============================================================================
// Coupon Create Modal Form
// =============================================================================

interface CouponForm {
  name: string;
  discountType: '정액' | '정률';
  discountValue: string;
  minOrderAmount: string;
  maxDiscountAmount: string;
  issuedCount: string;
  startDate: string;
  endDate: string;
  target: string;
}

const defaultCouponForm = (): CouponForm => ({
  name: '',
  discountType: '정액',
  discountValue: '',
  minOrderAmount: '',
  maxDiscountAmount: '',
  issuedCount: '',
  startDate: '',
  endDate: '',
  target: '전체',
});

// =============================================================================
// Code Generate Modal Form
// =============================================================================

interface CodeForm {
  prefix: string;
  count: string;
  discountType: '정액' | '정률';
  discountValue: string;
  usageLimit: string;
  expiresAt: string;
}

const defaultCodeForm = (): CodeForm => ({
  prefix: 'JINU',
  count: '10',
  discountType: '정액',
  discountValue: '',
  usageLimit: '',
  expiresAt: '',
});

// =============================================================================
// Main Component
// =============================================================================

export default function PromotionsPage() {
  // ---------------------------------------------------------------------------
  // Shared State
  // ---------------------------------------------------------------------------
  const [activeTab, setActiveTab] = useState('coupons');
  const [searchQuery, setSearchQuery] = useState('');

  // Coupons
  const [couponPage, setCouponPage] = useState(1);
  const [couponStatusFilter, setCouponStatusFilter] = useState('전체');
  const [couponModal, setCouponModal] = useState(false);
  const [couponForm, setCouponForm] = useState<CouponForm>(defaultCouponForm());

  // Campaigns
  const [campaignPage, setCampaignPage] = useState(1);
  const [campaignStatusFilter, setCampaignStatusFilter] = useState('전체');
  const [campaignDetailModal, setCampaignDetailModal] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);

  // Codes
  const [codePage, setCodePage] = useState(1);
  const [codeStatusFilter, setCodeStatusFilter] = useState('전체');
  const [codeModal, setCodeModal] = useState(false);
  const [codeForm, setCodeForm] = useState<CodeForm>(defaultCodeForm());
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // ---------------------------------------------------------------------------
  // Filtered Data
  // ---------------------------------------------------------------------------
  const filteredCoupons = useMemo(() => {
    return mockCoupons.filter((c) => {
      const matchSearch = !searchQuery ||
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus = couponStatusFilter === '전체' || c.status === couponStatusFilter;
      return matchSearch && matchStatus;
    });
  }, [searchQuery, couponStatusFilter]);

  const couponTotalPages = Math.ceil(filteredCoupons.length / ITEMS_PER_PAGE);
  const paginatedCoupons = filteredCoupons.slice(
    (couponPage - 1) * ITEMS_PER_PAGE,
    couponPage * ITEMS_PER_PAGE,
  );

  const filteredCampaigns = useMemo(() => {
    return mockCampaigns.filter((c) => {
      const matchSearch = !searchQuery ||
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus = campaignStatusFilter === '전체' || c.status === campaignStatusFilter;
      return matchSearch && matchStatus;
    });
  }, [searchQuery, campaignStatusFilter]);

  const campaignTotalPages = Math.ceil(filteredCampaigns.length / ITEMS_PER_PAGE);
  const paginatedCampaigns = filteredCampaigns.slice(
    (campaignPage - 1) * ITEMS_PER_PAGE,
    campaignPage * ITEMS_PER_PAGE,
  );

  const filteredCodes = useMemo(() => {
    return mockDiscountCodes.filter((c) => {
      const matchSearch = !searchQuery ||
        c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus = codeStatusFilter === '전체' || c.status === codeStatusFilter;
      return matchSearch && matchStatus;
    });
  }, [searchQuery, codeStatusFilter]);

  const codeTotalPages = Math.ceil(filteredCodes.length / ITEMS_PER_PAGE);
  const paginatedCodes = filteredCodes.slice(
    (codePage - 1) * ITEMS_PER_PAGE,
    codePage * ITEMS_PER_PAGE,
  );

  // ---------------------------------------------------------------------------
  // Handlers
  // ---------------------------------------------------------------------------
  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code).catch(() => {});
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleOpenCampaignDetail = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setCampaignDetailModal(true);
  };

  // Active campaign for highlight
  const activeCampaign = mockCampaigns.find((c) => c.status === '진행중');
  const activeCampaignDaysLeft = activeCampaign
    ? Math.max(0, Math.ceil((new Date(activeCampaign.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : 0;
  const activeCampaignTotalDays = activeCampaign
    ? Math.max(1, Math.ceil((new Date(activeCampaign.endDate).getTime() - new Date(activeCampaign.startDate).getTime()) / (1000 * 60 * 60 * 24)))
    : 1;
  const activeCampaignProgress = activeCampaign
    ? Math.round(((activeCampaignTotalDays - activeCampaignDaysLeft) / activeCampaignTotalDays) * 100)
    : 0;

  // Chart max value
  const chartMax = Math.max(
    ...mockMonthlyDiscounts.map((d) => d.coupon + d.promotion + d.code),
  );
  const discountTypeMax = Math.max(...mockDiscountTypes.map((d) => d.amount));
  const topPromoMaxROI = Math.max(...mockTopPromotions.map((p) => p.roi));

  // ===========================================================================
  // Render
  // ===========================================================================
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text)]">프로모션 관리</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            쿠폰, 할인 캠페인, 할인코드를 관리하고 성과를 분석합니다
          </p>
        </div>
      </div>

      {/* Tabs */}
      <AdminTabs tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} />

      {/* ===================================================================== */}
      {/* TAB: 쿠폰 관리 */}
      {/* ===================================================================== */}
      {activeTab === 'coupons' && (
        <div className="space-y-6">
          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              icon={<Ticket size={20} />}
              label="활성 쿠폰"
              value="12"
              change="+2 전월 대비"
              up={true}
              prefix=""
            />
            <StatCard
              icon={<Tag size={20} />}
              label="발급 쿠폰"
              value="2,340"
              change="+18.5%"
              up={true}
              prefix=""
            />
            <StatCard
              icon={<TrendingUp size={20} />}
              label="사용율"
              value="34.2%"
              change="+5.1%p"
              up={true}
              prefix=""
            />
            <StatCard
              icon={<DollarSign size={20} />}
              label="할인 총액"
              value="12,450,000"
              change="+12.3%"
              up={true}
              prefix=""
            />
          </div>

          {/* Toolbar */}
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3 flex-1">
              <div className="relative flex-1 max-w-sm">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
                <input
                  type="text"
                  placeholder="쿠폰명, ID 검색..."
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setCouponPage(1); }}
                  className="w-full h-[var(--btn-height)] pl-9 pr-4 text-sm rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-orange-500/30"
                />
              </div>
              <select
                value={couponStatusFilter}
                onChange={(e) => { setCouponStatusFilter(e.target.value); setCouponPage(1); }}
                className="h-[var(--btn-height)] px-3 text-sm rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--text)]"
              >
                <option value="전체">전체 상태</option>
                <option value="활성">활성</option>
                <option value="만료">만료</option>
                <option value="중지">중지</option>
              </select>
            </div>
            <button
              onClick={() => { setCouponForm(defaultCouponForm()); setCouponModal(true); }}
              className="h-[var(--btn-height)] px-4 bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium rounded-lg flex items-center gap-2 transition-colors"
            >
              <Plus size={16} />
              쿠폰 생성
            </button>
          </div>

          {/* Coupon Table */}
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--border)] bg-gray-50/50">
                    <th className="text-left px-4 py-3 font-medium text-[var(--text-secondary)]">쿠폰명</th>
                    <th className="text-left px-4 py-3 font-medium text-[var(--text-secondary)]">할인유형</th>
                    <th className="text-right px-4 py-3 font-medium text-[var(--text-secondary)]">할인값</th>
                    <th className="text-right px-4 py-3 font-medium text-[var(--text-secondary)]">최소주문금액</th>
                    <th className="text-center px-4 py-3 font-medium text-[var(--text-secondary)]">발급/사용</th>
                    <th className="text-center px-4 py-3 font-medium text-[var(--text-secondary)]">유효기간</th>
                    <th className="text-center px-4 py-3 font-medium text-[var(--text-secondary)]">상태</th>
                    <th className="text-center px-4 py-3 font-medium text-[var(--text-secondary)]">관리</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedCoupons.map((coupon) => (
                    <tr key={coupon.id} className="border-b border-[var(--border)] last:border-b-0 hover:bg-gray-50/30 transition-colors">
                      <td className="px-4 py-3">
                        <div className="font-medium text-[var(--text)]">{coupon.name}</div>
                        <div className="text-xs text-[var(--text-secondary)]">{coupon.id}</div>
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={coupon.discountType} colorMap={COUPON_TYPE_COLORS} />
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-[var(--text)]">
                        {coupon.discountType === '정액'
                          ? `${fmt(coupon.discountValue)}원`
                          : `${coupon.discountValue}%`}
                      </td>
                      <td className="px-4 py-3 text-right text-[var(--text)]">
                        {fmt(coupon.minOrderAmount)}원
                      </td>
                      <td className="px-4 py-3 text-center text-[var(--text)]">
                        <span className="font-medium">{fmt(coupon.usedCount)}</span>
                        <span className="text-[var(--text-secondary)]"> / {fmt(coupon.issuedCount)}</span>
                      </td>
                      <td className="px-4 py-3 text-center text-xs text-[var(--text-secondary)]">
                        {coupon.startDate} ~ {coupon.endDate}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <StatusBadge status={coupon.status} colorMap={COUPON_STATUS_COLORS} />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => {
                              setCouponForm({
                                name: coupon.name,
                                discountType: coupon.discountType,
                                discountValue: String(coupon.discountValue),
                                minOrderAmount: String(coupon.minOrderAmount),
                                maxDiscountAmount: coupon.maxDiscountAmount ? String(coupon.maxDiscountAmount) : '',
                                issuedCount: String(coupon.issuedCount),
                                startDate: coupon.startDate,
                                endDate: coupon.endDate,
                                target: coupon.target,
                              });
                              setCouponModal(true);
                            }}
                            className="w-7 h-7 flex items-center justify-center rounded-md text-[var(--text-secondary)] hover:bg-gray-100 transition-colors"
                          >
                            <Edit size={14} />
                          </button>
                          <button
                            onClick={() => alert(`쿠폰 "${coupon.name}" 상태를 ${coupon.status === '중지' ? '활성' : '중지'}(으)로 변경합니다.`)}
                            className="w-7 h-7 flex items-center justify-center rounded-md text-[var(--text-secondary)] hover:bg-gray-100 transition-colors"
                          >
                            {coupon.status === '중지' ? <CheckCircle size={14} /> : <Pause size={14} />}
                          </button>
                          <button
                            onClick={() => { if (confirm(`쿠폰 "${coupon.name}"을(를) 삭제하시겠습니까?`)) { /* delete logic */ } }}
                            className="w-7 h-7 flex items-center justify-center rounded-md text-red-400 hover:bg-red-50 transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {paginatedCoupons.length === 0 && (
                    <tr>
                      <td colSpan={8} className="px-4 py-12 text-center text-[var(--text-secondary)]">
                        검색 결과가 없습니다
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          <Pagination currentPage={couponPage} totalPages={couponTotalPages} onPageChange={setCouponPage} />
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB: 프로모션 캠페인 */}
      {/* ===================================================================== */}
      {activeTab === 'campaigns' && (
        <div className="space-y-6">
          {/* Active Campaign Highlight */}
          {activeCampaign && (
            <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center text-orange-600">
                    <Megaphone size={20} />
                  </div>
                  <div>
                    <div className="text-xs text-[var(--text-secondary)] mb-0.5">현재 진행중인 캠페인</div>
                    <h3 className="font-semibold text-[var(--text)]">{activeCampaign.name}</h3>
                  </div>
                </div>
                <StatusBadge status={activeCampaign.type} colorMap={CAMPAIGN_TYPE_COLORS} />
              </div>
              <p className="text-sm text-[var(--text-secondary)] mb-4">{activeCampaign.description}</p>
              <div className="flex items-center gap-6 mb-3 text-sm">
                <div className="flex items-center gap-1.5 text-[var(--text-secondary)]">
                  <Calendar size={14} />
                  <span>{activeCampaign.startDate} ~ {activeCampaign.endDate}</span>
                </div>
                <div className="flex items-center gap-1.5 text-[var(--text-secondary)]">
                  <Users size={14} />
                  <span>참여 {fmt(activeCampaign.participants)}명</span>
                </div>
                <div className="flex items-center gap-1.5 text-[var(--text-secondary)]">
                  <ShoppingCart size={14} />
                  <span>매출 영향 {fmt(activeCampaign.salesImpact)}원</span>
                </div>
              </div>
              {/* Progress Bar */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs text-[var(--text-secondary)]">
                  <span>캠페인 진행률</span>
                  <span>{activeCampaignDaysLeft}일 남음 ({activeCampaignProgress}%)</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-orange-500 rounded-full transition-all"
                    style={{ width: `${activeCampaignProgress}%` }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Toolbar */}
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3 flex-1">
              <div className="relative flex-1 max-w-sm">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
                <input
                  type="text"
                  placeholder="캠페인명 검색..."
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setCampaignPage(1); }}
                  className="w-full h-[var(--btn-height)] pl-9 pr-4 text-sm rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-orange-500/30"
                />
              </div>
              <select
                value={campaignStatusFilter}
                onChange={(e) => { setCampaignStatusFilter(e.target.value); setCampaignPage(1); }}
                className="h-[var(--btn-height)] px-3 text-sm rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--text)]"
              >
                <option value="전체">전체 상태</option>
                <option value="진행중">진행중</option>
                <option value="예약">예약</option>
                <option value="종료">종료</option>
              </select>
            </div>
            <button
              onClick={() => alert('캠페인 생성 기능은 준비 중입니다.')}
              className="h-[var(--btn-height)] px-4 bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium rounded-lg flex items-center gap-2 transition-colors"
            >
              <Plus size={16} />
              캠페인 생성
            </button>
          </div>

          {/* Campaign Table */}
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--border)] bg-gray-50/50">
                    <th className="text-left px-4 py-3 font-medium text-[var(--text-secondary)]">캠페인명</th>
                    <th className="text-center px-4 py-3 font-medium text-[var(--text-secondary)]">유형</th>
                    <th className="text-left px-4 py-3 font-medium text-[var(--text-secondary)]">할인내용</th>
                    <th className="text-center px-4 py-3 font-medium text-[var(--text-secondary)]">기간</th>
                    <th className="text-right px-4 py-3 font-medium text-[var(--text-secondary)]">참여수</th>
                    <th className="text-right px-4 py-3 font-medium text-[var(--text-secondary)]">매출영향</th>
                    <th className="text-center px-4 py-3 font-medium text-[var(--text-secondary)]">상태</th>
                    <th className="text-center px-4 py-3 font-medium text-[var(--text-secondary)]">관리</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedCampaigns.map((campaign) => (
                    <tr key={campaign.id} className="border-b border-[var(--border)] last:border-b-0 hover:bg-gray-50/30 transition-colors">
                      <td className="px-4 py-3">
                        <div className="font-medium text-[var(--text)]">{campaign.name}</div>
                        <div className="text-xs text-[var(--text-secondary)]">{campaign.id}</div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <StatusBadge status={campaign.type} colorMap={CAMPAIGN_TYPE_COLORS} />
                      </td>
                      <td className="px-4 py-3 text-[var(--text)]">{campaign.discountSummary}</td>
                      <td className="px-4 py-3 text-center text-xs text-[var(--text-secondary)]">
                        {campaign.startDate} ~ {campaign.endDate}
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-[var(--text)]">
                        {fmt(campaign.participants)}
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-[var(--text)]">
                        {campaign.salesImpact > 0 ? `${fmt(campaign.salesImpact)}원` : '-'}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <StatusBadge status={campaign.status} colorMap={CAMPAIGN_STATUS_COLORS} />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => handleOpenCampaignDetail(campaign)}
                            className="w-7 h-7 flex items-center justify-center rounded-md text-[var(--text-secondary)] hover:bg-gray-100 transition-colors"
                          >
                            <Eye size={14} />
                          </button>
                          <button
                            onClick={() => handleOpenCampaignDetail(campaign)}
                            className="w-7 h-7 flex items-center justify-center rounded-md text-[var(--text-secondary)] hover:bg-gray-100 transition-colors"
                          >
                            <Edit size={14} />
                          </button>
                          <button
                            onClick={() => { if (confirm(`캠페인 "${campaign.name}"을(를) 삭제하시겠습니까?`)) { /* delete logic */ } }}
                            className="w-7 h-7 flex items-center justify-center rounded-md text-red-400 hover:bg-red-50 transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {paginatedCampaigns.length === 0 && (
                    <tr>
                      <td colSpan={8} className="px-4 py-12 text-center text-[var(--text-secondary)]">
                        검색 결과가 없습니다
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          <Pagination currentPage={campaignPage} totalPages={campaignTotalPages} onPageChange={setCampaignPage} />
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB: 할인코드 관리 */}
      {/* ===================================================================== */}
      {activeTab === 'codes' && (
        <div className="space-y-6">
          {/* Toolbar */}
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3 flex-1">
              <div className="relative flex-1 max-w-sm">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
                <input
                  type="text"
                  placeholder="할인코드, ID 검색..."
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setCodePage(1); }}
                  className="w-full h-[var(--btn-height)] pl-9 pr-4 text-sm rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-orange-500/30"
                />
              </div>
              <select
                value={codeStatusFilter}
                onChange={(e) => { setCodeStatusFilter(e.target.value); setCodePage(1); }}
                className="h-[var(--btn-height)] px-3 text-sm rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--text)]"
              >
                <option value="전체">전체 상태</option>
                <option value="활성">활성</option>
                <option value="만료">만료</option>
                <option value="소진">소진</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => { setCodeForm(defaultCodeForm()); setCodeModal(true); }}
                className="h-[var(--btn-height)] px-4 border border-[var(--border)] text-[var(--text)] text-sm font-medium rounded-lg flex items-center gap-2 hover:bg-gray-50 transition-colors"
              >
                <Download size={16} />
                일괄 생성
              </button>
              <button
                onClick={() => { setCodeForm(defaultCodeForm()); setCodeModal(true); }}
                className="h-[var(--btn-height)] px-4 bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium rounded-lg flex items-center gap-2 transition-colors"
              >
                <Plus size={16} />
                코드 생성
              </button>
            </div>
          </div>

          {/* Code Table */}
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--border)] bg-gray-50/50">
                    <th className="text-left px-4 py-3 font-medium text-[var(--text-secondary)]">코드</th>
                    <th className="text-center px-4 py-3 font-medium text-[var(--text-secondary)]">할인유형</th>
                    <th className="text-right px-4 py-3 font-medium text-[var(--text-secondary)]">할인값</th>
                    <th className="text-center px-4 py-3 font-medium text-[var(--text-secondary)]">사용/제한</th>
                    <th className="text-center px-4 py-3 font-medium text-[var(--text-secondary)]">생성일</th>
                    <th className="text-center px-4 py-3 font-medium text-[var(--text-secondary)]">만료일</th>
                    <th className="text-center px-4 py-3 font-medium text-[var(--text-secondary)]">상태</th>
                    <th className="text-center px-4 py-3 font-medium text-[var(--text-secondary)]">관리</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedCodes.map((code) => (
                    <tr key={code.id} className="border-b border-[var(--border)] last:border-b-0 hover:bg-gray-50/30 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <code className="font-mono text-sm font-medium bg-gray-100 px-2 py-0.5 rounded text-[var(--text)]">
                            {code.code}
                          </code>
                          <button
                            onClick={() => handleCopyCode(code.code)}
                            className="w-6 h-6 flex items-center justify-center rounded text-[var(--text-secondary)] hover:bg-gray-100 transition-colors"
                            title="코드 복사"
                          >
                            {copiedCode === code.code ? (
                              <CheckCircle size={13} className="text-emerald-500" />
                            ) : (
                              <Copy size={13} />
                            )}
                          </button>
                        </div>
                        <div className="text-xs text-[var(--text-secondary)] mt-0.5">{code.id}</div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <StatusBadge status={code.discountType} colorMap={COUPON_TYPE_COLORS} />
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-[var(--text)]">
                        {code.discountType === '정액'
                          ? `${fmt(code.discountValue)}원`
                          : `${code.discountValue}%`}
                      </td>
                      <td className="px-4 py-3 text-center text-[var(--text)]">
                        <span className="font-medium">{fmt(code.usedCount)}</span>
                        <span className="text-[var(--text-secondary)]"> / {fmt(code.usageLimit)}</span>
                      </td>
                      <td className="px-4 py-3 text-center text-xs text-[var(--text-secondary)]">{code.createdAt}</td>
                      <td className="px-4 py-3 text-center text-xs text-[var(--text-secondary)]">{code.expiresAt}</td>
                      <td className="px-4 py-3 text-center">
                        <StatusBadge status={code.status} colorMap={CODE_STATUS_COLORS} />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => {
                              setCodeForm({
                                prefix: code.code.split('-')[0] || 'JINU',
                                count: '1',
                                discountType: code.discountType,
                                discountValue: String(code.discountValue),
                                usageLimit: String(code.usageLimit),
                                expiresAt: code.expiresAt,
                              });
                              setCodeModal(true);
                            }}
                            className="w-7 h-7 flex items-center justify-center rounded-md text-[var(--text-secondary)] hover:bg-gray-100 transition-colors"
                          >
                            <Edit size={14} />
                          </button>
                          <button
                            onClick={() => { if (confirm(`할인코드 "${code.code}"을(를) 삭제하시겠습니까?`)) { /* delete logic */ } }}
                            className="w-7 h-7 flex items-center justify-center rounded-md text-red-400 hover:bg-red-50 transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {paginatedCodes.length === 0 && (
                    <tr>
                      <td colSpan={8} className="px-4 py-12 text-center text-[var(--text-secondary)]">
                        검색 결과가 없습니다
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          <Pagination currentPage={codePage} totalPages={codeTotalPages} onPageChange={setCodePage} />
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB: 프로모션 성과 */}
      {/* ===================================================================== */}
      {activeTab === 'stats' && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              icon={<DollarSign size={20} />}
              label="총 할인액"
              value="45,230,000"
              change="+15.2%"
              up={true}
              prefix=""
            />
            <StatCard
              icon={<TrendingUp size={20} />}
              label="프로모션 매출 기여"
              value="23.4%"
              change="+3.1%p"
              up={true}
              prefix=""
            />
            <StatCard
              icon={<Percent size={20} />}
              label="평균 쿠폰 사용률"
              value="34.2%"
              change="+5.1%p"
              up={true}
              prefix=""
            />
            <StatCard
              icon={<Award size={20} />}
              label="ROI"
              value="3.2x"
              change="+0.4x"
              up={true}
              prefix=""
            />
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Monthly Discount Trend - Stacked Bar Chart */}
            <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-6">
              <h3 className="font-semibold text-[var(--text)] mb-1">월별 할인 추이</h3>
              <p className="text-xs text-[var(--text-secondary)] mb-5">최근 6개월 할인유형별 현황</p>

              {/* Legend */}
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-sm bg-orange-500" />
                  <span className="text-xs text-[var(--text-secondary)]">쿠폰할인</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-sm bg-purple-500" />
                  <span className="text-xs text-[var(--text-secondary)]">프로모션할인</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-sm bg-blue-500" />
                  <span className="text-xs text-[var(--text-secondary)]">코드할인</span>
                </div>
              </div>

              {/* Bar Chart */}
              <div className="flex items-end gap-3 h-48">
                {mockMonthlyDiscounts.map((d) => {
                  const total = d.coupon + d.promotion + d.code;
                  const heightPct = (total / chartMax) * 100;
                  const couponPct = (d.coupon / total) * 100;
                  const promotionPct = (d.promotion / total) * 100;
                  const codePct = (d.code / total) * 100;
                  return (
                    <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
                      <div className="text-xs text-[var(--text-secondary)] font-medium">
                        {(total / 1000000).toFixed(1)}M
                      </div>
                      <div
                        className="w-full rounded-t-md overflow-hidden flex flex-col-reverse"
                        style={{ height: `${heightPct}%` }}
                      >
                        <div className="bg-orange-500" style={{ height: `${couponPct}%` }} />
                        <div className="bg-purple-500" style={{ height: `${promotionPct}%` }} />
                        <div className="bg-blue-500" style={{ height: `${codePct}%` }} />
                      </div>
                      <div className="text-xs text-[var(--text-secondary)]">
                        {d.month.split('-')[1]}월
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Discount Type Breakdown - Horizontal Bars */}
            <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-6">
              <h3 className="font-semibold text-[var(--text)] mb-1">할인유형별 현황</h3>
              <p className="text-xs text-[var(--text-secondary)] mb-5">유형별 할인 금액 및 건수</p>

              <div className="space-y-5">
                {mockDiscountTypes.map((item) => {
                  const pct = (item.amount / discountTypeMax) * 100;
                  return (
                    <div key={item.type} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium text-[var(--text)]">{item.type}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-[var(--text-secondary)]">{fmt(item.count)}건</span>
                          <span className="font-medium text-[var(--text)]">{fmt(item.amount)}원</span>
                        </div>
                      </div>
                      <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${item.color}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Top Performing Promotions */}
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-[var(--border)]">
              <h3 className="font-semibold text-[var(--text)]">Top 프로모션 성과</h3>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5">사용건수 및 ROI 기준 상위 프로모션</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--border)] bg-gray-50/50">
                    <th className="text-left px-4 py-3 font-medium text-[var(--text-secondary)]">프로모션명</th>
                    <th className="text-right px-4 py-3 font-medium text-[var(--text-secondary)]">사용건수</th>
                    <th className="text-right px-4 py-3 font-medium text-[var(--text-secondary)]">할인총액</th>
                    <th className="text-right px-4 py-3 font-medium text-[var(--text-secondary)]">매출기여</th>
                    <th className="text-right px-4 py-3 font-medium text-[var(--text-secondary)]">ROI</th>
                    <th className="text-left px-4 py-3 font-medium text-[var(--text-secondary)] w-40">성과</th>
                  </tr>
                </thead>
                <tbody>
                  {mockTopPromotions.map((promo, idx) => (
                    <tr key={idx} className="border-b border-[var(--border)] last:border-b-0 hover:bg-gray-50/30 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center text-xs font-bold">
                            {idx + 1}
                          </span>
                          <span className="font-medium text-[var(--text)]">{promo.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right text-[var(--text)]">{fmt(promo.usageCount)}건</td>
                      <td className="px-4 py-3 text-right text-[var(--text)]">{fmt(promo.totalDiscount)}원</td>
                      <td className="px-4 py-3 text-right font-medium text-[var(--text)]">{fmt(promo.salesContribution)}원</td>
                      <td className="px-4 py-3 text-right">
                        <span className={`font-bold ${promo.roi >= 4 ? 'text-emerald-600' : promo.roi >= 3 ? 'text-blue-600' : 'text-amber-600'}`}>
                          {promo.roi}x
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-orange-500 rounded-full"
                            style={{ width: `${(promo.roi / topPromoMaxROI) * 100}%` }}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL: 쿠폰 생성 */}
      {/* ===================================================================== */}
      <Modal isOpen={couponModal} onClose={() => setCouponModal(false)} title="쿠폰 생성" size="lg">
        <div className="space-y-5">
          {/* 쿠폰명 */}
          <div>
            <label className="block text-sm font-medium text-[var(--text)] mb-1.5">쿠폰명</label>
            <input
              type="text"
              value={couponForm.name}
              onChange={(e) => setCouponForm({ ...couponForm, name: e.target.value })}
              placeholder="예: 신규가입 할인 쿠폰"
              className="w-full h-[var(--btn-height)] px-3 text-sm rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-orange-500/30"
            />
          </div>

          {/* 할인유형 + 할인값 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--text)] mb-1.5">할인유형</label>
              <select
                value={couponForm.discountType}
                onChange={(e) => setCouponForm({ ...couponForm, discountType: e.target.value as '정액' | '정률' })}
                className="w-full h-[var(--btn-height)] px-3 text-sm rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--text)]"
              >
                <option value="정액">정액 할인</option>
                <option value="정률">정률 할인 (%)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--text)] mb-1.5">
                할인값 {couponForm.discountType === '정률' ? '(%)' : '(원)'}
              </label>
              <input
                type="number"
                value={couponForm.discountValue}
                onChange={(e) => setCouponForm({ ...couponForm, discountValue: e.target.value })}
                placeholder={couponForm.discountType === '정률' ? '예: 10' : '예: 10000'}
                className="w-full h-[var(--btn-height)] px-3 text-sm rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-orange-500/30"
              />
            </div>
          </div>

          {/* 최소주문금액 + 최대할인금액 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--text)] mb-1.5">최소주문금액 (원)</label>
              <input
                type="number"
                value={couponForm.minOrderAmount}
                onChange={(e) => setCouponForm({ ...couponForm, minOrderAmount: e.target.value })}
                placeholder="예: 50000"
                className="w-full h-[var(--btn-height)] px-3 text-sm rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-orange-500/30"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--text)] mb-1.5">최대할인금액 (원)</label>
              <input
                type="number"
                value={couponForm.maxDiscountAmount}
                onChange={(e) => setCouponForm({ ...couponForm, maxDiscountAmount: e.target.value })}
                placeholder="미입력 시 제한 없음"
                className="w-full h-[var(--btn-height)] px-3 text-sm rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-orange-500/30"
              />
            </div>
          </div>

          {/* 발급수량 */}
          <div>
            <label className="block text-sm font-medium text-[var(--text)] mb-1.5">발급수량</label>
            <input
              type="number"
              value={couponForm.issuedCount}
              onChange={(e) => setCouponForm({ ...couponForm, issuedCount: e.target.value })}
              placeholder="예: 500"
              className="w-full h-[var(--btn-height)] px-3 text-sm rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-orange-500/30"
            />
          </div>

          {/* 유효기간 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--text)] mb-1.5">시작일</label>
              <input
                type="date"
                value={couponForm.startDate}
                onChange={(e) => setCouponForm({ ...couponForm, startDate: e.target.value })}
                className="w-full h-[var(--btn-height)] px-3 text-sm rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-orange-500/30"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--text)] mb-1.5">종료일</label>
              <input
                type="date"
                value={couponForm.endDate}
                onChange={(e) => setCouponForm({ ...couponForm, endDate: e.target.value })}
                className="w-full h-[var(--btn-height)] px-3 text-sm rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-orange-500/30"
              />
            </div>
          </div>

          {/* 적용대상 */}
          <div>
            <label className="block text-sm font-medium text-[var(--text)] mb-1.5">적용대상</label>
            <select
              value={couponForm.target}
              onChange={(e) => setCouponForm({ ...couponForm, target: e.target.value })}
              className="w-full h-[var(--btn-height)] px-3 text-sm rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--text)]"
            >
              <option value="전체">전체</option>
              <option value="시약 카테고리">시약 카테고리</option>
              <option value="소모품 카테고리">소모품 카테고리</option>
              <option value="특정 기관">특정 기관</option>
            </select>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[var(--border)]">
            <button
              onClick={() => setCouponModal(false)}
              className="h-[var(--btn-height)] px-4 text-sm font-medium rounded-lg border border-[var(--border)] text-[var(--text)] hover:bg-gray-50 transition-colors"
            >
              취소
            </button>
            <button
              onClick={() => setCouponModal(false)}
              className="h-[var(--btn-height)] px-6 bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium rounded-lg transition-colors"
            >
              생성
            </button>
          </div>
        </div>
      </Modal>

      {/* ===================================================================== */}
      {/* MODAL: 캠페인 상세 */}
      {/* ===================================================================== */}
      <Modal
        isOpen={campaignDetailModal}
        onClose={() => { setCampaignDetailModal(false); setSelectedCampaign(null); }}
        title="캠페인 상세"
        size="lg"
      >
        {selectedCampaign && (
          <div className="space-y-5">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-[var(--text)]">{selectedCampaign.name}</h3>
                <p className="text-sm text-[var(--text-secondary)] mt-1">{selectedCampaign.id}</p>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status={selectedCampaign.type} colorMap={CAMPAIGN_TYPE_COLORS} />
                <StatusBadge status={selectedCampaign.status} colorMap={CAMPAIGN_STATUS_COLORS} />
              </div>
            </div>

            {/* Description */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm font-medium text-[var(--text)] mb-1">설명</div>
              <p className="text-sm text-[var(--text-secondary)]">{selectedCampaign.description}</p>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-xs text-[var(--text-secondary)] mb-1">할인 내용</div>
                <div className="text-sm font-medium text-[var(--text)]">{selectedCampaign.discountSummary}</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-xs text-[var(--text-secondary)] mb-1">기간</div>
                <div className="text-sm font-medium text-[var(--text)]">
                  {selectedCampaign.startDate} ~ {selectedCampaign.endDate}
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-xs text-[var(--text-secondary)] mb-1">대상 고객</div>
                <div className="text-sm font-medium text-[var(--text)]">{selectedCampaign.targetAudience}</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-xs text-[var(--text-secondary)] mb-1">적용 규칙</div>
                <div className="text-sm font-medium text-[var(--text)]">{selectedCampaign.rules}</div>
              </div>
            </div>

            {/* Performance Metrics */}
            <div>
              <div className="text-sm font-medium text-[var(--text)] mb-3">성과 지표</div>
              <div className="grid grid-cols-2 gap-4">
                <div className="border border-[var(--border)] rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-[var(--text)]">{fmt(selectedCampaign.participants)}</div>
                  <div className="text-xs text-[var(--text-secondary)] mt-1">참여자 수</div>
                </div>
                <div className="border border-[var(--border)] rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-[var(--text)]">
                    {selectedCampaign.salesImpact > 0 ? `${fmt(selectedCampaign.salesImpact)}원` : '-'}
                  </div>
                  <div className="text-xs text-[var(--text-secondary)] mt-1">매출 영향</div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[var(--border)]">
              <button
                onClick={() => { setCampaignDetailModal(false); setSelectedCampaign(null); }}
                className="h-[var(--btn-height)] px-4 text-sm font-medium rounded-lg border border-[var(--border)] text-[var(--text)] hover:bg-gray-50 transition-colors"
              >
                닫기
              </button>
              <button
                onClick={() => { setCampaignDetailModal(false); setSelectedCampaign(null); alert('캠페인 수정 기능은 준비 중입니다.'); }}
                className="h-[var(--btn-height)] px-6 bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                수정
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* ===================================================================== */}
      {/* MODAL: 할인코드 생성 */}
      {/* ===================================================================== */}
      <Modal isOpen={codeModal} onClose={() => setCodeModal(false)} title="할인코드 생성" size="md">
        <div className="space-y-5">
          {/* 코드 prefix */}
          <div>
            <label className="block text-sm font-medium text-[var(--text)] mb-1.5">코드 접두사 (Prefix)</label>
            <input
              type="text"
              value={codeForm.prefix}
              onChange={(e) => setCodeForm({ ...codeForm, prefix: e.target.value.toUpperCase() })}
              placeholder="예: JINU"
              className="w-full h-[var(--btn-height)] px-3 text-sm rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-orange-500/30"
            />
            <p className="text-xs text-[var(--text-secondary)] mt-1">
              생성 형식: {codeForm.prefix || 'JINU'}-XXXX-XXXX
            </p>
          </div>

          {/* 생성개수 */}
          <div>
            <label className="block text-sm font-medium text-[var(--text)] mb-1.5">생성 개수</label>
            <input
              type="number"
              value={codeForm.count}
              onChange={(e) => setCodeForm({ ...codeForm, count: e.target.value })}
              placeholder="예: 10"
              className="w-full h-[var(--btn-height)] px-3 text-sm rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-orange-500/30"
            />
          </div>

          {/* 할인유형 + 할인값 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--text)] mb-1.5">할인유형</label>
              <select
                value={codeForm.discountType}
                onChange={(e) => setCodeForm({ ...codeForm, discountType: e.target.value as '정액' | '정률' })}
                className="w-full h-[var(--btn-height)] px-3 text-sm rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--text)]"
              >
                <option value="정액">정액 할인</option>
                <option value="정률">정률 할인 (%)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--text)] mb-1.5">
                할인값 {codeForm.discountType === '정률' ? '(%)' : '(원)'}
              </label>
              <input
                type="number"
                value={codeForm.discountValue}
                onChange={(e) => setCodeForm({ ...codeForm, discountValue: e.target.value })}
                placeholder={codeForm.discountType === '정률' ? '예: 10' : '예: 10000'}
                className="w-full h-[var(--btn-height)] px-3 text-sm rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-orange-500/30"
              />
            </div>
          </div>

          {/* 사용횟수제한 */}
          <div>
            <label className="block text-sm font-medium text-[var(--text)] mb-1.5">코드당 사용 횟수 제한</label>
            <input
              type="number"
              value={codeForm.usageLimit}
              onChange={(e) => setCodeForm({ ...codeForm, usageLimit: e.target.value })}
              placeholder="예: 100"
              className="w-full h-[var(--btn-height)] px-3 text-sm rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-orange-500/30"
            />
          </div>

          {/* 유효기간 */}
          <div>
            <label className="block text-sm font-medium text-[var(--text)] mb-1.5">만료일</label>
            <input
              type="date"
              value={codeForm.expiresAt}
              onChange={(e) => setCodeForm({ ...codeForm, expiresAt: e.target.value })}
              className="w-full h-[var(--btn-height)] px-3 text-sm rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-orange-500/30"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[var(--border)]">
            <button
              onClick={() => setCodeModal(false)}
              className="h-[var(--btn-height)] px-4 text-sm font-medium rounded-lg border border-[var(--border)] text-[var(--text)] hover:bg-gray-50 transition-colors"
            >
              취소
            </button>
            <button
              onClick={() => setCodeModal(false)}
              className="h-[var(--btn-height)] px-6 bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium rounded-lg transition-colors"
            >
              생성
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
