'use client';

import { useState, useMemo } from 'react';
import {
  Users, Building2, Activity, Search, Plus, MoreHorizontal,
  Edit, Trash2, Filter, Download, ChevronDown, Eye, Mail,
  Phone, Calendar, Shield, X, UserCheck, UserX, UserPlus,
  GraduationCap, Building, AlertTriangle, ExternalLink, UserMinus,
  Lock, Key, CheckCircle, XCircle, Settings, Clock, Monitor,
} from 'lucide-react';
import { AdminTabs } from '@/components/shared/AdminTabs';
import { Modal } from '@/components/shared/Modal';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Pagination } from '@/components/shared/Pagination';
import { StatCard } from '@/components/shared/StatCard';
import { useAdminStore } from '@/stores/adminStore';
import { PurchasePolicySection } from '@/components/customers/PurchasePolicySection';
import {
  mockUsers,
  mockOrganizations,
  mockActivityLogs,
  type User,
  type Organization,
} from '@/lib/admin-mock-data';

// ─── Constants ───────────────────────────────────────────────────────────────

/** Customer roles only */
type CustomerRole = '전체' | '연구원' | '조직장';
const customerRoles: CustomerRole[] = ['전체', '연구원', '조직장'];

const roleColors: Record<string, string> = {
  연구원: 'bg-blue-100 text-blue-700',
  조직장: 'bg-purple-100 text-purple-700',
};

/** 기관 유형에 따라 선택 가능한 역할 목록 반환 (고객 전용: 연구원/조직장만) */
function getRolesForOrg(orgId: string, orgs: Organization[]): User['role'][] {
  const org = orgs.find((o) => o.id === orgId);
  if (!org) return ['연구원'];
  if (org.type === '대학') return ['연구원', '조직장'];
  if (org.type === '연구소') return ['연구원', '조직장'];
  return ['연구원'];
}

const orgTypeColors: Record<string, string> = {
  대학: 'bg-blue-100 text-blue-700',
  연구소: 'bg-emerald-100 text-emerald-700',
};

type ActionType = '전체' | '로그인' | '주문' | '설정변경' | '역할변경';
const actionTypes: ActionType[] = ['전체', '로그인', '주문', '설정변경', '역할변경'];

const actionColors: Record<string, string> = {
  로그인: 'bg-blue-100 text-blue-700',
  주문: 'bg-emerald-100 text-emerald-700',
  설정변경: 'bg-amber-100 text-amber-700',
  역할변경: 'bg-purple-100 text-purple-700',
};

const CUSTOMERS_PER_PAGE = 8;

const tabs = [
  { id: '고객 목록', label: '고객 목록' },
  { id: '기관 관리', label: '기관 관리' },
  { id: '활동 로그', label: '활동 로그' },
  { id: '역할/권한 관리', label: '역할/권한 관리' },
];

// ─── RBAC Mock Data ─────────────────────────────────────────────────────────

const rbacPermissions = [
  '제품 조회', '제품 주문', '장바구니 관리', '주문 승인', '견적 관리',
  '사용자 관리', '제품 관리', '시스템 설정', 'API 관리', 'AI 관리',
] as const;

type RBACRole = {
  id: string;
  name: string;
  description: string;
  userCount: number;
  status: '활성' | '비활성';
  permissions: string[];
};

const rbacRoles: RBACRole[] = [
  {
    id: 'role-researcher',
    name: '연구원',
    description: '시약/소모품 조회 및 주문, 장바구니 관리 등 기본 구매 권한',
    userCount: 156,
    status: '활성',
    permissions: ['제품 조회', '제품 주문', '장바구니 관리'],
  },
  {
    id: 'role-org-leader',
    name: '조직장',
    description: '연구원 권한 + 주문 승인, 견적 관리, 예산 관리 권한',
    userCount: 24,
    status: '활성',
    permissions: ['제품 조회', '제품 주문', '장바구니 관리', '주문 승인', '견적 관리'],
  },
  {
    id: 'role-supplier',
    name: '공급자',
    description: '제품/가격/재고 관리, 견적 응답, 주문 처리 권한',
    userCount: 18,
    status: '활성',
    permissions: ['제품 조회', '견적 관리', '제품 관리'],
  },
  {
    id: 'role-admin',
    name: '시스템관리자',
    description: '전체 시스템 관리 권한 (모든 기능 접근 가능)',
    userCount: 3,
    status: '활성',
    permissions: [...rbacPermissions],
  },
];

const rbacMatrix: Record<string, string[]> = {
  연구원: ['제품 조회', '제품 주문', '장바구니 관리'],
  조직장: ['제품 조회', '제품 주문', '장바구니 관리', '주문 승인', '견적 관리'],
  공급자: ['제품 조회', '견적 관리', '제품 관리'],
  시스템관리자: [...rbacPermissions],
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatBudget(v: number) {
  if (v === 0) return '-';
  if (v >= 100000000) return `${(v / 100000000).toFixed(1)}억`;
  return `${(v / 10000).toLocaleString()}만`;
}

function budgetPercent(used: number, total: number) {
  if (total === 0) return 0;
  return Math.round((used / total) * 100);
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function CustomersPage() {
  const { selectedUserIds, toggleUserSelection, selectAllUsers, clearUserSelection, activeModal, modalData, openModal, closeModal } = useAdminStore();

  // Local tab state (no customersTab in store)
  const [activeTab, setActiveTab] = useState('고객 목록');

  // Mutable data (local state) — filtered to customers only (연구원 + 조직장)
  const [allUsers, setAllUsers] = useState<User[]>([...mockUsers]);
  const [organizations, setOrganizations] = useState<Organization[]>([...mockOrganizations]);
  const [toast, setToast] = useState<string | null>(null);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  }

  // Only customer users (연구원 + 조직장)
  const customers = useMemo(() => allUsers.filter((u) => u.role === '연구원' || u.role === '조직장'), [allUsers]);

  // Only customer-type organizations (대학 + 연구소, NOT 기업)
  const customerOrgs = useMemo(() => organizations.filter((o) => o.type === '대학' || o.type === '연구소'), [organizations]);

  // Customer user IDs for filtering activity logs
  const customerUserIds = useMemo(() => new Set(customers.map((u) => u.id)), [customers]);

  // Tab 1 state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<CustomerRole>('전체');
  const [statusFilter, setStatusFilter] = useState<'전체' | '활성' | '비활성' | '다중 소속'>('전체');
  const [currentPage, setCurrentPage] = useState(1);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  // Tab 2 state
  const [orgSearch, setOrgSearch] = useState('');

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
  const [addUserForm, setAddUserForm] = useState<Partial<User>>({ role: '연구원', status: '활성', orgIds: [] });

  // ─── Tab 1: Filtered customers ──────────────────────────────────────────

  const filteredCustomers = useMemo(() => {
    return customers.filter((u) => {
      const matchRole = selectedRole === '전체' || u.role === selectedRole;
      const matchStatus = statusFilter === '전체' || statusFilter === '다중 소속' ? (statusFilter === '다중 소속' ? (u.orgIds ?? []).length > 1 : true) : u.status === statusFilter;
      const q = searchQuery.toLowerCase();
      const matchSearch = !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.org.toLowerCase().includes(q);
      return matchRole && matchStatus && matchSearch;
    });
  }, [selectedRole, statusFilter, searchQuery, customers]);

  const totalPages = Math.max(1, Math.ceil(filteredCustomers.length / CUSTOMERS_PER_PAGE));
  const pagedCustomers = filteredCustomers.slice((currentPage - 1) * CUSTOMERS_PER_PAGE, currentPage * CUSTOMERS_PER_PAGE);
  const pagedCustomerIds = pagedCustomers.map((u) => u.id);

  const activeCount = customers.filter((u) => u.status === '활성').length;
  const inactiveCount = customers.filter((u) => u.status === '비활성').length;
  const newThisMonth = customers.filter((u) => u.createdAt >= '2026-03-01').length;

  // ─── Tab 2: Filtered orgs ──────────────────────────────────────────────

  const filteredOrgs = useMemo(() => {
    const q = orgSearch.toLowerCase();
    return customerOrgs.filter((o) => !q || o.name.toLowerCase().includes(q) || o.admin.toLowerCase().includes(q));
  }, [orgSearch, customerOrgs]);

  const uniCount = customerOrgs.filter((o) => o.type === '대학').length;
  const labCount = customerOrgs.filter((o) => o.type === '연구소').length;

  // ─── Tab 3: Filtered logs (customer actions only) ──────────────────────

  const filteredLogs = useMemo(() => {
    return mockActivityLogs.filter((log) => {
      // Only show logs from customer users
      if (!customerUserIds.has(log.userId)) return false;
      const matchAction = logActionFilter === '전체' || log.action === logActionFilter;
      const q = logSearch.toLowerCase();
      const matchSearch = !q || log.userName.toLowerCase().includes(q) || log.details.toLowerCase().includes(q);
      const matchDateFrom = !logDateFrom || log.timestamp >= logDateFrom;
      const matchDateTo = !logDateTo || log.timestamp <= logDateTo + ' 23:59:59';
      return matchAction && matchSearch && matchDateFrom && matchDateTo;
    });
  }, [logActionFilter, logSearch, logDateFrom, logDateTo, customerUserIds]);

  const visibleLogs = filteredLogs.slice(0, logVisibleCount);

  // ─── Modal helpers ─────────────────────────────────────────────────────

  function handleViewUser(user: User) {
    openModal('customerDetail', user);
  }

  function handleEditUser(user: User) {
    setEditForm({ ...user });
    openModal('customerEdit', user);
  }

  function handleViewOrg(org: Organization) {
    openModal('customerOrgDetail', org);
  }

  function handleAddOrg() {
    setOrgForm({ type: '대학', status: '활성' });
    openModal('customerOrgAdd', null);
  }

  function handleEditOrg(org: Organization) {
    setOrgForm({ ...org });
    openModal('customerOrgEdit', org);
  }

  // ─── CRUD Actions ─────────────────────────────────────────────────────

  function handleSaveUser() {
    if (!editForm.id) return;
    setAllUsers((prev) => prev.map((u) => u.id === editForm.id ? { ...u, ...editForm } as User : u));
    showToast(`${editForm.name} 정보가 저장되었습니다.`);
    closeModal();
  }

  function handleToggleUserStatus(user: User) {
    const newStatus = user.status === '활성' ? '비활성' : '활성';
    setAllUsers((prev) => prev.map((u) => u.id === user.id ? { ...u, status: newStatus } : u));
    showToast(`${user.name}을(를) ${newStatus} 상태로 변경했습니다.`);
    closeModal();
  }

  function handleDeleteUser(userId: string) {
    const user = allUsers.find((u) => u.id === userId);
    setAllUsers((prev) => prev.filter((u) => u.id !== userId));
    showToast(`${user?.name || '사용자'}가 삭제되었습니다.`);
    setOpenDropdownId(null);
  }

  function handleRemoveFromOrg(user: User, orgId: string) {
    setAllUsers((prev) => prev.map((u) => {
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
    if (activeModal === 'customerOrgAdd') {
      const newOrg: Organization = {
        id: `ORG-${String(organizations.length + 1).padStart(3, '0')}`,
        name: orgForm.name || '새 기관',
        type: orgForm.type || '대학',
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
    setAddUserForm({ role: '연구원', status: '활성', orgId, orgIds: [orgId], org: org?.name || '' });
    closeModal();
    openModal('customerAddUserToOrg', org);
  }

  function handleSaveNewUser() {
    const newUser: User = {
      id: `USR-${String(allUsers.length + 1).padStart(3, '0')}`,
      name: addUserForm.name || '',
      email: addUserForm.email || '',
      org: addUserForm.org || '',
      orgId: addUserForm.orgId || '',
      orgIds: addUserForm.orgIds || [],
      role: (addUserForm.role as User['role']) || '연구원',
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
    setAllUsers((prev) => [...prev, newUser]);
    showToast(`${newUser.name}이(가) ${newUser.org}에 추가되었습니다.`);
    closeModal();
  }

  // ─── Bulk Actions ──────────────────────────────────────────────────────

  function handleBulkRoleChange() {
    const selected = allUsers.filter((u) => selectedUserIds.includes(u.id));
    if (selected.length === 0) return;
    // Toggle: if all selected are 조직장, set to 연구원; otherwise promote to 조직장
    const allOrgLeader = selected.every((u) => u.role === '조직장');
    const newRole = allOrgLeader ? '연구원' : '조직장';
    setAllUsers((prev) => prev.map((u) => selectedUserIds.includes(u.id) ? { ...u, role: newRole } as User : u));
    showToast(`${selectedUserIds.length}명의 역할을 ${newRole}(으)로 변경했습니다.`);
    clearUserSelection();
  }

  function handleBulkStatusChange() {
    const selected = allUsers.filter((u) => selectedUserIds.includes(u.id));
    if (selected.length === 0) return;
    // Toggle: if all selected are 활성, set to 비활성; otherwise set to 활성
    const allActive = selected.every((u) => u.status === '활성');
    const newStatus = allActive ? '비활성' : '활성';
    setAllUsers((prev) => prev.map((u) => selectedUserIds.includes(u.id) ? { ...u, status: newStatus } as User : u));
    showToast(`${selectedUserIds.length}명의 상태를 ${newStatus}(으)로 변경했습니다.`);
    clearUserSelection();
  }

  function handleBulkCsvExport() {
    const selected = customers.filter((u) => selectedUserIds.includes(u.id));
    if (selected.length === 0) return;
    const header = '이름,이메일,소속,역할,상태,마지막접속,접속수';
    const rows = selected.map((u) => `${u.name},${u.email},${u.org},${u.role},${u.status},${u.lastLogin},${u.loginCount}`);
    const csv = [header, ...rows].join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `customers_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(`${selected.length}명의 고객 데이터를 CSV로 내보냈습니다.`);
  }

  // ─── RBAC Actions ─────────────────────────────────────────────────────

  function handleViewRbacRole(role: RBACRole) {
    openModal('customerRbacDetail', role);
  }

  function handleEditRbacRole(role: RBACRole) {
    openModal('customerRbacEdit', role);
  }

  function handleAddRbacRole() {
    openModal('customerRbacAdd', null);
  }

  // ─── Policy Actions ───────────────────────────────────────────────────

  function handleChangeDefaultRole() {
    showToast('기본 역할 설정이 변경 준비 중입니다. (추후 구현)');
  }

  function handleChangeAutoLockPeriod() {
    showToast('비활성 계정 잠금 기간 설정이 변경 준비 중입니다. (추후 구현)');
  }

  function handleChangeConcurrentSessions() {
    showToast('동시 로그인 제한 설정이 변경 준비 중입니다. (추후 구현)');
  }

  // ─── Render ────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text)]">고객 관리</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">연구원, 조직장 사용자를 관리합니다</p>
        </div>
      </div>

      {/* Tabs */}
      <AdminTabs tabs={tabs} activeTab={activeTab} onTabChange={(t) => { setActiveTab(t); clearUserSelection(); }} />

      {/* ═══════════════════════════════════════════════════════════════════════
          Tab 1: 고객 목록
          ═══════════════════════════════════════════════════════════════════ */}
      {activeTab === '고객 목록' && (
        <div className="space-y-5">
          {/* Stats */}
          <div className="grid grid-cols-4 gap-4">
            <StatCard icon={<Users size={20} />} label="전체 고객" value={String(customers.length)} change="+12%" up />
            <StatCard icon={<UserCheck size={20} />} label="활성" value={String(activeCount)} change="+8%" up />
            <StatCard icon={<UserX size={20} />} label="비활성" value={String(inactiveCount)} change="-3%" up={false} />
            <StatCard icon={<UserPlus size={20} />} label="이번 달 신규" value={String(newThisMonth)} change="+2명" up />
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
                {customerRoles.map((role) => (
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
                onChange={(e) => { setStatusFilter(e.target.value as any); setCurrentPage(1); }}
                className="h-[var(--btn-height)] px-3 text-sm bg-[var(--bg)] border border-[var(--border)] rounded-lg text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="전체">상태: 전체</option>
                <option value="활성">활성</option>
                <option value="비활성">비활성</option>
                <option value="다중 소속">다중 소속</option>
              </select>
            </div>
          </div>

          {/* Bulk action bar */}
          {selectedUserIds.length > 0 && (
            <div className="bg-orange-50 border border-orange-200 rounded-xl px-5 py-3 flex items-center gap-3">
              <span className="text-sm font-medium text-orange-800">{selectedUserIds.length}명 선택됨</span>
              <div className="flex-1" />
              <button onClick={handleBulkRoleChange} className="h-[var(--btn-height)] px-4 text-sm font-medium bg-white border border-orange-300 text-orange-700 rounded-lg hover:bg-orange-100 transition-colors">
                역할 변경
              </button>
              <button onClick={handleBulkStatusChange} className="h-[var(--btn-height)] px-4 text-sm font-medium bg-white border border-orange-300 text-orange-700 rounded-lg hover:bg-orange-100 transition-colors">
                상태 변경
              </button>
              <button onClick={handleBulkCsvExport} className="h-[var(--btn-height)] px-4 text-sm font-medium bg-white border border-orange-300 text-orange-700 rounded-lg hover:bg-orange-100 transition-colors flex items-center gap-1.5">
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
                        checked={pagedCustomerIds.length > 0 && pagedCustomerIds.every((id) => selectedUserIds.includes(id))}
                        onChange={() => selectAllUsers(pagedCustomerIds)}
                        className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                      />
                    </th>
                    <th className="text-left px-5 py-3 font-semibold text-[var(--text-secondary)] text-xs uppercase tracking-wider">이름</th>
                    <th className="text-left px-5 py-3 font-semibold text-[var(--text-secondary)] text-xs uppercase tracking-wider">이메일</th>
                    <th className="text-left px-5 py-3 font-semibold text-[var(--text-secondary)] text-xs uppercase tracking-wider">소속</th>
                    <th className="text-left px-5 py-3 font-semibold text-[var(--text-secondary)] text-xs uppercase tracking-wider">역할</th>
                    <th className="text-left px-5 py-3 font-semibold text-[var(--text-secondary)] text-xs uppercase tracking-wider">상태</th>
                    <th className="text-left px-5 py-3 font-semibold text-[var(--text-secondary)] text-xs uppercase tracking-wider">마지막 접속</th>
                    <th className="text-center px-5 py-3 font-semibold text-[var(--text-secondary)] text-xs uppercase tracking-wider">접속수</th>
                    <th className="text-center px-5 py-3 font-semibold text-[var(--text-secondary)] text-xs uppercase tracking-wider">관리</th>
                  </tr>
                </thead>
                <tbody>
                  {pagedCustomers.map((user) => (
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
                      <td className="px-5 py-3.5 text-[var(--text)]">
                        <div className="flex items-center gap-1.5">
                          <span>{user.org}</span>
                          {(user.orgIds ?? []).length > 1 && (
                            <span className="text-xs px-1.5 py-0.5 rounded bg-violet-100 text-violet-700 font-medium" title={`${user.orgIds.length}개 기관 소속: ${user.orgIds.map((oid) => organizations.find((o) => o.id === oid)?.name || oid).join(', ')}`}>
                              +{user.orgIds.length - 1}
                            </span>
                          )}
                        </div>
                      </td>
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
                  {pagedCustomers.length === 0 && (
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
          Tab 2: 기관 관리
          ═══════════════════════════════════════════════════════════════════ */}
      {activeTab === '기관 관리' && (
        <div className="space-y-5">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <StatCard icon={<Building2 size={20} />} label="전체 기관" value={String(customerOrgs.length)} change="+2" up />
            <StatCard icon={<GraduationCap size={20} />} label="대학" value={String(uniCount)} change="+1" up />
            <StatCard icon={<Building size={20} />} label="연구소" value={String(labCount)} change="+1" up />
          </div>

          {/* Filter + Add */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
              <input
                type="text"
                value={orgSearch}
                onChange={(e) => setOrgSearch(e.target.value)}
                placeholder="기관명, 관리자 검색..."
                className="w-full h-[var(--btn-height)] pl-9 pr-4 text-sm bg-[var(--bg)] border border-[var(--border)] rounded-lg text-[var(--text)] placeholder:text-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={handleAddOrg}
              className="h-[var(--btn-height)] px-4 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors flex items-center gap-2"
            >
              <Plus size={16} />
              기관 추가
            </button>
          </div>

          {/* Org Table */}
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[var(--bg)] border-b border-[var(--border)]">
                    <th className="text-left px-5 py-3 font-semibold text-[var(--text-secondary)] text-xs uppercase tracking-wider">기관명</th>
                    <th className="text-left px-5 py-3 font-semibold text-[var(--text-secondary)] text-xs uppercase tracking-wider">유형</th>
                    <th className="text-center px-5 py-3 font-semibold text-[var(--text-secondary)] text-xs uppercase tracking-wider">회원수</th>
                    <th className="text-left px-5 py-3 font-semibold text-[var(--text-secondary)] text-xs uppercase tracking-wider">관리자</th>
                    <th className="text-left px-5 py-3 font-semibold text-[var(--text-secondary)] text-xs uppercase tracking-wider min-w-[200px]">예산</th>
                    <th className="text-left px-5 py-3 font-semibold text-[var(--text-secondary)] text-xs uppercase tracking-wider">상태</th>
                    <th className="text-left px-5 py-3 font-semibold text-[var(--text-secondary)] text-xs uppercase tracking-wider">생성일</th>
                    <th className="text-center px-5 py-3 font-semibold text-[var(--text-secondary)] text-xs uppercase tracking-wider">관리</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrgs.map((org) => {
                    const pct = budgetPercent(org.usedBudget, org.budget);
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
                          {(() => {
                            const members = allUsers.filter((u) => (u.orgIds ?? [u.orgId]).includes(org.id));
                            const emailDomain = members.length > 0 ? members[0].email.split('@')[1] : '';
                            const hasMismatch = emailDomain && members.some((u) => u.email.split('@')[1] !== emailDomain);
                            const hasDuplicate = members.some((m) => allUsers.some((u) => u.id !== m.id && u.name === m.name && u.orgId !== org.id));
                            return (hasMismatch || hasDuplicate) ? (
                              <span className="ml-1.5 inline-flex items-center" title={hasMismatch ? '이메일 도메인 불일치 사용자 있음' : '동명이인 의심 사용자 있음'}>
                                <AlertTriangle size={13} className="text-amber-500" />
                              </span>
                            ) : null;
                          })()}
                        </td>
                        <td className="px-5 py-3.5">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${orgTypeColors[org.type] || ''}`}>
                            {org.type}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-center text-[var(--text)]">{org.memberCount}명</td>
                        <td className="px-5 py-3.5 text-[var(--text)]">{org.admin}</td>
                        <td className="px-5 py-3.5">
                          {org.budget > 0 ? (
                            <div className="space-y-1">
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-[var(--text-secondary)]">{formatBudget(org.usedBudget)} / {formatBudget(org.budget)}</span>
                                <span className={`font-medium ${pct > 80 ? 'text-red-600' : pct > 60 ? 'text-amber-600' : 'text-emerald-600'}`}>{pct}%</span>
                              </div>
                              <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full ${pct > 80 ? 'bg-red-500' : pct > 60 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                                  style={{ width: `${pct}%` }}
                                />
                              </div>
                            </div>
                          ) : (
                            <span className="text-xs text-[var(--text-secondary)]">-</span>
                          )}
                        </td>
                        <td className="px-5 py-3.5"><StatusBadge status={org.status} /></td>
                        <td className="px-5 py-3.5 text-[var(--text-secondary)]">{org.createdAt}</td>
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
                      <td colSpan={8} className="px-5 py-12 text-center text-[var(--text-secondary)]">
                        검색 결과가 없습니다.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Purchase Policy Section */}
          <PurchasePolicySection />
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════
          Tab 3: 활동 로그
          ═══════════════════════════════════════════════════════════════════ */}
      {activeTab === '활동 로그' && (
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
                  placeholder="고객 검색..."
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
                        검색 결과가 없습니다.
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
          Tab 4: 역할/권한 관리
          ═══════════════════════════════════════════════════════════════════ */}
      {activeTab === '역할/권한 관리' && (
        <div className="space-y-5">

          {/* ── Section 1: 역할 목록 ────────────────────────────────────────── */}
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-[var(--border)] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield size={18} className="text-orange-600" />
                <h3 className="text-sm font-semibold text-[var(--text)]">역할 목록</h3>
                <span className="text-xs text-[var(--text-secondary)]">({rbacRoles.length}개)</span>
              </div>
              <button onClick={handleAddRbacRole} className="h-[var(--btn-height)] px-4 text-sm font-medium text-white bg-orange-600 rounded-lg hover:bg-orange-700 transition-colors flex items-center gap-1.5">
                <Plus size={14} /> 역할 추가
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[var(--bg)] border-b border-[var(--border)]">
                    <th className="text-left px-5 py-3 font-semibold text-[var(--text-secondary)] text-xs uppercase tracking-wider">역할명</th>
                    <th className="text-left px-5 py-3 font-semibold text-[var(--text-secondary)] text-xs uppercase tracking-wider">설명</th>
                    <th className="text-left px-5 py-3 font-semibold text-[var(--text-secondary)] text-xs uppercase tracking-wider whitespace-nowrap">사용자 수</th>
                    <th className="text-left px-5 py-3 font-semibold text-[var(--text-secondary)] text-xs uppercase tracking-wider">상태</th>
                    <th className="text-left px-5 py-3 font-semibold text-[var(--text-secondary)] text-xs uppercase tracking-wider">권한</th>
                    <th className="text-right px-5 py-3 font-semibold text-[var(--text-secondary)] text-xs uppercase tracking-wider">액션</th>
                  </tr>
                </thead>
                <tbody>
                  {rbacRoles.map((role) => (
                    <tr key={role.id} className="border-b border-[var(--border)] hover:bg-[var(--bg)] transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-orange-100 text-orange-700 rounded-lg flex items-center justify-center">
                            <Shield size={16} />
                          </div>
                          <span className="font-semibold text-[var(--text)]">{role.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-[var(--text-secondary)] max-w-xs">
                        <span className="line-clamp-2">{role.description}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1.5">
                          <Users size={14} className="text-[var(--text-secondary)]" />
                          <span className="font-medium text-[var(--text)]">{role.userCount}명</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${role.status === '활성' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                          {role.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1 flex-wrap">
                          {role.permissions.slice(0, 3).map((p) => (
                            <span key={p} className="text-xs px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-medium">{p}</span>
                          ))}
                          {role.permissions.length > 3 && (
                            <span className="text-xs px-2 py-0.5 rounded bg-gray-100 text-[var(--text-secondary)] font-medium">+{role.permissions.length - 3}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => handleViewRbacRole(role)} className="w-8 h-8 inline-flex items-center justify-center rounded-lg text-[var(--text-secondary)] hover:bg-gray-100 transition-colors" title="상세보기">
                            <Eye size={15} />
                          </button>
                          <button onClick={() => handleEditRbacRole(role)} className="w-8 h-8 inline-flex items-center justify-center rounded-lg text-[var(--text-secondary)] hover:bg-gray-100 transition-colors" title="수정">
                            <Edit size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ── Section 2: 권한 매트릭스 ──────────────────────────────────── */}
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-[var(--border)] flex items-center gap-2">
              <Key size={18} className="text-orange-600" />
              <h3 className="text-sm font-semibold text-[var(--text)]">권한 매트릭스</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[var(--bg)] border-b border-[var(--border)]">
                    <th className="text-left px-5 py-3 font-semibold text-[var(--text-secondary)] text-xs uppercase tracking-wider min-w-[140px] sticky left-0 bg-[var(--bg)] z-10">권한</th>
                    {Object.keys(rbacMatrix).map((roleName) => (
                      <th key={roleName} className="text-center px-4 py-3 font-semibold text-[var(--text-secondary)] text-xs uppercase tracking-wider whitespace-nowrap min-w-[100px]">
                        {roleName}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rbacPermissions.map((perm) => (
                    <tr key={perm} className="border-b border-[var(--border)] hover:bg-[var(--bg)] transition-colors">
                      <td className="px-5 py-3 font-medium text-[var(--text)] whitespace-nowrap sticky left-0 bg-[var(--bg-card)] z-10">
                        {perm}
                      </td>
                      {Object.keys(rbacMatrix).map((roleName) => {
                        const granted = rbacMatrix[roleName].includes(perm);
                        return (
                          <td key={roleName} className="text-center px-4 py-3">
                            {granted ? (
                              <CheckCircle size={18} className="inline-block text-emerald-500" />
                            ) : (
                              <XCircle size={18} className="inline-block text-gray-300" />
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ── Section 3: 권한 정책 설정 ─────────────────────────────────── */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Settings size={18} className="text-orange-600" />
              <h3 className="text-sm font-semibold text-[var(--text)]">권한 정책 설정</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {/* Policy 1: 기본 역할 */}
              <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                    <Shield size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-[var(--text)]">기본 역할 (Default Role)</h4>
                    <p className="text-xs text-[var(--text-secondary)]">신규 가입 시 자동 부여되는 역할</p>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-[var(--bg)] rounded-lg">
                  <span className="text-sm font-medium text-[var(--text)]">연구원</span>
                  <button onClick={handleChangeDefaultRole} className="h-[var(--btn-height)] px-3 text-xs font-medium text-orange-600 bg-orange-50 border border-orange-200 rounded-lg hover:bg-orange-100 transition-colors">
                    변경
                  </button>
                </div>
              </div>

              {/* Policy 2: 조직장 자동 승격 */}
              <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center">
                    <UserCheck size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-[var(--text)]">조직장 자동 승격 조건</h4>
                    <p className="text-xs text-[var(--text-secondary)]">조건 충족 시 조직장 역할 자동 부여</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-[var(--bg)] rounded-lg">
                    <span className="text-sm text-[var(--text)]">기관 내 첫 번째 가입자</span>
                    <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-emerald-100 text-emerald-700">활성</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-[var(--bg)] rounded-lg">
                    <span className="text-sm text-[var(--text)]">관리자 수동 지정</span>
                    <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-emerald-100 text-emerald-700">활성</span>
                  </div>
                </div>
              </div>

              {/* Policy 3: 비활성 계정 잠금 */}
              <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-lg flex items-center justify-center">
                    <Lock size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-[var(--text)]">비활성 계정 자동 잠금</h4>
                    <p className="text-xs text-[var(--text-secondary)]">일정 기간 미접속 시 계정 자동 잠금</p>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-[var(--bg)] rounded-lg">
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-[var(--text-secondary)]" />
                    <span className="text-sm font-medium text-[var(--text)]">90일</span>
                    <span className="text-xs text-[var(--text-secondary)]">미접속 시 자동 잠금</span>
                  </div>
                  <button onClick={handleChangeAutoLockPeriod} className="h-[var(--btn-height)] px-3 text-xs font-medium text-orange-600 bg-orange-50 border border-orange-200 rounded-lg hover:bg-orange-100 transition-colors">
                    변경
                  </button>
                </div>
              </div>

              {/* Policy 4: 동시 로그인 제한 */}
              <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-red-100 text-red-600 rounded-lg flex items-center justify-center">
                    <Monitor size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-[var(--text)]">동시 로그인 제한</h4>
                    <p className="text-xs text-[var(--text-secondary)]">계정당 최대 동시 세션 수 제한</p>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-[var(--bg)] rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-[var(--text)]">최대 3개</span>
                    <span className="text-xs text-[var(--text-secondary)]">디바이스 동시 접속 허용</span>
                  </div>
                  <button onClick={handleChangeConcurrentSessions} className="h-[var(--btn-height)] px-3 text-xs font-medium text-orange-600 bg-orange-50 border border-orange-200 rounded-lg hover:bg-orange-100 transition-colors">
                    변경
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════
          Modals
          ═══════════════════════════════════════════════════════════════════ */}

      {/* Customer Detail Modal */}
      <Modal isOpen={activeModal === 'customerDetail'} onClose={closeModal} title="고객 상세" size="lg">
        {activeModal === 'customerDetail' && modalData && (() => {
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
                <div className="flex items-start gap-2 text-sm col-span-2">
                  <Building2 size={15} className="text-[var(--text-secondary)] mt-0.5" />
                  <span className="text-[var(--text-secondary)]">소속</span>
                  <div className="ml-auto space-y-1.5">
                    {(user.orgIds ?? [user.orgId]).map((oid) => {
                      const o = organizations.find((org) => org.id === oid);
                      const isPrimary = oid === user.orgId;
                      return (
                        <div key={oid} className="flex items-center gap-2">
                          <span className="text-[var(--text)]">{o?.name || oid}</span>
                          {isPrimary && <span className="text-xs px-1.5 py-0.5 rounded bg-orange-100 text-orange-700 font-medium">주 소속</span>}
                          {!isPrimary && <span className="text-xs px-1.5 py-0.5 rounded bg-violet-100 text-violet-700 font-medium">겸임</span>}
                          {(user.orgIds ?? []).length > 1 && (
                            <button
                              onClick={() => {
                                handleRemoveFromOrg(user, oid);
                                setTimeout(() => {
                                  const updated = allUsers.find((u) => u.id === user.id);
                                  if (updated && (updated.orgIds ?? []).length > 0) openModal('customerDetail', updated);
                                }, 100);
                              }}
                              className="w-5 h-5 inline-flex items-center justify-center rounded text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                              title={isPrimary ? '주 소속 해제' : '겸임 해제'}
                            >
                              <X size={12} />
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
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

      {/* Customer Edit Modal */}
      <Modal isOpen={activeModal === 'customerEdit'} onClose={closeModal} title="고객 수정" size="lg">
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
              <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">소속</label>
              <select
                value={editForm.orgId || ''}
                onChange={(e) => {
                  const org = organizations.find((o) => o.id === e.target.value);
                  setEditForm((prev) => ({ ...prev, orgId: e.target.value, org: org?.name || '' }));
                }}
                className="w-full h-[var(--btn-height)] px-3 text-sm bg-[var(--bg)] border border-[var(--border)] rounded-lg text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                {customerOrgs.map((o) => (
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
                value={editForm.role || '연구원'}
                onChange={(e) => setEditForm((prev) => ({ ...prev, role: e.target.value as User['role'] }))}
                className="w-full h-[var(--btn-height)] px-3 text-sm bg-[var(--bg)] border border-[var(--border)] rounded-lg text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                {getRolesForOrg(editForm.orgId || '', organizations).map((r) => (
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
      <Modal isOpen={activeModal === 'customerOrgDetail'} onClose={closeModal} title="기관 상세" size="xl">
        {activeModal === 'customerOrgDetail' && modalData && (() => {
          const org = modalData as Organization;
          const orgMembers = allUsers.filter((u) => (u.orgIds ?? [u.orgId]).includes(org.id) && (u.role === '연구원' || u.role === '조직장'));
          const pct = budgetPercent(org.usedBudget, org.budget);

          // 다중 소속: 이 기관 외에 다른 기관에도 속한 사용자
          const multiOrgUsers = orgMembers.filter((u) => (u.orgIds ?? [u.orgId]).length > 1);

          // 중복 검출: 같은 기관 내 동일 이메일 도메인이 아닌 사용자 (외부 소속 의심)
          const orgEmailDomain = orgMembers.filter((u) => u.orgId === org.id).length > 0
            ? orgMembers.find((u) => u.orgId === org.id)!.email.split('@')[1]
            : (orgMembers.length > 0 ? orgMembers[0].email.split('@')[1] : '');
          const mismatchedUsers = orgMembers.filter((u) => {
            const domain = u.email.split('@')[1];
            return orgEmailDomain && domain !== orgEmailDomain;
          });

          // 중복 검출: 다른 기관에도 등록된 이름 (동명이인 or 중복 등록)
          const duplicateNameUsers = orgMembers.filter((member) => {
            return allUsers.some((u) => u.id !== member.id && u.name === member.name && u.orgId !== org.id);
          });

          return (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-100 text-orange-700 rounded-lg flex items-center justify-center text-sm font-bold">
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
                  <Edit size={14} /> 기관 정보 수정
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

              {/* Budget */}
              {org.budget > 0 && (
                <div className="p-4 bg-[var(--bg)] rounded-lg">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="font-medium text-[var(--text)]">예산 현황</span>
                    <span className={`font-semibold ${pct > 80 ? 'text-red-600' : pct > 60 ? 'text-amber-600' : 'text-emerald-600'}`}>
                      {formatBudget(org.usedBudget)} / {formatBudget(org.budget)} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${pct > 80 ? 'bg-red-500' : pct > 60 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              )}

              {/* 다중 소속 / 중복 / 이상 경고 */}
              {(multiOrgUsers.length > 0 || mismatchedUsers.length > 0 || duplicateNameUsers.length > 0) && (
                <div className="space-y-2">
                  {multiOrgUsers.length > 0 && (
                    <div className="flex items-start gap-2 p-3 bg-violet-50 border border-violet-200 rounded-lg">
                      <Building2 size={16} className="text-violet-600 mt-0.5 flex-shrink-0" />
                      <div className="text-sm">
                        <span className="font-medium text-violet-800">다중 소속 사용자 {multiOrgUsers.length}명</span>
                        <p className="text-violet-700 mt-0.5">
                          {multiOrgUsers.map((u) => {
                            const otherOrgs = (u.orgIds ?? []).filter((oid) => oid !== org.id).map((oid) => organizations.find((o) => o.id === oid)?.name || oid);
                            return `${u.name} → ${otherOrgs.join(', ')}에도 소속`;
                          }).join('; ')}
                        </p>
                      </div>
                    </div>
                  )}
                  {mismatchedUsers.length > 0 && (
                    <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                      <AlertTriangle size={16} className="text-amber-600 mt-0.5 flex-shrink-0" />
                      <div className="text-sm">
                        <span className="font-medium text-amber-800">이메일 도메인 불일치</span>
                        <p className="text-amber-700 mt-0.5">
                          {mismatchedUsers.map((u) => `${u.name} (${u.email})`).join(', ')} -
                          기관 도메인(@{orgEmailDomain})과 다른 이메일을 사용 중입니다. 소속 확인이 필요합니다.
                        </p>
                      </div>
                    </div>
                  )}
                  {duplicateNameUsers.length > 0 && (
                    <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <AlertTriangle size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
                      <div className="text-sm">
                        <span className="font-medium text-blue-800">동명이인 / 중복 등록 의심</span>
                        <p className="text-blue-700 mt-0.5">
                          {duplicateNameUsers.map((u) => {
                            const otherOrgs = allUsers.filter((o) => o.name === u.name && o.id !== u.id).map((o) => o.org);
                            return `${u.name} → 다른 기관(${otherOrgs.join(', ')})에도 동일 이름 존재`;
                          }).join('; ')}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Members Table - Full featured */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-semibold text-[var(--text)]">소속 고객 ({orgMembers.length}명)</h4>
                  <button
                    onClick={() => {
                      closeModal();
                      setSearchQuery(org.name);
                      setSelectedRole('전체');
                      setStatusFilter('전체');
                      setCurrentPage(1);
                      setActiveTab('고객 목록');
                    }}
                    className="text-xs text-orange-600 hover:text-orange-700 font-medium flex items-center gap-1"
                  >
                    <ExternalLink size={12} /> 고객 목록에서 보기
                  </button>
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
                        {orgMembers.map((m) => {
                          const isMultiOrg = multiOrgUsers.some((d) => d.id === m.id);
                          const isDuplicate = duplicateNameUsers.some((d) => d.id === m.id);
                          const isMismatched = mismatchedUsers.some((d) => d.id === m.id);
                          return (
                            <tr key={m.id} className={`border-t border-[var(--border)] hover:bg-[var(--bg)] transition-colors ${isMultiOrg ? 'bg-violet-50/50' : isDuplicate ? 'bg-blue-50/50' : isMismatched ? 'bg-amber-50/50' : ''}`}>
                              <td className="px-4 py-2.5">
                                <div className="flex items-center gap-2">
                                  <div className="w-7 h-7 bg-orange-100 text-orange-700 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                                    {m.name.charAt(0)}
                                  </div>
                                  <div>
                                    <span className="font-medium text-[var(--text)]">{m.name}</span>
                                    {isMultiOrg && (
                                      <span className="ml-1 text-xs px-1 py-0.5 rounded bg-violet-100 text-violet-700 font-medium" title={`다중 소속: ${(m.orgIds ?? []).map((oid) => organizations.find((o) => o.id === oid)?.name || oid).join(', ')}`}>
                                        +{(m.orgIds ?? []).length - 1}
                                      </span>
                                    )}
                                    {isDuplicate && <span className="ml-1 text-xs text-blue-600" title="동명이인 의심">*</span>}
                                  </div>
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
                                    onClick={(e) => { e.stopPropagation(); openModal('customerConfirmRemove', m); }}
                                    className="w-7 h-7 inline-flex items-center justify-center rounded text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                                    title="기관에서 제거"
                                  >
                                    <UserMinus size={14} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-[var(--text-secondary)] bg-[var(--bg)] rounded-lg">
                    <Users size={32} className="mx-auto mb-2 opacity-30" />
                    <p className="text-sm">소속 고객이 없습니다.</p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 pt-2 border-t border-[var(--border)]">
                <button
                  onClick={() => handleAddUserToOrg(org.id)}
                  className="h-[var(--btn-height)] px-4 bg-[var(--bg)] border border-[var(--border)] text-[var(--text)] rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors flex items-center gap-1.5"
                >
                  <Plus size={14} /> 이 기관에 고객 추가
                </button>
                <button
                  onClick={() => { closeModal(); handleEditOrg(org); }}
                  className="h-[var(--btn-height)] px-4 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors flex items-center gap-1.5"
                >
                  <Edit size={14} /> 기관 수정
                </button>
              </div>
            </div>
          );
        })()}
      </Modal>

      {/* 기관에서 사용자 제거 확인 모달 */}
      <Modal isOpen={activeModal === 'customerConfirmRemove'} onClose={closeModal} title="고객 제거 확인" size="sm">
        {activeModal === 'customerConfirmRemove' && modalData && (() => {
          const user = modalData as User;
          return (
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertTriangle size={20} className="text-red-500 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="font-medium text-red-800">정말 이 고객을 기관에서 제거하시겠습니까?</p>
                  <p className="text-red-700 mt-1">
                    <strong>{user.name}</strong> ({user.email})이(가) 소속 기관에서 제거됩니다.
                    계정 자체는 삭제되지 않으며, 기관 미소속 상태로 변경됩니다.
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
      <Modal isOpen={activeModal === 'customerOrgAdd' || activeModal === 'customerOrgEdit'} onClose={closeModal} title={activeModal === 'customerOrgAdd' ? '기관 추가' : '기관 수정'} size="lg">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">기관명</label>
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
                value={orgForm.type || '대학'}
                onChange={(e) => setOrgForm((prev) => ({ ...prev, type: e.target.value as Organization['type'] }))}
                className="w-full h-[var(--btn-height)] px-3 text-sm bg-[var(--bg)] border border-[var(--border)] rounded-lg text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="대학">대학</option>
                <option value="연구소">연구소</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">예산 한도 (원)</label>
              <input
                type="number"
                value={orgForm.budget || ''}
                onChange={(e) => setOrgForm((prev) => ({ ...prev, budget: Number(e.target.value) }))}
                placeholder="0"
                className="w-full h-[var(--btn-height)] px-3 text-sm bg-[var(--bg)] border border-[var(--border)] rounded-lg text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
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
                {allUsers.filter((u) => u.role === '조직장').map((u) => (
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
              {activeModal === 'customerOrgAdd' ? '추가' : '저장'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Add User to Org Modal */}
      <Modal isOpen={activeModal === 'customerAddUserToOrg'} onClose={closeModal} title={`고객 추가 — ${(modalData as Organization)?.name || ''}`} size="lg">
        {activeModal === 'customerAddUserToOrg' && (
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
                <select value={addUserForm.role || '연구원'} onChange={(e) => setAddUserForm((p) => ({ ...p, role: e.target.value as User['role'] }))} className="w-full h-[var(--btn-height)] px-3 text-sm bg-[var(--bg)] border border-[var(--border)] rounded-lg text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-orange-500">
                  {getRolesForOrg(addUserForm.orgId || '', organizations).map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">소속 기관</label>
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

      {/* RBAC Role Detail Modal */}
      <Modal isOpen={activeModal === 'customerRbacDetail'} onClose={closeModal} title="역할 상세" size="md">
        {activeModal === 'customerRbacDetail' && modalData && (() => {
          const role = modalData as RBACRole;
          return (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 text-orange-700 rounded-lg flex items-center justify-center">
                  <Shield size={20} />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-[var(--text)]">{role.name}</h3>
                  <p className="text-xs text-[var(--text-secondary)]">{role.id}</p>
                </div>
                <span className={`ml-auto text-xs px-2.5 py-1 rounded-full font-medium ${role.status === '활성' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                  {role.status}
                </span>
              </div>
              <div className="text-sm text-[var(--text-secondary)]">{role.description}</div>
              <div className="flex items-center gap-2 text-sm">
                <Users size={15} className="text-[var(--text-secondary)]" />
                <span className="text-[var(--text-secondary)]">사용자 수</span>
                <span className="ml-auto font-medium text-[var(--text)]">{role.userCount}명</span>
              </div>
              <div>
                <p className="text-xs font-medium text-[var(--text-secondary)] mb-2">부여된 권한</p>
                <div className="flex flex-wrap gap-1.5">
                  {role.permissions.map((p) => (
                    <span key={p} className="text-xs px-2.5 py-1 rounded bg-blue-50 text-blue-700 font-medium">{p}</span>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-end pt-4 border-t border-[var(--border)]">
                <button onClick={closeModal} className="h-[var(--btn-height)] px-4 text-sm font-medium text-[var(--text-secondary)] bg-[var(--bg)] border border-[var(--border)] rounded-lg hover:bg-gray-100 transition-colors">
                  닫기
                </button>
              </div>
            </div>
          );
        })()}
      </Modal>

      {/* RBAC Role Edit / Add Modal */}
      <Modal isOpen={activeModal === 'customerRbacEdit' || activeModal === 'customerRbacAdd'} onClose={closeModal} title={activeModal === 'customerRbacAdd' ? '역할 추가' : '역할 수정'} size="md">
        {(activeModal === 'customerRbacEdit' || activeModal === 'customerRbacAdd') && (() => {
          const role = activeModal === 'customerRbacEdit' ? (modalData as RBACRole) : null;
          return (
            <div className="space-y-4">
              <p className="text-sm text-[var(--text-secondary)]">
                {role ? `"${role.name}" 역할의 권한을 수정합니다.` : '새로운 역할을 추가합니다.'}
              </p>
              <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                역할 및 권한 편집 기능은 추후 구현 예정입니다.
              </p>
              <div className="flex items-center justify-end pt-4 border-t border-[var(--border)]">
                <button onClick={closeModal} className="h-[var(--btn-height)] px-4 text-sm font-medium text-[var(--text-secondary)] bg-[var(--bg)] border border-[var(--border)] rounded-lg hover:bg-gray-100 transition-colors">
                  닫기
                </button>
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
