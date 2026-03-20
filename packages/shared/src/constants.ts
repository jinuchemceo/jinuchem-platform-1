// ================================================================
// JINUCHEM 공유 상수
// ================================================================

// 주문 상태 한글 레이블
export const ORDER_STATUS_LABEL: Record<string, string> = {
  payment_pending: '결제대기',
  payment_done: '결제완료',
  preparing: '배송준비',
  shipping: '배송중',
  delivered: '배송완료',
  cancelled: '취소',
} as const;

// 주문 상태 색상
export const ORDER_STATUS_COLOR: Record<string, string> = {
  payment_pending: 'amber',
  payment_done: 'blue',
  preparing: 'indigo',
  shipping: 'violet',
  delivered: 'emerald',
  cancelled: 'red',
} as const;

// 승인 상태 한글 레이블
export const APPROVAL_STATUS_LABEL: Record<string, string> = {
  pending: '대기',
  approved: '승인',
  rejected: '거절',
} as const;

// 취소/반품 상태 한글 레이블
export const CANCEL_STATUS_LABEL: Record<string, string> = {
  received: '접수',
  processing: '처리중',
  completed: '완료',
} as const;

// 견적 상태 한글 레이블
export const QUOTE_STATUS_LABEL: Record<string, string> = {
  pending: '견적대기',
  arrived: '견적도착',
  ordered: '주문완료',
  expired: '만료',
} as const;

// 문의 유형 한글 레이블
export const INQUIRY_TYPE_LABEL: Record<string, string> = {
  order: '주문/결제',
  delivery: '배송',
  product: '제품',
  account: '계정',
  etc: '기타',
} as const;

// 문의 상태 한글 레이블
export const INQUIRY_STATUS_LABEL: Record<string, string> = {
  received: '접수',
  processing: '처리중',
  answered: '답변완료',
} as const;

// 역할 한글 레이블
export const ROLE_LABEL: Record<string, string> = {
  researcher: '연구원',
  org_admin: '조직관리자',
  supplier: '공급자',
  sys_admin: '시스템관리자',
} as const;

// 제품 유형 한글 레이블
export const PRODUCT_TYPE_LABEL: Record<string, string> = {
  reagent: '시약',
  supply: '소모품',
} as const;

// 재고 상태 한글 레이블
export const INVENTORY_STATUS_LABEL: Record<string, string> = {
  normal: '정상',
  low: '부족',
  expired: '만료',
} as const;

// 정기배송 주기 한글 레이블
export const SUBSCRIPTION_INTERVAL_LABEL: Record<string, string> = {
  '1w': '매주',
  '2w': '2주마다',
  '1m': '매월',
  '2m': '2개월',
  '3m': '3개월',
} as const;

// 문서 유형 한글 레이블
export const DOC_TYPE_LABEL: Record<string, string> = {
  sds_kr: '한글 SDS',
  sds_en: '영문 SDS',
  coa: 'COA',
  coo: 'COO',
  spec: 'Spec Sheet',
  kc_cert: 'KC 인증서',
} as const;

// 증빙서류 유형 한글 레이블
export const VOUCHER_TYPE_LABEL: Record<string, string> = {
  estimate: '견적서',
  transaction_report: '거래명세서',
  delivery_confirm: '납품확인서',
} as const;

// API 티어 정보
export const API_TIER_INFO: Record<string, { label: string; dailyLimit: number; monthlyLimit: number }> = {
  free: { label: '무료', dailyLimit: 100, monthlyLimit: 3_000 },
  basic: { label: '기본', dailyLimit: 1_000, monthlyLimit: 30_000 },
  pro: { label: '프로', dailyLimit: 10_000, monthlyLimit: 300_000 },
  enterprise: { label: '엔터프라이즈', dailyLimit: -1, monthlyLimit: -1 },
} as const;

// AI 예측 유형 한글 레이블
export const PREDICTION_TYPE_LABEL: Record<string, string> = {
  consumption: '소모량 예측',
  budget: '예산 예측',
  reorder: '재주문 시점 예측',
} as const;

// 실험 상태 한글 레이블
export const EXPERIMENT_STATUS_LABEL: Record<string, string> = {
  draft: '초안',
  in_progress: '진행중',
  completed: '완료',
  archived: '보관',
} as const;

// 시약 등급
export const REAGENT_GRADES = [
  'ACS Grade',
  'HPLC Grade',
  'GR Grade',
  '특급',
  '1급',
] as const;

// 시약 카테고리
export const REAGENT_CATEGORIES = [
  { id: 'organic', name: '유기화합물' },
  { id: 'inorganic', name: '무기화합물' },
  { id: 'biochemical', name: '생화학시약' },
  { id: 'analytical', name: '분석용시약' },
  { id: 'solvent', name: '용매' },
  { id: 'polymer', name: '고분자' },
] as const;

// 소모품 카테고리
export const SUPPLY_CATEGORIES = [
  { id: 'filter', name: '필터/여과', subcategories: ['시린지 필터', '멤브레인 필터', '진공 필터', '필터 페이퍼'] },
  { id: 'pipette', name: '피펫/팁', subcategories: ['마이크로피펫', '피펫 팁', '일회용 피펫', '전동 피펫'] },
  { id: 'tube', name: '튜브/바이알', subcategories: ['원심분리 튜브', 'PCR 튜브', '바이알', '캡'] },
  { id: 'glove', name: '장갑/보호구', subcategories: ['니트릴 장갑', '라텍스 장갑', '보안경', '실험복'] },
  { id: 'glassware', name: '유리기구', subcategories: ['비커', '플라스크', '실린더', '피펫'] },
  { id: 'plate', name: '플레이트/디쉬', subcategories: ['웰 플레이트', '페트리 디쉬', '셀 플레이트'] },
  { id: 'general', name: '일반 소모품', subcategories: ['알루미늄 호일', '파라필름', '라벨', '마커'] },
] as const;

// 페이지네이션 기본값
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  REAGENT_PER_PAGE: 8,
  SUPPLY_PER_PAGE: 8,
} as const;

// 토스트 기본 타임아웃 (밀리초)
export const TOAST_DURATION = 2500;

// 검색 디바운스 (밀리초)
export const SEARCH_DEBOUNCE = 200;

// 세션 타임아웃 (분)
export const SESSION_TIMEOUT = 30;

// 최대 비교 상품 수
export const MAX_COMPARE_ITEMS = 4;

// 최근 본 상품 최대 수
export const MAX_RECENT_ITEMS = 10;
