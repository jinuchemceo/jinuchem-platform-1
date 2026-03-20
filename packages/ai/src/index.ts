// ================================================================
// JINUCHEM AI 엔진 — 통합 내보내기
// ================================================================

export { callClaude, callClaudeJSON } from './claude';

// 추천 엔진
export { generateRecommendations, getCachedRecommendations } from './recommend';

// 예측 엔진
export { predictConsumption, predictBudget, predictReorder } from './predict';

// 분석 엔진
export { analyzePattern, analyzeTrend, analyzeSeasonality } from './analyze';

// 지식 그래프
export { getKnowledgeNode, checkCompatibility, findAlternatives } from './knowledge';
