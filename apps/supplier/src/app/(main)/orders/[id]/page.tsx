'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  User,
  Calendar,
  FileText,
  MessageSquare,
} from 'lucide-react';

const order = {
  id: 'ORD-2026-0402-001',
  poNumber: 'PO-SNU-2026-0402',
  status: '출고준비' as const,
  orderedAt: '2026-04-02 09:15',
  paidAt: '2026-04-02 09:16',
  customer: '김연구',
  org: '서울대학교 화학과',
  phone: '010-1234-5678',
  address: '서울시 관악구 관악로 1, 자연과학대학 302동 415호',
  lab: '유기화학 실험실 B208',
  deliveryNote: '경비실 맡겨주세요',
  items: [
    { name: 'Ethyl alcohol, Pure', catalogNo: '459844', size: '500mL', qty: 3, unitPrice: 158239, subtotal: 474717 },
    { name: 'Dichloromethane, ACS', catalogNo: 'D0148', size: '2.5L', qty: 1, unitPrice: 145000, subtotal: 145000 },
    { name: 'Methanol, HPLC Grade', catalogNo: 'M0202', size: '4L', qty: 2, unitPrice: 98500, subtotal: 197000 },
  ],
  subtotal: 816717,
  discount: 0,
  vat: 81672,
  total: 898389,
};

const timeline = [
  { label: '주문 접수', time: '2026-04-02 09:15', done: true },
  { label: '결제 확인', time: '2026-04-02 09:16', done: true },
  { label: '출고 처리', time: null, done: false, current: true },
  { label: '배송중', time: null, done: false },
  { label: '배송완료', time: null, done: false },
];

const fmt = (n: number) => '₩' + n.toLocaleString();

export default function OrderDetailPage() {
  const router = useRouter();
  const [carrier, setCarrier] = useState('CJ대한통운');
  const [trackingNo, setTrackingNo] = useState('');
  const [memo, setMemo] = useState('');

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => router.push('/orders')} className="p-2 hover:bg-gray-100 rounded-lg"><ArrowLeft size={20} /></button>
        <div>
          <h1 className="text-2xl font-bold text-[var(--text)]">주문 상세</h1>
          <p className="text-sm text-[var(--text-secondary)]">{order.id}</p>
        </div>
        <div className="ml-auto flex gap-2">
          <span className="inline-block px-3 py-1 rounded-full text-sm font-semibold bg-blue-50 text-blue-700">{order.status}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Order Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Basic Info */}
          <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-xl p-5">
            <h3 className="text-base font-bold mb-4">주문 정보</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
              <div><p className="text-[var(--text-secondary)]">주문번호</p><p className="font-semibold font-mono">{order.id}</p></div>
              <div><p className="text-[var(--text-secondary)]">PO번호</p><p className="font-semibold font-mono">{order.poNumber}</p></div>
              <div><p className="text-[var(--text-secondary)]">주문일시</p><p className="font-semibold">{order.orderedAt}</p></div>
              <div><p className="text-[var(--text-secondary)]">결제일시</p><p className="font-semibold">{order.paidAt}</p></div>
            </div>
          </div>

          {/* Customer & Shipping Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-xl p-5">
              <h3 className="text-base font-bold mb-3 flex items-center gap-2"><User size={16} /> 주문자 정보</h3>
              <div className="space-y-2 text-sm">
                <p><span className="text-[var(--text-secondary)]">이름:</span> {order.customer}</p>
                <p><span className="text-[var(--text-secondary)]">기관:</span> {order.org}</p>
                <p><span className="text-[var(--text-secondary)]">연락처:</span> {order.phone}</p>
              </div>
            </div>
            <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-xl p-5">
              <h3 className="text-base font-bold mb-3 flex items-center gap-2"><MapPin size={16} /> 배송지 정보</h3>
              <div className="space-y-2 text-sm">
                <p>{order.address}</p>
                <p><span className="text-[var(--text-secondary)]">실험실:</span> {order.lab}</p>
                <p><span className="text-[var(--text-secondary)]">요청사항:</span> {order.deliveryNote}</p>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-xl p-5">
            <h3 className="text-base font-bold mb-4">주문 품목</h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-[var(--border)]">
                  <th className="text-left px-3 py-2 font-semibold text-[var(--text-secondary)]">제품명</th>
                  <th className="text-left px-3 py-2 font-semibold text-[var(--text-secondary)]">카탈로그번호</th>
                  <th className="text-center px-3 py-2 font-semibold text-[var(--text-secondary)]">포장단위</th>
                  <th className="text-center px-3 py-2 font-semibold text-[var(--text-secondary)]">수량</th>
                  <th className="text-right px-3 py-2 font-semibold text-[var(--text-secondary)]">단가</th>
                  <th className="text-right px-3 py-2 font-semibold text-[var(--text-secondary)]">소계</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map(item => (
                  <tr key={item.catalogNo} className="border-b border-[var(--border)]">
                    <td className="px-3 py-2.5 font-medium">{item.name}</td>
                    <td className="px-3 py-2.5 font-mono text-xs">{item.catalogNo}</td>
                    <td className="px-3 py-2.5 text-center">{item.size}</td>
                    <td className="px-3 py-2.5 text-center">{item.qty}</td>
                    <td className="px-3 py-2.5 text-right">{fmt(item.unitPrice)}</td>
                    <td className="px-3 py-2.5 text-right font-semibold">{fmt(item.subtotal)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t border-[var(--border)]">
                  <td colSpan={5} className="px-3 py-2 text-right text-[var(--text-secondary)]">소계</td>
                  <td className="px-3 py-2 text-right">{fmt(order.subtotal)}</td>
                </tr>
                <tr><td colSpan={5} className="px-3 py-2 text-right text-[var(--text-secondary)]">VAT (10%)</td><td className="px-3 py-2 text-right">{fmt(order.vat)}</td></tr>
                <tr className="border-t-2 border-[var(--border)]"><td colSpan={5} className="px-3 py-2 text-right font-bold">총 결제금액</td><td className="px-3 py-2 text-right text-lg font-bold text-purple-600">{fmt(order.total)}</td></tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Right: Timeline + Shipping + Memo */}
        <div className="space-y-6">
          {/* Timeline */}
          <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-xl p-5">
            <h3 className="text-base font-bold mb-4">주문 타임라인</h3>
            <div className="space-y-0">
              {timeline.map((t, i) => (
                <div key={t.label} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${t.done ? 'bg-green-500 text-white' : t.current ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-400'}`}>
                      {t.done ? <CheckCircle2 size={14} /> : <span className="text-xs">{i + 1}</span>}
                    </div>
                    {i < timeline.length - 1 && <div className={`w-0.5 h-8 ${t.done ? 'bg-green-300' : 'bg-gray-200'}`} />}
                  </div>
                  <div className="pb-4">
                    <p className={`text-sm font-semibold ${t.current ? 'text-purple-600' : t.done ? 'text-[var(--text)]' : 'text-[var(--text-secondary)]'}`}>{t.label}</p>
                    {t.time && <p className="text-xs text-[var(--text-secondary)]">{t.time}</p>}
                    {t.current && <p className="text-xs text-purple-600 font-semibold mt-0.5">현재 단계</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Panel */}
          <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-xl p-5">
            <h3 className="text-base font-bold mb-4 flex items-center gap-2"><Truck size={16} /> 배송 관리</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-semibold text-[var(--text-secondary)] block mb-1.5">택배사</label>
                <select value={carrier} onChange={e => setCarrier(e.target.value)} className="w-full h-[38px] px-3 border border-[var(--border)] rounded-lg text-sm focus:outline-none focus:border-purple-500">
                  <option>CJ대한통운</option><option>로젠택배</option><option>한진택배</option><option>우체국</option><option>직접배송</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-semibold text-[var(--text-secondary)] block mb-1.5">송장번호</label>
                <input type="text" value={trackingNo} onChange={e => setTrackingNo(e.target.value)} className="w-full h-[38px] px-3 border border-[var(--border)] rounded-lg text-sm focus:outline-none focus:border-purple-500" placeholder="송장번호 입력" />
              </div>
              <button className="w-full h-[38px] bg-purple-600 text-white rounded-lg text-sm font-semibold hover:bg-purple-700 transition-colors">
                출고 완료 처리
              </button>
            </div>
          </div>

          {/* Internal Memo */}
          <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-xl p-5">
            <h3 className="text-base font-bold mb-3 flex items-center gap-2"><MessageSquare size={16} /> 내부 메모</h3>
            <textarea
              value={memo}
              onChange={e => setMemo(e.target.value)}
              className="w-full h-20 px-3 py-2 border border-[var(--border)] rounded-lg text-sm resize-none focus:outline-none focus:border-purple-500"
              placeholder="내부 메모 (구매자에게 미노출)"
            />
            <button className="mt-2 px-3 py-1.5 border border-[var(--border)] rounded-lg text-xs font-semibold hover:bg-gray-50">저장</button>
          </div>
        </div>
      </div>
    </div>
  );
}
