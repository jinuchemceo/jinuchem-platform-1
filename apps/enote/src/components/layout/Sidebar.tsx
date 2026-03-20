'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FlaskConical,
  List,
  FilePlus,
  BookOpen,
  FileText,
  Package,
  ClipboardList,
  ExternalLink,
  User,
  LogOut,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';

interface NavItem {
  label: string;
  href?: string;
  icon: React.ReactNode;
  external?: boolean;
  children?: { label: string; href: string }[];
}

const navItems: NavItem[] = [
  {
    label: '대시보드',
    href: '/dashboard',
    icon: <LayoutDashboard size={18} />,
  },
  {
    label: '실험 관리',
    icon: <FlaskConical size={18} />,
    children: [
      { label: '실험 목록', href: '/experiments' },
      { label: '새 실험', href: '/experiments?new=true' },
    ],
  },
  {
    label: '프로토콜',
    icon: <BookOpen size={18} />,
    children: [
      { label: '프로토콜 목록', href: '/protocols' },
      { label: '템플릿', href: '/protocols?tab=templates' },
    ],
  },
  {
    label: '시약장',
    href: '/lab-inventory',
    icon: <Package size={18} />,
  },
  {
    label: '사용 기록',
    href: '/usage',
    icon: <ClipboardList size={18} />,
  },
];

const SHOP_URL = 'http://localhost:3000';

export function Sidebar() {
  const pathname = usePathname();
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    '실험 관리': true,
    '프로토콜': false,
  });

  const toggleGroup = (label: string) => {
    setOpenGroups((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const isActivePath = (href: string) => {
    const basePath = href.split('?')[0];
    return pathname === basePath;
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
                ? 'text-teal-600 font-semibold'
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
                      ? 'bg-teal-50 text-teal-600 font-semibold'
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
            ? 'bg-teal-50 text-teal-600 font-semibold'
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
          <span className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center text-white text-sm font-bold">
            E
          </span>
          <span>
            JINU <span className="text-teal-600">E-Note</span>
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {navItems.map(renderNavItem)}

        {/* Divider */}
        <div className="border-t border-[var(--border)] my-3" />

        {/* JINU Shop 바로가기 */}
        <a
          href={SHOP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-4 py-2.5 text-sm rounded-lg text-[var(--sidebar-text)] hover:bg-gray-100 transition-colors"
        >
          <ExternalLink size={18} />
          <span className="flex-1">JINU Shop 바로가기</span>
          <ExternalLink size={12} className="text-[var(--text-secondary)]" />
        </a>
      </nav>

      {/* Bottom */}
      <div className="border-t border-[var(--border)] px-3 py-3 space-y-1">
        <Link
          href="/mypage"
          className={`flex items-center gap-3 px-4 py-2.5 text-sm rounded-lg transition-colors ${
            pathname === '/mypage'
              ? 'bg-teal-50 text-teal-600 font-semibold'
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
