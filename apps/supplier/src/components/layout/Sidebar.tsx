'use client';

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
} from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    title: '관리',
    items: [
      { label: '대시보드', href: '/dashboard', icon: <LayoutDashboard size={16} /> },
      { label: '주문 관리', href: '/orders', icon: <ClipboardList size={16} /> },
      { label: '반품/취소', href: '/returns', icon: <RotateCcw size={16} /> },
      { label: '견적 관리', href: '/quotes', icon: <FileText size={16} /> },
    ],
  },
  {
    title: '상품',
    items: [
      { label: '상품 목록', href: '/products', icon: <Package size={16} /> },
      { label: '상품 등록', href: '/products/new', icon: <PlusCircle size={16} /> },
      { label: '재고 관리', href: '/products?tab=inventory', icon: <Warehouse size={16} /> },
      { label: '가격/프로모션', href: '/products?tab=price', icon: <Tag size={16} /> },
    ],
  },
  {
    title: '운영',
    items: [
      { label: '정산 관리', href: '/settlement', icon: <DollarSign size={16} /> },
      { label: '고객 관리', href: '/customers', icon: <Users size={16} /> },
      { label: '통계/분석', href: '/analytics', icon: <BarChart3 size={16} /> },
      { label: '알림 센터', href: '/notifications', icon: <Bell size={16} /> },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    const basePath = href.split('?')[0];
    return pathname === basePath || pathname.startsWith(basePath + '/');
  };

  const renderItem = (item: NavItem) => {
    const active = isActive(item.href);
    return (
      <Link
        key={item.href}
        href={item.href}
        className="flex items-center gap-2.5 px-5 transition-colors"
        style={{
          height: 38,
          color: active ? 'var(--primary)' : 'var(--sidebar-text)',
          fontWeight: active ? 600 : 400,
          fontSize: 13.5,
          textDecoration: 'none',
          background: active ? 'var(--primary-light)' : 'transparent',
        }}
        onMouseEnter={(e) => {
          if (!active) (e.currentTarget as HTMLElement).style.background = 'var(--bg-secondary)';
        }}
        onMouseLeave={(e) => {
          if (!active) (e.currentTarget as HTMLElement).style.background = 'transparent';
        }}
      >
        <span style={{ color: active ? 'var(--primary)' : '#94a3b8', display: 'flex' }}>
          {item.icon}
        </span>
        {item.label}
      </Link>
    );
  };

  return (
    <aside
      className="fixed top-0 left-0 h-screen flex flex-col z-40"
      style={{
        width: 'var(--sidebar-width)',
        background: 'var(--sidebar-bg)',
        borderRight: '1px solid var(--border)',
      }}
    >
      {/* Logo */}
      <div
        className="flex items-center px-4 shrink-0"
        style={{ height: 'var(--topbar-height)', borderBottom: '1px solid var(--border)' }}
      >
        <Link href="/dashboard" className="flex items-center gap-1" style={{ textDecoration: 'none' }}>
          <span className="text-[20px] font-extrabold tracking-tight" style={{ color: 'var(--text)', letterSpacing: '-0.5px' }}>
            Supplier
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3">
        {navGroups.map((group, gi) => (
          <div key={group.title}>
            {/* Section divider */}
            {gi > 0 && (
              <div style={{ height: 1, background: 'var(--border)', margin: '8px 20px' }} />
            )}
            {/* Section header */}
            <div
              className="px-5 py-1.5 text-[11px] font-semibold tracking-wider uppercase"
              style={{ color: 'var(--text-tertiary)' }}
            >
              {group.title}
            </div>
            {/* Items */}
            <div className="space-y-0.5">
              {group.items.map(renderItem)}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom */}
      <div style={{ borderTop: '1px solid var(--border)', padding: '8px 0' }}>
        {[
          { label: '마이페이지', href: '/mypage', icon: <User size={16} /> },
          { label: '회사 관리', href: '/settings', icon: <Settings size={16} /> },
        ].map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-2.5 px-5 transition-colors"
              style={{
                height: 38,
                color: active ? 'var(--primary)' : '#64748b',
                fontWeight: active ? 600 : 400,
                fontSize: 13.5,
                textDecoration: 'none',
                background: active ? 'var(--primary-light)' : 'transparent',
              }}
            >
              <span style={{ color: '#94a3b8', display: 'flex' }}>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
        <button
          className="flex items-center gap-2.5 px-5 w-full transition-colors"
          style={{ height: 38, color: 'var(--danger)', fontSize: 13.5, border: 'none', background: 'transparent', cursor: 'pointer' }}
        >
          <LogOut size={16} style={{ color: 'var(--danger)' }} />
          로그아웃
        </button>
      </div>
    </aside>
  );
}
