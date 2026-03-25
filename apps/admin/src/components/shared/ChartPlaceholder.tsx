'use client';

interface ChartPlaceholderProps {
  title: string;
  height?: string;
}

export function ChartPlaceholder({ title, height = 'h-48' }: ChartPlaceholderProps) {
  return (
    <div className={`${height} bg-[var(--bg)] rounded-lg flex items-center justify-center border border-dashed border-[var(--border)]`}>
      <span className="text-sm text-[var(--text-secondary)]">{title}</span>
    </div>
  );
}
