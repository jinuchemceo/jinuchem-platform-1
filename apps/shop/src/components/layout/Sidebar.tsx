'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ShoppingCart,
  Zap,
  ClipboardList,
  FileText,
  FlaskConical,
  MessageCircle,
  Headphones,
  User,
  LogOut,
  ChevronRight,
  ChevronDown,
  Bell,
} from 'lucide-react';

interface NavItem {
  label: string;
  href?: string;
  icon: React.ReactNode;
  children?: { label: string; href: string }[];
}

const navGroups: { title: string; items: NavItem[] }[] = [
  {
    title: '주문',
    items: [
      {
        label: '제품 주문',
        icon: <ShoppingCart size={17} />,
        children: [
          { label: '시약 주문', href: '/order' },
          { label: '소모품 주문', href: '/supplies' },
        ],
      },
      { label: '빠른 주문', href: '/quickorder', icon: <Zap size={17} /> },
    ],
  },
  {
    title: '관리',
    items: [
      {
        label: '주문 관리',
        icon: <ClipboardList size={17} />,
        children: [
          { label: '주문 내역', href: '/orders' },
          { label: '결제하기', href: '/approvals' },
          { label: '취소 내역', href: '/cancel' },
        ],
      },
      { label: '증빙서류', href: '/documents', icon: <FileText size={17} /> },
    ],
  },
  {
    title: '연구실',
    items: [
      {
        label: '내 연구실',
        icon: <FlaskConical size={17} />,
        children: [
          { label: '즐겨찾기', href: '/favorites' },
          { label: '내 시약장', href: '/inventory' },
          { label: '실험실 멤버', href: '/members' },
        ],
      },
      { label: '대화', href: '/chat', icon: <MessageCircle size={17} /> },
      { label: '알림', href: '/notifications', icon: <Bell size={17} /> },
    ],
  },
  {
    title: '지원',
    items: [
      {
        label: '고객센터',
        icon: <Headphones size={17} />,
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

  const toggleGroup = (label: string) => {
    setOpenGroups((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const renderItem = (item: NavItem) => {
    if (item.children) {
      const isOpen = openGroups[item.label] ?? false;
      const isActive = item.children.some((c) => pathname === c.href);

      return (
        <div key={item.label}>
          <button
            onClick={() => toggleGroup(item.label)}
            className="flex items-center w-full gap-3 px-4 py-2.5 rounded-lg transition-colors"
            style={{
              color: isActive ? 'var(--primary)' : 'var(--sidebar-text)',
            }}
          >
            <span className="flex-shrink-0" style={{ color: isActive ? 'var(--primary)' : 'var(--text-secondary)' }}>
              {item.icon}
            </span>
            <span className="flex-1 text-left text-[14px]">{item.label}</span>
            <ChevronDown
              size={13}
              style={{
                color: 'var(--text-tertiary)',
                transform: isOpen ? 'rotate(0deg)' : 'rotate(-90deg)',
                transition: 'transform 0.2s',
              }}
            />
          </button>

          {isOpen && (
            <div className="ml-9 mt-0.5 space-y-0.5">
              {item.children.map((child) => (
                <Link
                  key={child.href}
                  href={child.href}
                  className="flex items-center justify-between px-3 py-2 rounded-lg text-[13px] transition-colors"
                  style={{
                    color: pathname === child.href ? 'var(--primary)' : 'var(--sidebar-text)',
                    fontWeight: pathname === child.href ? 600 : 400,
                    background: pathname === child.href ? 'var(--primary-light)' : 'transparent',
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
        className="flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors"
        style={{
          color: pathname === item.href ? 'var(--primary)' : 'var(--sidebar-text)',
          background: pathname === item.href ? 'var(--primary-light)' : 'transparent',
        }}
      >
        <span style={{ color: pathname === item.href ? 'var(--primary)' : 'var(--text-secondary)' }}>
          {item.icon}
        </span>
        <span className="text-[14px]">{item.label}</span>
      </Link>
    );
  };

  return (
    <aside
      className="fixed top-0 left-0 h-screen flex flex-col z-40"
      style={{
        width: 'var(--sidebar-width)',
        background: 'var(--sidebar-bg)',
        borderRight: '0.5px solid var(--border)',
      }}
    >
      {/* Logo */}
      <div
        className="flex items-center gap-3 px-5 shrink-0"
        style={{
          height: 'var(--topbar-height)',
          borderBottom: '0.5px solid var(--border)',
        }}
      >
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <span
            className="w-8 h-8 flex items-center justify-center text-white text-sm font-bold"
            style={{ background: 'var(--primary)', borderRadius: 9 }}
          >
            J
          </span>
          <span className="text-[17px] font-bold tracking-tight" style={{ color: 'var(--text)' }}>
            JINU Shop
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-4">
        {navGroups.map((group) => (
          <div key={group.title}>
            <p className="ios-section-header px-1 mb-1">{group.title}</p>
            <div className="space-y-0.5">
              {group.items.map((item) => renderItem(item))}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom */}
      <div
        className="shrink-0 px-3 py-3 space-y-0.5"
        style={{ borderTop: '0.5px solid var(--border)' }}
      >
        <Link
          href="/mypage"
          className="flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors"
          style={{
            color: pathname === '/mypage' ? 'var(--primary)' : 'var(--sidebar-text)',
            background: pathname === '/mypage' ? 'var(--primary-light)' : 'transparent',
          }}
        >
          <User size={17} style={{ color: 'var(--text-secondary)' }} />
          <span className="text-[14px]">마이페이지</span>
        </Link>

        <button
          onClick={async () => {
            await fetch('/api/auth/logout', { method: 'POST' });
            window.location.href = '/login';
          }}
          className="flex items-center gap-3 px-4 py-2.5 rounded-lg w-full transition-colors"
          style={{ color: 'var(--danger)' }}
        >
          <LogOut size={17} style={{ color: 'var(--danger)' }} />
          <span className="text-[14px]">로그아웃</span>
        </button>
      </div>
    </aside>
  );
}
