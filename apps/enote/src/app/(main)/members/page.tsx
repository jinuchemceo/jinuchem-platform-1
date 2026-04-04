'use client';

import { useState } from 'react';
import { Search, UserPlus, MoreHorizontal, Edit2, ChevronLeft, ChevronRight, CheckSquare, Square, Users, UserCheck, UserX } from 'lucide-react';

const tabs = [
  { key: 'all', label: '전체', count: 8 },
  { key: 'active', label: '활성', count: 6 },
  { key: 'inactive', label: '비활성', count: 2 },
];

const members = [
  { id: 1, name: '김연구', dept: '유기합성팀', role: '선임연구원', permission: '주문+승인요청', monthOrders: 5, amount: '635,400', status: 'active', lastActive: '2026-04-03 14:22', email: 'kimr@lab.ac.kr' },
  { id: 2, name: '박석사', dept: '분석화학팀', role: '석사과정', permission: '주문', monthOrders: 3, amount: '412,000', status: 'active', lastActive: '2026-04-03 11:05', email: 'parks@lab.ac.kr' },
  { id: 3, name: '이박사', dept: '유기합성팀', role: '박사과정', permission: '주문+승인요청', monthOrders: 7, amount: '1,245,000', status: 'active', lastActive: '2026-04-02 16:40', email: 'leed@lab.ac.kr' },
  { id: 4, name: '최학생', dept: '바이오팀', role: '학부연구생', permission: '주문', monthOrders: 2, amount: '151,000', status: 'active', lastActive: '2026-04-01 09:30', email: 'chois@lab.ac.kr' },
  { id: 5, name: '정연구', dept: '유기합성팀', role: '연구원', permission: '주문', monthOrders: 4, amount: '523,000', status: 'active', lastActive: '2026-03-31 15:12', email: 'jungr@lab.ac.kr' },
  { id: 6, name: '한석사', dept: '분석화학팀', role: '석사과정', permission: '주문', monthOrders: 1, amount: '89,000', status: 'active', lastActive: '2026-03-30 10:45', email: 'hans@lab.ac.kr' },
  { id: 7, name: '윤박사', dept: '바이오팀', role: '박사후연구원', permission: '주문+승인요청', monthOrders: 0, amount: '0', status: 'inactive', lastActive: '2026-02-15 11:20', email: 'yoond@lab.ac.kr' },
  { id: 8, name: '강학생', dept: '유기합성팀', role: '학부연구생', permission: '주문', monthOrders: 0, amount: '0', status: 'inactive', lastActive: '2026-01-20 14:05', email: 'kangs@lab.ac.kr' },
];

const permissionBadge = (perm: string) => {
  if (perm.includes('승인요청')) {
    return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-700">{perm}</span>;
  }
  return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">{perm}</span>;
};

export default function MembersPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selected, setSelected] = useState<number[]>([]);

  const filtered = members.filter(m => {
    if (activeTab === 'active' && m.status !== 'active') return false;
    if (activeTab === 'inactive' && m.status !== 'inactive') return false;
    if (searchTerm && !m.name.includes(searchTerm) && !m.dept.includes(searchTerm) && !m.email.includes(searchTerm)) return false;
    return true;
  });

  const toggleSelect = (id: number) => {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const toggleAll = () => {
    if (selected.length === filtered.length) setSelected([]);
    else setSelected(filtered.map(m => m.id));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900 mb-1">연구실원 관리</h1>
          <p className="text-sm text-gray-500">연구실 구성원의 권한과 활동을 관리합니다.</p>
        </div>
        <button className="h-[38px] px-4 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 flex items-center gap-1.5">
          <UserPlus size={14} /> 연구실원 초대
        </button>
      </div>

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

      {/* Search + Batch Actions */}
      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="이름, 소속, 이메일 검색..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 h-[38px] border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        {selected.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">{selected.length}명 선택</span>
            <button className="h-[38px] px-3 bg-green-50 text-green-700 border border-green-200 rounded-lg text-sm hover:bg-green-100 flex items-center gap-1">
              <UserCheck size={14} /> 활성화
            </button>
            <button className="h-[38px] px-3 bg-yellow-50 text-yellow-700 border border-yellow-200 rounded-lg text-sm hover:bg-yellow-100 flex items-center gap-1">
              <UserX size={14} /> 비활성화
            </button>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left w-10">
                <button onClick={toggleAll} className="text-gray-400 hover:text-gray-600">
                  {selected.length === filtered.length && filtered.length > 0 ? <CheckSquare size={16} /> : <Square size={16} />}
                </button>
              </th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">이름</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">소속</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">역할</th>
              <th className="px-4 py-3 text-center font-medium text-gray-500">권한</th>
              <th className="px-4 py-3 text-right font-medium text-gray-500">이번달 주문</th>
              <th className="px-4 py-3 text-center font-medium text-gray-500">상태</th>
              <th className="px-4 py-3 text-center font-medium text-gray-500">최근 활동</th>
              <th className="px-4 py-3 text-center font-medium text-gray-500">편집</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map(m => (
              <tr key={m.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">
                  <button onClick={() => toggleSelect(m.id)} className="text-gray-400 hover:text-gray-600">
                    {selected.includes(m.id) ? <CheckSquare size={16} className="text-blue-500" /> : <Square size={16} />}
                  </button>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">
                      {m.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{m.name}</div>
                      <div className="text-xs text-gray-400">{m.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-600">{m.dept}</td>
                <td className="px-4 py-3 text-gray-600">{m.role}</td>
                <td className="px-4 py-3 text-center">{permissionBadge(m.permission)}</td>
                <td className="px-4 py-3 text-right text-gray-900">
                  {m.monthOrders}건 / {m.amount}원
                </td>
                <td className="px-4 py-3 text-center">
                  {m.status === 'active'
                    ? <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-700">활성</span>
                    : <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-500">비활성</span>
                  }
                </td>
                <td className="px-4 py-3 text-center text-xs text-gray-400">{m.lastActive}</td>
                <td className="px-4 py-3 text-center">
                  <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600">
                    <Edit2 size={14} />
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
        <button className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 text-gray-400 hover:bg-gray-100"><ChevronRight size={14} /></button>
      </div>
    </div>
  );
}
