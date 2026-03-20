// ================================================================
// AI 분석 엔진 — 구매 패턴, 트렌드, 계절성 분석 리포트
// ================================================================

import { callClaudeJSON } from './claude';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface AnalysisReport {
  reportType: 'pattern' | 'trend' | 'seasonality';
  summary: string;
  insights: {
    title: string;
    description: string;
    data?: Record<string, unknown>;
  }[];
  recommendations: string[];
}

const SYSTEM_PROMPT = `당신은 연구기관의 시약 구매 데이터를 분석하는 전문 AI 분석가입니다.

역할:
1. 구매 패턴 분석: 카테고리별, 공급사별, 시간대별 구매 패턴
2. 트렌드 분석: 인기 시약, 성장 카테고리, 가격 변동 추세
3. 계절성 분석: 연간 주기 패턴 (학기, 방학, 연말 등)

분석 규칙:
- 데이터 기반 인사이트를 한국어로 명확하게 제공
- 구체적인 수치와 비율 포함
- 실행 가능한 권고사항 제시
- JSON 형식으로만 응답`;

/**
 * 구매 패턴 분석
 */
export async function analyzePattern(orgId: string, periodMonths: number = 3): Promise<AnalysisReport> {
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - periodMonths);

  const orders = await prisma.order.findMany({
    where: { orgId, orderedAt: { gte: startDate }, status: { not: 'cancelled' } },
    include: { items: { include: { product: { include: { category: true, supplier: true } } } } },
  });

  const searchLogs = await prisma.searchLog.findMany({
    where: { timestamp: { gte: startDate } },
    take: 100,
  });

  const userMessage = `
## 기간: 최근 ${periodMonths}개월
## 총 주문: ${orders.length}건

## 주문 상세
${orders.map((o) => `- ${o.orderedAt.toISOString().split('T')[0]}: ${o.totalAmount}원 (${o.items.length}개 품목)
  품목: ${o.items.map((i) => `${i.productName}(${i.product.category?.name || '미분류'}/${i.product.supplier.name})`).join(', ')}`).join('\n') || '주문 없음'}

## 검색 로그 (최근 100건)
${searchLogs.map((s) => `- "${s.query}" (${s.searchType}, 결과 ${s.resultsCount}건)`).join('\n') || '검색 없음'}

구매 패턴을 분석해주세요:
1. 카테고리별 구매 비중
2. 공급사별 구매 비중
3. 시간대별 패턴 (요일, 시간)
4. 자주 함께 구매하는 시약 조합

JSON: { "reportType": "pattern", "summary": "...", "insights": [...], "recommendations": [...] }`;

  const report = await callClaudeJSON<AnalysisReport>(SYSTEM_PROMPT, userMessage, { maxTokens: 4096 });

  // DB 저장
  await prisma.aiAnalytics.create({
    data: {
      orgId,
      reportType: 'pattern',
      data: report as unknown as Record<string, unknown>,
      periodStart: startDate,
      periodEnd: new Date(),
    },
  });

  return report;
}

/**
 * 트렌드 분석
 */
export async function analyzeTrend(orgId: string): Promise<AnalysisReport> {
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const priceHistory = await prisma.priceHistory.findMany({
    where: { recordedAt: { gte: sixMonthsAgo } },
    include: { product: true },
    orderBy: { recordedAt: 'asc' },
    take: 200,
  });

  const orders = await prisma.order.findMany({
    where: { orgId, orderedAt: { gte: sixMonthsAgo } },
    include: { items: { include: { product: { include: { category: true } } } } },
  });

  const userMessage = `
## 가격 변동 이력 (6개월)
${priceHistory.map((p) => `- ${p.recordedAt.toISOString().split('T')[0]}: ${p.product.name} 정가=${p.listPrice}원 할인가=${p.salePrice || 'N/A'}원`).join('\n') || '이력 없음'}

## 주문 추이
${orders.map((o) => `- ${o.orderedAt.toISOString().split('T')[0]}: ${o.totalAmount}원`).join('\n') || '주문 없음'}

트렌드를 분석해주세요:
1. 가격 변동 추세 (상승/하락/안정)
2. 인기 상승 시약
3. 주문량 추세
4. 카테고리별 성장률

JSON: { "reportType": "trend", "summary": "...", "insights": [...], "recommendations": [...] }`;

  const report = await callClaudeJSON<AnalysisReport>(SYSTEM_PROMPT, userMessage, { maxTokens: 4096 });

  await prisma.aiAnalytics.create({
    data: {
      orgId,
      reportType: 'trend',
      data: report as unknown as Record<string, unknown>,
      periodStart: sixMonthsAgo,
      periodEnd: new Date(),
    },
  });

  return report;
}

/**
 * 계절성 분석
 */
export async function analyzeSeasonality(orgId: string): Promise<AnalysisReport> {
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

  const orders = await prisma.order.findMany({
    where: { orgId, orderedAt: { gte: oneYearAgo } },
    orderBy: { orderedAt: 'asc' },
  });

  const userMessage = `
## 연간 주문 데이터
${orders.map((o) => `- ${o.orderedAt.toISOString().split('T')[0]}: ${o.totalAmount}원`).join('\n') || '주문 없음'}

계절성을 분석해주세요:
1. 월별 주문량/금액 패턴
2. 학기 시작(3월/9월) vs 방학(7-8월/1-2월) 비교
3. 연말 예산 소진 패턴
4. 계절별 추천 구매 시기

JSON: { "reportType": "seasonality", "summary": "...", "insights": [...], "recommendations": [...] }`;

  const report = await callClaudeJSON<AnalysisReport>(SYSTEM_PROMPT, userMessage, { maxTokens: 4096 });

  await prisma.aiAnalytics.create({
    data: {
      orgId,
      reportType: 'seasonality',
      data: report as unknown as Record<string, unknown>,
      periodStart: oneYearAgo,
      periodEnd: new Date(),
    },
  });

  return report;
}
