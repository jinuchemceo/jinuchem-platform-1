// ================================================================
// 화학 지식 그래프 엔진 — 시약 관계, 호환성, 대체품
// ================================================================

import { callClaudeJSON } from './claude';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface ChemRelation {
  type: 'alternative' | 'reactant' | 'product' | 'solvent_compat' | 'incompatible' | 'precursor';
  targetCas: string;
  targetName: string;
  reason: string;
}

interface ChemProperties {
  boilingPoint?: string;
  meltingPoint?: string;
  density?: string;
  ph?: string;
  molecularWeight?: number;
  formula?: string;
  hazardClass?: string;
  storageConditions?: string;
}

interface KnowledgeGraphNode {
  casNumber: string;
  name: string;
  relations: ChemRelation[];
  properties: ChemProperties;
}

const SYSTEM_PROMPT = `당신은 화학 전문가이자 시약 안전 관리 전문가입니다.

역할:
1. 시약 간의 화학적 관계를 정의합니다 (대체품, 반응물/생성물, 용매 호환, 비호환)
2. 시약의 물성 정보를 제공합니다 (끓는점, 녹는점, 밀도, pH 등)
3. 안전한 보관 조건과 비호환 물질을 식별합니다

관계 유형:
- alternative: 대체 가능한 시약 (유사 용도/순도)
- reactant: 반응에 사용되는 시약
- product: 반응의 생성물
- solvent_compat: 용매로 호환되는 시약
- incompatible: 함께 보관/사용 불가 (위험)
- precursor: 전구체 관계

규칙:
- 정확한 CAS 번호 사용
- 한국어로 설명
- JSON 형식으로만 응답`;

/**
 * CAS 번호로 지식 그래프 노드 생성/조회
 */
export async function getKnowledgeNode(casNumber: string): Promise<KnowledgeGraphNode> {
  // 캐시 확인
  const cached = await prisma.chemKnowledge.findUnique({
    where: { casNumber },
  });

  if (cached) {
    return {
      casNumber: cached.casNumber,
      name: cached.name,
      relations: cached.relations as unknown as ChemRelation[],
      properties: cached.properties as unknown as ChemProperties,
    };
  }

  // 제품 DB에서 기본 정보 조회
  const product = await prisma.reagentDetail.findFirst({
    where: { casNumber },
    include: { product: { include: { supplier: true } } },
  });

  // Claude에게 지식 그래프 생성 요청
  const userMessage = `
CAS 번호: ${casNumber}
${product ? `제품명: ${product.product.name}
분자식: ${product.formula}
분자량: ${product.molWeight}
등급: ${product.grade}
위험 분류: ${JSON.stringify(product.ghsPictograms)}` : '제품 정보 없음'}

이 화학물질의 지식 그래프 노드를 생성해주세요:
1. 관계(relations): 대체품, 반응 관계, 용매 호환성, 비호환 물질 (각 최대 3개)
2. 물성(properties): 끓는점, 녹는점, 밀도, pH, 보관 조건

JSON: { "casNumber": "${casNumber}", "name": "...", "relations": [...], "properties": {...} }`;

  const node = await callClaudeJSON<KnowledgeGraphNode>(SYSTEM_PROMPT, userMessage, { maxTokens: 2048 });

  // DB에 캐싱
  await prisma.chemKnowledge.upsert({
    where: { casNumber },
    update: {
      name: node.name,
      relations: node.relations as unknown as Record<string, unknown>,
      properties: node.properties as unknown as Record<string, unknown>,
      source: 'claude-ai',
    },
    create: {
      casNumber,
      name: node.name,
      relations: node.relations as unknown as Record<string, unknown>,
      properties: node.properties as unknown as Record<string, unknown>,
      source: 'claude-ai',
    },
  });

  return node;
}

/**
 * 두 시약 간 호환성 확인
 */
export async function checkCompatibility(cas1: string, cas2: string): Promise<{
  compatible: boolean;
  reason: string;
  warnings: string[];
}> {
  const userMessage = `
시약 1: CAS ${cas1}
시약 2: CAS ${cas2}

이 두 시약을 함께 보관하거나 사용해도 안전한지 평가해주세요.

JSON: { "compatible": true/false, "reason": "...", "warnings": ["...", "..."] }`;

  return callClaudeJSON(SYSTEM_PROMPT, userMessage);
}

/**
 * 대체 시약 검색
 */
export async function findAlternatives(casNumber: string): Promise<{
  alternatives: { casNumber: string; name: string; reason: string; priceComparison: string }[];
}> {
  const node = await getKnowledgeNode(casNumber);
  const alternatives = node.relations.filter((r) => r.type === 'alternative');

  if (alternatives.length > 0) {
    return {
      alternatives: alternatives.map((a) => ({
        casNumber: a.targetCas,
        name: a.targetName,
        reason: a.reason,
        priceComparison: '가격 비교 정보 없음',
      })),
    };
  }

  // 캐시에 없으면 Claude에게 요청
  const userMessage = `
CAS 번호: ${casNumber} (${node.name})

이 시약의 대체품을 3~5개 추천해주세요. 각각에 대해:
- CAS 번호
- 이름
- 대체 가능한 이유
- 가격 비교 (일반적인 상대 가격)

JSON: { "alternatives": [{ "casNumber", "name", "reason", "priceComparison" }] }`;

  return callClaudeJSON(SYSTEM_PROMPT, userMessage);
}
