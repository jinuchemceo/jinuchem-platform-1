'use client';

import { useState, useMemo } from 'react';
import {
  Users, Building2, Activity, Search, Plus, MoreHorizontal,
  Edit, Trash2, Filter, Download, ChevronDown, Eye, Mail,
  Phone, Calendar, Shield, X, UserCheck, UserX, UserPlus,
  Building, AlertTriangle, ExternalLink, UserMinus,
  Package, RefreshCw, Link2, Globe,
  FileSpreadsheet, Printer, DollarSign, TrendingUp, Calculator, CheckCircle,
} from 'lucide-react';
import { AdminTabs } from '@/components/shared/AdminTabs';
import { Modal } from '@/components/shared/Modal';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Pagination } from '@/components/shared/Pagination';
import { StatCard } from '@/components/shared/StatCard';
import { useAdminStore } from '@/stores/adminStore';
import {
  mockUsers,
  mockOrganizations,
  mockActivityLogs,
  mockSupplierMappings,
  mockSupplierSettlements,
  mockAdminProducts,
  type User,
  type Organization,
  type SupplierMapping,
  type SupplierSettlement,
} from '@/lib/admin-mock-data';

// ─── Constants ───────────────────────────────────────────────────────────────

type SupplierRole = '전체' | '공급자' | '기업장';
const supplierRoles: SupplierRole[] = ['전체', '공급자', '기업장'];

const roleColors: Record<string, string> = {
  공급자: 'bg-emerald-100 text-emerald-700',
  기업장: 'bg-indigo-100 text-indigo-700',
};

const orgTypeColors: Record<string, string> = {
  기업: 'bg-purple-100 text-purple-700',
};

const syncStatusColors: Record<string, string> = {
  성공: 'bg-emerald-100 text-emerald-700',
  실패: 'bg-red-100 text-red-700',
  '동기화중': 'bg-amber-100 text-amber-700',
};

/** 기업 유형 기관에서 선택 가능한 역할 (공급자/기업장만) */
function getRolesForSupplierOrg(): User['role'][] {
  return ['공급자', '기업장'];
}

type ActionType = '전체' | '로그인' | '주문' | '설정변경' | '역할변경' | '제품등록' | 'API호출';
const actionTypes: ActionType[] = ['전체', '로그인', '주문', '설정변경', '역할변경', '제품등록', 'API호출'];

const actionColors: Record<string, string> = {
  로그인: 'bg-blue-100 text-blue-700',
  주문: 'bg-emerald-100 text-emerald-700',
  설정변경: 'bg-amber-100 text-amber-700',
  역할변경: 'bg-purple-100 text-purple-700',
  제품등록: 'bg-teal-100 text-teal-700',
  API호출: 'bg-orange-100 text-orange-700',
};

const USERS_PER_PAGE = 8;

const tabs = [
  { id: '공급자 목록', label: '공급자 목록' },
  { id: '공급사 관리', label: '공급사 관리' },
  { id: '정산 관리', label: '정산 관리' },
  { id: '활동 로그', label: '활동 로그' },
];

// ─── Page ────────────────────────────────────────────────────────────────────

export default function SuppliersMgmtPage() {
  const { selectedUserIds, toggleUserSelection, selectAllUsers, clearUserSelection, activeModal, modalData, openModal, closeModal } = useAdminStore();

  // Local tab state
  const [suppliersTab, setSuppliersTab] = useState('공급자 목록');

  // Mutable data (local state)
  const [users, setUsers] = useState<User[]>(() => mockUsers.filter((u) => u.role === '공급자' || u.role === '기업장'));
  const [organizations, setOrganizations] = useState<Organization[]>([...mockOrganizations]);
  const [toast, setToast] = useState<string | null>(null);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  }

  // Tab 1 state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<SupplierRole>('전체');
  const [statusFilter, setStatusFilter] = useState<'전체' | '활성' | '비활성'>('전체');
  const [currentPage, setCurrentPage] = useState(1);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  // Tab 2 state
  const [orgSearch, setOrgSearch] = useState('');

  // Settlement tab state
  const [settlementPeriod, setSettlementPeriod] = useState('2026-03');

  // Tab 3 state
  const [logSearch, setLogSearch] = useState('');
  const [logActionFilter, setLogActionFilter] = useState<ActionType>('전체');
  const [logDateFrom, setLogDateFrom] = useState('');
  const [logDateTo, setLogDateTo] = useState('');
  const [logVisibleCount, setLogVisibleCount] = useState(10);

  // Edit form state
  const [editForm, setEditForm] = useState<Partial<User>>({});

  // Org form state
  const [orgForm, setOrgForm] = useState<Partial<Organization>>({});

  // Add user form state
  const [addUserForm, setAddUserForm] = useState<Partial<User>>({ role: '공급자', status: '활성', orgIds: [] });

  // ─── Supplier orgs (기업 type only) ─────────────────────────────────────
  const supplierOrgs = useMemo(() => {
    return organizations.filter((o) => o.type === '기업');
  }, [organizations]);

  // ─── Supplier user IDs (for log filtering) ──────────────────────────────
  const supplierUserIds = useMemo(() => {
    return users.map((u) => u.id);
  }, [users]);

  // ─── Tab 1: Filtered supplier users ─────────────────────────────────────
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchRole = selectedRole === '전체' || u.role === selectedRole;
      const matchStatus = statusFilter === '전체' || u.status === statusFilter;
      const q = searchQuery.toLowerCase();
      const matchSearch = !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.org.toLowerCase().includes(q);
      return matchRole && matchStatus && matchSearch;
    });
  }, [selectedRole, statusFilter, searchQuery, users]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / USERS_PER_PAGE));
  const pagedUsers = filteredUsers.slice((currentPage - 1) * USERS_PER_PAGE, currentPage * USERS_PER_PAGE);
  const pagedUserIds = pagedUsers.map((u) => u.id);

  const activeCount = users.filter((u) => u.status === '활성').length;
  const inactiveCount = users.filter((u) => u.status === '비활성').length;
  const supplierCount = users.filter((u) => u.role === '공급자').length;
  const ceoCount = users.filter((u) => u.role === '기업장').length;

  // ─── Tab 2: Filtered supplier orgs ──────────────────────────────────────
  const filteredOrgs = useMemo(() => {
    const q = orgSearch.toLowerCase();
    return supplierOrgs.filter((o) => !q || o.name.toLowerCase().includes(q) || o.admin.toLowerCase().includes(q));
  }, [orgSearch, supplierOrgs]);

  // ─── Tab 3: Filtered logs (supplier users only) ─────────────────────────
  const filteredLogs = useMemo(() => {
    return mockActivityLogs.filter((log) => {
      const isSupplierUser = supplierUserIds.includes(log.userId);
      if (!isSupplierUser) return false;
      const matchAction = logActionFilter === '전체' || log.action === logActionFilter;
      const q = logSearch.toLowerCase();
      const matchSearch = !q || log.userName.toLowerCase().includes(q) || log.details.toLowerCase().includes(q);
      const matchDateFrom = !logDateFrom || log.timestamp >= logDateFrom;
      const matchDateTo = !logDateTo || log.timestamp <= logDateTo + ' 23:59:59';
      return matchAction && matchSearch && matchDateFrom && matchDateTo;
    });
  }, [logActionFilter, logSearch, logDateFrom, logDateTo, supplierUserIds]);

  const visibleLogs = filteredLogs.slice(0, logVisibleCount);

  // ─── Settlement tab: Filtered settlements ─────────────────────────────
  const filteredSettlements = useMemo(() => {
    return mockSupplierSettlements.filter((s) => s.period === settlementPeriod);
  }, [settlementPeriod]);

  const settlementTotals = useMemo(() => {
    const totalProducts = filteredSettlements.reduce((a, s) => a + s.productCount, 0);
    const totalOrders = filteredSettlements.reduce((a, s) => a + s.orderCount, 0);
    const totalSales = filteredSettlements.reduce((a, s) => a + s.totalSales, 0);
    const totalCommission = filteredSettlements.reduce((a, s) => a + s.commission, 0);
    const totalNetPayment = filteredSettlements.reduce((a, s) => a + s.netPayment, 0);
    const completedCount = filteredSettlements.filter((s) => s.status === '정산완료').length;
    const pendingCount = filteredSettlements.length - completedCount;
    return { totalProducts, totalOrders, totalSales, totalCommission, totalNetPayment, completedCount, pendingCount };
  }, [filteredSettlements]);

  // ─── Modal helpers ─────────────────────────────────────────────────────

  function handleViewUser(user: User) {
    openModal('userDetail', user);
  }

  function handleEditUser(user: User) {
    setEditForm({ ...user });
    openModal('userEdit', user);
  }

  function handleViewOrg(org: Organization) {
    openModal('orgDetail', org);
  }

  function handleAddOrg() {
    setOrgForm({ type: '기업', status: '활성' });
    openModal('orgAdd', null);
  }

  function handleEditOrg(org: Organization) {
    setOrgForm({ ...org });
    openModal('orgEdit', org);
  }

  // ─── CRUD Actions ─────────────────────────────────────────────────────

  function handleSaveUser() {
    if (!editForm.id) return;
    setUsers((prev) => prev.map((u) => u.id === editForm.id ? { ...u, ...editForm } as User : u));
    showToast(`${editForm.name} 정보가 저장되었습니다.`);
    closeModal();
  }

  function handleToggleUserStatus(user: User) {
    const newStatus = user.status === '활성' ? '비활성' : '활성';
    setUsers((prev) => prev.map((u) => u.id === user.id ? { ...u, status: newStatus } : u));
    showToast(`${user.name}을(를) ${newStatus} 상태로 변경했습니다.`);
    closeModal();
  }

  function handleDeleteUser(userId: string) {
    const user = users.find((u) => u.id === userId);
    setUsers((prev) => prev.filter((u) => u.id !== userId));
    showToast(`${user?.name || '사용자'}가 삭제되었습니다.`);
    setOpenDropdownId(null);
  }

  function handleRemoveFromOrg(user: User, orgId: string) {
    setUsers((prev) => prev.map((u) => {
      if (u.id !== user.id) return u;
      const newOrgIds = (u.orgIds ?? [u.orgId]).filter((oid) => oid !== orgId);
      if (newOrgIds.length === 0) return { ...u, orgIds: newOrgIds, orgId: '', org: '미소속' };
      const primaryOrg = organizations.find((o) => o.id === newOrgIds[0]);
      return { ...u, orgIds: newOrgIds, orgId: newOrgIds[0], org: primaryOrg?.name || u.org };
    }));
    showToast(`${user.name}을(를) 기관에서 제거했습니다.`);
    closeModal();
  }

  function handleSaveOrg() {
    if (activeModal === 'orgAdd') {
      const newOrg: Organization = {
        id: `ORG-${String(organizations.length + 1).padStart(3, '0')}`,
        name: orgForm.name || '새 공급사',
        type: '기업',
        memberCount: 0,
        admin: orgForm.admin || '-',
        budget: orgForm.budget || 0,
        usedBudget: 0,
        status: '활성',
        zipCode: orgForm.zipCode || '',
        address: orgForm.address || '',
        contact: orgForm.contact || '',
        createdAt: new Date().toISOString().split('T')[0],
        businessLicense: { fileName: null, uploadedAt: null, verified: false },
        bankAccount: { fileName: null, uploadedAt: null, verified: false },
      };
      setOrganizations((prev) => [...prev, newOrg]);
      showToast(`${newOrg.name}이(가) 추가되었습니다.`);
    } else if (orgForm.id) {
      setOrganizations((prev) => prev.map((o) => o.id === orgForm.id ? { ...o, ...orgForm } as Organization : o));
      showToast(`${orgForm.name} 정보가 저장되었습니다.`);
    }
    closeModal();
  }

  function handleAddUserToOrg(orgId: string) {
    const org = organizations.find((o) => o.id === orgId);
    setAddUserForm({ role: '공급자', status: '활성', orgId, orgIds: [orgId], org: org?.name || '' });
    closeModal();
    openModal('addUserToOrg', org);
  }

  function handleSaveNewUser() {
    const allUsers = [...mockUsers, ...users];
    const maxId = allUsers.reduce((max, u) => {
      const num = parseInt(u.id.replace('USR-', ''), 10);
      return num > max ? num : max;
    }, 0);
    const newUser: User = {
      id: `USR-${String(maxId + 1).padStart(3, '0')}`,
      name: addUserForm.name || '',
      email: addUserForm.email || '',
      org: addUserForm.org || '',
      orgId: addUserForm.orgId || '',
      orgIds: addUserForm.orgIds || [],
      role: (addUserForm.role as User['role']) || '공급자',
      status: (addUserForm.status as User['status']) || '활성',
      lastLogin: '-',
      loginCount: 0,
      department: addUserForm.department || '',
      phone: addUserForm.phone || '',
      createdAt: new Date().toISOString().split('T')[0],
    };
    if (!newUser.name || !newUser.email) {
      showToast('이름과 이메일은 필수입니다.');
      return;
    }
    setUsers((prev) => [...prev, newUser]);
    showToast(`${newUser.name}이(가) ${newUser.org}에 추가되었습니다.`);
    closeModal();
  }

  // ─── Helper: get supplier mapping for an org ────────────────────────────
  function getSupplierMapping(orgName: string): SupplierMapping | undefined {
    return mockSupplierMappings.find((s) => orgName.toLowerCase().includes(s.name.toLowerCase()) || s.name.toLowerCase().includes(orgName.toLowerCase().replace(/\(주\)/g, '').trim()));
  }

  // ─── Render ────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text)]">공급자 관리</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">공급사 및 공급자를 관리합니다</p>
        </div>
      </div>

      {/* Tabs */}
      <AdminTabs tabs={tabs} activeTab={suppliersTab} onTabChange={(t) => { setSuppliersTab(t); clearUserSelection(); }} />

      {/* ═══════════════════════════════════════════════════════════════════════
          Tab 1: 공급자 목록
          ═══════════════════════════════════════════════════════════════════ */}
      {suppliersTab === '공급자 목록' && (
        <div className="space-y-5">
          {/* Stats */}
          <div className="grid grid-cols-4 gap-4">
            <StatCard icon={<Users size={20} />} label="전체 공급자" value={String(users.length)} change="+3" up />
            <StatCard icon={<UserCheck size={20} />} label="활성" value={String(activeCount)} change="+2" up />
            <StatCard icon={<UserX size={20} />} label="비활성" value={String(inactiveCount)} change="0" up={false} />
            <StatCard icon={<Building size={20} />} label="공급사 수" value={String(supplierOrgs.length)} change="+1" up />
          </div>

          {/* Filter bar */}
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-4">
            <div className="flex items-center gap-3 flex-wrap">
              {/* Search */}
              <div className="relative flex-1 min-w-[240px]">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                  placeholder="이름, 이메일, 소속 검색..."
                  className="w-full h-[var(--btn-height)] pl-9 pr-4 text-sm bg-[var(--bg)] border border-[var(--border)] rounded-lg text-[var(--text)] placeholder:text-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              {/* Role pills */}
              <div className="flex items-center gap-1">
                <Filter size={16} className="text-[var(--text-secondary)] mr-1" />
                {supplierRoles.map((role) => (
                  <button
                    key={role}
                    onClick={() => { setSelectedRole(role); setCurrentPage(1); }}
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

              {/* Status dropdown */}
              <select
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value as '전체' | '활성' | '비활성'); setCurrentPage(1); }}
                className="h-[var(--btn-height)] px-3 text-sm bg-[var(--bg)] border border-[var(--border)] rounded-lg text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="전체">상태: 전체</option>
                <option value="활성">활성</option>
                <option value="비활성">비활성</option>
              </select>
            </div>
          </div>

          {/* Bulk action bar */}
          {selectedUserIds.length > 0 && (
            <div className="bg-orange-50 border border-orange-200 rounded-xl px-5 py-3 flex items-center gap-3">
              <span className="text-sm font-medium text-orange-800">{selectedUserIds.length}명 선택됨</span>
              <div className="flex-1" />
              <button className="h-[var(--btn-height)] px-4 text-sm font-medium bg-white border border-orange-300 text-orange-700 rounded-lg hover:bg-orange-100 transition-colors">
                역할 변경
              </button>
              <button className="h-[var(--btn-height)] px-4 text-sm font-medium bg-white border border-orange-300 text-orange-700 rounded-lg hover:bg-orange-100 transition-colors">
                상태 변경
              </button>
              <button className="h-[var(--btn-height)] px-4 text-sm font-medium bg-white border border-orange-300 text-orange-700 rounded-lg hover:bg-orange-100 transition-colors flex items-center gap-1.5">
                <Download size={14} />
                CSV 내보내기
              </button>
            </div>
          )}

          {/* Table */}
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[var(--bg)] border-b border-[var(--border)]">
                    <th className="text-left px-5 py-3 w-10">
                      <input
                        type="checkbox"
                        checked={pagedUserIds.length > 0 && pagedUserIds.every((id) => selectedUserIds.includes(id))}
                        onChange={() => selectAllUsers(pagedUserIds)}
                        className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                      />
                    </th>
                    <th className="text-left px-5 py-3 font-semibold text-[var(--text-secondary)] text-xs uppercase tracking-wider">이름</th>
                    <th className="text-left px-5 py-3 font-semibold text-[var(--text-secondary)] text-xs uppercase tracking-wider">이메일</th>
                    <th className="text-left px-5 py-3 font-semibold text-[var(--text-secondary)] text-xs uppercase tracking-wider">소속 공급사</th>
                    <th className="text-left px-5 py-3 font-semibold text-[var(--text-secondary)] text-xs uppercase tracking-wider">역할</th>
                    <th className="text-left px-5 py-3 font-semibold text-[var(--text-secondary)] text-xs uppercase tracking-wider">상태</th>
                    <th className="text-left px-5 py-3 font-semibold text-[var(--text-secondary)] text-xs uppercase tracking-wider">마지막 접속</th>
                    <th className="text-center px-5 py-3 font-semibold text-[var(--text-secondary)] text-xs uppercase tracking-wider">접속수</th>
                    <th className="text-center px-5 py-3 font-semibold text-[var(--text-secondary)] text-xs uppercase tracking-wider">관리</th>
                  </tr>
                </thead>
                <tbody>
                  {pagedUsers.map((user) => (
                    <tr key={user.id} className="border-b border-[var(--border)] hover:bg-[var(--bg)] transition-colors">
                      <td className="px-5 py-3.5">
                        <input
                          type="checkbox"
                          checked={selectedUserIds.includes(user.id)}
                          onChange={() => toggleUserSelection(user.id)}
                          className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                        />
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-orange-100 text-orange-700 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                            {user.name.charAt(0)}
                          </div>
                          <button
                            onClick={() => handleViewUser(user)}
                            className="font-medium text-orange-600 hover:text-orange-700 hover:underline text-left"
                          >
                            {user.name}
                          </button>
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
                        <StatusBadge status={user.status} />
                      </td>
                      <td className="px-5 py-3.5 text-[var(--text-secondary)] whitespace-nowrap">{user.lastLogin}</td>
                      <td className="px-5 py-3.5 text-center text-[var(--text)]">{user.loginCount.toLocaleString()}</td>
                      <td className="px-5 py-3.5 text-center">
                        <div className="relative inline-block">
                          <button
                            onClick={() => setOpenDropdownId(openDropdownId === user.id ? null : user.id)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg text-[var(--text-secondary)] hover:bg-gray-100 transition-colors"
                          >
                            <MoreHorizontal size={16} />
                          </button>
                          {openDropdownId === user.id && (
                            <div className="absolute right-0 top-full mt-1 w-32 bg-[var(--bg-card)] border border-[var(--border)] rounded-lg shadow-lg z-20 py-1">
                              <button
                                onClick={() => { handleViewUser(user); setOpenDropdownId(null); }}
                                className="w-full px-3 py-2 text-left text-sm text-[var(--text)] hover:bg-[var(--bg)] flex items-center gap-2"
                              >
                                <Eye size={14} /> 상세보기
                              </button>
                              <button
                                onClick={() => { handleEditUser(user); setOpenDropdownId(null); }}
                                className="w-full px-3 py-2 text-left text-sm text-[var(--text)] hover:bg-[var(--bg)] flex items-center gap-2"
                              >
                                <Edit size={14} /> 수정
                              </button>
                              <button
                                onClick={() => handleDeleteUser(user.id)}
                                className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                              >
                                <Trash2 size={14} /> 삭제
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {pagedUsers.length === 0 && (
                    <tr>
                      <td colSpan={9} className="px-5 py-12 text-center text-[var(--text-secondary)]">
                        검색 결과가 없습니다.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-5 py-4 border-t border-[var(--border)]">
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
              </div>
            )}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════
          Tab 2: 공급사 관리
          ═══════════════════════════════════════════════════════════════════ */}
      {suppliersTab === '공급사 관리' && (
        <div className="space-y-5">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <StatCard icon={<Building2 size={20} />} label="전체 공급사" value={String(supplierOrgs.length)} change="+1" up />
            <StatCard icon={<Package size={20} />} label="총 등록 제품" value={mockSupplierMappings.reduce((s, m) => s + m.productCount, 0).toLocaleString()} change="+150" up />
            <StatCard icon={<RefreshCw size={20} />} label="동기화 성공률" value={`${Math.round((mockSupplierMappings.filter((m) => m.syncStatus === '성공').length / mockSupplierMappings.length) * 100)}%`} change="+2%" up />
          </div>

          {/* Filter + Add */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
              <input
                type="text"
                value={orgSearch}
                onChange={(e) => setOrgSearch(e.target.value)}
                placeholder="공급사명, 관리자 검색..."
                className="w-full h-[var(--btn-height)] pl-9 pr-4 text-sm bg-[var(--bg)] border border-[var(--border)] rounded-lg text-[var(--text)] placeholder:text-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={handleAddOrg}
              className="h-[var(--btn-height)] px-4 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors flex items-center gap-2"
            >
              <Plus size={16} />
              공급사 추가
            </button>
          </div>

          {/* Org Table */}
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[var(--bg)] border-b border-[var(--border)]">
                    <th className="text-left px-5 py-3 font-semibold text-[var(--text-secondary)] text-xs uppercase tracking-wider">공급사명</th>
                    <th className="text-left px-5 py-3 font-semibold text-[var(--text-secondary)] text-xs uppercase tracking-wider">유형</th>
                    <th className="text-center px-5 py-3 font-semibold text-[var(--text-secondary)] text-xs uppercase tracking-wider">회원수</th>
                    <th className="text-left px-5 py-3 font-semibold text-[var(--text-secondary)] text-xs uppercase tracking-wider">관리자</th>
                    <th className="text-center px-5 py-3 font-semibold text-[var(--text-secondary)] text-xs uppercase tracking-wider">등록 제품수</th>
                    <th className="text-left px-5 py-3 font-semibold text-[var(--text-secondary)] text-xs uppercase tracking-wider">동기화 상태</th>
                    <th className="text-left px-5 py-3 font-semibold text-[var(--text-secondary)] text-xs uppercase tracking-wider">API URL</th>
                    <th className="text-left px-5 py-3 font-semibold text-[var(--text-secondary)] text-xs uppercase tracking-wider">상태</th>
                    <th className="text-center px-5 py-3 font-semibold text-[var(--text-secondary)] text-xs uppercase tracking-wider">관리</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrgs.map((org) => {
                    const mapping = getSupplierMapping(org.name);
                    return (
                      <tr
                        key={org.id}
                        className="border-b border-[var(--border)] hover:bg-[var(--bg)] transition-colors cursor-pointer"
                        onClick={() => handleViewOrg(org)}
                      >
                        <td className="px-5 py-3.5">
                          <span className="font-medium text-orange-600 hover:text-orange-700 hover:underline cursor-pointer">
                            {org.name}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${orgTypeColors[org.type] || ''}`}>
                            {org.type}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-center text-[var(--text)]">{org.memberCount}명</td>
                        <td className="px-5 py-3.5 text-[var(--text)]">{org.admin}</td>
                        <td className="px-5 py-3.5 text-center">
                          {mapping ? (
                            <span className="text-[var(--text)] font-medium">{mapping.productCount.toLocaleString()}</span>
                          ) : (
                            <span className="text-[var(--text-secondary)]">-</span>
                          )}
                        </td>
                        <td className="px-5 py-3.5">
                          {mapping ? (
                            <div className="flex items-center gap-2">
                              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${syncStatusColors[mapping.syncStatus] || ''}`}>
                                {mapping.syncStatus}
                              </span>
                              <span className="text-xs text-[var(--text-secondary)]">{mapping.lastSync}</span>
                            </div>
                          ) : (
                            <span className="text-xs text-[var(--text-secondary)]">미연동</span>
                          )}
                        </td>
                        <td className="px-5 py-3.5">
                          {mapping ? (
                            <span className="text-xs text-[var(--text-secondary)] font-mono">{mapping.apiUrl}</span>
                          ) : (
                            <span className="text-xs text-[var(--text-secondary)]">-</span>
                          )}
                        </td>
                        <td className="px-5 py-3.5"><StatusBadge status={org.status} /></td>
                        <td className="px-5 py-3.5 text-center" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => handleEditOrg(org)}
                            className="w-8 h-8 inline-flex items-center justify-center rounded-lg text-[var(--text-secondary)] hover:bg-gray-100 transition-colors"
                          >
                            <Edit size={15} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                  {filteredOrgs.length === 0 && (
                    <tr>
                      <td colSpan={9} className="px-5 py-12 text-center text-[var(--text-secondary)]">
                        검색 결과가 없습니다.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════
          Tab 3: 정산 관리
          ═══════════════════════════════════════════════════════════════════ */}
      {suppliersTab === '정산 관리' && (
        <div className="space-y-5">
          {/* Header with period selector and action buttons */}
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-4">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <label className="text-sm font-medium text-[var(--text)]">정산 기간</label>
                <select
                  value={settlementPeriod}
                  onChange={(e) => setSettlementPeriod(e.target.value)}
                  className="h-[var(--btn-height)] px-3 text-sm bg-[var(--bg)] border border-[var(--border)] rounded-lg text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="2026-03">2026-03</option>
                  <option value="2026-02">2026-02</option>
                  <option value="2026-01">2026-01</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const pending = filteredSettlements.filter((s) => s.status !== '정산완료').length;
                    showToast(`${pending}건의 정산이 확정되었습니다`);
                  }}
                  className="h-[var(--btn-height)] px-4 text-sm font-medium text-white bg-orange-600 rounded-lg hover:bg-orange-700 transition-colors flex items-center gap-1.5"
                >
                  <CheckCircle size={15} />
                  정산 확정
                </button>
                <button
                  onClick={() => showToast('정산서 PDF 생성 중...')}
                  className="h-[var(--btn-height)] px-4 text-sm font-medium text-[var(--text)] bg-[var(--bg)] border border-[var(--border)] rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-1.5"
                >
                  <Printer size={15} />
                  정산서 출력
                </button>
                <button
                  onClick={() => showToast('정산 데이터 Excel 다운로드 완료')}
                  className="h-[var(--btn-height)] px-4 text-sm font-medium text-[var(--text)] bg-[var(--bg)] border border-[var(--border)] rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-1.5"
                >
                  <FileSpreadsheet size={15} />
                  Excel 다운로드
                </button>
              </div>
            </div>
          </div>

          {/* Summary stat cards */}
          <div className="grid grid-cols-4 gap-4">
            <StatCard
              icon={<DollarSign size={20} />}
              label="총 매출"
              value={`₩${Math.round(settlementTotals.totalSales / 10000).toLocaleString('ko-KR')}만`}
              change="+12%"
              up
            />
            <StatCard
              icon={<Calculator size={20} />}
              label="총 수수료"
              value={`₩${Math.round(settlementTotals.totalCommission / 10000).toLocaleString('ko-KR')}만`}
              change="+10%"
              up
            />
            <StatCard
              icon={<TrendingUp size={20} />}
              label="총 지급액"
              value={`₩${Math.round(settlementTotals.totalNetPayment / 10000).toLocaleString('ko-KR')}만`}
              change="+12%"
              up
            />
            <StatCard
              icon={<Activity size={20} />}
              label="처리 상태"
              value={`${settlementTotals.completedCount}건 완료 / ${settlementTotals.pendingCount}건 대기`}
              change=""
              up={false}
            />
          </div>

          {/* Settlement table */}
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[var(--bg)] border-b border-[var(--border)]">
                    <th className="text-left px-5 py-3 font-semibold text-[var(--text-secondary)] text-xs uppercase tracking-wider">공급사</th>
                    <th className="text-right px-5 py-3 font-semibold text-[var(--text-secondary)] text-xs uppercase tracking-wider">제품 수</th>
                    <th className="text-right px-5 py-3 font-semibold text-[var(--text-secondary)] text-xs uppercase tracking-wider">주문 건수</th>
                    <th className="text-right px-5 py-3 font-semibold text-[var(--text-secondary)] text-xs uppercase tracking-wider whitespace-nowrap">총 매출 (₩)</th>
                    <th className="text-center px-5 py-3 font-semibold text-[var(--text-secondary)] text-xs uppercase tracking-wider">수수료율</th>
                    <th className="text-right px-5 py-3 font-semibold text-[var(--text-secondary)] text-xs uppercase tracking-wider whitespace-nowrap">수수료 (₩)</th>
                    <th className="text-right px-5 py-3 font-semibold text-[var(--text-secondary)] text-xs uppercase tracking-wider whitespace-nowrap">지급액 (₩)</th>
                    <th className="text-center px-5 py-3 font-semibold text-[var(--text-secondary)] text-xs uppercase tracking-wider">상태</th>
                    <th className="text-center px-5 py-3 font-semibold text-[var(--text-secondary)] text-xs uppercase tracking-wider">관리</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSettlements.map((s) => (
                    <tr key={s.supplierId} className="border-b border-[var(--border)] hover:bg-[var(--bg)] transition-colors">
                      <td className="px-5 py-3.5 font-semibold text-[var(--text)]">{s.supplierName}</td>
                      <td className="px-5 py-3.5 text-right text-[var(--text)]">{s.productCount.toLocaleString('ko-KR')}개</td>
                      <td className="px-5 py-3.5 text-right text-[var(--text)]">{s.orderCount.toLocaleString('ko-KR')}건</td>
                      <td className="px-5 py-3.5 text-right text-[var(--text)]">₩{s.totalSales.toLocaleString('ko-KR')}</td>
                      <td className="px-5 py-3.5 text-center text-[var(--text)]">{s.commissionRate}%</td>
                      <td className="px-5 py-3.5 text-right text-[var(--text)]">₩{s.commission.toLocaleString('ko-KR')}</td>
                      <td className="px-5 py-3.5 text-right font-semibold text-[var(--text)]">₩{s.netPayment.toLocaleString('ko-KR')}</td>
                      <td className="px-5 py-3.5 text-center"><StatusBadge status={s.status} /></td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => openModal('settlementDetail', s)}
                            className="w-7 h-7 inline-flex items-center justify-center rounded text-[var(--text-secondary)] hover:bg-gray-100 transition-colors"
                            title="상세"
                          >
                            <Eye size={14} />
                          </button>
                          {s.status !== '정산완료' && (
                            <button
                              onClick={() => showToast(`${s.supplierName} 정산이 확정되었습니다`)}
                              className="w-7 h-7 inline-flex items-center justify-center rounded text-orange-500 hover:bg-orange-50 hover:text-orange-700 transition-colors"
                              title="확정"
                            >
                              <CheckCircle size={14} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredSettlements.length === 0 && (
                    <tr>
                      <td colSpan={9} className="px-5 py-12 text-center text-[var(--text-secondary)]">
                        해당 기간의 정산 내역이 없습니다.
                      </td>
                    </tr>
                  )}
                  {/* Total row */}
                  {filteredSettlements.length > 0 && (
                    <tr className="bg-[var(--bg)] border-t-2 border-[var(--border)] font-bold">
                      <td className="px-5 py-3.5 text-[var(--text)]">합계</td>
                      <td className="px-5 py-3.5 text-right text-[var(--text)]">{settlementTotals.totalProducts.toLocaleString('ko-KR')}개</td>
                      <td className="px-5 py-3.5 text-right text-[var(--text)]">{settlementTotals.totalOrders.toLocaleString('ko-KR')}건</td>
                      <td className="px-5 py-3.5 text-right text-[var(--text)]">₩{settlementTotals.totalSales.toLocaleString('ko-KR')}</td>
                      <td className="px-5 py-3.5 text-center text-[var(--text-secondary)]">-</td>
                      <td className="px-5 py-3.5 text-right text-[var(--text)]">₩{settlementTotals.totalCommission.toLocaleString('ko-KR')}</td>
                      <td className="px-5 py-3.5 text-right text-[var(--text)]">₩{settlementTotals.totalNetPayment.toLocaleString('ko-KR')}</td>
                      <td className="px-5 py-3.5 text-center text-[var(--text-secondary)]">-</td>
                      <td className="px-5 py-3.5 text-center text-[var(--text-secondary)]">-</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════
          Tab 4: 활동 로그
          ═══════════════════════════════════════════════════════════════════ */}
      {suppliersTab === '활동 로그' && (
        <div className="space-y-5">
          {/* Filters */}
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-3 flex-wrap">
              {/* Date range */}
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-[var(--text-secondary)]" />
                <input
                  type="date"
                  value={logDateFrom}
                  onChange={(e) => setLogDateFrom(e.target.value)}
                  className="h-[var(--btn-height)] px-3 text-sm bg-[var(--bg)] border border-[var(--border)] rounded-lg text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <span className="text-[var(--text-secondary)] text-sm">~</span>
                <input
                  type="date"
                  value={logDateTo}
                  onChange={(e) => setLogDateTo(e.target.value)}
                  className="h-[var(--btn-height)] px-3 text-sm bg-[var(--bg)] border border-[var(--border)] rounded-lg text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              {/* User search */}
              <div className="relative flex-1 min-w-[200px]">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
                <input
                  type="text"
                  value={logSearch}
                  onChange={(e) => { setLogSearch(e.target.value); setLogVisibleCount(10); }}
                  placeholder="공급자 검색..."
                  className="w-full h-[var(--btn-height)] pl-9 pr-4 text-sm bg-[var(--bg)] border border-[var(--border)] rounded-lg text-[var(--text)] placeholder:text-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Action type pills */}
            <div className="flex items-center gap-1 flex-wrap">
              <Filter size={16} className="text-[var(--text-secondary)] mr-1" />
              {actionTypes.map((at) => (
                <button
                  key={at}
                  onClick={() => { setLogActionFilter(at); setLogVisibleCount(10); }}
                  className={`px-3 h-[var(--btn-height)] text-sm rounded-lg transition-colors ${
                    logActionFilter === at
                      ? 'bg-orange-600 text-white font-medium'
                      : 'bg-[var(--bg)] text-[var(--text-secondary)] hover:bg-gray-100 border border-[var(--border)]'
                  }`}
                >
                  {at}
                </button>
              ))}
            </div>
          </div>

          {/* Log Table */}
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[var(--bg)] border-b border-[var(--border)]">
                    <th className="text-left px-5 py-3 font-semibold text-[var(--text-secondary)] text-xs uppercase tracking-wider whitespace-nowrap">시간</th>
                    <th className="text-left px-5 py-3 font-semibold text-[var(--text-secondary)] text-xs uppercase tracking-wider">사용자</th>
                    <th className="text-left px-5 py-3 font-semibold text-[var(--text-secondary)] text-xs uppercase tracking-wider">액션</th>
                    <th className="text-left px-5 py-3 font-semibold text-[var(--text-secondary)] text-xs uppercase tracking-wider">상세</th>
                    <th className="text-left px-5 py-3 font-semibold text-[var(--text-secondary)] text-xs uppercase tracking-wider whitespace-nowrap">IP 주소</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleLogs.map((log) => (
                    <tr key={log.id} className="border-b border-[var(--border)] hover:bg-[var(--bg)] transition-colors">
                      <td className="px-5 py-3.5 text-[var(--text-secondary)] whitespace-nowrap text-xs">{log.timestamp}</td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 bg-orange-100 text-orange-700 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                            {log.userName.charAt(0)}
                          </div>
                          <span className="font-medium text-[var(--text)] whitespace-nowrap">{log.userName}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${actionColors[log.action] || 'bg-gray-100 text-gray-700'}`}>
                          {log.action}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-[var(--text)] max-w-md">
                        <span className="line-clamp-2">{log.details}</span>
                      </td>
                      <td className="px-5 py-3.5 text-[var(--text-secondary)] text-xs font-mono whitespace-nowrap">{log.ipAddress}</td>
                    </tr>
                  ))}
                  {visibleLogs.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-5 py-12 text-center text-[var(--text-secondary)]">
                        공급자 활동 로그가 없습니다.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Load more */}
            {logVisibleCount < filteredLogs.length && (
              <div className="px-5 py-4 border-t border-[var(--border)] flex justify-center">
                <button
                  onClick={() => setLogVisibleCount((prev) => prev + 10)}
                  className="h-[var(--btn-height)] px-6 text-sm font-medium text-orange-600 bg-orange-50 border border-orange-200 rounded-lg hover:bg-orange-100 transition-colors flex items-center gap-1.5"
                >
                  <ChevronDown size={16} />
                  더보기 ({filteredLogs.length - logVisibleCount}건 남음)
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════
          Modals
          ═══════════════════════════════════════════════════════════════════ */}

      {/* User Detail Modal */}
      <Modal isOpen={activeModal === 'userDetail'} onClose={closeModal} title="공급자 상세" size="lg">
        {activeModal === 'userDetail' && modalData && (() => {
          const user = modalData as User;
          const userLogs = mockActivityLogs.filter((l) => l.userId === user.id).slice(0, 5);
          return (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-orange-100 text-orange-700 rounded-full flex items-center justify-center text-xl font-bold">
                  {user.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold text-[var(--text)]">{user.name}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${roleColors[user.role] || ''}`}>{user.role}</span>
                  </div>
                  <p className="text-sm text-[var(--text-secondary)]">{user.id}</p>
                </div>
              </div>

              {/* Info grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <Mail size={15} className="text-[var(--text-secondary)]" />
                  <span className="text-[var(--text-secondary)]">이메일</span>
                  <span className="ml-auto text-[var(--text)]">{user.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone size={15} className="text-[var(--text-secondary)]" />
                  <span className="text-[var(--text-secondary)]">전화번호</span>
                  <span className="ml-auto text-[var(--text)]">{user.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Building2 size={15} className="text-[var(--text-secondary)]" />
                  <span className="text-[var(--text-secondary)]">소속 공급사</span>
                  <span className="ml-auto text-[var(--text)]">{user.org}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Users size={15} className="text-[var(--text-secondary)]" />
                  <span className="text-[var(--text-secondary)]">부서</span>
                  <span className="ml-auto text-[var(--text)]">{user.department}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar size={15} className="text-[var(--text-secondary)]" />
                  <span className="text-[var(--text-secondary)]">가입일</span>
                  <span className="ml-auto text-[var(--text)]">{user.createdAt}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Activity size={15} className="text-[var(--text-secondary)]" />
                  <span className="text-[var(--text-secondary)]">마지막 접속</span>
                  <span className="ml-auto text-[var(--text)]">{user.lastLogin}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Shield size={15} className="text-[var(--text-secondary)]" />
                  <span className="text-[var(--text-secondary)]">접속 횟수</span>
                  <span className="ml-auto text-[var(--text)]">{user.loginCount.toLocaleString()}회</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Eye size={15} className="text-[var(--text-secondary)]" />
                  <span className="text-[var(--text-secondary)]">상태</span>
                  <span className="ml-auto"><StatusBadge status={user.status} /></span>
                </div>
              </div>

              {/* Activity */}
              {userLogs.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-[var(--text)] mb-3">최근 활동</h4>
                  <div className="space-y-2">
                    {userLogs.map((log) => (
                      <div key={log.id} className="flex items-start gap-3 text-xs p-2.5 bg-[var(--bg)] rounded-lg">
                        <span className={`px-1.5 py-0.5 rounded font-medium flex-shrink-0 ${actionColors[log.action] || ''}`}>{log.action}</span>
                        <span className="text-[var(--text)] flex-1">{log.details}</span>
                        <span className="text-[var(--text-secondary)] whitespace-nowrap">{log.timestamp.split(' ')[1]}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 pt-2 border-t border-[var(--border)]">
                <button
                  onClick={() => handleToggleUserStatus(user)}
                  className={`h-[var(--btn-height)] px-4 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                    user.status === '활성'
                      ? 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100'
                      : 'bg-emerald-50 text-emerald-600 border border-emerald-200 hover:bg-emerald-100'
                  }`}
                >
                  {user.status === '활성' ? '비활성화' : '활성화'}
                </button>
                <button
                  onClick={() => { closeModal(); handleEditUser(user); }}
                  className="h-[var(--btn-height)] px-4 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors flex items-center gap-1.5"
                >
                  <Edit size={14} /> 수정
                </button>
              </div>
            </div>
          );
        })()}
      </Modal>

      {/* User Edit Modal */}
      <Modal isOpen={activeModal === 'userEdit'} onClose={closeModal} title="공급자 수정" size="lg">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">이름</label>
              <input
                type="text"
                value={editForm.name || ''}
                onChange={(e) => setEditForm((prev) => ({ ...prev, name: e.target.value }))}
                className="w-full h-[var(--btn-height)] px-3 text-sm bg-[var(--bg)] border border-[var(--border)] rounded-lg text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">이메일</label>
              <input
                type="email"
                value={editForm.email || ''}
                onChange={(e) => setEditForm((prev) => ({ ...prev, email: e.target.value }))}
                className="w-full h-[var(--btn-height)] px-3 text-sm bg-[var(--bg)] border border-[var(--border)] rounded-lg text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">전화번호</label>
              <input
                type="tel"
                value={editForm.phone || ''}
                onChange={(e) => setEditForm((prev) => ({ ...prev, phone: e.target.value }))}
                className="w-full h-[var(--btn-height)] px-3 text-sm bg-[var(--bg)] border border-[var(--border)] rounded-lg text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">소속 공급사</label>
              <select
                value={editForm.orgId || ''}
                onChange={(e) => {
                  const org = organizations.find((o) => o.id === e.target.value);
                  setEditForm((prev) => ({ ...prev, orgId: e.target.value, org: org?.name || '' }));
                }}
                className="w-full h-[var(--btn-height)] px-3 text-sm bg-[var(--bg)] border border-[var(--border)] rounded-lg text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                {supplierOrgs.map((o) => (
                  <option key={o.id} value={o.id}>{o.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">부서</label>
              <input
                type="text"
                value={editForm.department || ''}
                onChange={(e) => setEditForm((prev) => ({ ...prev, department: e.target.value }))}
                className="w-full h-[var(--btn-height)] px-3 text-sm bg-[var(--bg)] border border-[var(--border)] rounded-lg text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">역할</label>
              <select
                value={editForm.role || '공급자'}
                onChange={(e) => setEditForm((prev) => ({ ...prev, role: e.target.value as User['role'] }))}
                className="w-full h-[var(--btn-height)] px-3 text-sm bg-[var(--bg)] border border-[var(--border)] rounded-lg text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                {getRolesForSupplierOrg().map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Status toggle */}
          <div className="flex items-center gap-3">
            <label className="text-xs font-medium text-[var(--text-secondary)]">상태</label>
            <button
              onClick={() => setEditForm((prev) => ({ ...prev, status: prev.status === '활성' ? '비활성' : '활성' }))}
              className={`relative w-11 h-6 rounded-full transition-colors ${editForm.status === '활성' ? 'bg-emerald-500' : 'bg-gray-300'}`}
            >
              <span
                className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${editForm.status === '활성' ? 'left-[22px]' : 'left-0.5'}`}
              />
            </button>
            <span className="text-sm text-[var(--text)]">{editForm.status}</span>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--border)]">
            <button onClick={closeModal} className="h-[var(--btn-height)] px-4 text-sm font-medium text-[var(--text-secondary)] bg-[var(--bg)] border border-[var(--border)] rounded-lg hover:bg-gray-100 transition-colors">
              취소
            </button>
            <button onClick={handleSaveUser} className="h-[var(--btn-height)] px-4 text-sm font-medium text-white bg-orange-600 rounded-lg hover:bg-orange-700 transition-colors">
              저장
            </button>
          </div>
        </div>
      </Modal>

      {/* Org Detail Modal */}
      <Modal isOpen={activeModal === 'orgDetail'} onClose={closeModal} title="공급사 상세" size="xl">
        {activeModal === 'orgDetail' && modalData && (() => {
          const org = modalData as Organization;
          const orgMembers = users.filter((u) => (u.orgIds ?? [u.orgId]).includes(org.id));
          const mapping = getSupplierMapping(org.name);

          return (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 text-purple-700 rounded-lg flex items-center justify-center text-sm font-bold">
                    {org.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold text-[var(--text)]">{org.name}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${orgTypeColors[org.type] || ''}`}>{org.type}</span>
                      <StatusBadge status={org.status} />
                    </div>
                    <p className="text-xs text-[var(--text-secondary)] mt-0.5">{org.id} | ({org.zipCode}) {org.address}</p>
                  </div>
                </div>
                <button
                  onClick={() => { closeModal(); handleEditOrg(org); }}
                  className="h-[var(--btn-height)] px-4 bg-[var(--bg)] border border-[var(--border)] text-[var(--text)] rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors flex items-center gap-1.5"
                >
                  <Edit size={14} /> 공급사 정보 수정
                </button>
              </div>

              {/* Info grid */}
              <div className="grid grid-cols-3 gap-4">
                <div className="p-3 bg-[var(--bg)] rounded-lg">
                  <span className="text-xs text-[var(--text-secondary)]">관리자</span>
                  <p className="text-sm font-medium text-[var(--text)] mt-0.5">{org.admin}</p>
                </div>
                <div className="p-3 bg-[var(--bg)] rounded-lg">
                  <span className="text-xs text-[var(--text-secondary)]">연락처</span>
                  <p className="text-sm font-medium text-[var(--text)] mt-0.5">{org.contact}</p>
                </div>
                <div className="p-3 bg-[var(--bg)] rounded-lg">
                  <span className="text-xs text-[var(--text-secondary)]">생성일</span>
                  <p className="text-sm font-medium text-[var(--text)] mt-0.5">{org.createdAt}</p>
                </div>
              </div>

              {/* Supplier Mapping Info */}
              {mapping && (
                <div className="p-4 bg-[var(--bg)] rounded-lg space-y-3">
                  <h4 className="text-sm font-semibold text-[var(--text)] flex items-center gap-2">
                    <Link2 size={15} className="text-[var(--text-secondary)]" />
                    API 연동 정보
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Package size={14} className="text-[var(--text-secondary)]" />
                      <span className="text-[var(--text-secondary)]">등록 제품수</span>
                      <span className="ml-auto font-medium text-[var(--text)]">{mapping.productCount.toLocaleString()}개</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <RefreshCw size={14} className="text-[var(--text-secondary)]" />
                      <span className="text-[var(--text-secondary)]">동기화 상태</span>
                      <span className={`ml-auto text-xs px-2 py-0.5 rounded-full font-medium ${syncStatusColors[mapping.syncStatus] || ''}`}>
                        {mapping.syncStatus}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Globe size={14} className="text-[var(--text-secondary)]" />
                      <span className="text-[var(--text-secondary)]">API URL</span>
                      <span className="ml-auto text-xs font-mono text-[var(--text)]">{mapping.apiUrl}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar size={14} className="text-[var(--text-secondary)]" />
                      <span className="text-[var(--text-secondary)]">마지막 동기화</span>
                      <span className="ml-auto text-[var(--text)]">{mapping.lastSync}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Mail size={14} className="text-[var(--text-secondary)]" />
                      <span className="text-[var(--text-secondary)]">API 담당자</span>
                      <span className="ml-auto text-[var(--text)]">{mapping.contact}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Activity size={14} className="text-[var(--text-secondary)]" />
                      <span className="text-[var(--text-secondary)]">평균 제품 가격</span>
                      <span className="ml-auto text-[var(--text)]">{mapping.avgPrice.toLocaleString()}원</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Members Table */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-semibold text-[var(--text)]">소속 공급자 ({orgMembers.length}명)</h4>
                </div>
                {orgMembers.length > 0 ? (
                  <div className="border border-[var(--border)] rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-[var(--bg)]">
                          <th className="text-left px-4 py-2.5 text-xs font-semibold text-[var(--text-secondary)]">이름</th>
                          <th className="text-left px-4 py-2.5 text-xs font-semibold text-[var(--text-secondary)]">이메일</th>
                          <th className="text-left px-4 py-2.5 text-xs font-semibold text-[var(--text-secondary)]">부서</th>
                          <th className="text-left px-4 py-2.5 text-xs font-semibold text-[var(--text-secondary)]">역할</th>
                          <th className="text-left px-4 py-2.5 text-xs font-semibold text-[var(--text-secondary)]">상태</th>
                          <th className="text-left px-4 py-2.5 text-xs font-semibold text-[var(--text-secondary)]">마지막 접속</th>
                          <th className="text-center px-4 py-2.5 text-xs font-semibold text-[var(--text-secondary)]">관리</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orgMembers.map((m) => (
                          <tr key={m.id} className="border-t border-[var(--border)] hover:bg-[var(--bg)] transition-colors">
                            <td className="px-4 py-2.5">
                              <div className="flex items-center gap-2">
                                <div className="w-7 h-7 bg-orange-100 text-orange-700 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                                  {m.name.charAt(0)}
                                </div>
                                <span className="font-medium text-[var(--text)]">{m.name}</span>
                              </div>
                            </td>
                            <td className="px-4 py-2.5 text-[var(--text-secondary)] text-xs">{m.email}</td>
                            <td className="px-4 py-2.5 text-[var(--text)] text-xs">{m.department}</td>
                            <td className="px-4 py-2.5">
                              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${roleColors[m.role] || ''}`}>{m.role}</span>
                            </td>
                            <td className="px-4 py-2.5"><StatusBadge status={m.status} /></td>
                            <td className="px-4 py-2.5 text-[var(--text-secondary)] text-xs whitespace-nowrap">{m.lastLogin}</td>
                            <td className="px-4 py-2.5">
                              <div className="flex items-center justify-center gap-1">
                                <button
                                  onClick={(e) => { e.stopPropagation(); closeModal(); handleViewUser(m); }}
                                  className="w-7 h-7 inline-flex items-center justify-center rounded text-[var(--text-secondary)] hover:bg-gray-100 transition-colors"
                                  title="상세보기"
                                >
                                  <Eye size={14} />
                                </button>
                                <button
                                  onClick={(e) => { e.stopPropagation(); closeModal(); handleEditUser(m); }}
                                  className="w-7 h-7 inline-flex items-center justify-center rounded text-[var(--text-secondary)] hover:bg-gray-100 transition-colors"
                                  title="수정"
                                >
                                  <Edit size={14} />
                                </button>
                                <button
                                  onClick={(e) => { e.stopPropagation(); openModal('confirmRemoveFromOrg', m); }}
                                  className="w-7 h-7 inline-flex items-center justify-center rounded text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                                  title="공급사에서 제거"
                                >
                                  <UserMinus size={14} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-[var(--text-secondary)] bg-[var(--bg)] rounded-lg">
                    <Users size={32} className="mx-auto mb-2 opacity-30" />
                    <p className="text-sm">소속 공급자가 없습니다.</p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 pt-2 border-t border-[var(--border)]">
                <button
                  onClick={() => handleAddUserToOrg(org.id)}
                  className="h-[var(--btn-height)] px-4 bg-[var(--bg)] border border-[var(--border)] text-[var(--text)] rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors flex items-center gap-1.5"
                >
                  <Plus size={14} /> 이 공급사에 사용자 추가
                </button>
                <button
                  onClick={() => { closeModal(); handleEditOrg(org); }}
                  className="h-[var(--btn-height)] px-4 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors flex items-center gap-1.5"
                >
                  <Edit size={14} /> 공급사 수정
                </button>
              </div>
            </div>
          );
        })()}
      </Modal>

      {/* 공급사에서 사용자 제거 확인 모달 */}
      <Modal isOpen={activeModal === 'confirmRemoveFromOrg'} onClose={closeModal} title="사용자 제거 확인" size="sm">
        {activeModal === 'confirmRemoveFromOrg' && modalData && (() => {
          const user = modalData as User;
          return (
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertTriangle size={20} className="text-red-500 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="font-medium text-red-800">정말 이 사용자를 공급사에서 제거하시겠습니까?</p>
                  <p className="text-red-700 mt-1">
                    <strong>{user.name}</strong> ({user.email})이(가) 소속 공급사에서 제거됩니다.
                    계정 자체는 삭제되지 않으며, 공급사 미소속 상태로 변경됩니다.
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 pt-2 border-t border-[var(--border)]">
                <button onClick={closeModal} className="h-[var(--btn-height)] px-4 text-sm font-medium text-[var(--text-secondary)] bg-[var(--bg)] border border-[var(--border)] rounded-lg hover:bg-gray-100 transition-colors">
                  취소
                </button>
                <button onClick={() => handleRemoveFromOrg(user, user.orgId)} className="h-[var(--btn-height)] px-4 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-1.5">
                  <UserMinus size={14} /> 제거
                </button>
              </div>
            </div>
          );
        })()}
      </Modal>

      {/* Org Add / Edit Modal */}
      <Modal isOpen={activeModal === 'orgAdd' || activeModal === 'orgEdit'} onClose={closeModal} title={activeModal === 'orgAdd' ? '공급사 추가' : '공급사 수정'} size="lg">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">공급사명</label>
              <input
                type="text"
                value={orgForm.name || ''}
                onChange={(e) => setOrgForm((prev) => ({ ...prev, name: e.target.value }))}
                className="w-full h-[var(--btn-height)] px-3 text-sm bg-[var(--bg)] border border-[var(--border)] rounded-lg text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">유형</label>
              <select
                value={orgForm.type || '기업'}
                onChange={(e) => setOrgForm((prev) => ({ ...prev, type: e.target.value as Organization['type'] }))}
                className="w-full h-[var(--btn-height)] px-3 text-sm bg-[var(--bg)] border border-[var(--border)] rounded-lg text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="기업">기업</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">우편번호</label>
              <input
                type="text"
                value={orgForm.zipCode || ''}
                onChange={(e) => setOrgForm((prev) => ({ ...prev, zipCode: e.target.value }))}
                placeholder="00000"
                maxLength={5}
                className="w-full h-[var(--btn-height)] px-3 text-sm bg-[var(--bg)] border border-[var(--border)] rounded-lg text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">주소</label>
              <input
                type="text"
                value={orgForm.address || ''}
                onChange={(e) => setOrgForm((prev) => ({ ...prev, address: e.target.value }))}
                className="w-full h-[var(--btn-height)] px-3 text-sm bg-[var(--bg)] border border-[var(--border)] rounded-lg text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">연락처</label>
              <input
                type="text"
                value={orgForm.contact || ''}
                onChange={(e) => setOrgForm((prev) => ({ ...prev, contact: e.target.value }))}
                placeholder="02-000-0000"
                className="w-full h-[var(--btn-height)] px-3 text-sm bg-[var(--bg)] border border-[var(--border)] rounded-lg text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">관리자</label>
              <select
                value={orgForm.admin || ''}
                onChange={(e) => setOrgForm((prev) => ({ ...prev, admin: e.target.value }))}
                className="w-full h-[var(--btn-height)] px-3 text-sm bg-[var(--bg)] border border-[var(--border)] rounded-lg text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="">관리자 선택...</option>
                {users.filter((u) => u.role === '기업장').map((u) => (
                  <option key={u.id} value={u.name}>{u.name} ({u.org})</option>
                ))}
              </select>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--border)]">
            <button onClick={closeModal} className="h-[var(--btn-height)] px-4 text-sm font-medium text-[var(--text-secondary)] bg-[var(--bg)] border border-[var(--border)] rounded-lg hover:bg-gray-100 transition-colors">
              취소
            </button>
            <button onClick={handleSaveOrg} className="h-[var(--btn-height)] px-4 text-sm font-medium text-white bg-orange-600 rounded-lg hover:bg-orange-700 transition-colors">
              {activeModal === 'orgAdd' ? '추가' : '저장'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Add User to Org Modal */}
      <Modal isOpen={activeModal === 'addUserToOrg'} onClose={closeModal} title={`사용자 추가 -- ${(modalData as Organization)?.name || ''}`} size="lg">
        {activeModal === 'addUserToOrg' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">이름 *</label>
                <input type="text" value={addUserForm.name || ''} onChange={(e) => setAddUserForm((p) => ({ ...p, name: e.target.value }))} className="w-full h-[var(--btn-height)] px-3 text-sm bg-[var(--bg)] border border-[var(--border)] rounded-lg text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-orange-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">이메일 *</label>
                <input type="email" value={addUserForm.email || ''} onChange={(e) => setAddUserForm((p) => ({ ...p, email: e.target.value }))} className="w-full h-[var(--btn-height)] px-3 text-sm bg-[var(--bg)] border border-[var(--border)] rounded-lg text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-orange-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">전화번호</label>
                <input type="tel" value={addUserForm.phone || ''} onChange={(e) => setAddUserForm((p) => ({ ...p, phone: e.target.value }))} className="w-full h-[var(--btn-height)] px-3 text-sm bg-[var(--bg)] border border-[var(--border)] rounded-lg text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-orange-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">부서</label>
                <input type="text" value={addUserForm.department || ''} onChange={(e) => setAddUserForm((p) => ({ ...p, department: e.target.value }))} className="w-full h-[var(--btn-height)] px-3 text-sm bg-[var(--bg)] border border-[var(--border)] rounded-lg text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-orange-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">역할</label>
                <select value={addUserForm.role || '공급자'} onChange={(e) => setAddUserForm((p) => ({ ...p, role: e.target.value as User['role'] }))} className="w-full h-[var(--btn-height)] px-3 text-sm bg-[var(--bg)] border border-[var(--border)] rounded-lg text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-orange-500">
                  {getRolesForSupplierOrg().map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">소속 공급사</label>
                <input type="text" value={addUserForm.org || ''} disabled className="w-full h-[var(--btn-height)] px-3 text-sm bg-gray-100 border border-[var(--border)] rounded-lg text-[var(--text-secondary)] cursor-not-allowed" />
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--border)]">
              <button onClick={closeModal} className="h-[var(--btn-height)] px-4 text-sm font-medium text-[var(--text-secondary)] bg-[var(--bg)] border border-[var(--border)] rounded-lg hover:bg-gray-100 transition-colors">
                취소
              </button>
              <button onClick={handleSaveNewUser} className="h-[var(--btn-height)] px-4 text-sm font-medium text-white bg-orange-600 rounded-lg hover:bg-orange-700 transition-colors flex items-center gap-1.5">
                <Plus size={14} /> 추가
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Settlement Detail Modal */}
      <Modal isOpen={activeModal === 'settlementDetail'} onClose={closeModal} title="정산 상세" size="lg">
        {activeModal === 'settlementDetail' && modalData && (() => {
          const settlement = modalData as SupplierSettlement;
          const periodYear = settlement.period.split('-')[0];
          const periodMonth = parseInt(settlement.period.split('-')[1], 10);
          const supplierProducts = mockAdminProducts.filter((p) => p.supplier === settlement.supplierName);
          return (
            <div className="space-y-6">
              {/* Header */}
              <div>
                <h3 className="text-lg font-semibold text-[var(--text)]">
                  {settlement.supplierName} -- {periodYear}년 {periodMonth}월 정산 내역
                </h3>
              </div>

              {/* Summary card */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-[var(--bg)] rounded-lg p-4 border border-[var(--border)]">
                  <p className="text-xs text-[var(--text-secondary)] mb-1">총 매출</p>
                  <p className="text-lg font-bold text-[var(--text)]">₩{settlement.totalSales.toLocaleString('ko-KR')}</p>
                </div>
                <div className="bg-[var(--bg)] rounded-lg p-4 border border-[var(--border)]">
                  <p className="text-xs text-[var(--text-secondary)] mb-1">수수료 ({settlement.commissionRate}%)</p>
                  <p className="text-lg font-bold text-[var(--text)]">₩{settlement.commission.toLocaleString('ko-KR')}</p>
                </div>
                <div className="bg-[var(--bg)] rounded-lg p-4 border border-[var(--border)]">
                  <p className="text-xs text-[var(--text-secondary)] mb-1">지급액</p>
                  <p className="text-lg font-bold text-orange-600">₩{settlement.netPayment.toLocaleString('ko-KR')}</p>
                </div>
              </div>

              {/* Product breakdown */}
              <div>
                <h4 className="text-sm font-semibold text-[var(--text)] mb-3">제품별 매출 상세 (공급사별 제품 목록)</h4>
                {supplierProducts.length > 0 ? (
                  <div className="overflow-x-auto border border-[var(--border)] rounded-lg">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-[var(--bg)] border-b border-[var(--border)]">
                          <th className="text-left px-4 py-2.5 font-semibold text-[var(--text-secondary)] text-xs">카탈로그 No.</th>
                          <th className="text-left px-4 py-2.5 font-semibold text-[var(--text-secondary)] text-xs">제품명</th>
                          <th className="text-center px-4 py-2.5 font-semibold text-[var(--text-secondary)] text-xs">유형</th>
                          <th className="text-center px-4 py-2.5 font-semibold text-[var(--text-secondary)] text-xs">규격 수</th>
                          <th className="text-right px-4 py-2.5 font-semibold text-[var(--text-secondary)] text-xs">추정 매출</th>
                        </tr>
                      </thead>
                      <tbody>
                        {supplierProducts.map((p) => {
                          const estSales = p.variants.reduce((a, v) => a + v.salePrice * Math.max(1, v.stock), 0);
                          return (
                            <tr key={p.id} className="border-b border-[var(--border)] hover:bg-[var(--bg)] transition-colors">
                              <td className="px-4 py-2.5 text-[var(--text)] font-mono text-xs">{p.catalogNo}</td>
                              <td className="px-4 py-2.5 text-[var(--text)]">{p.name}</td>
                              <td className="px-4 py-2.5 text-center"><StatusBadge status={p.type === '시약' ? '시약' : '소모품'} colorMap={{ '시약': 'blue', '소모품': 'purple' }} /></td>
                              <td className="px-4 py-2.5 text-center text-[var(--text)]">{p.variants.length}개</td>
                              <td className="px-4 py-2.5 text-right text-[var(--text)]">₩{estSales.toLocaleString('ko-KR')}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-[var(--text-secondary)] bg-[var(--bg)] rounded-lg">
                    <Package size={32} className="mx-auto mb-2 opacity-30" />
                    <p className="text-sm">등록된 제품이 없습니다.</p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 pt-2 border-t border-[var(--border)]">
                {settlement.status === '정산완료' ? (
                  <p className="text-sm text-[var(--text-secondary)]">정산일: {settlement.settledAt}</p>
                ) : (
                  <button
                    onClick={() => { showToast(`${settlement.supplierName} 정산이 확정되었습니다`); closeModal(); }}
                    className="h-[var(--btn-height)] px-4 text-sm font-medium text-white bg-orange-600 rounded-lg hover:bg-orange-700 transition-colors flex items-center gap-1.5"
                  >
                    <CheckCircle size={14} /> 정산 확정
                  </button>
                )}
              </div>
            </div>
          );
        })()}
      </Modal>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-[60] bg-gray-900 text-white px-5 py-3 rounded-lg shadow-lg text-sm font-medium animate-[fadeIn_0.2s_ease-out]">
          {toast}
        </div>
      )}
    </div>
  );
}
