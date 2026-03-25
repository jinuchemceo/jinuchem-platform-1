// =============================================================================
// JINUCHEM Admin Platform - Comprehensive Mock Data
// =============================================================================

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface User {
  id: string;
  name: string;
  email: string;
  org: string;           // 주 소속 기관명 (표시용)
  orgId: string;         // 주 소속 기관 ID
  orgIds: string[];      // 소속 기관 ID 목록 (다중 소속 지원)
  role: '연구원' | '조직장' | '기업장' | '공급자' | '시스템관리자';
  status: '활성' | '비활성';
  lastLogin: string;
  loginCount: number;
  department: string;
  phone: string;
  createdAt: string;
}

export interface OrgDocument {
  fileName: string | null;
  uploadedAt: string | null;
  verified: boolean;
}

export interface Organization {
  id: string;
  name: string;
  type: '대학' | '기업' | '연구소';
  memberCount: number;
  admin: string;
  budget: number;
  usedBudget: number;
  status: '활성' | '비활성';
  zipCode: string;
  address: string;
  contact: string;
  createdAt: string;
  // 필수 서류 (기업/공급사)
  businessLicense: OrgDocument;   // 사업자등록증
  bankAccount: OrgDocument;       // 통장사본
  businessNo?: string;            // 사업자등록번호
  bankInfo?: string;              // 은행/계좌정보
}

export interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  action: '로그인' | '주문' | '설정변경' | '역할변경' | '제품등록' | 'API호출';
  details: string;
  ipAddress: string;
  timestamp: string;
}

export interface ProductVariant {
  size: string;
  unit: string;
  listPrice: number;
  salePrice: number;
  stock: number;
  sameDayShip: boolean;
  status: '판매중' | '일시품절' | '판매중단';
}

export interface AdminProduct {
  id: string;
  catalogNo: string;
  name: string;
  casNumber: string;
  supplier: string;
  category: string;
  subCategory: string;
  type: '시약' | '소모품';
  variants: ProductVariant[];
  status: '판매중' | '일시품절' | '판매중단';
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  parentId: string | null;
  productCount: number;
  status: '활성' | '비활성';
  order: number;
}

export interface SupplierMapping {
  id: string;
  name: string;
  productCount: number;
  avgPrice: number;
  lastSync: string;
  syncStatus: '성공' | '실패' | '동기화중';
  contact: string;
  apiUrl: string;
}

export interface SupplierSettlement {
  supplierId: string;
  supplierName: string;
  period: string;
  productCount: number;
  orderCount: number;
  totalSales: number;
  commission: number;
  commissionRate: number;
  netPayment: number;
  status: '정산완료' | '정산대기' | '확인중';
  settledAt: string | null;
}

export interface Recommendation {
  id: string;
  userId: string;
  userName: string;
  products: string[];
  score: number;
  clicked: boolean;
  timestamp: string;
}

export interface Prediction {
  id: string;
  orgName: string;
  type: '소모량' | '예산' | '재주문';
  predicted: number;
  actual: number;
  error: number;
  confidence: number;
  timestamp: string;
}

export interface Report {
  id: string;
  orgName: string;
  type: '구매패턴' | '트렌드' | '계절성';
  period: string;
  status: '완료' | '생성중' | '실패';
  generatedAt: string;
}

export interface KnowledgeNode {
  id: string;
  casNumber: string;
  name: string;
  relationsCount: number;
  propertiesCount: number;
  source: string;
  addedAt: string;
}

export interface ApiKey {
  id: string;
  org: string;
  keyPreview: string;
  tier: 'Free' | 'Basic' | 'Pro' | 'Enterprise';
  dailyUsage: number;
  dailyLimit: number;
  scopes: string[];
  status: '활성' | '비활성';
  created: string;
  lastUsed: string;
}

export interface EndpointUsage {
  endpoint: string;
  method: string;
  totalCalls: number;
  avgLatency: number;
  errorRate: number;
  trend: '증가' | '감소' | '유지';
}

export interface ApiError {
  id: string;
  timestamp: string;
  org: string;
  endpoint: string;
  method: string;
  statusCode: number;
  errorMessage: string;
  latency: number;
}

export interface RateLimit {
  tier: string;
  daily: string;
  ratePerMin: string;
  burst: string;
  endpoints: string;
  price: string;
}

export interface CustomLimit {
  id: string;
  org: string;
  tier: string;
  customDaily: number;
  customBurst: number;
  reason: string;
}

export interface DataEvent {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  sourceApp: 'Shop' | 'ENote' | 'Supplier' | 'Admin';
  eventType: 'page_view' | 'click' | 'order' | 'search' | 'cart_add';
  payload: string;
}

export interface SearchLog {
  query: string;
  count: number;
  avgResults: number;
  ctr: number;
  lastSearched: string;
  searchType: '시약명' | 'CAS' | '분자식' | '카탈로그번호';
}

export interface PriceHistory {
  id: string;
  productName: string;
  supplier: string;
  previousPrice: number;
  newPrice: number;
  changePercent: number;
  direction: '인상' | '인하' | '동일';
  recordedAt: string;
}

export interface BatchJob {
  id: string;
  name: string;
  desc: string;
  schedule: string;
  lastRun: string;
  nextRun: string;
  status: '성공' | '실패' | '실행중' | '대기';
  duration: string;
}

export interface Notice {
  id: string;
  title: string;
  category: '일반' | '서비스' | '점검';
  content: string;
  status: '게시중' | '예약' | '종료';
  author: string;
  pinned: boolean;
  startDate: string;
  endDate: string;
  createdAt: string;
}

export interface Faq {
  id: string;
  category: '주문' | '배송' | '제품' | '계정' | '기타';
  question: string;
  answer: string;
  order: number;
  status: '게시중' | '비게시';
}

export interface SystemInfo {
  platformVersions: { name: string; version: string; deployedAt: string }[];
  dbStats: { tables: number; rows: string; size: string; lastBackup: string };
  externalServices: { name: string; status: '정상' | '장애' | '점검'; latency: string; lastCheck: string }[];
}

// -----------------------------------------------------------------------------
// Users (15)
// -----------------------------------------------------------------------------

export const mockUsers: User[] = [
  {
    id: 'USR-001',
    name: '김연구',
    email: 'kim.yeongu@snu.ac.kr',
    org: '서울대학교 화학과',
    orgId: 'ORG-001',
    orgIds: ['ORG-001'],
    role: '연구원',
    status: '활성',
    lastLogin: '2026-03-20 09:15',
    loginCount: 234,
    department: '유기화학 연구실',
    phone: '010-1234-5678',
    createdAt: '2025-09-01',
  },
  {
    id: 'USR-002',
    name: '이관리',
    email: 'lee.gwanri@snu.ac.kr',
    org: '서울대학교 화학과',
    orgId: 'ORG-001',
    orgIds: ['ORG-001'],
    role: '조직장',
    status: '활성',
    lastLogin: '2026-03-20 08:42',
    loginCount: 412,
    department: '학과 행정실',
    phone: '010-2345-6789',
    createdAt: '2025-08-15',
  },
  {
    id: 'USR-003',
    name: '박실험',
    email: 'park.silheom@kaist.ac.kr',
    org: 'KAIST 생명공학과',
    orgId: 'ORG-002',
    orgIds: ['ORG-002', 'ORG-001'],  // KAIST + 서울대 공동연구
    role: '연구원',
    status: '활성',
    lastLogin: '2026-03-19 17:30',
    loginCount: 189,
    department: '분자생물학 연구실',
    phone: '010-3456-7890',
    createdAt: '2025-10-10',
  },
  {
    id: 'USR-004',
    name: '최공급',
    email: 'choi@sigmakorea.com',
    org: '(주)시그마코리아',
    orgId: 'ORG-005',
    orgIds: ['ORG-005'],
    role: '공급자',
    status: '활성',
    lastLogin: '2026-03-20 10:05',
    loginCount: 567,
    department: '영업부',
    phone: '010-4567-8901',
    createdAt: '2025-06-20',
  },
  {
    id: 'USR-005',
    name: '정화학',
    email: 'jung.hwahak@postech.ac.kr',
    org: 'POSTECH 화학공학과',
    orgId: 'ORG-003',
    orgIds: ['ORG-003', 'ORG-002'],  // POSTECH + KAIST 겸임
    role: '연구원',
    status: '활성',
    lastLogin: '2026-03-19 14:22',
    loginCount: 156,
    department: '촉매 연구실',
    phone: '010-5678-9012',
    createdAt: '2025-11-01',
  },
  {
    id: 'USR-006',
    name: '한시스템',
    email: 'han.system@jinuchem.com',
    org: '(주)지누켐',
    orgId: 'ORG-008',
    orgIds: ['ORG-008'],
    role: '시스템관리자',
    status: '활성',
    lastLogin: '2026-03-20 07:00',
    loginCount: 1023,
    department: '플랫폼운영팀',
    phone: '010-6789-0123',
    createdAt: '2025-01-10',
  },
  {
    id: 'USR-007',
    name: '윤분석',
    email: 'yoon.bunseok@yonsei.ac.kr',
    org: '연세대학교 약학과',
    orgId: 'ORG-004',
    orgIds: ['ORG-004'],
    role: '연구원',
    status: '비활성',
    lastLogin: '2026-02-28 16:45',
    loginCount: 78,
    department: '약물분석학 연구실',
    phone: '010-7890-1234',
    createdAt: '2025-12-05',
  },
  {
    id: 'USR-008',
    name: '강배송',
    email: 'kang@tcichem.co.kr',
    org: 'TCI Korea',
    orgId: 'ORG-006',
    orgIds: ['ORG-006'],
    role: '공급자',
    status: '활성',
    lastLogin: '2026-03-20 09:50',
    loginCount: 345,
    department: '물류팀',
    phone: '010-8901-2345',
    createdAt: '2025-07-15',
  },
  {
    id: 'USR-009',
    name: '오재료',
    email: 'oh.jaeryo@korea.ac.kr',
    org: '고려대학교 신소재공학부',
    orgId: 'ORG-007',
    orgIds: ['ORG-007', 'ORG-003'],  // 고려대 + POSTECH 공동연구
    role: '연구원',
    status: '활성',
    lastLogin: '2026-03-19 11:15',
    loginCount: 112,
    department: '나노소재 연구실',
    phone: '010-9012-3456',
    createdAt: '2026-01-08',
  },
  {
    id: 'USR-010',
    name: '임승인',
    email: 'lim.seungin@kaist.ac.kr',
    org: 'KAIST 생명공학과',
    orgId: 'ORG-002',
    orgIds: ['ORG-002'],
    role: '조직장',
    status: '활성',
    lastLogin: '2026-03-20 08:10',
    loginCount: 298,
    department: '학과 사무실',
    phone: '010-0123-4567',
    createdAt: '2025-09-20',
  },
  {
    id: 'USR-011',
    name: '송데이터',
    email: 'song.data@jinuchem.com',
    org: '(주)지누켐',
    orgId: 'ORG-008',
    orgIds: ['ORG-008'],
    role: '시스템관리자',
    status: '활성',
    lastLogin: '2026-03-20 10:30',
    loginCount: 876,
    department: '데이터엔지니어링팀',
    phone: '010-1111-2222',
    createdAt: '2025-03-01',
  },
  {
    id: 'USR-012',
    name: '배분자',
    email: 'bae.bunja@snu.ac.kr',
    org: '서울대학교 화학과',
    orgId: 'ORG-001',
    orgIds: ['ORG-001'],
    role: '연구원',
    status: '활성',
    lastLogin: '2026-03-20 11:05',
    loginCount: 67,
    department: '물리화학 연구실',
    phone: '010-3333-4444',
    createdAt: '2026-02-01',
  },
  {
    id: 'USR-013',
    name: '노영업',
    email: 'noh@alfaaesar.kr',
    org: 'Alfa Aesar Korea',
    orgId: 'ORG-009',
    orgIds: ['ORG-009'],
    role: '공급자',
    status: '활성',
    lastLogin: '2026-03-18 15:20',
    loginCount: 201,
    department: '한국지사 영업팀',
    phone: '010-5555-6666',
    createdAt: '2025-08-01',
  },
  {
    id: 'USR-014',
    name: '서예산',
    email: 'seo.yesan@postech.ac.kr',
    org: 'POSTECH 화학공학과',
    orgId: 'ORG-003',
    orgIds: ['ORG-003'],
    role: '조직장',
    status: '활성',
    lastLogin: '2026-03-20 09:00',
    loginCount: 334,
    department: '학과 행정실',
    phone: '010-7777-8888',
    createdAt: '2025-07-01',
  },
  {
    id: 'USR-015',
    name: '하종료',
    email: 'ha.jongryo@yonsei.ac.kr',
    org: '연세대학교 약학과',
    orgId: 'ORG-004',
    orgIds: ['ORG-004'],
    role: '연구원',
    status: '비활성',
    lastLogin: '2026-01-15 10:30',
    loginCount: 23,
    department: '천연물화학 연구실',
    phone: '010-9999-0000',
    createdAt: '2025-12-20',
  },
];

// -----------------------------------------------------------------------------
// Organizations (8)
// -----------------------------------------------------------------------------

export const mockOrganizations: Organization[] = [
  {
    id: 'ORG-001',
    name: '서울대학교 화학과',
    type: '대학',
    memberCount: 45,
    admin: '이관리',
    budget: 120000000,
    usedBudget: 78500000,
    status: '활성',
    zipCode: '08826',
    address: '서울특별시 관악구 관악로 1 서울대학교 자연과학대학 화학부',
    contact: '02-880-6601',
    createdAt: '2025-06-01',
    businessLicense: { fileName: null, uploadedAt: null, verified: false },
    bankAccount: { fileName: null, uploadedAt: null, verified: false },
  },
  {
    id: 'ORG-002',
    name: 'KAIST 생명공학과',
    type: '대학',
    memberCount: 32,
    admin: '임승인',
    budget: 95000000,
    usedBudget: 62300000,
    status: '활성',
    zipCode: '34141',
    address: '대전광역시 유성구 대학로 291 KAIST',
    contact: '042-350-2600',
    createdAt: '2025-06-15',
    businessLicense: { fileName: null, uploadedAt: null, verified: false },
    bankAccount: { fileName: null, uploadedAt: null, verified: false },
  },
  {
    id: 'ORG-003',
    name: 'POSTECH 화학공학과',
    type: '대학',
    memberCount: 28,
    admin: '서예산',
    budget: 85000000,
    usedBudget: 41200000,
    status: '활성',
    zipCode: '37673',
    address: '경상북도 포항시 남구 청암로 77 POSTECH',
    contact: '054-279-2270',
    createdAt: '2025-07-01',
    businessLicense: { fileName: null, uploadedAt: null, verified: false },
    bankAccount: { fileName: null, uploadedAt: null, verified: false },
  },
  {
    id: 'ORG-004',
    name: '연세대학교 약학과',
    type: '대학',
    memberCount: 22,
    admin: '윤분석',
    budget: 70000000,
    usedBudget: 35800000,
    status: '활성',
    zipCode: '03722',
    address: '서울특별시 서대문구 연세로 50 연세대학교',
    contact: '02-2123-6600',
    createdAt: '2025-08-01',
    businessLicense: { fileName: null, uploadedAt: null, verified: false },
    bankAccount: { fileName: null, uploadedAt: null, verified: false },
  },
  {
    id: 'ORG-005',
    name: '(주)시그마코리아',
    type: '기업',
    memberCount: 15,
    admin: '최공급',
    budget: 0,
    usedBudget: 0,
    status: '활성',
    zipCode: '04383',
    address: '서울특별시 용산구 한강대로 100',
    contact: '02-733-5500',
    createdAt: '2025-06-20',
    businessLicense: { fileName: '시그마코리아_사업자등록증.pdf', uploadedAt: '2025-06-20', verified: true },
    bankAccount: { fileName: '시그마코리아_통장사본.pdf', uploadedAt: '2025-06-20', verified: true },
    businessNo: '123-45-67890',
    bankInfo: '국민은행 123456-78-901234',
  },
  {
    id: 'ORG-006',
    name: 'TCI Korea',
    type: '기업',
    memberCount: 12,
    admin: '강배송',
    budget: 0,
    usedBudget: 0,
    status: '활성',
    zipCode: '06236',
    address: '서울특별시 강남구 테헤란로 152',
    contact: '02-555-1234',
    createdAt: '2025-07-15',
    businessLicense: { fileName: 'TCI_Korea_사업자등록증.pdf', uploadedAt: '2025-07-15', verified: true },
    bankAccount: { fileName: 'TCI_Korea_통장사본.pdf', uploadedAt: '2025-07-15', verified: true },
    businessNo: '234-56-78901',
    bankInfo: '신한은행 110-234-567890',
  },
  {
    id: 'ORG-007',
    name: '고려대학교 신소재공학부',
    type: '대학',
    memberCount: 18,
    admin: '오재료',
    budget: 60000000,
    usedBudget: 28900000,
    status: '활성',
    zipCode: '02841',
    address: '서울특별시 성북구 안암로 145 고려대학교',
    contact: '02-3290-3200',
    createdAt: '2025-09-01',
    businessLicense: { fileName: null, uploadedAt: null, verified: false },
    bankAccount: { fileName: null, uploadedAt: null, verified: false },
  },
  {
    id: 'ORG-008',
    name: '(주)지누켐',
    type: '기업',
    memberCount: 8,
    admin: '한시스템',
    budget: 0,
    usedBudget: 0,
    status: '활성',
    zipCode: '06168',
    address: '서울특별시 강남구 삼성로 512',
    contact: '02-6789-0000',
    createdAt: '2025-01-01',
    businessLicense: { fileName: '지누켐_사업자등록증.pdf', uploadedAt: '2025-01-10', verified: true },
    bankAccount: { fileName: '지누켐_통장사본.pdf', uploadedAt: '2025-01-10', verified: true },
    businessNo: '470-81-02870',
    bankInfo: '우리은행 1005-123-456789',
  },
  {
    id: 'ORG-009',
    name: 'Alfa Aesar Korea',
    type: '기업',
    memberCount: 10,
    admin: '노영업',
    budget: 0,
    usedBudget: 0,
    status: '활성',
    zipCode: '06241',
    address: '서울특별시 강남구 논현로 508',
    contact: '02-555-9876',
    createdAt: '2025-08-01',
    businessLicense: { fileName: 'AlfaAesar_사업자등록증.pdf', uploadedAt: '2025-08-01', verified: true },
    bankAccount: { fileName: null, uploadedAt: null, verified: false },
    businessNo: '345-67-89012',
    bankInfo: '',
  },
];

// -----------------------------------------------------------------------------
// Activity Logs (25)
// -----------------------------------------------------------------------------

export const mockActivityLogs: ActivityLog[] = [
  { id: 'LOG-001', userId: 'USR-001', userName: '김연구', action: '로그인', details: 'Chrome 121 / Windows 11에서 로그인', ipAddress: '147.46.15.101', timestamp: '2026-03-20 09:15:22' },
  { id: 'LOG-002', userId: 'USR-004', userName: '최공급', action: '제품등록', details: 'Sigma-Aldrich 신규 제품 3종 등록 (SA-N1234, SA-N1235, SA-N1236)', ipAddress: '211.234.56.78', timestamp: '2026-03-20 10:05:44' },
  { id: 'LOG-003', userId: 'USR-002', userName: '이관리', action: '역할변경', details: '배분자(USR-012) 역할을 연구원에서 조직관리자로 변경 시도 (거절됨)', ipAddress: '147.46.15.102', timestamp: '2026-03-20 08:55:11' },
  { id: 'LOG-004', userId: 'USR-003', userName: '박실험', action: '주문', details: 'ORD-2026-0342 주문 생성 (Acetone 2.5L x2, Ethanol 1L x5) 총 ₩450,000', ipAddress: '143.248.220.55', timestamp: '2026-03-20 09:32:18' },
  { id: 'LOG-005', userId: 'USR-006', userName: '한시스템', action: '설정변경', details: 'API Rate Limit Free 티어 일일 한도 100 -> 150으로 변경', ipAddress: '10.0.1.50', timestamp: '2026-03-20 07:12:05' },
  { id: 'LOG-006', userId: 'USR-010', userName: '임승인', action: '로그인', details: 'Safari / macOS Sonoma에서 로그인', ipAddress: '143.248.220.60', timestamp: '2026-03-20 08:10:33' },
  { id: 'LOG-007', userId: 'USR-005', userName: '정화학', action: '주문', details: 'ORD-2026-0340 주문 승인 완료 (POSTECH 화학공학과 구매승인)', ipAddress: '141.223.4.88', timestamp: '2026-03-19 14:22:47' },
  { id: 'LOG-008', userId: 'USR-008', userName: '강배송', action: '제품등록', details: 'TCI 가격 일괄 업데이트 (127건)', ipAddress: '203.245.67.89', timestamp: '2026-03-20 09:50:15' },
  { id: 'LOG-009', userId: 'USR-011', userName: '송데이터', action: 'API호출', details: '/api/v1/products/search 엔드포인트 테스트 호출 (200 OK)', ipAddress: '10.0.1.51', timestamp: '2026-03-20 10:30:02' },
  { id: 'LOG-010', userId: 'USR-009', userName: '오재료', action: '주문', details: 'ORD-2026-0338 주문 생성 (Silver Nanoparticles 100mL) 총 ₩1,250,000', ipAddress: '163.152.10.33', timestamp: '2026-03-19 11:15:29' },
  { id: 'LOG-011', userId: 'USR-006', userName: '한시스템', action: '역할변경', details: '하종료(USR-015) 상태를 활성에서 비활성으로 변경', ipAddress: '10.0.1.50', timestamp: '2026-03-19 10:20:00' },
  { id: 'LOG-012', userId: 'USR-012', userName: '배분자', action: '로그인', details: 'Firefox 124 / Ubuntu 24.04에서 로그인', ipAddress: '147.46.15.105', timestamp: '2026-03-20 11:05:18' },
  { id: 'LOG-013', userId: 'USR-001', userName: '김연구', action: '주문', details: 'ORD-2026-0343 주문 생성 (Chloroform 500mL x3) 총 ₩180,000', ipAddress: '147.46.15.101', timestamp: '2026-03-20 09:45:33' },
  { id: 'LOG-014', userId: 'USR-013', userName: '노영업', action: '제품등록', details: 'Alfa Aesar 신규 제품 5종 등록', ipAddress: '121.134.22.45', timestamp: '2026-03-18 15:20:41' },
  { id: 'LOG-015', userId: 'USR-014', userName: '서예산', action: '설정변경', details: 'POSTECH 화학공학과 월간 예산 한도 8,500만원 -> 9,000만원으로 변경', ipAddress: '141.223.4.90', timestamp: '2026-03-20 09:00:12' },
  { id: 'LOG-016', userId: 'USR-004', userName: '최공급', action: 'API호출', details: '/api/v1/inventory/sync Sigma-Aldrich 재고 동기화 (2,340건)', ipAddress: '211.234.56.78', timestamp: '2026-03-20 06:00:00' },
  { id: 'LOG-017', userId: 'USR-003', userName: '박실험', action: '로그인', details: 'Chrome 121 / macOS에서 로그인 (2FA 인증 완료)', ipAddress: '143.248.220.55', timestamp: '2026-03-19 17:30:05' },
  { id: 'LOG-018', userId: 'USR-006', userName: '한시스템', action: '설정변경', details: '공지사항 "3월 정기점검 안내" 게시 등록', ipAddress: '10.0.1.50', timestamp: '2026-03-19 09:00:00' },
  { id: 'LOG-019', userId: 'USR-011', userName: '송데이터', action: 'API호출', details: 'data-aggregate 배치 작업 수동 실행', ipAddress: '10.0.1.51', timestamp: '2026-03-20 08:00:15' },
  { id: 'LOG-020', userId: 'USR-002', userName: '이관리', action: '주문', details: '서울대 화학과 3월 정기구매 주문서 일괄 승인 (12건, 총 ₩8,450,000)', ipAddress: '147.46.15.102', timestamp: '2026-03-20 08:42:50' },
  { id: 'LOG-021', userId: 'USR-008', userName: '강배송', action: '로그인', details: 'Edge / Windows 11에서 로그인', ipAddress: '203.245.67.89', timestamp: '2026-03-20 09:48:22' },
  { id: 'LOG-022', userId: 'USR-005', userName: '정화학', action: '설정변경', details: '알림 설정 변경: 이메일 알림 OFF -> ON', ipAddress: '141.223.4.88', timestamp: '2026-03-19 14:10:05' },
  { id: 'LOG-023', userId: 'USR-009', userName: '오재료', action: 'API호출', details: '/api/v1/recommend 시약 추천 API 호출 (200 OK, 1.2s)', ipAddress: '163.152.10.33', timestamp: '2026-03-19 11:00:44' },
  { id: 'LOG-024', userId: 'USR-010', userName: '임승인', action: '역할변경', details: 'KAIST 신규 연구원 3명 일괄 등록 (연구원 역할 부여)', ipAddress: '143.248.220.60', timestamp: '2026-03-20 08:15:30' },
  { id: 'LOG-025', userId: 'USR-006', userName: '한시스템', action: '설정변경', details: 'FAQ "시약 주문 후 취소 방법" 항목 수정', ipAddress: '10.0.1.50', timestamp: '2026-03-20 07:30:18' },
];

// -----------------------------------------------------------------------------
// Products (15)
// -----------------------------------------------------------------------------

export const mockAdminProducts: AdminProduct[] = [
  {
    id: 'PROD-001',
    catalogNo: 'SA-A2153',
    name: 'Acetone',
    casNumber: '67-64-1',
    supplier: 'Sigma-Aldrich',
    category: '유기화합물',
    subCategory: '케톤류',
    type: '시약',
    variants: [
      { size: '500', unit: 'mL', listPrice: 45000, salePrice: 38000, stock: 120, sameDayShip: true, status: '판매중' },
      { size: '1', unit: 'L', listPrice: 72000, salePrice: 62000, stock: 85, sameDayShip: true, status: '판매중' },
      { size: '2.5', unit: 'L', listPrice: 145000, salePrice: 128000, stock: 42, sameDayShip: true, status: '판매중' },
      { size: '4', unit: 'L', listPrice: 210000, salePrice: 189000, stock: 15, sameDayShip: false, status: '일시품절' },
    ],
    status: '판매중',
    createdAt: '2025-06-15',
  },
  {
    id: 'PROD-002',
    catalogNo: 'AA-010290',
    name: 'Sodium Hydroxide',
    casNumber: '1310-73-2',
    supplier: 'Alfa Aesar',
    category: '무기화합물',
    subCategory: '알칼리금속 화합물',
    type: '시약',
    variants: [
      { size: '100', unit: 'g', listPrice: 25000, salePrice: 22000, stock: 200, sameDayShip: true, status: '판매중' },
      { size: '500', unit: 'g', listPrice: 68000, salePrice: 59000, stock: 95, sameDayShip: true, status: '판매중' },
      { size: '1', unit: 'kg', listPrice: 110000, salePrice: 98000, stock: 30, sameDayShip: false, status: '판매중' },
    ],
    status: '판매중',
    createdAt: '2025-07-01',
  },
  {
    id: 'PROD-003',
    catalogNo: 'TCI-A0003',
    name: 'Acetic Acid',
    casNumber: '64-19-7',
    supplier: 'TCI',
    category: '유기화합물',
    subCategory: '카르복실산류',
    type: '시약',
    variants: [
      { size: '25', unit: 'mL', listPrice: 12000, salePrice: 10500, stock: 300, sameDayShip: true, status: '판매중' },
      { size: '100', unit: 'mL', listPrice: 28000, salePrice: 24000, stock: 180, sameDayShip: true, status: '판매중' },
      { size: '500', unit: 'mL', listPrice: 55000, salePrice: 48000, stock: 90, sameDayShip: true, status: '판매중' },
      { size: '1', unit: 'L', listPrice: 89000, salePrice: 78000, stock: 45, sameDayShip: true, status: '판매중' },
      { size: '2.5', unit: 'L', listPrice: 178000, salePrice: 155000, stock: 12, sameDayShip: false, status: '판매중' },
    ],
    status: '판매중',
    createdAt: '2025-06-20',
  },
  {
    id: 'PROD-004',
    catalogNo: 'DJ-4019',
    name: 'Ethanol',
    casNumber: '64-17-5',
    supplier: 'Daejung',
    category: '유기화합물',
    subCategory: '알코올류',
    type: '시약',
    variants: [
      { size: '500', unit: 'mL', listPrice: 18000, salePrice: 15000, stock: 250, sameDayShip: true, status: '판매중' },
      { size: '1', unit: 'L', listPrice: 30000, salePrice: 25000, stock: 180, sameDayShip: true, status: '판매중' },
      { size: '2.5', unit: 'L', listPrice: 62000, salePrice: 54000, stock: 100, sameDayShip: true, status: '판매중' },
      { size: '4', unit: 'L', listPrice: 88000, salePrice: 78000, stock: 60, sameDayShip: true, status: '판매중' },
      { size: '18', unit: 'L', listPrice: 320000, salePrice: 285000, stock: 20, sameDayShip: false, status: '판매중' },
      { size: '20', unit: 'L', listPrice: 350000, salePrice: 310000, stock: 10, sameDayShip: false, status: '판매중단' },
    ],
    status: '판매중',
    createdAt: '2025-06-10',
  },
  {
    id: 'PROD-005',
    catalogNo: 'SC-7732',
    name: 'Sulfuric Acid',
    casNumber: '7664-93-9',
    supplier: 'Samchun',
    category: '무기화합물',
    subCategory: '강산류',
    type: '시약',
    variants: [
      { size: '500', unit: 'mL', listPrice: 32000, salePrice: 28000, stock: 75, sameDayShip: true, status: '판매중' },
      { size: '2.5', unit: 'L', listPrice: 125000, salePrice: 110000, stock: 25, sameDayShip: false, status: '판매중' },
    ],
    status: '판매중',
    createdAt: '2025-08-01',
  },
  {
    id: 'PROD-006',
    catalogNo: 'SA-M1775',
    name: 'Methanol',
    casNumber: '67-56-1',
    supplier: 'Sigma-Aldrich',
    category: '유기화합물',
    subCategory: '알코올류',
    type: '시약',
    variants: [
      { size: '500', unit: 'mL', listPrice: 42000, salePrice: 36000, stock: 0, sameDayShip: false, status: '일시품절' },
      { size: '1', unit: 'L', listPrice: 68000, salePrice: 59000, stock: 0, sameDayShip: false, status: '일시품절' },
      { size: '2.5', unit: 'L', listPrice: 138000, salePrice: 120000, stock: 0, sameDayShip: false, status: '일시품절' },
      { size: '4', unit: 'L', listPrice: 198000, salePrice: 175000, stock: 0, sameDayShip: false, status: '일시품절' },
    ],
    status: '일시품절',
    createdAt: '2025-06-15',
  },
  {
    id: 'PROD-007',
    catalogNo: 'SUP-GL100',
    name: '니트릴 장갑 (M)',
    casNumber: '-',
    supplier: '-',
    category: '안전장비',
    subCategory: '보호장갑',
    type: '소모품',
    variants: [
      { size: '100', unit: '매', listPrice: 22000, salePrice: 18000, stock: 500, sameDayShip: true, status: '판매중' },
      { size: '200', unit: '매', listPrice: 40000, salePrice: 33000, stock: 300, sameDayShip: true, status: '판매중' },
      { size: '500', unit: '매', listPrice: 88000, salePrice: 75000, stock: 100, sameDayShip: false, status: '판매중' },
    ],
    status: '판매중',
    createdAt: '2025-09-01',
  },
  {
    id: 'PROD-008',
    catalogNo: 'SUP-PP050',
    name: '마이크로피펫 팁 (200uL)',
    casNumber: '-',
    supplier: '-',
    category: '실험소모품',
    subCategory: '피펫팅',
    type: '소모품',
    variants: [
      { size: '96', unit: '개', listPrice: 15000, salePrice: 12500, stock: 800, sameDayShip: true, status: '판매중' },
      { size: '1000', unit: '개', listPrice: 120000, salePrice: 105000, stock: 200, sameDayShip: true, status: '판매중' },
    ],
    status: '판매중',
    createdAt: '2025-09-15',
  },
  {
    id: 'PROD-009',
    catalogNo: 'AA-012345',
    name: 'Hydrochloric Acid',
    casNumber: '7647-01-0',
    supplier: 'Alfa Aesar',
    category: '무기화합물',
    subCategory: '강산류',
    type: '시약',
    variants: [
      { size: '500', unit: 'mL', listPrice: 35000, salePrice: 30000, stock: 90, sameDayShip: true, status: '판매중' },
      { size: '1', unit: 'L', listPrice: 58000, salePrice: 50000, stock: 45, sameDayShip: true, status: '판매중' },
      { size: '2.5', unit: 'L', listPrice: 120000, salePrice: 105000, stock: 18, sameDayShip: false, status: '일시품절' },
    ],
    status: '판매중',
    createdAt: '2025-07-20',
  },
  {
    id: 'PROD-010',
    catalogNo: 'TCI-T0001',
    name: 'Toluene',
    casNumber: '108-88-3',
    supplier: 'TCI',
    category: '유기화합물',
    subCategory: '방향족 탄화수소',
    type: '시약',
    variants: [
      { size: '500', unit: 'mL', listPrice: 38000, salePrice: 33000, stock: 0, sameDayShip: false, status: '판매중단' },
      { size: '1', unit: 'L', listPrice: 62000, salePrice: 54000, stock: 0, sameDayShip: false, status: '판매중단' },
      { size: '2.5', unit: 'L', listPrice: 130000, salePrice: 115000, stock: 0, sameDayShip: false, status: '판매중단' },
      { size: '4', unit: 'L', listPrice: 185000, salePrice: 165000, stock: 0, sameDayShip: false, status: '판매중단' },
    ],
    status: '판매중단',
    createdAt: '2025-06-20',
  },
  {
    id: 'PROD-011',
    catalogNo: 'SA-C2432',
    name: 'Chloroform',
    casNumber: '67-66-3',
    supplier: 'Sigma-Aldrich',
    category: '유기화합물',
    subCategory: '할로겐화 탄화수소',
    type: '시약',
    variants: [
      { size: '100', unit: 'mL', listPrice: 35000, salePrice: 30000, stock: 150, sameDayShip: true, status: '판매중' },
      { size: '500', unit: 'mL', listPrice: 78000, salePrice: 68000, stock: 65, sameDayShip: true, status: '판매중' },
      { size: '1', unit: 'L', listPrice: 125000, salePrice: 110000, stock: 28, sameDayShip: false, status: '판매중' },
    ],
    status: '판매중',
    createdAt: '2025-08-10',
  },
  {
    id: 'PROD-012',
    catalogNo: 'DJ-1120',
    name: 'Dimethyl Sulfoxide (DMSO)',
    casNumber: '67-68-5',
    supplier: 'Daejung',
    category: '유기화합물',
    subCategory: '설폭사이드류',
    type: '시약',
    variants: [
      { size: '100', unit: 'mL', listPrice: 18000, salePrice: 15000, stock: 220, sameDayShip: true, status: '판매중' },
      { size: '500', unit: 'mL', listPrice: 52000, salePrice: 45000, stock: 110, sameDayShip: true, status: '판매중' },
      { size: '1', unit: 'L', listPrice: 85000, salePrice: 74000, stock: 50, sameDayShip: true, status: '판매중' },
    ],
    status: '판매중',
    createdAt: '2025-10-01',
  },
  {
    id: 'PROD-013',
    catalogNo: 'SUP-FL250',
    name: '삼각 플라스크 250mL',
    casNumber: '-',
    supplier: '-',
    category: '실험소모품',
    subCategory: '유리기구',
    type: '소모품',
    variants: [
      { size: '1', unit: '개', listPrice: 8500, salePrice: 7200, stock: 400, sameDayShip: true, status: '판매중' },
      { size: '10', unit: '개', listPrice: 78000, salePrice: 65000, stock: 80, sameDayShip: true, status: '판매중' },
    ],
    status: '판매중',
    createdAt: '2025-09-20',
  },
  {
    id: 'PROD-014',
    catalogNo: 'TCI-D0082',
    name: 'Dichloromethane',
    casNumber: '75-09-2',
    supplier: 'TCI',
    category: '유기화합물',
    subCategory: '할로겐화 탄화수소',
    type: '시약',
    variants: [
      { size: '500', unit: 'mL', listPrice: 42000, salePrice: 36000, stock: 70, sameDayShip: true, status: '판매중' },
      { size: '1', unit: 'L', listPrice: 72000, salePrice: 63000, stock: 35, sameDayShip: true, status: '판매중' },
      { size: '2.5', unit: 'L', listPrice: 148000, salePrice: 130000, stock: 15, sameDayShip: false, status: '판매중' },
    ],
    status: '판매중',
    createdAt: '2025-07-25',
  },
  {
    id: 'PROD-015',
    catalogNo: 'SUP-FP100',
    name: '필터 페이퍼 (110mm)',
    casNumber: '-',
    supplier: '-',
    category: '실험소모품',
    subCategory: '여과재',
    type: '소모품',
    variants: [
      { size: '100', unit: '장', listPrice: 12000, salePrice: 10000, stock: 600, sameDayShip: true, status: '판매중' },
      { size: '500', unit: '장', listPrice: 48000, salePrice: 42000, stock: 150, sameDayShip: true, status: '판매중' },
    ],
    status: '판매중',
    createdAt: '2025-10-10',
  },
];

// -----------------------------------------------------------------------------
// Categories (8 main + subcategories)
// -----------------------------------------------------------------------------

export const mockCategories: Category[] = [
  { id: 'CAT-001', name: '유기화합물', parentId: null, productCount: 3245, status: '활성', order: 1 },
  { id: 'CAT-001-01', name: '알코올류', parentId: 'CAT-001', productCount: 456, status: '활성', order: 1 },
  { id: 'CAT-001-02', name: '케톤류', parentId: 'CAT-001', productCount: 312, status: '활성', order: 2 },
  { id: 'CAT-001-03', name: '카르복실산류', parentId: 'CAT-001', productCount: 289, status: '활성', order: 3 },
  { id: 'CAT-001-04', name: '할로겐화 탄화수소', parentId: 'CAT-001', productCount: 198, status: '활성', order: 4 },
  { id: 'CAT-001-05', name: '방향족 탄화수소', parentId: 'CAT-001', productCount: 267, status: '활성', order: 5 },
  { id: 'CAT-002', name: '무기화합물', parentId: null, productCount: 1876, status: '활성', order: 2 },
  { id: 'CAT-002-01', name: '강산류', parentId: 'CAT-002', productCount: 145, status: '활성', order: 1 },
  { id: 'CAT-002-02', name: '알칼리금속 화합물', parentId: 'CAT-002', productCount: 210, status: '활성', order: 2 },
  { id: 'CAT-003', name: '분석용시약', parentId: null, productCount: 1234, status: '활성', order: 3 },
  { id: 'CAT-003-01', name: 'HPLC 용매', parentId: 'CAT-003', productCount: 156, status: '활성', order: 1 },
  { id: 'CAT-003-02', name: '표준물질', parentId: 'CAT-003', productCount: 312, status: '활성', order: 2 },
  { id: 'CAT-004', name: '생화학시약', parentId: null, productCount: 987, status: '활성', order: 4 },
  { id: 'CAT-005', name: '고분자/폴리머', parentId: null, productCount: 543, status: '활성', order: 5 },
  { id: 'CAT-006', name: '실험소모품', parentId: null, productCount: 2100, status: '활성', order: 6 },
  { id: 'CAT-006-01', name: '피펫팅', parentId: 'CAT-006', productCount: 340, status: '활성', order: 1 },
  { id: 'CAT-006-02', name: '유리기구', parentId: 'CAT-006', productCount: 520, status: '활성', order: 2 },
  { id: 'CAT-006-03', name: '여과재', parentId: 'CAT-006', productCount: 180, status: '활성', order: 3 },
  { id: 'CAT-007', name: '안전장비', parentId: null, productCount: 456, status: '활성', order: 7 },
  { id: 'CAT-007-01', name: '보호장갑', parentId: 'CAT-007', productCount: 85, status: '활성', order: 1 },
  { id: 'CAT-008', name: '나노소재', parentId: null, productCount: 234, status: '활성', order: 8 },
];

// -----------------------------------------------------------------------------
// Supplier Mappings (6)
// -----------------------------------------------------------------------------

export const mockSupplierMappings: SupplierMapping[] = [
  { id: 'SUP-001', name: 'Sigma-Aldrich', productCount: 2450, avgPrice: 85000, lastSync: '2026-03-20 06:00', syncStatus: '성공', contact: 'partner@sigmaaldrich.com', apiUrl: 'https://api.sigmaaldrich.com/v2' },
  { id: 'SUP-002', name: 'Alfa Aesar', productCount: 1830, avgPrice: 72000, lastSync: '2026-03-20 06:00', syncStatus: '성공', contact: 'api@alfaaesar.com', apiUrl: 'https://api.alfaaesar.com/v1' },
  { id: 'SUP-003', name: 'TCI', productCount: 1540, avgPrice: 65000, lastSync: '2026-03-20 06:03', syncStatus: '실패', contact: 'tech@tci-chemicals.com', apiUrl: 'https://api.tci-chemicals.com/v1' },
  { id: 'SUP-004', name: 'Daejung', productCount: 980, avgPrice: 42000, lastSync: '2026-03-20 06:00', syncStatus: '성공', contact: 'system@daejungchem.co.kr', apiUrl: 'https://api.daejungchem.co.kr/v1' },
  { id: 'SUP-005', name: 'Samchun', productCount: 760, avgPrice: 38000, lastSync: '2026-03-20 06:01', syncStatus: '성공', contact: 'support@samchun.com', apiUrl: 'https://api.samchun.com/v2' },
  { id: 'SUP-006', name: 'Junsei', productCount: 420, avgPrice: 55000, lastSync: '2026-03-20 06:00', syncStatus: '동기화중', contact: 'api@junsei.co.jp', apiUrl: 'https://api.junsei.co.jp/v1' },
];

// -----------------------------------------------------------------------------
// AI - Recommendations (12)
// -----------------------------------------------------------------------------

export const mockRecommendations: Recommendation[] = [
  { id: 'REC-001', userId: 'USR-001', userName: '김연구', products: ['Acetone (SA-A2153)', 'Chloroform (SA-C2432)', 'Dichloromethane (TCI-D0082)'], score: 0.92, clicked: true, timestamp: '2026-03-20 10:15' },
  { id: 'REC-002', userId: 'USR-003', userName: '박실험', products: ['Ethanol (DJ-4019)', 'DMSO (DJ-1120)'], score: 0.87, clicked: true, timestamp: '2026-03-20 09:48' },
  { id: 'REC-003', userId: 'USR-005', userName: '정화학', products: ['Sulfuric Acid (SC-7732)', 'Hydrochloric Acid (AA-012345)'], score: 0.85, clicked: false, timestamp: '2026-03-20 09:30' },
  { id: 'REC-004', userId: 'USR-009', userName: '오재료', products: ['Silver Nanoparticles', 'Gold Nanoparticles', 'Titanium Dioxide'], score: 0.94, clicked: true, timestamp: '2026-03-20 09:22' },
  { id: 'REC-005', userId: 'USR-012', userName: '배분자', products: ['Acetone (SA-A2153)', 'Methanol (SA-M1775)'], score: 0.78, clicked: false, timestamp: '2026-03-20 09:00' },
  { id: 'REC-006', userId: 'USR-001', userName: '김연구', products: ['니트릴 장갑 (M)', '마이크로피펫 팁 (200uL)'], score: 0.72, clicked: true, timestamp: '2026-03-19 16:45' },
  { id: 'REC-007', userId: 'USR-003', userName: '박실험', products: ['필터 페이퍼 (110mm)', '삼각 플라스크 250mL'], score: 0.81, clicked: false, timestamp: '2026-03-19 15:30' },
  { id: 'REC-008', userId: 'USR-007', userName: '윤분석', products: ['Acetic Acid (TCI-A0003)', 'Sodium Hydroxide (AA-010290)'], score: 0.88, clicked: true, timestamp: '2026-03-19 14:20' },
  { id: 'REC-009', userId: 'USR-005', userName: '정화학', products: ['Toluene (TCI-T0001)', 'Chloroform (SA-C2432)', 'Ethanol (DJ-4019)'], score: 0.91, clicked: true, timestamp: '2026-03-19 11:00' },
  { id: 'REC-010', userId: 'USR-009', userName: '오재료', products: ['DMSO (DJ-1120)'], score: 0.65, clicked: false, timestamp: '2026-03-19 10:15' },
  { id: 'REC-011', userId: 'USR-012', userName: '배분자', products: ['Hydrochloric Acid (AA-012345)', 'Sulfuric Acid (SC-7732)', 'Acetic Acid (TCI-A0003)'], score: 0.83, clicked: true, timestamp: '2026-03-18 17:00' },
  { id: 'REC-012', userId: 'USR-015', userName: '하종료', products: ['Ethanol (DJ-4019)', 'Acetone (SA-A2153)'], score: 0.76, clicked: false, timestamp: '2026-03-18 14:30' },
];

// -----------------------------------------------------------------------------
// AI - Predictions (10)
// -----------------------------------------------------------------------------

export const mockPredictions: Prediction[] = [
  { id: 'PRED-001', orgName: '서울대학교 화학과', type: '소모량', predicted: 125, actual: 118, error: 5.9, confidence: 0.89, timestamp: '2026-03-20 03:00' },
  { id: 'PRED-002', orgName: 'KAIST 생명공학과', type: '예산', predicted: 15200000, actual: 14800000, error: 2.7, confidence: 0.93, timestamp: '2026-03-20 03:05' },
  { id: 'PRED-003', orgName: 'POSTECH 화학공학과', type: '재주문', predicted: 14, actual: 12, error: 16.7, confidence: 0.72, timestamp: '2026-03-20 03:10' },
  { id: 'PRED-004', orgName: '연세대학교 약학과', type: '소모량', predicted: 78, actual: 82, error: 4.9, confidence: 0.87, timestamp: '2026-03-20 03:15' },
  { id: 'PRED-005', orgName: '고려대학교 신소재공학부', type: '예산', predicted: 8500000, actual: 9200000, error: 7.6, confidence: 0.81, timestamp: '2026-03-20 03:20' },
  { id: 'PRED-006', orgName: '서울대학교 화학과', type: '재주문', predicted: 22, actual: 20, error: 10.0, confidence: 0.78, timestamp: '2026-03-17 04:00' },
  { id: 'PRED-007', orgName: 'KAIST 생명공학과', type: '소모량', predicted: 95, actual: 91, error: 4.4, confidence: 0.91, timestamp: '2026-03-17 04:05' },
  { id: 'PRED-008', orgName: 'POSTECH 화학공학과', type: '예산', predicted: 12000000, actual: 11500000, error: 4.3, confidence: 0.88, timestamp: '2026-03-17 04:10' },
  { id: 'PRED-009', orgName: '연세대학교 약학과', type: '재주문', predicted: 8, actual: 10, error: 20.0, confidence: 0.68, timestamp: '2026-03-17 04:15' },
  { id: 'PRED-010', orgName: '고려대학교 신소재공학부', type: '소모량', predicted: 45, actual: 48, error: 6.3, confidence: 0.85, timestamp: '2026-03-17 04:20' },
];

// -----------------------------------------------------------------------------
// AI - Reports (8)
// -----------------------------------------------------------------------------

export const mockReports: Report[] = [
  { id: 'RPT-001', orgName: '서울대학교 화학과', type: '구매패턴', period: '2026년 1분기', status: '완료', generatedAt: '2026-03-20 09:30' },
  { id: 'RPT-002', orgName: 'KAIST 생명공학과', type: '트렌드', period: '2025년 4분기 ~ 2026년 1분기', status: '완료', generatedAt: '2026-03-20 09:15' },
  { id: 'RPT-003', orgName: 'POSTECH 화학공학과', type: '계절성', period: '2025년 연간', status: '완료', generatedAt: '2026-03-19 15:00' },
  { id: 'RPT-004', orgName: '연세대학교 약학과', type: '구매패턴', period: '2026년 1분기', status: '생성중', generatedAt: '2026-03-20 10:00' },
  { id: 'RPT-005', orgName: '고려대학교 신소재공학부', type: '트렌드', period: '2025년 하반기', status: '완료', generatedAt: '2026-03-18 14:00' },
  { id: 'RPT-006', orgName: '서울대학교 화학과', type: '계절성', period: '2024~2025년', status: '완료', generatedAt: '2026-03-17 09:00' },
  { id: 'RPT-007', orgName: 'KAIST 생명공학과', type: '구매패턴', period: '2025년 4분기', status: '완료', generatedAt: '2026-03-15 10:30' },
  { id: 'RPT-008', orgName: 'POSTECH 화학공학과', type: '트렌드', period: '2026년 1분기', status: '실패', generatedAt: '2026-03-20 08:00' },
];

// -----------------------------------------------------------------------------
// AI - Knowledge Nodes (10)
// -----------------------------------------------------------------------------

export const mockKnowledgeNodes: KnowledgeNode[] = [
  { id: 'KN-001', casNumber: '67-64-1', name: 'Acetone', relationsCount: 24, propertiesCount: 18, source: 'PubChem + 내부 데이터', addedAt: '2026-03-15 05:00' },
  { id: 'KN-002', casNumber: '64-17-5', name: 'Ethanol', relationsCount: 31, propertiesCount: 22, source: 'PubChem + 내부 데이터', addedAt: '2026-03-15 05:02' },
  { id: 'KN-003', casNumber: '67-56-1', name: 'Methanol', relationsCount: 19, propertiesCount: 17, source: 'PubChem', addedAt: '2026-03-15 05:04' },
  { id: 'KN-004', casNumber: '67-66-3', name: 'Chloroform', relationsCount: 15, propertiesCount: 14, source: 'PubChem + ChemSpider', addedAt: '2026-03-16 05:00' },
  { id: 'KN-005', casNumber: '75-09-2', name: 'Dichloromethane', relationsCount: 18, propertiesCount: 16, source: 'PubChem', addedAt: '2026-03-16 05:02' },
  { id: 'KN-006', casNumber: '1310-73-2', name: 'Sodium Hydroxide', relationsCount: 28, propertiesCount: 20, source: 'PubChem + 내부 데이터', addedAt: '2026-03-17 05:00' },
  { id: 'KN-007', casNumber: '7664-93-9', name: 'Sulfuric Acid', relationsCount: 35, propertiesCount: 25, source: 'PubChem + ChemSpider', addedAt: '2026-03-17 05:02' },
  { id: 'KN-008', casNumber: '7647-01-0', name: 'Hydrochloric Acid', relationsCount: 22, propertiesCount: 19, source: 'PubChem', addedAt: '2026-03-18 05:00' },
  { id: 'KN-009', casNumber: '64-19-7', name: 'Acetic Acid', relationsCount: 20, propertiesCount: 16, source: 'PubChem + 내부 데이터', addedAt: '2026-03-19 05:00' },
  { id: 'KN-010', casNumber: '67-68-5', name: 'DMSO', relationsCount: 12, propertiesCount: 13, source: 'PubChem', addedAt: '2026-03-20 05:00' },
];

// -----------------------------------------------------------------------------
// API Keys (10)
// -----------------------------------------------------------------------------

export const mockApiKeys: ApiKey[] = [
  { id: 'KEY-001', org: '서울대학교 화학과', keyPreview: 'jk_live_snu...8f3a', tier: 'Pro', dailyUsage: 1250, dailyLimit: 5000, scopes: ['products', 'prices', 'inventory', 'recommend', 'predict', 'analyze'], status: '활성', created: '2026-01-15', lastUsed: '2026-03-20 10:12' },
  { id: 'KEY-002', org: 'KAIST 생명공학과', keyPreview: 'jk_live_kai...2b7c', tier: 'Basic', dailyUsage: 340, dailyLimit: 1000, scopes: ['products', 'prices', 'inventory', 'recommend'], status: '활성', created: '2026-02-01', lastUsed: '2026-03-20 09:55' },
  { id: 'KEY-003', org: '연세대학교 약학과', keyPreview: 'jk_live_yon...9d4e', tier: 'Pro', dailyUsage: 890, dailyLimit: 5000, scopes: ['products', 'prices', 'inventory', 'recommend', 'predict', 'analyze'], status: '활성', created: '2026-01-20', lastUsed: '2026-03-20 10:08' },
  { id: 'KEY-004', org: 'POSTECH 화학공학과', keyPreview: 'jk_live_pos...1a6f', tier: 'Enterprise', dailyUsage: 2100, dailyLimit: 50000, scopes: ['products', 'prices', 'inventory', 'recommend', 'predict', 'analyze', 'knowledge', 'batch'], status: '활성', created: '2025-12-10', lastUsed: '2026-03-20 10:15' },
  { id: 'KEY-005', org: '고려대학교 신소재공학부', keyPreview: 'jk_live_kor...5c8d', tier: 'Basic', dailyUsage: 120, dailyLimit: 1000, scopes: ['products', 'prices', 'inventory', 'recommend'], status: '활성', created: '2026-02-15', lastUsed: '2026-03-20 08:30' },
  { id: 'KEY-006', org: '(주)바이오텍연구소', keyPreview: 'jk_live_bio...3e2a', tier: 'Free', dailyUsage: 45, dailyLimit: 100, scopes: ['products', 'prices'], status: '활성', created: '2026-03-01', lastUsed: '2026-03-20 07:22' },
  { id: 'KEY-007', org: '한양대학교 화학과', keyPreview: 'jk_live_hyu...7b1c', tier: 'Basic', dailyUsage: 0, dailyLimit: 1000, scopes: ['products', 'prices', 'inventory', 'recommend'], status: '비활성', created: '2026-01-05', lastUsed: '2026-02-15 14:33' },
  { id: 'KEY-008', org: '성균관대학교 약학과', keyPreview: 'jk_live_skk...4d9f', tier: 'Pro', dailyUsage: 670, dailyLimit: 5000, scopes: ['products', 'prices', 'inventory', 'recommend', 'predict', 'analyze'], status: '활성', created: '2026-02-20', lastUsed: '2026-03-20 09:45' },
  { id: 'KEY-009', org: '충남대학교 화학과', keyPreview: 'jk_live_cnu...6a2e', tier: 'Free', dailyUsage: 28, dailyLimit: 100, scopes: ['products', 'prices'], status: '활성', created: '2026-03-10', lastUsed: '2026-03-20 06:50' },
  { id: 'KEY-010', org: '(주)케미솔루션', keyPreview: 'jk_live_csol...8d1b', tier: 'Enterprise', dailyUsage: 3400, dailyLimit: 50000, scopes: ['products', 'prices', 'inventory', 'recommend', 'predict', 'analyze', 'knowledge', 'batch'], status: '활성', created: '2025-11-20', lastUsed: '2026-03-20 10:18' },
];

// -----------------------------------------------------------------------------
// API Endpoint Usage (12)
// -----------------------------------------------------------------------------

export const mockEndpointUsage: EndpointUsage[] = [
  { endpoint: '/api/v1/products', method: 'GET', totalCalls: 45230, avgLatency: 85, errorRate: 0.12, trend: '증가' },
  { endpoint: '/api/v1/products/search', method: 'GET', totalCalls: 38100, avgLatency: 142, errorRate: 0.25, trend: '증가' },
  { endpoint: '/api/v1/products/:id', method: 'GET', totalCalls: 22450, avgLatency: 62, errorRate: 0.08, trend: '유지' },
  { endpoint: '/api/v1/prices', method: 'GET', totalCalls: 18900, avgLatency: 78, errorRate: 0.15, trend: '증가' },
  { endpoint: '/api/v1/inventory', method: 'GET', totalCalls: 15600, avgLatency: 95, errorRate: 0.18, trend: '유지' },
  { endpoint: '/api/v1/inventory/sync', method: 'POST', totalCalls: 8400, avgLatency: 320, errorRate: 1.2, trend: '증가' },
  { endpoint: '/api/v1/recommend', method: 'POST', totalCalls: 6800, avgLatency: 1250, errorRate: 0.45, trend: '증가' },
  { endpoint: '/api/v1/predict', method: 'POST', totalCalls: 3200, avgLatency: 1800, errorRate: 0.62, trend: '유지' },
  { endpoint: '/api/v1/analyze', method: 'POST', totalCalls: 1500, avgLatency: 3200, errorRate: 0.8, trend: '감소' },
  { endpoint: '/api/v1/knowledge', method: 'GET', totalCalls: 4100, avgLatency: 210, errorRate: 0.22, trend: '증가' },
  { endpoint: '/api/v1/knowledge/relations', method: 'GET', totalCalls: 2800, avgLatency: 185, errorRate: 0.18, trend: '유지' },
  { endpoint: '/api/v1/batch/status', method: 'GET', totalCalls: 1200, avgLatency: 45, errorRate: 0.05, trend: '유지' },
];

// -----------------------------------------------------------------------------
// API Errors (15)
// -----------------------------------------------------------------------------

export const mockApiErrors: ApiError[] = [
  { id: 'ERR-001', timestamp: '2026-03-20 10:15:22', org: '서울대학교 화학과', endpoint: '/api/v1/recommend', method: 'POST', statusCode: 429, errorMessage: 'Rate limit exceeded: 100 req/min', latency: 12 },
  { id: 'ERR-002', timestamp: '2026-03-20 10:12:05', org: '(주)바이오텍연구소', endpoint: '/api/v1/predict', method: 'POST', statusCode: 403, errorMessage: 'Scope not authorized: predict (Free tier)', latency: 8 },
  { id: 'ERR-003', timestamp: '2026-03-20 09:58:33', org: 'KAIST 생명공학과', endpoint: '/api/v1/products/search', method: 'GET', statusCode: 504, errorMessage: 'Gateway timeout: upstream service unavailable', latency: 30000 },
  { id: 'ERR-004', timestamp: '2026-03-20 09:45:18', org: '성균관대학교 약학과', endpoint: '/api/v1/inventory/sync', method: 'POST', statusCode: 500, errorMessage: 'Internal server error: DB connection pool exhausted', latency: 5200 },
  { id: 'ERR-005', timestamp: '2026-03-20 09:30:41', org: 'POSTECH 화학공학과', endpoint: '/api/v1/analyze', method: 'POST', statusCode: 408, errorMessage: 'Request timeout: Claude API response exceeded 30s', latency: 30000 },
  { id: 'ERR-006', timestamp: '2026-03-20 09:22:15', org: '서울대학교 화학과', endpoint: '/api/v1/products', method: 'GET', statusCode: 400, errorMessage: 'Invalid query parameter: page must be positive integer', latency: 15 },
  { id: 'ERR-007', timestamp: '2026-03-20 08:55:02', org: '고려대학교 신소재공학부', endpoint: '/api/v1/prices', method: 'GET', statusCode: 404, errorMessage: 'Product not found: PROD-99999', latency: 22 },
  { id: 'ERR-008', timestamp: '2026-03-20 08:30:19', org: '(주)케미솔루션', endpoint: '/api/v1/knowledge/relations', method: 'GET', statusCode: 422, errorMessage: 'Invalid CAS number format: 123456', latency: 18 },
  { id: 'ERR-009', timestamp: '2026-03-20 07:45:55', org: '충남대학교 화학과', endpoint: '/api/v1/recommend', method: 'POST', statusCode: 403, errorMessage: 'Scope not authorized: recommend (Free tier)', latency: 10 },
  { id: 'ERR-010', timestamp: '2026-03-20 07:12:33', org: '연세대학교 약학과', endpoint: '/api/v1/inventory', method: 'GET', statusCode: 503, errorMessage: 'Service temporarily unavailable: maintenance window', latency: 45 },
  { id: 'ERR-011', timestamp: '2026-03-19 23:55:10', org: 'POSTECH 화학공학과', endpoint: '/api/v1/batch/status', method: 'GET', statusCode: 404, errorMessage: 'Batch job not found: BATCH-99999', latency: 12 },
  { id: 'ERR-012', timestamp: '2026-03-19 22:30:44', org: 'KAIST 생명공학과', endpoint: '/api/v1/products/search', method: 'GET', statusCode: 400, errorMessage: 'Query too long: max 200 characters', latency: 8 },
  { id: 'ERR-013', timestamp: '2026-03-19 21:15:28', org: '서울대학교 화학과', endpoint: '/api/v1/predict', method: 'POST', statusCode: 429, errorMessage: 'Daily limit exceeded: 5000/5000', latency: 6 },
  { id: 'ERR-014', timestamp: '2026-03-19 19:42:11', org: '성균관대학교 약학과', endpoint: '/api/v1/recommend', method: 'POST', statusCode: 500, errorMessage: 'Internal error: Claude API returned malformed JSON', latency: 2400 },
  { id: 'ERR-015', timestamp: '2026-03-19 18:00:05', org: '(주)케미솔루션', endpoint: '/api/v1/inventory/sync', method: 'POST', statusCode: 502, errorMessage: 'Bad gateway: Alfa Aesar API returned invalid response', latency: 15000 },
];

// -----------------------------------------------------------------------------
// Rate Limits (4 tiers)
// -----------------------------------------------------------------------------

export const mockRateLimits: RateLimit[] = [
  { tier: 'Free', daily: '100', ratePerMin: '10', burst: '20', endpoints: '기본 4개', price: '무료' },
  { tier: 'Basic', daily: '1,000', ratePerMin: '30', burst: '60', endpoints: '8개', price: '₩50,000/월' },
  { tier: 'Pro', daily: '5,000', ratePerMin: '100', burst: '200', endpoints: '12개 (전체)', price: '₩200,000/월' },
  { tier: 'Enterprise', daily: '50,000', ratePerMin: '500', burst: '1000', endpoints: '12개 + 커스텀', price: '별도 협의' },
];

// -----------------------------------------------------------------------------
// Custom Rate Limit Overrides (3)
// -----------------------------------------------------------------------------

export const mockCustomLimits: CustomLimit[] = [
  { id: 'CL-001', org: 'POSTECH 화학공학과', tier: 'Enterprise', customDaily: 80000, customBurst: 1500, reason: '대규모 연구 프로젝트 (한국연구재단 과제) 기간 한시적 증가' },
  { id: 'CL-002', org: '(주)케미솔루션', tier: 'Enterprise', customDaily: 100000, customBurst: 2000, reason: '자사 플랫폼 연동 (실시간 가격 동기화) 요청' },
  { id: 'CL-003', org: '서울대학교 화학과', tier: 'Pro', customDaily: 8000, customBurst: 300, reason: '학기 중 실험 과목 수강생 동시접속 대응' },
];

// -----------------------------------------------------------------------------
// Data Pipeline - DataEvents (15)
// -----------------------------------------------------------------------------

export const mockDataEvents: DataEvent[] = [
  { id: 'DE-001', timestamp: '2026-03-20 10:18:05', userId: 'USR-001', userName: '김연구', sourceApp: 'Shop', eventType: 'search', payload: '{"query":"acetone","filters":{"supplier":"Sigma-Aldrich"},"results":12}' },
  { id: 'DE-002', timestamp: '2026-03-20 10:17:22', userId: 'USR-003', userName: '박실험', sourceApp: 'Shop', eventType: 'cart_add', payload: '{"productId":"PROD-004","variant":"2.5L","quantity":3}' },
  { id: 'DE-003', timestamp: '2026-03-20 10:15:44', userId: 'USR-009', userName: '오재료', sourceApp: 'ENote', eventType: 'page_view', payload: '{"page":"inventory","section":"reagent-cabinet"}' },
  { id: 'DE-004', timestamp: '2026-03-20 10:12:33', userId: 'USR-004', userName: '최공급', sourceApp: 'Supplier', eventType: 'click', payload: '{"element":"order-detail","orderId":"ORD-2026-0342"}' },
  { id: 'DE-005', timestamp: '2026-03-20 10:10:11', userId: 'USR-006', userName: '한시스템', sourceApp: 'Admin', eventType: 'page_view', payload: '{"page":"dashboard","section":"stats"}' },
  { id: 'DE-006', timestamp: '2026-03-20 10:08:55', userId: 'USR-005', userName: '정화학', sourceApp: 'Shop', eventType: 'order', payload: '{"orderId":"ORD-2026-0344","total":850000,"items":4}' },
  { id: 'DE-007', timestamp: '2026-03-20 10:05:30', userId: 'USR-012', userName: '배분자', sourceApp: 'Shop', eventType: 'search', payload: '{"query":"67-66-3","type":"cas","results":1}' },
  { id: 'DE-008', timestamp: '2026-03-20 10:02:18', userId: 'USR-008', userName: '강배송', sourceApp: 'Supplier', eventType: 'click', payload: '{"element":"inventory-update","products":127}' },
  { id: 'DE-009', timestamp: '2026-03-20 09:58:40', userId: 'USR-001', userName: '김연구', sourceApp: 'ENote', eventType: 'click', payload: '{"element":"protocol-reagent-order","protocolId":"PROT-0056"}' },
  { id: 'DE-010', timestamp: '2026-03-20 09:55:15', userId: 'USR-010', userName: '임승인', sourceApp: 'Shop', eventType: 'page_view', payload: '{"page":"approvals","pendingCount":5}' },
  { id: 'DE-011', timestamp: '2026-03-20 09:50:02', userId: 'USR-003', userName: '박실험', sourceApp: 'Shop', eventType: 'search', payload: '{"query":"ethanol HPLC grade","filters":{},"results":8}' },
  { id: 'DE-012', timestamp: '2026-03-20 09:45:33', userId: 'USR-014', userName: '서예산', sourceApp: 'Admin', eventType: 'click', payload: '{"element":"budget-settings","orgId":"ORG-003"}' },
  { id: 'DE-013', timestamp: '2026-03-20 09:40:12', userId: 'USR-009', userName: '오재료', sourceApp: 'Shop', eventType: 'cart_add', payload: '{"productId":"PROD-011","variant":"500mL","quantity":3}' },
  { id: 'DE-014', timestamp: '2026-03-20 09:35:48', userId: 'USR-005', userName: '정화학', sourceApp: 'ENote', eventType: 'page_view', payload: '{"page":"experiment","experimentId":"EXP-2026-0089"}' },
  { id: 'DE-015', timestamp: '2026-03-20 09:30:05', userId: 'USR-011', userName: '송데이터', sourceApp: 'Admin', eventType: 'click', payload: '{"element":"batch-job-manual-run","jobId":"data-aggregate"}' },
];

// -----------------------------------------------------------------------------
// Data Pipeline - SearchLogs (12)
// -----------------------------------------------------------------------------

export const mockSearchLogs: SearchLog[] = [
  { query: 'acetone', count: 1245, avgResults: 15, ctr: 42.5, lastSearched: '2026-03-20 10:18', searchType: '시약명' },
  { query: 'ethanol', count: 1180, avgResults: 22, ctr: 38.2, lastSearched: '2026-03-20 09:50', searchType: '시약명' },
  { query: '67-64-1', count: 890, avgResults: 1, ctr: 78.5, lastSearched: '2026-03-20 09:22', searchType: 'CAS' },
  { query: 'sodium hydroxide', count: 756, avgResults: 8, ctr: 35.8, lastSearched: '2026-03-20 08:45', searchType: '시약명' },
  { query: 'C2H5OH', count: 523, avgResults: 3, ctr: 62.1, lastSearched: '2026-03-19 17:30', searchType: '분자식' },
  { query: 'SA-A2153', count: 456, avgResults: 1, ctr: 89.2, lastSearched: '2026-03-20 10:05', searchType: '카탈로그번호' },
  { query: 'chloroform', count: 412, avgResults: 6, ctr: 44.7, lastSearched: '2026-03-20 10:05', searchType: '시약명' },
  { query: '7647-01-0', count: 389, avgResults: 1, ctr: 81.3, lastSearched: '2026-03-20 07:22', searchType: 'CAS' },
  { query: 'DMSO', count: 367, avgResults: 4, ctr: 55.8, lastSearched: '2026-03-19 16:15', searchType: '시약명' },
  { query: 'TCI-D0082', count: 234, avgResults: 1, ctr: 91.5, lastSearched: '2026-03-20 09:30', searchType: '카탈로그번호' },
  { query: 'H2SO4', count: 198, avgResults: 2, ctr: 68.4, lastSearched: '2026-03-19 14:22', searchType: '분자식' },
  { query: 'nitrile gloves', count: 156, avgResults: 12, ctr: 28.9, lastSearched: '2026-03-20 08:10', searchType: '시약명' },
];

// -----------------------------------------------------------------------------
// Data Pipeline - PriceHistory (10)
// -----------------------------------------------------------------------------

export const mockPriceHistory: PriceHistory[] = [
  { id: 'PH-001', productName: 'Acetone 2.5L', supplier: 'Sigma-Aldrich', previousPrice: 125000, newPrice: 128000, changePercent: 2.4, direction: '인상', recordedAt: '2026-03-20 06:00' },
  { id: 'PH-002', productName: 'Ethanol 1L', supplier: 'Daejung', previousPrice: 26000, newPrice: 25000, changePercent: -3.8, direction: '인하', recordedAt: '2026-03-20 06:00' },
  { id: 'PH-003', productName: 'Sodium Hydroxide 500g', supplier: 'Alfa Aesar', previousPrice: 59000, newPrice: 59000, changePercent: 0, direction: '동일', recordedAt: '2026-03-20 06:00' },
  { id: 'PH-004', productName: 'Acetic Acid 1L', supplier: 'TCI', previousPrice: 75000, newPrice: 78000, changePercent: 4.0, direction: '인상', recordedAt: '2026-03-19 06:00' },
  { id: 'PH-005', productName: 'Chloroform 500mL', supplier: 'Sigma-Aldrich', previousPrice: 70000, newPrice: 68000, changePercent: -2.9, direction: '인하', recordedAt: '2026-03-19 06:00' },
  { id: 'PH-006', productName: 'DMSO 500mL', supplier: 'Daejung', previousPrice: 45000, newPrice: 45000, changePercent: 0, direction: '동일', recordedAt: '2026-03-19 06:00' },
  { id: 'PH-007', productName: 'Sulfuric Acid 500mL', supplier: 'Samchun', previousPrice: 27000, newPrice: 28000, changePercent: 3.7, direction: '인상', recordedAt: '2026-03-18 06:00' },
  { id: 'PH-008', productName: 'Hydrochloric Acid 1L', supplier: 'Alfa Aesar', previousPrice: 52000, newPrice: 50000, changePercent: -3.8, direction: '인하', recordedAt: '2026-03-18 06:00' },
  { id: 'PH-009', productName: 'Dichloromethane 1L', supplier: 'TCI', previousPrice: 60000, newPrice: 63000, changePercent: 5.0, direction: '인상', recordedAt: '2026-03-17 06:00' },
  { id: 'PH-010', productName: 'Methanol 1L', supplier: 'Sigma-Aldrich', previousPrice: 62000, newPrice: 59000, changePercent: -4.8, direction: '인하', recordedAt: '2026-03-17 06:00' },
];

// -----------------------------------------------------------------------------
// Data Pipeline - Batch Jobs (expanded)
// -----------------------------------------------------------------------------

export const mockBatchJobs: BatchJob[] = [
  { id: 'BJ-001', name: 'ai-batch-recommend', desc: 'AI 추천 배치 생성', schedule: '매일 03:00', lastRun: '2026-03-20 03:00', nextRun: '2026-03-21 03:00', status: '성공', duration: '12분 34초' },
  { id: 'BJ-002', name: 'ai-batch-predict', desc: 'AI 소모량 예측 배치', schedule: '매주 월요일 04:00', lastRun: '2026-03-17 04:00', nextRun: '2026-03-24 04:00', status: '성공', duration: '28분 15초' },
  { id: 'BJ-003', name: 'data-aggregate', desc: '일별 데이터 집계', schedule: '매일 00:00', lastRun: '2026-03-20 00:00', nextRun: '2026-03-21 00:00', status: '성공', duration: '5분 42초' },
  { id: 'BJ-004', name: 'supplier-sync', desc: '공급사 가격/재고 동기화', schedule: '6시간마다', lastRun: '2026-03-20 06:00', nextRun: '2026-03-20 12:00', status: '실패', duration: '3분 18초' },
  { id: 'BJ-005', name: 'knowledge-graph-update', desc: '지식 그래프 노드 갱신', schedule: '매일 05:00', lastRun: '2026-03-20 05:00', nextRun: '2026-03-21 05:00', status: '성공', duration: '45분 22초' },
  { id: 'BJ-006', name: 'search-index-rebuild', desc: '검색 인덱스 재구축', schedule: '매일 02:00', lastRun: '2026-03-20 02:00', nextRun: '2026-03-21 02:00', status: '실행중', duration: '-' },
  { id: 'BJ-007', name: 'report-generation', desc: '주간 분석 리포트 생성', schedule: '매주 월요일 06:00', lastRun: '2026-03-17 06:00', nextRun: '2026-03-24 06:00', status: '성공', duration: '18분 55초' },
  { id: 'BJ-008', name: 'user-activity-digest', desc: '사용자 활동 요약 메일 발송', schedule: '매일 08:00', lastRun: '2026-03-20 08:00', nextRun: '2026-03-21 08:00', status: '성공', duration: '2분 10초' },
  { id: 'BJ-009', name: 'db-backup', desc: 'PostgreSQL 일일 백업', schedule: '매일 01:00', lastRun: '2026-03-20 01:00', nextRun: '2026-03-21 01:00', status: '성공', duration: '8분 30초' },
  { id: 'BJ-010', name: 'expired-cart-cleanup', desc: '만료 장바구니 정리 (7일 이상)', schedule: '매일 04:30', lastRun: '2026-03-20 04:30', nextRun: '2026-03-21 04:30', status: '성공', duration: '1분 15초' },
];

// -----------------------------------------------------------------------------
// Settings - Notices (5)
// -----------------------------------------------------------------------------

export const mockNotices: Notice[] = [
  {
    id: 'NTC-001',
    title: '3월 정기 시스템 점검 안내',
    category: '점검',
    content: '2026년 3월 22일(일) 02:00~06:00 시스템 정기 점검이 진행됩니다. 점검 시간 동안 일부 서비스 이용이 제한될 수 있습니다.',
    status: '게시중',
    author: '한시스템',
    pinned: true,
    startDate: '2026-03-19',
    endDate: '2026-03-22',
    createdAt: '2026-03-19 09:00',
  },
  {
    id: 'NTC-002',
    title: 'API v1.3 업데이트 안내',
    category: '서비스',
    content: '외부 API v1.3 업데이트가 적용되었습니다. 신규 엔드포인트(/api/v1/knowledge/search)가 추가되었으며, 기존 엔드포인트의 응답 속도가 개선되었습니다.',
    status: '게시중',
    author: '송데이터',
    pinned: false,
    startDate: '2026-03-18',
    endDate: '2026-04-18',
    createdAt: '2026-03-18 10:00',
  },
  {
    id: 'NTC-003',
    title: '2026년 1분기 신규 공급사 추가 안내',
    category: '일반',
    content: 'Junsei Chemical 공급사가 새롭게 추가되었습니다. 총 420종의 시약 제품을 확인하실 수 있습니다.',
    status: '게시중',
    author: '한시스템',
    pinned: false,
    startDate: '2026-03-15',
    endDate: '2026-04-15',
    createdAt: '2026-03-15 14:00',
  },
  {
    id: 'NTC-004',
    title: '4월 정기 시스템 점검 안내',
    category: '점검',
    content: '2026년 4월 19일(일) 02:00~06:00 시스템 정기 점검이 예정되어 있습니다.',
    status: '예약',
    author: '한시스템',
    pinned: false,
    startDate: '2026-04-14',
    endDate: '2026-04-19',
    createdAt: '2026-03-20 07:30',
  },
  {
    id: 'NTC-005',
    title: '2월 시스템 점검 완료 공지',
    category: '점검',
    content: '2026년 2월 23일 시스템 점검이 정상적으로 완료되었습니다. 서비스 이용에 불편을 드려 죄송합니다.',
    status: '종료',
    author: '한시스템',
    pinned: false,
    startDate: '2026-02-20',
    endDate: '2026-02-28',
    createdAt: '2026-02-23 06:30',
  },
];

// -----------------------------------------------------------------------------
// Settings - FAQs (10)
// -----------------------------------------------------------------------------

export const mockFaqs: Faq[] = [
  { id: 'FAQ-001', category: '주문', question: '시약 주문 후 취소가 가능한가요?', answer: '주문 접수 후 24시간 이내에는 마이페이지 > 주문 내역에서 취소가 가능합니다. 이미 출고된 건은 반품 절차를 이용해주세요.', order: 1, status: '게시중' },
  { id: 'FAQ-002', category: '주문', question: '대량 주문(CSV 일괄 업로드)은 어떻게 하나요?', answer: '빠른 주문 메뉴에서 CSV 파일을 업로드하여 한번에 여러 제품을 주문할 수 있습니다. CSV 양식은 빠른 주문 페이지에서 다운로드할 수 있습니다.', order: 2, status: '게시중' },
  { id: 'FAQ-003', category: '배송', question: '당일 출고 기준은 무엇인가요?', answer: '평일 오후 3시 이전 주문 건에 한하여 당일 출고됩니다. 당일출고 가능 제품에는 별도 배지가 표시됩니다.', order: 1, status: '게시중' },
  { id: 'FAQ-004', category: '배송', question: '배송 기간은 얼마나 걸리나요?', answer: '수도권 기준 1~2일, 지방 2~3일이 소요됩니다. 위험물 시약의 경우 별도 운송 규정에 따라 추가 시간이 소요될 수 있습니다.', order: 2, status: '게시중' },
  { id: 'FAQ-005', category: '제품', question: 'SDS(안전보건자료)는 어디서 확인하나요?', answer: '제품 상세 페이지의 문서 탭에서 한글/영문 SDS를 다운로드할 수 있습니다. COA, Spec Sheet 등 기타 문서도 같은 위치에서 확인 가능합니다.', order: 1, status: '게시중' },
  { id: 'FAQ-006', category: '제품', question: '제품 재고가 없는 경우 어떻게 하나요?', answer: '일시품절 제품은 입고 알림 신청이 가능합니다. 제품 상세 페이지에서 입고 알림을 설정하시면 재입고 시 이메일로 안내해드립니다.', order: 2, status: '게시중' },
  { id: 'FAQ-007', category: '계정', question: '조직관리자 권한은 어떻게 받나요?', answer: '소속 기관의 기존 조직관리자가 사용자 관리 메뉴에서 역할을 변경할 수 있습니다. 기관에 조직관리자가 없는 경우 고객센터로 문의해주세요.', order: 1, status: '게시중' },
  { id: 'FAQ-008', category: '계정', question: '비밀번호를 분실했습니다.', answer: '로그인 페이지의 비밀번호 찾기를 통해 등록된 이메일로 재설정 링크를 받으실 수 있습니다.', order: 2, status: '게시중' },
  { id: 'FAQ-009', category: '기타', question: 'API 키는 어떻게 발급받나요?', answer: '관리자 플랫폼의 API 관리 메뉴에서 발급 요청이 가능합니다. Free 티어는 즉시 발급되며, Basic 이상 티어는 심사 후 1~2일 내 발급됩니다.', order: 1, status: '게시중' },
  { id: 'FAQ-010', category: '기타', question: 'JINU E-Note와 연동하는 방법이 궁금합니다.', answer: '마이페이지 > 서비스 연동 메뉴에서 JINU E-Note 계정을 연결할 수 있습니다. 연동 시 시약장 데이터가 양방향으로 동기화됩니다.', order: 2, status: '비게시' },
];

// -----------------------------------------------------------------------------
// Settings - System Info
// -----------------------------------------------------------------------------

export const mockSystemInfo: SystemInfo = {
  platformVersions: [
    { name: 'JINU Shop', version: 'v2.4.1', deployedAt: '2026-03-18 14:00' },
    { name: 'JINU E-Note', version: 'v1.7.2', deployedAt: '2026-03-15 10:00' },
    { name: 'Supplier Portal', version: 'v1.3.0', deployedAt: '2026-03-12 16:00' },
    { name: 'Admin Platform', version: 'v1.5.3', deployedAt: '2026-03-20 07:00' },
    { name: 'External API', version: 'v1.3.0', deployedAt: '2026-03-18 10:00' },
    { name: 'AI Engine (Recommend)', version: 'v2.3.1', deployedAt: '2026-03-15 05:00' },
    { name: 'AI Engine (Predict)', version: 'v1.8.0', deployedAt: '2026-03-10 05:00' },
    { name: 'AI Engine (Analyze)', version: 'v1.5.2', deployedAt: '2026-03-08 05:00' },
    { name: 'AI Engine (Knowledge)', version: 'v1.2.0', deployedAt: '2026-03-01 05:00' },
  ],
  dbStats: {
    tables: 47,
    rows: '2,345,678',
    size: '12.8 GB',
    lastBackup: '2026-03-20 01:00',
  },
  externalServices: [
    { name: 'Supabase Auth', status: '정상', latency: '45ms', lastCheck: '2026-03-20 10:00' },
    { name: 'Supabase DB (PostgreSQL)', status: '정상', latency: '12ms', lastCheck: '2026-03-20 10:00' },
    { name: 'Claude API', status: '정상', latency: '850ms', lastCheck: '2026-03-20 10:00' },
    { name: 'Vercel (CDN)', status: '정상', latency: '22ms', lastCheck: '2026-03-20 10:00' },
    { name: 'Sigma-Aldrich API', status: '정상', latency: '210ms', lastCheck: '2026-03-20 06:00' },
    { name: 'Alfa Aesar API', status: '정상', latency: '185ms', lastCheck: '2026-03-20 06:00' },
    { name: 'TCI API', status: '장애', latency: '-', lastCheck: '2026-03-20 06:03' },
    { name: 'PG사 결제 (토스페이먼츠)', status: '정상', latency: '120ms', lastCheck: '2026-03-20 10:00' },
  ],
};

// -----------------------------------------------------------------------------
// Supplier Settlement (정산 데이터)
// -----------------------------------------------------------------------------

export const mockSupplierSettlements: SupplierSettlement[] = [
  // 2026년 3월 (당월 - 정산대기)
  { supplierId: 'SUP-001', supplierName: 'Sigma-Aldrich', period: '2026-03', productCount: 2450, orderCount: 342, totalSales: 89500000, commission: 8950000, commissionRate: 10, netPayment: 80550000, status: '정산대기', settledAt: null },
  { supplierId: 'SUP-002', supplierName: 'Alfa Aesar', period: '2026-03', productCount: 1830, orderCount: 218, totalSales: 52300000, commission: 5230000, commissionRate: 10, netPayment: 47070000, status: '정산대기', settledAt: null },
  { supplierId: 'SUP-003', supplierName: 'TCI', period: '2026-03', productCount: 1540, orderCount: 187, totalSales: 41200000, commission: 4120000, commissionRate: 10, netPayment: 37080000, status: '확인중', settledAt: null },
  { supplierId: 'SUP-004', supplierName: 'Daejung', period: '2026-03', productCount: 980, orderCount: 156, totalSales: 28900000, commission: 2312000, commissionRate: 8, netPayment: 26588000, status: '정산대기', settledAt: null },
  { supplierId: 'SUP-005', supplierName: 'Samchun', period: '2026-03', productCount: 760, orderCount: 98, totalSales: 18700000, commission: 1496000, commissionRate: 8, netPayment: 17204000, status: '정산대기', settledAt: null },
  { supplierId: 'SUP-006', supplierName: 'Junsei', period: '2026-03', productCount: 420, orderCount: 45, totalSales: 12500000, commission: 1000000, commissionRate: 8, netPayment: 11500000, status: '정산대기', settledAt: null },
  // 2026년 2월 (전월 - 정산완료)
  { supplierId: 'SUP-001', supplierName: 'Sigma-Aldrich', period: '2026-02', productCount: 2380, orderCount: 298, totalSales: 78200000, commission: 7820000, commissionRate: 10, netPayment: 70380000, status: '정산완료', settledAt: '2026-03-10' },
  { supplierId: 'SUP-002', supplierName: 'Alfa Aesar', period: '2026-02', productCount: 1790, orderCount: 195, totalSales: 46800000, commission: 4680000, commissionRate: 10, netPayment: 42120000, status: '정산완료', settledAt: '2026-03-10' },
  { supplierId: 'SUP-003', supplierName: 'TCI', period: '2026-02', productCount: 1510, orderCount: 172, totalSales: 38500000, commission: 3850000, commissionRate: 10, netPayment: 34650000, status: '정산완료', settledAt: '2026-03-10' },
  { supplierId: 'SUP-004', supplierName: 'Daejung', period: '2026-02', productCount: 950, orderCount: 134, totalSales: 25100000, commission: 2008000, commissionRate: 8, netPayment: 23092000, status: '정산완료', settledAt: '2026-03-10' },
  { supplierId: 'SUP-005', supplierName: 'Samchun', period: '2026-02', productCount: 740, orderCount: 87, totalSales: 16200000, commission: 1296000, commissionRate: 8, netPayment: 14904000, status: '정산완료', settledAt: '2026-03-10' },
  { supplierId: 'SUP-006', supplierName: 'Junsei', period: '2026-02', productCount: 410, orderCount: 38, totalSales: 10800000, commission: 864000, commissionRate: 8, netPayment: 9936000, status: '정산완료', settledAt: '2026-03-10' },
  // 2026년 1월
  { supplierId: 'SUP-001', supplierName: 'Sigma-Aldrich', period: '2026-01', productCount: 2350, orderCount: 265, totalSales: 72100000, commission: 7210000, commissionRate: 10, netPayment: 64890000, status: '정산완료', settledAt: '2026-02-10' },
  { supplierId: 'SUP-002', supplierName: 'Alfa Aesar', period: '2026-01', productCount: 1750, orderCount: 178, totalSales: 43200000, commission: 4320000, commissionRate: 10, netPayment: 38880000, status: '정산완료', settledAt: '2026-02-10' },
  { supplierId: 'SUP-003', supplierName: 'TCI', period: '2026-01', productCount: 1480, orderCount: 159, totalSales: 35600000, commission: 3560000, commissionRate: 10, netPayment: 32040000, status: '정산완료', settledAt: '2026-02-10' },
  { supplierId: 'SUP-004', supplierName: 'Daejung', period: '2026-01', productCount: 920, orderCount: 121, totalSales: 22800000, commission: 1824000, commissionRate: 8, netPayment: 20976000, status: '정산완료', settledAt: '2026-02-10' },
];
