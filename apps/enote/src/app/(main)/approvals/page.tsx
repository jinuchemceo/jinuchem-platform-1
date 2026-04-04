'use client';

import { useState } from 'react';
import { CheckCircle, XCircle, Clock, Search, Filter, ChevronLeft, ChevronRight, Eye } from 'lucide-react';

const tabs = [
  { key: 'pending', label: '승인대기', count: 4 },
  { key: 'approved', label: '승인완료', count: 19 },
  { key: 'rejected', label: '반려', count: 2 },
  { key: 'all', label: '전체', count: 25 },
];

const approvalData = [
  { id: 'ORD-2026-0412', requester: '김연구', dept: '유기합성팀', product: 'Sodium hydroxide (NaOH) 1kg x5', amount: '228,000', date: '2026-04-03', status: 'pending', urgency: '일반' },
  { id: 'ORD-2026-0411', requester: '박석사', dept: '분석화학팀', product: 'PIPES 25G + Toluene 2.5L', amount: '635,400', date: '2026-04-03', status: 'pending', urgency: '긴급' },
  { id: 'ORD-2026-0410', requester: '이박사', dept: '유기합성팀', product: 'Acetone ACS 25mL x10', amount: '878,000', date: '2026-04-02', status: 'pending', urgency: '일반' },
  { id: 'ORD-2026-0409', requester: '최학생', dept: '바이오팀', product: 'Methanol HPLC 1L x3', amount: '151,000', date: '2026-04-01', status: 'pending', urgency: '일반' },
  { id: 'ORD-2026-0408', requester: '김연구', dept: '유기합성팀', product: 'Ethanol absolute 2.5L x2', amount: '124,000', date: '2026-03-31', status: 'approved', urgency: '일반' },
  { id: 'ORD-2026-0407', requester: '박석사', dept: '분석화학팀', product: 'Chloroform HPLC 4L', amount: '89,000', date: '2026-03-30', status: 'approved', urgency: '일반' },
  { id: 'ORD-2026-0406', requester: '이박사', dept: '유기합성팀', product: 'Dichloromethane 2.5L', amount: '56,000', date: '2026-03-29', status: 'rejected', urgency: '일반' },
  { id: 'ORD-2026-0405', requester: '최학생', dept: '바이오팀', product: 'PBS Buffer 500mL x10', amount: '320,000', date: '2026-03-28', status: 'approved', urgency: '긴급' },
];

const statusBadge = (status: string) => {
  switch (status) {
    case 'pending': return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-700">승인대기</span>;
    case 'approved': return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-700">승인완료</span>;
    case 'rejected': return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-700">반려</span>;
    default: return null;
  }
};

export default function ApprovalsPage() {
  const [activeTab, setActiveTab] = useState('pending');
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = approvalData.filter(item => {
    if (activeTab !== 'all' && item.status !== activeTab) return false;
    if (searchTerm && !item.requester.includes(searchTerm) && !item.id.includes(searchTerm) && !item.product.includes(searchTerm)) return false;
    return true;
  });

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-900 mb-1">구매 승인 관리</h1>
      <p className="text-sm text-gray-500 mb-6">연구실원의 구매 요청을 승인하거나 반려합니다.</p>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.key
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
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
          <input
            type="text"
            placeholder="주문번호, 요청자, 제품명 검색..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 h-[38px] border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <select className="h-[38px] px-3 border border-gray-300 rounded-lg text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option>전체 기간</option>
          <option>최근 7일</option>
          <option>최근 30일</option>
          <option>최근 90일</option>
        </select>
        <select className="h-[38px] px-3 border border-gray-300 rounded-lg text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option>전체 요청자</option>
          <option>김연구</option>
          <option>박석사</option>
          <option>이박사</option>
          <option>최학생</option>
        </select>
        <select className="h-[38px] px-3 border border-gray-300 rounded-lg text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option>전체 금액</option>
          <option>10만원 미만</option>
          <option>10~50만원</option>
          <option>50만원 이상</option>
        </select>
        <button className="h-[38px] px-4 bg-gray-100 text-gray-600 rounded-lg text-sm hover:bg-gray-200 flex items-center gap-1">
          <Filter size={14} /> 초기화
        </button>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-gray-500">주문번호</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">요청자</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">부서</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">제품</th>
              <th className="px-4 py-3 text-right font-medium text-gray-500">금액</th>
              <th className="px-4 py-3 text-center font-medium text-gray-500">요청일</th>
              <th className="px-4 py-3 text-center font-medium text-gray-500">상태</th>
              <th className="px-4 py-3 text-center font-medium text-gray-500">액션</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map(item => (
              <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 font-medium text-blue-600">{item.id}</td>
                <td className="px-4 py-3 text-gray-900">
                  {item.requester}
                  {item.urgency === '긴급' && <span className="ml-1.5 px-1.5 py-0.5 bg-red-100 text-red-600 rounded text-xs">긴급</span>}
                </td>
                <td className="px-4 py-3 text-gray-600">{item.dept}</td>
                <td className="px-4 py-3 text-gray-700 max-w-[240px] truncate">{item.product}</td>
                <td className="px-4 py-3 text-right font-medium text-gray-900">{item.amount}원</td>
                <td className="px-4 py-3 text-center text-gray-500">{item.date}</td>
                <td className="px-4 py-3 text-center">{statusBadge(item.status)}</td>
                <td className="px-4 py-3 text-center">
                  {item.status === 'pending' ? (
                    <div className="flex items-center justify-center gap-1.5">
                      <button className="h-[30px] px-3 bg-blue-500 text-white rounded-md text-xs font-medium hover:bg-blue-600 flex items-center gap-1">
                        <CheckCircle size={12} /> 승인
                      </button>
                      <button className="h-[30px] px-3 bg-white border border-red-300 text-red-600 rounded-md text-xs font-medium hover:bg-red-50 flex items-center gap-1">
                        <XCircle size={12} /> 반려
                      </button>
                    </div>
                  ) : (
                    <button className="h-[30px] px-3 bg-gray-100 text-gray-600 rounded-md text-xs hover:bg-gray-200 flex items-center gap-1 mx-auto">
                      <Eye size={12} /> 상세
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center gap-1 mt-6">
        <button className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 text-gray-400 hover:bg-gray-100">
          <ChevronLeft size={14} />
        </button>
        <button className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-500 text-white text-sm font-medium">1</button>
        <button className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 text-gray-600 text-sm hover:bg-gray-100">2</button>
        <button className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 text-gray-600 text-sm hover:bg-gray-100">3</button>
        <button className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 text-gray-400 hover:bg-gray-100">
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}
