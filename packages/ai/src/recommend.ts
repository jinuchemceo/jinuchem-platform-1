// ================================================================
// AI 시약 추천 엔진 — 구매 이력 + 제품 속성 기반
// ================================================================

import { callClaudeJSON } from './claude';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface RecommendationInput {
  userId: string;
  context?: {
    currentCart?: string[];     // 현재 장바구니 제품 ID
    recentSearches?: string[];  // 최근 검색어
    labField?: string;          // 연구 분야 (유기, 무기, 생화학 등)
  };
  limit?: number;
}

interface RecommendationOutput {
  recommendations: {
    productId: string;
    productName: string;
    casNumber: string;
    score: number;
    reason: string;
  }[];
  alternatives: {
    originalProductId: string;
    originalName: string;
    alternativeProductId: string;
    alternativeName: string;
    reason: string;
  }[];
}

const SYSTEM_PROMPT = `당신은 연구기관의 시약 구매를 돕는 전문 AI 어시스턴트입니다.

역할:
1. 연구원의 구매 이력과 실험 분야를 분석하여 필요한 시약을 추천합니다.
2. 현재 장바구니의 시약과 함께 자주 사용되는 시약을 제안합니다.
3. 더 경제적이거나 품질이 좋은 대체 시약을 제안합니다.

응답 규칙:
- 추천 점수(score)는 0.0~1.0 사이로 설정
- 추천 사유(reason)는 한국어로 간결하게 작성
- 대체 시약은 동일 CAS 번호 또는 유사 용도의 제품만 제안
- JSON 형식으로만 응답`;

/**
 * 시약 추천 생성
 */
export async function generateRecommendations(
  input: RecommendationInput
): Promise<RecommendationOutput> {
  // 1. 사용자 구매 이력 조회
  const orderHistory = await prisma.orderItem.findMany({
    where: { order: { userId: input.userId } },
    include: { product: { include: { reagentDetail: true } } },
    orderBy: { order: { orderedAt: 'desc' } },
    take: 20,
  });

  // 2. 전체 제품 카탈로그 (추천 후보)
  const allProducts = await prisma.product.findMany({
    where: { productType: 'reagent', isActive: true },
    include: { reagentDetail: true, supplier: true, variants: { where: { isActive: true } } },
    take: 50,
  });

  // 3. Claude에게 추천 요청
  const userMessage = `
## 사용자 구매 이력
${orderHistory.map((item) => `- ${item.productName} (CAS: ${item.product.reagentDetail?.casNumber || 'N/A'}) x${item.quantity}`).join('\n') || '구매 이력 없음'}

## 현재 장바구니
${input.context?.currentCart?.join(', ') || '비어있음'}

## 최근 검색어
${input.context?.recentSearches?.join(', ') || '없음'}

## 연구 분야
${input.context?.labField || '일반 화학'}

## 추천 후보 제품 카탈로그
${allProducts.map((p) => `- ID:${p.id} | ${p.name} | CAS:${p.reagentDetail?.casNumber} | ${p.reagentDetail?.grade} | ${p.supplier.name} | ${p.variants[0]?.listPrice ?? 0}원`).join('\n')}

위 정보를 바탕으로:
1. 추천 시약 ${input.limit || 5}개를 score 내림차순으로 제안
2. 구매 이력의 시약 중 대체 가능한 것이 있으면 alternatives로 제안

JSON 형식: { "recommendations": [...], "alternatives": [...] }`;

  const result = await callClaudeJSON<RecommendationOutput>(SYSTEM_PROMPT, userMessage);

  // 4. DB에 추천 결과 캐싱
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 1); // 1일 후 만료

  for (const rec of result.recommendations) {
    await prisma.aiRecommendation.create({
      data: {
        userId: input.userId,
        productId: rec.productId,
        score: rec.score,
        reason: rec.reason,
        modelVersion: 'recommend-v1',
        expiresAt,
      },
    }).catch(() => {}); // 중복 무시
  }

  return result;
}

/**
 * 캐싱된 추천 조회 (유효한 것만)
 */
export async function getCachedRecommendations(userId: string) {
  return prisma.aiRecommendation.findMany({
    where: { userId, expiresAt: { gt: new Date() } },
    include: { product: { include: { reagentDetail: true, supplier: true, variants: true } } },
    orderBy: { score: 'desc' },
    take: 10,
  });
}
