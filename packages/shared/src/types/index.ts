// ================================================================
// JINUCHEM 공유 TypeScript 타입
// Prisma 모델에서 자동 생성되지 않는 UI/API 전용 타입들
// ================================================================

/** 유해화학물질 배송 규정 */
export interface ShippingRestriction {
  type: string;
  class: string;
  note: string;
}

/** 시약 카드 표시 데이터 */
export interface ReagentCardData {
  id: string;
  name: string;
  nameEn?: string;
  catalogNo?: string;
  casNumber?: string;
  formula?: string;
  molWeight?: number;
  grade?: string;
  purity?: string;
  supplierName: string;
  structureImg?: string;
  variants: VariantSummary[];
  ghsPictograms?: string[];
  shippingRestriction?: ShippingRestriction | null;
  isInInventory?: boolean;
  isFavorite?: boolean;
}

/** 소모품 카드 표시 데이터 */
export interface SupplyCardData {
  id: string;
  name: string;
  catalogNo?: string;
  categoryName: string;
  supplierName: string;
  subscriptionAvailable: boolean;
  variants: VariantSummary[];
  isFavorite?: boolean;
}

/** 포장단위 요약 */
export interface VariantSummary {
  id: string;
  size: string;
  unit: string;
  listPrice: number;
  salePrice?: number;
  discountRate?: number;
  stockQty: number;
  sameDayShip: boolean;
  deliveryDate?: string;
}

/** 장바구니 아이템 */
export interface CartItemData {
  id: string;
  productId: string;
  variantId: string;
  productName: string;
  catalogNo?: string;
  supplierName: string;
  size: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  structureImg?: string;
}

/** 주문 요약 */
export interface OrderSummary {
  subtotal: number;
  discount: number;
  vat: number;
  total: number;
  itemCount: number;
}

/** 대시보드 통계 카드 */
export interface DashboardStats {
  cartTotal: number;
  cartItemCount: number;
  orderCount: number;
  shippingCount: number;
  monthlySpend: number;
  monthlyChange: number; // 전월 대비 %
}

/** 자주 구매한 제품 */
export interface FrequentProduct {
  productId: string;
  productName: string;
  structureImg?: string;
  supplierName: string;
  size: string;
  lastPrice: number;
  orderCount: number;
}

/** 재고 부족 알림 */
export interface StockAlert {
  inventoryId: string;
  name: string;
  casNumber?: string;
  currentQty: number;
  minStock: number;
  unit: string;
  status: 'low' | 'expired';
  expiryDate?: string;
}

/** API 사용량 통계 */
export interface ApiUsageStats {
  totalCalls: number;
  todayCalls: number;
  averageLatency: number;
  topEndpoints: { endpoint: string; count: number }[];
  errorRate: number;
}

/** AI 추천 결과 */
export interface RecommendationResult {
  productId: string;
  productName: string;
  casNumber?: string;
  score: number;
  reason: string;
  supplierName: string;
  currentPrice: number;
}

/** AI 예측 결과 */
export interface PredictionResult {
  type: 'consumption' | 'budget' | 'reorder';
  data: Record<string, unknown>;
  confidence: number;
  generatedAt: string;
}

/** 검색 자동완성 결과 */
export interface AutocompleteResult {
  type: 'product' | 'category' | 'supplier';
  id: string;
  text: string;
  subtext?: string;
  casNumber?: string;
}

/** 페이지네이션 정보 */
export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

/** API 응답 래퍼 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  pagination?: PaginationInfo;
}

/** 외부 API 응답 래퍼 */
export interface ExternalApiResponse<T> {
  status: 'ok' | 'error';
  data?: T;
  error?: { code: string; message: string };
  meta?: {
    page: number;
    limit: number;
    total: number;
    requestId: string;
  };
}
