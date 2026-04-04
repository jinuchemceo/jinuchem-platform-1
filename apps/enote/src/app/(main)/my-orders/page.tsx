'use client';

import { useState } from 'react';
import { Search, Eye, ChevronLeft, ChevronRight, Clock, Truck, CheckCircle, Package } from 'lucide-react';

const tabs = [
  { key: 'all', label: '전체', count: 12 },
  { key: 'processing', label: '처리중', count: 2 },
  { key: 'shipping', label: '배송중', count: 1 },
  { key: 'delivered', label: '배송완료', count: 9 },
];

const orders = [
  { id: 'ORD-2026-0412', product: 'Sodium hydroxide 1kg x5', amount: '228,000', status: 'processing', date: '2026-04-03' },
  { id: 'ORD-2026-0408', product: 'Ethanol absolute 2.5L x2', amount: '124,000', status: 'shipping', date: '2026-03-31' },
  { id: 'ORD-2026-0401', product: 'Acetonitrile HPLC 2.5L', amount: '95,000', status: 'delivered', date: '2026-03-25' },
  { id: 'ORD-2026-0395', product: 'Sodium chloride 500g x3', amount: '36,000', status: 'delivered', date: '2026-03-20' },
  { id: 'ORD-2026-0388', product: 'Hydrochloric acid 2.5L', amount: '42,000', status: 'delivered', date: '2026-03-15' },
];

const statusBadge = (s: string) => {
  switch (s) {
    case 'processing': return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-700"><Clock size={11} /> 처리중</span>;
    case 'shipping': return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-700"><Truck size={11} /> 배송중</span>;
    case 'delivered': return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-700"><CheckCircle size={11} /> 배송완료</span>;
    default: return null;
  }
};

export default function MyOrdersPage() {
  const [activeTab, setActiveTab] = useState('all');

  const filtered = orders.filter(o => activeTab === 'all' || o.status === activeTab);

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-900 mb-1">내 주문 내역</h1>
      <p className="text-sm text-gray-500 mb-6">나의 주문 현황을 조회합니다.</p>

      <div className="flex border-b border-gray-200 mb-6">
        {tabs.map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.key ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
            {tab.label} <span className={`ml-1 px-1.5 py-0.5 rounded-full text-xs ${activeTab === tab.key ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'}`}>{tab.count}</span>
          </button>
        ))}
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-gray-500">주문번호</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">제품</th>
              <th className="px-4 py-3 text-right font-medium text-gray-500">금액</th>
              <th className="px-4 py-3 text-center font-medium text-gray-500">상태</th>
              <th className="px-4 py-3 text-center font-medium text-gray-500">주문일</th>
              <th className="px-4 py-3 text-center font-medium text-gray-500">상세</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map(o => (
              <tr key={o.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-blue-600">{o.id}</td>
                <td className="px-4 py-3 text-gray-700">{o.product}</td>
                <td className="px-4 py-3 text-right font-medium text-gray-900">{o.amount}원</td>
                <td className="px-4 py-3 text-center">{statusBadge(o.status)}</td>
                <td className="px-4 py-3 text-center text-gray-500">{o.date}</td>
                <td className="px-4 py-3 text-center">
                  <button className="h-[30px] px-3 bg-gray-100 text-gray-600 rounded-md text-xs hover:bg-gray-200 flex items-center gap-1 mx-auto"><Eye size={12} /> 상세</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-center gap-1 mt-6">
        <button className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 text-gray-400 hover:bg-gray-100"><ChevronLeft size={14} /></button>
        <button className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-500 text-white text-sm font-medium">1</button>
        <button className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 text-gray-600 text-sm hover:bg-gray-100">2</button>
        <button className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 text-gray-400 hover:bg-gray-100"><ChevronRight size={14} /></button>
      </div>
    </div>
  );
}
