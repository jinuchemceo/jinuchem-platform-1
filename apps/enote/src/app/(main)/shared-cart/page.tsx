'use client';

import { useState } from 'react';
import { ShoppingCart, Trash2, Plus, CheckSquare, Square, ChevronDown, Users } from 'lucide-react';

const cartItems = [
  { id: 1, name: 'Sodium hydroxide (NaOH)', cas: '1310-73-2', spec: '1kg, ACS reagent', qty: 5, price: 45600, addedBy: '김연구', memo: '합성실험용' },
  { id: 2, name: 'PIPES', cas: '5625-37-6', spec: '25g, BioReagent', qty: 1, price: 128000, addedBy: '박석사', memo: '' },
  { id: 3, name: 'Toluene', cas: '108-88-3', spec: '2.5L, anhydrous', qty: 1, price: 89400, addedBy: '박석사', memo: '건조용매' },
  { id: 4, name: 'Acetone', cas: '67-64-1', spec: '25mL, ACS reagent', qty: 10, price: 12800, addedBy: '이박사', memo: '세척용' },
  { id: 5, name: 'Methanol', cas: '67-56-1', spec: '1L, HPLC grade', qty: 3, price: 50300, addedBy: '최학생', memo: 'HPLC 이동상' },
];

export default function SharedCartPage() {
  const [selected, setSelected] = useState<number[]>([]);
  const [activeCart, setActiveCart] = useState('유기합성 연구실');

  const toggleSelect = (id: number) => {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };
  const toggleAll = () => {
    if (selected.length === cartItems.length) setSelected([]);
    else setSelected(cartItems.map(c => c.id));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  const vat = Math.round(subtotal * 0.1);
  const total = subtotal + vat;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900 mb-1">공유 장바구니</h1>
          <p className="text-sm text-gray-500">연구실 구성원이 함께 사용하는 장바구니입니다.</p>
        </div>
        <button className="h-[38px] px-4 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 flex items-center gap-1.5">
          <Plus size={14} /> 제품 추가
        </button>
      </div>

      {/* Cart Selector */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center gap-2 px-3 h-[38px] bg-white border border-gray-300 rounded-lg text-sm">
          <Users size={14} className="text-gray-400" />
          <select
            value={activeCart}
            onChange={e => setActiveCart(e.target.value)}
            className="bg-transparent border-none text-sm text-gray-700 focus:outline-none"
          >
            <option>유기합성 연구실</option>
            <option>분석화학팀</option>
            <option>바이오팀</option>
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <span className="text-xs text-gray-400">총 품목</span>
          <div className="text-lg font-bold text-gray-900 mt-1">{cartItems.length}개</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <span className="text-xs text-gray-400">참여 인원</span>
          <div className="text-lg font-bold text-gray-900 mt-1">{new Set(cartItems.map(c => c.addedBy)).size}명</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <span className="text-xs text-gray-400">총 금액 (VAT 포함)</span>
          <div className="text-lg font-bold text-blue-600 mt-1">{total.toLocaleString()}원</div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left w-10">
                <button onClick={toggleAll} className="text-gray-400 hover:text-gray-600">
                  {selected.length === cartItems.length ? <CheckSquare size={16} /> : <Square size={16} />}
                </button>
              </th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">제품명</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">CAS No.</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">규격</th>
              <th className="px-4 py-3 text-center font-medium text-gray-500">수량</th>
              <th className="px-4 py-3 text-right font-medium text-gray-500">단가</th>
              <th className="px-4 py-3 text-right font-medium text-gray-500">소계</th>
              <th className="px-4 py-3 text-center font-medium text-gray-500">추가자</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">메모</th>
              <th className="px-4 py-3 text-center font-medium text-gray-500 w-10"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {cartItems.map(item => (
              <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">
                  <button onClick={() => toggleSelect(item.id)} className="text-gray-400 hover:text-gray-600">
                    {selected.includes(item.id) ? <CheckSquare size={16} className="text-blue-500" /> : <Square size={16} />}
                  </button>
                </td>
                <td className="px-4 py-3 font-medium text-gray-900">{item.name}</td>
                <td className="px-4 py-3 text-gray-500 font-mono text-xs">{item.cas}</td>
                <td className="px-4 py-3 text-gray-600">{item.spec}</td>
                <td className="px-4 py-3 text-center">
                  <input type="number" defaultValue={item.qty} min={1}
                    className="w-14 h-[30px] px-2 border border-gray-300 rounded text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </td>
                <td className="px-4 py-3 text-right text-gray-600">{item.price.toLocaleString()}원</td>
                <td className="px-4 py-3 text-right font-medium text-gray-900">{(item.price * item.qty).toLocaleString()}원</td>
                <td className="px-4 py-3 text-center">
                  <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">{item.addedBy}</span>
                </td>
                <td className="px-4 py-3 text-gray-500 text-xs">{item.memo || '-'}</td>
                <td className="px-4 py-3 text-center">
                  <button className="text-gray-400 hover:text-red-500"><Trash2 size={14} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Total Bar */}
        <div className="border-t border-gray-200 px-4 py-4 bg-gray-50">
          <div className="flex items-center justify-end gap-6">
            <div className="text-sm text-gray-500">소계: <span className="font-medium text-gray-900">{subtotal.toLocaleString()}원</span></div>
            <div className="text-sm text-gray-500">VAT (10%): <span className="font-medium text-gray-900">{vat.toLocaleString()}원</span></div>
            <div className="text-sm font-bold text-blue-600">합계: {total.toLocaleString()}원</div>
            <button className="h-[38px] px-6 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600">
              승인 요청
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
