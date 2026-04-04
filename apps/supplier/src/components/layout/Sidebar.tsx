'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ClipboardList,
  RotateCcw,
  FileText,
  Package,
  PlusCircle,
  Warehouse,
  Tag,
  DollarSign,
  Users,
  BarChart3,
  Bell,
  Settings,
  LogOut,
  User,
  ChevronDown,
  ChevronRight,
  Zap,
} from 'lucide-react';

interface NavLeaf {
  label: string;
  href: string;
  icon?: React.ReactNode;
}

interface NavParent {
  label: string;
  icon: React.ReactNode;
  children: NavLeaf[];
}

type NavEntry = NavLeaf & { icon: React.ReactNode } | NavParent;

function isParent(e: NavEntry): e is NavParent {
  return 'children' in e;
}

interface NavSection {
  title: string;
  items: NavEntry[];
}

const sections: NavSection[] = [
  {
    title: '관리',
    items: [
      { label: '대시보드', href: '/dashboard', icon: <LayoutDashboard size={18} /> },
      {
        label: '주문 관리',
        icon: <ClipboardList size={18} />,
        children: [
          { label: '주문 목록', href: '/orders' },
          { label: '반품/취소', href: '/returns' },
        ],
      },
      { label: '견적 관리', href: '/quotes', icon: <FileText size={18} /> },
    ],
  },
  {
    title: '제품',
    items: [
      {
        label: '제품 관리',
        icon: <Package size={18} />,
        children: [
          { label: '제품 목록', href: '/products' },
          { label: '제품 등록', href: '/products/new' },
        ],
      },
      { label: '재고 관리', href: '/inventory', icon: <Warehouse size={18} /> },
      { label: '가격/프로모션', href: '/pricing', icon: <Tag size={18} /> },
    ],
  },
  {
    title: '운영',
    items: [
      { label: '정산 관리', href: '/settlement', icon: <DollarSign size={18} /> },
      { label: '고객 관리', href: '/customers', icon: <Users size={18} /> },
      { label: '통계/분석', href: '/analytics', icon: <BarChart3 size={18} /> },
      { label: '알림', href: '/notifications', icon: <Bell size={18} /> },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    '주문 관리': true,
    '제품 관리': true,
  });

  const isActive = (href: string) => {
    const base = href.split('?')[0];
    return pathname === base || pathname.startsWith(base + '/');
  };

  const toggle = (label: string) => {
    setOpenGroups(prev => ({ ...prev, [label]: !prev[label] }));
  };

  const itemStyle = (active: boolean) => ({
    height: 40,
    color: active ? 'var(--primary)' : 'var(--sidebar-text)',
    fontWeight: active ? 600 : 400,
    fontSize: 14,
    textDecoration: 'none' as const,
    background: active ? 'var(--primary-light)' : 'transparent',
  });

  return (
    <aside
      className="fixed top-0 left-0 h-screen flex flex-col z-40"
      style={{
        width: 'var(--sidebar-width)',
        background: 'var(--bg-card)',
        borderRight: '1px solid var(--border)',
      }}
    >
      {/* Logo */}
      <div
        className="flex items-center gap-2.5 px-5 shrink-0"
        style={{ height: 'var(--topbar-height)', borderBottom: '1px solid var(--border)' }}
      >
        <Link href="/dashboard" className="flex items-center gap-2.5" style={{ textDecoration: 'none' }}>
          <span className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold" style={{ background: '#AF52DE' }}>
            S
          </span>
          <span className="text-[17px] font-bold" style={{ color: 'var(--text)' }}>Supplier</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-2">
        {sections.map((section, si) => (
          <div key={section.title}>
            {si > 0 && <div style={{ height: 1, background: 'var(--border)', margin: '8px 16px' }} />}
            <div className="px-5 pt-3 pb-1 text-[11px] font-semibold tracking-wider" style={{ color: 'var(--text-tertiary)' }}>
              {section.title}
            </div>
            <div className="px-2">
              {section.items.map(entry => {
                if (isParent(entry)) {
                  const open = openGroups[entry.label] ?? false;
                  const childActive = entry.children.some(c => isActive(c.href));
                  return (
                    <div key={entry.label}>
                      <button
                        onClick={() => toggle(entry.label)}
                        className="flex items-center gap-2.5 w-full px-3 rounded-lg transition-colors"
                        style={{
                          height: 40,
                          color: childActive ? 'var(--primary)' : 'var(--sidebar-text)',
                          fontWeight: childActive ? 600 : 400,
                          fontSize: 14,
                          border: 'none',
                          background: 'transparent',
                          cursor: 'pointer',
                        }}
                        onMouseEnter={e => { if (!childActive) e.currentTarget.style.background = 'var(--bg-secondary)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                      >
                        <span style={{ color: childActive ? 'var(--primary)' : 'var(--text-tertiary)', display: 'flex' }}>
                          {entry.icon}
                        </span>
                        <span className="flex-1 text-left">{entry.label}</span>
                        {open ? <ChevronDown size={14} style={{ color: 'var(--text-tertiary)' }} /> : <ChevronRight size={14} style={{ color: 'var(--text-tertiary)' }} />}
                      </button>
                      {open && (
                        <div className="ml-[34px] space-y-0.5 pb-1">
                          {entry.children.map(child => {
                            const active = isActive(child.href);
                            return (
                              <Link
                                key={child.href}
                                href={child.href}
                                className="block px-3 py-1.5 rounded-lg transition-colors"
                                style={{
                                  fontSize: 13.5,
                                  color: active ? 'var(--primary)' : 'var(--text-secondary)',
                                  fontWeight: active ? 600 : 400,
                                  textDecoration: 'none',
                                  background: active ? 'var(--primary-light)' : 'transparent',
                                }}
                                onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'var(--bg-secondary)'; }}
                                onMouseLeave={e => { if (!active) e.currentTarget.style.background = active ? 'var(--primary-light)' : 'transparent'; }}
                              >
                                {child.label}
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                }

                // Leaf item
                const leaf = entry as NavLeaf & { icon: React.ReactNode };
                const active = isActive(leaf.href);
                return (
                  <Link
                    key={leaf.href}
                    href={leaf.href}
                    className="flex items-center gap-2.5 px-3 rounded-lg transition-colors"
                    style={itemStyle(active)}
                    onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'var(--bg-secondary)'; }}
                    onMouseLeave={e => { if (!active) e.currentTarget.style.background = active ? 'var(--primary-light)' : 'transparent'; }}
                  >
                    <span style={{ color: active ? 'var(--primary)' : 'var(--text-tertiary)', display: 'flex' }}>
                      {leaf.icon}
                    </span>
                    {leaf.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom */}
      <div className="px-2 py-2" style={{ borderTop: '1px solid var(--border)' }}>
        {[
          { label: '마이페이지', href: '/mypage', icon: <User size={18} /> },
          { label: '회사 관리', href: '/settings', icon: <Settings size={18} /> },
        ].map(item => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-2.5 px-3 rounded-lg transition-colors"
              style={itemStyle(active)}
              onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'var(--bg-secondary)'; }}
              onMouseLeave={e => { if (!active) e.currentTarget.style.background = active ? 'var(--primary-light)' : 'transparent'; }}
            >
              <span style={{ color: active ? 'var(--primary)' : 'var(--text-tertiary)', display: 'flex' }}>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
        <button
          className="flex items-center gap-2.5 px-3 rounded-lg w-full transition-colors"
          style={{ height: 40, color: 'var(--danger)', fontSize: 14, border: 'none', background: 'transparent', cursor: 'pointer' }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,59,48,0.06)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
        >
          <LogOut size={18} />
          로그아웃
        </button>
      </div>
    </aside>
  );
}
