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
    <header
      className="sticky top-0 z-30 flex items-center justify-end px-5"
      style={{
        height: 'var(--topbar-height)',
        background: isDark
          ? 'rgba(28,28,30,0.85)'
          : 'rgba(255,255,255,0.82)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        borderBottom: '0.5px solid var(--border)',
      }}
    >
      <div className="flex items-center gap-1">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="w-9 h-9 flex items-center justify-center rounded-full transition-colors"
          style={{ color: 'var(--text-secondary)' }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background = isDark
              ? 'rgba(255,255,255,0.08)'
              : 'rgba(0,0,0,0.06)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = 'transparent';
          }}
          aria-label="테마 전환"
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Cart */}
        <Link
          href="/cart"
          className="relative w-9 h-9 flex items-center justify-center rounded-full transition-colors"
          style={{ color: 'var(--text-secondary)' }}
        >
          <ShoppingCart size={18} />
          {cartCount > 0 && (
            <span
              className="absolute -top-0.5 -right-0.5 w-[18px] h-[18px] flex items-center justify-center text-white rounded-full"
              style={{
                background: 'var(--danger)',
                fontSize: 10,
                fontWeight: 700,
              }}
            >
              {cartCount > 9 ? '9+' : cartCount}
            </span>
          )}
        </Link>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={togglePanel}
            className="relative w-9 h-9 flex items-center justify-center rounded-full transition-colors"
            style={{ color: 'var(--text-secondary)' }}
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span
                className="absolute -top-0.5 -right-0.5 w-[18px] h-[18px] flex items-center justify-center text-white rounded-full"
                style={{
                  background: 'var(--danger)',
                  fontSize: 10,
                  fontWeight: 700,
                }}
              >
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>
          <NotificationPanel />
        </div>

        {/* Divider */}
        <span
          className="w-px h-5 mx-1"
          style={{ background: 'var(--border-strong)' }}
        />

        {/* User */}
        <div className="flex items-center gap-2">
          <div className="text-right hidden sm:block">
            <p
              className="text-[13px] font-semibold leading-none mb-0.5"
              style={{ color: 'var(--text)' }}
            >
              김연구
            </p>
            <p
              className="text-[11px] leading-none"
              style={{ color: 'var(--primary)' }}
            >
              연구원
            </p>
          </div>
          {/* Avatar */}
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[13px] font-bold"
            style={{ background: 'linear-gradient(135deg, #5856D6, #007AFF)' }}
          >
            K
          </div>
        </div>
      </div>
    </header>
  );
}
