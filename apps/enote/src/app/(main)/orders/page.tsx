'use client';

import { useState } from 'react';
import { Search, Filter, Eye, ChevronLeft, ChevronRight, Download, Package, Truck, CheckCircle, XCircle, Clock } from 'lucide-react';

const tabs = [
  { key: 'all', label: '전체', count: 25 },
  { key: 'pending', label: '승인대기', count: 2 },
  { key: 'shipping', label: '배송중', count: 1 },
  { key: 'delivered', label: '배송완료', count: 5 },
  { key: 'rejected', label: '반려', count: 1 },
];

const ordersData = [
  { id: 'ORD-2026-0412', orderer: '김연구', product: 'Sodium hydroxide (NaOH) 1kg x5', amount: '228,000', status: 'pending', approval: '대기', date: '2026-04-03' },
  { id: 'ORD-2026-0411', orderer: '박석사', product: 'PIPES 25G + Toluene 2.5L', amount: '635,400', status: 'pending', approval: '대기', date: '2026-04-03' },
  { id: 'ORD-2026-0410', orderer: '이박사', product: 'Acetone ACS 25mL x10', amount: '878,000', status: 'shipping', approval: '승인', date: '2026-04-02' },
  { id: 'ORD-2026-0409', orderer: '최학생', product: 'Methanol HPLC 1L x3', amount: '151,000', status: 'delivered', approval: '승인', date: '2026-04-01' },
  { id: 'ORD-2026-0408', orderer: '김연구', product: 'Ethanol absolute 2.5L x2', amount: '124,000', status: 'delivered', approval: '승인', date: '2026-03-31' },
  { id: 'ORD-2026-0407', orderer: '박석사', product: 'Chloroform HPLC 4L', amount: '89,000', status: 'delivered', approval: '승인', date: '2026-03-30' },
  { id: 'ORD-2026-0406', orderer: '이박사', product: 'Dichloromethane 2.5L', amount: '56,000', status: 'rejected', approval: '반려', date: '2026-03-29' },
  { id: 'ORD-2026-0405', orderer: '정연구', product: 'PBS Buffer 500mL x10', amount: '320,000', status: 'delivered', approval: '승인', date: '2026-03-28' },
  { id: 'ORD-2026-0404', orderer: '한석사', product: 'Pipette Tips 1000uL x5pk', amount: '125,000', status: 'delivered', approval: '승인', date: '2026-03-25' },
];

const statusBadge = (status: string) => {
  switch (status) {
    case 'pending': return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-700"><Clock size={11} /> 승인대기</span>;
    case 'shipping': return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-700"><Truck size={11} /> 배송중</span>;
    case 'delivered': return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-700"><CheckCircle size={11} /> 배송완료</span>;
    case 'rejected': return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-700"><XCircle size={11} /> 반려</span>;
    default: return null;
  }
};

const approvalBadge = (a: string) => {
  switch (a) {
    case '대기': return <span className="px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-700">대기</span>;
    case '승인': return <span className="px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-700">승인</span>;
    case '반려': return <span className="px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-700">반려</span>;
    default: return null;
  }
};

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = ordersData.filter(o => {
    if (activeTab !== 'all' && o.status !== activeTab) return false;
    if (searchTerm && !o.id.includes(searchTerm) && !o.orderer.includes(searchTerm) && !o.product.includes(searchTerm)) return false;
    return true;
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900 mb-1">통합 주문 내역</h1>
          <p className="text-sm text-gray-500">연구실 전체 주문 현황을 조회합니다.</p>
        </div>
        <button className="h-[38px] px-4 bg-white border border-gray-300 text-gray-600 rounded-lg text-sm hover:bg-gray-50 flex items-center gap-1.5">
          <Download size={14} /> 엑셀 다운로드
        </button>
      </div>

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

      {/* Filter Toolbar */}
      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="주문번호, 주문자, 제품명 검색..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 h-[38px] border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <select className="h-[38px] px-3 border border-gray-300 rounded-lg text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option>전체 상태</option>
          <option>승인대기</option>
          <option>배송중</option>
          <option>배송완료</option>
          <option>반려</option>
        </select>
        <select className="h-[38px] px-3 border border-gray-300 rounded-lg text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option>전체 주문자</option>
          <option>김연구</option>
          <option>박석사</option>
          <option>이박사</option>
          <option>최학생</option>
        </select>
        <select className="h-[38px] px-3 border border-gray-300 rounded-lg text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option>전체 기간</option>
          <option>최근 7일</option>
          <option>최근 30일</option>
          <option>최근 90일</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-gray-500">주문번호</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">주문자</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">제품</th>
              <th className="px-4 py-3 text-right font-medium text-gray-500">금액</th>
              <th className="px-4 py-3 text-center font-medium text-gray-500">상태</th>
              <th className="px-4 py-3 text-center font-medium text-gray-500">승인</th>
              <th className="px-4 py-3 text-center font-medium text-gray-500">주문일</th>
              <th className="px-4 py-3 text-center font-medium text-gray-500">상세</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map(o => (
              <tr key={o.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 font-medium text-blue-600">{o.id}</td>
                <td className="px-4 py-3 text-gray-900">{o.orderer}</td>
                <td className="px-4 py-3 text-gray-700 max-w-[240px] truncate">{o.product}</td>
                <td className="px-4 py-3 text-right font-medium text-gray-900">{o.amount}원</td>
                <td className="px-4 py-3 text-center">{statusBadge(o.status)}</td>
                <td className="px-4 py-3 text-center">{approvalBadge(o.approval)}</td>
                <td className="px-4 py-3 text-center text-gray-500">{o.date}</td>
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
        <button className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 text-gray-600 text-sm hover:bg-gray-100">3</button>
        <button className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 text-gray-400 hover:bg-gray-100"><ChevronRight size={14} /></button>
      </div>
    </div>
  );
}
