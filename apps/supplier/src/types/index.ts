// ===== Order Types =====
export type OrderStatus = '신규주문' | '준비중' | '출고완료' | '배송완료';

export interface OrderItem {
  name: string;
  catalogNo: string;
  size: string;
  qty: number;
  unitPrice: number;
  subtotal: number;
}

export interface SupplierOrder {
  id: string;
  customer: string;
  customerOrg: string;
  items: OrderItem[];
  totalAmount: number;
  orderedDate: string;
  status: OrderStatus;
  shippingAddress: string;
  contactName: string;
  contactPhone: string;
  poNumber?: string;
}

// ===== Quote Types =====
export type QuoteStatus = '대기중' | '응답완료' | '주문전환' | '만료';

export interface QuoteRequestItem {
  product: string;
  size: string;
  qty: number;
  unitPrice?: number;
}

export interface SupplierQuote {
  id: string;
  requester: string;
  requesterOrg: string;
  department?: string;
  phone?: string;
  items: QuoteRequestItem[];
  requestedDate: string;
  dueDate: string;
  totalAmount?: number;
  status: QuoteStatus;
  requestNote?: string;
}

// ===== Product Types =====
export type ProductStatus = '판매중' | '품절' | '판매중지' | '검수중';

export interface SupplierProduct {
  id: string;
  name: string;
  cas: string;
  catalogNo: string;
  category: string;
  stock: number;
  price: number;
  salePrice?: number;
  status: ProductStatus;
  sameDayShip: boolean;
  deliveryDate: string;
  variantCount: number;
}

// ===== Return Types =====
export type ReturnType = '취소' | '반품';
export type ReturnStatus = '접수' | '처리중' | '완료';

export interface ReturnRequest {
  id: string;
  type: ReturnType;
  orderId: string;
  requester: string;
  org: string;
  product: string;
  reason: string;
  refundAmount: number;
  status: ReturnStatus;
  requestedDate: string;
}

// ===== Settlement Types =====
export type SettlementStatus = '예정' | '완료' | '보류';

export interface Settlement {
  id: string;
  periodStart: string;
  periodEnd: string;
  totalSales: number;
  platformFee: number;
  paymentFee: number;
  deduction: number;
  netAmount: number;
  scheduledDate: string;
  paidDate?: string;
  status: SettlementStatus;
}

// ===== Customer Types =====
export type InquiryStatus = '미답변' | '답변완료';
export type InquiryType = '제품' | '주문' | '배송' | '가격' | '기타';

export interface SupplierInquiry {
  id: string;
  type: InquiryType;
  title: string;
  requester: string;
  org: string;
  orderId?: string;
  date: string;
  status: InquiryStatus;
}

export interface ProductReview {
  id: string;
  product: string;
  rating: number;
  author: string;
  org: string;
  content: string;
  date: string;
  reply?: string;
}

export interface ChatRoom {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  unread: number;
}

// ===== Notification Types =====
export type NotificationType = 'new_order' | 'new_quote' | 'inquiry' | 'low_stock' | 'settlement' | 'return' | 'system';

export interface SupplierNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  time: string;
  isRead: boolean;
}

// ===== Dashboard Types =====
export interface DashboardStat {
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
}

export interface TopProduct {
  rank: number;
  name: string;
  catalogNo: string;
  orders: number;
  revenue: number;
}
