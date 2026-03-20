'use client';

import { useNotificationStore, type NotificationType } from '@/stores/notificationStore';
import { Bell, Check, CheckCheck, X, Package, FileText, Truck, AlertTriangle, ShieldCheck, Info } from 'lucide-react';
import Link from 'next/link';

const typeConfig: Record<NotificationType, { icon: React.ReactNode; color: string; bgColor: string }> = {
  order: { icon: <Package size={14} />, color: 'text-blue-600', bgColor: 'bg-blue-50' },
  quote: { icon: <FileText size={14} />, color: 'text-violet-600', bgColor: 'bg-violet-50' },
  shipping: { icon: <Truck size={14} />, color: 'text-emerald-600', bgColor: 'bg-emerald-50' },
  stock: { icon: <AlertTriangle size={14} />, color: 'text-amber-600', bgColor: 'bg-amber-50' },
  approval: { icon: <ShieldCheck size={14} />, color: 'text-indigo-600', bgColor: 'bg-indigo-50' },
  system: { icon: <Info size={14} />, color: 'text-gray-600', bgColor: 'bg-gray-50' },
};

export function NotificationPanel() {
  const { notifications, unreadCount, isOpen, togglePanel, closePanel, markAsRead, markAllAsRead, removeNotification } = useNotificationStore();

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40" onClick={closePanel} />

      {/* Panel */}
      <div className="absolute right-0 top-12 w-[380px] bg-[var(--bg-card)] rounded-xl border border-[var(--border)] shadow-xl z-50 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)]">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-[var(--text)]">알림</h3>
            {unreadCount > 0 && (
              <span className="px-1.5 py-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs text-blue-600 hover:underline flex items-center gap-1 mr-2"
              >
                <CheckCheck size={12} /> 모두 읽음
              </button>
            )}
            <button onClick={closePanel} className="text-[var(--text-secondary)] hover:text-[var(--text)]">
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Notification List */}
        <div className="max-h-[400px] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="py-12 text-center text-[var(--text-secondary)]">
              <Bell size={32} className="mx-auto mb-2 opacity-30" />
              <p className="text-sm">알림이 없습니다</p>
            </div>
          ) : (
            notifications.map((notification) => {
              const config = typeConfig[notification.type];
              const timeAgo = getTimeAgo(notification.createdAt);

              return (
                <div
                  key={notification.id}
                  className={`flex gap-3 px-4 py-3 border-b border-[var(--border)] last:border-0 hover:bg-gray-50 transition-colors ${
                    !notification.isRead ? 'bg-blue-50/30' : ''
                  }`}
                >
                  {/* Icon */}
                  <div className={`w-8 h-8 rounded-full ${config.bgColor} ${config.color} flex items-center justify-center shrink-0 mt-0.5`}>
                    {config.icon}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className={`text-sm ${!notification.isRead ? 'font-semibold text-[var(--text)]' : 'text-[var(--text)]'}`}>
                        {notification.title}
                      </p>
                      <button
                        onClick={() => removeNotification(notification.id)}
                        className="text-[var(--text-secondary)] hover:text-red-500 shrink-0"
                      >
                        <X size={12} />
                      </button>
                    </div>
                    <p className="text-xs text-[var(--text-secondary)] mt-0.5 line-clamp-2">
                      {notification.message}
                    </p>
                    <div className="flex items-center justify-between mt-1.5">
                      <span className="text-[10px] text-[var(--text-secondary)]">{timeAgo}</span>
                      <div className="flex items-center gap-2">
                        {!notification.isRead && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="text-[10px] text-blue-600 hover:underline flex items-center gap-0.5"
                          >
                            <Check size={10} /> 읽음
                          </button>
                        )}
                        {notification.link && (
                          <Link
                            href={notification.link}
                            onClick={() => { markAsRead(notification.id); closePanel(); }}
                            className="text-[10px] text-blue-600 hover:underline"
                          >
                            바로가기
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* 전체보기 링크 */}
        <div className="border-t border-[var(--border)] px-4 py-2.5">
          <Link
            href="/notifications"
            onClick={closePanel}
            className="block w-full text-center text-sm text-blue-600 hover:underline font-medium"
          >
            전체보기
          </Link>
        </div>
      </div>
    </>
  );
}

function getTimeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHour = Math.floor(diffMs / 3600000);
  const diffDay = Math.floor(diffMs / 86400000);

  if (diffMin < 1) return '방금 전';
  if (diffMin < 60) return `${diffMin}분 전`;
  if (diffHour < 24) return `${diffHour}시간 전`;
  if (diffDay < 7) return `${diffDay}일 전`;
  return date.toLocaleDateString('ko-KR');
}
