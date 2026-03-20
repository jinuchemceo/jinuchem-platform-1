'use client';

import { useState } from 'react';
import { Search, Plus, MoreHorizontal, Filter } from 'lucide-react';

type Role = '전체' | '연구원' | '조직관리자' | '공급자' | '시스템관리자';

const roles: Role[] = ['전체', '연구원', '조직관리자', '공급자', '시스템관리자'];

const roleColors: Record<string, string> = {
  연구원: 'bg-blue-100 text-blue-700',
  조직관리자: 'bg-purple-100 text-purple-700',
  공급자: 'bg-emerald-100 text-emerald-700',
  시스템관리자: 'bg-orange-100 text-orange-700',
};

const users = [
  { id: 1, name: '김연구', email: 'kim.yeongu@snu.ac.kr', org: '서울대학교 화학과', role: '연구원', status: '활성', lastLogin: '2026-03-20 09:15' },
  { id: 2, name: '이관리', email: 'lee.gwanri@snu.ac.kr', org: '서울대학교 화학과', role: '조직관리자', status: '활성', lastLogin: '2026-03-20 08:42' },
  { id: 3, name: '박실험', email: 'park.silheom@kaist.ac.kr', org: 'KAIST 생명공학과', role: '연구원', status: '활성', lastLogin: '2026-03-19 17:30' },
  { id: 4, name: '최공급', email: 'choi@sigmakorea.com', org: '(주)시그마코리아', role: '공급자', status: '활성', lastLogin: '2026-03-20 10:05' },
  { id: 5, name: '정화학', email: 'jung.hwahak@postech.ac.kr', org: 'POSTECH 화학공학과', role: '연구원', status: '활성', lastLogin: '2026-03-19 14:22' },
  { id: 6, name: '한시스템', email: 'han.system@jinuchem.com', org: '(주)지누켐', role: '시스템관리자', status: '활성', lastLogin: '2026-03-20 07:00' },
  { id: 7, name: '윤분석', email: 'yoon.bunseok@yonsei.ac.kr', org: '연세대학교 약학과', role: '연구원', status: '비활성', lastLogin: '2026-02-28 16:45' },
  { id: 8, name: '강배송', email: 'kang@tcichem.co.kr', org: 'TCI Korea', role: '공급자', status: '활성', lastLogin: '2026-03-20 09:50' },
  { id: 9, name: '오재료', email: 'oh.jaeryo@korea.ac.kr', org: '고려대학교 신소재공학부', role: '연구원', status: '활성', lastLogin: '2026-03-19 11:15' },
  { id: 10, name: '임승인', email: 'lim.seungin@kaist.ac.kr', org: 'KAIST 생명공학과', role: '조직관리자', status: '활성', lastLogin: '2026-03-20 08:10' },
];

export default function UsersPage() {
  const [selectedRole, setSelectedRole] = useState<Role>('전체');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredUsers = users.filter((user) => {
    const matchesRole = selectedRole === '전체' || user.role === selectedRole;
    const matchesSearch =
      user.name.includes(searchQuery) ||
      user.email.includes(searchQuery) ||
      user.org.includes(searchQuery);
    return matchesRole && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text)]">사용자 관리</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">전체 사용자 {users.length}명</p>
        </div>
        <button className="h-[var(--btn-height)] px-4 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors flex items-center gap-2">
          <Plus size={16} />
          사용자 추가
        </button>
      </div>

      {/* Filters */}
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-4">
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="이름, 이메일, 소속 검색..."
              className="w-full pl-10 pr-4 h-[var(--btn-height)] border border-[var(--border)] rounded-lg bg-[var(--bg)] text-sm focus:outline-none focus:border-orange-500 text-[var(--text)]"
            />
          </div>

          {/* Role Filter */}
          <div className="flex items-center gap-1">
            <Filter size={16} className="text-[var(--text-secondary)] mr-1" />
            {roles.map((role) => (
              <button
                key={role}
                onClick={() => setSelectedRole(role)}
                className={`px-3 h-[var(--btn-height)] text-sm rounded-lg transition-colors ${
                  selectedRole === role
                    ? 'bg-orange-600 text-white font-medium'
                    : 'bg-[var(--bg)] text-[var(--text-secondary)] hover:bg-gray-100 border border-[var(--border)]'
                }`}
              >
                {role}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* User Table */}
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[var(--bg)] border-b border-[var(--border)]">
              <th className="text-left px-5 py-3 font-semibold text-[var(--text-secondary)]">이름</th>
              <th className="text-left px-5 py-3 font-semibold text-[var(--text-secondary)]">이메일</th>
              <th className="text-left px-5 py-3 font-semibold text-[var(--text-secondary)]">소속</th>
              <th className="text-left px-5 py-3 font-semibold text-[var(--text-secondary)]">역할</th>
              <th className="text-left px-5 py-3 font-semibold text-[var(--text-secondary)]">상태</th>
              <th className="text-left px-5 py-3 font-semibold text-[var(--text-secondary)]">마지막 접속</th>
              <th className="text-center px-5 py-3 font-semibold text-[var(--text-secondary)]">관리</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id} className="border-b border-[var(--border)] hover:bg-[var(--bg)] transition-colors">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-orange-100 text-orange-700 rounded-full flex items-center justify-center text-xs font-bold">
                      {user.name.charAt(0)}
                    </div>
                    <span className="font-medium text-[var(--text)]">{user.name}</span>
                  </div>
                </td>
                <td className="px-5 py-3.5 text-[var(--text-secondary)]">{user.email}</td>
                <td className="px-5 py-3.5 text-[var(--text)]">{user.org}</td>
                <td className="px-5 py-3.5">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${roleColors[user.role] || ''}`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    user.status === '활성' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {user.status}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-[var(--text-secondary)]">{user.lastLogin}</td>
                <td className="px-5 py-3.5 text-center">
                  <button className="w-8 h-8 flex items-center justify-center rounded-lg text-[var(--text-secondary)] hover:bg-gray-100 transition-colors mx-auto">
                    <MoreHorizontal size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
