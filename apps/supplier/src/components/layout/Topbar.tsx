'use client';

import { Bell, Sun, Moon } from 'lucide-react';
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
        background: isDark ? 'rgba(28,28,30,0.85)' : 'rgba(255,255,255,0.82)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <div className="flex items-center gap-1">
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
          <span
            className="absolute -top-0.5 -right-0.5 flex items-center justify-center text-white rounded-full"
            style={{ background: 'var(--danger)', fontSize: 10, fontWeight: 700, width: 18, height: 18 }}
          >
            4
          </span>
        </button>

        {/* Divider */}
        <span className="w-px h-5 mx-1" style={{ background: 'var(--border)' }} />

        {/* User */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1.5">
            <span
              className="text-[13px] font-semibold"
              style={{ color: 'var(--text)' }}
            >
              Sigma-Aldrich
            </span>
            <span
              className="text-[11px] font-medium px-1.5 py-0.5 rounded-md"
              style={{ color: 'var(--success)', background: 'rgba(52,199,89,0.12)' }}
            >
              공급사
            </span>
          </div>
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[13px] font-bold"
            style={{ background: 'linear-gradient(135deg, #AF52DE, #8B5CF6)' }}
          >
            S
          </div>
        </div>
      </div>
    </header>
  );
}
