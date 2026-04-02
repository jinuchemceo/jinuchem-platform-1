import { create } from 'zustand';
import type { SupplierNotification } from '@/types';
import { mockNotifications } from '@/lib/mock-data';

interface NotificationState {
  notifications: SupplierNotification[];
  unreadCount: number;

  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  addNotification: (notification: Omit<SupplierNotification, 'id' | 'isRead'>) => void;
  removeNotification: (id: string) => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: mockNotifications,
  unreadCount: mockNotifications.filter((n) => !n.isRead).length,

  markAsRead: (id) =>
    set((state) => {
      const notification = state.notifications.find((n) => n.id === id);
      if (!notification || notification.isRead) return state;
      return {
        notifications: state.notifications.map((n) =>
          n.id === id ? { ...n, isRead: true } : n
        ),
        unreadCount: state.unreadCount - 1,
      };
    }),

  markAllAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
      unreadCount: 0,
    })),

  addNotification: (notification) =>
    set((state) => ({
      notifications: [
        { ...notification, id: `N-${Date.now()}`, isRead: false },
        ...state.notifications,
      ],
      unreadCount: state.unreadCount + 1,
    })),

  removeNotification: (id) =>
    set((state) => {
      const notification = state.notifications.find((n) => n.id === id);
      return {
        notifications: state.notifications.filter((n) => n.id !== id),
        unreadCount: notification && !notification.isRead
          ? state.unreadCount - 1
          : state.unreadCount,
      };
    }),
}));
