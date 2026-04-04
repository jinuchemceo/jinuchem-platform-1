'use client';

import { useState } from 'react';
import {
  Package,
  FileText,
  MessageSquare,
  AlertTriangle,
  DollarSign,
  RotateCcw,
  Settings,
  Check,
  Trash2,
  Search,
  ExternalLink,
  Truck,
  ShieldCheck,
} from 'lucide-react';
import { useNotificationStore } from '@/stores/notificationStore';
import type { NotificationType } from '@/types';

const notiConfig: Record<NotificationType, { label: string; icon: React.ReactNode; bg: string; color: string }> = {
  new_order: { label: '주문', icon: <Package size={16} />, bg: 'rgba(0,122,255,0.1)', color: '#007AFF' },
  new_quote: { label: '견적', icon: <FileText size={16} />, bg: 'rgba(52,199,89,0.1)', color: '#34C759' },
  inquiry: { label: '문의', icon: <MessageSquare size={16} />, bg: 'rgba(175,82,222,0.1)', color: '#AF52DE' },
  low_stock: { label: '재고', icon: <AlertTriangle size={16} />, bg: 'rgba(255,149,0,0.1)', color: '#FF9500' },
  settlement: { label: '정산', icon: <DollarSign size={16} />, bg: 'rgba(90,200,250,0.1)', color: '#5AC8FA' },
  return: { label: '반품', icon: <RotateCcw size={16} />, bg: 'rgba(255,59,48,0.1)', color: '#FF3B30' },
  system: { label: '시스템', icon: <Settings size={16} />, bg: 'rgba(142,142,147,0.1)', color: '#8E8E93' },
};

type FilterType = '전체' | NotificationType;

export default function NotificationsPage() {
  const { notifications, unreadCount, markAsRead, markAllAsRead, removeNotification } = useNotificationStore();
  const [filter, setFilter] = useState<FilterType>('전체');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 6;

  const allFiltered = (filter === '전체' ? notifications : notifications.filter(n => n.type === filter))
    .filter(n => !searchQuery || n.title.includes(searchQuery) || n.message.includes(searchQuery));
  const totalPages = Math.ceil(allFiltered.length / perPage);
  const paged = allFiltered.slice((currentPage - 1) * perPage, currentPage * perPage);

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  };
  const toggleAll = () => {
    if (selectedIds.size === paged.length) setSelectedIds(new Set());
    else setSelectedIds(new Set(paged.map(n => n.id)));
  };
  const handleBulkRead = () => {
    selectedIds.forEach(id => markAsRead(id));
    setSelectedIds(new Set());
  };
  const handleBulkDelete = () => {
    selectedIds.forEach(id => removeNotification(id));
    setSelectedIds(new Set());
  };

  const filterTabs: { label: string; value: FilterType }[] = [
    { label: '전체', value: '전체' },
    { label: '주문', value: 'new_order' },
    { label: '견적', value: 'new_quote' },
    { label: '재고', value: 'low_stock' },
    { label: '정산', value: 'settlement' },
    { label: '시스템', value: 'system' },
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>알림</h1>
          {unreadCount > 0 && (
            <span className="text-xs font-bold px-2.5 py-1 rounded-full text-white" style={{ background: 'var(--danger)' }}>
              {unreadCount}건 미읽음
            </span>
          )}
        </div>
        <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>총 {notifications.length}건</span>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1 border-b" style={{ borderColor: 'var(--border)' }}>
        {filterTabs.map(tab => (
          <button
            key={tab.value}
            onClick={() => { setFilter(tab.value); setCurrentPage(1); }}
            className="px-4 py-2.5 text-sm font-medium border-b-2 transition-colors"
            style={{
              borderColor: filter === tab.value ? 'var(--primary)' : 'transparent',
              color: filter === tab.value ? 'var(--primary)' : 'var(--text-secondary)',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search + Actions */}
      <div className="flex items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-secondary)' }} />
          <input
            type="search"
            placeholder="알림 검색..."
            value={searchQuery}
            onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            className="w-full pl-10 pr-4 h-[38px] border rounded-lg text-sm focus:outline-none"
            style={{ borderColor: 'var(--border)', background: 'var(--bg-card)', color: 'var(--text)' }}
          />
        </div>
        <div className="flex gap-2">
          {selectedIds.size > 0 && (
            <>
              <button
                onClick={handleBulkRead}
                className="flex items-center gap-1.5 px-4 h-[38px] border rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors"
                style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
              >
                <Check size={14} /> 읽음 처리
              </button>
              <button
                onClick={handleBulkDelete}
                className="flex items-center gap-1.5 px-4 h-[38px] rounded-lg text-sm font-semibold transition-colors text-white"
                style={{ background: 'var(--danger)' }}
              >
                <Trash2 size={14} /> 삭제 ({selectedIds.size})
              </button>
            </>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-gray-50" style={{ borderColor: 'var(--border)' }}>
              <th className="w-10 px-3 py-3">
                <input type="checkbox" checked={selectedIds.size === paged.length && paged.length > 0} onChange={toggleAll} className="accent-purple-600" />
              </th>
              <th className="text-left px-4 py-3 font-medium" style={{ color: 'var(--text-secondary)' }}>날짜</th>
              <th className="text-center px-4 py-3 font-medium" style={{ color: 'var(--text-secondary)' }}>유형</th>
              <th className="text-left px-4 py-3 font-medium" style={{ color: 'var(--text-secondary)' }}>제목</th>
              <th className="text-left px-4 py-3 font-medium" style={{ color: 'var(--text-secondary)' }}>내용</th>
              <th className="text-center px-4 py-3 font-medium" style={{ color: 'var(--text-secondary)' }}>상태</th>
              <th className="text-center px-4 py-3 font-medium" style={{ color: 'var(--text-secondary)' }}>바로가기</th>
            </tr>
          </thead>
          <tbody>
            {paged.length === 0 ? (
              <tr><td colSpan={7} className="text-center py-12" style={{ color: 'var(--text-secondary)' }}>알림이 없습니다</td></tr>
            ) : (
              paged.map(noti => {
                const cfg = notiConfig[noti.type];
                return (
                  <tr
                    key={noti.id}
                    className="border-b last:border-0 hover:bg-gray-50 transition-colors"
                    style={{ borderColor: 'var(--border)', background: noti.isRead ? undefined : 'var(--primary-light)' }}
                  >
                    <td className="w-10 px-3 py-3">
                      <input type="checkbox" checked={selectedIds.has(noti.id)} onChange={() => toggleSelect(noti.id)} className="accent-purple-600" />
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap" style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{noti.time}</td>
                    <td className="px-4 py-3 text-center">
                      <div className="inline-flex items-center gap-1.5">
                        <span
                          className="w-8 h-8 rounded-full flex items-center justify-center"
                          style={{ background: cfg.bg, color: cfg.color }}
                        >
                          {cfg.icon}
                        </span>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ background: cfg.bg, color: cfg.color }}>
                          {cfg.label}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-semibold whitespace-nowrap" style={{ color: 'var(--text)' }}>{noti.title}</td>
                    <td className="px-4 py-3" style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{noti.message}</td>
                    <td className="px-4 py-3 text-center whitespace-nowrap">
                      {noti.isRead ? (
                        <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>읽음</span>
                      ) : (
                        <button
                          onClick={() => markAsRead(noti.id)}
                          className="text-xs font-semibold flex items-center gap-1 mx-auto"
                          style={{ color: 'var(--success)' }}
                        >
                          <Check size={12} /> 읽음
                        </button>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button className="w-7 h-7 inline-flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors" style={{ color: 'var(--text-secondary)' }}>
                        <ExternalLink size={14} />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-1">
          <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="w-9 h-9 flex items-center justify-center rounded-full text-sm hover:bg-gray-100 disabled:opacity-30" style={{ color: 'var(--text-secondary)' }}>&lt;</button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <button key={p} onClick={() => setCurrentPage(p)} className={`w-9 h-9 flex items-center justify-center rounded-full text-sm font-medium ${currentPage === p ? 'bg-purple-600 text-white' : 'hover:bg-gray-100'}`} style={currentPage !== p ? { color: 'var(--text-secondary)' } : {}}>{p}</button>
          ))}
          <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="w-9 h-9 flex items-center justify-center rounded-full text-sm hover:bg-gray-100 disabled:opacity-30" style={{ color: 'var(--text-secondary)' }}>&gt;</button>
        </div>
      )}
    </div>
  );
}
