'use client';

import { useState, useMemo } from 'react';
import {
  ShoppingCart, Package, Truck, Clock, Search, Filter, Download,
  ChevronDown, Eye, X, RotateCcw, FileText, ArrowRight,
  Calendar, MapPin, CreditCard, CheckCircle, XCircle,
  BarChart3, TrendingUp, Users, Building2, DollarSign,
  RefreshCw, Upload, ExternalLink, AlertTriangle, Ban,
  ClipboardList, Send, Timer, Target, Percent,
  ImageIcon, MessageSquare, ChevronRight,
} from 'lucide-react';
import { AdminTabs } from '@/components/shared/AdminTabs';
import { Modal } from '@/components/shared/Modal';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Pagination } from '@/components/shared/Pagination';
import { StatCard } from '@/components/shared/StatCard';
import { useAdminStore } from '@/stores/adminStore';

// ─── Constants ───────────────────────────────────────────────────────────────

const TABS = [
  { id: 'orders', label: '주문 목록' },
  { id: 'shipping', label: '배송 관리' },
  { id: 'returns', label: '반품/취소 처리' },
  { id: 'quotes', label: '견적 관리' },
  { id: 'analytics', label: '매출 분석' },
];

const ORDERS_PER_PAGE = 8;

type OrderStatus = '전체' | '주문접수' | '처리중' | '배송중' | '완료' | '취소';
const orderStatuses: OrderStatus[] = ['전체', '주문접수', '처리중', '배송중', '완료', '취소'];

const orderStatusColors: Record<string, string> = {
  '주문접수': 'blue',
  '처리중': 'amber',
  '배송중': 'purple',
  '완료': 'emerald',
  '취소': 'red',
};

const returnStatusColors: Record<string, string> = {
  '접수': 'blue',
  '검토중': 'amber',
  '승인': 'emerald',
  '거절': 'red',
};

const quoteStatusColors: Record<string, string> = {
  '견적대기': 'amber',
  '견적발송': 'blue',
  '주문전환': 'emerald',
  '만료': 'gray',
};

const shippingStatusColors: Record<string, string> = {
  '출고대기': 'amber',
  '배송중': 'purple',
  '배송완료': 'emerald',
};

// ─── Mock Data: Orders ──────────────────────────────────────────────────────

interface OrderItem {
  name: string;
  catalogNo: string;
  qty: number;
  unitPrice: number;
}

interface Order {
  id: string;
  orderNo: string;
  customerName: string;
  organization: string;
  items: OrderItem[];
  totalAmount: number;
  orderDate: string;
  status: '주문접수' | '처리중' | '배송중' | '완료' | '취소';
  address: string;
  paymentMethod: string;
  phone: string;
  email: string;
}

const mockOrders: Order[] = [
  { id: '1', orderNo: 'ORD-2026-0401', customerName: '김연구', organization: '서울대학교 화학과', items: [{ name: 'Acetonitrile (HPLC grade)', catalogNo: 'ACN-001', qty: 5, unitPrice: 45000 }, { name: 'Methanol (ACS grade)', catalogNo: 'MET-002', qty: 3, unitPrice: 32000 }], totalAmount: 321000, orderDate: '2026-04-03', status: '주문접수', address: '서울시 관악구 관악로 1 서울대학교 화학관 301호', paymentMethod: '법인카드', phone: '010-1234-5678', email: 'kimr@snu.ac.kr' },
  { id: '2', orderNo: 'ORD-2026-0402', customerName: '이실험', organization: 'KAIST 생명과학과', items: [{ name: 'Sodium Chloride (99.5%)', catalogNo: 'NAC-003', qty: 10, unitPrice: 15000 }], totalAmount: 150000, orderDate: '2026-04-03', status: '주문접수', address: '대전시 유성구 대학로 291 KAIST N1동 402호', paymentMethod: '계좌이체', phone: '010-2345-6789', email: 'leeexp@kaist.ac.kr' },
  { id: '3', orderNo: 'ORD-2026-0403', customerName: '박분석', organization: '한국화학연구원', items: [{ name: 'Hydrochloric Acid (37%)', catalogNo: 'HCL-004', qty: 2, unitPrice: 28000 }, { name: 'Sulfuric Acid (98%)', catalogNo: 'SUL-005', qty: 2, unitPrice: 35000 }, { name: 'Nitric Acid (65%)', catalogNo: 'NIT-006', qty: 1, unitPrice: 42000 }], totalAmount: 168000, orderDate: '2026-04-02', status: '처리중', address: '대전시 유성구 가정로 141 한국화학연구원 B동', paymentMethod: '법인카드', phone: '010-3456-7890', email: 'parkana@krict.re.kr' },
  { id: '4', orderNo: 'ORD-2026-0404', customerName: '최바이오', organization: '연세대학교 약학과', items: [{ name: 'Ethanol (99.9%)', catalogNo: 'ETH-007', qty: 20, unitPrice: 22000 }], totalAmount: 440000, orderDate: '2026-04-02', status: '처리중', address: '서울시 서대문구 연세로 50 연세대학교 약학관 205호', paymentMethod: '후불결제', phone: '010-4567-8901', email: 'choibio@yonsei.ac.kr' },
  { id: '5', orderNo: 'ORD-2026-0405', customerName: '정촉매', organization: 'POSTECH 화학공학과', items: [{ name: 'Platinum on Carbon (5%)', catalogNo: 'PTC-008', qty: 1, unitPrice: 1250000 }, { name: 'Palladium Chloride', catalogNo: 'PDC-009', qty: 1, unitPrice: 890000 }], totalAmount: 2140000, orderDate: '2026-04-01', status: '배송중', address: '포항시 남구 청암로 77 POSTECH 화공관 B1층', paymentMethod: '법인카드', phone: '010-5678-9012', email: 'jungcat@postech.ac.kr' },
  { id: '6', orderNo: 'ORD-2026-0406', customerName: '강소재', organization: '고려대학교 신소재공학과', items: [{ name: 'Titanium Dioxide (99%)', catalogNo: 'TIO-010', qty: 5, unitPrice: 65000 }, { name: 'Zinc Oxide (99.9%)', catalogNo: 'ZNO-011', qty: 3, unitPrice: 48000 }], totalAmount: 469000, orderDate: '2026-04-01', status: '배송중', address: '서울시 성북구 안암로 145 고려대학교 공학관 701호', paymentMethod: '계좌이체', phone: '010-6789-0123', email: 'kangmat@korea.ac.kr' },
  { id: '7', orderNo: 'ORD-2026-0407', customerName: '윤유기', organization: '성균관대학교 화학과', items: [{ name: 'Toluene (ACS grade)', catalogNo: 'TOL-012', qty: 10, unitPrice: 18000 }], totalAmount: 180000, orderDate: '2026-03-31', status: '완료', address: '수원시 장안구 서부로 2066 성균관대학교 자연과학관', paymentMethod: '법인카드', phone: '010-7890-1234', email: 'yoonorg@skku.edu' },
  { id: '8', orderNo: 'ORD-2026-0408', customerName: '한나노', organization: '한양대학교 나노공학과', items: [{ name: 'Silver Nanoparticles (20nm)', catalogNo: 'AGN-013', qty: 2, unitPrice: 380000 }, { name: 'Gold Nanoparticles (10nm)', catalogNo: 'AUN-014', qty: 1, unitPrice: 520000 }], totalAmount: 1280000, orderDate: '2026-03-31', status: '완료', address: '서울시 성동구 왕십리로 222 한양대학교 나노관 503호', paymentMethod: '법인카드', phone: '010-8901-2345', email: 'hannano@hanyang.ac.kr' },
  { id: '9', orderNo: 'ORD-2026-0409', customerName: '서환경', organization: '부산대학교 환경공학과', items: [{ name: 'Activated Carbon', catalogNo: 'ACB-015', qty: 15, unitPrice: 25000 }], totalAmount: 375000, orderDate: '2026-03-30', status: '완료', address: '부산시 금정구 부산대학로 63 부산대학교 환경관 B2층', paymentMethod: '계좌이체', phone: '010-9012-3456', email: 'seoenv@pusan.ac.kr' },
  { id: '10', orderNo: 'ORD-2026-0410', customerName: '임전기', organization: '전북대학교 전기전자공학과', items: [{ name: 'Copper Sulfate (99%)', catalogNo: 'CUS-016', qty: 8, unitPrice: 12000 }], totalAmount: 96000, orderDate: '2026-03-30', status: '취소', address: '전주시 덕진구 백제대로 567 전북대학교 공대 3호관', paymentMethod: '법인카드', phone: '010-0123-4567', email: 'limee@jbnu.ac.kr' },
  { id: '11', orderNo: 'ORD-2026-0411', customerName: '오폴리', organization: '경북대학교 고분자공학과', items: [{ name: 'Polyethylene Glycol (MW 6000)', catalogNo: 'PEG-017', qty: 4, unitPrice: 55000 }, { name: 'Polystyrene Beads', catalogNo: 'PSB-018', qty: 2, unitPrice: 72000 }], totalAmount: 364000, orderDate: '2026-03-29', status: '완료', address: '대구시 북구 대학로 80 경북대학교 공대 5호관', paymentMethod: '후불결제', phone: '010-1111-2222', email: 'ohpoly@knu.ac.kr' },
  { id: '12', orderNo: 'ORD-2026-0412', customerName: '노생화', organization: '이화여자대학교 생명과학과', items: [{ name: 'Bovine Serum Albumin', catalogNo: 'BSA-019', qty: 3, unitPrice: 185000 }], totalAmount: 555000, orderDate: '2026-03-29', status: '배송중', address: '서울시 서대문구 이화여대길 52 이화여자대학교 생명관', paymentMethod: '법인카드', phone: '010-2222-3333', email: 'nobiochem@ewha.ac.kr' },
  { id: '13', orderNo: 'ORD-2026-0413', customerName: '문무기', organization: '충남대학교 화학과', items: [{ name: 'Iron(III) Chloride', catalogNo: 'FEC-020', qty: 6, unitPrice: 28000 }, { name: 'Copper(II) Acetate', catalogNo: 'CUA-021', qty: 4, unitPrice: 35000 }], totalAmount: 308000, orderDate: '2026-03-28', status: '완료', address: '대전시 유성구 대학로 99 충남대학교 자연과학대학', paymentMethod: '계좌이체', phone: '010-3333-4444', email: 'mooninorg@cnu.ac.kr' },
  { id: '14', orderNo: 'ORD-2026-0414', customerName: '배분광', organization: '광주과학기술원', items: [{ name: 'Rhodamine 6G', catalogNo: 'RHO-022', qty: 2, unitPrice: 420000 }], totalAmount: 840000, orderDate: '2026-03-28', status: '주문접수', address: '광주시 북구 첨단과기로 123 GIST 오룡관', paymentMethod: '법인카드', phone: '010-4444-5555', email: 'baespect@gist.ac.kr' },
  { id: '15', orderNo: 'ORD-2026-0415', customerName: '송재료', organization: '울산과학기술원', items: [{ name: 'Graphene Oxide', catalogNo: 'GRO-023', qty: 3, unitPrice: 290000 }, { name: 'Carbon Nanotube (MWCNT)', catalogNo: 'CNT-024', qty: 2, unitPrice: 350000 }], totalAmount: 1570000, orderDate: '2026-03-27', status: '취소', address: '울산시 울주군 유니스트길 50 UNIST 연구관', paymentMethod: '후불결제', phone: '010-5555-6666', email: 'songmat@unist.ac.kr' },
];

// ─── Mock Data: Shipping ────────────────────────────────────────────────────

interface ShippingItem {
  id: string;
  orderNo: string;
  customerName: string;
  carrier: string;
  trackingNo: string;
  status: '출고대기' | '배송중' | '배송완료';
  shipDate: string;
  estimatedArrival: string;
}

const mockShipping: ShippingItem[] = [
  { id: 's1', orderNo: 'ORD-2026-0401', customerName: '김연구', carrier: 'CJ대한통운', trackingNo: '', status: '출고대기', shipDate: '', estimatedArrival: '2026-04-05' },
  { id: 's2', orderNo: 'ORD-2026-0402', customerName: '이실험', carrier: '한진택배', trackingNo: '', status: '출고대기', shipDate: '', estimatedArrival: '2026-04-05' },
  { id: 's3', orderNo: 'ORD-2026-0403', customerName: '박분석', carrier: 'CJ대한통운', trackingNo: '6012345678901', status: '출고대기', shipDate: '', estimatedArrival: '2026-04-04' },
  { id: 's4', orderNo: 'ORD-2026-0404', customerName: '최바이오', carrier: '로젠택배', trackingNo: '', status: '출고대기', shipDate: '', estimatedArrival: '2026-04-05' },
  { id: 's5', orderNo: 'ORD-2026-0405', customerName: '정촉매', carrier: 'CJ대한통운', trackingNo: '6012345678902', status: '배송중', shipDate: '2026-04-01', estimatedArrival: '2026-04-03' },
  { id: 's6', orderNo: 'ORD-2026-0406', customerName: '강소재', carrier: '한진택배', trackingNo: '4012345678901', status: '배송중', shipDate: '2026-04-01', estimatedArrival: '2026-04-03' },
  { id: 's7', orderNo: 'ORD-2026-0407', customerName: '윤유기', carrier: 'CJ대한통운', trackingNo: '6012345678903', status: '배송완료', shipDate: '2026-03-31', estimatedArrival: '2026-04-02' },
  { id: 's8', orderNo: 'ORD-2026-0408', customerName: '한나노', carrier: '로젠택배', trackingNo: '2012345678901', status: '배송완료', shipDate: '2026-03-31', estimatedArrival: '2026-04-02' },
  { id: 's9', orderNo: 'ORD-2026-0412', customerName: '노생화', carrier: 'CJ대한통운', trackingNo: '6012345678904', status: '배송중', shipDate: '2026-04-02', estimatedArrival: '2026-04-04' },
  { id: 's10', orderNo: 'ORD-2026-0411', customerName: '오폴리', carrier: '한진택배', trackingNo: '4012345678902', status: '배송완료', shipDate: '2026-03-29', estimatedArrival: '2026-03-31' },
  { id: 's11', orderNo: 'ORD-2026-0413', customerName: '문무기', carrier: 'CJ대한통운', trackingNo: '6012345678905', status: '배송완료', shipDate: '2026-03-28', estimatedArrival: '2026-03-30' },
  { id: 's12', orderNo: 'ORD-2026-0409', customerName: '서환경', carrier: '로젠택배', trackingNo: '2012345678902', status: '배송완료', shipDate: '2026-03-30', estimatedArrival: '2026-04-01' },
];

// ─── Mock Data: Returns/Cancellations ───────────────────────────────────────

interface ReturnRequest {
  id: string;
  requestNo: string;
  orderNo: string;
  customerName: string;
  type: '반품' | '취소';
  reason: string;
  amount: number;
  requestDate: string;
  status: '접수' | '검토중' | '승인' | '거절';
  adminMemo: string;
}

const mockReturns: ReturnRequest[] = [
  { id: 'r1', requestNo: 'RET-2026-001', orderNo: 'ORD-2026-0410', customerName: '임전기', type: '취소', reason: '연구 프로젝트 일정 변경으로 불필요', amount: 96000, requestDate: '2026-03-30', status: '승인', adminMemo: '주문 취소 확인. 환불 처리 완료.' },
  { id: 'r2', requestNo: 'RET-2026-002', orderNo: 'ORD-2026-0415', customerName: '송재료', type: '취소', reason: '중복 주문', amount: 1570000, requestDate: '2026-03-27', status: '승인', adminMemo: '중복 주문 확인. 환불 완료.' },
  { id: 'r3', requestNo: 'RET-2026-003', orderNo: 'ORD-2026-0389', customerName: '유기합', type: '반품', reason: '제품 불량 - 개봉 시 변색 확인', amount: 245000, requestDate: '2026-04-02', status: '접수', adminMemo: '' },
  { id: 'r4', requestNo: 'RET-2026-004', orderNo: 'ORD-2026-0392', customerName: '최분자', type: '반품', reason: '오배송 - 주문과 다른 제품 수령', amount: 380000, requestDate: '2026-04-01', status: '검토중', adminMemo: '사진 확인 중' },
  { id: 'r5', requestNo: 'RET-2026-005', orderNo: 'ORD-2026-0395', customerName: '정세라', type: '취소', reason: '예산 삭감으로 주문 취소', amount: 520000, requestDate: '2026-04-03', status: '접수', adminMemo: '' },
  { id: 'r6', requestNo: 'RET-2026-006', orderNo: 'ORD-2026-0378', customerName: '강시료', type: '반품', reason: '유효기간 임박 제품 수령', amount: 158000, requestDate: '2026-03-29', status: '승인', adminMemo: '유효기간 확인 완료. 교환 처리.' },
  { id: 'r7', requestNo: 'RET-2026-007', orderNo: 'ORD-2026-0382', customerName: '윤표준', type: '반품', reason: '포장 파손으로 시약 누출', amount: 290000, requestDate: '2026-03-28', status: '거절', adminMemo: '배송사 책임. 배송사에 클레임 접수.' },
  { id: 'r8', requestNo: 'RET-2026-008', orderNo: 'ORD-2026-0399', customerName: '한효소', type: '반품', reason: '규격 오주문 (100ml 주문했으나 500ml 필요)', amount: 81000, requestDate: '2026-04-02', status: '검토중', adminMemo: '교환 가능 여부 확인 중' },
];

// ─── Mock Data: Quotes ──────────────────────────────────────────────────────

interface QuoteItem {
  name: string;
  qty: number;
  unitPrice: number;
}

interface Quote {
  id: string;
  quoteNo: string;
  organization: string;
  requester: string;
  items: QuoteItem[];
  estimatedAmount: number;
  requestDate: string;
  validUntil: string;
  status: '견적대기' | '견적발송' | '주문전환' | '만료';
}

const mockQuotes: Quote[] = [
  { id: 'q1', quoteNo: 'QUO-2026-001', organization: '서울대학교 화학과', requester: '김연구', items: [{ name: 'Acetonitrile (HPLC grade) 2.5L', qty: 10, unitPrice: 45000 }, { name: 'Methanol (HPLC grade) 2.5L', qty: 10, unitPrice: 32000 }], estimatedAmount: 770000, requestDate: '2026-04-01', validUntil: '2026-04-15', status: '견적대기' },
  { id: 'q2', quoteNo: 'QUO-2026-002', organization: 'KAIST 생명과학과', requester: '이실험', items: [{ name: 'PBS Buffer 10X (1L)', qty: 20, unitPrice: 25000 }], estimatedAmount: 500000, requestDate: '2026-03-30', validUntil: '2026-04-13', status: '견적대기' },
  { id: 'q3', quoteNo: 'QUO-2026-003', organization: '한국화학연구원', requester: '박분석', items: [{ name: 'Standard Reference Material Kit', qty: 2, unitPrice: 1500000 }, { name: 'Calibration Solution Set', qty: 5, unitPrice: 120000 }], estimatedAmount: 3600000, requestDate: '2026-03-28', validUntil: '2026-04-11', status: '견적발송' },
  { id: 'q4', quoteNo: 'QUO-2026-004', organization: '연세대학교 약학과', requester: '최바이오', items: [{ name: 'Cell Culture Media (DMEM)', qty: 50, unitPrice: 35000 }], estimatedAmount: 1750000, requestDate: '2026-03-27', validUntil: '2026-04-10', status: '견적발송' },
  { id: 'q5', quoteNo: 'QUO-2026-005', organization: 'POSTECH 화학공학과', requester: '정촉매', items: [{ name: 'Catalyst Support Materials', qty: 10, unitPrice: 280000 }, { name: 'Reactor Tubes (Quartz)', qty: 5, unitPrice: 150000 }], estimatedAmount: 3550000, requestDate: '2026-03-25', validUntil: '2026-04-08', status: '견적발송' },
  { id: 'q6', quoteNo: 'QUO-2026-006', organization: '고려대학교 신소재공학과', requester: '강소재', items: [{ name: 'Sputtering Target (Au)', qty: 3, unitPrice: 850000 }], estimatedAmount: 2550000, requestDate: '2026-03-22', validUntil: '2026-04-05', status: '주문전환' },
  { id: 'q7', quoteNo: 'QUO-2026-007', organization: '성균관대학교 화학과', requester: '윤유기', items: [{ name: 'Organic Solvent Set (12종)', qty: 2, unitPrice: 680000 }], estimatedAmount: 1360000, requestDate: '2026-03-20', validUntil: '2026-04-03', status: '주문전환' },
  { id: 'q8', quoteNo: 'QUO-2026-008', organization: '한양대학교 나노공학과', requester: '한나노', items: [{ name: 'Nanoparticle Synthesis Kit', qty: 1, unitPrice: 2200000 }], estimatedAmount: 2200000, requestDate: '2026-03-18', validUntil: '2026-04-01', status: '주문전환' },
  { id: 'q9', quoteNo: 'QUO-2026-009', organization: '부산대학교 환경공학과', requester: '서환경', items: [{ name: 'Water Quality Test Kit', qty: 5, unitPrice: 180000 }], estimatedAmount: 900000, requestDate: '2026-03-15', validUntil: '2026-03-29', status: '만료' },
  { id: 'q10', quoteNo: 'QUO-2026-010', organization: '전북대학교 전기전자공학과', requester: '임전기', items: [{ name: 'Electrochemistry Kit', qty: 2, unitPrice: 950000 }], estimatedAmount: 1900000, requestDate: '2026-03-12', validUntil: '2026-03-26', status: '만료' },
  { id: 'q11', quoteNo: 'QUO-2026-011', organization: '경북대학교 고분자공학과', requester: '오폴리', items: [{ name: 'Polymer Characterization Standards', qty: 3, unitPrice: 420000 }], estimatedAmount: 1260000, requestDate: '2026-03-20', validUntil: '2026-04-03', status: '주문전환' },
  { id: 'q12', quoteNo: 'QUO-2026-012', organization: '이화여자대학교 생명과학과', requester: '노생화', items: [{ name: 'Protein Assay Kit', qty: 10, unitPrice: 85000 }, { name: 'Western Blot Supplies', qty: 5, unitPrice: 120000 }], estimatedAmount: 1450000, requestDate: '2026-03-25', validUntil: '2026-04-08', status: '견적발송' },
  { id: 'q13', quoteNo: 'QUO-2026-013', organization: '충남대학교 화학과', requester: '문무기', items: [{ name: 'Inorganic Reagent Set (20종)', qty: 1, unitPrice: 1800000 }], estimatedAmount: 1800000, requestDate: '2026-04-02', validUntil: '2026-04-16', status: '견적대기' },
  { id: 'q14', quoteNo: 'QUO-2026-014', organization: '광주과학기술원', requester: '배분광', items: [{ name: 'UV-Vis Calibration Standards', qty: 2, unitPrice: 650000 }], estimatedAmount: 1300000, requestDate: '2026-04-01', validUntil: '2026-04-15', status: '견적대기' },
  { id: 'q15', quoteNo: 'QUO-2026-015', organization: '울산과학기술원', requester: '송재료', items: [{ name: 'Graphene Synthesis Precursors', qty: 5, unitPrice: 390000 }], estimatedAmount: 1950000, requestDate: '2026-03-28', validUntil: '2026-04-11', status: '견적발송' },
];

// ─── Mock Data: Analytics ───────────────────────────────────────────────────

const dailySalesData = [
  { date: '03/21', sales: 3200000, orders: 22 },
  { date: '03/22', sales: 2800000, orders: 19 },
  { date: '03/23', sales: 4100000, orders: 28 },
  { date: '03/24', sales: 3500000, orders: 24 },
  { date: '03/25', sales: 4800000, orders: 33 },
  { date: '03/26', sales: 3900000, orders: 27 },
  { date: '03/27', sales: 2100000, orders: 14 },
  { date: '03/28', sales: 3700000, orders: 25 },
  { date: '03/29', sales: 4200000, orders: 29 },
  { date: '03/30', sales: 5100000, orders: 35 },
  { date: '03/31', sales: 4600000, orders: 31 },
  { date: '04/01', sales: 3800000, orders: 26 },
  { date: '04/02', sales: 4400000, orders: 30 },
  { date: '04/03', sales: 5000000, orders: 34 },
];

const categorySalesData = [
  { category: '유기화합물', amount: 15800000, percentage: 34.9 },
  { category: '무기화합물', amount: 8200000, percentage: 18.1 },
  { category: '생화학시약', amount: 7500000, percentage: 16.6 },
  { category: '분석용시약', amount: 6100000, percentage: 13.5 },
  { category: '실험소모품', amount: 5200000, percentage: 11.5 },
  { category: '기타', amount: 2430000, percentage: 5.4 },
];

const topOrganizations = [
  { rank: 1, name: '서울대학교', amount: 8520000, orders: 45, percentage: 18.8 },
  { rank: 2, name: 'KAIST', amount: 6340000, orders: 38, percentage: 14.0 },
  { rank: 3, name: '한국화학연구원', amount: 5890000, orders: 32, percentage: 13.0 },
  { rank: 4, name: '연세대학교', amount: 4210000, orders: 28, percentage: 9.3 },
  { rank: 5, name: 'POSTECH', amount: 3780000, orders: 25, percentage: 8.4 },
  { rank: 6, name: '고려대학교', amount: 3150000, orders: 22, percentage: 7.0 },
  { rank: 7, name: '성균관대학교', amount: 2680000, orders: 19, percentage: 5.9 },
  { rank: 8, name: '한양대학교', amount: 2450000, orders: 17, percentage: 5.4 },
  { rank: 9, name: '이화여자대학교', amount: 2100000, orders: 15, percentage: 4.6 },
  { rank: 10, name: '충남대학교', amount: 1680000, orders: 12, percentage: 3.7 },
];

// ─── Helper ─────────────────────────────────────────────────────────────────

function formatCurrency(value: number): string {
  return value.toLocaleString('ko-KR');
}

function formatShortCurrency(value: number): string {
  if (value >= 10000000) return `${(value / 10000000).toFixed(0)}천만`;
  if (value >= 10000) return `${(value / 10000).toFixed(0)}만`;
  return formatCurrency(value);
}

// ─── Page ───────────────────────────────────────────────────────────────────

export default function OrdersMgmtPage() {
  const { activeModal, modalData, openModal, closeModal, selectedUserIds, toggleUserSelection, selectAllUsers, clearUserSelection } = useAdminStore();

  // Tab state
  const [activeTab, setActiveTab] = useState('orders');

  // Toast
  const [toast, setToast] = useState<string | null>(null);
  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  }

  // ─── Tab 1: Orders state ────────────────────────────────────────────────
  const [orderStatusFilter, setOrderStatusFilter] = useState<OrderStatus>('전체');
  const [orderSearch, setOrderSearch] = useState('');
  const [orderDateFrom, setOrderDateFrom] = useState('');
  const [orderDateTo, setOrderDateTo] = useState('');
  const [orderPage, setOrderPage] = useState(1);
  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([]);

  // ─── Tab 2: Shipping state ──────────────────────────────────────────────
  const [shippingData, setShippingData] = useState<ShippingItem[]>([...mockShipping]);
  const [trackingInputs, setTrackingInputs] = useState<Record<string, string>>({});

  // ─── Tab 3: Returns state ───────────────────────────────────────────────
  const [returnSearch, setReturnSearch] = useState('');
  const [returnTypeFilter, setReturnTypeFilter] = useState<'전체' | '반품' | '취소'>('전체');

  // ─── Tab 4: Quotes state ────────────────────────────────────────────────
  const [quoteSearch, setQuoteSearch] = useState('');
  const [quoteStatusFilter, setQuoteStatusFilter] = useState<'전체' | '견적대기' | '견적발송' | '주문전환' | '만료'>('전체');

  // ─── Tab 5: Analytics state ─────────────────────────────────────────────
  const [chartMode, setChartMode] = useState<'sales' | 'orders'>('sales');

  // ─── Filtered orders ────────────────────────────────────────────────────
  const filteredOrders = useMemo(() => {
    return mockOrders.filter((o) => {
      const matchStatus = orderStatusFilter === '전체' || o.status === orderStatusFilter;
      const q = orderSearch.toLowerCase();
      const matchSearch = !q || o.orderNo.toLowerCase().includes(q) || o.customerName.toLowerCase().includes(q) || o.organization.toLowerCase().includes(q);
      const matchDateFrom = !orderDateFrom || o.orderDate >= orderDateFrom;
      const matchDateTo = !orderDateTo || o.orderDate <= orderDateTo;
      return matchStatus && matchSearch && matchDateFrom && matchDateTo;
    });
  }, [orderStatusFilter, orderSearch, orderDateFrom, orderDateTo]);

  const orderTotalPages = Math.max(1, Math.ceil(filteredOrders.length / ORDERS_PER_PAGE));
  const pagedOrders = filteredOrders.slice((orderPage - 1) * ORDERS_PER_PAGE, orderPage * ORDERS_PER_PAGE);

  // ─── Filtered returns ───────────────────────────────────────────────────
  const filteredReturns = useMemo(() => {
    return mockReturns.filter((r) => {
      const matchType = returnTypeFilter === '전체' || r.type === returnTypeFilter;
      const q = returnSearch.toLowerCase();
      const matchSearch = !q || r.requestNo.toLowerCase().includes(q) || r.orderNo.toLowerCase().includes(q) || r.customerName.toLowerCase().includes(q);
      return matchType && matchSearch;
    });
  }, [returnTypeFilter, returnSearch]);

  // ─── Filtered quotes ────────────────────────────────────────────────────
  const filteredQuotes = useMemo(() => {
    return mockQuotes.filter((qu) => {
      const matchStatus = quoteStatusFilter === '전체' || qu.status === quoteStatusFilter;
      const q = quoteSearch.toLowerCase();
      const matchSearch = !q || qu.quoteNo.toLowerCase().includes(q) || qu.organization.toLowerCase().includes(q) || qu.requester.toLowerCase().includes(q);
      return matchStatus && matchSearch;
    });
  }, [quoteStatusFilter, quoteSearch]);

  // ─── Order selection ────────────────────────────────────────────────────
  function toggleOrderSelect(id: string) {
    setSelectedOrderIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  }

  function selectAllPageOrders() {
    const ids = pagedOrders.map((o) => o.id);
    const allSelected = ids.every((id) => selectedOrderIds.includes(id));
    if (allSelected) {
      setSelectedOrderIds((prev) => prev.filter((id) => !ids.includes(id)));
    } else {
      setSelectedOrderIds((prev) => [...new Set([...prev, ...ids])]);
    }
  }

  // ─── Quote pipeline counts ──────────────────────────────────────────────
  const quotePipeline = useMemo(() => ({
    waiting: mockQuotes.filter((q) => q.status === '견적대기').length,
    sent: mockQuotes.filter((q) => q.status === '견적발송').length,
    converted: mockQuotes.filter((q) => q.status === '주문전환').length,
  }), []);

  // ─── Analytics max ──────────────────────────────────────────────────────
  const maxSales = Math.max(...dailySalesData.map((d) => d.sales));
  const maxOrders = Math.max(...dailySalesData.map((d) => d.orders));
  const maxCategoryAmount = Math.max(...categorySalesData.map((c) => c.amount));

  // ─── Render ─────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--text)]">Shop 주문 관리</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">JINU Shop 주문, 배송, 반품/취소, 견적, 매출을 통합 관리합니다.</p>
      </div>

      {/* Tabs */}
      <AdminTabs tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} />

      {/* ═══════════════════════════════════════════════════════════════════════
          Tab 1: 주문 목록
          ═══════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard icon={<ShoppingCart size={20} />} label="오늘 주문" value="32건" change="+15.2%" up={true} />
            <StatCard icon={<AlertTriangle size={20} />} label="미처리 주문" value="8건" change="-3건" up={true} />
            <StatCard icon={<Package size={20} />} label="출고대기" value="12건" change="+2건" up={false} />
            <StatCard icon={<DollarSign size={20} />} label="월 매출" value="4,523만원" change="+12.3%" up={true} />
          </div>

          {/* Filters */}
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-4">
            <div className="flex flex-wrap items-center gap-3">
              {/* Status filter */}
              <div className="relative">
                <select
                  value={orderStatusFilter}
                  onChange={(e) => { setOrderStatusFilter(e.target.value as OrderStatus); setOrderPage(1); }}
                  className="h-[var(--btn-height)] pl-3 pr-8 text-sm border border-[var(--border)] rounded-lg bg-[var(--bg)] text-[var(--text)] appearance-none cursor-pointer"
                >
                  {orderStatuses.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] pointer-events-none" />
              </div>

              {/* Date range */}
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  value={orderDateFrom}
                  onChange={(e) => { setOrderDateFrom(e.target.value); setOrderPage(1); }}
                  className="h-[var(--btn-height)] px-3 text-sm border border-[var(--border)] rounded-lg bg-[var(--bg)] text-[var(--text)]"
                />
                <span className="text-[var(--text-secondary)] text-sm">~</span>
                <input
                  type="date"
                  value={orderDateTo}
                  onChange={(e) => { setOrderDateTo(e.target.value); setOrderPage(1); }}
                  className="h-[var(--btn-height)] px-3 text-sm border border-[var(--border)] rounded-lg bg-[var(--bg)] text-[var(--text)]"
                />
              </div>

              {/* Search */}
              <div className="relative flex-1 min-w-[200px]">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
                <input
                  type="text"
                  placeholder="주문번호, 고객명, 기관 검색..."
                  value={orderSearch}
                  onChange={(e) => { setOrderSearch(e.target.value); setOrderPage(1); }}
                  className="w-full h-[var(--btn-height)] pl-9 pr-3 text-sm border border-[var(--border)] rounded-lg bg-[var(--bg)] text-[var(--text)] placeholder:text-[var(--text-secondary)]"
                />
              </div>

              {/* Bulk actions */}
              {selectedOrderIds.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[var(--text-secondary)]">{selectedOrderIds.length}건 선택</span>
                  <button onClick={() => showToast(`${selectedOrderIds.length}건 처리중 변경`)} className="h-[var(--btn-height)] px-3 text-sm bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors">
                    일괄 처리중 변경
                  </button>
                  <button onClick={() => showToast(`${selectedOrderIds.length}건 출고 처리`)} className="h-[var(--btn-height)] px-3 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                    일괄 출고
                  </button>
                </div>
              )}

              <button onClick={() => showToast('CSV 내보내기 완료')} className="h-[var(--btn-height)] px-3 text-sm border border-[var(--border)] rounded-lg text-[var(--text-secondary)] hover:bg-gray-100 transition-colors flex items-center gap-1.5">
                <Download size={14} />
                CSV 내보내기
              </button>
            </div>
          </div>

          {/* Orders Table */}
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--border)] bg-gray-50/50">
                    <th className="text-left px-4 py-3 font-medium text-[var(--text-secondary)] w-10">
                      <input
                        type="checkbox"
                        checked={pagedOrders.length > 0 && pagedOrders.every((o) => selectedOrderIds.includes(o.id))}
                        onChange={selectAllPageOrders}
                        className="rounded border-gray-300"
                      />
                    </th>
                    <th className="text-left px-4 py-3 font-medium text-[var(--text-secondary)]">주문번호</th>
                    <th className="text-left px-4 py-3 font-medium text-[var(--text-secondary)]">고객명</th>
                    <th className="text-left px-4 py-3 font-medium text-[var(--text-secondary)]">기관</th>
                    <th className="text-center px-4 py-3 font-medium text-[var(--text-secondary)]">품목수</th>
                    <th className="text-right px-4 py-3 font-medium text-[var(--text-secondary)]">금액</th>
                    <th className="text-left px-4 py-3 font-medium text-[var(--text-secondary)]">주문일</th>
                    <th className="text-center px-4 py-3 font-medium text-[var(--text-secondary)]">상태</th>
                    <th className="text-center px-4 py-3 font-medium text-[var(--text-secondary)]">상세</th>
                  </tr>
                </thead>
                <tbody>
                  {pagedOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="border-b border-[var(--border)] hover:bg-gray-50/50 transition-colors cursor-pointer"
                      onClick={() => openModal('orderDetail', order)}
                    >
                      <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={selectedOrderIds.includes(order.id)}
                          onChange={() => toggleOrderSelect(order.id)}
                          className="rounded border-gray-300"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-mono text-orange-600 font-medium">{order.orderNo}</span>
                      </td>
                      <td className="px-4 py-3 text-[var(--text)]">{order.customerName}</td>
                      <td className="px-4 py-3 text-[var(--text-secondary)]">{order.organization}</td>
                      <td className="px-4 py-3 text-center text-[var(--text)]">{order.items.length}개</td>
                      <td className="px-4 py-3 text-right font-medium text-[var(--text)]">{formatCurrency(order.totalAmount)}원</td>
                      <td className="px-4 py-3 text-[var(--text-secondary)]">{order.orderDate}</td>
                      <td className="px-4 py-3 text-center">
                        <StatusBadge status={order.status} colorMap={orderStatusColors} />
                      </td>
                      <td className="px-4 py-3 text-center" onClick={(e) => e.stopPropagation()}>
                        <button className="w-8 h-8 flex items-center justify-center rounded-lg text-[var(--text-secondary)] hover:bg-gray-100 transition-colors mx-auto" onClick={() => openModal('orderDetail', order)}>
                          <Eye size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {pagedOrders.length === 0 && (
                    <tr>
                      <td colSpan={9} className="px-4 py-12 text-center text-[var(--text-secondary)]">
                        검색 결과가 없습니다.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-4 py-4 border-t border-[var(--border)]">
              <Pagination currentPage={orderPage} totalPages={orderTotalPages} onPageChange={setOrderPage} />
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════
          Tab 2: 배송 관리
          ═══════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'shipping' && (
        <div className="space-y-6">
          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard icon={<Package size={20} />} label="출고대기" value="12건" change="+2건" up={false} />
            <StatCard icon={<Truck size={20} />} label="배송중" value="24건" change="+5건" up={true} />
            <StatCard icon={<CheckCircle size={20} />} label="배송완료(오늘)" value="18건" change="+3건" up={true} />
            <StatCard icon={<Timer size={20} />} label="평균 배송시간" value="1.8일" change="-0.2일" up={true} />
          </div>

          {/* Cutoff Time Banner */}
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600">
              <Clock size={20} />
            </div>
            <div>
              <div className="text-sm font-semibold text-orange-800">오늘 출고 마감: 오후 3:00</div>
              <div className="text-xs text-orange-600 mt-0.5">마감 전 송장번호를 입력해주세요. 미입력 건은 다음 영업일 출고됩니다.</div>
            </div>
            <button onClick={() => showToast('일괄 송장등록 CSV 양식 다운로드')} className="ml-auto h-[var(--btn-height)] px-4 text-sm bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center gap-1.5">
              <Upload size={14} />
              일괄 송장등록
            </button>
          </div>

          {/* Shipping Table */}
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--border)] bg-gray-50/50">
                    <th className="text-left px-4 py-3 font-medium text-[var(--text-secondary)]">주문번호</th>
                    <th className="text-left px-4 py-3 font-medium text-[var(--text-secondary)]">고객</th>
                    <th className="text-left px-4 py-3 font-medium text-[var(--text-secondary)]">운송사</th>
                    <th className="text-left px-4 py-3 font-medium text-[var(--text-secondary)]">송장번호</th>
                    <th className="text-center px-4 py-3 font-medium text-[var(--text-secondary)]">상태</th>
                    <th className="text-left px-4 py-3 font-medium text-[var(--text-secondary)]">출고일</th>
                    <th className="text-left px-4 py-3 font-medium text-[var(--text-secondary)]">도착예정일</th>
                    <th className="text-center px-4 py-3 font-medium text-[var(--text-secondary)]">추적</th>
                  </tr>
                </thead>
                <tbody>
                  {shippingData.map((item) => {
                    const noTracking = !item.trackingNo && item.status === '출고대기';
                    return (
                      <tr
                        key={item.id}
                        className={`border-b border-[var(--border)] transition-colors ${noTracking ? 'bg-amber-50/50' : 'hover:bg-gray-50/50'}`}
                      >
                        <td className="px-4 py-3">
                          <span className="font-mono text-orange-600 font-medium">{item.orderNo}</span>
                        </td>
                        <td className="px-4 py-3 text-[var(--text)]">{item.customerName}</td>
                        <td className="px-4 py-3 text-[var(--text-secondary)]">{item.carrier}</td>
                        <td className="px-4 py-3">
                          {item.status === '출고대기' ? (
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                placeholder="송장번호 입력"
                                value={trackingInputs[item.id] || item.trackingNo}
                                onChange={(e) => setTrackingInputs((prev) => ({ ...prev, [item.id]: e.target.value }))}
                                className="h-8 px-2 text-xs border border-[var(--border)] rounded bg-[var(--bg)] text-[var(--text)] w-36 placeholder:text-gray-400"
                              />
                              <button
                                onClick={() => {
                                  const val = trackingInputs[item.id];
                                  if (val) {
                                    setShippingData((prev) => prev.map((s) => s.id === item.id ? { ...s, trackingNo: val } : s));
                                    showToast('송장번호 등록 완료');
                                  }
                                }}
                                className="h-8 px-2 text-xs bg-orange-600 text-white rounded hover:bg-orange-700 transition-colors"
                              >
                                등록
                              </button>
                            </div>
                          ) : (
                            <span className="font-mono text-xs text-[var(--text)]">{item.trackingNo}</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <StatusBadge status={item.status} colorMap={shippingStatusColors} />
                        </td>
                        <td className="px-4 py-3 text-[var(--text-secondary)]">{item.shipDate || '-'}</td>
                        <td className="px-4 py-3 text-[var(--text-secondary)]">{item.estimatedArrival}</td>
                        <td className="px-4 py-3 text-center">
                          {item.trackingNo && item.status !== '출고대기' ? (
                            <button className="w-8 h-8 flex items-center justify-center rounded-lg text-blue-600 hover:bg-blue-50 transition-colors mx-auto" onClick={() => window.open('https://trace.cjlogistics.com/web/detail.jsp?slipno=' + item.trackingNo, '_blank')}>
                              <ExternalLink size={16} />
                            </button>
                          ) : (
                            <span className="text-gray-300">-</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════
          Tab 3: 반품/취소 처리
          ═══════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'returns' && (
        <div className="space-y-6">
          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard icon={<RotateCcw size={20} />} label="반품요청" value="5건" change="+2건" up={false} />
            <StatCard icon={<Ban size={20} />} label="취소요청" value="3건" change="-1건" up={true} />
            <StatCard icon={<CheckCircle size={20} />} label="처리완료(월)" value="12건" change="+4건" up={true} />
            <StatCard icon={<DollarSign size={20} />} label="환불합계" value="2,340,000원" change="+18.5%" up={false} />
          </div>

          {/* Filters */}
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <select
                  value={returnTypeFilter}
                  onChange={(e) => setReturnTypeFilter(e.target.value as '전체' | '반품' | '취소')}
                  className="h-[var(--btn-height)] pl-3 pr-8 text-sm border border-[var(--border)] rounded-lg bg-[var(--bg)] text-[var(--text)] appearance-none cursor-pointer"
                >
                  <option value="전체">전체 유형</option>
                  <option value="반품">반품</option>
                  <option value="취소">취소</option>
                </select>
                <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] pointer-events-none" />
              </div>

              <div className="relative flex-1 min-w-[200px]">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
                <input
                  type="text"
                  placeholder="요청번호, 주문번호, 고객명 검색..."
                  value={returnSearch}
                  onChange={(e) => setReturnSearch(e.target.value)}
                  className="w-full h-[var(--btn-height)] pl-9 pr-3 text-sm border border-[var(--border)] rounded-lg bg-[var(--bg)] text-[var(--text)] placeholder:text-[var(--text-secondary)]"
                />
              </div>
            </div>
          </div>

          {/* Returns Table */}
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--border)] bg-gray-50/50">
                    <th className="text-left px-4 py-3 font-medium text-[var(--text-secondary)]">요청번호</th>
                    <th className="text-left px-4 py-3 font-medium text-[var(--text-secondary)]">주문번호</th>
                    <th className="text-left px-4 py-3 font-medium text-[var(--text-secondary)]">고객</th>
                    <th className="text-center px-4 py-3 font-medium text-[var(--text-secondary)]">유형</th>
                    <th className="text-left px-4 py-3 font-medium text-[var(--text-secondary)]">사유</th>
                    <th className="text-right px-4 py-3 font-medium text-[var(--text-secondary)]">금액</th>
                    <th className="text-left px-4 py-3 font-medium text-[var(--text-secondary)]">요청일</th>
                    <th className="text-center px-4 py-3 font-medium text-[var(--text-secondary)]">상태</th>
                    <th className="text-center px-4 py-3 font-medium text-[var(--text-secondary)]">상세</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReturns.map((r) => (
                    <tr
                      key={r.id}
                      className="border-b border-[var(--border)] hover:bg-gray-50/50 transition-colors cursor-pointer"
                      onClick={() => openModal('returnDetail', r)}
                    >
                      <td className="px-4 py-3">
                        <span className="font-mono text-orange-600 font-medium">{r.requestNo}</span>
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-[var(--text-secondary)]">{r.orderNo}</td>
                      <td className="px-4 py-3 text-[var(--text)]">{r.customerName}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${r.type === '반품' ? 'bg-purple-100 text-purple-700' : 'bg-red-100 text-red-700'}`}>
                          {r.type}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-[var(--text-secondary)] max-w-[200px] truncate">{r.reason}</td>
                      <td className="px-4 py-3 text-right font-medium text-[var(--text)]">{formatCurrency(r.amount)}원</td>
                      <td className="px-4 py-3 text-[var(--text-secondary)]">{r.requestDate}</td>
                      <td className="px-4 py-3 text-center">
                        <StatusBadge status={r.status} colorMap={returnStatusColors} />
                      </td>
                      <td className="px-4 py-3 text-center" onClick={(e) => e.stopPropagation()}>
                        <button className="w-8 h-8 flex items-center justify-center rounded-lg text-[var(--text-secondary)] hover:bg-gray-100 transition-colors mx-auto" onClick={() => openModal('returnDetail', r)}>
                          <Eye size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredReturns.length === 0 && (
                    <tr>
                      <td colSpan={9} className="px-4 py-12 text-center text-[var(--text-secondary)]">
                        검색 결과가 없습니다.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════
          Tab 4: 견적 관리
          ═══════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'quotes' && (
        <div className="space-y-6">
          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard icon={<FileText size={20} />} label="견적대기" value="8건" change="+3건" up={false} />
            <StatCard icon={<Send size={20} />} label="견적발송" value="15건" change="+5건" up={true} />
            <StatCard icon={<CheckCircle size={20} />} label="주문전환" value="12건" change="+2건" up={true} />
            <StatCard icon={<Target size={20} />} label="전환율" value="45.2%" change="+2.8%" up={true} />
          </div>

          {/* Pipeline Visualization */}
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-6">
            <h3 className="text-sm font-semibold text-[var(--text)] mb-4">견적 파이프라인</h3>
            <div className="flex items-center justify-center gap-4">
              {/* Stage 1 */}
              <div className="flex-1 max-w-[200px] bg-amber-50 border border-amber-200 rounded-xl p-4 text-center">
                <div className="text-3xl font-bold text-amber-700">{quotePipeline.waiting}</div>
                <div className="text-sm text-amber-600 mt-1">견적요청</div>
              </div>
              {/* Arrow */}
              <div className="text-[var(--text-secondary)]">
                <ArrowRight size={24} />
              </div>
              {/* Stage 2 */}
              <div className="flex-1 max-w-[200px] bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
                <div className="text-3xl font-bold text-blue-700">{quotePipeline.sent}</div>
                <div className="text-sm text-blue-600 mt-1">견적발송</div>
              </div>
              {/* Arrow */}
              <div className="text-[var(--text-secondary)]">
                <ArrowRight size={24} />
              </div>
              {/* Stage 3 */}
              <div className="flex-1 max-w-[200px] bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center">
                <div className="text-3xl font-bold text-emerald-700">{quotePipeline.converted}</div>
                <div className="text-sm text-emerald-600 mt-1">주문전환</div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <select
                  value={quoteStatusFilter}
                  onChange={(e) => setQuoteStatusFilter(e.target.value as any)}
                  className="h-[var(--btn-height)] pl-3 pr-8 text-sm border border-[var(--border)] rounded-lg bg-[var(--bg)] text-[var(--text)] appearance-none cursor-pointer"
                >
                  <option value="전체">전체 상태</option>
                  <option value="견적대기">견적대기</option>
                  <option value="견적발송">견적발송</option>
                  <option value="주문전환">주문전환</option>
                  <option value="만료">만료</option>
                </select>
                <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] pointer-events-none" />
              </div>

              <div className="relative flex-1 min-w-[200px]">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
                <input
                  type="text"
                  placeholder="견적번호, 기관, 요청자 검색..."
                  value={quoteSearch}
                  onChange={(e) => setQuoteSearch(e.target.value)}
                  className="w-full h-[var(--btn-height)] pl-9 pr-3 text-sm border border-[var(--border)] rounded-lg bg-[var(--bg)] text-[var(--text)] placeholder:text-[var(--text-secondary)]"
                />
              </div>
            </div>
          </div>

          {/* Quotes Table */}
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--border)] bg-gray-50/50">
                    <th className="text-left px-4 py-3 font-medium text-[var(--text-secondary)]">견적번호</th>
                    <th className="text-left px-4 py-3 font-medium text-[var(--text-secondary)]">요청기관</th>
                    <th className="text-left px-4 py-3 font-medium text-[var(--text-secondary)]">요청자</th>
                    <th className="text-center px-4 py-3 font-medium text-[var(--text-secondary)]">품목수</th>
                    <th className="text-right px-4 py-3 font-medium text-[var(--text-secondary)]">예상금액</th>
                    <th className="text-left px-4 py-3 font-medium text-[var(--text-secondary)]">요청일</th>
                    <th className="text-center px-4 py-3 font-medium text-[var(--text-secondary)]">상태</th>
                    <th className="text-center px-4 py-3 font-medium text-[var(--text-secondary)]">상세</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredQuotes.map((q) => (
                    <tr
                      key={q.id}
                      className="border-b border-[var(--border)] hover:bg-gray-50/50 transition-colors cursor-pointer"
                      onClick={() => openModal('quoteDetail', q)}
                    >
                      <td className="px-4 py-3">
                        <span className="font-mono text-orange-600 font-medium">{q.quoteNo}</span>
                      </td>
                      <td className="px-4 py-3 text-[var(--text)]">{q.organization}</td>
                      <td className="px-4 py-3 text-[var(--text-secondary)]">{q.requester}</td>
                      <td className="px-4 py-3 text-center text-[var(--text)]">{q.items.length}개</td>
                      <td className="px-4 py-3 text-right font-medium text-[var(--text)]">{formatCurrency(q.estimatedAmount)}원</td>
                      <td className="px-4 py-3 text-[var(--text-secondary)]">{q.requestDate}</td>
                      <td className="px-4 py-3 text-center">
                        <StatusBadge status={q.status} colorMap={quoteStatusColors} />
                      </td>
                      <td className="px-4 py-3 text-center" onClick={(e) => e.stopPropagation()}>
                        <button className="w-8 h-8 flex items-center justify-center rounded-lg text-[var(--text-secondary)] hover:bg-gray-100 transition-colors mx-auto" onClick={() => openModal('quoteDetail', q)}>
                          <Eye size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredQuotes.length === 0 && (
                    <tr>
                      <td colSpan={8} className="px-4 py-12 text-center text-[var(--text-secondary)]">
                        검색 결과가 없습니다.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════
          Tab 5: 매출 분석
          ═══════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard icon={<DollarSign size={20} />} label="월매출" value="4,523만원" change="+12.3%" up={true} />
            <StatCard icon={<ShoppingCart size={20} />} label="주문건수" value="342건" change="+8.1%" up={true} />
            <StatCard icon={<TrendingUp size={20} />} label="객단가" value="132,250원" change="+3.4%" up={true} />
            <StatCard icon={<RefreshCw size={20} />} label="재구매율" value="67.2%" change="-1.2%" up={false} />
          </div>

          {/* Daily Sales Chart */}
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-semibold text-[var(--text)]">일별 매출 추이 (최근 14일)</h3>
              <div className="flex items-center gap-1 bg-[var(--bg)] border border-[var(--border)] rounded-lg p-0.5">
                <button
                  onClick={() => setChartMode('sales')}
                  className={`h-7 px-3 text-xs rounded-md transition-colors ${chartMode === 'sales' ? 'bg-orange-600 text-white' : 'text-[var(--text-secondary)] hover:bg-gray-100'}`}
                >
                  매출
                </button>
                <button
                  onClick={() => setChartMode('orders')}
                  className={`h-7 px-3 text-xs rounded-md transition-colors ${chartMode === 'orders' ? 'bg-orange-600 text-white' : 'text-[var(--text-secondary)] hover:bg-gray-100'}`}
                >
                  주문수
                </button>
              </div>
            </div>

            {/* Bar Chart */}
            <div className="flex items-end gap-2 h-48">
              {dailySalesData.map((d, i) => {
                const value = chartMode === 'sales' ? d.sales : d.orders;
                const max = chartMode === 'sales' ? maxSales : maxOrders;
                const heightPercent = max > 0 ? (value / max) * 100 : 0;
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div className="text-[10px] text-[var(--text-secondary)] font-medium">
                      {chartMode === 'sales' ? formatShortCurrency(d.sales) : d.orders}
                    </div>
                    <div className="w-full relative" style={{ height: '140px' }}>
                      <div
                        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[70%] bg-orange-500 rounded-t-sm transition-all duration-300 hover:bg-orange-600"
                        style={{ height: `${heightPercent}%` }}
                      />
                    </div>
                    <div className="text-[10px] text-[var(--text-secondary)]">{d.date}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Two Column: Category + Purchase Ratio */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Category Sales */}
            <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-6">
              <h3 className="text-sm font-semibold text-[var(--text)] mb-4">카테고리별 매출</h3>
              <div className="space-y-3">
                {categorySalesData.map((cat, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[var(--text)]">{cat.category}</span>
                      <span className="text-[var(--text-secondary)]">{formatCurrency(cat.amount)}원 ({cat.percentage}%)</span>
                    </div>
                    <div className="w-full h-6 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-orange-500 rounded-full transition-all duration-500"
                        style={{ width: `${(cat.amount / maxCategoryAmount) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* New vs Repeat Purchase */}
            <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-6">
              <h3 className="text-sm font-semibold text-[var(--text)] mb-4">신규/재구매 비율</h3>

              <div className="flex items-center gap-6 mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500" />
                  <span className="text-sm text-[var(--text)]">신규 32.8%</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-orange-500" />
                  <span className="text-sm text-[var(--text)]">재구매 67.2%</span>
                </div>
              </div>

              {/* Stacked bar */}
              <div className="space-y-4">
                <div>
                  <div className="text-xs text-[var(--text-secondary)] mb-1.5">이번 달</div>
                  <div className="flex h-10 rounded-lg overflow-hidden">
                    <div className="bg-blue-500 flex items-center justify-center text-white text-xs font-medium" style={{ width: '32.8%' }}>
                      32.8%
                    </div>
                    <div className="bg-orange-500 flex items-center justify-center text-white text-xs font-medium" style={{ width: '67.2%' }}>
                      67.2%
                    </div>
                  </div>
                </div>
                <div>
                  <div className="text-xs text-[var(--text-secondary)] mb-1.5">지난 달</div>
                  <div className="flex h-10 rounded-lg overflow-hidden">
                    <div className="bg-blue-300 flex items-center justify-center text-white text-xs font-medium" style={{ width: '31.6%' }}>
                      31.6%
                    </div>
                    <div className="bg-orange-300 flex items-center justify-center text-white text-xs font-medium" style={{ width: '68.4%' }}>
                      68.4%
                    </div>
                  </div>
                </div>
              </div>

              {/* Key metrics */}
              <div className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t border-[var(--border)]">
                <div>
                  <div className="text-xs text-[var(--text-secondary)]">신규 고객 주문</div>
                  <div className="text-lg font-bold text-blue-600 mt-1">112건</div>
                  <div className="text-xs text-emerald-600">+5.2% vs 지난달</div>
                </div>
                <div>
                  <div className="text-xs text-[var(--text-secondary)]">재구매 고객 주문</div>
                  <div className="text-lg font-bold text-orange-600 mt-1">230건</div>
                  <div className="text-xs text-red-500">-1.2% vs 지난달</div>
                </div>
              </div>
            </div>
          </div>

          {/* Top Organizations */}
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-6">
            <h3 className="text-sm font-semibold text-[var(--text)] mb-4">기관별 구매 순위 (Top 10)</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--border)]">
                    <th className="text-left px-4 py-2 font-medium text-[var(--text-secondary)] w-12">순위</th>
                    <th className="text-left px-4 py-2 font-medium text-[var(--text-secondary)]">기관명</th>
                    <th className="text-right px-4 py-2 font-medium text-[var(--text-secondary)]">구매금액</th>
                    <th className="text-center px-4 py-2 font-medium text-[var(--text-secondary)]">주문수</th>
                    <th className="text-left px-4 py-2 font-medium text-[var(--text-secondary)] w-48">비율</th>
                  </tr>
                </thead>
                <tbody>
                  {topOrganizations.map((org) => (
                    <tr key={org.rank} className="border-b border-[var(--border)] last:border-b-0">
                      <td className="px-4 py-2.5">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          org.rank <= 3 ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {org.rank}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 font-medium text-[var(--text)]">{org.name}</td>
                      <td className="px-4 py-2.5 text-right text-[var(--text)]">{formatCurrency(org.amount)}원</td>
                      <td className="px-4 py-2.5 text-center text-[var(--text-secondary)]">{org.orders}건</td>
                      <td className="px-4 py-2.5">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-orange-500 rounded-full"
                              style={{ width: `${org.percentage}%` }}
                            />
                          </div>
                          <span className="text-xs text-[var(--text-secondary)] w-10 text-right">{org.percentage}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════
          Modals
          ═══════════════════════════════════════════════════════════════════════ */}

      {/* Order Detail Modal */}
      <Modal isOpen={activeModal === 'orderDetail'} onClose={closeModal} title="주문 상세" size="lg">
        {modalData && activeModal === 'orderDetail' && (() => {
          const order = modalData as Order;
          return (
            <div className="space-y-5">
              {/* Order Info Header */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-mono text-orange-600 font-bold text-lg">{order.orderNo}</span>
                  <div className="text-xs text-[var(--text-secondary)] mt-0.5">{order.orderDate}</div>
                </div>
                <StatusBadge status={order.status} colorMap={orderStatusColors} />
              </div>

              {/* Customer Info */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <h4 className="text-sm font-semibold text-[var(--text)]">고객 정보</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-[var(--text-secondary)]">고객명:</span>{' '}
                    <span className="text-[var(--text)] font-medium">{order.customerName}</span>
                  </div>
                  <div>
                    <span className="text-[var(--text-secondary)]">기관:</span>{' '}
                    <span className="text-[var(--text)]">{order.organization}</span>
                  </div>
                  <div>
                    <span className="text-[var(--text-secondary)]">연락처:</span>{' '}
                    <span className="text-[var(--text)]">{order.phone}</span>
                  </div>
                  <div>
                    <span className="text-[var(--text-secondary)]">이메일:</span>{' '}
                    <span className="text-[var(--text)]">{order.email}</span>
                  </div>
                </div>
              </div>

              {/* Delivery Address */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <h4 className="text-sm font-semibold text-[var(--text)] flex items-center gap-1.5">
                  <MapPin size={14} />
                  배송 주소
                </h4>
                <p className="text-sm text-[var(--text)]">{order.address}</p>
              </div>

              {/* Items */}
              <div>
                <h4 className="text-sm font-semibold text-[var(--text)] mb-2">주문 품목</h4>
                <div className="border border-[var(--border)] rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-[var(--border)] bg-gray-50/50">
                        <th className="text-left px-3 py-2 font-medium text-[var(--text-secondary)]">제품명</th>
                        <th className="text-left px-3 py-2 font-medium text-[var(--text-secondary)]">카탈로그번호</th>
                        <th className="text-center px-3 py-2 font-medium text-[var(--text-secondary)]">수량</th>
                        <th className="text-right px-3 py-2 font-medium text-[var(--text-secondary)]">단가</th>
                        <th className="text-right px-3 py-2 font-medium text-[var(--text-secondary)]">소계</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.items.map((item, idx) => (
                        <tr key={idx} className="border-b border-[var(--border)] last:border-b-0">
                          <td className="px-3 py-2 text-[var(--text)]">{item.name}</td>
                          <td className="px-3 py-2 font-mono text-xs text-[var(--text-secondary)]">{item.catalogNo}</td>
                          <td className="px-3 py-2 text-center text-[var(--text)]">{item.qty}</td>
                          <td className="px-3 py-2 text-right text-[var(--text)]">{formatCurrency(item.unitPrice)}원</td>
                          <td className="px-3 py-2 text-right font-medium text-[var(--text)]">{formatCurrency(item.qty * item.unitPrice)}원</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Payment Info */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <h4 className="text-sm font-semibold text-[var(--text)] flex items-center gap-1.5">
                  <CreditCard size={14} />
                  결제 정보
                </h4>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[var(--text-secondary)]">결제수단</span>
                  <span className="text-[var(--text)]">{order.paymentMethod}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[var(--text-secondary)]">공급가액</span>
                  <span className="text-[var(--text)]">{formatCurrency(Math.round(order.totalAmount / 1.1))}원</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[var(--text-secondary)]">부가세 (10%)</span>
                  <span className="text-[var(--text)]">{formatCurrency(order.totalAmount - Math.round(order.totalAmount / 1.1))}원</span>
                </div>
                <div className="flex items-center justify-between text-sm font-bold border-t border-[var(--border)] pt-2">
                  <span className="text-[var(--text)]">총 결제금액</span>
                  <span className="text-orange-600">{formatCurrency(order.totalAmount)}원</span>
                </div>
              </div>

              {/* Status Change Buttons */}
              {order.status !== '완료' && order.status !== '취소' && (
                <div className="flex items-center gap-2 pt-2">
                  {order.status === '주문접수' && (
                    <button onClick={() => { showToast('처리중으로 변경되었습니다.'); closeModal(); }} className="h-[var(--btn-height)] px-4 text-sm bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors">
                      처리중으로 변경
                    </button>
                  )}
                  {(order.status === '주문접수' || order.status === '처리중') && (
                    <button onClick={() => { showToast('출고 처리되었습니다.'); closeModal(); }} className="h-[var(--btn-height)] px-4 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                      출고 처리
                    </button>
                  )}
                  {order.status === '배송중' && (
                    <button onClick={() => { showToast('배송 완료 처리되었습니다.'); closeModal(); }} className="h-[var(--btn-height)] px-4 text-sm bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
                      배송완료 처리
                    </button>
                  )}
                  <button onClick={() => { showToast('주문이 취소되었습니다.'); closeModal(); }} className="h-[var(--btn-height)] px-4 text-sm border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors">
                    주문 취소
                  </button>
                </div>
              )}
            </div>
          );
        })()}
      </Modal>

      {/* Return Detail Modal */}
      <Modal isOpen={activeModal === 'returnDetail'} onClose={closeModal} title="반품/취소 상세" size="lg">
        {modalData && activeModal === 'returnDetail' && (() => {
          const r = modalData as ReturnRequest;
          return (
            <div className="space-y-5">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-mono text-orange-600 font-bold text-lg">{r.requestNo}</span>
                  <div className="text-xs text-[var(--text-secondary)] mt-0.5">원 주문: {r.orderNo}</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${r.type === '반품' ? 'bg-purple-100 text-purple-700' : 'bg-red-100 text-red-700'}`}>
                    {r.type}
                  </span>
                  <StatusBadge status={r.status} colorMap={returnStatusColors} />
                </div>
              </div>

              {/* Request Info */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <h4 className="text-sm font-semibold text-[var(--text)]">요청 정보</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-[var(--text-secondary)]">고객명:</span>{' '}
                    <span className="text-[var(--text)] font-medium">{r.customerName}</span>
                  </div>
                  <div>
                    <span className="text-[var(--text-secondary)]">요청일:</span>{' '}
                    <span className="text-[var(--text)]">{r.requestDate}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-[var(--text-secondary)]">사유:</span>{' '}
                    <span className="text-[var(--text)]">{r.reason}</span>
                  </div>
                </div>
              </div>

              {/* Photos placeholder */}
              <div>
                <h4 className="text-sm font-semibold text-[var(--text)] mb-2">첨부 사진</h4>
                <div className="flex gap-2">
                  {r.type === '반품' ? (
                    <>
                      <div className="w-20 h-20 bg-gray-100 border border-dashed border-[var(--border)] rounded-lg flex items-center justify-center text-gray-400">
                        <ImageIcon size={20} />
                      </div>
                      <div className="w-20 h-20 bg-gray-100 border border-dashed border-[var(--border)] rounded-lg flex items-center justify-center text-gray-400">
                        <ImageIcon size={20} />
                      </div>
                    </>
                  ) : (
                    <div className="text-sm text-[var(--text-secondary)]">첨부된 사진이 없습니다.</div>
                  )}
                </div>
              </div>

              {/* Admin Memo */}
              <div>
                <h4 className="text-sm font-semibold text-[var(--text)] mb-2">관리자 메모</h4>
                <textarea
                  className="w-full h-20 px-3 py-2 text-sm border border-[var(--border)] rounded-lg bg-[var(--bg)] text-[var(--text)] resize-none placeholder:text-gray-400"
                  placeholder="메모를 입력하세요..."
                  defaultValue={r.adminMemo}
                />
              </div>

              {/* Refund Section */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-[var(--text)] mb-2 flex items-center gap-1.5">
                  <DollarSign size={14} />
                  환불 처리
                </h4>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[var(--text-secondary)]">환불 금액</span>
                  <span className="text-lg font-bold text-[var(--text)]">{formatCurrency(r.amount)}원</span>
                </div>
              </div>

              {/* Action Buttons */}
              {(r.status === '접수' || r.status === '검토중') && (
                <div className="flex items-center gap-2 pt-2">
                  <button onClick={() => { showToast('승인 처리되었습니다.'); closeModal(); }} className="h-[var(--btn-height)] px-4 text-sm bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-1.5">
                    <CheckCircle size={14} />
                    승인
                  </button>
                  <button onClick={() => { showToast('거절 처리되었습니다.'); closeModal(); }} className="h-[var(--btn-height)] px-4 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-1.5">
                    <XCircle size={14} />
                    거절
                  </button>
                  {r.status === '접수' && (
                    <button onClick={() => showToast('검토중으로 변경되었습니다.')} className="h-[var(--btn-height)] px-4 text-sm border border-[var(--border)] text-[var(--text-secondary)] rounded-lg hover:bg-gray-100 transition-colors">
                      검토중으로 변경
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })()}
      </Modal>

      {/* Quote Detail Modal */}
      <Modal isOpen={activeModal === 'quoteDetail'} onClose={closeModal} title="견적 상세" size="lg">
        {modalData && activeModal === 'quoteDetail' && (() => {
          const q = modalData as Quote;
          return (
            <div className="space-y-5">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-mono text-orange-600 font-bold text-lg">{q.quoteNo}</span>
                  <div className="text-xs text-[var(--text-secondary)] mt-0.5">요청일: {q.requestDate}</div>
                </div>
                <StatusBadge status={q.status} colorMap={quoteStatusColors} />
              </div>

              {/* Request Info */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <h4 className="text-sm font-semibold text-[var(--text)]">요청 정보</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-[var(--text-secondary)]">기관:</span>{' '}
                    <span className="text-[var(--text)] font-medium">{q.organization}</span>
                  </div>
                  <div>
                    <span className="text-[var(--text-secondary)]">요청자:</span>{' '}
                    <span className="text-[var(--text)]">{q.requester}</span>
                  </div>
                  <div>
                    <span className="text-[var(--text-secondary)]">유효기간:</span>{' '}
                    <span className="text-[var(--text)]">{q.validUntil}까지</span>
                  </div>
                </div>
              </div>

              {/* Items */}
              <div>
                <h4 className="text-sm font-semibold text-[var(--text)] mb-2">견적 품목</h4>
                <div className="border border-[var(--border)] rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-[var(--border)] bg-gray-50/50">
                        <th className="text-left px-3 py-2 font-medium text-[var(--text-secondary)]">제품명</th>
                        <th className="text-center px-3 py-2 font-medium text-[var(--text-secondary)]">수량</th>
                        <th className="text-right px-3 py-2 font-medium text-[var(--text-secondary)]">단가</th>
                        <th className="text-right px-3 py-2 font-medium text-[var(--text-secondary)]">소계</th>
                      </tr>
                    </thead>
                    <tbody>
                      {q.items.map((item, idx) => (
                        <tr key={idx} className="border-b border-[var(--border)] last:border-b-0">
                          <td className="px-3 py-2 text-[var(--text)]">{item.name}</td>
                          <td className="px-3 py-2 text-center text-[var(--text)]">{item.qty}</td>
                          <td className="px-3 py-2 text-right text-[var(--text)]">{formatCurrency(item.unitPrice)}원</td>
                          <td className="px-3 py-2 text-right font-medium text-[var(--text)]">{formatCurrency(item.qty * item.unitPrice)}원</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="flex justify-end mt-2">
                  <span className="text-sm font-bold text-[var(--text)]">
                    합계: <span className="text-orange-600">{formatCurrency(q.estimatedAmount)}원</span>
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-2">
                {q.status === '견적대기' && (
                  <button onClick={() => { showToast('견적서가 발송되었습니다.'); closeModal(); }} className="h-[var(--btn-height)] px-4 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1.5">
                    <Send size={14} />
                    견적서 발송
                  </button>
                )}
                {(q.status === '견적대기' || q.status === '견적발송') && (
                  <button onClick={() => { showToast('주문으로 전환되었습니다.'); closeModal(); }} className="h-[var(--btn-height)] px-4 text-sm bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-1.5">
                    <CheckCircle size={14} />
                    주문 전환
                  </button>
                )}
                <button onClick={() => { showToast('견적서 PDF 다운로드'); }} className="h-[var(--btn-height)] px-4 text-sm border border-[var(--border)] text-[var(--text-secondary)] rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-1.5">
                  <Download size={14} />
                  견적서 PDF
                </button>
              </div>
            </div>
          );
        })()}
      </Modal>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-gray-900 text-white px-4 py-3 rounded-xl shadow-lg text-sm flex items-center gap-2 animate-in slide-in-from-bottom-4">
          <CheckCircle size={16} className="text-emerald-400" />
          {toast}
        </div>
      )}
    </div>
  );
}
