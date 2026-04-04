'use client';

import { useState, useMemo } from 'react';
import {
  Megaphone,
  HelpCircle,
  MessageSquare,
  Image,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  ChevronUp,
  ChevronDown,
  Pin,
  AlertTriangle,
  Calendar,
  ExternalLink,
  Upload,
  X,
  Search,
  Filter,
  LayoutGrid,
  List,
  Send,
  FileText,
  GripVertical,
  Star,
  Layout,
  Layers,
  MonitorSmartphone,
  Maximize,
  Minimize,
  ToggleLeft,
  ToggleRight,
  Hash,
  Atom,
  FlaskConical,
  Dna,
  TestTube,
  Beaker,
  Scale,
  Shield,
} from 'lucide-react';
import { AdminTabs } from '@/components/shared/AdminTabs';
import { Modal } from '@/components/shared/Modal';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { StatCard } from '@/components/shared/StatCard';
import { Pagination } from '@/components/shared/Pagination';
import {
  mockNotices,
  mockFaqs,
  type Notice,
  type Faq,
} from '@/lib/admin-mock-data';

// =============================================================================
// Constants
// =============================================================================

const ITEMS_PER_PAGE = 8;

const TABS = [
  { id: 'notices', label: '공지사항 관리' },
  { id: 'faqs', label: 'FAQ 관리' },
  { id: 'inquiries', label: '1:1 문의 관리' },
  { id: 'banners', label: '배너 관리' },
  { id: 'main-sections', label: 'Shop 메인 관리' },
  { id: 'category-display', label: '카테고리 노출' },
  { id: 'popups', label: '팝업 관리' },
];

const NOTICE_CATEGORY_COLORS: Record<string, string> = {
  일반: 'blue',
  서비스: 'purple',
  점검: 'amber',
};

const NOTICE_STATUS_COLORS: Record<string, string> = {
  게시중: 'emerald',
  예약: 'blue',
  종료: 'gray',
};

const FAQ_CATEGORIES = ['전체', '주문', '배송', '제품', '계정', '기타'] as const;

const FAQ_CATEGORY_COLORS: Record<string, string> = {
  주문: 'blue',
  배송: 'emerald',
  제품: 'amber',
  계정: 'purple',
  기타: 'gray',
};

const INQUIRY_CATEGORY_COLORS: Record<string, string> = {
  주문: 'blue',
  배송: 'emerald',
  제품: 'amber',
  계정: 'purple',
  기타: 'gray',
};

const INQUIRY_STATUS_COLORS: Record<string, string> = {
  답변대기: 'amber',
  답변완료: 'emerald',
};

const BANNER_STATUS_COLORS: Record<string, string> = {
  활성: 'emerald',
  비활성: 'gray',
  예약: 'blue',
};

const BANNER_POSITION_COLORS: Record<string, string> = {
  '메인 상단': 'blue',
  '메인 하단': 'purple',
  사이드바: 'amber',
};

// =============================================================================
// Mock: Inquiries
// =============================================================================

interface Inquiry {
  id: string;
  category: '주문' | '배송' | '제품' | '계정' | '기타';
  title: string;
  content: string;
  customerName: string;
  customerEmail: string;
  customerOrg: string;
  attachments: string[];
  status: '답변대기' | '답변완료';
  reply: string;
  repliedAt: string;
  createdAt: string;
}

const initialInquiries: Inquiry[] = [
  { id: 'INQ-001', category: '주문', title: '대량 주문 시 할인 적용 문의', content: '연간 계약으로 시약을 대량 구매하고 있는데, 100건 이상 주문 시 추가 할인이 적용되는지 문의드립니다. 현재 연구소에서 매월 약 200건의 시약을 주문하고 있습니다.', customerName: '김연구', customerEmail: 'kim@kaist.ac.kr', customerOrg: 'KAIST 화학과', attachments: [], status: '답변대기', reply: '', repliedAt: '', createdAt: '2026-03-20 09:30' },
  { id: 'INQ-002', category: '배송', title: '위험물 시약 배송 지연 관련', content: '3월 15일 주문한 과산화수소(ORD-20260315-0023)가 아직 도착하지 않았습니다. 위험물 배송이라 시간이 걸리는 것은 이해하지만 예상 배송일이 이미 지났습니다.', customerName: '이화학', customerEmail: 'lee@snu.ac.kr', customerOrg: '서울대 화학생물공학부', attachments: ['주문확인서.pdf'], status: '답변완료', reply: '안녕하세요, 이화학 고객님. 해당 주문 건 확인 결과, 위험물 운송 규정 변경으로 인해 배송이 지연되고 있습니다. 현재 3월 21일 도착 예정이며, 불편을 드려 죄송합니다.', repliedAt: '2026-03-20 11:00', createdAt: '2026-03-19 14:20' },
  { id: 'INQ-003', category: '제품', title: 'Sigma-Aldrich 제품 COA 요청', content: 'Acetonitrile (CAS: 75-05-8, Lot: SHBL2345) COA 문서를 요청드립니다. 제품 상세 페이지에서 해당 Lot 번호의 COA를 찾을 수 없습니다.', customerName: '박분석', customerEmail: 'park@postech.ac.kr', customerOrg: 'POSTECH 화학과', attachments: [], status: '답변대기', reply: '', repliedAt: '', createdAt: '2026-03-19 10:15' },
  { id: 'INQ-004', category: '계정', title: '조직관리자 권한 변경 요청', content: '기존 조직관리자(정퇴직)가 퇴직하여 조직관리자 권한을 저에게 이전해주셔야 합니다. 관련 서류(재직증명서, 위임장)를 첨부합니다.', customerName: '최관리', customerEmail: 'choi@yonsei.ac.kr', customerOrg: '연세대 약학과', attachments: ['재직증명서.pdf', '위임장.pdf'], status: '답변완료', reply: '안녕하세요, 최관리 고객님. 첨부하신 서류를 확인하였으며, 조직관리자 권한이 성공적으로 이전되었습니다. 마이페이지에서 확인해주세요.', repliedAt: '2026-03-19 16:00', createdAt: '2026-03-18 11:30' },
  { id: 'INQ-005', category: '기타', title: 'JINU E-Note 연동 오류', content: 'E-Note에서 시약장 동기화 시 "연동 실패" 오류가 발생합니다. 오류 코드: SYNC_ERR_0042. 브라우저는 Chrome 120을 사용 중입니다.', customerName: '윤실험', customerEmail: 'yoon@khu.ac.kr', customerOrg: '경희대 생명과학과', attachments: ['오류스크린샷.png'], status: '답변대기', reply: '', repliedAt: '', createdAt: '2026-03-18 09:45' },
  { id: 'INQ-006', category: '주문', title: '견적서 재발급 요청', content: '2월 발행된 견적서(QT-20260210-0015)의 유효기간이 만료되어 동일 내용으로 재발급을 요청드립니다.', customerName: '장구매', customerEmail: 'jang@korea.ac.kr', customerOrg: '고려대 신소재공학과', attachments: [], status: '답변완료', reply: '안녕하세요, 장구매 고객님. 동일 내용의 견적서가 재발급되었습니다. 증빙서류 메뉴에서 확인 가능합니다. 유효기간은 발급일로부터 30일입니다.', repliedAt: '2026-03-18 14:30', createdAt: '2026-03-17 16:00' },
  { id: 'INQ-007', category: '배송', title: '시약 파손 신고', content: '오늘 수령한 택배에서 Methanol 500mL 1병이 파손되어 있었습니다. 사진을 첨부합니다. 교환 또는 환불을 요청드립니다. 주문번호: ORD-20260314-0041', customerName: '한배송', customerEmail: 'han@skku.ac.kr', customerOrg: '성균관대 화학과', attachments: ['파손사진1.jpg', '파손사진2.jpg'], status: '답변대기', reply: '', repliedAt: '', createdAt: '2026-03-17 10:20' },
  { id: 'INQ-008', category: '제품', title: 'TCI 제품 재입고 일정 문의', content: 'Benzaldehyde (CAS: 100-52-7) 500g 규격이 현재 품절 상태인데, 재입고 예정일을 알 수 있을까요? 실험 일정상 4월 초까지 필요합니다.', customerName: '정시약', customerEmail: 'jung@unist.ac.kr', customerOrg: 'UNIST 화학과', attachments: [], status: '답변완료', reply: '안녕하세요, 정시약 고객님. TCI 측에 확인한 결과, 해당 제품은 3월 25일 입고 예정입니다. 입고 알림을 설정해드렸으니, 입고 시 이메일로 안내드리겠습니다.', repliedAt: '2026-03-17 15:00', createdAt: '2026-03-16 13:40' },
  { id: 'INQ-009', category: '계정', title: '다중 소속 기관 추가 요청', content: '현재 KAIST 소속으로 등록되어 있는데, 공동연구 진행 중인 서울대학교 소속도 추가해주실 수 있을까요?', customerName: '김연구', customerEmail: 'kim@kaist.ac.kr', customerOrg: 'KAIST 화학과', attachments: ['공동연구계약서.pdf'], status: '답변대기', reply: '', repliedAt: '', createdAt: '2026-03-16 09:00' },
  { id: 'INQ-010', category: '기타', title: 'API 키 티어 업그레이드 문의', content: '현재 Free 티어 API 키를 사용 중인데 일일 호출 한도가 부족합니다. Pro 티어로 업그레이드하려면 어떤 절차가 필요한가요?', customerName: '송개발', customerEmail: 'song@gist.ac.kr', customerOrg: 'GIST AI연구센터', attachments: [], status: '답변완료', reply: '안녕하세요, 송개발 고객님. Pro 티어 업그레이드는 API 관리 > 키 관리 메뉴에서 직접 신청 가능합니다. 심사 후 1~2일 내 적용되며, 월 이용료가 발생합니다. 자세한 요금은 개발자 포털을 참고해주세요.', repliedAt: '2026-03-16 11:30', createdAt: '2026-03-15 14:50' },
];

// =============================================================================
// Mock: Banners
// =============================================================================

interface Banner {
  id: string;
  title: string;
  linkUrl: string;
  position: '메인 상단' | '메인 하단' | '사이드바';
  status: '활성' | '비활성' | '예약';
  startDate: string;
  endDate: string;
  imageUrl: string | null;
  imageName: string | null;
}

const initialBanners: Banner[] = [
  { id: 'BNR-001', title: '2026 봄 시약 할인 프로모션', linkUrl: 'https://shop.jinuchem.com/promotion/spring2026', position: '메인 상단', status: '활성', startDate: '2026-03-01', endDate: '2026-03-31', imageUrl: null, imageName: null },
  { id: 'BNR-002', title: 'JINU E-Note 신규 기능 안내', linkUrl: 'https://enote.jinuchem.com/whats-new', position: '메인 하단', status: '활성', startDate: '2026-03-10', endDate: '2026-04-10', imageUrl: null, imageName: null },
  { id: 'BNR-003', title: '신규 회원 가입 이벤트', linkUrl: 'https://shop.jinuchem.com/event/signup', position: '사이드바', status: '활성', startDate: '2026-03-15', endDate: '2026-04-15', imageUrl: null, imageName: null },
  { id: 'BNR-004', title: '4월 정기점검 사전 공지', linkUrl: 'https://admin.jinuchem.com/notices/NTC-004', position: '메인 상단', status: '예약', startDate: '2026-04-10', endDate: '2026-04-19', imageUrl: null, imageName: null },
  { id: 'BNR-005', title: '2025 연말 프로모션 (종료)', linkUrl: 'https://shop.jinuchem.com/promotion/year-end2025', position: '메인 하단', status: '비활성', startDate: '2025-12-01', endDate: '2025-12-31', imageUrl: null, imageName: null },
];

// =============================================================================
// Mock: Main Sections
// =============================================================================

interface MainSection {
  id: string;
  name: string;
  type: '자동' | '수동' | '개인화';
  source: string;
  itemCount: number;
  position: number;
  visible: boolean;
  updatedAt: string;
}

const initialMainSections: MainSection[] = [
  { id: 'S-001', name: '추천 제품', type: '자동', source: 'AI 추천 엔진', itemCount: 12, position: 1, visible: true, updatedAt: '2026-04-02' },
  { id: 'S-002', name: '인기 제품', type: '자동', source: '주문 데이터 (30일)', itemCount: 20, position: 2, visible: true, updatedAt: '2026-04-01' },
  { id: 'S-003', name: '신제품', type: '자동', source: '등록일 기준 (7일)', itemCount: 8, position: 3, visible: true, updatedAt: '2026-04-02' },
  { id: 'S-004', name: '특가 상품', type: '수동', source: '관리자 선택', itemCount: 6, position: 4, visible: true, updatedAt: '2026-03-30' },
  { id: 'S-005', name: '자주 구매 제품', type: '개인화', source: '구매 이력 기반', itemCount: 10, position: 5, visible: true, updatedAt: '2026-04-01' },
  { id: 'S-006', name: '시즌 프로모션', type: '수동', source: '관리자 선택', itemCount: 4, position: 6, visible: false, updatedAt: '2026-03-15' },
];

const SECTION_TYPE_COLORS: Record<string, string> = {
  자동: 'blue',
  수동: 'amber',
  개인화: 'purple',
};

// =============================================================================
// Mock: Category Display
// =============================================================================

interface CategoryDisplay {
  id: string;
  name: string;
  displayOrder: number;
  visible: boolean;
  featured: boolean;
  itemCount: number;
  icon: string;
}

const initialCategoryDisplay: CategoryDisplay[] = [
  { id: 'CD-001', name: '유기화합물', displayOrder: 1, visible: true, featured: true, itemCount: 2340, icon: 'Flask' },
  { id: 'CD-002', name: '무기화합물', displayOrder: 2, visible: true, featured: true, itemCount: 1890, icon: 'Atom' },
  { id: 'CD-003', name: '생화학시약', displayOrder: 3, visible: true, featured: true, itemCount: 1560, icon: 'Dna' },
  { id: 'CD-004', name: '분석용시약', displayOrder: 4, visible: true, featured: false, itemCount: 980, icon: 'TestTube' },
  { id: 'CD-005', name: '실험소모품', displayOrder: 5, visible: true, featured: false, itemCount: 3200, icon: 'Beaker' },
  { id: 'CD-006', name: '표준물질', displayOrder: 6, visible: true, featured: false, itemCount: 450, icon: 'Scale' },
  { id: 'CD-007', name: '안전장비', displayOrder: 7, visible: false, featured: false, itemCount: 120, icon: 'Shield' },
];

// =============================================================================
// Mock: Popups
// =============================================================================

interface Popup {
  id: string;
  title: string;
  type: '이벤트' | '공지' | '기타';
  startDate: string;
  endDate: string;
  showOnce: boolean;
  status: '활성' | '예약' | '종료';
  views: number;
  closedCount: number;
  position: 'center' | 'bottom-right' | 'top-bar';
}

const initialPopups: Popup[] = [
  { id: 'PU-001', title: '봄맞이 시약 할인전', type: '이벤트', startDate: '2026-04-01', endDate: '2026-04-30', showOnce: false, status: '활성', views: 3240, closedCount: 1890, position: 'center' },
  { id: 'PU-002', title: '시스템 점검 안내', type: '공지', startDate: '2026-04-05', endDate: '2026-04-05', showOnce: true, status: '예약', views: 0, closedCount: 0, position: 'center' },
  { id: 'PU-003', title: '신규 가입 혜택 안내', type: '이벤트', startDate: '2026-03-01', endDate: '2026-03-31', showOnce: true, status: '종료', views: 5680, closedCount: 4230, position: 'bottom-right' },
  { id: 'PU-004', title: '설문조사 참여 요청', type: '기타', startDate: '2026-04-10', endDate: '2026-04-20', showOnce: true, status: '예약', views: 0, closedCount: 0, position: 'bottom-right' },
];

const POPUP_TYPE_COLORS: Record<string, string> = {
  이벤트: 'blue',
  공지: 'amber',
  기타: 'gray',
};

const POPUP_STATUS_COLORS: Record<string, string> = {
  활성: 'emerald',
  예약: 'blue',
  종료: 'gray',
};

const POPUP_POSITION_LABELS: Record<string, string> = {
  center: '중앙',
  'bottom-right': '우하단',
  'top-bar': '상단 바',
};

// =============================================================================
// Page Component
// =============================================================================

export default function BoardPage() {
  const [activeTab, setActiveTab] = useState('notices');

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--text)]">게시판 관리</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          JINU Shop 프론트엔드 콘텐츠 관리 -- 공지사항, FAQ, 1:1 문의, 배너, 메인 섹션, 카테고리, 팝업
        </p>
      </div>

      {/* Tabs */}
      <AdminTabs tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Tab Content */}
      {activeTab === 'notices' && <NoticeManagement />}
      {activeTab === 'faqs' && <FaqManagement />}
      {activeTab === 'inquiries' && <InquiryManagement />}
      {activeTab === 'banners' && <BannerManagement />}
      {activeTab === 'main-sections' && <MainSectionManagement />}
      {activeTab === 'category-display' && <CategoryDisplayManagement />}
      {activeTab === 'popups' && <PopupManagement />}
    </div>
  );
}

// =============================================================================
// Tab 1: 공지사항 관리
// =============================================================================

function NoticeManagement() {
  const [notices, setNotices] = useState<Notice[]>(mockNotices);
  const [activeModal, setActiveModal] = useState<'create' | 'edit' | 'delete' | null>(null);
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [toast, setToast] = useState('');
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchInput, setSearchInput] = useState('');

  const [form, setForm] = useState({
    title: '',
    category: '일반' as Notice['category'],
    content: '',
    startDate: '',
    endDate: '',
    pinned: false,
    status: '게시중' as Notice['status'],
  });

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  // Sort by createdAt ASC (oldest first)
  const sortedNotices = useMemo(() => {
    return [...notices].sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  }, [notices]);

  // Filter by search query
  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return sortedNotices;
    const q = searchQuery.toLowerCase();
    return sortedNotices.filter(
      (n) => n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q)
    );
  }, [sortedNotices, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paged = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const handleSearch = () => {
    setSearchQuery(searchInput);
    setPage(1);
  };

  const openCreate = () => {
    setForm({ title: '', category: '일반', content: '', startDate: '', endDate: '', pinned: false, status: '게시중' });
    setActiveModal('create');
  };

  const openEdit = (n: Notice) => {
    setEditingNotice(n);
    setForm({ title: n.title, category: n.category, content: n.content, startDate: n.startDate, endDate: n.endDate, pinned: n.pinned, status: n.status });
    setActiveModal('edit');
  };

  const openDelete = (id: string) => {
    setDeleteTarget(id);
    setActiveModal('delete');
  };

  const handleSave = () => {
    if (!form.title.trim()) return;
    if (activeModal === 'edit' && editingNotice) {
      setNotices((prev) => prev.map((n) => n.id === editingNotice.id ? { ...n, title: form.title, category: form.category, content: form.content, startDate: form.startDate, endDate: form.endDate, pinned: form.pinned, status: form.status } : n));
      showToast('공지사항이 수정되었습니다.');
    } else {
      const newNotice: Notice = {
        id: `NTC-${String(notices.length + 1).padStart(3, '0')}`,
        title: form.title,
        category: form.category,
        content: form.content,
        status: form.status,
        author: '관리자',
        pinned: form.pinned,
        startDate: form.startDate,
        endDate: form.endDate,
        createdAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
      };
      setNotices((prev) => [...prev, newNotice]);
      showToast('공지사항이 등록되었습니다.');
    }
    setActiveModal(null);
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    setNotices((prev) => prev.filter((n) => n.id !== deleteTarget));
    setActiveModal(null);
    setDeleteTarget(null);
    showToast('공지사항이 삭제되었습니다.');
  };

  const publishedCount = notices.filter((n) => n.status === '게시중').length;
  const scheduledCount = notices.filter((n) => n.status === '예약').length;

  // Calculate the base sequential number for current page
  const getSeqNum = (pageIdx: number) => (page - 1) * ITEMS_PER_PAGE + pageIdx + 1;

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard icon={<Megaphone size={20} />} label="전체 공지" value={String(notices.length)} change={`${notices.length}건`} up={true} />
        <StatCard icon={<Eye size={20} />} label="게시중" value={String(publishedCount)} change={`${publishedCount}건`} up={true} />
        <StatCard icon={<Calendar size={20} />} label="예약" value={String(scheduledCount)} change={`${scheduledCount}건`} up={true} />
      </div>

      {/* Search Bar + Add Button */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2 flex-1 min-w-[280px] max-w-lg">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full h-[var(--btn-height)] pl-9 pr-3 border border-[var(--border)] rounded-lg text-sm text-[var(--text)] bg-[var(--bg)] focus:outline-none focus:border-orange-500"
              placeholder="제목, 내용으로 검색"
            />
          </div>
          <button
            onClick={handleSearch}
            className="h-[var(--btn-height)] px-4 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors shrink-0"
          >
            조회
          </button>
        </div>
        <button onClick={openCreate} className="h-[var(--btn-height)] px-4 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors flex items-center gap-2 shrink-0">
          <Plus size={16} />
          공지 추가
        </button>
      </div>

      {/* Count */}
      <p className="text-sm text-[var(--text-secondary)]">총 {filtered.length}건</p>

      {/* Table */}
      <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[var(--bg)] border-b border-[var(--border)]">
                <th className="text-center px-4 py-3 font-medium text-[var(--text-secondary)] w-14">#</th>
                <th className="text-center px-3 py-3 font-medium text-[var(--text-secondary)] w-10">고정</th>
                <th className="text-left px-5 py-3 font-medium text-[var(--text-secondary)]">제목</th>
                <th className="text-left px-5 py-3 font-medium text-[var(--text-secondary)]">카테고리</th>
                <th className="text-left px-5 py-3 font-medium text-[var(--text-secondary)]">상태</th>
                <th className="text-left px-5 py-3 font-medium text-[var(--text-secondary)]">작성자</th>
                <th className="text-left px-5 py-3 font-medium text-[var(--text-secondary)]">게시기간</th>
                <th className="text-center px-5 py-3 font-medium text-[var(--text-secondary)]">조회수</th>
                <th className="text-center px-5 py-3 font-medium text-[var(--text-secondary)]">관리</th>
              </tr>
            </thead>
            <tbody>
              {paged.map((notice, idx) => (
                <tr key={notice.id} className="border-b border-[var(--border)] last:border-b-0 hover:bg-[var(--bg)] transition-colors">
                  <td className="px-4 py-3 text-center text-[var(--text-secondary)]">{getSeqNum(idx)}</td>
                  <td className="px-3 py-3 text-center">
                    {notice.pinned && <Pin size={14} className="text-orange-500 mx-auto" />}
                  </td>
                  <td className="px-5 py-3 text-[var(--text)] font-medium">{notice.title}</td>
                  <td className="px-5 py-3"><StatusBadge status={notice.category} colorMap={NOTICE_CATEGORY_COLORS} /></td>
                  <td className="px-5 py-3"><StatusBadge status={notice.status} colorMap={NOTICE_STATUS_COLORS} /></td>
                  <td className="px-5 py-3 text-[var(--text)]">{notice.author}</td>
                  <td className="px-5 py-3 text-[var(--text-secondary)] text-xs">{notice.startDate} ~ {notice.endDate}</td>
                  <td className="px-5 py-3 text-center text-[var(--text-secondary)]">{getSeqNum(idx) * 47 + 120}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-center gap-1">
                      <button onClick={() => openEdit(notice)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors text-[var(--text-secondary)]" title="수정">
                        <Edit size={15} />
                      </button>
                      <button onClick={() => openDelete(notice.id)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 transition-colors text-red-400 hover:text-red-600" title="삭제">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {paged.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-5 py-12 text-center text-[var(--text-secondary)]">검색 결과가 없습니다.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />

      {/* Create / Edit Modal */}
      {(activeModal === 'create' || activeModal === 'edit') && (
        <Modal isOpen={true} onClose={() => setActiveModal(null)} title={activeModal === 'edit' ? '공지사항 수정' : '공지사항 추가'} size="lg">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--text)] mb-1.5">제목</label>
              <input type="text" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} className="w-full h-[var(--btn-height)] px-3 border border-[var(--border)] rounded-lg text-sm text-[var(--text)] bg-[var(--bg)] focus:outline-none focus:border-orange-500" placeholder="공지사항 제목을 입력하세요" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--text)] mb-1.5">카테고리</label>
              <select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value as Notice['category'] }))} className="w-full h-[var(--btn-height)] px-3 border border-[var(--border)] rounded-lg text-sm text-[var(--text)] bg-[var(--bg)] focus:outline-none focus:border-orange-500">
                <option value="일반">일반</option>
                <option value="서비스">서비스</option>
                <option value="점검">점검</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--text)] mb-1.5">내용</label>
              <textarea value={form.content} onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))} className="w-full h-40 px-3 py-2 border border-[var(--border)] rounded-lg text-sm text-[var(--text)] bg-[var(--bg)] focus:outline-none focus:border-orange-500 resize-none" placeholder="공지 내용을 입력하세요" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[var(--text)] mb-1.5">게시 시작일</label>
                <input type="date" value={form.startDate} onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))} className="w-full h-[var(--btn-height)] px-3 border border-[var(--border)] rounded-lg text-sm text-[var(--text)] bg-[var(--bg)] focus:outline-none focus:border-orange-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text)] mb-1.5">게시 종료일</label>
                <input type="date" value={form.endDate} onChange={(e) => setForm((f) => ({ ...f, endDate: e.target.value }))} className="w-full h-[var(--btn-height)] px-3 border border-[var(--border)] rounded-lg text-sm text-[var(--text)] bg-[var(--bg)] focus:outline-none focus:border-orange-500" />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-[var(--text)]">상단 고정</label>
              <button onClick={() => setForm((f) => ({ ...f, pinned: !f.pinned }))} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${form.pinned ? 'bg-orange-600' : 'bg-gray-200'}`}>
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm ${form.pinned ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--text)] mb-1.5">상태</label>
              <div className="flex items-center gap-4">
                {(['게시중', '예약', '종료'] as const).map((s) => (
                  <label key={s} className="flex items-center gap-1.5 cursor-pointer">
                    <input type="radio" name="noticeStatus" checked={form.status === s} onChange={() => setForm((f) => ({ ...f, status: s }))} className="accent-orange-600" />
                    <span className="text-sm text-[var(--text)]">{s}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setActiveModal(null)} className="h-[var(--btn-height)] px-4 border border-[var(--border)] rounded-lg text-sm text-[var(--text)] hover:bg-gray-50 transition-colors">취소</button>
              <button onClick={handleSave} className="h-[var(--btn-height)] px-6 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors">저장</button>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Confirmation */}
      {activeModal === 'delete' && (
        <Modal isOpen={true} onClose={() => setActiveModal(null)} title="공지사항 삭제" size="sm">
          <div className="text-center space-y-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <AlertTriangle size={24} className="text-red-500" />
            </div>
            <p className="text-sm text-[var(--text)]">이 공지사항을 삭제하시겠습니까?<br />삭제된 공지사항은 복구할 수 없습니다.</p>
            <div className="flex justify-center gap-2">
              <button onClick={() => setActiveModal(null)} className="h-[var(--btn-height)] px-4 border border-[var(--border)] rounded-lg text-sm text-[var(--text)] hover:bg-gray-50 transition-colors">취소</button>
              <button onClick={handleDelete} className="h-[var(--btn-height)] px-6 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors">삭제</button>
            </div>
          </div>
        </Modal>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-[60] bg-gray-900 text-white px-5 py-3 rounded-lg text-sm shadow-lg">{toast}</div>
      )}
    </div>
  );
}

// =============================================================================
// Tab 2: FAQ 관리
// =============================================================================

function FaqManagement() {
  const [faqs, setFaqs] = useState<Faq[]>(mockFaqs);
  const [activeModal, setActiveModal] = useState<'create' | 'edit' | 'delete' | null>(null);
  const [editingFaq, setEditingFaq] = useState<Faq | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [filterCat, setFilterCat] = useState<string>('전체');
  const [toast, setToast] = useState('');
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchInput, setSearchInput] = useState('');

  const [form, setForm] = useState({
    category: '주문' as Faq['category'],
    question: '',
    answer: '',
    order: 1,
    status: '게시중' as Faq['status'],
  });

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  // Sort by order field ASC
  const sortedFaqs = useMemo(() => {
    return [...faqs].sort((a, b) => a.order - b.order);
  }, [faqs]);

  // Filter by category
  const catFiltered = useMemo(() => {
    return filterCat === '전체' ? sortedFaqs : sortedFaqs.filter((f) => f.category === filterCat);
  }, [sortedFaqs, filterCat]);

  // Filter by search query
  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return catFiltered;
    const q = searchQuery.toLowerCase();
    return catFiltered.filter(
      (f) => f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q)
    );
  }, [catFiltered, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paged = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const uniqueCategories = new Set(faqs.map((f) => f.category));

  const handleSearch = () => {
    setSearchQuery(searchInput);
    setPage(1);
  };

  const openCreate = () => {
    setForm({ category: '주문', question: '', answer: '', order: faqs.length + 1, status: '게시중' });
    setActiveModal('create');
  };

  const openEdit = (faq: Faq) => {
    setEditingFaq(faq);
    setForm({ category: faq.category, question: faq.question, answer: faq.answer, order: faq.order, status: faq.status });
    setActiveModal('edit');
  };

  const openDelete = (id: string) => {
    setDeleteTarget(id);
    setActiveModal('delete');
  };

  const handleSave = () => {
    if (!form.question.trim()) return;
    if (activeModal === 'edit' && editingFaq) {
      setFaqs((prev) => prev.map((f) => f.id === editingFaq.id ? { ...f, category: form.category, question: form.question, answer: form.answer, order: form.order, status: form.status } : f));
      showToast('FAQ가 수정되었습니다.');
    } else {
      const newFaq: Faq = {
        id: `FAQ-${String(faqs.length + 1).padStart(3, '0')}`,
        category: form.category,
        question: form.question,
        answer: form.answer,
        order: form.order,
        status: form.status,
      };
      setFaqs((prev) => [...prev, newFaq]);
      showToast('FAQ가 등록되었습니다.');
    }
    setActiveModal(null);
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    setFaqs((prev) => prev.filter((f) => f.id !== deleteTarget));
    setActiveModal(null);
    setDeleteTarget(null);
    showToast('FAQ가 삭제되었습니다.');
  };

  const moveUp = (id: string) => {
    setFaqs((prev) => {
      const sorted = [...prev].sort((a, b) => a.order - b.order);
      const idx = sorted.findIndex((f) => f.id === id);
      if (idx <= 0) return prev;
      const arr = [...sorted];
      [arr[idx - 1], arr[idx]] = [arr[idx], arr[idx - 1]];
      return arr.map((f, i) => ({ ...f, order: i + 1 }));
    });
  };

  const moveDown = (id: string) => {
    setFaqs((prev) => {
      const sorted = [...prev].sort((a, b) => a.order - b.order);
      const idx = sorted.findIndex((f) => f.id === id);
      if (idx < 0 || idx >= sorted.length - 1) return prev;
      const arr = [...sorted];
      [arr[idx], arr[idx + 1]] = [arr[idx + 1], arr[idx]];
      return arr.map((f, i) => ({ ...f, order: i + 1 }));
    });
  };

  const getSeqNum = (pageIdx: number) => (page - 1) * ITEMS_PER_PAGE + pageIdx + 1;

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StatCard icon={<HelpCircle size={20} />} label="전체 FAQ" value={String(faqs.length)} change={`${faqs.length}건`} up={true} />
        <StatCard icon={<Filter size={20} />} label="카테고리" value={String(uniqueCategories.size)} change={`${uniqueCategories.size}개`} up={true} />
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-2 max-w-lg">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="w-full h-[var(--btn-height)] pl-9 pr-3 border border-[var(--border)] rounded-lg text-sm text-[var(--text)] bg-[var(--bg)] focus:outline-none focus:border-orange-500"
            placeholder="질문, 답변으로 검색"
          />
        </div>
        <button
          onClick={handleSearch}
          className="h-[var(--btn-height)] px-4 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors shrink-0"
        >
          조회
        </button>
      </div>

      {/* Filter + Add */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          {FAQ_CATEGORIES.map((cat) => (
            <button key={cat} onClick={() => { setFilterCat(cat); setPage(1); }} className={`px-3 h-[var(--btn-height)] text-sm rounded-full transition-colors ${filterCat === cat ? 'bg-orange-600 text-white' : 'bg-[var(--bg)] border border-[var(--border)] text-[var(--text-secondary)] hover:bg-gray-100'}`}>
              {cat}
            </button>
          ))}
        </div>
        <button onClick={openCreate} className="h-[var(--btn-height)] px-4 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors flex items-center gap-2">
          <Plus size={16} />
          FAQ 추가
        </button>
      </div>

      {/* Count */}
      <p className="text-sm text-[var(--text-secondary)]">총 {filtered.length}건</p>

      {/* Table */}
      <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[var(--bg)] border-b border-[var(--border)]">
                <th className="text-center px-4 py-3 font-medium text-[var(--text-secondary)] w-14">#</th>
                <th className="text-left px-5 py-3 font-medium text-[var(--text-secondary)]">카테고리</th>
                <th className="text-left px-5 py-3 font-medium text-[var(--text-secondary)]">질문</th>
                <th className="text-left px-5 py-3 font-medium text-[var(--text-secondary)]">답변</th>
                <th className="text-left px-5 py-3 font-medium text-[var(--text-secondary)]">상태</th>
                <th className="text-center px-5 py-3 font-medium text-[var(--text-secondary)]">조회수</th>
                <th className="text-center px-5 py-3 font-medium text-[var(--text-secondary)]">관리</th>
              </tr>
            </thead>
            <tbody>
              {paged.map((faq, idx) => (
                <tr key={faq.id} className="border-b border-[var(--border)] last:border-b-0 hover:bg-[var(--bg)] transition-colors">
                  <td className="px-4 py-3 text-center text-[var(--text-secondary)]">{getSeqNum(idx)}</td>
                  <td className="px-5 py-3"><StatusBadge status={faq.category} colorMap={FAQ_CATEGORY_COLORS} /></td>
                  <td className="px-5 py-3 text-[var(--text)] font-medium">{faq.question}</td>
                  <td className="px-5 py-3 text-[var(--text-secondary)] max-w-xs">
                    <span className="line-clamp-1">{faq.answer.length > 60 ? faq.answer.slice(0, 60) + '...' : faq.answer}</span>
                  </td>
                  <td className="px-5 py-3">
                    <StatusBadge status={faq.status} colorMap={{ 게시중: 'emerald', 비게시: 'gray' }} />
                  </td>
                  <td className="px-5 py-3 text-center text-[var(--text-secondary)]">{getSeqNum(idx) * 32 + 85}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-center gap-0.5">
                      <button onClick={() => openEdit(faq)} className="w-7 h-7 flex items-center justify-center rounded hover:bg-gray-100 transition-colors text-[var(--text-secondary)]" title="수정">
                        <Edit size={14} />
                      </button>
                      <button onClick={() => moveUp(faq.id)} className="w-7 h-7 flex items-center justify-center rounded hover:bg-gray-100 transition-colors text-[var(--text-secondary)]" title="위로">
                        <ChevronUp size={14} />
                      </button>
                      <button onClick={() => moveDown(faq.id)} className="w-7 h-7 flex items-center justify-center rounded hover:bg-gray-100 transition-colors text-[var(--text-secondary)]" title="아래로">
                        <ChevronDown size={14} />
                      </button>
                      <button onClick={() => openDelete(faq.id)} className="w-7 h-7 flex items-center justify-center rounded hover:bg-red-50 transition-colors text-red-400 hover:text-red-600" title="삭제">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {paged.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-[var(--text-secondary)]">검색 결과가 없습니다.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />

      {/* Create / Edit Modal */}
      {(activeModal === 'create' || activeModal === 'edit') && (
        <Modal isOpen={true} onClose={() => setActiveModal(null)} title={activeModal === 'edit' ? 'FAQ 수정' : 'FAQ 추가'} size="lg">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--text)] mb-1.5">카테고리</label>
              <select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value as Faq['category'] }))} className="w-full h-[var(--btn-height)] px-3 border border-[var(--border)] rounded-lg text-sm text-[var(--text)] bg-[var(--bg)] focus:outline-none focus:border-orange-500">
                <option value="주문">주문</option>
                <option value="배송">배송</option>
                <option value="제품">제품</option>
                <option value="계정">계정</option>
                <option value="기타">기타</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--text)] mb-1.5">질문</label>
              <input type="text" value={form.question} onChange={(e) => setForm((f) => ({ ...f, question: e.target.value }))} className="w-full h-[var(--btn-height)] px-3 border border-[var(--border)] rounded-lg text-sm text-[var(--text)] bg-[var(--bg)] focus:outline-none focus:border-orange-500" placeholder="자주 묻는 질문을 입력하세요" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--text)] mb-1.5">답변</label>
              <textarea value={form.answer} onChange={(e) => setForm((f) => ({ ...f, answer: e.target.value }))} className="w-full h-40 px-3 py-2 border border-[var(--border)] rounded-lg text-sm text-[var(--text)] bg-[var(--bg)] focus:outline-none focus:border-orange-500 resize-none" placeholder="답변 내용을 입력하세요" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--text)] mb-1.5">표시 순서</label>
              <input type="number" value={form.order} onChange={(e) => setForm((f) => ({ ...f, order: Number(e.target.value) }))} className="w-32 h-[var(--btn-height)] px-3 border border-[var(--border)] rounded-lg text-sm text-[var(--text)] bg-[var(--bg)] focus:outline-none focus:border-orange-500" min={1} />
            </div>
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-[var(--text)]">게시 상태</label>
              <button onClick={() => setForm((f) => ({ ...f, status: f.status === '게시중' ? '비게시' : '게시중' }))} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${form.status === '게시중' ? 'bg-orange-600' : 'bg-gray-200'}`}>
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm ${form.status === '게시중' ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
              <span className="text-xs text-[var(--text-secondary)]">{form.status}</span>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setActiveModal(null)} className="h-[var(--btn-height)] px-4 border border-[var(--border)] rounded-lg text-sm text-[var(--text)] hover:bg-gray-50 transition-colors">취소</button>
              <button onClick={handleSave} className="h-[var(--btn-height)] px-6 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors">저장</button>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Confirmation */}
      {activeModal === 'delete' && (
        <Modal isOpen={true} onClose={() => setActiveModal(null)} title="FAQ 삭제" size="sm">
          <div className="text-center space-y-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <AlertTriangle size={24} className="text-red-500" />
            </div>
            <p className="text-sm text-[var(--text)]">이 FAQ를 삭제하시겠습니까?<br />삭제된 FAQ는 복구할 수 없습니다.</p>
            <div className="flex justify-center gap-2">
              <button onClick={() => setActiveModal(null)} className="h-[var(--btn-height)] px-4 border border-[var(--border)] rounded-lg text-sm text-[var(--text)] hover:bg-gray-50 transition-colors">취소</button>
              <button onClick={handleDelete} className="h-[var(--btn-height)] px-6 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors">삭제</button>
            </div>
          </div>
        </Modal>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-[60] bg-gray-900 text-white px-5 py-3 rounded-lg text-sm shadow-lg">{toast}</div>
      )}
    </div>
  );
}

// =============================================================================
// Tab 3: 1:1 문의 관리
// =============================================================================

function InquiryManagement() {
  const [inquiries, setInquiries] = useState<Inquiry[]>(initialInquiries);
  const [activeModal, setActiveModal] = useState<'detail' | null>(null);
  const [selectedInq, setSelectedInq] = useState<Inquiry | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('전체');
  const [replyText, setReplyText] = useState('');
  const [toast, setToast] = useState('');
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchInput, setSearchInput] = useState('');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  // Sort by createdAt ASC (oldest first)
  const sortedInquiries = useMemo(() => {
    return [...inquiries].sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  }, [inquiries]);

  // Filter by status
  const statusFiltered = useMemo(() => {
    return filterStatus === '전체' ? sortedInquiries : sortedInquiries.filter((i) => i.status === filterStatus);
  }, [sortedInquiries, filterStatus]);

  // Filter by search query
  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return statusFiltered;
    const q = searchQuery.toLowerCase();
    return statusFiltered.filter(
      (i) => i.title.toLowerCase().includes(q) || i.customerName.toLowerCase().includes(q)
    );
  }, [statusFiltered, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paged = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const waitingCount = inquiries.filter((i) => i.status === '답변대기').length;
  const repliedCount = inquiries.filter((i) => i.status === '답변완료').length;
  const todayCount = inquiries.filter((i) => i.createdAt.startsWith('2026-03-20')).length;

  const handleSearch = () => {
    setSearchQuery(searchInput);
    setPage(1);
  };

  const openDetail = (inq: Inquiry) => {
    setSelectedInq(inq);
    setReplyText('');
    setActiveModal('detail');
  };

  const handleReply = () => {
    if (!selectedInq || !replyText.trim()) return;
    const now = new Date().toISOString().slice(0, 16).replace('T', ' ');
    setInquiries((prev) => prev.map((i) => i.id === selectedInq.id ? { ...i, status: '답변완료' as const, reply: replyText, repliedAt: now } : i));
    setSelectedInq((prev) => prev ? { ...prev, status: '답변완료' as const, reply: replyText, repliedAt: now } : prev);
    setReplyText('');
    showToast('답변이 등록되었습니다.');
  };

  const getSeqNum = (pageIdx: number) => (page - 1) * ITEMS_PER_PAGE + pageIdx + 1;

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard icon={<MessageSquare size={20} />} label="전체 문의" value={String(inquiries.length)} change={`${inquiries.length}건`} up={true} />
        <StatCard icon={<AlertTriangle size={20} />} label="답변대기" value={String(waitingCount)} change={`${waitingCount}건`} up={waitingCount > 0} />
        <StatCard icon={<Eye size={20} />} label="답변완료" value={String(repliedCount)} change={`${repliedCount}건`} up={true} />
        <StatCard icon={<Calendar size={20} />} label="오늘 접수" value={String(todayCount)} change={`${todayCount}건`} up={true} />
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-2 max-w-lg">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="w-full h-[var(--btn-height)] pl-9 pr-3 border border-[var(--border)] rounded-lg text-sm text-[var(--text)] bg-[var(--bg)] focus:outline-none focus:border-orange-500"
            placeholder="제목, 고객명으로 검색"
          />
        </div>
        <button
          onClick={handleSearch}
          className="h-[var(--btn-height)] px-4 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors shrink-0"
        >
          조회
        </button>
      </div>

      {/* Status Filter */}
      <div className="flex items-center gap-2">
        {['전체', '답변대기', '답변완료'].map((s) => (
          <button key={s} onClick={() => { setFilterStatus(s); setPage(1); }} className={`px-3 h-[var(--btn-height)] text-sm rounded-full transition-colors ${filterStatus === s ? 'bg-orange-600 text-white' : 'bg-[var(--bg)] border border-[var(--border)] text-[var(--text-secondary)] hover:bg-gray-100'}`}>
            {s}
          </button>
        ))}
      </div>

      {/* Count */}
      <p className="text-sm text-[var(--text-secondary)]">총 {filtered.length}건</p>

      {/* Table */}
      <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[var(--bg)] border-b border-[var(--border)]">
                <th className="text-center px-4 py-3 font-medium text-[var(--text-secondary)] w-14">#</th>
                <th className="text-left px-5 py-3 font-medium text-[var(--text-secondary)]">카테고리</th>
                <th className="text-left px-5 py-3 font-medium text-[var(--text-secondary)]">제목</th>
                <th className="text-left px-5 py-3 font-medium text-[var(--text-secondary)]">고객명</th>
                <th className="text-left px-5 py-3 font-medium text-[var(--text-secondary)]">접수일</th>
                <th className="text-left px-5 py-3 font-medium text-[var(--text-secondary)]">상태</th>
                <th className="text-center px-5 py-3 font-medium text-[var(--text-secondary)]">관리</th>
              </tr>
            </thead>
            <tbody>
              {paged.map((inq, idx) => (
                <tr key={inq.id} className="border-b border-[var(--border)] last:border-b-0 hover:bg-[var(--bg)] transition-colors">
                  <td className="px-4 py-3 text-center text-[var(--text-secondary)]">{getSeqNum(idx)}</td>
                  <td className="px-5 py-3"><StatusBadge status={inq.category} colorMap={INQUIRY_CATEGORY_COLORS} /></td>
                  <td className="px-5 py-3 text-[var(--text)] font-medium">{inq.title}</td>
                  <td className="px-5 py-3 text-[var(--text)]">{inq.customerName}</td>
                  <td className="px-5 py-3 text-[var(--text-secondary)] text-xs">{inq.createdAt}</td>
                  <td className="px-5 py-3"><StatusBadge status={inq.status} colorMap={INQUIRY_STATUS_COLORS} /></td>
                  <td className="px-5 py-3">
                    <div className="flex justify-center">
                      <button onClick={() => openDetail(inq)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors text-[var(--text-secondary)]" title="상세보기">
                        <Eye size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {paged.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-[var(--text-secondary)]">검색 결과가 없습니다.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />

      {/* Detail Modal */}
      {activeModal === 'detail' && selectedInq && (
        <Modal isOpen={true} onClose={() => setActiveModal(null)} title="문의 상세" size="lg">
          <div className="space-y-5">
            {/* Customer Info */}
            <div className="bg-[var(--bg)] rounded-lg p-4 border border-[var(--border)]">
              <h3 className="text-sm font-semibold text-[var(--text)] mb-3">고객 정보</h3>
              <div className="grid grid-cols-3 gap-3 text-sm">
                <div>
                  <span className="text-[var(--text-secondary)]">이름</span>
                  <p className="text-[var(--text)] font-medium mt-0.5">{selectedInq.customerName}</p>
                </div>
                <div>
                  <span className="text-[var(--text-secondary)]">이메일</span>
                  <p className="text-[var(--text)] font-medium mt-0.5">{selectedInq.customerEmail}</p>
                </div>
                <div>
                  <span className="text-[var(--text-secondary)]">소속</span>
                  <p className="text-[var(--text)] font-medium mt-0.5">{selectedInq.customerOrg}</p>
                </div>
              </div>
            </div>

            {/* Question */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <StatusBadge status={selectedInq.category} colorMap={INQUIRY_CATEGORY_COLORS} />
                <StatusBadge status={selectedInq.status} colorMap={INQUIRY_STATUS_COLORS} />
                <span className="text-xs text-[var(--text-secondary)]">{selectedInq.createdAt}</span>
              </div>
              <h4 className="text-base font-semibold text-[var(--text)] mb-2">{selectedInq.title}</h4>
              <div className="bg-[var(--bg)] rounded-lg p-4 border border-[var(--border)] text-sm text-[var(--text)] leading-relaxed">
                {selectedInq.content}
              </div>
            </div>

            {/* Attachments */}
            {selectedInq.attachments.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-[var(--text)] mb-2">첨부파일</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedInq.attachments.map((file, i) => (
                    <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[var(--bg)] border border-[var(--border)] rounded-lg text-xs text-[var(--text)]">
                      <ExternalLink size={12} />
                      {file}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Reply Section */}
            <div className="border-t border-[var(--border)] pt-4">
              <h4 className="text-sm font-semibold text-[var(--text)] mb-3">답변</h4>
              {selectedInq.status === '답변완료' ? (
                <div>
                  <div className="bg-orange-50 rounded-lg p-4 border border-orange-200 text-sm text-[var(--text)] leading-relaxed">
                    {selectedInq.reply}
                  </div>
                  <p className="text-xs text-[var(--text-secondary)] mt-2">답변일: {selectedInq.repliedAt}</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <textarea value={replyText} onChange={(e) => setReplyText(e.target.value)} className="w-full h-32 px-3 py-2 border border-[var(--border)] rounded-lg text-sm text-[var(--text)] bg-[var(--bg)] focus:outline-none focus:border-orange-500 resize-none" placeholder="답변 내용을 입력하세요" />
                  <div className="flex justify-end">
                    <button onClick={handleReply} disabled={!replyText.trim()} className="h-[var(--btn-height)] px-6 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                      <Send size={14} />
                      답변 등록
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Modal>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-[60] bg-gray-900 text-white px-5 py-3 rounded-lg text-sm shadow-lg">{toast}</div>
      )}
    </div>
  );
}

// =============================================================================
// Tab 4: 배너 관리
// =============================================================================

function BannerManagement() {
  const [banners, setBanners] = useState<Banner[]>(initialBanners);
  const [activeModal, setActiveModal] = useState<'create' | 'edit' | 'delete' | null>(null);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [toast, setToast] = useState('');
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [viewMode, setViewMode] = useState<'gallery' | 'table'>('gallery');

  const [form, setForm] = useState({
    title: '',
    linkUrl: '',
    position: '메인 상단' as Banner['position'],
    status: '활성' as Banner['status'],
    startDate: '',
    endDate: '',
    imageUrl: null as string | null,
    imageName: null as string | null,
  });
  const [isDragging, setIsDragging] = useState(false);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  // Sort by startDate ASC (oldest first)
  const sortedBanners = useMemo(() => {
    return [...banners].sort((a, b) => a.startDate.localeCompare(b.startDate));
  }, [banners]);

  // Filter by search query
  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return sortedBanners;
    const q = searchQuery.toLowerCase();
    return sortedBanners.filter((b) => b.title.toLowerCase().includes(q));
  }, [sortedBanners, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paged = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const activeCount = banners.filter((b) => b.status === '활성').length;

  const handleSearch = () => {
    setSearchQuery(searchInput);
    setPage(1);
  };

  const openCreate = () => {
    setForm({ title: '', linkUrl: '', position: '메인 상단', status: '활성', startDate: '', endDate: '', imageUrl: null, imageName: null });
    setActiveModal('create');
  };

  const openEdit = (b: Banner) => {
    setEditingBanner(b);
    setForm({ title: b.title, linkUrl: b.linkUrl, position: b.position, status: b.status, startDate: b.startDate, endDate: b.endDate, imageUrl: b.imageUrl, imageName: b.imageName });
    setActiveModal('edit');
  };

  const openDelete = (id: string) => {
    setDeleteTarget(id);
    setActiveModal('delete');
  };

  const handleSave = () => {
    if (!form.title.trim()) return;
    if (activeModal === 'edit' && editingBanner) {
      setBanners((prev) => prev.map((b) => b.id === editingBanner.id ? { ...b, ...form } : b));
      showToast('배너가 수정되었습니다.');
    } else {
      const newBanner: Banner = {
        id: `BNR-${String(banners.length + 1).padStart(3, '0')}`,
        ...form,
      };
      setBanners((prev) => [...prev, newBanner]);
      showToast('배너가 등록되었습니다.');
    }
    setActiveModal(null);
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    setBanners((prev) => prev.filter((b) => b.id !== deleteTarget));
    setActiveModal(null);
    setDeleteTarget(null);
    showToast('배너가 삭제되었습니다.');
  };

  const handleImageUpload = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setForm((f) => ({ ...f, imageUrl: url, imageName: file.name }));
      showToast(`${file.name} 업로드 완료`);
    } else {
      showToast('이미지 파일만 업로드 가능합니다.');
    }
  };

  const getSeqNum = (pageIdx: number) => (page - 1) * ITEMS_PER_PAGE + pageIdx + 1;

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StatCard icon={<Image size={20} />} label="전체 배너" value={String(banners.length)} change={`${banners.length}건`} up={true} />
        <StatCard icon={<Eye size={20} />} label="활성 배너" value={String(activeCount)} change={`${activeCount}건`} up={true} />
      </div>

      {/* Search Bar + View Toggle + Add Button */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2 flex-1 min-w-[280px] max-w-lg">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full h-[var(--btn-height)] pl-9 pr-3 border border-[var(--border)] rounded-lg text-sm text-[var(--text)] bg-[var(--bg)] focus:outline-none focus:border-orange-500"
              placeholder="제목으로 검색"
            />
          </div>
          <button
            onClick={handleSearch}
            className="h-[var(--btn-height)] px-4 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors shrink-0"
          >
            조회
          </button>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {/* View Toggle */}
          <div className="flex items-center rounded-lg overflow-hidden border border-[var(--border)]">
            <button
              onClick={() => setViewMode('gallery')}
              className={`h-[var(--btn-height)] px-3 flex items-center gap-1.5 text-sm transition-colors ${
                viewMode === 'gallery'
                  ? 'bg-orange-600 text-white'
                  : 'bg-[var(--bg)] text-[var(--text-secondary)] hover:bg-gray-100'
              }`}
            >
              <LayoutGrid size={15} />
              갤러리
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`h-[var(--btn-height)] px-3 flex items-center gap-1.5 text-sm transition-colors ${
                viewMode === 'table'
                  ? 'bg-orange-600 text-white'
                  : 'bg-[var(--bg)] text-[var(--text-secondary)] hover:bg-gray-100'
              }`}
            >
              <List size={15} />
              게시판
            </button>
          </div>
          <button onClick={openCreate} className="h-[var(--btn-height)] px-4 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors flex items-center gap-2">
            <Plus size={16} />
            배너 추가
          </button>
        </div>
      </div>

      {/* Count */}
      <p className="text-sm text-[var(--text-secondary)]">총 {filtered.length}건</p>

      {/* Gallery View */}
      {viewMode === 'gallery' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {paged.map((banner, idx) => (
            <div key={banner.id} className="bg-[var(--bg-card)] rounded-xl border border-[var(--border)] overflow-hidden">
              {/* Image */}
              {banner.imageUrl ? (
                <img src={banner.imageUrl} alt={banner.title} className="aspect-video w-full object-cover border-b border-[var(--border)]" />
              ) : (
                <div className="aspect-video border-b border-[var(--border)] border-dashed bg-[var(--bg)] flex items-center justify-center">
                  <div className="text-center">
                    <Image size={32} className="text-[var(--text-secondary)] mx-auto mb-2 opacity-40" />
                    <p className="text-xs text-[var(--text-secondary)]">배너 이미지 영역</p>
                    <p className="text-[10px] text-[var(--text-secondary)] opacity-60 mt-0.5">권장: 1200 x 400px</p>
                  </div>
                </div>
              )}
              {/* Info */}
              <div className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-[var(--text-secondary)]">#{getSeqNum(idx)}</span>
                    <h3 className="text-sm font-semibold text-[var(--text)] leading-snug">{banner.title}</h3>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <StatusBadge status={banner.status} colorMap={BANNER_STATUS_COLORS} />
                    <StatusBadge status={banner.position} colorMap={BANNER_POSITION_COLORS} />
                  </div>
                </div>
                <div className="space-y-1.5 text-xs text-[var(--text-secondary)]">
                  <div className="flex items-center gap-1.5">
                    <ExternalLink size={12} />
                    <span className="truncate">{banner.linkUrl}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar size={12} />
                    <span>{banner.startDate} ~ {banner.endDate}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <button onClick={() => openEdit(banner)} className="h-[var(--btn-height)] px-3 border border-[var(--border)] rounded-lg text-xs text-[var(--text)] hover:bg-gray-50 transition-colors flex items-center gap-1.5">
                    <Edit size={13} />
                    수정
                  </button>
                  <button onClick={() => openDelete(banner.id)} className="h-[var(--btn-height)] px-3 border border-red-200 rounded-lg text-xs text-red-500 hover:bg-red-50 transition-colors flex items-center gap-1.5">
                    <Trash2 size={13} />
                    삭제
                  </button>
                </div>
              </div>
            </div>
          ))}
          {paged.length === 0 && (
            <div className="col-span-2 py-12 text-center text-[var(--text-secondary)]">검색 결과가 없습니다.</div>
          )}
        </div>
      )}

      {/* Table View */}
      {viewMode === 'table' && (
        <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[var(--bg)] border-b border-[var(--border)]">
                  <th className="text-center px-4 py-3 font-medium text-[var(--text-secondary)] w-14">#</th>
                  <th className="text-left px-5 py-3 font-medium text-[var(--text-secondary)]">제목</th>
                  <th className="text-left px-5 py-3 font-medium text-[var(--text-secondary)]">위치</th>
                  <th className="text-left px-5 py-3 font-medium text-[var(--text-secondary)]">상태</th>
                  <th className="text-left px-5 py-3 font-medium text-[var(--text-secondary)]">게시기간</th>
                  <th className="text-left px-5 py-3 font-medium text-[var(--text-secondary)]">링크 URL</th>
                  <th className="text-center px-5 py-3 font-medium text-[var(--text-secondary)]">이미지</th>
                  <th className="text-center px-5 py-3 font-medium text-[var(--text-secondary)]">관리</th>
                </tr>
              </thead>
              <tbody>
                {paged.map((banner, idx) => (
                  <tr key={banner.id} className="border-b border-[var(--border)] last:border-b-0 hover:bg-[var(--bg)] transition-colors">
                    <td className="px-4 py-3 text-center text-[var(--text-secondary)]">{getSeqNum(idx)}</td>
                    <td className="px-5 py-3 text-[var(--text)] font-medium">{banner.title}</td>
                    <td className="px-5 py-3"><StatusBadge status={banner.position} colorMap={BANNER_POSITION_COLORS} /></td>
                    <td className="px-5 py-3"><StatusBadge status={banner.status} colorMap={BANNER_STATUS_COLORS} /></td>
                    <td className="px-5 py-3 text-[var(--text-secondary)] text-xs">{banner.startDate} ~ {banner.endDate}</td>
                    <td className="px-5 py-3 text-[var(--text-secondary)] text-xs max-w-[200px]">
                      <span className="truncate block">{banner.linkUrl}</span>
                    </td>
                    <td className="px-5 py-3 text-center">
                      {banner.imageUrl ? (
                        <img src={banner.imageUrl} alt={banner.title} className="w-16 h-10 object-cover rounded border border-[var(--border)] mx-auto" />
                      ) : (
                        <span className="text-xs text-[var(--text-secondary)]">없음</span>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <button onClick={() => openEdit(banner)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors text-[var(--text-secondary)]" title="수정">
                          <Edit size={15} />
                        </button>
                        <button onClick={() => openDelete(banner.id)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 transition-colors text-red-400 hover:text-red-600" title="삭제">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {paged.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-5 py-12 text-center text-[var(--text-secondary)]">검색 결과가 없습니다.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />

      {/* Create / Edit Modal */}
      {(activeModal === 'create' || activeModal === 'edit') && (
        <Modal isOpen={true} onClose={() => setActiveModal(null)} title={activeModal === 'edit' ? '배너 수정' : '배너 추가'} size="lg">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--text)] mb-1.5">제목</label>
              <input type="text" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} className="w-full h-[var(--btn-height)] px-3 border border-[var(--border)] rounded-lg text-sm text-[var(--text)] bg-[var(--bg)] focus:outline-none focus:border-orange-500" placeholder="배너 제목을 입력하세요" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--text)] mb-1.5">링크 URL</label>
              <input type="url" value={form.linkUrl} onChange={(e) => setForm((f) => ({ ...f, linkUrl: e.target.value }))} className="w-full h-[var(--btn-height)] px-3 border border-[var(--border)] rounded-lg text-sm text-[var(--text)] bg-[var(--bg)] focus:outline-none focus:border-orange-500" placeholder="https://example.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--text)] mb-1.5">위치</label>
              <select value={form.position} onChange={(e) => setForm((f) => ({ ...f, position: e.target.value as Banner['position'] }))} className="w-full h-[var(--btn-height)] px-3 border border-[var(--border)] rounded-lg text-sm text-[var(--text)] bg-[var(--bg)] focus:outline-none focus:border-orange-500">
                <option value="메인 상단">메인 상단</option>
                <option value="메인 하단">메인 하단</option>
                <option value="사이드바">사이드바</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[var(--text)] mb-1.5">시작일</label>
                <input type="date" value={form.startDate} onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))} className="w-full h-[var(--btn-height)] px-3 border border-[var(--border)] rounded-lg text-sm text-[var(--text)] bg-[var(--bg)] focus:outline-none focus:border-orange-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text)] mb-1.5">종료일</label>
                <input type="date" value={form.endDate} onChange={(e) => setForm((f) => ({ ...f, endDate: e.target.value }))} className="w-full h-[var(--btn-height)] px-3 border border-[var(--border)] rounded-lg text-sm text-[var(--text)] bg-[var(--bg)] focus:outline-none focus:border-orange-500" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--text)] mb-1.5">상태</label>
              <div className="flex items-center gap-4">
                {(['활성', '비활성', '예약'] as const).map((s) => (
                  <label key={s} className="flex items-center gap-1.5 cursor-pointer">
                    <input type="radio" name="bannerStatus" checked={form.status === s} onChange={() => setForm((f) => ({ ...f, status: s }))} className="accent-orange-600" />
                    <span className="text-sm text-[var(--text)]">{s}</span>
                  </label>
                ))}
              </div>
            </div>
            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-[var(--text)] mb-1.5">배너 이미지</label>
              {form.imageUrl ? (
                <div className="relative border border-[var(--border)] rounded-lg overflow-hidden">
                  <img src={form.imageUrl} alt="배너 미리보기" className="w-full aspect-video object-cover" />
                  <div className="absolute top-2 right-2 flex items-center gap-1.5">
                    <span className="bg-black/60 text-white text-xs px-2 py-1 rounded">{form.imageName}</span>
                    <button
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, imageUrl: null, imageName: null }))}
                      className="w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
                    isDragging ? 'border-orange-500 bg-orange-50' : 'border-[var(--border)] hover:border-orange-300'
                  }`}
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    const file = e.dataTransfer.files?.[0];
                    if (file) handleImageUpload(file);
                  }}
                  onClick={() => {
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = 'image/jpeg,image/png,image/webp';
                    input.onchange = (e) => {
                      const file = (e.target as HTMLInputElement).files?.[0];
                      if (file) handleImageUpload(file);
                    };
                    input.click();
                  }}
                >
                  <Upload size={28} className={`mx-auto mb-2 ${isDragging ? 'text-orange-500' : 'text-[var(--text-secondary)] opacity-50'}`} />
                  <p className="text-sm text-[var(--text-secondary)]">
                    {isDragging ? '여기에 이미지를 놓으세요' : '클릭 또는 드래그하여 이미지를 업로드하세요'}
                  </p>
                  <p className="text-xs text-[var(--text-secondary)] opacity-60 mt-1">권장 크기: 1200 x 400px / JPG, PNG, WebP</p>
                </div>
              )}
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setActiveModal(null)} className="h-[var(--btn-height)] px-4 border border-[var(--border)] rounded-lg text-sm text-[var(--text)] hover:bg-gray-50 transition-colors">취소</button>
              <button onClick={handleSave} className="h-[var(--btn-height)] px-6 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors">저장</button>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Confirmation */}
      {activeModal === 'delete' && (
        <Modal isOpen={true} onClose={() => setActiveModal(null)} title="배너 삭제" size="sm">
          <div className="text-center space-y-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <AlertTriangle size={24} className="text-red-500" />
            </div>
            <p className="text-sm text-[var(--text)]">이 배너를 삭제하시겠습니까?<br />삭제된 배너는 복구할 수 없습니다.</p>
            <div className="flex justify-center gap-2">
              <button onClick={() => setActiveModal(null)} className="h-[var(--btn-height)] px-4 border border-[var(--border)] rounded-lg text-sm text-[var(--text)] hover:bg-gray-50 transition-colors">취소</button>
              <button onClick={handleDelete} className="h-[var(--btn-height)] px-6 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors">삭제</button>
            </div>
          </div>
        </Modal>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-[60] bg-gray-900 text-white px-5 py-3 rounded-lg text-sm shadow-lg">{toast}</div>
      )}
    </div>
  );
}

// =============================================================================
// Tab 5: Shop 메인 관리
// =============================================================================

function MainSectionManagement() {
  const [sections, setSections] = useState<MainSection[]>(initialMainSections);
  const [toast, setToast] = useState('');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  const sortedSections = useMemo(() => {
    return [...sections].sort((a, b) => a.position - b.position);
  }, [sections]);

  const visibleSections = sortedSections.filter((s) => s.visible);

  const toggleVisibility = (id: string) => {
    setSections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, visible: !s.visible } : s))
    );
    showToast('노출 상태가 변경되었습니다.');
  };

  const moveSection = (id: string, direction: 'up' | 'down') => {
    setSections((prev) => {
      const sorted = [...prev].sort((a, b) => a.position - b.position);
      const idx = sorted.findIndex((s) => s.id === id);
      if (direction === 'up' && idx <= 0) return prev;
      if (direction === 'down' && idx >= sorted.length - 1) return prev;
      const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
      const arr = [...sorted];
      [arr[idx], arr[swapIdx]] = [arr[swapIdx], arr[idx]];
      return arr.map((s, i) => ({ ...s, position: i + 1 }));
    });
  };

  return (
    <div className="space-y-4">
      {/* Description */}
      <p className="text-sm text-[var(--text-secondary)]">
        Shop 메인 페이지에 표시되는 섹션을 관리합니다.
      </p>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard icon={<Layout size={20} />} label="전체 섹션" value={String(sections.length)} change={`${sections.length}개`} up={true} />
        <StatCard icon={<Eye size={20} />} label="노출중" value={String(visibleSections.length)} change={`${visibleSections.length}개`} up={true} />
        <StatCard icon={<Layers size={20} />} label="비노출" value={String(sections.length - visibleSections.length)} change={`${sections.length - visibleSections.length}개`} up={false} />
      </div>

      {/* Add Button */}
      <div className="flex justify-end">
        <button onClick={() => showToast('섹션 추가 기능은 준비 중입니다.')} className="h-[var(--btn-height)] px-4 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors flex items-center gap-2">
          <Plus size={16} />
          섹션 추가
        </button>
      </div>

      {/* Section List */}
      <div className="space-y-3">
        {sortedSections.map((section) => (
          <div
            key={section.id}
            className={`bg-[var(--bg-card)] rounded-xl border border-[var(--border)] p-4 flex items-center gap-4 transition-opacity ${
              !section.visible ? 'opacity-50' : ''
            }`}
          >
            {/* Drag Handle + Position */}
            <div className="flex items-center gap-2 shrink-0">
              <GripVertical size={18} className="text-[var(--text-secondary)] cursor-grab" />
              <span className="w-7 h-7 bg-orange-100 text-orange-700 rounded-full flex items-center justify-center text-xs font-bold">
                {section.position}
              </span>
            </div>

            {/* Section Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-sm font-semibold text-[var(--text)]">{section.name}</h3>
                <StatusBadge status={section.type} colorMap={SECTION_TYPE_COLORS} />
              </div>
              <div className="flex items-center gap-4 text-xs text-[var(--text-secondary)]">
                <span>{section.source}</span>
                <span>{section.itemCount}개 항목</span>
                <span>최종 수정: {section.updatedAt}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => moveSection(section.id, 'up')}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors text-[var(--text-secondary)]"
                title="위로"
              >
                <ChevronUp size={16} />
              </button>
              <button
                onClick={() => moveSection(section.id, 'down')}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors text-[var(--text-secondary)]"
                title="아래로"
              >
                <ChevronDown size={16} />
              </button>
              <button
                onClick={() => toggleVisibility(section.id)}
                className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${
                  section.visible
                    ? 'hover:bg-gray-100 text-[var(--text-secondary)]'
                    : 'hover:bg-gray-100 text-gray-400'
                }`}
                title={section.visible ? '숨기기' : '보이기'}
              >
                {section.visible ? <Eye size={16} /> : <EyeOff size={16} />}
              </button>
              <button onClick={() => showToast(`"${section.name}" 섹션 수정 기능은 준비 중입니다.`)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors text-[var(--text-secondary)]" title="수정">
                <Edit size={15} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Preview Section */}
      <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border)] p-5 mt-6">
        <h3 className="text-sm font-semibold text-[var(--text)] mb-4 flex items-center gap-2">
          <MonitorSmartphone size={16} />
          메인 페이지 미리보기
        </h3>
        <div className="bg-[var(--bg)] rounded-lg border border-[var(--border)] p-4 space-y-3">
          {visibleSections.map((section) => (
            <div key={section.id} className="flex items-center gap-3 px-3 py-2.5 bg-[var(--bg-card)] rounded-lg border border-dashed border-[var(--border)]">
              <span className="w-6 h-6 bg-orange-100 text-orange-700 rounded flex items-center justify-center text-[10px] font-bold shrink-0">
                {section.position}
              </span>
              <span className="text-sm text-[var(--text)] font-medium">{section.name}</span>
              <StatusBadge status={section.type} colorMap={SECTION_TYPE_COLORS} />
              <span className="text-xs text-[var(--text-secondary)] ml-auto">{section.itemCount}개 항목</span>
            </div>
          ))}
          {visibleSections.length === 0 && (
            <p className="text-sm text-[var(--text-secondary)] text-center py-6">노출 중인 섹션이 없습니다.</p>
          )}
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-[60] bg-gray-900 text-white px-5 py-3 rounded-lg text-sm shadow-lg">{toast}</div>
      )}
    </div>
  );
}

// =============================================================================
// Tab 6: 카테고리 노출
// =============================================================================

const CATEGORY_ICON_MAP: Record<string, React.ReactNode> = {
  Flask: <FlaskConical size={16} />,
  Atom: <Atom size={16} />,
  Dna: <Dna size={16} />,
  TestTube: <TestTube size={16} />,
  Beaker: <Beaker size={16} />,
  Scale: <Scale size={16} />,
  Shield: <Shield size={16} />,
};

function CategoryDisplayManagement() {
  const [categories, setCategories] = useState<CategoryDisplay[]>(initialCategoryDisplay);
  const [sidebarMaxCount, setSidebarMaxCount] = useState(6);
  const [hideEmpty, setHideEmpty] = useState(true);
  const [showItemCount, setShowItemCount] = useState(true);
  const [toast, setToast] = useState('');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  const sortedCategories = useMemo(() => {
    return [...categories].sort((a, b) => a.displayOrder - b.displayOrder);
  }, [categories]);

  const visibleCount = categories.filter((c) => c.visible).length;
  const featuredCount = categories.filter((c) => c.featured).length;
  const totalItems = categories.reduce((sum, c) => sum + c.itemCount, 0);

  const toggleVisibility = (id: string) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, visible: !c.visible } : c))
    );
    showToast('카테고리 노출 상태가 변경되었습니다.');
  };

  const toggleFeatured = (id: string) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, featured: !c.featured } : c))
    );
    showToast('추천 카테고리 설정이 변경되었습니다.');
  };

  const moveCategory = (id: string, direction: 'up' | 'down') => {
    setCategories((prev) => {
      const sorted = [...prev].sort((a, b) => a.displayOrder - b.displayOrder);
      const idx = sorted.findIndex((c) => c.id === id);
      if (direction === 'up' && idx <= 0) return prev;
      if (direction === 'down' && idx >= sorted.length - 1) return prev;
      const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
      const arr = [...sorted];
      [arr[idx], arr[swapIdx]] = [arr[swapIdx], arr[idx]];
      return arr.map((c, i) => ({ ...c, displayOrder: i + 1 }));
    });
  };

  return (
    <div className="space-y-4">
      {/* Description */}
      <p className="text-sm text-[var(--text-secondary)]">
        Shop 사이드바 및 카탈로그의 카테고리 노출 순서와 설정을 관리합니다.
      </p>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard icon={<Layers size={20} />} label="전체 카테고리" value={String(categories.length)} change={`${categories.length}개`} up={true} />
        <StatCard icon={<Eye size={20} />} label="노출중" value={String(visibleCount)} change={`${visibleCount}개`} up={true} />
        <StatCard icon={<Star size={20} />} label="추천 카테고리" value={String(featuredCount)} change={`${featuredCount}개`} up={true} />
        <StatCard icon={<Hash size={20} />} label="전체 제품수" value={totalItems.toLocaleString()} change={`${totalItems.toLocaleString()}개`} up={true} />
      </div>

      {/* Category List */}
      <div className="space-y-2">
        {sortedCategories.map((category) => (
          <div
            key={category.id}
            className={`bg-[var(--bg-card)] rounded-xl border border-[var(--border)] p-4 flex items-center gap-4 transition-opacity ${
              !category.visible ? 'opacity-50' : ''
            }`}
          >
            {/* Drag Handle + Order */}
            <div className="flex items-center gap-2 shrink-0">
              <GripVertical size={18} className="text-[var(--text-secondary)] cursor-grab" />
              <span className="w-7 h-7 bg-orange-100 text-orange-700 rounded-full flex items-center justify-center text-xs font-bold">
                {category.displayOrder}
              </span>
            </div>

            {/* Icon */}
            <div className="w-9 h-9 bg-[var(--bg)] rounded-lg flex items-center justify-center text-[var(--text-secondary)] shrink-0">
              {CATEGORY_ICON_MAP[category.icon] || <Layers size={16} />}
            </div>

            {/* Category Info */}
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-[var(--text)]">{category.name}</h3>
              <span className="text-xs text-[var(--text-secondary)]">{category.itemCount.toLocaleString()}개 제품</span>
            </div>

            {/* Featured Toggle */}
            <button
              onClick={() => toggleFeatured(category.id)}
              className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${
                category.featured
                  ? 'text-amber-500 hover:bg-amber-50'
                  : 'text-gray-300 hover:bg-gray-100'
              }`}
              title={category.featured ? '추천 해제' : '추천 설정'}
            >
              <Star size={18} fill={category.featured ? 'currentColor' : 'none'} />
            </button>

            {/* Reorder */}
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => moveCategory(category.id, 'up')}
                className="w-7 h-7 flex items-center justify-center rounded hover:bg-gray-100 transition-colors text-[var(--text-secondary)]"
                title="위로"
              >
                <ChevronUp size={14} />
              </button>
              <button
                onClick={() => moveCategory(category.id, 'down')}
                className="w-7 h-7 flex items-center justify-center rounded hover:bg-gray-100 transition-colors text-[var(--text-secondary)]"
                title="아래로"
              >
                <ChevronDown size={14} />
              </button>
            </div>

            {/* Visibility Toggle */}
            <button
              onClick={() => toggleVisibility(category.id)}
              className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${
                category.visible
                  ? 'hover:bg-gray-100 text-[var(--text-secondary)]'
                  : 'hover:bg-gray-100 text-gray-400'
              }`}
              title={category.visible ? '숨기기' : '보이기'}
            >
              {category.visible ? <Eye size={16} /> : <EyeOff size={16} />}
            </button>
          </div>
        ))}
      </div>

      {/* Settings */}
      <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border)] p-5 mt-6">
        <h3 className="text-sm font-semibold text-[var(--text)] mb-4 flex items-center gap-2">
          <Filter size={16} />
          카테고리 표시 설정
        </h3>
        <div className="space-y-4">
          {/* Sidebar Max Count */}
          <div className="flex items-center justify-between">
            <label className="text-sm text-[var(--text)]">사이드바 최대 표시 개수</label>
            <input
              type="number"
              value={sidebarMaxCount}
              onChange={(e) => setSidebarMaxCount(Number(e.target.value))}
              min={1}
              max={20}
              className="w-20 h-[var(--btn-height)] px-3 border border-[var(--border)] rounded-lg text-sm text-[var(--text)] bg-[var(--bg)] focus:outline-none focus:border-orange-500 text-center"
            />
          </div>

          {/* Hide Empty */}
          <div className="flex items-center justify-between">
            <label className="text-sm text-[var(--text)]">비어있는 카테고리 숨김</label>
            <button
              onClick={() => setHideEmpty(!hideEmpty)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${hideEmpty ? 'bg-orange-600' : 'bg-gray-200'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm ${hideEmpty ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>

          {/* Show Item Count */}
          <div className="flex items-center justify-between">
            <label className="text-sm text-[var(--text)]">제품수 표시</label>
            <button
              onClick={() => setShowItemCount(!showItemCount)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${showItemCount ? 'bg-orange-600' : 'bg-gray-200'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm ${showItemCount ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-[60] bg-gray-900 text-white px-5 py-3 rounded-lg text-sm shadow-lg">{toast}</div>
      )}
    </div>
  );
}

// =============================================================================
// Tab 7: 팝업 관리
// =============================================================================

function PopupManagement() {
  const [popups, setPopups] = useState<Popup[]>(initialPopups);
  const [activeModal, setActiveModal] = useState<'create' | null>(null);
  const [toast, setToast] = useState('');

  const [form, setForm] = useState({
    title: '',
    type: '이벤트' as Popup['type'],
    content: '',
    position: 'center' as Popup['position'],
    startDate: '',
    endDate: '',
    showOnce: false,
  });

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  const activeCount = popups.filter((p) => p.status === '활성').length;
  const scheduledCount = popups.filter((p) => p.status === '예약').length;
  const totalViews = popups.reduce((sum, p) => sum + p.views, 0);
  const totalClosed = popups.reduce((sum, p) => sum + p.closedCount, 0);
  const avgCloseRate = totalViews > 0 ? ((totalClosed / totalViews) * 100).toFixed(1) : '0.0';

  const activePopup = popups.find((p) => p.status === '활성');

  const openCreate = () => {
    setForm({ title: '', type: '이벤트', content: '', position: 'center', startDate: '', endDate: '', showOnce: false });
    setActiveModal('create');
  };

  const handleSave = () => {
    if (!form.title.trim()) return;
    const newPopup: Popup = {
      id: `PU-${String(popups.length + 1).padStart(3, '0')}`,
      title: form.title,
      type: form.type,
      startDate: form.startDate,
      endDate: form.endDate,
      showOnce: form.showOnce,
      status: '예약',
      views: 0,
      closedCount: 0,
      position: form.position,
    };
    setPopups((prev) => [...prev, newPopup]);
    setActiveModal(null);
    showToast('팝업이 생성되었습니다.');
  };

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard icon={<Maximize size={20} />} label="활성 팝업" value={String(activeCount)} change={`${activeCount}개`} up={true} />
        <StatCard icon={<Calendar size={20} />} label="예약 팝업" value={String(scheduledCount)} change={`${scheduledCount}개`} up={true} />
        <StatCard icon={<Eye size={20} />} label="총 노출수" value={totalViews.toLocaleString()} change={`${totalViews.toLocaleString()}회`} up={true} />
        <StatCard icon={<Minimize size={20} />} label="평균 닫기율" value={`${avgCloseRate}%`} change={`${avgCloseRate}%`} up={false} />
      </div>

      {/* Add Button */}
      <div className="flex justify-end">
        <button onClick={openCreate} className="h-[var(--btn-height)] px-4 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors flex items-center gap-2">
          <Plus size={16} />
          팝업 생성
        </button>
      </div>

      {/* Popup Table */}
      <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[var(--bg)] border-b border-[var(--border)]">
                <th className="text-left px-5 py-3 font-medium text-[var(--text-secondary)]">ID</th>
                <th className="text-left px-5 py-3 font-medium text-[var(--text-secondary)]">제목</th>
                <th className="text-left px-5 py-3 font-medium text-[var(--text-secondary)]">유형</th>
                <th className="text-left px-5 py-3 font-medium text-[var(--text-secondary)]">위치</th>
                <th className="text-left px-5 py-3 font-medium text-[var(--text-secondary)]">기간</th>
                <th className="text-center px-5 py-3 font-medium text-[var(--text-secondary)]">노출수</th>
                <th className="text-center px-5 py-3 font-medium text-[var(--text-secondary)]">닫기수</th>
                <th className="text-left px-5 py-3 font-medium text-[var(--text-secondary)]">상태</th>
              </tr>
            </thead>
            <tbody>
              {popups.map((popup) => (
                <tr key={popup.id} className="border-b border-[var(--border)] last:border-b-0 hover:bg-[var(--bg)] transition-colors">
                  <td className="px-5 py-3 text-xs font-mono text-[var(--text-secondary)]">{popup.id}</td>
                  <td className="px-5 py-3 text-[var(--text)] font-medium">{popup.title}</td>
                  <td className="px-5 py-3"><StatusBadge status={popup.type} colorMap={POPUP_TYPE_COLORS} /></td>
                  <td className="px-5 py-3 text-[var(--text-secondary)] text-xs">{POPUP_POSITION_LABELS[popup.position]}</td>
                  <td className="px-5 py-3 text-[var(--text-secondary)] text-xs">{popup.startDate} ~ {popup.endDate}</td>
                  <td className="px-5 py-3 text-center text-[var(--text)]">{popup.views.toLocaleString()}</td>
                  <td className="px-5 py-3 text-center text-[var(--text)]">{popup.closedCount.toLocaleString()}</td>
                  <td className="px-5 py-3"><StatusBadge status={popup.status} colorMap={POPUP_STATUS_COLORS} /></td>
                </tr>
              ))}
              {popups.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center text-[var(--text-secondary)]">등록된 팝업이 없습니다.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Active Popup Preview */}
      {activePopup && (
        <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border)] p-5">
          <h3 className="text-sm font-semibold text-[var(--text)] mb-3 flex items-center gap-2">
            <MonitorSmartphone size={16} />
            현재 활성 팝업 미리보기
          </h3>
          <div className="bg-[var(--bg)] rounded-lg border border-[var(--border)] p-6">
            <div className="max-w-sm mx-auto bg-[var(--bg-card)] rounded-xl border border-[var(--border)] shadow-lg overflow-hidden">
              {/* Popup Header */}
              <div className="px-4 py-3 border-b border-[var(--border)] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <StatusBadge status={activePopup.type} colorMap={POPUP_TYPE_COLORS} />
                  <span className="text-xs text-[var(--text-secondary)]">{POPUP_POSITION_LABELS[activePopup.position]}</span>
                </div>
                <button onClick={() => showToast('팝업 닫기 미리보기')} className="w-6 h-6 flex items-center justify-center rounded hover:bg-gray-100 text-[var(--text-secondary)]">
                  <X size={14} />
                </button>
              </div>
              {/* Popup Content */}
              <div className="p-5 text-center">
                <h4 className="text-base font-semibold text-[var(--text)] mb-2">{activePopup.title}</h4>
                <div className="w-full h-32 bg-[var(--bg)] rounded-lg border border-dashed border-[var(--border)] flex items-center justify-center mb-3">
                  <div className="text-center">
                    <Image size={24} className="text-[var(--text-secondary)] mx-auto mb-1 opacity-40" />
                    <p className="text-xs text-[var(--text-secondary)]">팝업 이미지 영역</p>
                  </div>
                </div>
                <p className="text-xs text-[var(--text-secondary)]">{activePopup.startDate} ~ {activePopup.endDate}</p>
              </div>
              {/* Popup Footer */}
              <div className="px-4 py-3 border-t border-[var(--border)] flex items-center justify-between">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input type="checkbox" checked={activePopup.showOnce} readOnly className="accent-orange-600" />
                  <span className="text-xs text-[var(--text-secondary)]">하루 동안 보지 않기</span>
                </label>
                <span className="text-xs text-[var(--text-secondary)]">노출 {activePopup.views.toLocaleString()}회</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Modal */}
      {activeModal === 'create' && (
        <Modal isOpen={true} onClose={() => setActiveModal(null)} title="팝업 생성" size="lg">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--text)] mb-1.5">제목</label>
              <input type="text" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} className="w-full h-[var(--btn-height)] px-3 border border-[var(--border)] rounded-lg text-sm text-[var(--text)] bg-[var(--bg)] focus:outline-none focus:border-orange-500" placeholder="팝업 제목을 입력하세요" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--text)] mb-1.5">유형</label>
              <select value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as Popup['type'] }))} className="w-full h-[var(--btn-height)] px-3 border border-[var(--border)] rounded-lg text-sm text-[var(--text)] bg-[var(--bg)] focus:outline-none focus:border-orange-500">
                <option value="공지">공지</option>
                <option value="이벤트">이벤트</option>
                <option value="기타">기타</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--text)] mb-1.5">내용</label>
              <textarea value={form.content} onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))} className="w-full h-32 px-3 py-2 border border-[var(--border)] rounded-lg text-sm text-[var(--text)] bg-[var(--bg)] focus:outline-none focus:border-orange-500 resize-none" placeholder="팝업 내용을 입력하세요" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--text)] mb-1.5">위치</label>
              <select value={form.position} onChange={(e) => setForm((f) => ({ ...f, position: e.target.value as Popup['position'] }))} className="w-full h-[var(--btn-height)] px-3 border border-[var(--border)] rounded-lg text-sm text-[var(--text)] bg-[var(--bg)] focus:outline-none focus:border-orange-500">
                <option value="center">중앙</option>
                <option value="bottom-right">우하단</option>
                <option value="top-bar">상단 바</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[var(--text)] mb-1.5">시작일</label>
                <input type="date" value={form.startDate} onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))} className="w-full h-[var(--btn-height)] px-3 border border-[var(--border)] rounded-lg text-sm text-[var(--text)] bg-[var(--bg)] focus:outline-none focus:border-orange-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text)] mb-1.5">종료일</label>
                <input type="date" value={form.endDate} onChange={(e) => setForm((f) => ({ ...f, endDate: e.target.value }))} className="w-full h-[var(--btn-height)] px-3 border border-[var(--border)] rounded-lg text-sm text-[var(--text)] bg-[var(--bg)] focus:outline-none focus:border-orange-500" />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-[var(--text)]">하루 한번만 표시</label>
              <button onClick={() => setForm((f) => ({ ...f, showOnce: !f.showOnce }))} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${form.showOnce ? 'bg-orange-600' : 'bg-gray-200'}`}>
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm ${form.showOnce ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
            {/* Image Upload Placeholder */}
            <div>
              <label className="block text-sm font-medium text-[var(--text)] mb-1.5">이미지</label>
              <div className="border-2 border-dashed border-[var(--border)] rounded-lg p-8 text-center hover:border-orange-300 transition-colors cursor-pointer">
                <Upload size={28} className="mx-auto mb-2 text-[var(--text-secondary)] opacity-50" />
                <p className="text-sm text-[var(--text-secondary)]">클릭 또는 드래그하여 이미지를 업로드하세요</p>
                <p className="text-xs text-[var(--text-secondary)] opacity-60 mt-1">권장 크기: 480 x 360px / JPG, PNG, WebP</p>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setActiveModal(null)} className="h-[var(--btn-height)] px-4 border border-[var(--border)] rounded-lg text-sm text-[var(--text)] hover:bg-gray-50 transition-colors">취소</button>
              <button onClick={handleSave} className="h-[var(--btn-height)] px-6 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors">저장</button>
            </div>
          </div>
        </Modal>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-[60] bg-gray-900 text-white px-5 py-3 rounded-lg text-sm shadow-lg">{toast}</div>
      )}
    </div>
  );
}
