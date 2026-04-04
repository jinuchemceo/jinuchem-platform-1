'use client';

import { Bell, Sun, Moon, Search, ShoppingCart } from 'lucide-react';
import { useState } from 'react';

export function Topbar() {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.setAttribute('data-theme', isDark ? 'light' : 'dark');
  };

  return (
    <header className="sticky top-0 z-30 h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      {/* Search */}
      <div className="flex items-center flex-1 max-w-xl">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="search"
            placeholder="시약명, CAS번호, 분자식, 카탈로그번호 검색..."
            className="w-full pl-10 pr-4 h-9 border border-gray-200 rounded-lg bg-gray-50 text-sm focus:outline-none focus:border-blue-500 text-gray-900"
          />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-1.5 ml-4">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-50 transition-colors"
          aria-label="테마 전환"
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Cart */}
        <button className="relative w-9 h-9 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-50 transition-colors">
          <ShoppingCart size={18} />
          <span className="absolute -top-0.5 -right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white shadow-sm px-1">
            3
          </span>
        </button>

        {/* Notifications */}
        <button className="relative w-9 h-9 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-50 transition-colors">
          <Bell size={18} />
          <span className="absolute -top-0.5 -right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white shadow-sm px-1">
            3
          </span>
        </button>

        {/* User */}
        <div className="flex items-center gap-2 ml-2 pl-3 border-l border-gray-200">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
            K
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-900 leading-tight">김지누</span>
            <span className="text-[11px] text-blue-600 font-medium leading-tight">PI</span>
          </div>
        </div>
      </div>
    </header>
  );
}
