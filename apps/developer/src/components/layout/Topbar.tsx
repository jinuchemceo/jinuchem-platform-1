'use client';

import { Bell, Sun, Moon, ExternalLink } from 'lucide-react';
import { useState } from 'react';

export function Topbar() {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.setAttribute('data-theme', isDark ? 'light' : 'dark');
  };

  return (
    <header className="sticky top-0 z-30 h-14 bg-[var(--bg-card)] border-b border-[var(--border)] flex items-center justify-between px-6">
      {/* Left - Title */}
      <div className="flex items-center gap-3">
        <h2 className="text-sm font-medium text-[var(--text-secondary)]">JINUCHEM External API v1</h2>
        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">v1.0</span>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2 ml-4">
        {/* JINU Shop Link */}
        <a
          href="#"
          className="flex items-center gap-1.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text)] transition-colors"
        >
          JINU Shop
          <ExternalLink size={14} />
        </a>

        <div className="w-px h-5 bg-[var(--border)] mx-1" />

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="w-9 h-9 flex items-center justify-center rounded-lg text-[var(--text-secondary)] hover:bg-gray-100 transition-colors"
          aria-label="테마 전환"
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Notifications */}
        <button className="relative w-9 h-9 flex items-center justify-center rounded-lg text-[var(--text-secondary)] hover:bg-gray-100 transition-colors">
          <Bell size={18} />
        </button>

        {/* User */}
        <div className="flex items-center gap-2 ml-2 pl-2 border-l border-[var(--border)]">
          <span className="text-sm font-medium text-[var(--text)]">개발자</span>
          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
            Pro
          </span>
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
            D
          </div>
        </div>
      </div>
    </header>
  );
}
