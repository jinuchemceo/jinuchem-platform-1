'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Send,
  Plus,
  Search,
} from 'lucide-react';

interface QuoteItemRow {
  id: number;
  product: string;
  size: string;
  qty: number;
  unitPrice: string;
  deliveryDays: string;
  stockStatus: 'in_stock' | 'order_needed' | 'discontinued';
  altProduct?: string;
  note?: string;
}

const quoteInfo = {
  id: 'QT-0402-001',
  requestedAt: '2026-04-02',
  requester: '김연구',
  org: '서울대학교 화학과',
  department: '유기화학 실험실',
  phone: '010-1234-5678',
  dueDate: '2026-04-05',
};

const initialItems: QuoteItemRow[] = [
  { id: 1, product: 'Ethyl alcohol, Pure', size: '500mL', qty: 3, unitPrice: '158,239', deliveryDays: '1', stockStatus: 'in_stock' },
  { id: 2, product: 'Dichloromethane, ACS', size: '2.5L', qty: 1, unitPrice: '145,000', deliveryDays: '1', stockStatus: 'in_stock' },
  { id: 3, product: 'Methanol, HPLC Grade', size: '4L', qty: 2, unitPrice: '98,500', deliveryDays: '3', stockStatus: 'order_needed' },
];

const stockLabels: Record<string, { label: string; style: string }> = {
  in_stock: { label: '재고', style: 'bg-green-50 text-green-700' },
  order_needed: { label: '발주필요', style: 'bg-amber-50 text-amber-700' },
  discontinued: { label: '단종', style: 'bg-red-50 text-red-700' },
};

export default function QuoteDetailPage() {
  const router = useRouter();
  const [items, setItems] = useState(initialItems);
  const [validDays, setValidDays] = useState('7');
  const [memo, setMemo] = useState('');

  const totalAmount = items.reduce((sum, item) => {
    const price = parseInt(item.unitPrice.replace(/,/g, '')) || 0;
    return sum + price * item.qty;
  }, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => router.push('/quotes')} className="p-2 hover:bg-gray-100 rounded-lg"><ArrowLeft size={20} /></button>
        <div>
          <h1 className="text-2xl font-bold text-[var(--text)]">견적 응답</h1>
          <p className="text-sm text-[var(--text-secondary)]">{quoteInfo.id}</p>
        </div>
        <span className="ml-auto inline-block px-3 py-1 rounded-full text-sm font-semibold bg-amber-50 text-amber-700">대기</span>
      </div>

      {/* Requester Info */}
      <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-xl p-5">
        <h3 className="text-base font-bold mb-3">요청 정보</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
          <div><p className="text-[var(--text-secondary)]">요청자</p><p className="font-semibold">{quoteInfo.requester}</p></div>
          <div><p className="text-[var(--text-secondary)]">기관</p><p className="font-semibold">{quoteInfo.org}</p></div>
          <div><p className="text-[var(--text-secondary)]">부서</p><p className="font-semibold">{quoteInfo.department}</p></div>
          <div><p className="text-[var(--text-secondary)]">마감일</p><p className="font-semibold text-red-600">{quoteInfo.dueDate} (D-3)</p></div>
        </div>
      </div>

      {/* Quote Items */}
      <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-xl p-5">
        <h3 className="text-base font-bold mb-4">요청 품목 / 견적 입력</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-[var(--border)]">
                <th className="text-left px-3 py-2 font-semibold text-[var(--text-secondary)]">제품명</th>
                <th className="text-center px-3 py-2 font-semibold text-[var(--text-secondary)]">규격</th>
                <th className="text-center px-3 py-2 font-semibold text-[var(--text-secondary)]">수량</th>
                <th className="text-left px-3 py-2 font-semibold text-[var(--text-secondary)]">견적 단가</th>
                <th className="text-left px-3 py-2 font-semibold text-[var(--text-secondary)]">납품일</th>
                <th className="text-center px-3 py-2 font-semibold text-[var(--text-secondary)]">재고</th>
                <th className="text-left px-3 py-2 font-semibold text-[var(--text-secondary)]">비고</th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => {
                const stock = stockLabels[item.stockStatus];
                return (
                  <tr key={item.id} className="border-b border-[var(--border)]">
                    <td className="px-3 py-2.5 font-medium">{item.product}</td>
                    <td className="px-3 py-2.5 text-center">{item.size}</td>
                    <td className="px-3 py-2.5 text-center">{item.qty}</td>
                    <td className="px-3 py-2.5">
                      <input
                        type="text"
                        defaultValue={item.unitPrice}
                        className="w-28 h-8 px-2 border border-[var(--border)] rounded text-sm text-right focus:outline-none focus:border-purple-500"
                      />
                    </td>
                    <td className="px-3 py-2.5">
                      <input
                        type="text"
                        defaultValue={item.deliveryDays + '일'}
                        className="w-16 h-8 px-2 border border-[var(--border)] rounded text-sm focus:outline-none focus:border-purple-500"
                      />
                    </td>
                    <td className="px-3 py-2.5 text-center">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${stock.style}`}>{stock.label}</span>
                    </td>
                    <td className="px-3 py-2.5">
                      <input
                        type="text"
                        className="w-32 h-8 px-2 border border-[var(--border)] rounded text-sm focus:outline-none focus:border-purple-500"
                        placeholder="비고"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-[var(--border)]">
          <div className="flex items-center gap-4">
            <div>
              <label className="text-sm font-semibold text-[var(--text-secondary)] block mb-1">유효기간</label>
              <select value={validDays} onChange={e => setValidDays(e.target.value)} className="h-[38px] px-3 border border-[var(--border)] rounded-lg text-sm focus:outline-none focus:border-purple-500">
                <option value="7">7일</option><option value="14">14일</option><option value="30">30일</option><option value="60">60일</option>
              </select>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-[var(--text-secondary)]">총 견적금액 (VAT 별도)</p>
            <p className="text-2xl font-bold text-purple-600">₩{totalAmount.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Memo */}
      <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-xl p-5">
        <h3 className="text-base font-bold mb-3">특이사항 / 메모</h3>
        <textarea
          value={memo}
          onChange={e => setMemo(e.target.value)}
          className="w-full h-20 px-3 py-2 border border-[var(--border)] rounded-lg text-sm resize-none focus:outline-none focus:border-purple-500"
          placeholder="구매자에게 전달할 메모를 입력하세요"
        />
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <button onClick={() => router.push('/quotes')} className="px-5 h-[38px] border border-[var(--border)] rounded-lg text-sm font-semibold hover:bg-gray-50">
          취소
        </button>
        <button
          onClick={() => router.push('/quotes')}
          className="px-5 h-[38px] bg-purple-600 text-white rounded-lg text-sm font-semibold hover:bg-purple-700 flex items-center gap-2"
        >
          <Send size={16} /> 견적서 발송
        </button>
      </div>
    </div>
  );
}
