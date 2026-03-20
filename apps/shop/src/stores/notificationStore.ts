// ================================================================
// 알림 시스템 Zustand 스토어
// Supabase Realtime 연동 준비
// ================================================================

import { create } from 'zustand';

export type NotificationType = 'order' | 'quote' | 'shipping' | 'stock' | 'approval' | 'system';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isOpen: boolean;
  addNotification: (notification: Omit<Notification, 'id' | 'isRead' | 'createdAt'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  togglePanel: () => void;
  closePanel: () => void;
}

// 초기 샘플 알림
const initialNotifications: Notification[] = [
  {
    id: '1',
    type: 'shipping',
    title: '배송 출발',
    message: 'ORD-20260317-001 주문이 출고되었습니다. 내일 도착 예정입니다.',
    link: '/orders',
    isRead: false,
    createdAt: '2026-03-20T09:30:00',
  },
  {
    id: '2',
    type: 'approval',
    title: '결제 승인 요청',
    message: '김연구님의 주문(W542,400)이 승인 대기 중입니다.',
    link: '/approvals',
    isRead: false,
    createdAt: '2026-03-20T08:15:00',
  },
  {
    id: '3',
    type: 'stock',
    title: '재고 부족 알림',
    message: 'Acetone (CAS: 67-64-1) 재고가 최소 수량 이하입니다.',
    link: '/inventory',
    isRead: true,
    createdAt: '2026-03-19T16:00:00',
  },
  {
    id: '4',
    type: 'quote',
    title: '견적 도착',
    message: 'Sigma-Aldrich에서 견적이 도착했습니다.',
    link: '/orders',
    isRead: true,
    createdAt: '2026-03-19T14:30:00',
  },
];

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: initialNotifications,
  unreadCount: initialNotifications.filter((n) => !n.isRead).length,
  isOpen: false,

  addNotification: (notification) => {
    const newNotification: Notification = {
      ...notification,
      id: String(Date.now()),
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    set((state) => ({
      notifications: [newNotification, ...state.notifications],
      unreadCount: state.unreadCount + 1,
    }));
  },

  markAsRead: (id) => {
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, isRead: true } : n
      ),
      unreadCount: Math.max(0, state.unreadCount - (state.notifications.find((n) => n.id === id && !n.isRead) ? 1 : 0)),
    }));
  },

  markAllAsRead: () => {
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
      unreadCount: 0,
    }));
  },

  removeNotification: (id) => {
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
      unreadCount: state.unreadCount - (state.notifications.find((n) => n.id === id && !n.isRead) ? 1 : 0),
    }));
  },

  togglePanel: () => set((state) => ({ isOpen: !state.isOpen })),
  closePanel: () => set({ isOpen: false }),
}));
