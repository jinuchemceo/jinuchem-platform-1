// ================================================================
// JINUCHEM 공유 Zod 검증 스키마
// ================================================================

import { z } from 'zod';

// 배송지
export const shippingAddressSchema = z.object({
  label: z.string().min(1, '배송지 이름을 입력해주세요'),
  recipient: z.string().min(1, '수령인을 입력해주세요'),
  phone: z.string().regex(/^0\d{1,2}-?\d{3,4}-?\d{4}$/, '올바른 전화번호를 입력해주세요'),
  address: z.string().min(1, '주소를 입력해주세요'),
  building: z.string().optional(),
  department: z.string().optional(),
  labRoom: z.string().optional(),
  isDefault: z.boolean().default(false),
});

// 체크아웃 Step 1
export const checkoutStep1Schema = z.object({
  shippingAddressId: z.string().uuid('배송지를 선택해주세요'),
  billingOrg: z.string().optional(),
  billingAddress: z.string().optional(),
  billingAccountNo: z.string().optional(),
  poNumber: z.string().optional(),
  deliveryNote: z.string().max(500, '배송 요청사항은 500자 이내').optional(),
  emailCc: z.array(z.string().email()).optional(),
});

// 장바구니 아이템 추가
export const addToCartSchema = z.object({
  productId: z.string().uuid(),
  variantId: z.string().uuid(),
  quantity: z.number().int().min(1, '수량은 1 이상이어야 합니다').max(999),
});

// 빠른 주문 아이템
export const quickOrderItemSchema = z.object({
  catalogNo: z.string().optional(),
  casNumber: z.string().optional(),
  productName: z.string().optional(),
  quantity: z.number().int().min(1).default(1),
  variantId: z.string().uuid().optional(),
});

// 문의 작성
export const inquirySchema = z.object({
  inquiryType: z.enum(['order', 'delivery', 'product', 'account', 'etc']),
  orderId: z.string().uuid().optional(),
  title: z.string().min(1, '제목을 입력해주세요').max(200),
  content: z.string().min(10, '내용을 10자 이상 입력해주세요').max(5000),
  attachmentUrl: z.string().url().optional(),
});

// 시약장 수동 등록
export const labInventorySchema = z.object({
  name: z.string().min(1, '시약명을 입력해주세요'),
  casNumber: z.string().optional(),
  currentQty: z.number().min(0, '수량은 0 이상이어야 합니다'),
  unit: z.string().min(1, '단위를 입력해주세요'),
  location: z.string().optional(),
  expiryDate: z.string().optional(),
  minStock: z.number().min(0).optional(),
  productId: z.string().uuid().optional(),
});

// 프로토콜 시약 텍스트 파싱용
export const protocolTextSchema = z.object({
  text: z.string().min(1, '시약 목록을 입력해주세요'),
});

// 검색 쿼리
export const searchSchema = z.object({
  q: z.string().min(1).max(200),
  type: z.enum(['text', 'cas', 'formula', 'structure']).default('text'),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
});

// 견적 요청
export const quoteRequestSchema = z.object({
  supplierId: z.string().uuid(),
  items: z.array(z.object({
    productId: z.string().uuid(),
    variantId: z.string().uuid(),
    quantity: z.number().int().min(1),
  })).min(1, '최소 1개 이상의 제품을 선택해주세요'),
});

// 취소/반품 신청
export const cancelReturnSchema = z.object({
  orderId: z.string().uuid(),
  type: z.enum(['cancel', 'return']),
  reason: z.string().min(1, '사유를 선택해주세요'),
  detail: z.string().max(1000).optional(),
});

// 프로필 수정
export const profileUpdateSchema = z.object({
  name: z.string().min(1).max(50).optional(),
  phone: z.string().regex(/^0\d{1,2}-?\d{3,4}-?\d{4}$/).optional(),
  department: z.string().max(100).optional(),
  labName: z.string().max(100).optional(),
});

// API Key 발급
export const apiKeyCreateSchema = z.object({
  orgId: z.string().uuid(),
  tier: z.enum(['free', 'basic', 'pro', 'enterprise']).default('free'),
  scopes: z.array(z.string()).optional(),
});

// 실험 생성
export const experimentSchema = z.object({
  title: z.string().min(1, '실험 제목을 입력해주세요').max(200),
  purpose: z.string().optional(),
  method: z.string().optional(),
  result: z.string().optional(),
});

// 프로토콜 생성
export const protocolSchema = z.object({
  title: z.string().min(1, '프로토콜 제목을 입력해주세요').max(200),
  description: z.string().optional(),
  steps: z.array(z.object({
    order: z.number().int(),
    description: z.string(),
    duration: z.string().optional(),
  })),
  isTemplate: z.boolean().default(false),
  reagents: z.array(z.object({
    casNumber: z.string().optional(),
    productName: z.string().optional(),
    quantity: z.number().min(0),
    unit: z.string(),
  })).optional(),
});

// 사용 기록
export const usageRecordSchema = z.object({
  productId: z.string().uuid(),
  experimentId: z.string().uuid().optional(),
  quantityUsed: z.number().min(0),
  unit: z.string(),
  lotNumber: z.string().optional(),
});

export type ShippingAddressInput = z.infer<typeof shippingAddressSchema>;
export type CheckoutStep1Input = z.infer<typeof checkoutStep1Schema>;
export type AddToCartInput = z.infer<typeof addToCartSchema>;
export type InquiryInput = z.infer<typeof inquirySchema>;
export type LabInventoryInput = z.infer<typeof labInventorySchema>;
export type SearchInput = z.infer<typeof searchSchema>;
export type QuoteRequestInput = z.infer<typeof quoteRequestSchema>;
export type CancelReturnInput = z.infer<typeof cancelReturnSchema>;
export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;
export type ApiKeyCreateInput = z.infer<typeof apiKeyCreateSchema>;
export type ExperimentInput = z.infer<typeof experimentSchema>;
export type ProtocolInput = z.infer<typeof protocolSchema>;
export type UsageRecordInput = z.infer<typeof usageRecordSchema>;
