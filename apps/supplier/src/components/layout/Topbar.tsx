'use client';

import { Bell, Sun, Moon, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export function Topbar() {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.setAttribute('data-theme', isDark ? 'light' : 'dark');
  };

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
      <div className="flex items-center gap-2">
        {/* JINU Shop */}
        <Link
          href="http://localhost:3000"
          target="_blank"
          className="flex items-center gap-1.5 px-3 text-xs font-semibold rounded-full transition-colors"
          style={{
            height: 32,
            color: 'var(--primary)',
            background: 'var(--primary-light)',
            textDecoration: 'none',
          }}
        >
          <ExternalLink size={14} />
          JINU Shop
        </Link>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="w-9 h-9 flex items-center justify-center rounded-full transition-colors"
          style={{ color: 'var(--text-secondary)' }}
          aria-label="테마 전환"
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Notifications */}
        <button
          className="relative w-9 h-9 flex items-center justify-center rounded-full transition-colors"
          style={{ color: 'var(--text-secondary)' }}
        >
          <Bell size={18} />
          <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 text-white text-[10px] font-bold rounded-full flex items-center justify-center"
            style={{ background: 'var(--danger)', minWidth: '18px', height: '18px' }}>
            4
          </span>
        </button>

        {/* Divider */}
        <div className="w-px h-5 mx-1" style={{ background: 'var(--border)' }} />

        {/* User */}
        <div className="flex items-center gap-2.5 cursor-pointer">
          <div>
            <span className="text-sm font-medium" style={{ color: 'var(--text)' }}>Sigma-Aldrich</span>
            <span className="ml-1.5 text-[11px] font-semibold px-2 py-0.5 rounded-full"
              style={{ background: 'rgba(52,199,89,0.15)', color: '#34C759' }}>
              공급사
            </span>
          </div>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center text-white text-sm font-bold">
            S
          </div>
        </div>
      </div>
    </header>
  );
}
