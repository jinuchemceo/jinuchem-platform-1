'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ShoppingBag,
  Zap,
  ClipboardList,
  FileText,
  FlaskConical,
  Heart,
  Package,
  Users,
  MessageSquare,
  HelpCircle,
  User,
  LogOut,
  ChevronDown,
  ChevronRight,
  CheckSquare,
  DollarSign,
  FolderKanban,
  Settings,
  BarChart3,
  ShoppingCart as CartIcon,
  ExternalLink,
} from 'lucide-react';

interface NavChild {
  label: string;
  href: string;
}

interface NavItem {
  label: string;
  href?: string;
  icon: React.ReactNode;
  children?: NavChild[];
  dividerAfter?: boolean;
}

const navItems: NavItem[] = [
  {
    label: '제품 주문',
    icon: <ShoppingBag size={18} />,
    children: [
      { label: '시약 주문', href: '/order' },
      { label: '소모품 주문', href: '/supplies' },
    ],
  },
  {
    label: '빠른 주문',
    href: '/quickorder',
    icon: <Zap size={18} />,
  },
  {
    label: '주문 관리',
    icon: <ClipboardList size={18} />,
    children: [
      { label: '통합 주문 내역', href: '/orders' },
      { label: '내 주문 내역', href: '/my-orders' },
      { label: '구매 승인', href: '/approvals' },
      { label: '견적 관리', href: '/quotes' },
      { label: '취소/반품', href: '/cancel' },
      { label: '증빙서류', href: '/documents' },
    ],
    dividerAfter: true,
  },
  {
    label: '내 연구실',
    icon: <FlaskConical size={18} />,
    children: [
      { label: '즐겨찾기', href: '/favorites' },
      { label: '내 시약장', href: '/inventory' },
      { label: '공유 장바구니', href: '/shared-cart' },
    ],
    dividerAfter: true,
  },
  {
    label: '연구실 관리',
    icon: <Users size={18} />,
    children: [
      { label: '연구실 설정', href: '/settings' },
      { label: '연구실원 관리', href: '/members' },
      { label: '프로젝트 관리', href: '/projects' },
      { label: '예산 관리', href: '/budget' },
    ],
  },
  {
    label: '보고서/분석',
    href: '/reports',
    icon: <BarChart3 size={18} />,
    dividerAfter: true,
  },
  {
    label: '대화',
    href: '/chat',
    icon: <MessageSquare size={18} />,
  },
  {
    label: '고객센터',
    icon: <HelpCircle size={18} />,
    children: [
      { label: '고객센터 홈', href: '/cs' },
      { label: '자주 묻는 질문', href: '/faq' },
      { label: '1:1 문의하기', href: '/inquiry' },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

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
            className="flex items-center w-full gap-2.5 px-5 py-2 text-[13.5px] transition-colors hover:bg-gray-50"
            style={{
              color: isActive ? 'var(--primary)' : '#334155',
              fontWeight: isActive ? 600 : 500,
            }}
          >
            <span style={{ color: isActive ? 'var(--primary)' : '#94a3b8' }}>{item.icon}</span>
            <span className="flex-1 text-left">{item.label}</span>
            {isOpen ? <ChevronDown size={14} className="text-gray-400" /> : <ChevronRight size={14} className="text-gray-400" />}
          </button>
          {isOpen && (
            <div className="mt-0.5">
              {item.children.map((child) => (
                <Link
                  key={child.href}
                  href={child.href}
                  className="block pl-12 pr-5 py-2 text-[13px] transition-colors hover:bg-gray-50"
                  style={{
                    color: isActivePath(child.href) ? 'var(--primary)' : '#64748b',
                    fontWeight: isActivePath(child.href) ? 600 : 400,
                    background: isActivePath(child.href) ? '#eff6ff' : 'transparent',
                  }}
                >
                  {child.label}
                </Link>
              ))}
            </div>
          )}
          {item.dividerAfter && <div className="border-t border-gray-200 mx-5 my-2" />}
        </div>
      );
    }

    return (
      <div key={item.href}>
        <Link
          href={item.href!}
          className="flex items-center gap-2.5 px-5 py-2 text-[13.5px] transition-colors hover:bg-gray-50"
          style={{
            color: isActivePath(item.href!) ? 'var(--primary)' : '#475569',
            fontWeight: isActivePath(item.href!) ? 600 : 500,
            background: isActivePath(item.href!) ? '#eff6ff' : 'transparent',
          }}
        >
          <span style={{ color: isActivePath(item.href!) ? 'var(--primary)' : '#94a3b8' }}>{item.icon}</span>
          <span>{item.label}</span>
        </Link>
        {item.dividerAfter && <div className="border-t border-gray-200 mx-5 my-2" />}
      </div>
    );
  };

  return (
    <aside
      className="fixed top-0 left-0 h-screen bg-white border-r border-gray-200 flex flex-col z-40"
      style={{ width: 'var(--sidebar-width)' }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 h-14 border-b border-gray-200">
        <Link href="/dashboard" className="flex items-center gap-1.5 text-lg font-bold text-gray-900 hover:no-underline">
          <span className="text-xl font-extrabold tracking-tight">JINU</span>
          <span className="w-5 h-5 bg-blue-500 rounded flex items-center justify-center">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <rect x="4" y="2" width="16" height="5" rx="1"/>
              <rect x="4" y="9" width="16" height="5" rx="1"/>
              <rect x="4" y="16" width="16" height="5" rx="1"/>
            </svg>
          </span>
          <span className="text-xl font-normal text-gray-500 tracking-tight">PI</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3">
        {navItems.map(renderNavItem)}
      </nav>

      {/* Bottom */}
      <div className="border-t border-gray-200 py-2">
        <Link
          href="/mypage"
          className="flex items-center gap-2.5 px-5 py-2 text-[13px] text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-colors"
        >
          <User size={16} />
          <span>마이페이지</span>
        </Link>
        <button className="flex items-center gap-2.5 px-5 py-2 text-[13px] text-gray-500 hover:bg-gray-50 hover:text-gray-900 w-full transition-colors">
          <LogOut size={16} />
          <span>로그아웃</span>
        </button>
      </div>
    </aside>
  );
}
