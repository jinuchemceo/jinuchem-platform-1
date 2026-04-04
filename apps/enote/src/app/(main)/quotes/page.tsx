'use client';

import { useState } from 'react';
import { Search, Eye, ChevronLeft, ChevronRight, FileText, Clock, CheckCircle, ShoppingCart } from 'lucide-react';

const tabs = [
  { key: 'all', label: '전체', count: 20 },
  { key: 'waiting', label: '견적대기', count: 3 },
  { key: 'arrived', label: '견적도착', count: 5 },
  { key: 'ordered', label: '주문완료', count: 12 },
];

const quotesData = [
  { id: 'QT-2026-0120', requester: '김연구', supplier: 'Sigma-Aldrich', product: 'Palladium catalyst set (5종)', amount: '3,250,000', status: 'waiting', date: '2026-04-03' },
  { id: 'QT-2026-0119', requester: '이박사', supplier: 'TCI', product: 'HPLC Column C18 250mm', amount: '1,850,000', status: 'waiting', date: '2026-04-02' },
  { id: 'QT-2026-0118', requester: '박석사', supplier: 'Alfa Aesar', product: 'Rare earth metals set', amount: '4,500,000', status: 'waiting', date: '2026-04-01' },
  { id: 'QT-2026-0117', requester: '김연구', supplier: 'Sigma-Aldrich', product: 'Grubbs Catalyst 2nd Gen 1g', amount: '980,000', status: 'arrived', date: '2026-03-30' },
  { id: 'QT-2026-0116', requester: '최학생', supplier: 'TCI', product: 'Buffer solution set (pH 4,7,10)', amount: '245,000', status: 'arrived', date: '2026-03-29' },
  { id: 'QT-2026-0115', requester: '이박사', supplier: 'Alfa Aesar', product: 'Gold nanoparticles 50nm', amount: '1,200,000', status: 'arrived', date: '2026-03-28' },
  { id: 'QT-2026-0114', requester: '정연구', supplier: 'Sigma-Aldrich', product: 'Deuterated solvents set', amount: '560,000', status: 'arrived', date: '2026-03-27' },
  { id: 'QT-2026-0113', requester: '한석사', supplier: 'TCI', product: 'Amino acid standards kit', amount: '380,000', status: 'arrived', date: '2026-03-26' },
  { id: 'QT-2026-0112', requester: '김연구', supplier: 'Sigma-Aldrich', product: 'Sodium hydroxide 1kg x10', amount: '456,000', status: 'ordered', date: '2026-03-25' },
  { id: 'QT-2026-0111', requester: '박석사', supplier: 'TCI', product: 'Methanol HPLC 2.5L x4', amount: '312,000', status: 'ordered', date: '2026-03-24' },
];

const statusBadge = (status: string) => {
  switch (status) {
    case 'waiting': return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-700"><Clock size={11} /> 견적대기</span>;
    case 'arrived': return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-700"><FileText size={11} /> 견적도착</span>;
    case 'ordered': return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-700"><ShoppingCart size={11} /> 주문완료</span>;
    default: return null;
  }
};

export default function QuotesPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = quotesData.filter(q => {
    if (activeTab !== 'all' && q.status !== activeTab) return false;
    if (searchTerm && !q.id.includes(searchTerm) && !q.requester.includes(searchTerm) && !q.supplier.includes(searchTerm) && !q.product.includes(searchTerm)) return false;
    return true;
  });

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-900 mb-1">견적 관리</h1>
      <p className="text-sm text-gray-500 mb-6">견적 요청부터 주문 완료까지의 현황을 관리합니다.</p>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.key ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label} <span className={`ml-1 px-1.5 py-0.5 rounded-full text-xs ${activeTab === tab.key ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'}`}>{tab.count}</span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="견적번호, 요청자, 공급사, 제품명 검색..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 h-[38px] border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <select className="h-[38px] px-3 border border-gray-300 rounded-lg text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option>전체 공급사</option>
          <option>Sigma-Aldrich</option>
          <option>TCI</option>
          <option>Alfa Aesar</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-gray-500">견적번호</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">요청자</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">공급사</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">제품</th>
              <th className="px-4 py-3 text-right font-medium text-gray-500">예상금액</th>
              <th className="px-4 py-3 text-center font-medium text-gray-500">상태</th>
              <th className="px-4 py-3 text-center font-medium text-gray-500">요청일</th>
              <th className="px-4 py-3 text-center font-medium text-gray-500">상세</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map(q => (
              <tr key={q.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 font-medium text-blue-600">{q.id}</td>
                <td className="px-4 py-3 text-gray-900">{q.requester}</td>
                <td className="px-4 py-3 text-gray-600">{q.supplier}</td>
                <td className="px-4 py-3 text-gray-700 max-w-[220px] truncate">{q.product}</td>
                <td className="px-4 py-3 text-right font-medium text-gray-900">{q.amount}원</td>
                <td className="px-4 py-3 text-center">{statusBadge(q.status)}</td>
                <td className="px-4 py-3 text-center text-gray-500">{q.date}</td>
                <td className="px-4 py-3 text-center">
                  <button className="h-[30px] px-3 bg-gray-100 text-gray-600 rounded-md text-xs hover:bg-gray-200 flex items-center gap-1 mx-auto">
                    <Eye size={12} /> 상세
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center gap-1 mt-6">
        <button className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 text-gray-400 hover:bg-gray-100"><ChevronLeft size={14} /></button>
        <button className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-500 text-white text-sm font-medium">1</button>
        <button className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 text-gray-600 text-sm hover:bg-gray-100">2</button>
        <button className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 text-gray-400 hover:bg-gray-100"><ChevronRight size={14} /></button>
      </div>
    </div>
  );
}
