'use client';

import { useState } from 'react';
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

const navItems: NavItem[] = [
  { label: '대시보드', href: '/dashboard', icon: <LayoutDashboard size={18} /> },
  { label: 'Shop 주문 관리', href: '/orders-mgmt', icon: <ShoppingCart size={18} /> },
  { label: '프로모션 관리', href: '/promotions', icon: <Tag size={18} /> },
  { label: '고객 관리', href: '/customers', icon: <Users size={18} /> },
  { label: '공급자 관리', href: '/suppliers-mgmt', icon: <Truck size={18} /> },
  { label: '제품 관리', href: '/products', icon: <Package size={18} /> },
  { label: 'AI 모니터링', href: '/ai-monitor', icon: <BrainCircuit size={18} /> },
  { label: 'API 관리', href: '/api-management', icon: <KeyRound size={18} /> },
  { label: '게시판 관리', href: '/board', icon: <Megaphone size={18} /> },
  { label: '데이터 파이프라인', href: '/data-pipeline', icon: <Database size={18} /> },
  { label: '설정', href: '/settings', icon: <Settings size={18} /> },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="fixed top-0 left-0 h-screen bg-[var(--sidebar-bg)] border-r border-[var(--border)] flex flex-col z-40"
      style={{ width: 'var(--sidebar-width)' }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 h-14 border-b border-[var(--border)]">
        <Link href="/dashboard" className="flex items-center gap-2 text-lg font-bold text-[var(--text)]">
          <span className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center text-white text-sm font-bold">
            J
          </span>
          JINU Admin
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-4 py-2.5 text-sm rounded-lg transition-colors ${
              pathname === item.href
                ? 'bg-orange-50 text-orange-600 font-semibold'
                : 'text-[var(--sidebar-text)] hover:bg-gray-100'
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* Bottom */}
      <div className="border-t border-[var(--border)] px-3 py-3 space-y-1">
        <Link
          href="/mypage"
          className={`flex items-center gap-3 px-4 py-2.5 text-sm rounded-lg transition-colors ${
            pathname === '/mypage'
              ? 'bg-orange-50 text-orange-600 font-semibold'
              : 'text-[var(--sidebar-text)] hover:bg-gray-100'
          }`}
        >
          <UserCircle size={18} />
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
