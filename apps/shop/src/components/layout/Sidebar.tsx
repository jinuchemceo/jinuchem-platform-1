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
  ChevronRight,
  ChevronDown,
  Bell,
} from 'lucide-react';

interface NavItem {
  label: string;
  href?: string;
  icon: React.ReactNode;
  iconBg: string;
  children?: { label: string; href: string }[];
}

const navGroups: { title: string; items: NavItem[] }[] = [
  {
    title: '주문',
    items: [
      {
        label: '제품 주문',
        icon: <ShoppingCart size={16} />,
        iconBg: '#007AFF',
        children: [
          { label: '시약 주문', href: '/order' },
          { label: '소모품 주문', href: '/supplies' },
        ],
      },
      {
        label: '빠른 주문',
        href: '/quickorder',
        icon: <Zap size={16} />,
        iconBg: '#FF9500',
      },
    ],
  },
  {
    title: '관리',
    items: [
      {
        label: '주문 관리',
        icon: <ClipboardList size={16} />,
        iconBg: '#34C759',
        children: [
          { label: '주문 내역', href: '/orders' },
          { label: '결제하기', href: '/approvals' },
          { label: '취소 내역', href: '/cancel' },
        ],
      },
      {
        label: '증빙서류',
        href: '/documents',
        icon: <FileText size={16} />,
        iconBg: '#5AC8FA',
      },
    ],
  },
  {
    title: '연구실',
    items: [
      {
        label: '내 연구실',
        icon: <FlaskConical size={16} />,
        iconBg: '#AF52DE',
        children: [
          { label: '즐겨찾기', href: '/favorites' },
          { label: '내 시약장', href: '/inventory' },
          { label: '실험실 멤버', href: '/members' },
        ],
      },
      {
        label: '대화',
        href: '/chat',
        icon: <MessageCircle size={16} />,
        iconBg: '#30B0C7',
      },
      {
        label: '알림',
        href: '/notifications',
        icon: <Bell size={16} />,
        iconBg: '#FF3B30',
      },
    ],
  },
  {
    title: '지원',
    items: [
      {
        label: '고객센터',
        icon: <Headphones size={16} />,
        iconBg: '#64D2FF',
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

  const renderItem = (item: NavItem, isLast: boolean) => {
    if (item.children) {
      const isOpen = openGroups[item.label] ?? false;
      const isActive = item.children.some((c) => pathname === c.href);

      return (
        <div key={item.label}>
          <button
            onClick={() => toggleGroup(item.label)}
            className="flex items-center gap-3 w-full px-4 py-2.5 transition-colors"
            style={{
              color: isActive ? 'var(--primary)' : 'var(--text)',
            }}
          >
            {/* Icon */}
            <span
              className="ios-icon-wrap"
              style={{ background: item.iconBg }}
            >
              {item.icon}
            </span>
            {/* Label */}
            <span className="flex-1 text-left text-[15px]">{item.label}</span>
            {/* Chevron */}
            <ChevronDown
              size={14}
              className="text-[var(--text-tertiary)] transition-transform duration-200"
              style={{ transform: isOpen ? 'rotate(0deg)' : 'rotate(-90deg)' }}
            />
          </button>

          {/* Children */}
          {isOpen && (
            <div className="ml-[52px] border-t border-[var(--border)]">
              {item.children.map((child, i) => (
                <Link
                  key={child.href}
                  href={child.href}
                  className="flex items-center justify-between px-4 py-2.5 text-[15px] transition-colors"
                  style={{
                    color: pathname === child.href ? 'var(--primary)' : 'var(--text)',
                    fontWeight: pathname === child.href ? 600 : 400,
                    borderBottom:
                      i < item.children!.length - 1
                        ? '0.5px solid var(--border)'
                        : 'none',
                  }}
                >
                  <span>{child.label}</span>
                  {pathname === child.href && (
                    <ChevronRight size={14} style={{ color: 'var(--primary)' }} />
                  )}
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
        className="flex items-center gap-3 px-4 py-2.5 transition-colors"
        style={{ color: pathname === item.href ? 'var(--primary)' : 'var(--text)' }}
      >
        <span
          className="ios-icon-wrap"
          style={{
            background:
              pathname === item.href ? 'var(--primary)' : item.iconBg,
          }}
        >
          {item.icon}
        </span>
        <span className="flex-1 text-[15px]">{item.label}</span>
        <ChevronRight size={14} className="text-[var(--text-tertiary)]" />
      </Link>
    );
  };

  return (
    <aside
      className="fixed top-0 left-0 h-screen flex flex-col z-40"
      style={{
        width: 'var(--sidebar-width)',
        background: 'var(--sidebar-bg)',
        borderRight: '0.5px solid var(--border-strong)',
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
          <span
            className="text-[17px] font-bold tracking-tight"
            style={{ color: 'var(--text)' }}
          >
            JINU Shop
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-5">
        {navGroups.map((group) => (
          <div key={group.title}>
            {/* Section header */}
            <p className="ios-section-header px-1">{group.title}</p>

            {/* Grouped card */}
            <div
              className="ios-card divide-y divide-[var(--border)]"
              style={{}}
            >
              {group.items.map((item, i) =>
                renderItem(item, i === group.items.length - 1)
              )}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom */}
      <div
        className="shrink-0 px-3 py-3 space-y-1"
        style={{ borderTop: '0.5px solid var(--border)' }}
      >
        <div className="ios-card">
          <Link
            href="/mypage"
            className="flex items-center gap-3 px-4 py-2.5 transition-colors"
            style={{
              color: pathname === '/mypage' ? 'var(--primary)' : 'var(--text)',
              borderBottom: '0.5px solid var(--border)',
            }}
          >
            <span className="ios-icon-wrap" style={{ background: '#8E8E93' }}>
              <User size={16} />
            </span>
            <span className="flex-1 text-[15px]">마이페이지</span>
            <ChevronRight size={14} className="text-[var(--text-tertiary)]" />
          </Link>

          <button
            onClick={async () => {
              await fetch('/api/auth/logout', { method: 'POST' });
              window.location.href = '/login';
            }}
            className="flex items-center gap-3 px-4 py-2.5 w-full transition-colors"
            style={{ color: 'var(--danger)' }}
          >
            <span className="ios-icon-wrap" style={{ background: '#FF3B30' }}>
              <LogOut size={16} />
            </span>
            <span className="text-[15px]">로그아웃</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
