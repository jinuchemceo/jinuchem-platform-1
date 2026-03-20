'use client';

import { useState, useMemo } from 'react';
import {
  Bell, Search, Check, CheckCheck, Trash2, Package, FileText, Truck,
  AlertTriangle, ShieldCheck, Info, ChevronLeft, ChevronRight, ExternalLink,
} from 'lucide-react';
import { useNotificationStore, type NotificationType } from '@/stores/notificationStore';
import Link from 'next/link';

type FilterTab = 'all' | NotificationType;

const filterTabs: { key: FilterTab; label: string }[] = [
  { key: 'all', label: '전체' },
  { key: 'order', label: '주문' },
  { key: 'quote', label: '견적' },
  { key: 'shipping', label: '배송' },
  { key: 'stock', label: '재고' },
  { key: 'approval', label: '승인' },
  { key: 'system', label: '시스템' },
];

const typeConfig: Record<NotificationType, { icon: React.ReactNode; color: string; bgColor: string; label: string }> = {
  order: { icon: <Package size={14} />, color: 'text-blue-600', bgColor: 'bg-blue-50', label: '주문' },
  quote: { icon: <FileText size={14} />, color: 'text-violet-600', bgColor: 'bg-violet-50', label: '견적' },
  shipping: { icon: <Truck size={14} />, color: 'text-emerald-600', bgColor: 'bg-emerald-50', label: '배송' },
  stock: { icon: <AlertTriangle size={14} />, color: 'text-amber-600', bgColor: 'bg-amber-50', label: '재고' },
  approval: { icon: <ShieldCheck size={14} />, color: 'text-indigo-600', bgColor: 'bg-indigo-50', label: '승인' },
  system: { icon: <Info size={14} />, color: 'text-gray-600', bgColor: 'bg-gray-50', label: '시스템' },
};

// 확장된 샘플 알림 데이터
const extendedNotifications = [
  { id: 'n1', type: 'shipping' as NotificationType, title: '배송 출발', message: 'ORD-20260317-001 주문이 출고되었습니다. 내일 도착 예정입니다.', link: '/orders', isRead: false, createdAt: '2026-03-20T09:30:00' },
  { id: 'n2', type: 'approval' as NotificationType, title: '결제 승인 요청', message: '김연구님의 주문(W542,400)이 승인 대기 중입니다.', link: '/approvals', isRead: false, createdAt: '2026-03-20T08:15:00' },
  { id: 'n3', type: 'stock' as NotificationType, title: '재고 부족 알림', message: 'Acetone (CAS: 67-64-1) 재고가 최소 수량 이하입니다. 재주문을 권장합니다.', link: '/inventory', isRead: true, createdAt: '2026-03-19T16:00:00' },
  { id: 'n4', type: 'quote' as NotificationType, title: '견적 도착', message: 'Sigma-Aldrich에서 Ethanol 500mL x 10 견적이 도착했습니다. 유효기간: 2026-04-19', link: '/orders', isRead: true, createdAt: '2026-03-19T14:30:00' },
  { id: 'n5', type: 'order' as NotificationType, title: '주문 확정', message: 'ORD-20260318-003 주문이 확정되었습니다. 공급사에서 처리 중입니다.', link: '/orders', isRead: false, createdAt: '2026-03-19T11:00:00' },
  { id: 'n6', type: 'shipping' as NotificationType, title: '배송 완료', message: 'ORD-20260315-002 주문이 배송 완료되었습니다. 수령 확인 부탁드립니다.', link: '/orders', isRead: true, createdAt: '2026-03-18T15:20:00' },
  { id: 'n7', type: 'system' as NotificationType, title: '시스템 점검 안내', message: '2026-03-25 02:00~06:00 시스템 정기 점검이 예정되어 있습니다.', isRead: true, createdAt: '2026-03-18T10:00:00' },
  { id: 'n8', type: 'stock' as NotificationType, title: '재고 입고 알림', message: 'Methanol HPLC Grade 4L 재고가 입고되었습니다. 현재 재고: 12개', link: '/order', isRead: true, createdAt: '2026-03-17T09:00:00' },
  { id: 'n9', type: 'approval' as NotificationType, title: '결제 승인 완료', message: '이분석님의 주문(W177,300)이 승인 처리되었습니다.', link: '/approvals', isRead: true, createdAt: '2026-03-17T08:00:00' },
  { id: 'n10', type: 'order' as NotificationType, title: '주문 접수', message: 'ORD-20260316-005 주문이 접수되었습니다. 견적 확인 후 처리됩니다.', link: '/orders', isRead: true, createdAt: '2026-03-16T14:00:00' },
];

const ITEMS_PER_PAGE = 6;

export default function NotificationsPage() {
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [readStatus, setReadStatus] = useState<Record<string, boolean>>(
    Object.fromEntries(extendedNotifications.map((n) => [n.id, n.isRead]))
  );
  const [deletedIds, setDeletedIds] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const notifications = useMemo(() => {
    return extendedNotifications
      .filter((n) => !deletedIds.has(n.id))
      .filter((n) => activeFilter === 'all' || n.type === activeFilter)
      .filter((n) => {
        if (!searchQuery) return true;
        const q = searchQuery.toLowerCase();
        return n.title.toLowerCase().includes(q) || n.message.toLowerCase().includes(q);
      });
  }, [activeFilter, searchQuery, deletedIds]);

  const totalPages = Math.max(1, Math.ceil(notifications.length / ITEMS_PER_PAGE));
  const paginatedNotifications = notifications.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const unreadCount = notifications.filter((n) => !readStatus[n.id]).length;

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    const pageIds = paginatedNotifications.map((n) => n.id);
    const allSelected = pageIds.every((id) => selectedIds.has(id));
    if (allSelected) {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        pageIds.forEach((id) => next.delete(id));
        return next;
      });
    } else {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        pageIds.forEach((id) => next.add(id));
        return next;
      });
    }
  };

  const markSelectedAsRead = () => {
    setReadStatus((prev) => {
      const next = { ...prev };
      selectedIds.forEach((id) => { next[id] = true; });
      return next;
    });
    setSelectedIds(new Set());
  };

  const deleteSelected = () => {
    setDeletedIds((prev) => {
      const next = new Set(prev);
      selectedIds.forEach((id) => next.add(id));
      return next;
    });
    setSelectedIds(new Set());
    if (currentPage > 1 && paginatedNotifications.length <= selectedIds.size) {
      setCurrentPage((p) => Math.max(1, p - 1));
    }
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' })
      + ' ' + d.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-[var(--text)]">알림</h1>
          {unreadCount > 0 && (
            <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full">
              {unreadCount}건 미읽음
            </span>
          )}
        </div>
        <span className="text-sm text-[var(--text-secondary)]">
          총 {notifications.length}건
        </span>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 mb-4 border-b border-[var(--border)]">
        {filterTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => { setActiveFilter(tab.key); setCurrentPage(1); }}
            className={`px-4 h-[42px] text-sm font-medium border-b-2 transition-colors ${
              activeFilter === tab.key
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text)]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search + Actions */}
      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            placeholder="알림 검색..."
            className="w-full pl-10 pr-4 h-[38px] border border-[var(--border)] rounded-lg bg-[var(--bg-card)] text-sm text-[var(--text)] focus:outline-none focus:border-[var(--primary)]"
          />
        </div>
        <div className="flex items-center gap-2 ml-auto">
          {selectedIds.size > 0 && (
            <>
              <button
                onClick={markSelectedAsRead}
                className="h-[38px] px-4 border border-[var(--border)] text-sm text-[var(--text)] rounded-lg hover:border-blue-400 flex items-center gap-1.5"
              >
                <CheckCheck size={14} /> 읽음 처리
              </button>
              <button
                onClick={deleteSelected}
                className="h-[38px] px-4 border border-red-300 text-sm text-red-600 rounded-lg hover:bg-red-50 flex items-center gap-1.5"
              >
                <Trash2 size={14} /> 삭제 ({selectedIds.size})
              </button>
            </>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border)] overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-[var(--border)]">
              <th className="w-[50px] px-4 py-3">
                <input
                  type="checkbox"
                  checked={paginatedNotifications.length > 0 && paginatedNotifications.every((n) => selectedIds.has(n.id))}
                  onChange={toggleSelectAll}
                  className="accent-blue-600"
                />
              </th>
              <th className="text-center px-4 py-3 font-medium text-[var(--text-secondary)] w-[100px]">날짜</th>
              <th className="text-center px-4 py-3 font-medium text-[var(--text-secondary)] w-[80px]">유형</th>
              <th className="text-left px-4 py-3 font-medium text-[var(--text-secondary)]">제목</th>
              <th className="text-left px-4 py-3 font-medium text-[var(--text-secondary)]">내용</th>
              <th className="text-center px-4 py-3 font-medium text-[var(--text-secondary)] w-[80px]">상태</th>
              <th className="text-center px-4 py-3 font-medium text-[var(--text-secondary)] w-[80px]">바로가기</th>
            </tr>
          </thead>
          <tbody>
            {paginatedNotifications.map((notification) => {
              const config = typeConfig[notification.type];
              const isRead = readStatus[notification.id];

              return (
                <tr
                  key={notification.id}
                  className={`border-b border-[var(--border)] last:border-0 hover:bg-gray-50 transition-colors ${
                    !isRead ? 'bg-blue-50/30' : ''
                  }`}
                >
                  <td className="px-4 py-3 text-center">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(notification.id)}
                      onChange={() => toggleSelect(notification.id)}
                      className="accent-blue-600"
                    />
                  </td>
                  <td className="px-4 py-3 text-center text-xs text-[var(--text-secondary)] whitespace-nowrap">
                    {formatDate(notification.createdAt)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.bgColor} ${config.color}`}>
                      {config.icon}
                      {config.label}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-sm ${!isRead ? 'font-semibold text-[var(--text)]' : 'text-[var(--text)]'}`}>
                      {notification.title}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-[var(--text-secondary)] line-clamp-1">
                      {notification.message}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {isRead ? (
                      <span className="text-xs text-[var(--text-secondary)]">읽음</span>
                    ) : (
                      <button
                        onClick={() => setReadStatus((prev) => ({ ...prev, [notification.id]: true }))}
                        className="text-xs text-blue-600 hover:underline flex items-center gap-0.5 mx-auto"
                      >
                        <Check size={12} /> 읽음
                      </button>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {notification.link ? (
                      <Link
                        href={notification.link}
                        className="text-blue-600 hover:underline inline-flex items-center gap-0.5"
                      >
                        <ExternalLink size={12} />
                      </Link>
                    ) : (
                      <span className="text-[var(--text-secondary)]">-</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {paginatedNotifications.length === 0 && (
          <div className="text-center py-16 text-[var(--text-secondary)]">
            <Bell size={40} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">알림이 없습니다</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-1 mt-6">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="w-9 h-9 rounded-full text-sm text-[var(--text-secondary)] hover:bg-gray-100 disabled:opacity-30 flex items-center justify-center"
          >
            <ChevronLeft size={16} />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-9 h-9 rounded-full text-sm font-medium transition-colors ${
                currentPage === page
                  ? 'border-2 border-slate-800 text-slate-800'
                  : 'text-[var(--text-secondary)] hover:bg-gray-100'
              }`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="w-9 h-9 rounded-full text-sm text-[var(--text-secondary)] hover:bg-gray-100 disabled:opacity-30 flex items-center justify-center"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
