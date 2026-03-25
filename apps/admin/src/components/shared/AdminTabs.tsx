'use client';

interface Tab {
  id: string;
  label: string;
  count?: number;
}

interface AdminTabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export function AdminTabs({ tabs, activeTab, onTabChange }: AdminTabsProps) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`px-4 h-[var(--btn-height)] text-sm font-medium rounded-full transition-colors ${
            activeTab === tab.id
              ? 'bg-orange-600 text-white'
              : 'bg-[var(--bg)] border border-[var(--border)] text-[var(--text-secondary)] hover:bg-gray-100'
          }`}
        >
          {tab.label}
          {tab.count !== undefined && (
            <span className={`ml-1.5 text-xs ${
              activeTab === tab.id ? 'text-orange-200' : 'text-[var(--text-secondary)]'
            }`}>
              {tab.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
