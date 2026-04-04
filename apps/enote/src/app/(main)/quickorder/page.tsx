'use client';

import { Upload, Plus, Trash2, ShoppingCart } from 'lucide-react';

const sampleRows = [
  { catalog: 'S8045-1KG', name: 'Sodium hydroxide', qty: 5, price: '45,600', subtotal: '228,000' },
  { catalog: 'P6757-25G', name: 'PIPES', qty: 1, price: '128,000', subtotal: '128,000' },
  { catalog: '', name: '', qty: 1, price: '', subtotal: '' },
];

export default function QuickOrderPage() {
  return (
    <div>
      <h1 className="text-xl font-bold text-gray-900 mb-1">빠른 주문</h1>
      <p className="text-sm text-gray-500 mb-6">제품번호를 직접 입력하거나 CSV 파일로 대량 주문합니다.</p>

      {/* CSV Upload */}
      <div className="bg-white border-2 border-dashed border-gray-300 rounded-xl p-8 text-center mb-6 hover:border-blue-400 transition-colors">
        <Upload size={32} className="mx-auto text-gray-400 mb-3" />
        <p className="text-sm font-medium text-gray-700 mb-1">CSV 파일을 드래그하여 업로드</p>
        <p className="text-xs text-gray-400 mb-3">또는 클릭하여 파일 선택 (카탈로그번호, 수량 형식)</p>
        <button className="h-[38px] px-4 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600">
          파일 선택
        </button>
      </div>

      {/* Manual Entry Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mb-4">
        <div className="px-5 py-3 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-sm font-bold text-gray-900">직접 입력</h2>
          <button className="h-[30px] px-3 bg-blue-50 text-blue-600 rounded-md text-xs font-medium hover:bg-blue-100 flex items-center gap-1">
            <Plus size={12} /> 행 추가
          </button>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-gray-500 w-10">#</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">카탈로그번호</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">제품명</th>
              <th className="px-4 py-3 text-center font-medium text-gray-500 w-24">수량</th>
              <th className="px-4 py-3 text-right font-medium text-gray-500">단가</th>
              <th className="px-4 py-3 text-right font-medium text-gray-500">소계</th>
              <th className="px-4 py-3 w-10"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {sampleRows.map((r, i) => (
              <tr key={i} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-400">{i + 1}</td>
                <td className="px-4 py-3">
                  <input type="text" defaultValue={r.catalog} placeholder="카탈로그번호 입력"
                    className="w-full h-[30px] px-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </td>
                <td className="px-4 py-3 text-gray-700">{r.name || <span className="text-gray-300">자동 입력</span>}</td>
                <td className="px-4 py-3 text-center">
                  <input type="number" defaultValue={r.qty} min={1}
                    className="w-16 h-[30px] px-2 border border-gray-300 rounded text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </td>
                <td className="px-4 py-3 text-right text-gray-600">{r.price ? `${r.price}원` : '-'}</td>
                <td className="px-4 py-3 text-right font-medium text-gray-900">{r.subtotal ? `${r.subtotal}원` : '-'}</td>
                <td className="px-4 py-3 text-center">
                  <button className="text-gray-400 hover:text-red-500"><Trash2 size={14} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-end gap-3">
        <span className="text-sm text-gray-500">합계: <span className="font-bold text-gray-900">356,000원</span></span>
        <button className="h-[38px] px-6 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 flex items-center gap-1.5">
          <ShoppingCart size={14} /> 장바구니에 담기
        </button>
      </div>
    </div>
  );
}
