// ================================================================
// AI 예측 엔진 — 소모량/예산/재주문 시점 예측
// ================================================================

import { callClaudeJSON } from './claude';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface ConsumptionPrediction {
  productId: string;
  productName: string;
  currentStock: number;
  unit: string;
  avgMonthlyUsage: number;
  predictedDepletionDate: string;
  confidence: number;
}

interface BudgetPrediction {
  month: string;
  predictedSpend: number;
  reagentSpend: number;
  supplySpend: number;
  budgetRemaining: number;
  confidence: number;
}

interface ReorderPrediction {
  productId: string;
  productName: string;
  recommendedOrderDate: string;
  recommendedQuantity: number;
  reason: string;
  confidence: number;
}

interface PredictionOutput {
  type: 'consumption' | 'budget' | 'reorder';
  predictions: ConsumptionPrediction[] | BudgetPrediction[] | ReorderPrediction[];
}

const SYSTEM_PROMPT = `당신은 연구기관의 시약 소비 패턴을 분석하는 AI 전문가입니다.

역할:
1. 과거 주문/사용 데이터를 분석하여 소모량을 예측합니다.
2. 월별/분기별 예산 소진을 예측합니다.
3. 최적의 재주문 시점과 수량을 제안합니다.

예측 규칙:
- confidence는 0.0~1.0 사이 (데이터가 충분하면 높게)
- 날짜는 YYYY-MM-DD 형식
- 금액은 원(KRW) 단위 정수
- 한국어로 간결하게 설명
- JSON 형식으로만 응답`;

/**
 * 소모량 예측 생성
 */
export async function predictConsumption(userId: string): Promise<ConsumptionPrediction[]> {
  // 사용 기록 + 재고 조회
  const inventory = await prisma.labInventory.findMany({
    where: { userId },
    include: { product: true },
  });

  const usageRecords = await prisma.usageRecord.findMany({
    where: { userId },
    orderBy: { timestamp: 'desc' },
    take: 50,
    include: { product: true },
  });

  const orderHistory = await prisma.orderItem.findMany({
    where: { order: { userId } },
    orderBy: { order: { orderedAt: 'desc' } },
    take: 30,
    include: { product: true },
  });

  const userMessage = `
## 현재 시약장 재고
${inventory.map((i) => `- ${i.name} (CAS: ${i.casNumber || 'N/A'}): ${i.currentQty} ${i.unit} | 최소재고: ${i.minStock || 'N/A'} | 만료: ${i.expiryDate?.toISOString().split('T')[0] || 'N/A'}`).join('\n') || '재고 없음'}

## 최근 사용 기록
${usageRecords.map((u) => `- ${u.timestamp.toISOString().split('T')[0]}: ${u.product.name} ${u.quantityUsed} ${u.unit}`).join('\n') || '사용 기록 없음'}

## 최근 주문 이력
${orderHistory.map((o) => `- ${o.productName}: ${o.quantity}개 (${o.size})`).join('\n') || '주문 이력 없음'}

현재 재고의 각 시약에 대해 소모량 예측을 해주세요.
JSON: { "predictions": [{ "productId", "productName", "currentStock", "unit", "avgMonthlyUsage", "predictedDepletionDate", "confidence" }] }`;

  const result = await callClaudeJSON<{ predictions: ConsumptionPrediction[] }>(SYSTEM_PROMPT, userMessage);

  // DB 캐싱
  await prisma.aiPrediction.create({
    data: {
      userId,
      predictionType: 'consumption',
      data: result.predictions as unknown as Record<string, unknown>,
      confidence: result.predictions.reduce((sum, p) => sum + p.confidence, 0) / (result.predictions.length || 1),
      modelVersion: 'predict-v1',
    },
  });

  return result.predictions;
}

/**
 * 예산 예측 생성
 */
export async function predictBudget(userId: string, orgId: string): Promise<BudgetPrediction[]> {
  const budget = await prisma.budget.findFirst({
    where: { orgId, year: new Date().getFullYear() },
  });

  const orders = await prisma.order.findMany({
    where: { userId, orderedAt: { gte: new Date(new Date().getFullYear(), 0, 1) } },
    orderBy: { orderedAt: 'asc' },
  });

  const userMessage = `
## 연간 예산
총 예산: ${budget?.totalBudget || 0}원 | 시약: ${budget?.reagentBudget || 0}원 | 소모품: ${budget?.supplyBudget || 0}원
현재 집행: ${budget?.spentAmount || 0}원

## 올해 월별 주문 금액
${orders.map((o) => `- ${o.orderedAt.toISOString().split('T')[0]}: ${o.totalAmount}원`).join('\n') || '주문 없음'}

남은 월(${12 - new Date().getMonth()}개월)의 예산 소진을 예측해주세요.
JSON: { "predictions": [{ "month": "YYYY-MM", "predictedSpend", "reagentSpend", "supplySpend", "budgetRemaining", "confidence" }] }`;

  const result = await callClaudeJSON<{ predictions: BudgetPrediction[] }>(SYSTEM_PROMPT, userMessage);

  await prisma.aiPrediction.create({
    data: {
      userId,
      predictionType: 'budget',
      data: result.predictions as unknown as Record<string, unknown>,
      confidence: 0.75,
      modelVersion: 'predict-v1',
    },
  });

  return result.predictions;
}

/**
 * 재주문 시점 예측
 */
export async function predictReorder(userId: string): Promise<ReorderPrediction[]> {
  const inventory = await prisma.labInventory.findMany({
    where: { userId, status: { in: ['low', 'normal'] } },
  });

  const userMessage = `
## 현재 재고
${inventory.map((i) => `- ${i.name}: ${i.currentQty} ${i.unit} (최소재고: ${i.minStock || 'N/A'})`).join('\n')}

각 시약의 최적 재주문 시점과 추천 수량을 제안해주세요.
JSON: { "predictions": [{ "productId", "productName", "recommendedOrderDate", "recommendedQuantity", "reason", "confidence" }] }`;

  const result = await callClaudeJSON<{ predictions: ReorderPrediction[] }>(SYSTEM_PROMPT, userMessage);

  await prisma.aiPrediction.create({
    data: {
      userId,
      predictionType: 'reorder',
      data: result.predictions as unknown as Record<string, unknown>,
      confidence: 0.7,
      modelVersion: 'predict-v1',
    },
  });

  return result.predictions;
}
