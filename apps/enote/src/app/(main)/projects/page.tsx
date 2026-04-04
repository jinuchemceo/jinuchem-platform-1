'use client';

import { useState } from 'react';
import { Search, Plus, Calendar, DollarSign, Users, FolderOpen, ChevronLeft, ChevronRight, MoreHorizontal, ArrowUpDown } from 'lucide-react';

const tabs = [
  { key: 'all', label: '전체과제', count: 4 },
  { key: 'active', label: '진행과제', count: 3 },
  { key: 'upcoming', label: '예정과제', count: 1 },
  { key: 'completed', label: '완료과제', count: 0 },
  { key: 'stopped', label: '중단과제', count: 0 },
];

const projects = [
  {
    id: 'PRJ-2026-001',
    name: '신규 유기촉매 개발 연구',
    status: 'active',
    period: '2026-01-01 ~ 2026-12-31',
    code: 'NRF-2026-R1A1A-001',
    budget: 50000000,
    used: 28500000,
    members: ['김연구', '이박사', '정연구'],
    agency: '한국연구재단',
  },
  {
    id: 'PRJ-2026-002',
    name: 'HPLC 분석법 최적화',
    status: 'active',
    period: '2026-03-01 ~ 2026-08-31',
    code: 'KEIT-2026-BA-045',
    budget: 20000000,
    used: 5200000,
    members: ['박석사', '한석사'],
    agency: '산업기술평가관리원',
  },
  {
    id: 'PRJ-2026-003',
    name: '바이오소재 합성 기초연구',
    status: 'active',
    period: '2026-02-01 ~ 2027-01-31',
    code: 'NRF-2026-R1C1C-012',
    budget: 35000000,
    used: 12800000,
    members: ['최학생', '윤박사', '이박사'],
    agency: '한국연구재단',
  },
  {
    id: 'PRJ-2026-004',
    name: '나노입자 표면개질 연구',
    status: 'upcoming',
    period: '2026-07-01 ~ 2027-06-30',
    code: 'NRF-2026-R1D1D-008',
    budget: 40000000,
    used: 0,
    members: ['김연구', '박석사'],
    agency: '한국연구재단',
  },
];

const statusLabel = (s: string) => {
  switch (s) {
    case 'active': return <span className="px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-700">진행중</span>;
    case 'upcoming': return <span className="px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-700">예정</span>;
    case 'completed': return <span className="px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">완료</span>;
    case 'stopped': return <span className="px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-700">중단</span>;
    default: return null;
  }
};

export default function ProjectsPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = projects.filter(p => {
    if (activeTab !== 'all' && p.status !== activeTab) return false;
    if (searchTerm && !p.name.includes(searchTerm) && !p.code.includes(searchTerm)) return false;
    return true;
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900 mb-1">프로젝트 관리</h1>
          <p className="text-sm text-gray-500">연구과제별 예산 및 참여 인원을 관리합니다.</p>
        </div>
        <button className="h-[38px] px-4 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 flex items-center gap-1.5">
          <Plus size={14} /> 과제 등록
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

      {/* Filter */}
      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="과제명, 과제번호 검색..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 h-[38px] border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select className="h-[38px] px-3 border border-gray-300 rounded-lg text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option>정렬: 최신순</option>
          <option>정렬: 예산순</option>
          <option>정렬: 집행률순</option>
        </select>
        <select className="h-[38px] px-3 border border-gray-300 rounded-lg text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option>전체 지원기관</option>
          <option>한국연구재단</option>
          <option>산업기술평가관리원</option>
        </select>
      </div>

      {/* Project Cards */}
      <div className="space-y-4">
        {filtered.map(p => {
          const pct = p.budget > 0 ? Math.round((p.used / p.budget) * 100) : 0;
          return (
            <div key={p.id} className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  {statusLabel(p.status)}
                  <h3 className="text-sm font-bold text-gray-900">{p.name}</h3>
                </div>
                <button className="text-gray-400 hover:text-gray-600"><MoreHorizontal size={16} /></button>
              </div>

              <div className="grid grid-cols-4 gap-4 mb-3">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Calendar size={13} />
                  <span>{p.period}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <FolderOpen size={13} />
                  <span>{p.code}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <DollarSign size={13} />
                  <span>예산 {(p.budget / 10000).toLocaleString()}만원</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Users size={13} />
                  <span>참여 {p.members.length}명</span>
                </div>
              </div>

              <div className="flex items-center gap-4 mb-3">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-500">집행 {(p.used / 10000).toLocaleString()}만 / {(p.budget / 10000).toLocaleString()}만원</span>
                    <span className="text-xs font-medium text-gray-700">{pct}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: pct > 80 ? '#ef4444' : pct > 50 ? '#f59e0b' : '#3b82f6',
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">참여연구원:</span>
                {p.members.map(m => (
                  <span key={m} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">{m}</span>
                ))}
              </div>
            </div>
          );
        })}
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
