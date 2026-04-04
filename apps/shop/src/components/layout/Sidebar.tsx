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
  HelpCircle,
  Mail,
  User,
  LogOut,
  ChevronDown,
  ChevronRight,
  Bell,
} from 'lucide-react';

interface NavItem {
  label: string;
  href?: string;
  icon: React.ReactNode;
  children?: { label: string; href: string }[];
}

const mainNav: NavItem[] = [
  {
    label: '제품 주문',
    icon: <ShoppingCart size={16} />,
    children: [
      { label: '시약 주문', href: '/order' },
      { label: '소모품 주문', href: '/supplies' },
    ],
  },
  { label: '빠른 주문', href: '/quickorder', icon: <Zap size={16} /> },
  {
    label: '주문 관리',
    icon: <ClipboardList size={16} />,
    children: [
      { label: '주문 내역', href: '/orders' },
      { label: '결제하기', href: '/approvals' },
      { label: '취소 내역', href: '/cancel' },
    ],
  },
  { label: '증빙서류', href: '/documents', icon: <FileText size={16} /> },
];

const labNav: NavItem[] = [
  {
    label: '내 연구실',
    icon: <FlaskConical size={16} />,
    children: [
      { label: '즐겨찾기', href: '/favorites' },
      { label: '내 시약장', href: '/inventory' },
      { label: '실험실 멤버', href: '/members' },
    ],
  },
  { label: '대화', href: '/chat', icon: <MessageCircle size={16} /> },
  { label: '알림', href: '/notifications', icon: <Bell size={16} /> },
  {
    label: '고객센터',
    icon: <Headphones size={16} />,
    children: [
      { label: '고객센터 홈', href: '/cs' },
      { label: '자주 묻는 질문', href: '/faq' },
      { label: '1:1 문의하기', href: '/inquiry' },
      { label: 'MSDS 검색', href: '/msds' },
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
            className="flex items-center w-full gap-2.5 px-5 transition-colors"
            style={{
              height: 38,
              color: isActive ? 'var(--primary)' : 'var(--sidebar-text)',
              background: 'transparent',
            }}
            onMouseEnter={(e) => {
              if (!isActive) (e.currentTarget as HTMLElement).style.background = 'var(--bg-secondary)';
            }}
            onMouseLeave={(e) => {
              if (!isActive) (e.currentTarget as HTMLElement).style.background = 'transparent';
            }}
          >
            <span style={{ color: isActive ? 'var(--primary)' : '#94a3b8', display: 'flex' }}>
              {item.icon}
            </span>
            <span className="flex-1 text-left text-[13.5px]">{item.label}</span>
            <ChevronDown
              size={13}
              style={{
                color: '#94a3b8',
                transform: isOpen ? 'rotate(0deg)' : 'rotate(-90deg)',
                transition: 'transform 0.18s',
              }}
            />
          </button>

          {isOpen && (
            <div>
              {item.children.map((child) => (
                <Link
                  key={child.href}
                  href={child.href}
                  className="flex items-center transition-colors"
                  style={{
                    height: 36,
                    paddingLeft: 48,
                    paddingRight: 20,
                    fontSize: 13,
                    color: pathname === child.href ? 'var(--primary)' : '#64748b',
                    fontWeight: pathname === child.href ? 600 : 400,
                    background: pathname === child.href ? 'var(--primary-light)' : 'transparent',
                  }}
                  onMouseEnter={(e) => {
                    if (pathname !== child.href)
                      (e.currentTarget as HTMLElement).style.background = 'var(--bg-secondary)';
                  }}
                  onMouseLeave={(e) => {
                    if (pathname !== child.href)
                      (e.currentTarget as HTMLElement).style.background = 'transparent';
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
        className="flex items-center gap-2.5 px-5 transition-colors"
        style={{
          height: 38,
          color: pathname === item.href ? 'var(--primary)' : 'var(--sidebar-text)',
          background: pathname === item.href ? 'var(--primary-light)' : 'transparent',
          fontWeight: pathname === item.href ? 600 : 400,
        }}
        onMouseEnter={(e) => {
          if (pathname !== item.href)
            (e.currentTarget as HTMLElement).style.background = 'var(--bg-secondary)';
        }}
        onMouseLeave={(e) => {
          if (pathname !== item.href)
            (e.currentTarget as HTMLElement).style.background = 'transparent';
        }}
      >
        <span style={{ color: pathname === item.href ? 'var(--primary)' : '#94a3b8', display: 'flex' }}>
          {item.icon}
        </span>
        <span className="text-[13.5px]">{item.label}</span>
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
        style={{
          height: 'var(--topbar-height)',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <Link href="/dashboard" className="flex items-center gap-1">
          <span className="text-[20px] font-extrabold tracking-tight" style={{ color: 'var(--text)', letterSpacing: '-0.5px' }}>
            JINU
          </span>
          <span className="text-[20px] font-light tracking-tight" style={{ color: '#64748b', letterSpacing: '-0.5px' }}>
            shop
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3">
        {mainNav.map((item) => renderItem(item))}

        {/* Divider */}
        <div style={{ height: 1, background: 'var(--border)', margin: '8px 20px' }} />

        {labNav.map((item) => renderItem(item))}
      </nav>

      {/* Bottom */}
      <div style={{ borderTop: '1px solid var(--border)', padding: '8px 0' }}>
        <Link
          href="/mypage"
          className="flex items-center gap-2.5 px-5 transition-colors"
          style={{
            height: 38,
            color: pathname === '/mypage' ? 'var(--primary)' : '#64748b',
            fontSize: 13,
          }}
        >
          <User size={16} style={{ color: '#94a3b8' }} />
          <span>마이페이지</span>
        </Link>
        <button
          onClick={async () => {
            await fetch('/api/auth/logout', { method: 'POST' });
            window.location.href = '/login';
          }}
          className="flex items-center gap-2.5 px-5 w-full transition-colors"
          style={{ height: 38, color: '#64748b', fontSize: 13 }}
        >
          <LogOut size={16} style={{ color: '#94a3b8' }} />
          <span>로그아웃</span>
        </button>
      </div>
    </aside>
  );
}
