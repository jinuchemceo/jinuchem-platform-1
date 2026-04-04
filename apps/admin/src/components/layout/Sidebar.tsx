'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Truck,
  Package,
  BrainCircuit,
  KeyRound,
  Database,
  Settings,
  LogOut,
  Megaphone,
  ShoppingCart,
  Tag,
  UserCircle,
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
    title: '현황',
    items: [
      { label: '대시보드', href: '/dashboard', icon: <LayoutDashboard size={16} /> },
    ],
  },
  {
    title: '커머스',
    items: [
      { label: 'Shop 주문 관리', href: '/orders-mgmt', icon: <ShoppingCart size={16} /> },
      { label: '프로모션 관리', href: '/promotions', icon: <Tag size={16} /> },
      { label: '고객 관리', href: '/customers', icon: <Users size={16} /> },
      { label: '공급자 관리', href: '/suppliers-mgmt', icon: <Truck size={16} /> },
      { label: '제품 관리', href: '/products', icon: <Package size={16} /> },
    ],
  },
  {
    title: '플랫폼',
    items: [
      { label: 'AI 모니터링', href: '/ai-monitor', icon: <BrainCircuit size={16} /> },
      { label: 'API 관리', href: '/api-management', icon: <KeyRound size={16} /> },
      { label: '게시판 관리', href: '/board', icon: <Megaphone size={16} /> },
      { label: '데이터 파이프라인', href: '/data-pipeline', icon: <Database size={16} /> },
      { label: '설정', href: '/settings', icon: <Settings size={16} /> },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + '/');

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
            JINU
          </span>
          <span className="text-[20px] font-light tracking-tight" style={{ color: '#64748b', letterSpacing: '-0.5px' }}>
            admin
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3">
        {navGroups.map((group, gi) => (
          <div key={group.title}>
            {gi > 0 && (
              <div style={{ height: 1, background: 'var(--border)', margin: '6px 20px' }} />
            )}
            <div
              className="px-5 py-1.5 text-[11px] font-semibold tracking-wider uppercase"
              style={{ color: 'var(--text-tertiary)' }}
            >
              {group.title}
            </div>
            <div>
              {group.items.map(renderItem)}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom */}
      <div style={{ borderTop: '1px solid var(--border)', padding: '8px 0' }}>
        <Link
          href="/mypage"
          className="flex items-center gap-2.5 px-5 transition-colors"
          style={{
            height: 38,
            color: isActive('/mypage') ? 'var(--primary)' : '#64748b',
            fontSize: 13.5,
            textDecoration: 'none',
            background: isActive('/mypage') ? 'var(--primary-light)' : 'transparent',
          }}
        >
          <UserCircle size={16} style={{ color: '#94a3b8' }} />
          마이페이지
        </Link>
        <button
          className="flex items-center gap-2.5 px-5 w-full"
          style={{ height: 38, color: 'var(--danger)', fontSize: 13.5, border: 'none', background: 'transparent', cursor: 'pointer' }}
        >
          <LogOut size={16} style={{ color: 'var(--danger)' }} />
          로그아웃
        </button>
      </div>
    </aside>
  );
}
