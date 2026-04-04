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
      { label: '대시보드', href: '/dashboard', icon: <LayoutDashboard size={22} strokeWidth={1.5} /> },
      { label: '주문 관리', href: '/orders', icon: <ClipboardList size={22} strokeWidth={1.5} /> },
      { label: '반품/취소', href: '/returns', icon: <RotateCcw size={22} strokeWidth={1.5} /> },
      { label: '견적 관리', href: '/quotes', icon: <FileText size={22} strokeWidth={1.5} /> },
    ],
  },
  {
    title: '상품',
    items: [
      { label: '상품 목록', href: '/products', icon: <Package size={22} strokeWidth={1.5} /> },
      { label: '상품 등록', href: '/products/new', icon: <PlusCircle size={22} strokeWidth={1.5} /> },
      { label: '재고 관리', href: '/products?tab=inventory', icon: <Warehouse size={22} strokeWidth={1.5} /> },
      { label: '가격/프로모션', href: '/products?tab=price', icon: <Tag size={22} strokeWidth={1.5} /> },
    ],
  },
  {
    title: '운영',
    items: [
      { label: '정산 관리', href: '/settlement', icon: <DollarSign size={22} strokeWidth={1.5} /> },
      { label: '고객 관리', href: '/customers', icon: <Users size={22} strokeWidth={1.5} /> },
      { label: '통계/분석', href: '/analytics', icon: <BarChart3 size={22} strokeWidth={1.5} /> },
      { label: '알림 센터', href: '/notifications', icon: <Bell size={22} strokeWidth={1.5} /> },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    const basePath = href.split('?')[0];
    return pathname === basePath || pathname.startsWith(basePath + '/');
  };

  return (
    <aside
      className="fixed top-0 left-0 h-screen flex flex-col z-40 overflow-y-auto"
      style={{
        width: 'var(--sidebar-width)',
        background: 'var(--bg-card)',
        borderRight: '0.5px solid var(--border)',
      }}
    >
      {/* Logo */}
      <div
        className="flex items-center gap-2.5 px-5 shrink-0"
        style={{ height: 'var(--topbar-height)', borderBottom: '0.5px solid var(--border)' }}
      >
        <Link href="/dashboard" className="flex items-center gap-2.5 font-bold" style={{ color: 'var(--text)', textDecoration: 'none', fontSize: 17 }}>
          <span className="w-8 h-8 bg-gradient-to-br from-blue-500 to-violet-600 rounded-lg flex items-center justify-center text-white text-sm font-bold">
            S
          </span>
          Supplier
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-3 overflow-y-auto">
        {navGroups.map((group) => (
          <div key={group.title} className="mb-1">
            <div className="px-5 py-1.5 text-[11px] font-semibold tracking-wider uppercase" style={{ color: 'var(--text-tertiary)' }}>
              {group.title}
            </div>
            {group.items.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3.5 mx-2 px-3.5 py-2.5 rounded-xl transition-all"
                  style={{
                    color: active ? 'var(--text)' : 'var(--text-secondary)',
                    fontWeight: active ? 600 : 400,
                    fontSize: 14,
                    textDecoration: 'none',
                    background: active ? 'var(--primary-light)' : 'transparent',
                  }}
                >
                  <span className="flex items-center justify-center w-6" style={{ color: active ? 'var(--primary)' : 'var(--text-secondary)' }}>
                    {item.icon}
                  </span>
                  {item.label}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Bottom */}
      <div className="shrink-0 py-2" style={{ borderTop: '0.5px solid var(--border)' }}>
        {[
          { label: '마이페이지', href: '/mypage', icon: <User size={22} strokeWidth={1.5} /> },
          { label: '회사 관리', href: '/settings', icon: <Settings size={22} strokeWidth={1.5} /> },
        ].map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3.5 mx-2 px-3.5 py-2.5 rounded-xl transition-all"
              style={{
                color: active ? 'var(--text)' : 'var(--text-secondary)',
                fontWeight: active ? 600 : 400,
                fontSize: 14,
                textDecoration: 'none',
                background: active ? 'var(--primary-light)' : 'transparent',
              }}
            >
              <span className="flex items-center justify-center w-6" style={{ color: active ? 'var(--primary)' : 'var(--text-secondary)' }}>
                {item.icon}
              </span>
              {item.label}
            </Link>
          );
        })}
        <button
          className="flex items-center gap-3.5 mx-2 px-3.5 py-2.5 rounded-xl w-[calc(100%-16px)] transition-all"
          style={{ color: 'var(--danger)', fontSize: 14, border: 'none', background: 'transparent', cursor: 'pointer' }}
        >
          <span className="flex items-center justify-center w-6">
            <LogOut size={22} strokeWidth={1.5} />
          </span>
          로그아웃
        </button>
      </div>
    </aside>
  );
}
