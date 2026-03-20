'use client';

import Link from 'next/link';
import { ShoppingCart, Bell, Sun, Moon, Search } from 'lucide-react';
import { useState } from 'react';
import { useNotificationStore } from '@/stores/notificationStore';
import { useCartStore } from '@/stores/cartStore';
import { NotificationPanel } from '@/components/notifications/NotificationPanel';

export function Topbar() {
  const [isDark, setIsDark] = useState(false);
  const cartCount = useCartStore((s) => s.getItemCount());
  const { unreadCount, togglePanel } = useNotificationStore();

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.setAttribute('data-theme', isDark ? 'light' : 'dark');
  };

  return (
    <header className="sticky top-0 z-30 h-14 bg-[var(--bg-card)] border-b border-[var(--border)] flex items-center justify-between px-6">
      {/* Search */}
      <div className="flex items-center flex-1 max-w-xl">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
          <input
            type="search"
            placeholder="시약명, CAS번호, 분자식, 카탈로그번호..."
            className="w-full pl-10 pr-4 h-[var(--btn-height)] border border-[var(--border)] rounded-lg bg-[var(--bg)] text-sm focus:outline-none focus:border-[var(--primary)] text-[var(--text)]"
          />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2 ml-4">
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
