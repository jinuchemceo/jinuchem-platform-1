# JINUCHEM 통합 플랫폼 — 프로덕션 전환 계획

## Context

현재 JINU Shop 프로토타입(21개 페이지)이 완성된 상태.
디지털혁신챌린지 사업의 일환으로, **4개 플랫폼으로 구성된 연구 생태계**를 구축한다.
JINU Shop은 **모객 창구이자 생태계 허브** 역할을 한다.

**핵심 비전:** 시약 구매(커머스) → 실험 기록(E-Note) → 시약 관리(시약장) →
데이터 수집 → AI 2차 데이터 생산 → 외부 API 개방 → **연구 데이터 플랫폼**

---

## 4개 플랫폼 생태계

```
┌─────────────────────────────────────────────────────────┐
│                  JINUCHEM 통합 인증 (SSO)                  │
│              계정 · 조직 · 역할 · 구독 통합 관리              │
└────┬──────────┬──────────────┬──────────────┬───────────┘
     │          │              │              │
┌────▼────┐ ┌──▼──────┐ ┌────▼─────┐ ┌──────▼──────┐
│ ① JINU  │ │ ② JINU  │ │ ③ 공급사  │ │ ④ 관리자    │
│  Shop   │ │ E-Note  │ │   포털   │ │  플랫폼     │
│ (커머스) │ │ (전자노트)│ │(Supplier)│ │  (Admin)   │
│         │ │         │ │          │ │            │
│ 모객창구 │ │ 실험기록 │ │ 견적/재고 │ │ 전체 운영   │
│ 생태계   │ │ 시약사용 │ │ 주문관리  │ │ AI 모니터링 │
│  허브   │ │ 프로토콜 │ │ 가격관리  │ │ API 관리   │
└────┬────┘ └──┬──────┘ └────┬─────┘ └──────┬──────┘
     │         │             │              │
┌────▼─────────▼─────────────▼──────────────▼──────┐
│              공유 데이터 레이어 (Shared DB)          │
│   거래데이터 · 제품DB · 사용이력 · 검색로그 · 가격이력   │
├──────────────────────────────────────────────────┤
│              AI 엔진 레이어                        │
│   추천 · 예측 · 분석 · 지식그래프 (Claude API)       │
├──────────────────────────────────────────────────┤
│              외부 API 레이어 (v1)                   │
│   제품 · 화학물질 · 가격 · 추천 · 분석 · 지식그래프    │
└──────────────────────────────────────────────────┘
```

### 플랫폼별 역할

| # | 플랫폼 | 사용자 | 핵심 역할 | 데이터 생산 |
|---|--------|--------|----------|-----------|
| 1 | **JINU Shop** | 연구원, 조직관리자 | 모객 + 구매 + 생태계 진입점 | 거래, 검색, 가격, 행동 |
| 2 | **JINU E-Note** | 연구원 | 실험 기록 + 시약 사용 추적 | 프로토콜, 사용량, 실험이력 |
| 3 | **공급사 포털** | 공급사 담당자 | 견적 응답 + 재고/가격 관리 | 공급 데이터, 가격 변동 |
| 4 | **관리자 플랫폼** | 시스템관리자 | 전체 운영 + AI + API 관리 | 운영 메트릭, AI 결과 |

### 플랫폼 간 데이터 흐름

```
연구원이 E-Note에서 프로토콜 작성
  → 시약 목록이 JINU Shop에 자동 전달
  → 시약장 대조 → 부족분만 장바구니 추가
  → 조직관리자가 승인
  → 공급사 포털에서 견적/주문 처리
  → 배송 완료 → 시약장 자동 입고
  → E-Note에서 시약 사용 → 시약장 자동 차감
  → 모든 단계의 데이터 → AI 엔진 → 2차 데이터 → 외부 API
```

---

## 확정 기술 스택

| 영역 | 기술 | 선정 이유 |
|------|------|---------|
| 모노레포 | Turborepo | 4개 앱 + 공유 패키지 통합 관리 |
| 프레임워크 | Next.js 15 (App Router) + React 19 + TS | SSR + API Routes 통합 |
| DB | PostgreSQL (Supabase) + Prisma ORM | 관계형 + JSON 필드 유연성 |
| 인증 | Supabase Auth + API Key 시스템 | 사용자 인증 + 외부 API 인증 분리 |
| 파일 저장 | Supabase Storage | SDS/COA 문서, CSV 등 |
| 상태관리 | Zustand | 경량, 카트/비교/테마 |
| 스타일 | Tailwind CSS 4 | 프로토타입 CSS 변수 매핑 용이 |
| AI/ML | Claude API (Anthropic) + Python 마이크로서비스 | 추천, 분석, 지식그래프 |
| API 계층 | tRPC (내부) + REST/GraphQL (외부) | 타입 안전 내부 + 표준 외부 API |
| API 문서 | Swagger/OpenAPI 자동 생성 | 외부 개발자 셀프서비스 |
| 큐/파이프라인 | Supabase Edge Functions + Cron | AI 배치 작업, 데이터 파이프라인 |
| 캐싱 | Vercel KV (Redis) | API 응답 캐싱, Rate Limit |
| 폼/검증 | react-hook-form + Zod |
| 아이콘 | lucide-react |
| PDF | jspdf + jspdf-autotable |
| CSV | papaparse (import), xlsx (export) |
| 배포 | Vercel (자동 배포) + Supabase |
| 테스트 | Vitest (단위) + Playwright (E2E) |
| CI/CD | GitHub Actions |

---

## 모노레포 구조 (4개 플랫폼 + 공유 레이어)

```
jinuchem-platform/                  # Turborepo 모노레포
├── apps/
│   ├── shop/                       # ① JINU Shop (모객 + 생태계 허브)
│   │   └── src/app/
│   │       ├── (auth)/             # 통합 SSO 로그인
│   │       ├── (main)/             # 커머스 21개 페이지
│   │       └── api/internal/       # Shop 전용 내부 API
│   │
│   ├── enote/                      # ② JINU E-Note (전자노트)
│   │   └── src/app/
│   │       ├── (auth)/             # SSO 연동
│   │       ├── experiments/        # 실험 기록
│   │       ├── protocols/          # 프로토콜 관리
│   │       ├── lab-inventory/      # 시약장 (E-Note 측)
│   │       └── api/internal/       # E-Note 전용 API
│   │
│   ├── supplier/                   # ③ 공급사 포털
│   │   └── src/app/
│   │       ├── (auth)/             # 공급사 로그인
│   │       ├── dashboard/          # 공급사 대시보드
│   │       ├── quotes/             # 견적 응답
│   │       ├── orders/             # 주문 처리
│   │       ├── products/           # 제품/가격/재고 관리
│   │       └── api/internal/       # 공급사 전용 API
│   │
│   ├── admin/                      # ④ 관리자 플랫폼
│   │   └── src/app/
│   │       ├── (auth)/             # 관리자 로그인
│   │       ├── dashboard/          # 운영 대시보드
│   │       ├── products/           # 전체 제품 관리
│   │       ├── users/              # 사용자/조직 관리
│   │       ├── ai-monitor/         # AI 모델 모니터링
│   │       ├── api-management/     # 외부 API 관리
│   │       ├── data-pipeline/      # 데이터 파이프라인 상태
│   │       └── api/internal/       # 관리자 전용 API
│   │
│   └── developer/                  # 외부 개발자 포털
│       └── src/app/
│           ├── docs/               # API 문서 (Swagger)
│           ├── keys/               # API Key 발급/관리
│           └── usage/              # 사용량 모니터링
│
├── packages/                       # ★ 공유 패키지 (모든 앱에서 import)
│   ├── database/                   # Prisma 스키마 + 클라이언트 (단일 DB)
│   │   ├── prisma/schema.prisma    # 37+ 모델 (커머스 + ELN + 공급사 + AI)
│   │   └── src/client.ts
│   ├── auth/                       # 통합 인증 (SSO)
│   │   ├── src/supabase.ts         # Supabase Auth
│   │   ├── src/api-key.ts          # 외부 API Key 검증
│   │   └── src/roles.ts            # 역할 기반 접근 제어
│   ├── ui/                         # 공유 UI 컴포넌트
│   │   ├── Button, Modal, Toast, Badge, Card, Pagination...
│   │   └── theme/                  # 통합 디자인 시스템
│   ├── ai/                         # AI 서비스 레이어
│   │   ├── src/claude.ts           # Claude API 클라이언트
│   │   ├── src/recommend.ts        # 추천 엔진
│   │   ├── src/predict.ts          # 예측 엔진
│   │   ├── src/analyze.ts          # 분석 엔진
│   │   └── src/knowledge.ts        # 지식 그래프
│   ├── api/                        # 외부 API 인프라
│   │   ├── src/v1/                 # REST API v1 핸들러
│   │   ├── src/auth.ts             # API Key 검증 미들웨어
│   │   ├── src/rateLimit.ts        # Rate Limiting
│   │   └── src/openapi.ts          # Swagger 자동 생성
│   ├── data/                       # 데이터 파이프라인
│   │   ├── src/collector.ts        # 이벤트 수집
│   │   ├── src/transformer.ts      # 2차 데이터 변환
│   │   └── src/aggregator.ts       # 통계 집계
│   └── shared/                     # 공통 유틸리티
│       ├── src/utils.ts            # 통화, 날짜, CAS 패턴
│       ├── src/constants.ts        # Enum, 한글 레이블
│       ├── src/validators.ts       # Zod 스키마
│       └── src/types/              # 공유 TypeScript 타입
│
├── supabase/functions/             # Edge Functions (크론, 배치)
│   ├── ai-batch-recommend/
│   ├── ai-batch-predict/
│   ├── data-aggregate/
│   └── supplier-sync/
│
├── turbo.json                      # Turborepo 설정
├── package.json                    # 루트 워크스페이스
└── .github/workflows/ci.yml
```

### 왜 모노레포인가?

| 장점 | 설명 |
|------|------|
| **단일 DB** | 4개 앱이 하나의 Prisma 스키마 공유 → 데이터 일관성 |
| **SSO 통합** | `packages/auth`를 모든 앱에서 import → 한 번 로그인으로 전체 접근 |
| **UI 일관성** | `packages/ui`로 디자인 시스템 통일 |
| **AI 공유** | `packages/ai`를 Shop/E-Note/Admin에서 동일하게 사용 |
| **독립 배포** | 각 앱은 별도 Vercel 프로젝트로 독립 배포 |
| **코드 재사용** | validators, utils, types를 한 곳에서 관리 |

---

## 추가 DB 모델 (데이터 플랫폼 전용)

기존 ERD.md 27+ 테이블에 아래 **10개 테이블** 추가:

```
★ API 플랫폼
├── ApiKey           — API Key 발급/관리 (org_id, key_hash, tier, rate_limit, scopes)
├── ApiUsageLog      — API 호출 로그 (key_id, endpoint, method, status, latency, timestamp)
└── ApiRateLimit     — 티어별 사용량 제한 (tier, daily_limit, monthly_limit, burst_limit)

★ AI 2차 데이터
├── AiRecommendation — AI 시약 추천 (user_id, product_id, score, reason, model_version)
├── AiPrediction     — AI 예측 (user_id, type[consumption/budget/reorder], data JSON, confidence)
├── AiAnalytics      — AI 분석 리포트 (org_id, report_type, data JSON, period, generated_at)
└── ChemKnowledge    — 화학 지식 그래프 노드 (cas, relations JSON, properties JSON, source)

★ 데이터 수집
├── DataEvent        — 모든 사용자 이벤트 (user_id, event_type, payload JSON, timestamp)
├── PriceHistory     — 가격 이력 추적 (product_id, variant_id, price, recorded_at)
└── SearchLog        — 검색 로그 (user_id, query, results_count, clicked_product_id)
```

**설계 원칙:**
- 모든 JSON 필드는 PostgreSQL JSONB → 자유로운 필드 확장
- DataEvent로 모든 행동 데이터 수집 → AI 학습 소스
- PriceHistory로 가격 변동 추적 → 가격 분석 API 제공
- SearchLog로 검색 패턴 분석 → 자동완성/추천 개선

---

## 16주 로드맵 (4개 플랫폼 순차 구축)

### Phase 1: 기반 + 공유 레이어 (1~2주차)

**1주차 — 모노레포 + DB + 공유 패키지**
- Turborepo 모노레포 초기화 (apps/ + packages/)
- `packages/database` — Prisma 스키마 37+ 모델 (커머스 27 + ELN 5 + 데이터 플랫폼 10)
  - 모든 주요 엔티티에 JSONB `metadata` 필드 (향후 확장)
  - ELN용 추가 테이블: Experiment, Protocol, ProtocolReagent, ExperimentLog, UsageRecord
- `packages/shared` — utils, constants, validators, types
- `packages/data` — DataEvent 수집 미들웨어 (전 앱 공통)
- Seed: 시약 12개, 소모품 18개, FAQ, 샘플 사용자/조직

**2주차 — 통합 인증(SSO) + 공유 UI**
- `packages/auth` — Supabase Auth + SSO 래퍼
  - 한 번 로그인 → Shop/E-Note/공급사포털/관리자 전체 접근
  - 역할별 앱 접근 제어 (연구원→Shop+E-Note, 공급사→공급사포털, 관리자→전체)
  - API Key 시스템 (외부 API용)
- `packages/ui` — 공유 디자인 시스템 (Button 38px, Modal, Toast, Badge 등)
- 각 앱의 Next.js 프로젝트 초기 생성 (shell만)

---

### Phase 2: JINU Shop 커머스 (3~6주차) — **모객 창구**

**3주차 — 카탈로그 + 검색**
- `apps/shop` — 시약/소모품 카탈로그, 검색 자동완성(200ms)
- SearchLog, DataEvent 자동 수집 시작
- 외부 API v1 첫 엔드포인트: `GET /api/v1/products`, `GET /api/v1/chemicals/{cas}`

**4주차 — 상세 + 주문 시작**
- 시약/소모품 상세 페이지, VariantTable, GHS, 문서 다운로드
- 구조식 검색, 비교, 최근 본 상품
- 장바구니 + 2단계 체크아웃
- PriceHistory 수집

**5주차 — 주문 관리 + 고급**
- 주문 내역, 상세, 취소/반품, XLS/CSV 내보내기
- 결제 승인 워크플로우 (조직관리자)
- 빠른 주문 (CSV 업로드, 프로토콜 파싱)
- 대시보드 전체 위젯

**6주차 — 마무리 + 고객센터**
- 증빙서류 PDF, 즐겨찾기, 내 시약장
- 채팅, 고객센터 홈, FAQ, 1:1 문의, 마이페이지
- **Shop 독립 배포 가능** (Vercel)

---

### Phase 3: 공급사 포털 (7~8주차) — **공급 생태계**

**7주차 — 공급사 대시보드**
- `apps/supplier` — 공급사 전용 앱
- 공급사 대시보드: 주문 현황, 매출 통계, 재고 알림
- 견적 관리: 견적 요청 수신 → 가격 입력 → 견적 발송
- 주문 처리: 주문 접수 → 출고 → 배송 상태 업데이트

**8주차 — 제품/가격/재고 관리**
- 제품 등록/수정 (폼 + CSV 일괄 업로드)
- 가격 관리 (포장단위별, 할인가, 유효기간)
- 재고 관리 (실시간 수량, 당일출고 설정, 마감시간)
- **공급사 데이터 → PriceHistory 자동 기록**
- 가격 API: `GET /api/v1/pricing/{product_id}`, `GET /api/v1/pricing/compare`
- **공급사 포털 독립 배포**

---

### Phase 4: E-Note 전자노트 (9~12주차) — **연구 데이터 수집**

**9주차 — 실험 기록 기본**
- `apps/enote` — E-Note 앱
- 실험 기록 작성 (제목, 목적, 방법, 결과, 첨부파일)
- 프로토콜 관리 (템플릿 기반 실험 절차)
- 프로토콜 내 시약 목록 (CAS, 수량, 용량 입력)

**10주차 — Shop 연동 (핵심)**
- **프로토콜 → Shop 자동 주문 흐름:**
  - E-Note에서 "JINU Shop에서 주문" 버튼
  - 시약 목록 자동 매칭 (`POST /api/v1/protocol-order/match`)
  - 시약장 대조 → 보유/부족/미보유 분류
  - 부족분만 Shop 장바구니에 자동 추가
- **Webhook 연동:**
  - Shop → E-Note: `ORDER_DELIVERED` (입고 시 시약장 자동 업데이트)
  - E-Note → Shop: `EXPERIMENT_SAVED` (사용량 시약장 차감)

**11주차 — 시약 사용 추적**
- 실험 기록에서 시약 사용량 입력 → 시약장 자동 차감
- LOT번호 자동 조회 및 기록
- 시약 사용 이력 타임라인 (언제, 누가, 어떤 실험에서, 얼마나)
- UsageRecord → DataEvent 파이프라인 (AI 학습 데이터)

**12주차 — E-Note 마무리**
- 시약장 대시보드 (보유 현황, 만료 알림, 소비 추세)
- E-Note ↔ Shop 양방향 동기화 검증
- **E-Note 독립 배포**

---

### Phase 5: AI + 외부 API + 관리자 (13~14주차) — **데이터 플랫폼**

**13주차 — AI 엔진 + 외부 API**
- `packages/ai` — Claude API 기반 4개 엔진:
  - **추천**: 구매이력 + 프로토콜 → 시약 추천/대체 제안
  - **예측**: 소모량/예산/재주문 시점 예측
  - **분석**: 구매 패턴, 트렌드, 계절성, 공급사 경쟁력
  - **지식그래프**: 시약 간 관계 (반응/대체/호환/비호환)
- 외부 API 완성: recommend, analytics, knowledge 엔드포인트
- Edge Functions 배치: 매일 추천 갱신, 주간 예측, 통계 집계
- Rate Limiting: Free(100/일), Basic(10K/일), Pro(100K/일)

**14주차 — 관리자 플랫폼 + 개발자 포털**
- `apps/admin` — 관리자 플랫폼
  - 운영 대시보드 (전체 플랫폼 KPI: DAU, 거래량, GMV)
  - 사용자/조직 관리
  - 제품 DB 관리 (전체 공급사 통합)
  - AI 모니터링 (추천 정확도, 예측 신뢰도)
  - API 사용량 모니터링 (호출량, 인기 엔드포인트)
  - 데이터 파이프라인 상태 (배치 작업 로그)
- `apps/developer` — 개발자 포털
  - Swagger API 문서 자동 생성
  - API Key 발급/관리
  - 사용량 대시보드
  - 코드 샘플 (Python, JavaScript, cURL)

---

### Phase 6: 통합 테스트 + 런칭 (15~16주차)

**15주차 — 통합 테스트**
- **E2E 플로우 테스트:**
  - 연구원: E-Note 프로토콜 → Shop 자동 주문 → 승인 → 배송 → 시약장 입고
  - 공급사: 견적 요청 → 가격 입력 → 주문 접수 → 출고
  - 관리자: 전체 모니터링 + AI 리포트 확인
- 각 앱 간 SSO 동선 검증
- Webhook 양방향 동기화 검증
- 외부 API 인증/Rate Limit 검증

**16주차 — 배포 + 런칭**
- 4개 앱 Vercel 독립 배포 (shop.jinuchem.com, enote.jinuchem.com, supplier.jinuchem.com, admin.jinuchem.com)
- GitHub Actions CI/CD (모노레포 영향 범위 감지 → 변경된 앱만 배포)
- 성능: LCP 3초 이내, 검색 200ms 이내
- 에러 페이지, 로딩/빈 상태
- 운영 모니터링 설정

---

## 환경 변수

```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
DATABASE_URL=

# App
NEXT_PUBLIC_APP_URL=
NEXT_PUBLIC_STORAGE_BUCKET=product-docs

# AI (Phase 4+)
ANTHROPIC_API_KEY=                # Claude API
AI_MODEL=claude-sonnet-4-6       # 기본 AI 모델

# API Platform (Phase 5+)
API_KEY_SALT=                     # API Key 해싱용
VERCEL_KV_URL=                    # Rate Limiting 캐시
VERCEL_KV_REST_API_TOKEN=
```

---

## 외부 공개 API 엔드포인트 (v1)

| 엔드포인트 | 메서드 | 설명 | Phase |
|-----------|--------|------|-------|
| `/api/v1/products` | GET | 제품 목록 (필터, 페이지네이션) | 2 |
| `/api/v1/products/{id}` | GET | 제품 상세 | 2 |
| `/api/v1/chemicals/{cas}` | GET | CAS번호 기반 화학물질 정보 | 2 |
| `/api/v1/chemicals/search` | GET | 화학물질 검색 (이름, 분자식) | 2 |
| `/api/v1/pricing/{product_id}` | GET | 가격 이력 + 현재가 | 3 |
| `/api/v1/pricing/compare` | GET | 다수 제품 가격 비교 | 3 |
| `/api/v1/recommend` | POST | AI 시약 추천 (구매 맥락 기반) | 4 |
| `/api/v1/recommend/alternative/{cas}` | GET | 대체 시약 추천 | 4 |
| `/api/v1/analytics/trends` | GET | 시약 카테고리별 트렌드 | 5 |
| `/api/v1/analytics/report` | GET | AI 분석 리포트 | 5 |
| `/api/v1/knowledge/graph/{cas}` | GET | 화학 지식 그래프 | 5 |
| `/api/v1/knowledge/relations` | GET | 시약 간 관계 조회 | 5 |

**인증:** 모든 v1 엔드포인트는 `Authorization: Bearer {API_KEY}` 헤더 필수
**Rate Limit:** Free(100/일), Basic(10K/일), Pro(100K/일)

---

## 배포 구성 (Vercel 멀티 프로젝트)

| 앱 | 도메인 | Vercel 프로젝트 | 접근 권한 |
|----|--------|---------------|---------|
| JINU Shop | shop.jinuchem.com | jinuchem-shop | 연구원, 조직관리자 |
| E-Note | enote.jinuchem.com | jinuchem-enote | 연구원 |
| 공급사 포털 | supplier.jinuchem.com | jinuchem-supplier | 공급사 |
| 관리자 | admin.jinuchem.com | jinuchem-admin | 시스템관리자 |
| 개발자 포털 | dev.jinuchem.com | jinuchem-developer | 외부 개발자 |
| API | api.jinuchem.com | (Vercel Edge) | API Key 보유자 |

**공유 인프라:** Supabase 1개 프로젝트 (DB + Auth + Storage + Edge Functions)

---

## 참조 파일 (프로토타입에서 포팅)

| 원본 | 포팅 대상 | 핵심 내용 |
|------|----------|----------|
| `prototype/index.html` 14~148행 | Sidebar.tsx | 사이드바 마크업 |
| `prototype/index.html` 153~174행 | Topbar.tsx | 상단 바 |
| `prototype/app.js` 2~14행 | seed.ts | 시약 샘플 데이터 |
| `prototype/app.js` 39~78행 | SearchBar.tsx | 검색 자동완성 |
| `prototype/app.js` 305~327행 | ProtocolOrderModal.tsx | 프로토콜 파싱 |
| `prototype/app.js` 626행 | Toast.tsx | 토스트 2.5초 |
| `prototype/styles.css` 4~29행 | tailwind.config.ts | CSS 변수 → 테마 |
| `docs/ERD.md` | schema.prisma | DB 스키마 전체 |
| `docs/PRD.md` | 기능 체크리스트 | FR-001~025 |
| `docs/IA.md` | 라우팅 + 플로우 | 사이트맵 |

---

## AI 2차 데이터 생산 상세

### 1. 시약 추천/대체 분석 (Phase 4)
```
입력: 사용자 구매 이력 + 실험 분야 + 현재 장바구니
  ↓ Claude API
출력: { 추천 시약 [{product, score, reason}], 대체 시약 [{original, alternative, 이유}] }
  ↓ 캐싱
AiRecommendation 테이블 → /api/v1/recommend 외부 제공
```

### 2. 연구 데이터 분석 (Phase 5)
```
입력: 전체 거래 데이터 + SearchLog + PriceHistory
  ↓ Claude API + 통계 집계
출력: {
  트렌드: "올해 HPLC급 시약 수요 23% 증가",
  패턴: "3월/9월 학기 시작 전 주문량 급증",
  가격: "TCI 에탄올 6개월간 12% 하락 추세",
  기관비교: "유사 규모 연구실 대비 소모품 비용 15% 높음"
}
  ↓ 캐싱
AiAnalytics 테이블 → /api/v1/analytics 외부 제공
```

### 3. 화학 지식 그래프 (Phase 5)
```
입력: 제품 DB (CAS, 분자식, 분류) + 공개 화학 DB
  ↓ Claude API + 구조화
출력: {
  노드: { cas: "64-17-5", name: "Ethanol", properties: {...} },
  관계: [
    { type: "alternative", target: "67-56-1", reason: "유사 용매" },
    { type: "reactant", target: "64-19-7", reaction: "에탄올 산화" },
    { type: "incompatible", target: "7664-93-9", reason: "발열 반응" }
  ]
}
  ↓ 캐싱
ChemKnowledge 테이블 → /api/v1/knowledge 외부 제공
```

---

## 검증 방법

| 항목 | 방법 |
|------|------|
| UI 일치 | 프로토타입 스크린샷 vs 프로덕션 비교 |
| 검색 성능 | 1,000+ 제품 시드 후 200ms 이내 확인 |
| 인증/권한 | 4개 역할 로그인 + API Key 접근 제어 |
| 주문 플로우 | 검색→장바구니→체크아웃→완료 E2E |
| 외부 API | cURL로 v1 엔드포인트 테스트 (인증, Rate Limit) |
| AI 추천 | 시드 데이터로 추천 결과 품질 검증 |
| 데이터 수집 | DataEvent/SearchLog/PriceHistory 누적 확인 |
| 개발자 포털 | Swagger UI에서 전체 API 문서 열람 |
| 반응형 | 768px/1024px/1280px |
| 빌드 | `npm run build` 에러 없음 |
