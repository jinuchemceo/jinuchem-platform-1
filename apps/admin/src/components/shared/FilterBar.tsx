'use client';

import { ReactNode } from 'react';
import { Search } from 'lucide-react';

interface FilterBarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder: string;
  children?: ReactNode;
}

export function FilterBar({ searchValue, onSearchChange, searchPlaceholder, children }: FilterBarProps) {
  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-4">
      <div className="flex items-center gap-3 flex-wrap">
        {/* Search input */}
        <div className="relative flex-1 min-w-[240px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
          <input
            type="text"
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full h-[var(--btn-height)] pl-9 pr-4 text-sm bg-[var(--bg)] border border-[var(--border)] rounded-lg text-[var(--text)] placeholder:text-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
          />
        </div>

        {/* Additional filter controls */}
        {children}
      </div>
    </div>
  );
}
