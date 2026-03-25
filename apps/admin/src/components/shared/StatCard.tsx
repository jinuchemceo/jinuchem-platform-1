'use client';

import { ReactNode } from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: string;
  change: string;
  up: boolean;
  prefix?: string;
}

export function StatCard({ icon, label, value, change, up, prefix }: StatCardProps) {
  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center text-orange-600">
          {icon}
        </div>
        <div className={`flex items-center gap-1 text-xs font-medium ${up ? 'text-emerald-600' : 'text-red-500'}`}>
          {up ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          {change}
        </div>
      </div>
      <div className="text-2xl font-bold text-[var(--text)]">
        {prefix}{value}
      </div>
      <div className="text-xs text-[var(--text-secondary)] mt-1">{label}</div>
    </div>
  );
}
