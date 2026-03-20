# ERD — JINUCHEM 통합 플랫폼 엔티티 관계도

> **버전:** 2.0
> **작성일:** 2026-03-19

---

## 1. 엔티티 관계 다이어그램

```
┌──────────────────┐       ┌──────────────────┐       ┌──────────────────┐
│   Organization   │       │       User       │       │       Role       │
│──────────────────│       │──────────────────│       │──────────────────│
│ PK org_id        │──┐    │ PK user_id       │       │ PK role_id       │
│    org_name      │  │    │ FK org_id         │──┐    │    role_name     │
│    biz_no        │  └──→ │ FK role_id        │  │    │    permissions   │
│    representative│       │    name           │  │    └──────────────────┘
│    address       │       │    email          │  │      researcher
│    phone         │       │    phone          │  │      org_admin
│    budget_yearly │       │    department     │  │      supplier
│    created_at    │       │    lab_name       │  │      sys_admin
└──────────────────┘       │    password_hash  │  │
                           │    avatar_url     │  │
                           │    metadata JSONB  │  │
                           │    created_at     │  │
                           └──────────────────┘  │
                                    │             │
                  ┌─────────────────┤             │
                  │                 │             │
                  ▼                 ▼             │
┌──────────────────┐  ┌──────────────────┐       │
│  ShippingAddress  │  │  Notification    │       │
│──────────────────│  │    Setting       │       │
│ PK address_id    │  │──────────────────│       │
│ FK user_id       │  │ PK setting_id    │       │
│    label         │  │ FK user_id       │       │
│    recipient     │  │    quote_alert   │       │
│    phone         │  │    order_alert   │       │
│    address       │  │    ship_alert    │       │
│    building      │  │    stock_alert   │       │
│    department     │  │    promo_alert   │       │
│    lab_room      │  └──────────────────┘       │
│    is_default    │                              │
└──────────────────┘                              │
                                                  │
                                                  │
┌─────────────────────────────────────────────────┘
│
│  ┌──────────────────┐       ┌──────────────────┐
│  │     Supplier     │       │      Brand       │
│  │──────────────────│       │──────────────────│
│  │ PK supplier_id   │──┐    │ PK brand_id      │
│  │    name          │  │    │    brand_name     │
│  │    code          │  │    │ FK supplier_id    │
│  │    contact_email │  │    └──────────────────┘
│  │    contact_phone │  │
│  │    api_endpoint  │  │
│  │    is_active     │  │
│  └──────────────────┘  │
│                         │
│                         │
▼                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                          Product                                 │
│─────────────────────────────────────────────────────────────────│
│ PK product_id                                                    │
│ FK supplier_id                                                   │
│ FK category_id                                                   │
│    product_type        ENUM('reagent', 'supply')                │
│    name                제품명                                     │
│    name_en             영문 제품명                                 │
│    catalog_no          카탈로그번호                                 │
│    description         설명                                       │
│    image_url           제품 이미지                                 │
│    is_active           활성 여부                                   │
│    metadata            JSONB (확장 속성)                           │
│    created_at                                                    │
│    updated_at                                                    │
└──────────────────────────────────────────────────────────────────┘
         │                              │
         │ product_type = 'reagent'     │ product_type = 'supply'
         ▼                              ▼
┌──────────────────┐       ┌──────────────────┐
│  ReagentDetail   │       │  SupplyDetail    │
│──────────────────│       │──────────────────│
│ PK reagent_id    │       │ PK supply_id     │
│ FK product_id    │       │ FK product_id    │
│    cas_number    │       │    material      │
│    formula       │       │    capacity      │
│    mol_weight    │       │    is_sterile    │
│    purity        │       │    certification │
│    grade         │       │    subscription  │
│    synonyms      │       │     _available   │
│    structure_img │       └──────────────────┘
│    hazard_class  │                │
│    ghs_pictograms│               │
│    h_codes       │       ┌──────────────────┐
│    signal_word   │       │ SupplyCompat     │
└──────────────────┘       │──────────────────│
                           │ PK compat_id     │
                           │ FK supply_id     │
                           │    equipment     │
                           │    is_compatible │
                           └──────────────────┘


┌──────────────────┐       ┌──────────────────┐
│     Category     │       │   SubCategory    │
│──────────────────│       │──────────────────│
│ PK category_id   │──┐    │ PK subcat_id     │
│    name          │  └──→ │ FK category_id   │
│    product_type  │       │    name          │
│    icon          │       │    item_count    │
│    sort_order    │       └──────────────────┘
└──────────────────┘


┌──────────────────────────────────────────────────────────────────┐
│                        ProductVariant                             │
│──────────────────────────────────────────────────────────────────│
│ PK variant_id                                                     │
│ FK product_id                                                     │
│    size              포장단위 (25mL, 500mL, 1L, 5G, 25G...)       │
│    unit              단위 (mL, L, G, kg, 팩, 박스, 개)             │
│    list_price        정가                                         │
│    sale_price        할인가                                       │
│    discount_rate     할인율 (%)                                   │
│    stock_qty         재고 수량                                     │
│    same_day_ship     당일출고 가능                                 │
│    delivery_date     납품예정일                                    │
│    is_active         활성 여부                                     │
└──────────────────────────────────────────────────────────────────┘


┌──────────────────────────────────────────────────────────────────┐
│                        ProductDocument                            │
│──────────────────────────────────────────────────────────────────│
│ PK doc_id                                                         │
│ FK product_id                                                     │
│    doc_type          ENUM('sds_kr','sds_en','coa','coo',         │
│                           'spec','kc_cert')                       │
│    file_url          파일 경로                                     │
│    lot_number        로트번호 (COA용)                              │
│    updated_at                                                     │
└──────────────────────────────────────────────────────────────────┘


┌──────────────────────────────────────────────────────────────────┐
│                            Order                                  │
│──────────────────────────────────────────────────────────────────│
│ PK order_id                                                       │
│ FK user_id               주문자                                    │
│ FK org_id                소속 기관                                  │
│ FK shipping_address_id   배송지                                    │
│    order_number          주문번호 (자동생성)                        │
│    po_number             구매주문번호 (날짜+사용자명)               │
│    status                ENUM('payment_pending','payment_done',   │
│                               'preparing','shipping',             │
│                               'delivered','cancelled')            │
│    subtotal              상품 합계                                  │
│    discount_amount       할인 금액                                  │
│    vat                   부가세                                    │
│    total_amount          총 결제금액                                │
│    billing_org           청구 기관명                                │
│    billing_address       청구지 주소                                │
│    billing_account_no    계정번호                                   │
│    delivery_note         배송 요청사항                              │
│    email_cc              CC 수신 이메일 (JSON)                     │
│    metadata              JSONB (확장 속성)                         │
│    ordered_at            주문일시                                   │
│    paid_at               결제일시                                   │
│    shipped_at            출고일시                                   │
│    delivered_at          배송완료일시                               │
│    est_delivery_date     납품예정일                                 │
└──────────────────────────────────────────────────────────────────┘
         │
         │ 1:N
         ▼
┌──────────────────────────────────────────────────────────────────┐
│                          OrderItem                                │
│──────────────────────────────────────────────────────────────────│
│ PK item_id                                                        │
│ FK order_id                                                       │
│ FK product_id                                                     │
│ FK variant_id                                                     │
│    product_name          제품명 (스냅샷)                            │
│    catalog_no            카탈로그번호 (스냅샷)                      │
│    size                  포장단위 (스냅샷)                          │
│    quantity              수량                                      │
│    unit_price            단가 (스냅샷)                              │
│    subtotal              소계                                      │
│    special_note          특이사항 (항공규제 등)                     │
└──────────────────────────────────────────────────────────────────┘


┌──────────────────────────────────────────────────────────────────┐
│                       ApprovalRequest                             │
│──────────────────────────────────────────────────────────────────│
│ PK approval_id                                                    │
│ FK order_id                                                       │
│ FK requester_id          요청자 (연구원)                            │
│ FK approver_id           승인자 (조직관리자)                        │
│    status                ENUM('pending','approved','rejected')    │
│    reject_reason         거절 사유                                  │
│    requested_at                                                   │
│    responded_at                                                   │
└──────────────────────────────────────────────────────────────────┘


┌──────────────────────────────────────────────────────────────────┐
│                      CancelReturn                                 │
│──────────────────────────────────────────────────────────────────│
│ PK cancel_id                                                      │
│ FK order_id              원 주문                                   │
│ FK user_id               요청자                                    │
│    receipt_number        접수번호 (자동생성)                        │
│    type                  ENUM('cancel','return')                  │
│    reason                사유                                      │
│    detail                상세 설명                                  │
│    refund_amount         환불 금액                                  │
│    status                ENUM('received','processing','completed')│
│    created_at                                                     │
│    completed_at                                                   │
└──────────────────────────────────────────────────────────────────┘


┌──────────────────────────────────────────────────────────────────┐
│                          Quote                                    │
│──────────────────────────────────────────────────────────────────│
│ PK quote_id                                                       │
│ FK user_id               요청자                                    │
│ FK supplier_id           공급사                                    │
│    quote_number          견적번호                                   │
│    status                ENUM('pending','arrived','ordered',      │
│                               'expired')                          │
│    total_amount          견적 금액                                  │
│    valid_until           유효기간                                   │
│    requested_at                                                   │
│    responded_at                                                   │
└──────────────────────────────────────────────────────────────────┘
         │
         │ 1:N
         ▼
┌──────────────────┐
│    QuoteItem     │
│──────────────────│
│ PK qi_id         │
│ FK quote_id      │
│ FK product_id    │
│ FK variant_id    │
│    quantity      │
│    quoted_price  │
└──────────────────┘


┌──────────────────────────────────────────────────────────────────┐
│                       VoucherDocument                             │
│──────────────────────────────────────────────────────────────────│
│ PK voucher_id                                                     │
│ FK order_id                                                       │
│ FK user_id                                                        │
│    doc_type              ENUM('estimate','transaction_report',   │
│                               'delivery_confirm')                │
│    file_url              생성된 PDF 경로                           │
│    issued_at                                                      │
└──────────────────────────────────────────────────────────────────┘


┌──────────────────────────────────────────────────────────────────┐
│                        Cart / CartItem                            │
│──────────────────────────────────────────────────────────────────│
│                                                                   │
│  Cart                           CartItem                          │
│  ──────────────                 ──────────────                    │
│  PK cart_id                     PK cart_item_id                   │
│  FK user_id                     FK cart_id                        │
│     promo_code                  FK product_id                     │
│     updated_at                  FK variant_id                     │
│                                    quantity                       │
│                                    added_at                       │
└──────────────────────────────────────────────────────────────────┘


┌──────────────────────────────────────────────────────────────────┐
│                        Favorite                                   │
│──────────────────────────────────────────────────────────────────│
│ PK favorite_id                                                    │
│ FK user_id                                                        │
│ FK product_id                                                     │
│    added_at                                                       │
└──────────────────────────────────────────────────────────────────┘


┌──────────────────────────────────────────────────────────────────┐
│                      RecentlyViewed                               │
│──────────────────────────────────────────────────────────────────│
│ PK rv_id                                                          │
│ FK user_id                                                        │
│ FK product_id                                                     │
│    viewed_at                                                      │
└──────────────────────────────────────────────────────────────────┘


┌──────────────────────────────────────────────────────────────────┐
│                      LabInventory                                 │
│──────────────────────────────────────────────────────────────────│
│ PK inventory_id                                                   │
│ FK user_id                                                        │
│ FK product_id            (nullable — 수동 등록 시)                 │
│    name                  시약명                                    │
│    cas_number            CAS 번호                                  │
│    current_qty           현재 수량                                  │
│    unit                  단위 (mL, g, 개)                          │
│    location              보관 위치                                  │
│    expiry_date           유효기간                                   │
│    min_stock             최소 재고 (부족 알림 기준)                 │
│    status                ENUM('normal','low','expired')           │
│    added_at                                                       │
│    updated_at                                                     │
└──────────────────────────────────────────────────────────────────┘


┌──────────────────────────────────────────────────────────────────┐
│                      Subscription                                 │
│──────────────────────────────────────────────────────────────────│
│ PK sub_id                                                         │
│ FK user_id                                                        │
│ FK product_id                                                     │
│ FK variant_id                                                     │
│    interval             ENUM('1w','2w','1m','2m','3m')           │
│    quantity             수량                                       │
│    next_delivery_date   다음 배송일                                │
│    is_active            활성 여부                                   │
│    created_at                                                     │
└──────────────────────────────────────────────────────────────────┘


┌──────────────────────────────────────────────────────────────────┐
│                       Inquiry                                     │
│──────────────────────────────────────────────────────────────────│
│ PK inquiry_id                                                     │
│ FK user_id                                                        │
│ FK order_id              관련 주문 (nullable)                      │
│    inquiry_type          ENUM('order','delivery','product',      │
│                               'account','etc')                   │
│    title                 제목                                      │
│    content               내용                                      │
│    attachment_url        첨부파일                                   │
│    status                ENUM('received','processing','answered') │
│    created_at                                                     │
└──────────────────────────────────────────────────────────────────┘
         │
         │ 1:N
         ▼
┌──────────────────┐
│  InquiryReply    │
│──────────────────│
│ PK reply_id      │
│ FK inquiry_id    │
│ FK user_id       │
│    content       │
│    is_admin      │
│    created_at    │
└──────────────────┘


┌──────────────────────────────────────────────────────────────────┐
│                         ChatRoom                                  │
│──────────────────────────────────────────────────────────────────│
│ PK room_id                                                        │
│ FK user_id               참여자 1                                  │
│ FK partner_id            참여자 2                                  │
│    last_message          최근 메시지 미리보기                       │
│    last_message_at       최근 메시지 시간                           │
│    unread_count          안읽은 메시지 수                           │
└──────────────────────────────────────────────────────────────────┘
         │
         │ 1:N
         ▼
┌──────────────────┐
│   ChatMessage    │
│──────────────────│
│ PK message_id    │
│ FK room_id       │
│ FK sender_id     │
│    content       │
│    sent_at       │
│    is_read       │
└──────────────────┘


┌──────────────────────────────────────────────────────────────────┐
│                           FAQ                                     │
│──────────────────────────────────────────────────────────────────│
│ PK faq_id                                                         │
│    category              ENUM('order','delivery','product',      │
│                               'account','etc')                   │
│    question              질문                                      │
│    answer                답변 (HTML)                               │
│    view_count            조회수                                    │
│    sort_order            정렬 순서                                  │
│    is_active                                                      │
└──────────────────────────────────────────────────────────────────┘


┌──────────────────────────────────────────────────────────────────┐
│                          Notice                                   │
│──────────────────────────────────────────────────────────────────│
│ PK notice_id                                                      │
│    title                 제목                                      │
│    content               내용 (HTML)                               │
│    is_pinned             상단 고정                                  │
│    created_at                                                     │
└──────────────────────────────────────────────────────────────────┘


┌──────────────────────────────────────────────────────────────────┐
│                      PromoCode                                    │
│──────────────────────────────────────────────────────────────────│
│ PK promo_id                                                       │
│    code                  프로모션 코드                              │
│    description           설명                                      │
│    discount_type         ENUM('percent','fixed')                  │
│    discount_value        할인값                                    │
│    min_order_amount      최소 주문금액                              │
│    max_discount          최대 할인금액                              │
│    valid_from                                                     │
│    valid_until                                                    │
│    is_active                                                      │
└──────────────────────────────────────────────────────────────────┘


┌──────────────────────────────────────────────────────────────────┐
│                         Budget                                    │
│──────────────────────────────────────────────────────────────────│
│ PK budget_id                                                      │
│ FK org_id                                                         │
│ FK user_id               (nullable — 개인 or 조직)                 │
│    year                  회계연도                                   │
│    total_budget          총 예산                                    │
│    reagent_budget        시약 예산                                  │
│    supply_budget         소모품 예산                                │
│    spent_amount          집행 금액                                  │
│    updated_at                                                     │
└──────────────────────────────────────────────────────────────────┘


═══════════════════════════════════════════════════════════════════
                    데이터 플랫폼 테이블 (v2.0)
═══════════════════════════════════════════════════════════════════


┌──────────────────────────────────────────────────────────────────┐
│                          ApiKey                                   │
│──────────────────────────────────────────────────────────────────│
│ PK api_key_id                                                     │
│ FK org_id                소속 기관                                  │
│    key_hash              API Key 해시값                             │
│    tier                  ENUM('free','basic','pro','enterprise')  │
│    rate_limit            일간 호출 제한                              │
│    scopes                허용 범위 (JSON array)                     │
│    is_active             활성 여부                                   │
│    created_at                                                     │
│    last_used_at          마지막 사용 시각                            │
└──────────────────────────────────────────────────────────────────┘


┌──────────────────────────────────────────────────────────────────┐
│                        ApiUsageLog                                │
│──────────────────────────────────────────────────────────────────│
│ PK usage_id                                                       │
│ FK key_id                API Key                                  │
│    endpoint              요청 엔드포인트 (e.g. /api/v1/products)   │
│    method                HTTP 메서드 (GET/POST)                    │
│    status_code           응답 상태 코드                              │
│    latency_ms            응답 시간 (밀리초)                          │
│    request_body          요청 본문 (JSON)                           │
│    timestamp             요청 시각                                  │
└──────────────────────────────────────────────────────────────────┘


┌──────────────────────────────────────────────────────────────────┐
│                       ApiRateLimit                                │
│──────────────────────────────────────────────────────────────────│
│ PK rate_limit_id                                                  │
│    tier                  ENUM('free','basic','pro','enterprise')  │
│    daily_limit           일간 호출 제한                              │
│    monthly_limit         월간 호출 제한                              │
│    burst_limit           버스트 호출 제한 (분당)                     │
└──────────────────────────────────────────────────────────────────┘


┌──────────────────────────────────────────────────────────────────┐
│                     AiRecommendation                              │
│──────────────────────────────────────────────────────────────────│
│ PK rec_id                                                         │
│ FK user_id               추천 대상 사용자                            │
│ FK product_id            추천 제품                                  │
│    score                 추천 점수 (0.0 ~ 1.0)                     │
│    reason                추천 사유 (텍스트)                          │
│    model_version         AI 모델 버전                               │
│    generated_at          생성 시각                                  │
│    expires_at            만료 시각                                  │
└──────────────────────────────────────────────────────────────────┘


┌──────────────────────────────────────────────────────────────────┐
│                       AiPrediction                                │
│──────────────────────────────────────────────────────────────────│
│ PK prediction_id                                                  │
│ FK user_id               예측 대상 사용자                            │
│    prediction_type       ENUM('consumption','budget','reorder')   │
│    data                  예측 데이터 (JSON)                         │
│    confidence            신뢰도 (0.0 ~ 1.0)                       │
│    model_version         AI 모델 버전                               │
│    generated_at          생성 시각                                  │
└──────────────────────────────────────────────────────────────────┘


┌──────────────────────────────────────────────────────────────────┐
│                       AiAnalytics                                 │
│──────────────────────────────────────────────────────────────────│
│ PK analytics_id                                                   │
│ FK org_id                분석 대상 기관                              │
│    report_type           분석 유형 (pattern/trend/seasonality)     │
│    data                  분석 결과 데이터 (JSON)                    │
│    period_start          분석 기간 시작일                            │
│    period_end            분석 기간 종료일                            │
│    generated_at          생성 시각                                  │
└──────────────────────────────────────────────────────────────────┘


┌──────────────────────────────────────────────────────────────────┐
│                      ChemKnowledge                                │
│──────────────────────────────────────────────────────────────────│
│ PK knowledge_id                                                   │
│    cas_number            CAS 번호                                  │
│    name                  물질명                                    │
│    relations             관계 데이터 (JSON)                         │
│                          {alternatives, precursors, byproducts,   │
│                           solvent_compat}                          │
│    properties            물성 정보 (JSON)                           │
│                          {bp, mp, density, ph, mw, formula}       │
│    source                출처                                      │
│    updated_at            갱신일                                    │
└──────────────────────────────────────────────────────────────────┘


┌──────────────────────────────────────────────────────────────────┐
│                        DataEvent                                  │
│──────────────────────────────────────────────────────────────────│
│ PK event_id                                                       │
│ FK user_id               사용자 (nullable — 비로그인 이벤트)         │
│    event_type            이벤트 유형 (page_view, click, search,    │
│                          add_to_cart, order, experiment 등)        │
│    payload               이벤트 상세 데이터 (JSON)                  │
│    source_app            ENUM('shop','eln','supplier','admin')    │
│    ip_address            요청 IP 주소                               │
│    timestamp             이벤트 시각                                │
└──────────────────────────────────────────────────────────────────┘


┌──────────────────────────────────────────────────────────────────┐
│                       PriceHistory                                │
│──────────────────────────────────────────────────────────────────│
│ PK price_history_id                                               │
│ FK product_id            제품                                      │
│ FK variant_id            포장단위                                   │
│    list_price            정가 스냅샷                                │
│    sale_price            할인가 스냅샷                               │
│    recorded_at           기록 시각                                  │
└──────────────────────────────────────────────────────────────────┘


┌──────────────────────────────────────────────────────────────────┐
│                        SearchLog                                  │
│──────────────────────────────────────────────────────────────────│
│ PK search_id                                                      │
│ FK user_id               검색 사용자 (nullable)                     │
│    query                 검색어                                    │
│    search_type           검색 유형 (text, cas, formula, structure) │
│    results_count         검색 결과 수                               │
│    clicked_product_id    클릭한 제품 ID (nullable)                  │
│    timestamp             검색 시각                                  │
└──────────────────────────────────────────────────────────────────┘


═══════════════════════════════════════════════════════════════════
                     ELN (전자실험노트) 테이블 (v2.0)
═══════════════════════════════════════════════════════════════════


┌──────────────────────────────────────────────────────────────────┐
│                        Experiment                                 │
│──────────────────────────────────────────────────────────────────│
│ PK experiment_id                                                  │
│ FK user_id               실험 작성자                                │
│    title                 실험 제목                                  │
│    purpose               실험 목적                                  │
│    method                실험 방법                                  │
│    result                실험 결과                                  │
│    status                ENUM('draft','in_progress',              │
│                               'completed','archived')             │
│    created_at                                                     │
│    updated_at                                                     │
└──────────────────────────────────────────────────────────────────┘


┌──────────────────────────────────────────────────────────────────┐
│                         Protocol                                  │
│──────────────────────────────────────────────────────────────────│
│ PK protocol_id                                                    │
│ FK user_id               프로토콜 작성자                             │
│    title                 프로토콜 제목                               │
│    description           설명                                      │
│    steps                 실험 단계 (JSON array)                    │
│    is_template           템플릿 여부                                │
│    created_at                                                     │
│    updated_at                                                     │
└──────────────────────────────────────────────────────────────────┘


┌──────────────────────────────────────────────────────────────────┐
│                     ProtocolReagent                                │
│──────────────────────────────────────────────────────────────────│
│ PK pr_id                                                          │
│ FK protocol_id           프로토콜                                   │
│ FK product_id            매칭된 제품 (nullable)                     │
│    cas_number            CAS 번호                                  │
│    quantity              필요 수량                                  │
│    unit                  단위 (mL, g 등)                           │
│    is_matched            Shop 제품 매칭 여부                        │
└──────────────────────────────────────────────────────────────────┘


┌──────────────────────────────────────────────────────────────────┐
│                      ExperimentLog                                │
│──────────────────────────────────────────────────────────────────│
│ PK log_id                                                         │
│ FK experiment_id         실험                                      │
│    action                행동 (created, started, paused,           │
│                          reagent_used, completed, archived)       │
│    details               상세 데이터 (JSON)                         │
│    timestamp             기록 시각                                  │
└──────────────────────────────────────────────────────────────────┘


┌──────────────────────────────────────────────────────────────────┐
│                       UsageRecord                                 │
│──────────────────────────────────────────────────────────────────│
│ PK usage_id                                                       │
│ FK user_id               사용자                                    │
│ FK product_id            사용 제품                                  │
│ FK experiment_id         관련 실험 (nullable)                       │
│    quantity_used         사용 수량                                  │
│    unit                  단위                                      │
│    lot_number            로트 번호                                  │
│    timestamp             사용 시각                                  │
└──────────────────────────────────────────────────────────────────┘
```

---

## 2. 관계 요약

| 관계 | 유형 | 설명 |
|------|------|------|
| Organization → User | 1:N | 기관에 여러 사용자 소속 |
| User → Role | N:1 | 사용자별 역할 지정 |
| User → ShippingAddress | 1:N | 다수 배송지 관리 |
| User → Order | 1:N | 사용자별 주문 이력 |
| User → Cart | 1:1 | 사용자당 장바구니 1개 |
| User → Favorite | 1:N | 즐겨찾기 목록 |
| User → LabInventory | 1:N | 시약장 관리 |
| Supplier → Product | 1:N | 공급사별 다수 제품 |
| Supplier → Brand | 1:N | 공급사별 다수 브랜드 |
| Product → ProductVariant | 1:N | 포장단위별 가격/재고 |
| Product → ProductDocument | 1:N | SDS/COA 등 문서 |
| Product → ReagentDetail | 1:1 | 시약 전용 상세 |
| Product → SupplyDetail | 1:1 | 소모품 전용 상세 |
| Category → SubCategory | 1:N | 대분류 → 소분류 |
| Order → OrderItem | 1:N | 주문 품목 |
| Order → ApprovalRequest | 1:1 | 구매 승인 |
| Order → CancelReturn | 1:N | 취소/반품 |
| Order → VoucherDocument | 1:N | 증빙서류 |
| Quote → QuoteItem | 1:N | 견적 품목 |
| Inquiry → InquiryReply | 1:N | 문의 답변 |
| ChatRoom → ChatMessage | 1:N | 채팅 메시지 |
| User → Subscription | 1:N | 정기배송 구독 |
| Organization → ApiKey | 1:N | 기관별 API Key 발급 |
| ApiKey → ApiUsageLog | 1:N | API 사용 로그 |
| User → AiRecommendation | 1:N | AI 시약 추천 |
| Product → AiRecommendation | 1:N | 추천 대상 제품 |
| User → AiPrediction | 1:N | AI 예측 (소모량/예산/재주문) |
| Organization → AiAnalytics | 1:N | 기관별 AI 분석 리포트 |
| User → DataEvent | 1:N | 사용자 행동 이벤트 |
| Product → PriceHistory | 1:N | 가격 변동 이력 |
| ProductVariant → PriceHistory | 1:N | 포장단위별 가격 이력 |
| User → SearchLog | 1:N | 검색 로그 |
| User → Experiment | 1:N | 실험 관리 |
| User → Protocol | 1:N | 프로토콜 관리 |
| Protocol → ProtocolReagent | 1:N | 프로토콜 필요 시약 |
| Experiment → ExperimentLog | 1:N | 실험 타임라인 로그 |
| User → UsageRecord | 1:N | 시약 사용 기록 |
| Product → UsageRecord | 1:N | 제품 사용 이력 |
| Experiment → UsageRecord | 1:N | 실험별 시약 사용 |

---

## 3. 인덱스 권장

| 테이블 | 인덱스 컬럼 | 용도 |
|--------|-----------|------|
| Product | `cas_number` | CAS 검색 |
| Product | `catalog_no` | 카탈로그번호 검색 |
| Product | `supplier_id, category_id` | 필터링 |
| Product | `name` (FULLTEXT) | 제품명 검색 |
| ProductVariant | `product_id, is_active` | 가격 조회 |
| Order | `user_id, status` | 내 주문 조회 |
| Order | `org_id, ordered_at` | 기관별 주문 조회 |
| Order | `order_number` | 주문번호 검색 |
| OrderItem | `order_id` | 주문 상세 |
| LabInventory | `user_id, status` | 재고 알림 |
| Favorite | `user_id` | 즐겨찾기 조회 |
| RecentlyViewed | `user_id, viewed_at` | 최근 본 상품 |
| Inquiry | `user_id, status` | 내 문의 조회 |
| ApiKey | `org_id, is_active` | 기관별 활성 Key 조회 |
| ApiKey | `key_hash` (UNIQUE) | Key 인증 |
| ApiUsageLog | `key_id, timestamp` | API 사용량 조회 |
| ApiUsageLog | `endpoint, timestamp` | 엔드포인트별 통계 |
| AiRecommendation | `user_id, expires_at` | 유효 추천 조회 |
| AiPrediction | `user_id, prediction_type` | 예측 유형별 조회 |
| AiAnalytics | `org_id, report_type` | 기관별 리포트 조회 |
| ChemKnowledge | `cas_number` (UNIQUE) | CAS 번호 검색 |
| DataEvent | `user_id, event_type, timestamp` | 이벤트 분석 |
| DataEvent | `source_app, timestamp` | 앱별 이벤트 조회 |
| PriceHistory | `product_id, variant_id, recorded_at` | 가격 이력 조회 |
| SearchLog | `user_id, timestamp` | 사용자별 검색 이력 |
| SearchLog | `query, search_type` | 검색 트렌드 분석 |
| Experiment | `user_id, status` | 내 실험 조회 |
| Protocol | `user_id, is_template` | 프로토콜/템플릿 조회 |
| ProtocolReagent | `protocol_id` | 프로토콜 시약 목록 |
| ExperimentLog | `experiment_id, timestamp` | 실험 타임라인 |
| UsageRecord | `user_id, timestamp` | 사용자별 사용 이력 |
| UsageRecord | `product_id, timestamp` | 제품별 사용 이력 |

---

## 4. ENUM 값 정리

| ENUM | 값 | 한글 |
|------|---|------|
| product_type | `reagent` | 시약 |
| | `supply` | 소모품 |
| order_status | `payment_pending` | 결제대기 |
| | `payment_done` | 결제완료 |
| | `preparing` | 배송준비 |
| | `shipping` | 배송중 |
| | `delivered` | 배송완료 |
| | `cancelled` | 취소 |
| approval_status | `pending` | 대기 |
| | `approved` | 승인 |
| | `rejected` | 거절 |
| cancel_type | `cancel` | 취소 |
| | `return` | 반품 |
| cancel_status | `received` | 접수 |
| | `processing` | 처리중 |
| | `completed` | 완료 |
| quote_status | `pending` | 견적대기 |
| | `arrived` | 견적도착 |
| | `ordered` | 주문완료 |
| | `expired` | 만료 |
| inquiry_type | `order` | 주문/결제 |
| | `delivery` | 배송 |
| | `product` | 제품 |
| | `account` | 계정 |
| | `etc` | 기타 |
| inquiry_status | `received` | 접수 |
| | `processing` | 처리중 |
| | `answered` | 답변완료 |
| doc_type | `sds_kr` | 한글 SDS |
| | `sds_en` | 영문 SDS |
| | `coa` | COA |
| | `coo` | COO |
| | `spec` | Spec Sheet |
| | `kc_cert` | KC 인증서 |
| voucher_type | `estimate` | 견적서 |
| | `transaction_report` | 거래명세서 |
| | `delivery_confirm` | 납품확인서 |
| subscription_interval | `1w` | 매주 |
| | `2w` | 2주마다 |
| | `1m` | 매월 |
| | `2m` | 2개월 |
| | `3m` | 3개월 |
| inventory_status | `normal` | 정상 |
| | `low` | 부족 |
| | `expired` | 만료 |
| role_name | `researcher` | 연구원 |
| | `org_admin` | 조직관리자 |
| | `supplier` | 공급자 |
| | `sys_admin` | 시스템관리자 |
| api_tier | `free` | 무료 (100/일) |
| | `basic` | 기본 (1,000/일) |
| | `pro` | 프로 (10,000/일) |
| | `enterprise` | 엔터프라이즈 (무제한) |
| prediction_type | `consumption` | 소모량 예측 |
| | `budget` | 예산 예측 |
| | `reorder` | 재주문 시점 예측 |
| source_app | `shop` | JINU Shop |
| | `eln` | JINU E-Note |
| | `supplier` | Supplier Portal |
| | `admin` | Admin Platform |
| experiment_status | `draft` | 초안 |
| | `in_progress` | 진행중 |
| | `completed` | 완료 |
| | `archived` | 보관 |
| report_type | `pattern` | 구매 패턴 |
| | `trend` | 트렌드 |
| | `seasonality` | 계절성 |
| search_type | `text` | 텍스트 검색 |
| | `cas` | CAS 번호 검색 |
| | `formula` | 분자식 검색 |
| | `structure` | 구조식 검색 |
