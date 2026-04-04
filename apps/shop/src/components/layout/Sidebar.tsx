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
  Bell,
} from 'lucide-react';

interface NavItem {
  label: string;
  href?: string;
  icon: React.ReactNode;
  children?: { label: string; href: string }[];
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    title: '주문',
    items: [
      {
        label: '제품 주문',
        icon: <ShoppingCart size={16} strokeWidth={1.5} />,
        children: [
          { label: '시약 주문', href: '/order' },
          { label: '소모품 주문', href: '/supplies' },
        ],
      },
      { label: '빠른 주문', href: '/quickorder', icon: <Zap size={16} strokeWidth={1.5} /> },
    ],
  },
  {
    title: '관리',
    items: [
      {
        label: '주문 관리',
        icon: <ClipboardList size={16} strokeWidth={1.5} />,
        children: [
          { label: '주문 내역', href: '/orders' },
          { label: '결제하기', href: '/approvals' },
          { label: '취소 내역', href: '/cancel' },
        ],
      },
      { label: '증빙서류', href: '/documents', icon: <FileText size={16} strokeWidth={1.5} /> },
    ],
  },
  {
    title: '연구실',
    items: [
      {
        label: '내 연구실',
        icon: <FlaskConical size={16} strokeWidth={1.5} />,
        children: [
          { label: '즐겨찾기', href: '/favorites' },
          { label: '내 시약장', href: '/inventory' },
          { label: '실험실 멤버', href: '/members' },
        ],
      },
      { label: '대화', href: '/chat', icon: <MessageCircle size={16} strokeWidth={1.5} /> },
      { label: '알림', href: '/notifications', icon: <Bell size={16} strokeWidth={1.5} /> },
    ],
  },
  {
    title: '지원',
    items: [
      {
        label: '고객센터',
        icon: <Headphones size={16} strokeWidth={1.5} />,
        children: [
          { label: '고객센터 홈', href: '/cs' },
          { label: '자주 묻는 질문', href: '/faq' },
          { label: '1:1 문의하기', href: '/inquiry' },
          { label: 'MSDS 검색', href: '/msds' },
        ],
      },
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

  const toggle = (label: string) =>
    setOpenGroups((prev) => ({ ...prev, [label]: !prev[label] }));

  const renderItem = (item: NavItem) => {
    if (item.children) {
      const isOpen = openGroups[item.label] ?? false;
      const isActive = item.children.some((c) => pathname === c.href);

      return (
        <div key={item.label}>
          <button
            onClick={() => toggle(item.label)}
            className="flex items-center w-full gap-3.5 mx-2 px-3.5 py-2.5 rounded-xl transition-all"
            style={{
              color: isActive ? 'var(--text)' : 'var(--text-secondary)',
              fontWeight: isActive ? 600 : 400,
              fontSize: 14,
              background: isActive ? 'var(--primary-light)' : 'transparent',
              border: 'none',
              cursor: 'pointer',
              width: 'calc(100% - 16px)',
            }}
          >
            <span className="flex items-center justify-center w-6" style={{ color: isActive ? 'var(--primary)' : 'var(--text-secondary)' }}>
              {item.icon}
            </span>
            <span className="flex-1 text-left">{item.label}</span>
            <ChevronDown
              size={13}
              style={{
                color: 'var(--text-secondary)',
                transform: isOpen ? 'rotate(0deg)' : 'rotate(-90deg)',
                transition: 'transform 0.18s',
              }}
            />
          </button>

          {isOpen && (
            <div className="ml-6">
              {item.children.map((child) => (
                <Link
                  key={child.href}
                  href={child.href}
                  className="flex items-center gap-3.5 mx-2 px-3.5 py-2.5 rounded-xl transition-all"
                  style={{
                    fontSize: 13,
                    color: pathname === child.href ? 'var(--text)' : 'var(--text-secondary)',
                    fontWeight: pathname === child.href ? 600 : 400,
                    background: pathname === child.href ? 'var(--primary-light)' : 'transparent',
                    textDecoration: 'none',
                    display: 'flex',
                  }}
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
        className="flex items-center gap-3.5 mx-2 px-3.5 py-2.5 rounded-xl transition-all"
        style={{
          color: pathname === item.href ? 'var(--text)' : 'var(--text-secondary)',
          fontWeight: pathname === item.href ? 600 : 400,
          fontSize: 14,
          background: pathname === item.href ? 'var(--primary-light)' : 'transparent',
          textDecoration: 'none',
        }}
      >
        <span className="flex items-center justify-center w-6" style={{ color: pathname === item.href ? 'var(--primary)' : 'var(--text-secondary)' }}>
          {item.icon}
        </span>
        {item.label}
      </Link>
    );
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
            J
          </span>
          JINU Shop
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-3 overflow-y-auto">
        {navGroups.map((group, gi) => (
          <div key={group.title} className="mb-1">
            {gi > 0 && (
              <div style={{ height: 1, background: 'var(--border)', margin: '4px 20px 8px' }} />
            )}
            <div className="px-5 py-1.5 text-[11px] font-semibold tracking-wider uppercase" style={{ color: 'var(--text-tertiary)' }}>
              {group.title}
            </div>
            {group.items.map((item) => renderItem(item))}
          </div>
        ))}
      </nav>

      {/* Bottom */}
      <div className="shrink-0 py-2" style={{ borderTop: '0.5px solid var(--border)' }}>
        {[
          { label: '마이페이지', href: '/mypage', icon: <User size={16} strokeWidth={1.5} /> },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-3.5 mx-2 px-3.5 py-2.5 rounded-xl transition-all"
            style={{
              color: pathname === item.href ? 'var(--text)' : 'var(--text-secondary)',
              fontWeight: pathname === item.href ? 600 : 400,
              fontSize: 14,
              textDecoration: 'none',
              background: pathname === item.href ? 'var(--primary-light)' : 'transparent',
            }}
          >
            <span className="flex items-center justify-center w-6" style={{ color: 'var(--text-secondary)' }}>
              {item.icon}
            </span>
            {item.label}
          </Link>
        ))}
        <button
          onClick={async () => {
            await fetch('/api/auth/logout', { method: 'POST' });
            window.location.href = '/login';
          }}
          className="flex items-center gap-3.5 mx-2 px-3.5 py-2.5 rounded-xl w-[calc(100%-16px)] transition-all"
          style={{ color: 'var(--danger)', fontSize: 14, border: 'none', background: 'transparent', cursor: 'pointer' }}
        >
          <span className="flex items-center justify-center w-6">
            <LogOut size={16} strokeWidth={1.5} />
          </span>
          로그아웃
        </button>
      </div>
    </aside>
  );
}
