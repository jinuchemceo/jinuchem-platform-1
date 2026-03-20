'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ShoppingCart,
  Zap,
  ClipboardList,
  CreditCard,
  RotateCcw,
  FileText,
  Heart,
  FlaskConical,
  MessageCircle,
  Headphones,
  HelpCircle,
  Mail,
  User,
  LogOut,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';

interface NavItem {
  label: string;
  href?: string;
  icon: React.ReactNode;
  children?: { label: string; href: string }[];
}

const navItems: NavItem[] = [
  {
    label: '제품 주문',
    icon: <ShoppingCart size={18} />,
    children: [
      { label: '시약 주문', href: '/order' },
      { label: '소모품 주문', href: '/supplies' },
    ],
  },
  { label: '빠른 주문', href: '/quickorder', icon: <Zap size={18} /> },
  {
    label: '주문 관리',
    icon: <ClipboardList size={18} />,
    children: [
      { label: '주문 내역', href: '/orders' },
      { label: '결제하기', href: '/approvals' },
      { label: '취소/반품 내역', href: '/cancel' },
    ],
  },
  { label: '증빙서류', href: '/documents', icon: <FileText size={18} /> },
];

const labItems: NavItem[] = [
  {
    label: '내 연구실',
    icon: <FlaskConical size={18} />,
    children: [
      { label: '즐겨찾기', href: '/favorites' },
      { label: '내 시약장', href: '/inventory' },
    ],
  },
  { label: '대화', href: '/chat', icon: <MessageCircle size={18} /> },
  {
    label: '고객센터',
    icon: <Headphones size={18} />,
    children: [
      { label: '고객센터 홈', href: '/cs' },
      { label: '자주 묻는 질문', href: '/faq' },
      { label: '1:1 문의하기', href: '/inquiry' },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    '제품 주문': true,
    '주문 관리': false,
    '내 연구실': false,
    '고객센터': false,
  });

  const toggleGroup = (label: string) => {
    setOpenGroups((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const renderNavItem = (item: NavItem) => {
    if (item.children) {
      const isOpen = openGroups[item.label] ?? false;
      const isActive = item.children.some((child) => pathname === child.href);

      return (
        <div key={item.label}>
          <button
            onClick={() => toggleGroup(item.label)}
            className={`flex items-center w-full gap-3 px-4 py-2.5 text-sm rounded-lg transition-colors ${
              isActive
                ? 'text-blue-600 font-semibold'
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
                    pathname === child.href
                      ? 'bg-blue-50 text-blue-600 font-semibold'
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
          pathname === item.href
            ? 'bg-blue-50 text-blue-600 font-semibold'
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
          <span className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white text-sm font-bold">
            J
          </span>
          JINU Shop
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {navItems.map(renderNavItem)}

        {/* Divider */}
        <div className="border-t border-[var(--border)] my-3" />

        {labItems.map(renderNavItem)}
      </nav>

      {/* Bottom */}
      <div className="border-t border-[var(--border)] px-3 py-3 space-y-1">
        <Link
          href="/mypage"
          className={`flex items-center gap-3 px-4 py-2.5 text-sm rounded-lg transition-colors ${
            pathname === '/mypage'
              ? 'bg-blue-50 text-blue-600 font-semibold'
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
