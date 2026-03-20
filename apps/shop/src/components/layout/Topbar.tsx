'use client';

import Link from 'next/link';
import { ShoppingCart, Bell, Sun, Moon } from 'lucide-react';
import { useNotificationStore } from '@/stores/notificationStore';
import { useCartStore } from '@/stores/cartStore';
import { useThemeStore } from '@/stores/themeStore';
import { NotificationPanel } from '@/components/notifications/NotificationPanel';

export function Topbar() {
  const { theme, toggleTheme } = useThemeStore();
  const isDark = theme === 'dark';
  const cartCount = useCartStore((s) => s.getItemCount());
  const { unreadCount, togglePanel } = useNotificationStore();

  return (
    <header className="sticky top-0 z-30 h-14 bg-[var(--bg-card)] border-b border-[var(--border)] flex items-center justify-end px-6">
      {/* Right Actions */}
      <div className="flex items-center gap-2">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="w-9 h-9 flex items-center justify-center rounded-lg text-[var(--text-secondary)] hover:bg-gray-100 transition-colors"
          aria-label="테마 전환"
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Cart */}
        <Link
          href="/cart"
          className="relative w-9 h-9 flex items-center justify-center rounded-lg text-[var(--text-secondary)] hover:bg-gray-100 transition-colors"
        >
          <ShoppingCart size={18} />
          {cartCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </Link>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={togglePanel}
            className="relative w-9 h-9 flex items-center justify-center rounded-lg text-[var(--text-secondary)] hover:bg-gray-100 transition-colors"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
          <NotificationPanel />
        </div>

        {/* User */}
        <div className="flex items-center gap-2 ml-2 pl-2 border-l border-[var(--border)]">
          <span className="text-sm font-medium text-[var(--text)]">김연구</span>
          <span className="text-xs text-[var(--text-secondary)] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
            연구원
          </span>
          <div className="w-8 h-8 bg-violet-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
            K
          </div>
        </div>
      </div>
    </header>
  );
}
