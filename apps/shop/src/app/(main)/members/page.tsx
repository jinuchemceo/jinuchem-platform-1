'use client';

import { useState } from 'react';
import { Search, Users, Crown, UserCircle, Mail, Phone, FlaskConical, Shield, MoreVertical } from 'lucide-react';

interface LabMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'org_admin' | 'researcher';
  department: string;
  labName: string;
  status: 'active' | 'inactive';
  joinedAt: string;
  lastLoginAt: string;
  orderCount: number;
  totalSpent: number;
}

const sampleMembers: LabMember[] = [
  { id: '1', name: '김교수', email: 'professor@gnu.ac.kr', phone: '010-9876-5432', role: 'org_admin', department: '화학과', labName: '유기화학실험실', status: 'active', joinedAt: '2024-03-01', lastLoginAt: '2026-03-20', orderCount: 45, totalSpent: 12500000 },
  { id: '2', name: '김연구', email: 'researcher@gnu.ac.kr', phone: '010-1234-5678', role: 'researcher', department: '화학과', labName: '유기화학실험실', status: 'active', joinedAt: '2025-03-01', lastLoginAt: '2026-03-20', orderCount: 23, totalSpent: 4850000 },
  { id: '3', name: '이대학', email: 'lee@gnu.ac.kr', phone: '010-2345-6789', role: 'researcher', department: '화학과', labName: '유기화학실험실', status: 'active', joinedAt: '2025-06-15', lastLoginAt: '2026-03-19', orderCount: 18, totalSpent: 3200000 },
  { id: '4', name: '박석사', email: 'park@gnu.ac.kr', phone: '010-3456-7890', role: 'researcher', department: '화학과', labName: '유기화학실험실', status: 'active', joinedAt: '2025-09-01', lastLoginAt: '2026-03-18', orderCount: 12, totalSpent: 2100000 },
  { id: '5', name: '최박사', email: 'choi@gnu.ac.kr', phone: '010-4567-8901', role: 'researcher', department: '화학과', labName: '유기화학실험실', status: 'inactive', joinedAt: '2024-09-01', lastLoginAt: '2026-02-15', orderCount: 31, totalSpent: 6700000 },
  { id: '6', name: '정학부', email: 'jung@gnu.ac.kr', phone: '010-5678-9012', role: 'researcher', department: '화학과', labName: '유기화학실험실', status: 'active', joinedAt: '2026-01-10', lastLoginAt: '2026-03-20', orderCount: 5, totalSpent: 850000 },
];

const roleConfig = {
  org_admin: { label: '조직관리자', color: 'bg-amber-100 text-amber-700', icon: <Crown size={14} /> },
  researcher: { label: '연구원', color: 'bg-blue-100 text-blue-700', icon: <UserCircle size={14} /> },
};

export default function MembersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [selectedMember, setSelectedMember] = useState<LabMember | null>(null);

  const filtered = sampleMembers.filter((m) => {
    if (roleFilter !== 'all' && m.role !== roleFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return m.name.includes(q) || m.email.toLowerCase().includes(q) || m.department.includes(q);
    }
    return true;
  });

  const adminCount = sampleMembers.filter((m) => m.role === 'org_admin').length;
  const researcherCount = sampleMembers.filter((m) => m.role === 'researcher').length;
  const activeCount = sampleMembers.filter((m) => m.status === 'active').length;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[var(--text)]">실험실 멤버</h1>
        <div className="flex items-center gap-2">
          <span className="text-sm text-[var(--text-secondary)]">
            경상국립대학교 화학과 유기화학실험실
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border)] p-4">
          <div className="flex items-center gap-2 mb-2">
            <Users size={16} className="text-blue-500" />
            <span className="text-sm text-[var(--text-secondary)]">전체 멤버</span>
          </div>
          <p className="text-2xl font-bold text-[var(--text)]">{sampleMembers.length}명</p>
        </div>
        <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border)] p-4">
          <div className="flex items-center gap-2 mb-2">
            <Crown size={16} className="text-amber-500" />
            <span className="text-sm text-[var(--text-secondary)]">조직관리자</span>
          </div>
          <p className="text-2xl font-bold text-[var(--text)]">{adminCount}명</p>
        </div>
        <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border)] p-4">
          <div className="flex items-center gap-2 mb-2">
            <UserCircle size={16} className="text-blue-500" />
            <span className="text-sm text-[var(--text-secondary)]">연구원</span>
          </div>
          <p className="text-2xl font-bold text-[var(--text)]">{researcherCount}명</p>
        </div>
        <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border)] p-4">
          <div className="flex items-center gap-2 mb-2">
            <Shield size={16} className="text-emerald-500" />
            <span className="text-sm text-[var(--text-secondary)]">활성 멤버</span>
          </div>
          <p className="text-2xl font-bold text-[var(--text)]">{activeCount}명</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-6">
        {[{ key: 'all', label: '전체' }, { key: 'org_admin', label: '조직관리자' }, { key: 'researcher', label: '연구원' }].map((opt) => (
          <button
            key={opt.key}
            onClick={() => setRoleFilter(opt.key)}
            className={`h-[38px] px-4 text-sm rounded-lg border transition-colors ${
              roleFilter === opt.key ? 'bg-blue-600 text-white border-blue-600' : 'border-[var(--border)] text-[var(--text)] hover:border-blue-400'
            }`}
          >
            {opt.label}
          </button>
        ))}
        <div className="relative ml-auto">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="이름, 이메일 검색"
            className="h-[38px] pl-9 pr-4 w-[200px] border border-[var(--border)] rounded-lg text-sm bg-[var(--bg-card)] text-[var(--text)]"
          />
        </div>
      </div>

      {/* Member List */}
      <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border)] overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-[var(--border)]">
              <th className="text-left px-4 py-3 font-medium text-[var(--text-secondary)]">멤버</th>
              <th className="text-center px-4 py-3 font-medium text-[var(--text-secondary)]">역할</th>
              <th className="text-left px-4 py-3 font-medium text-[var(--text-secondary)]">연락처</th>
              <th className="text-center px-4 py-3 font-medium text-[var(--text-secondary)]">상태</th>
              <th className="text-center px-4 py-3 font-medium text-[var(--text-secondary)]">주문</th>
              <th className="text-right px-4 py-3 font-medium text-[var(--text-secondary)]">총 구매액</th>
              <th className="text-center px-4 py-3 font-medium text-[var(--text-secondary)]">최근 접속</th>
              <th className="w-[40px]"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((member) => {
              const rc = roleConfig[member.role];
              return (
                <tr key={member.id} className="border-b border-[var(--border)] last:border-0 hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold ${member.role === 'org_admin' ? 'bg-amber-500' : 'bg-blue-500'}`}>
                        {member.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-[var(--text)]">{member.name}</p>
                        <p className="text-xs text-[var(--text-secondary)]">{member.department} / {member.labName}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${rc.color}`}>
                      {rc.icon} {rc.label}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 text-xs text-[var(--text-secondary)]">
                      <Mail size={12} /> {member.email}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-[var(--text-secondary)] mt-0.5">
                      <Phone size={12} /> {member.phone}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${member.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                      {member.status === 'active' ? '활성' : '비활성'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center text-[var(--text)]">{member.orderCount}건</td>
                  <td className="px-4 py-3 text-right font-medium text-[var(--text)]">
                    {(member.totalSpent / 10000).toFixed(0)}만원
                  </td>
                  <td className="px-4 py-3 text-center text-xs text-[var(--text-secondary)]">{member.lastLoginAt}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => setSelectedMember(member)}
                      className="text-[var(--text-secondary)] hover:text-[var(--text)]"
                    >
                      <MoreVertical size={14} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-[var(--text-secondary)]">
            <Users size={40} className="mx-auto mb-3 opacity-30" />
            <p>해당 조건의 멤버가 없습니다</p>
          </div>
        )}
      </div>

      {/* Member Detail Modal */}
      {selectedMember && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center" onClick={() => setSelectedMember(null)}>
          <div className="bg-[var(--bg-card)] rounded-2xl w-[480px] p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-[var(--text)]">멤버 상세</h2>
              <button onClick={() => setSelectedMember(null)} className="text-[var(--text-secondary)] hover:text-[var(--text)] text-xl">&times;</button>
            </div>

            <div className="flex items-center gap-4 mb-5">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center text-white text-xl font-bold ${selectedMember.role === 'org_admin' ? 'bg-amber-500' : 'bg-blue-500'}`}>
                {selectedMember.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[var(--text)]">{selectedMember.name}</h3>
                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${roleConfig[selectedMember.role].color}`}>
                  {roleConfig[selectedMember.role].icon} {roleConfig[selectedMember.role].label}
                </span>
              </div>
            </div>

            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div><span className="text-[var(--text-secondary)]">이메일</span><p className="text-[var(--text)]">{selectedMember.email}</p></div>
                <div><span className="text-[var(--text-secondary)]">연락처</span><p className="text-[var(--text)]">{selectedMember.phone}</p></div>
                <div><span className="text-[var(--text-secondary)]">부서</span><p className="text-[var(--text)]">{selectedMember.department}</p></div>
                <div><span className="text-[var(--text-secondary)]">실험실</span><p className="text-[var(--text)]">{selectedMember.labName}</p></div>
                <div><span className="text-[var(--text-secondary)]">가입일</span><p className="text-[var(--text)]">{selectedMember.joinedAt}</p></div>
                <div><span className="text-[var(--text-secondary)]">최근 접속</span><p className="text-[var(--text)]">{selectedMember.lastLoginAt}</p></div>
                <div><span className="text-[var(--text-secondary)]">주문 건수</span><p className="text-[var(--text)] font-medium">{selectedMember.orderCount}건</p></div>
                <div><span className="text-[var(--text-secondary)]">총 구매액</span><p className="text-[var(--text)] font-medium">{(selectedMember.totalSpent / 10000).toFixed(0)}만원</p></div>
              </div>
            </div>

            <button onClick={() => setSelectedMember(null)} className="mt-5 w-full h-[38px] bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700">
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
