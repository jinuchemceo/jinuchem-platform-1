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

        {/* Notifications */}
        <button className="relative w-9 h-9 flex items-center justify-center rounded-lg text-[var(--text-secondary)] hover:bg-gray-100 transition-colors">
          <Bell size={18} />
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
            5
          </span>
        </button>

        {/* User */}
        <div className="flex items-center gap-2 ml-2 pl-2 border-l border-[var(--border)]">
          <span className="text-sm font-medium text-[var(--text)]">관리자</span>
          <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-medium">
            시스템관리자
          </span>
          <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
            A
          </div>
        </div>
      </div>
    </header>
  );
}
