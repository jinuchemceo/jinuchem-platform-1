import type {
  SupplierOrder,
  SupplierQuote,
  SupplierProduct,
  ReturnRequest,
  Settlement,
  SupplierInquiry,
  ProductReview,
  ChatRoom,
  SupplierNotification,
  TopProduct,
} from '@/types';

// ===== ORDERS =====
export const mockOrders: SupplierOrder[] = [
  {
    id: 'ORD-2026-0315', customer: '김연구', customerOrg: '서울대학교 화학과',
    items: [
      { name: 'Sodium Chloride', catalogNo: 'JC-SC-001', size: '500g', qty: 5, unitPrice: 15000, subtotal: 75000 },
      { name: 'Potassium Hydroxide', catalogNo: 'JC-PH-012', size: '1kg', qty: 2, unitPrice: 42000, subtotal: 84000 },
      { name: 'Calcium Carbonate', catalogNo: 'JC-CC-020', size: '500g', qty: 3, unitPrice: 28000, subtotal: 84000 },
    ],
    totalAmount: 1250000, orderedDate: '2026-03-19', status: '신규주문',
    shippingAddress: '서울시 관악구 관악로 1, 자연과학대학 302동 415호',
    contactName: '김연구', contactPhone: '010-1234-5678', poNumber: 'PO-SNU-2026-0412',
  },
  {
    id: 'ORD-2026-0314', customer: '이박사', customerOrg: 'KAIST 생명과학과',
    items: [{ name: 'Ethanol', catalogNo: 'JC-ET-005', size: '1L', qty: 10, unitPrice: 68000, subtotal: 680000 }],
    totalAmount: 680000, orderedDate: '2026-03-18', status: '준비중',
    shippingAddress: '대전시 유성구 대학로 291, KAIST N5 302호',
    contactName: '이박사', contactPhone: '010-2345-6789',
  },
  {
    id: 'ORD-2026-0313', customer: '박연구', customerOrg: '연세대학교 약학대학',
    items: [{ name: 'Acetonitrile', catalogNo: 'JC-AN-008', size: '2.5L', qty: 3, unitPrice: 700000, subtotal: 2100000 }],
    totalAmount: 2100000, orderedDate: '2026-03-17', status: '출고완료',
    shippingAddress: '서울시 서대문구 연세로 50, 약학관 B105호',
    contactName: '박연구', contactPhone: '010-3456-7890',
  },
  {
    id: 'ORD-2026-0312', customer: '최과장', customerOrg: 'LG화학 기초소재연구소',
    items: [
      { name: 'Methanol', catalogNo: 'JC-ME-003', size: '4L', qty: 5, unitPrice: 98500, subtotal: 492500 },
      { name: 'Toluene', catalogNo: 'JC-TO-007', size: '2.5L', qty: 2, unitPrice: 132000, subtotal: 264000 },
    ],
    totalAmount: 756500, orderedDate: '2026-03-16', status: '배송완료',
    shippingAddress: '대전시 유성구 과학로 188, LG사이언스파크 B동 3층',
    contactName: '최과장', contactPhone: '010-4567-8901',
  },
  {
    id: 'ORD-2026-0311', customer: '정연구', customerOrg: '포항공과대학교 화학공학과',
    items: [{ name: 'Dichloromethane', catalogNo: 'JC-DC-010', size: '2.5L', qty: 4, unitPrice: 145000, subtotal: 580000 }],
    totalAmount: 580000, orderedDate: '2026-03-15', status: '배송완료',
    shippingAddress: '경북 포항시 남구 청암로 77, 화학공학관 201호',
    contactName: '정연구', contactPhone: '010-5678-9012',
  },
  {
    id: 'ORD-2026-0310', customer: '한연구', customerOrg: '고려대학교 화학과',
    items: [{ name: 'Isopropanol', catalogNo: 'JC-IP-015', size: '2.5L', qty: 6, unitPrice: 78900, subtotal: 473400 }],
    totalAmount: 473400, orderedDate: '2026-03-14', status: '배송완료',
    shippingAddress: '서울시 성북구 안암로 145, 이학관 B동 312호',
    contactName: '한연구', contactPhone: '010-6789-0123',
  },
];

// ===== QUOTES =====
export const mockQuotes: SupplierQuote[] = [
  {
    id: 'QT-2026-0042', requester: '김연구', requesterOrg: '서울대학교 화학과', department: '유기화학 실험실', phone: '010-1234-5678',
    items: [
      { product: 'Ethyl alcohol, Pure', size: '500mL', qty: 5 },
      { product: 'Dichloromethane, ACS', size: '2.5L', qty: 2 },
    ],
    requestedDate: '2026-04-01', dueDate: '2026-04-08', status: '대기중',
    requestNote: '연구 프로젝트용 대량 구매 견적 요청합니다.',
  },
  {
    id: 'QT-2026-0041', requester: '이박사', requesterOrg: 'KAIST 생명과학과',
    items: [{ product: 'Methanol, HPLC Grade', size: '4L', qty: 10 }],
    requestedDate: '2026-03-30', dueDate: '2026-04-06', status: '대기중',
  },
  {
    id: 'QT-2026-0040', requester: '박연구', requesterOrg: '포항공과대학교 화학공학과',
    items: [{ product: 'Acetone, ACS Reagent', size: '2.5L', qty: 3, unitPrice: 87800 }],
    requestedDate: '2026-03-28', dueDate: '2026-04-04', totalAmount: 263400, status: '응답완료',
  },
  {
    id: 'QT-2026-0039', requester: '최과장', requesterOrg: 'LG화학 기초소재연구소',
    items: [
      { product: 'Toluene, HPLC Grade', size: '2.5L', qty: 5, unitPrice: 132000 },
      { product: 'DCM, ACS Grade', size: '2.5L', qty: 5, unitPrice: 145000 },
    ],
    requestedDate: '2026-03-25', dueDate: '2026-04-01', totalAmount: 1385000, status: '주문전환',
  },
  {
    id: 'QT-2026-0038', requester: '정연구', requesterOrg: '연세대학교 약학대학',
    items: [{ product: 'NaOH pellets', size: '1kg', qty: 10, unitPrice: 45600 }],
    requestedDate: '2026-03-20', dueDate: '2026-03-27', totalAmount: 456000, status: '만료',
  },
];

// ===== PRODUCTS =====
export const mockProducts: SupplierProduct[] = [
  { id: 'P001', name: 'Ethyl alcohol, Pure', cas: '64-17-5', catalogNo: '459844', category: '용매', stock: 50, price: 158239, status: '판매중', sameDayShip: true, deliveryDate: '2026-04-03', variantCount: 3 },
  { id: 'P002', name: 'Methanol, HPLC Grade', cas: '67-56-1', catalogNo: 'M0202', category: '용매', stock: 0, price: 98500, status: '품절', sameDayShip: false, deliveryDate: '2026-04-10', variantCount: 2 },
  { id: 'P003', name: 'Acetone, ACS Reagent', cas: '67-64-1', catalogNo: 'A0003', category: '용매', stock: 25, price: 87800, salePrice: 79020, status: '판매중', sameDayShip: true, deliveryDate: '2026-04-03', variantCount: 2 },
  { id: 'P004', name: 'Dichloromethane, ACS', cas: '75-09-2', catalogNo: 'D0148', category: '용매', stock: 3, price: 145000, status: '판매중', sameDayShip: true, deliveryDate: '2026-04-03', variantCount: 2 },
  { id: 'P005', name: 'Sodium hydroxide, pellets', cas: '1310-73-2', catalogNo: 'S0401', category: '무기화합물', stock: 30, price: 45600, status: '판매중', sameDayShip: true, deliveryDate: '2026-04-03', variantCount: 3 },
  { id: 'P006', name: 'Toluene, HPLC Grade', cas: '108-88-3', catalogNo: 'T0302', category: '용매', stock: 2, price: 132000, salePrice: 118800, status: '판매중', sameDayShip: true, deliveryDate: '2026-04-03', variantCount: 2 },
  { id: 'P007', name: 'Hydrochloric acid', cas: '7647-01-0', catalogNo: 'H0201', category: '무기화합물', stock: 15, price: 56000, status: '판매중', sameDayShip: true, deliveryDate: '2026-04-03', variantCount: 2 },
  { id: 'P008', name: 'Isopropanol', cas: '67-63-0', catalogNo: 'I0158', category: '용매', stock: 8, price: 78900, status: '판매중', sameDayShip: true, deliveryDate: '2026-04-03', variantCount: 2 },
  { id: 'P009', name: 'Acetic acid, glacial', cas: '64-19-7', catalogNo: 'A0822', category: '유기화합물', stock: 20, price: 67200, status: '판매중', sameDayShip: true, deliveryDate: '2026-04-03', variantCount: 2 },
  { id: 'P010', name: 'Nitric acid', cas: '7697-37-2', catalogNo: 'N0012', category: '무기화합물', stock: 50, price: 3000, status: '판매중', sameDayShip: true, deliveryDate: '2026-04-03', variantCount: 1 },
  { id: 'P011', name: 'PIPES, High Purity', cas: '5625-37-6', catalogNo: 'P0058', category: '생화학시약', stock: 1, price: 226200, status: '판매중', sameDayShip: false, deliveryDate: '2026-04-07', variantCount: 1 },
  { id: 'P012', name: 'Butylated hydroxytoluene', cas: '128-37-0', catalogNo: '44844', category: '유기화합물', stock: 10, price: 88830, salePrice: 79947, status: '판매중', sameDayShip: true, deliveryDate: '2026-04-03', variantCount: 2 },
];

// ===== RETURNS =====
export const mockReturns: ReturnRequest[] = [
  { id: 'CR-0401-001', type: '취소', orderId: 'ORD-0401-005', requester: '김연구', org: '서울대', product: 'Toluene, HPLC 2.5L', reason: '단순변심', refundAmount: 132000, status: '접수', requestedDate: '2026-04-01' },
  { id: 'CR-0330-002', type: '반품', orderId: 'ORD-0328-003', requester: '이박사', org: 'KAIST', product: 'NaOH pellets 500g', reason: '제품 불량 (라벨 훼손)', refundAmount: 45600, status: '처리중', requestedDate: '2026-03-30' },
  { id: 'CR-0325-001', type: '취소', orderId: 'ORD-0325-007', requester: '박연구', org: '포항공대', product: 'Acetone 2.5L', reason: '중복 주문', refundAmount: 87800, status: '완료', requestedDate: '2026-03-25' },
  { id: 'CR-0320-003', type: '반품', orderId: 'ORD-0318-011', requester: '최과장', org: 'LG화학', product: 'HCl 2.5L', reason: '오배송', refundAmount: 56000, status: '완료', requestedDate: '2026-03-20' },
];

// ===== SETTLEMENTS =====
export const mockSettlements: Settlement[] = [
  { id: 'STL-2026-W14', periodStart: '2026-03-25', periodEnd: '2026-03-31', totalSales: 4280000, platformFee: 149800, paymentFee: 42800, deduction: 0, netAmount: 4087400, scheduledDate: '2026-04-07', status: '예정' },
  { id: 'STL-2026-W13', periodStart: '2026-03-18', periodEnd: '2026-03-24', totalSales: 5120000, platformFee: 179200, paymentFee: 51200, deduction: 132000, netAmount: 4757600, scheduledDate: '2026-03-31', paidDate: '2026-03-31', status: '완료' },
  { id: 'STL-2026-W12', periodStart: '2026-03-11', periodEnd: '2026-03-17', totalSales: 3890000, platformFee: 136150, paymentFee: 38900, deduction: 45600, netAmount: 3669350, scheduledDate: '2026-03-24', paidDate: '2026-03-24', status: '완료' },
  { id: 'STL-2026-W11', periodStart: '2026-03-04', periodEnd: '2026-03-10', totalSales: 5160000, platformFee: 180600, paymentFee: 51600, deduction: 0, netAmount: 4927800, scheduledDate: '2026-03-17', paidDate: '2026-03-17', status: '완료' },
];

// ===== INQUIRIES =====
export const mockInquiries: SupplierInquiry[] = [
  { id: 'INQ-001', type: '제품', title: 'Ethyl alcohol COA 요청', requester: '김연구', org: '서울대', orderId: 'ORD-0401-012', date: '2026-04-02', status: '미답변' },
  { id: 'INQ-002', type: '배송', title: '배송 지연 문의', requester: '이박사', org: 'KAIST', orderId: 'ORD-0330-008', date: '2026-04-01', status: '미답변' },
  { id: 'INQ-003', type: '가격', title: '대량 구매 할인 문의', requester: '최과장', org: 'LG화학', date: '2026-04-01', status: '미답변' },
  { id: 'INQ-004', type: '제품', title: 'Methanol 재입고 일정', requester: '박연구', org: '포항공대', date: '2026-03-30', status: '답변완료' },
  { id: 'INQ-005', type: '주문', title: '주문 수량 변경 요청', requester: '정연구', org: '연세대', orderId: 'ORD-0328-003', date: '2026-03-29', status: '답변완료' },
];

// ===== REVIEWS =====
export const mockReviews: ProductReview[] = [
  { id: 'R-001', product: 'Ethyl alcohol, Pure 500mL', rating: 5, author: '김연구', org: '서울대', content: '순도가 높고 배송이 빨라서 항상 만족합니다. 연구실에서 자주 사용하는 시약이라 재주문도 편리해요.', date: '2026-04-01' },
  { id: 'R-002', product: 'Acetone, ACS Reagent 2.5L', rating: 4, author: '이박사', org: 'KAIST', content: '품질은 좋으나 포장이 좀 아쉽습니다. 배송 중 외부 박스가 찌그러져 있었어요.', date: '2026-03-29', reply: '불편을 드려 죄송합니다. 포장 개선하도록 하겠습니다.' },
  { id: 'R-003', product: 'Dichloromethane, ACS 2.5L', rating: 5, author: '박연구', org: '포항공대', content: 'ACS 등급답게 순도가 정확하고 실험 결과가 일관됩니다.', date: '2026-03-27' },
  { id: 'R-004', product: 'NaOH pellets 1kg', rating: 3, author: '최과장', org: 'LG화학', content: '기본적인 품질은 괜찮으나 가격 대비 용량이 아쉬워요.', date: '2026-03-25' },
];

// ===== CHAT ROOMS =====
export const mockChatRooms: ChatRoom[] = [
  { id: 'CH-001', name: '김연구 (서울대)', lastMessage: 'COA 파일 보내드립니다', time: '10:30', unread: 2 },
  { id: 'CH-002', name: '이박사 (KAIST)', lastMessage: '배송 언제 도착하나요?', time: '어제', unread: 0 },
  { id: 'CH-003', name: '최과장 (LG화학)', lastMessage: '대량 구매 견적 가능할까요?', time: '3/30', unread: 0 },
];

// ===== NOTIFICATIONS =====
export const mockNotifications: SupplierNotification[] = [
  { id: 'N-001', type: 'new_order', title: '신규 주문', message: '김연구(서울대)님이 Ethyl alcohol 500mL 외 2건을 주문했습니다.', time: '10분 전', isRead: false },
  { id: 'N-002', type: 'new_quote', title: '견적 요청', message: '김연구(서울대)님이 3건의 견적을 요청했습니다.', time: '25분 전', isRead: false },
  { id: 'N-003', type: 'inquiry', title: '새 문의', message: '이박사(KAIST)님이 배송 관련 문의를 남겼습니다.', time: '1시간 전', isRead: false },
  { id: 'N-004', type: 'new_order', title: '신규 주문', message: '최과장(LG화학)님이 NaOH pellets 1kg 외 1건을 주문했습니다.', time: '2시간 전', isRead: false },
  { id: 'N-005', type: 'low_stock', title: '재고 부족', message: 'Toluene, HPLC Grade 2.5L 재고가 안전재고(5) 이하입니다. (현재: 2)', time: '3시간 전', isRead: false },
  { id: 'N-006', type: 'return', title: '반품 요청', message: '김연구님이 Toluene 2.5L 주문 취소를 요청했습니다.', time: '5시간 전', isRead: true },
  { id: 'N-007', type: 'settlement', title: '정산 완료', message: '3/18~3/24 정산금액 ₩4,808,800이 입금되었습니다.', time: '어제', isRead: true },
  { id: 'N-008', type: 'new_order', title: '신규 주문', message: '정연구(연세대)님이 Acetone 2.5L을 주문했습니다.', time: '어제', isRead: true },
  { id: 'N-009', type: 'inquiry', title: '문의 답변 확인', message: '박연구(포항공대)님이 답변을 확인했습니다.', time: '2일 전', isRead: true },
  { id: 'N-010', type: 'system', title: '시스템 공지', message: '4월 정산 스케줄이 업데이트되었습니다.', time: '3일 전', isRead: true },
];

// ===== TOP PRODUCTS =====
export const mockTopProducts: TopProduct[] = [
  { rank: 1, name: 'Ethyl alcohol, Pure', catalogNo: '459844', orders: 48, revenue: 7595472 },
  { rank: 2, name: 'Methanol, HPLC Grade', catalogNo: 'M0202', orders: 35, revenue: 3447500 },
  { rank: 3, name: 'Acetone, ACS Reagent', catalogNo: 'A0003', orders: 29, revenue: 2546200 },
  { rank: 4, name: 'Dichloromethane, ACS', catalogNo: 'D0148', orders: 22, revenue: 3190000 },
  { rank: 5, name: 'Sodium hydroxide, pellets', catalogNo: 'S0401', orders: 18, revenue: 820800 },
];

// ===== UTILITIES =====
export const formatCurrency = (n: number) => '₩' + n.toLocaleString();
