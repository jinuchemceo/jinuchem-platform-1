'use client';

import {
  Package,
  FileText,
  MessageSquare,
  AlertTriangle,
  DollarSign,
  RotateCcw,
  Settings,
} from 'lucide-react';
import { useNotificationStore } from '@/stores/notificationStore';
import type { NotificationType } from '@/types';

const notiIcons: Record<NotificationType, { icon: React.ReactNode; bg: string }> = {
  new_order: { icon: <Package size={16} />, bg: 'bg-blue-100 text-blue-700' },
  new_quote: { icon: <FileText size={16} />, bg: 'bg-amber-100 text-amber-700' },
  inquiry: { icon: <MessageSquare size={16} />, bg: 'bg-purple-100 text-purple-700' },
  low_stock: { icon: <AlertTriangle size={16} />, bg: 'bg-red-100 text-red-700' },
  settlement: { icon: <DollarSign size={16} />, bg: 'bg-green-100 text-green-700' },
  return: { icon: <RotateCcw size={16} />, bg: 'bg-orange-100 text-orange-700' },
  system: { icon: <Settings size={16} />, bg: 'bg-gray-100 text-gray-700' },
};

export default function NotificationsPage() {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotificationStore();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text)]">알림 센터</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">읽지 않은 알림 {unreadCount}건</p>
        </div>
        <button
          onClick={markAllAsRead}
          className="px-4 h-[38px] text-sm font-semibold rounded-lg border border-[var(--border)] hover:bg-gray-50 transition-colors"
        >
          모두 읽음 처리
        </button>
      </div>

      <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-xl overflow-hidden">
        {notifications.map(noti => {
          const iconInfo = notiIcons[noti.type];
          return (
            <div
              key={noti.id}
              onClick={() => !noti.isRead && markAsRead(noti.id)}
              className={`flex items-start gap-3 px-5 py-4 border-b border-[var(--border)] last:border-b-0 transition-colors cursor-pointer ${
                noti.isRead ? '' : 'bg-purple-50/50'
              }`}
            >
              <div className={`w-9 h-9 rounded-lg ${iconInfo.bg} flex items-center justify-center shrink-0 mt-0.5`}>
                {iconInfo.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold">{noti.title}</p>
                  {!noti.isRead && <span className="w-2 h-2 rounded-full bg-purple-600 shrink-0" />}
                </div>
                <p className="text-sm text-[var(--text-secondary)] mt-0.5">{noti.message}</p>
                <p className="text-xs text-[var(--text-secondary)] mt-1">{noti.time}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
