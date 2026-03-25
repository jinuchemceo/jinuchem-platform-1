'use client';

import { ReactNode } from 'react';

interface TableHeader {
  key: string;
  label: string;
  align?: 'left' | 'center' | 'right';
}

interface DataTableProps {
  headers: TableHeader[];
  children: ReactNode;
  title?: string;
  action?: ReactNode;
}

const alignClass: Record<string, string> = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
};

export function DataTable({ headers, children, title, action }: DataTableProps) {
  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl overflow-hidden">
      {/* Optional header row */}
      {(title || action) && (
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)]">
          {title && <h2 className="text-base font-semibold text-[var(--text)]">{title}</h2>}
          {action && <div>{action}</div>}
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-[var(--bg)]">
              {headers.map((header) => (
                <th
                  key={header.key}
                  className={`px-5 py-3 text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider ${
                    alignClass[header.align ?? 'left']
                  }`}
                >
                  {header.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {children}
          </tbody>
        </table>
      </div>
    </div>
  );
}
