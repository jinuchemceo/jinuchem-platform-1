'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  ClipboardList,
  Package,
  Settings,
  User,
  LogOut,
  ChevronDown,
  ChevronRight,
  RotateCcw,
  DollarSign,
  Users,
  MessageSquare,
  Star,
  BarChart3,
  Bell,
  ExternalLink,
} from 'lucide-react';

interface NavItem {
  label: string;
  href?: string;
  icon: React.ReactNode;
  children?: { label: string; href: string }[];
}

const navItems: NavItem[] = [
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
  {
    label: '상품 관리',
    icon: <Package size={18} />,
    children: [
      { label: '상품 목록', href: '/products?tab=list' },
      { label: '상품 등록', href: '/products/new' },
      { label: '재고 관리', href: '/products?tab=inventory' },
      { label: '가격/프로모션', href: '/products?tab=price' },
    ],
  },
  { label: '정산 관리', href: '/settlement', icon: <DollarSign size={18} /> },
  {
    label: '고객 관리',
    icon: <Users size={18} />,
    children: [
      { label: '문의 관리', href: '/customers?tab=inquiry' },
      { label: '리뷰 관리', href: '/customers?tab=review' },
      { label: '1:1 채팅', href: '/customers?tab=chat' },
    ],
  },
  {
    label: '통계/분석',
    icon: <BarChart3 size={18} />,
    children: [
      { label: '매출 분석', href: '/analytics?tab=sales' },
      { label: '주문 분석', href: '/analytics?tab=orders' },
      { label: '상품 분석', href: '/analytics?tab=products' },
      { label: '고객 분석', href: '/analytics?tab=customers' },
    ],
  },
  { label: '알림 센터', href: '/notifications', icon: <Bell size={18} /> },
  { label: '설정', href: '/settings', icon: <Settings size={18} /> },
];

export function Sidebar() {
  const pathname = usePathname();
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    '제품 관리': true,
  });

  const toggleGroup = (label: string) => {
    setOpenGroups((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const isActivePath = (href: string) => {
    const basePath = href.split('?')[0];
    return pathname === basePath || pathname.startsWith(basePath + '/');
  };

  const renderNavItem = (item: NavItem) => {
    if (item.children) {
      const isOpen = openGroups[item.label] ?? false;
      const isActive = item.children.some((child) => isActivePath(child.href));

      return (
        <div key={item.label}>
          <button
            onClick={() => toggleGroup(item.label)}
            className={`flex items-center w-full gap-3 px-4 py-2.5 text-sm rounded-lg transition-colors ${
              isActive
                ? 'text-purple-600 font-semibold'
                : 'text-[var(--sidebar-text)] hover:bg-gray-100'
            }`}
          >
            {item.icon}
            <span className="flex-1 text-left">{item.label}</span>
            {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>
          {isOpen && (
            <div className="ml-9 mt-0.5 space-y-0.5">
              {item.children.map((child) => (
                <Link
                  key={child.href}
                  href={child.href}
                  className={`block px-3 py-2 text-sm rounded-lg transition-colors ${
                    isActivePath(child.href)
                      ? 'bg-purple-50 text-purple-600 font-semibold'
                      : 'text-[var(--sidebar-text)] hover:bg-gray-100'
                  }`}
                >
                  {child.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      );
    }

    return (
      <Link
        key={item.href}
        href={item.href!}
        className={`flex items-center gap-3 px-4 py-2.5 text-sm rounded-lg transition-colors ${
          isActivePath(item.href!)
            ? 'bg-purple-50 text-purple-600 font-semibold'
            : 'text-[var(--sidebar-text)] hover:bg-gray-100'
        }`}
      >
        {item.icon}
        <span>{item.label}</span>
      </Link>
    );
  };

  return (
    <aside
      className="fixed top-0 left-0 h-screen bg-[var(--sidebar-bg)] border-r border-[var(--border)] flex flex-col z-40"
      style={{ width: 'var(--sidebar-width)' }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 h-14 border-b border-[var(--border)]">
        <Link href="/dashboard" className="flex items-center gap-2 text-lg font-bold text-[var(--text)]">
          <span className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center text-white text-sm font-bold">
            J
          </span>
          JINU Supplier
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {navItems.map(renderNavItem)}
      </nav>

      {/* Bottom */}
      <div className="border-t border-[var(--border)] px-3 py-3 space-y-1">
        <Link
          href="/mypage"
          className={`flex items-center gap-3 px-4 py-2.5 text-sm rounded-lg transition-colors ${
            pathname === '/mypage'
              ? 'bg-purple-50 text-purple-600 font-semibold'
              : 'text-[var(--sidebar-text)] hover:bg-gray-100'
          }`}
        >
          <User size={18} />
          <span>마이페이지</span>
        </Link>
        <button className="flex items-center gap-3 px-4 py-2.5 text-sm rounded-lg text-[var(--sidebar-text)] hover:bg-gray-100 w-full">
          <LogOut size={18} />
          <span>로그아웃</span>
        </button>
      </div>
    </aside>
  );
}
