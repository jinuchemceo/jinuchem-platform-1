'use client';

import { useState } from 'react';
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  X,
  MapPin,
  Phone,
  User,
  Calendar,
  ClipboardList,
} from 'lucide-react';

type OrderStatus = '신규주문' | '준비중' | '출고완료' | '배송완료';

interface OrderItem {
  name: string;
  catalogNo: string;
  size: string;
  qty: number;
  unitPrice: string;
  subtotal: string;
}

interface Order {
  id: string;
  customer: string;
  customerOrg: string;
  items: OrderItem[];
  totalAmount: string;
  orderedDate: string;
  status: OrderStatus;
  shippingAddress: string;
  contactName: string;
  contactPhone: string;
  poNumber?: string;
}

const sampleOrders: Order[] = [
  {
    id: 'ORD-2026-0315',
    customer: '김연구',
    customerOrg: '서울대학교 화학과',
    items: [
      { name: 'Sodium Chloride', catalogNo: 'JC-SC-001', size: '500g', qty: 5, unitPrice: '₩15,000', subtotal: '₩75,000' },
      { name: 'Potassium Hydroxide', catalogNo: 'JC-PH-012', size: '1kg', qty: 2, unitPrice: '₩42,000', subtotal: '₩84,000' },
      { name: 'Calcium Carbonate', catalogNo: 'JC-CC-020', size: '500g', qty: 3, unitPrice: '₩28,000', subtotal: '₩84,000' },
    ],
    totalAmount: '₩1,250,000',
    orderedDate: '2026-03-19',
    status: '신규주문',
    shippingAddress: '서울시 관악구 관악로 1, 자연과학대학 302동 415호',
    contactName: '김연구',
    contactPhone: '010-1234-5678',
    poNumber: 'PO-SNU-2026-0412',
  },
  {
    id: 'ORD-2026-0314',
    customer: '이박사',
    customerOrg: 'KAIST 생명과학과',
    items: [
      { name: 'Ethanol (200 Proof)', catalogNo: 'JC-ET-002', size: '4L', qty: 3, unitPrice: '₩85,000', subtotal: '₩255,000' },
      { name: 'Acetonitrile (HPLC)', catalogNo: 'JC-AC-003', size: '2.5L', qty: 2, unitPrice: '₩120,000', subtotal: '₩240,000' },
    ],
    totalAmount: '₩680,000',
    orderedDate: '2026-03-18',
    status: '신규주문',
    shippingAddress: '대전시 유성구 대학로 291, 생명과학관 E6-2 201호',
    contactName: '이박사',
    contactPhone: '010-2345-6789',
  },
  {
    id: 'ORD-2026-0313',
    customer: '박교수',
    customerOrg: '연세대학교 약학대학',
    items: [
      { name: 'Acetonitrile (ACS Grade)', catalogNo: 'JC-AC-003A', size: '4L', qty: 5, unitPrice: '₩98,000', subtotal: '₩490,000' },
      { name: 'Methanol (HPLC Grade)', catalogNo: 'JC-MT-004H', size: '4L', qty: 4, unitPrice: '₩75,000', subtotal: '₩300,000' },
    ],
    totalAmount: '₩2,100,000',
    orderedDate: '2026-03-17',
    status: '준비중',
    shippingAddress: '서울시 서대문구 연세로 50, 약학관 B102호',
    contactName: '박교수',
    contactPhone: '010-3456-7890',
    poNumber: 'PO-YU-2026-0089',
  },
  {
    id: 'ORD-2026-0312',
    customer: '최연구',
    customerOrg: '포항공대 신소재공학과',
    items: [
      { name: 'Methanol (ACS Grade)', catalogNo: 'JC-MT-004', size: '2.5L', qty: 2, unitPrice: '₩65,000', subtotal: '₩130,000' },
    ],
    totalAmount: '₩450,000',
    orderedDate: '2026-03-16',
    status: '출고완료',
    shippingAddress: '경북 포항시 남구 청암로 77, 공학 5동 303호',
    contactName: '최연구',
    contactPhone: '010-4567-8901',
  },
  {
    id: 'ORD-2026-0311',
    customer: '정연구',
    customerOrg: '고려대학교 화공생명공학과',
    items: [
      { name: 'Toluene (ACS Grade)', catalogNo: 'JC-TL-006', size: '4L', qty: 2, unitPrice: '₩55,000', subtotal: '₩110,000' },
      { name: 'Hexane (HPLC Grade)', catalogNo: 'JC-HX-007', size: '4L', qty: 3, unitPrice: '₩68,000', subtotal: '₩204,000' },
    ],
    totalAmount: '₩3,200,000',
    orderedDate: '2026-03-15',
    status: '배송완료',
    shippingAddress: '서울시 성북구 안암로 145, 화학관 501호',
    contactName: '정연구',
    contactPhone: '010-5678-9012',
    poNumber: 'PO-KU-2026-0156',
  },
  {
    id: 'ORD-2026-0310',
    customer: '한연구',
    customerOrg: '성균관대학교 화학공학과',
    items: [
      { name: 'Sulfuric Acid (98%)', catalogNo: 'JC-SA-005', size: '2.5L', qty: 1, unitPrice: '₩95,000', subtotal: '₩95,000' },
      { name: 'Hydrochloric Acid (37%)', catalogNo: 'JC-HA-008', size: '2.5L', qty: 2, unitPrice: '₩45,000', subtotal: '₩90,000' },
    ],
    totalAmount: '₩185,000',
    orderedDate: '2026-03-14',
    status: '배송완료',
    shippingAddress: '경기 수원시 장안구 서부로 2066, 화학공학관 301호',
    contactName: '한연구',
    contactPhone: '010-6789-0123',
  },
];

const statusTabs: { label: string; value: OrderStatus | 'all' }[] = [
  { label: '전체', value: 'all' },
  { label: '신규주문', value: '신규주문' },
  { label: '준비중', value: '준비중' },
  { label: '출고완료', value: '출고완료' },
  { label: '배송완료', value: '배송완료' },
];

const statusStyles: Record<OrderStatus, string> = {
  '신규주문': 'bg-blue-100 text-purple-700',
  '준비중': 'bg-yellow-100 text-yellow-700',
  '출고완료': 'bg-blue-100 text-purple-700',
  '배송완료': 'bg-green-100 text-green-700',
};

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState<OrderStatus | 'all'>('all');
  const [orders, setOrders] = useState(sampleOrders);
  const [detailOrder, setDetailOrder] = useState<Order | null>(null);

  const filteredOrders =
    activeTab === 'all' ? orders : orders.filter((o) => o.status === activeTab);

  const handleShip = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId && o.status === '신규주문') return { ...o, status: '준비중' as OrderStatus };
        if (o.id === orderId && o.status === '준비중') return { ...o, status: '출고완료' as OrderStatus };
        return o;
      })
    );
  };

  const getActionButton = (order: Order) => {
    if (order.status === '신규주문') {
      return (
        <button
          onClick={() => handleShip(order.id)}
          className="h-[var(--btn-height)] px-4 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors"
        >
          주문 접수
        </button>
      );
    }
    if (order.status === '준비중') {
      return (
        <button
          onClick={() => handleShip(order.id)}
          className="h-[var(--btn-height)] px-4 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors"
        >
          출고 처리
        </button>
      );
    }
    if (order.status === '출고완료') {
      return <span className="text-xs text-purple-600 font-medium">배송 중</span>;
    }
    return <span className="text-xs text-green-600 font-medium">완료</span>;
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--text)]">주문 관리</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">접수된 주문을 관리하고 출고 처리하세요</p>
      </div>

      {/* Status Tabs */}
      <div className="flex gap-1 border-b border-[var(--border)]">
        {statusTabs.map((tab) => {
          const count = tab.value === 'all' ? orders.length : orders.filter((o) => o.status === tab.value).length;
          return (
            <button
              key={tab.label}
              onClick={() => setActiveTab(tab.value)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.value
                  ? 'border-purple-600 text-purple-600'
                  : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text)]'
              }`}
            >
              {tab.label}
              <span className={`ml-1 px-1.5 py-0.5 rounded-full text-xs ${
                activeTab === tab.value ? 'bg-blue-100 text-purple-700' : 'bg-gray-100 text-gray-600'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Orders Table */}
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--border)] bg-gray-50">
              <th className="text-left px-5 py-3 text-[var(--text-secondary)] font-medium">주문번호</th>
              <th className="text-left px-5 py-3 text-[var(--text-secondary)] font-medium">고객사</th>
              <th className="text-left px-5 py-3 text-[var(--text-secondary)] font-medium">주문 제품</th>
              <th className="text-right px-5 py-3 text-[var(--text-secondary)] font-medium">금액</th>
              <th className="text-center px-5 py-3 text-[var(--text-secondary)] font-medium">주문일</th>
              <th className="text-center px-5 py-3 text-[var(--text-secondary)] font-medium">상태</th>
              <th className="text-center px-5 py-3 text-[var(--text-secondary)] font-medium">액션</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order.id} className="border-b border-[var(--border)] last:border-0 hover:bg-gray-50 transition-colors">
                <td className="px-5 py-3">
                  <button
                    onClick={() => setDetailOrder(order)}
                    className="font-medium text-purple-600 hover:text-purple-700 hover:underline"
                  >
                    {order.id}
                  </button>
                </td>
                <td className="px-5 py-3">
                  <div className="font-medium text-[var(--text)]">{order.customerOrg}</div>
                  <div className="text-xs text-[var(--text-secondary)]">{order.customer}</div>
                </td>
                <td className="px-5 py-3 text-[var(--text)]">
                  {order.items[0].name}
                  {order.items.length > 1 && (
                    <span className="text-[var(--text-secondary)]"> 외 {order.items.length - 1}건</span>
                  )}
                </td>
                <td className="px-5 py-3 text-right font-medium text-[var(--text)]">{order.totalAmount}</td>
                <td className="px-5 py-3 text-center text-[var(--text-secondary)]">{order.orderedDate}</td>
                <td className="px-5 py-3 text-center">
                  <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[order.status]}`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-5 py-3 text-center">
                  {getActionButton(order)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Order Detail Modal */}
      {detailOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[var(--bg-card)] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)]">
              <div>
                <h3 className="text-lg font-bold text-[var(--text)]">주문 상세</h3>
                <p className="text-sm text-[var(--text-secondary)]">{detailOrder.id}</p>
              </div>
              <button
                onClick={() => setDetailOrder(null)}
                className="w-9 h-9 flex items-center justify-center rounded-lg text-[var(--text-secondary)] hover:bg-gray-100"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-4 space-y-5">
              {/* Order Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <User size={14} className="text-[var(--text-secondary)]" />
                    <span className="text-[var(--text-secondary)]">고객:</span>
                    <span className="text-[var(--text)] font-medium">{detailOrder.customer} ({detailOrder.customerOrg})</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar size={14} className="text-[var(--text-secondary)]" />
                    <span className="text-[var(--text-secondary)]">주문일:</span>
                    <span className="text-[var(--text)]">{detailOrder.orderedDate}</span>
                  </div>
                  {detailOrder.poNumber && (
                    <div className="flex items-center gap-2 text-sm">
                      <ClipboardList size={14} className="text-[var(--text-secondary)]" />
                      <span className="text-[var(--text-secondary)]">PO번호:</span>
                      <span className="text-[var(--text)]">{detailOrder.poNumber}</span>
                    </div>
                  )}
                </div>
                <div className="space-y-3">
                  <div className="flex items-start gap-2 text-sm">
                    <MapPin size={14} className="text-[var(--text-secondary)] mt-0.5" />
                    <div>
                      <span className="text-[var(--text-secondary)]">배송지:</span>
                      <p className="text-[var(--text)]">{detailOrder.shippingAddress}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone size={14} className="text-[var(--text-secondary)]" />
                    <span className="text-[var(--text-secondary)]">연락처:</span>
                    <span className="text-[var(--text)]">{detailOrder.contactPhone}</span>
                  </div>
                </div>
              </div>

              {/* Items Table */}
              <div>
                <h4 className="text-sm font-semibold text-[var(--text)] mb-3">주문 품목</h4>
                <div className="border border-[var(--border)] rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 border-b border-[var(--border)]">
                        <th className="text-left px-4 py-2.5 text-[var(--text-secondary)] font-medium">제품명</th>
                        <th className="text-center px-4 py-2.5 text-[var(--text-secondary)] font-medium">규격</th>
                        <th className="text-center px-4 py-2.5 text-[var(--text-secondary)] font-medium">수량</th>
                        <th className="text-right px-4 py-2.5 text-[var(--text-secondary)] font-medium">단가</th>
                        <th className="text-right px-4 py-2.5 text-[var(--text-secondary)] font-medium">소계</th>
                      </tr>
                    </thead>
                    <tbody>
                      {detailOrder.items.map((item, i) => (
                        <tr key={i} className="border-b border-[var(--border)] last:border-0">
                          <td className="px-4 py-2.5">
                            <div className="font-medium text-[var(--text)]">{item.name}</div>
                            <div className="text-xs text-[var(--text-secondary)]">{item.catalogNo}</div>
                          </td>
                          <td className="px-4 py-2.5 text-center text-[var(--text)]">{item.size}</td>
                          <td className="px-4 py-2.5 text-center text-[var(--text)]">{item.qty}</td>
                          <td className="px-4 py-2.5 text-right text-[var(--text)]">{item.unitPrice}</td>
                          <td className="px-4 py-2.5 text-right font-medium text-[var(--text)]">{item.subtotal}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="bg-gray-50">
                        <td colSpan={4} className="px-4 py-3 text-right text-sm font-semibold text-[var(--text)]">합계</td>
                        <td className="px-4 py-3 text-right text-base font-bold text-purple-600">{detailOrder.totalAmount}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* Status */}
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-[var(--text)]">현재 상태:</span>
                <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${statusStyles[detailOrder.status]}`}>
                  {detailOrder.status}
                </span>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[var(--border)]">
              <button
                onClick={() => setDetailOrder(null)}
                className="h-[var(--btn-height)] px-5 border border-[var(--border)] rounded-lg text-sm font-medium text-[var(--text)] hover:bg-gray-50 transition-colors"
              >
                닫기
              </button>
              {(detailOrder.status === '신규주문' || detailOrder.status === '준비중') && (
                <button
                  onClick={() => {
                    handleShip(detailOrder.id);
                    setDetailOrder(null);
                  }}
                  className="h-[var(--btn-height)] px-5 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors flex items-center gap-2"
                >
                  <Truck size={14} />
                  {detailOrder.status === '신규주문' ? '주문 접수' : '출고 처리'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
