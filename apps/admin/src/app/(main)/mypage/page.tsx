'use client';

import { useState } from 'react';
import {
  User,
  Shield,
  Bell,
  Activity,
  Mail,
  Phone,
  Building2,
  Briefcase,
  Calendar,
  Clock,
  Globe,
  CheckCircle,
  Lock,
  Smartphone,
  Monitor,
  LogOut,
  Eye,
  EyeOff,
  ChevronDown,
  Search,
  Filter,
  KeyRound,
  Fingerprint,
  ShieldCheck,
  BellRing,
  BellOff,
  MessageSquare,
  AlertTriangle,
  Server,
  Package,
  CreditCard,
  Undo2,
  Cpu,
  BarChart3,
  Zap,
  Settings,
  Megaphone,
  UserCog,
  ShoppingCart,
  Wrench,
} from 'lucide-react';
import { AdminTabs } from '@/components/shared/AdminTabs';
import { Modal } from '@/components/shared/Modal';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Pagination } from '@/components/shared/Pagination';

// ---------------------------------------------------------------------------
// Constants & Types
// ---------------------------------------------------------------------------

const TABS = [
  { id: 'profile', label: '내 정보' },
  { id: 'security', label: '보안 설정' },
  { id: 'notifications', label: '알림 설정' },
  { id: 'activity', label: '내 활동 로그' },
];

const PERMISSIONS = [
  '사용자 관리',
  '제품 관리',
  '주문 관리',
  '공급사 관리',
  'AI 모니터링',
  'API 관리',
  '게시판 관리',
  '데이터 파이프라인',
  '시스템 설정',
  '프로모션 관리',
];

// ---------------------------------------------------------------------------
// Mock Data: Login History
// ---------------------------------------------------------------------------

const LOGIN_HISTORY = [
  { id: 1, datetime: '2026-04-03 09:15', ip: '192.168.1.100', device: 'Windows 10 / Chrome 120', location: '서울, 대한민국', status: '성공' },
  { id: 2, datetime: '2026-04-02 14:30', ip: '192.168.1.105', device: 'macOS / Safari 17', location: '서울, 대한민국', status: '성공' },
  { id: 3, datetime: '2026-04-02 08:45', ip: '192.168.1.100', device: 'Windows 10 / Chrome 120', location: '서울, 대한민국', status: '성공' },
  { id: 4, datetime: '2026-04-01 17:20', ip: '10.0.0.55', device: 'Windows 10 / Chrome 120', location: '성남, 대한민국', status: '실패' },
  { id: 5, datetime: '2026-04-01 09:10', ip: '192.168.1.100', device: 'Windows 10 / Chrome 120', location: '서울, 대한민국', status: '성공' },
  { id: 6, datetime: '2026-03-31 13:55', ip: '192.168.1.100', device: 'Windows 10 / Chrome 120', location: '서울, 대한민국', status: '성공' },
  { id: 7, datetime: '2026-03-31 08:30', ip: '192.168.1.105', device: 'macOS / Safari 17', location: '서울, 대한민국', status: '성공' },
  { id: 8, datetime: '2026-03-30 10:00', ip: '192.168.1.100', device: 'Windows 10 / Chrome 120', location: '서울, 대한민국', status: '성공' },
];

// ---------------------------------------------------------------------------
// Mock Data: Sessions
// ---------------------------------------------------------------------------

const SESSIONS = [
  { id: 1, device: 'Windows 10 / Chrome 120', ip: '192.168.1.100', lastActive: '현재 세션', isCurrent: true },
  { id: 2, device: 'macOS / Safari 17', ip: '192.168.1.105', lastActive: '2026-04-02 14:30', isCurrent: false },
];

// ---------------------------------------------------------------------------
// Mock Data: Notification Types
// ---------------------------------------------------------------------------

interface NotificationType {
  id: string;
  label: string;
  email: boolean;
  browser: boolean;
  sms: boolean;
}

const INITIAL_NOTIFICATION_TYPES: NotificationType[] = [
  { id: 'new-order', label: '신규 주문 접수', email: true, browser: true, sms: false },
  { id: 'payment', label: '결제 대기/완료', email: true, browser: true, sms: false },
  { id: 'return', label: '반품/취소 요청', email: true, browser: true, sms: true },
  { id: 'supplier-reg', label: '공급사 등록 요청', email: true, browser: false, sms: false },
  { id: 'system-alert', label: '시스템 장애/경고', email: true, browser: true, sms: true },
  { id: 'api-rate-limit', label: 'API Rate Limit 초과', email: true, browser: true, sms: false },
  { id: 'ai-deploy', label: 'AI 모델 배포 완료', email: true, browser: false, sms: false },
  { id: 'low-stock', label: '재고 부족 알림', email: false, browser: true, sms: false },
  { id: 'security-event', label: '보안 이벤트', email: true, browser: true, sms: true },
];

// ---------------------------------------------------------------------------
// Mock Data: Activity Log
// ---------------------------------------------------------------------------

type ActivityType = '로그인' | '설정변경' | '사용자관리' | '제품관리' | '주문처리' | '시스템';

const ACTIVITY_TYPE_COLORS: Record<ActivityType, string> = {
  '로그인': 'blue',
  '설정변경': 'amber',
  '사용자관리': 'purple',
  '제품관리': 'teal',
  '주문처리': 'emerald',
  '시스템': 'orange',
};

interface ActivityEntry {
  id: number;
  datetime: string;
  type: ActivityType;
  detail: string;
  ip: string;
  result: '성공' | '실패';
}

const ACTIVITY_LOG: ActivityEntry[] = [
  { id: 1, datetime: '2026-04-03 09:15', type: '로그인', detail: '관리자 로그인', ip: '192.168.1.100', result: '성공' },
  { id: 2, datetime: '2026-04-03 09:20', type: '사용자관리', detail: '신규 사용자 승인 (연구원 3명)', ip: '192.168.1.100', result: '성공' },
  { id: 3, datetime: '2026-04-03 09:35', type: '제품관리', detail: '시약 카탈로그 가격 일괄 업데이트 (152건)', ip: '192.168.1.100', result: '성공' },
  { id: 4, datetime: '2026-04-03 10:00', type: '주문처리', detail: '주문 #ORD-2026-0891 배송 상태 변경', ip: '192.168.1.100', result: '성공' },
  { id: 5, datetime: '2026-04-03 10:15', type: '시스템', detail: 'API Rate Limit 설정 변경 (Pro: 500 -> 1000/hr)', ip: '192.168.1.100', result: '성공' },
  { id: 6, datetime: '2026-04-03 10:30', type: '설정변경', detail: '알림 설정 변경 - SMS 알림 비활성화', ip: '192.168.1.100', result: '성공' },
  { id: 7, datetime: '2026-04-03 11:00', type: '사용자관리', detail: '공급자 계정 권한 수정 (supplier-007)', ip: '192.168.1.100', result: '성공' },
  { id: 8, datetime: '2026-04-03 11:20', type: '제품관리', detail: '소모품 카테고리 재구성', ip: '192.168.1.100', result: '성공' },
  { id: 9, datetime: '2026-04-03 11:45', type: '시스템', detail: 'AI 추천 엔진 v2.3 배포 승인', ip: '192.168.1.100', result: '성공' },
  { id: 10, datetime: '2026-04-03 13:00', type: '로그인', detail: '세션 갱신', ip: '192.168.1.100', result: '성공' },
  { id: 11, datetime: '2026-04-03 13:15', type: '주문처리', detail: '반품 요청 승인 #RTN-2026-0045', ip: '192.168.1.100', result: '성공' },
  { id: 12, datetime: '2026-04-03 14:00', type: '설정변경', detail: '프로모션 배너 교체 (메인 슬라이더)', ip: '192.168.1.100', result: '성공' },
  { id: 13, datetime: '2026-04-03 14:30', type: '시스템', detail: '데이터 파이프라인 수동 실행 (PriceHistory)', ip: '192.168.1.100', result: '실패' },
  { id: 14, datetime: '2026-04-03 14:35', type: '시스템', detail: '데이터 파이프라인 재실행 (PriceHistory)', ip: '192.168.1.100', result: '성공' },
  { id: 15, datetime: '2026-04-03 15:00', type: '사용자관리', detail: '조직관리자 역할 변경 (org-admin-012)', ip: '192.168.1.100', result: '성공' },
];

const ACTIVITY_FILTER_OPTIONS = [
  { value: '전체', label: '전체' },
  { value: '로그인', label: '로그인' },
  { value: '설정변경', label: '설정변경' },
  { value: '사용자관리', label: '사용자관리' },
  { value: '제품관리', label: '제품관리' },
  { value: '주문처리', label: '주문처리' },
  { value: '시스템', label: '시스템' },
];

// ---------------------------------------------------------------------------
// Helper: Activity type badge
// ---------------------------------------------------------------------------

function ActivityTypeBadge({ type }: { type: ActivityType }) {
  const colorMap: Record<string, string> = {
    blue: 'bg-blue-100 text-blue-700',
    amber: 'bg-amber-100 text-amber-700',
    purple: 'bg-purple-100 text-purple-700',
    teal: 'bg-teal-100 text-teal-700',
    emerald: 'bg-emerald-100 text-emerald-700',
    orange: 'bg-orange-100 text-orange-700',
  };
  const colorKey = ACTIVITY_TYPE_COLORS[type] ?? 'gray';
  const cls = colorMap[colorKey] ?? 'bg-gray-100 text-gray-700';

  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium inline-block ${cls}`}>
      {type}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Helper: Toggle switch
// ---------------------------------------------------------------------------

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative w-10 h-5 rounded-full transition-colors ${
        checked ? 'bg-emerald-500' : 'bg-gray-300'
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
          checked ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function AdminMyPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [editProfileOpen, setEditProfileOpen] = useState(false);

  // Security state
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [twoFaEnabled, setTwoFaEnabled] = useState(true);

  // Notification state
  const [emailNoti, setEmailNoti] = useState(true);
  const [browserNoti, setBrowserNoti] = useState(true);
  const [smsNoti, setSmsNoti] = useState(false);
  const [notiTypes, setNotiTypes] = useState<NotificationType[]>(INITIAL_NOTIFICATION_TYPES);
  const [dndStart, setDndStart] = useState('22:00');
  const [dndEnd, setDndEnd] = useState('07:00');
  const [weekendNoti, setWeekendNoti] = useState(false);

  // Activity state
  const [activityFilter, setActivityFilter] = useState('전체');
  const [activityPage, setActivityPage] = useState(1);
  const activityPerPage = 8;

  // Password strength
  const getPasswordStrength = (pw: string): { label: string; pct: number; color: string } => {
    if (pw.length === 0) return { label: '', pct: 0, color: 'bg-gray-200' };
    if (pw.length < 6) return { label: '약함', pct: 25, color: 'bg-red-500' };
    if (pw.length < 10) return { label: '보통', pct: 50, color: 'bg-amber-500' };
    if (/(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/.test(pw) && pw.length >= 12)
      return { label: '매우 강함', pct: 100, color: 'bg-emerald-500' };
    return { label: '강함', pct: 75, color: 'bg-blue-500' };
  };

  const pwStrength = getPasswordStrength(newPw);

  // Notification type toggle handler
  const toggleNotiType = (id: string, channel: 'email' | 'browser' | 'sms') => {
    setNotiTypes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, [channel]: !n[channel] } : n))
    );
  };

  // Filtered activity log
  const filteredActivity =
    activityFilter === '전체'
      ? ACTIVITY_LOG
      : ACTIVITY_LOG.filter((a) => a.type === activityFilter);

  const totalActivityPages = Math.ceil(filteredActivity.length / activityPerPage);
  const pagedActivity = filteredActivity.slice(
    (activityPage - 1) * activityPerPage,
    activityPage * activityPerPage
  );

  // ---------------------------------------------------------------------------
  // Tab: Profile
  // ---------------------------------------------------------------------------

  const renderProfile = () => (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-6">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-full bg-orange-600 flex items-center justify-center text-white text-2xl font-bold shrink-0">
            A
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-xl font-bold text-[var(--text)]">김지누</h2>
              <StatusBadge status="시스템관리자" />
            </div>
            <p className="text-sm text-[var(--text-secondary)]">admin@jinuchem.com</p>
          </div>
          <button
            onClick={() => setEditProfileOpen(true)}
            className="h-[var(--btn-height)] px-4 bg-orange-600 text-white text-sm font-medium rounded-lg hover:bg-orange-700 transition-colors"
          >
            프로필 수정
          </button>
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Info */}
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-6">
          <h3 className="text-sm font-semibold text-[var(--text)] mb-4 flex items-center gap-2">
            <User size={16} className="text-orange-600" />
            기본 정보
          </h3>
          <div className="space-y-3">
            {[
              { label: '이름', value: '김지누', icon: <User size={14} /> },
              { label: '이메일', value: 'admin@jinuchem.com', icon: <Mail size={14} /> },
              { label: '연락처', value: '010-1234-5678', icon: <Phone size={14} /> },
              { label: '부서', value: '플랫폼운영팀', icon: <Building2 size={14} /> },
              { label: '직책', value: '팀장', icon: <Briefcase size={14} /> },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3 text-sm">
                <span className="text-[var(--text-secondary)]">{item.icon}</span>
                <span className="text-[var(--text-secondary)] w-16 shrink-0">{item.label}</span>
                <span className="text-[var(--text)] font-medium">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Account Info */}
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-6">
          <h3 className="text-sm font-semibold text-[var(--text)] mb-4 flex items-center gap-2">
            <Shield size={16} className="text-orange-600" />
            계정 정보
          </h3>
          <div className="space-y-3">
            {[
              { label: '계정 ID', value: 'admin-001', icon: <KeyRound size={14} /> },
              { label: '가입일', value: '2025-06-15', icon: <Calendar size={14} /> },
              { label: '마지막 로그인', value: '2026-04-03 09:15', icon: <Clock size={14} /> },
              { label: '로그인 IP', value: '192.168.1.100', icon: <Globe size={14} /> },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3 text-sm">
                <span className="text-[var(--text-secondary)]">{item.icon}</span>
                <span className="text-[var(--text-secondary)] w-24 shrink-0">{item.label}</span>
                <span className="text-[var(--text)] font-medium">{item.value}</span>
              </div>
            ))}
            <div className="flex items-center gap-3 text-sm">
              <span className="text-[var(--text-secondary)]"><CheckCircle size={14} /></span>
              <span className="text-[var(--text-secondary)] w-24 shrink-0">상태</span>
              <StatusBadge status="활성" />
            </div>
          </div>
        </div>
      </div>

      {/* Permissions */}
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-6">
        <h3 className="text-sm font-semibold text-[var(--text)] mb-4 flex items-center gap-2">
          <ShieldCheck size={16} className="text-orange-600" />
          관리 권한
        </h3>
        <div className="flex flex-wrap gap-2">
          {PERMISSIONS.map((perm) => (
            <span
              key={perm}
              className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200"
            >
              <CheckCircle size={12} />
              {perm}
            </span>
          ))}
        </div>
      </div>

      {/* Edit Profile Modal */}
      <Modal isOpen={editProfileOpen} onClose={() => setEditProfileOpen(false)} title="프로필 수정" size="lg">
        <div className="space-y-4">
          {[
            { label: '이름', defaultValue: '김지누', type: 'text' },
            { label: '이메일', defaultValue: 'admin@jinuchem.com', type: 'email' },
            { label: '연락처', defaultValue: '010-1234-5678', type: 'tel' },
            { label: '부서', defaultValue: '플랫폼운영팀', type: 'text' },
            { label: '직책', defaultValue: '팀장', type: 'text' },
          ].map((field) => (
            <div key={field.label}>
              <label className="block text-sm font-medium text-[var(--text)] mb-1">{field.label}</label>
              <input
                type={field.type}
                defaultValue={field.defaultValue}
                className="w-full h-[var(--btn-height)] px-3 text-sm border border-[var(--border)] rounded-lg bg-[var(--bg)] text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          ))}
          <div className="flex justify-end gap-2 pt-4 border-t border-[var(--border)]">
            <button
              onClick={() => setEditProfileOpen(false)}
              className="h-[var(--btn-height)] px-4 text-sm font-medium border border-[var(--border)] rounded-lg text-[var(--text)] hover:bg-gray-50 transition-colors"
            >
              취소
            </button>
            <button
              onClick={() => setEditProfileOpen(false)}
              className="h-[var(--btn-height)] px-4 text-sm font-medium bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
            >
              저장
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );

  // ---------------------------------------------------------------------------
  // Tab: Security
  // ---------------------------------------------------------------------------

  const renderSecurity = () => (
    <div className="space-y-6">
      {/* Password Change */}
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-6">
        <h3 className="text-sm font-semibold text-[var(--text)] mb-4 flex items-center gap-2">
          <Lock size={16} className="text-orange-600" />
          비밀번호 변경
        </h3>
        <div className="max-w-md space-y-4">
          {/* Current Password */}
          <div>
            <label className="block text-sm font-medium text-[var(--text)] mb-1">현재 비밀번호</label>
            <div className="relative">
              <input
                type={showCurrentPw ? 'text' : 'password'}
                value={currentPw}
                onChange={(e) => setCurrentPw(e.target.value)}
                placeholder="현재 비밀번호 입력"
                className="w-full h-[var(--btn-height)] px-3 pr-10 text-sm border border-[var(--border)] rounded-lg bg-[var(--bg)] text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPw(!showCurrentPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]"
              >
                {showCurrentPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="block text-sm font-medium text-[var(--text)] mb-1">새 비밀번호</label>
            <div className="relative">
              <input
                type={showNewPw ? 'text' : 'password'}
                value={newPw}
                onChange={(e) => setNewPw(e.target.value)}
                placeholder="새 비밀번호 입력"
                className="w-full h-[var(--btn-height)] px-3 pr-10 text-sm border border-[var(--border)] rounded-lg bg-[var(--bg)] text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <button
                type="button"
                onClick={() => setShowNewPw(!showNewPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]"
              >
                {showNewPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {/* Strength Indicator */}
            {newPw.length > 0 && (
              <div className="mt-2">
                <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${pwStrength.color}`}
                    style={{ width: `${pwStrength.pct}%` }}
                  />
                </div>
                <p className="text-xs text-[var(--text-secondary)] mt-1">
                  비밀번호 강도: <span className="font-medium">{pwStrength.label}</span>
                </p>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-[var(--text)] mb-1">새 비밀번호 확인</label>
            <div className="relative">
              <input
                type={showConfirmPw ? 'text' : 'password'}
                value={confirmPw}
                onChange={(e) => setConfirmPw(e.target.value)}
                placeholder="새 비밀번호 재입력"
                className="w-full h-[var(--btn-height)] px-3 pr-10 text-sm border border-[var(--border)] rounded-lg bg-[var(--bg)] text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPw(!showConfirmPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]"
              >
                {showConfirmPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {confirmPw.length > 0 && confirmPw !== newPw && (
              <p className="text-xs text-red-500 mt-1">비밀번호가 일치하지 않습니다.</p>
            )}
          </div>

          <div className="flex items-center justify-between pt-2">
            <p className="text-xs text-[var(--text-secondary)]">
              마지막 변경일: <span className="font-medium">2026-03-15</span>
            </p>
            <button
              onClick={() => {
                if (!currentPw || !newPw || !confirmPw) { alert('모든 필드를 입력해주세요.'); return; }
                if (newPw !== confirmPw) { alert('새 비밀번호가 일치하지 않습니다.'); return; }
                setCurrentPw(''); setNewPw(''); setConfirmPw('');
                alert('비밀번호가 성공적으로 변경되었습니다.');
              }}
              className="h-[var(--btn-height)] px-4 text-sm font-medium bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
            >
              비밀번호 변경
            </button>
          </div>
        </div>
      </div>

      {/* 2FA */}
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-6">
        <h3 className="text-sm font-semibold text-[var(--text)] mb-4 flex items-center gap-2">
          <Fingerprint size={16} className="text-orange-600" />
          2단계 인증 (2FA)
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[var(--text)]">2단계 인증</p>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5">로그인 시 추가 인증 단계를 요구합니다.</p>
            </div>
            <Toggle checked={twoFaEnabled} onChange={setTwoFaEnabled} />
          </div>
          <div className="flex items-center justify-between pt-3 border-t border-[var(--border)]">
            <div>
              <p className="text-sm text-[var(--text-secondary)]">인증 방식</p>
              <p className="text-sm font-medium text-[var(--text)]">이메일 OTP</p>
            </div>
            <button onClick={() => alert('인증 방식 변경: 이메일 OTP / 인증 앱 중 선택할 수 있습니다.')} className="h-[var(--btn-height)] px-4 text-sm font-medium border border-[var(--border)] rounded-lg text-[var(--text)] hover:bg-gray-50 transition-colors">
              인증 방식 변경
            </button>
          </div>
        </div>
      </div>

      {/* Login History */}
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-6">
        <h3 className="text-sm font-semibold text-[var(--text)] mb-4 flex items-center gap-2">
          <Clock size={16} className="text-orange-600" />
          로그인 이력
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th className="text-left py-2.5 px-3 text-xs font-medium text-[var(--text-secondary)]">일시</th>
                <th className="text-left py-2.5 px-3 text-xs font-medium text-[var(--text-secondary)]">IP 주소</th>
                <th className="text-left py-2.5 px-3 text-xs font-medium text-[var(--text-secondary)]">기기</th>
                <th className="text-left py-2.5 px-3 text-xs font-medium text-[var(--text-secondary)]">위치</th>
                <th className="text-left py-2.5 px-3 text-xs font-medium text-[var(--text-secondary)]">상태</th>
              </tr>
            </thead>
            <tbody>
              {LOGIN_HISTORY.map((entry) => (
                <tr
                  key={entry.id}
                  className={`border-b border-[var(--border)] last:border-b-0 ${
                    entry.status === '실패' ? 'bg-red-50' : ''
                  }`}
                >
                  <td className="py-2.5 px-3 text-[var(--text)]">{entry.datetime}</td>
                  <td className="py-2.5 px-3 font-mono text-xs text-[var(--text)]">{entry.ip}</td>
                  <td className="py-2.5 px-3 text-[var(--text)]">{entry.device}</td>
                  <td className="py-2.5 px-3 text-[var(--text)]">{entry.location}</td>
                  <td className="py-2.5 px-3">
                    <StatusBadge status={entry.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Session Management */}
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-6">
        <h3 className="text-sm font-semibold text-[var(--text)] mb-4 flex items-center gap-2">
          <Monitor size={16} className="text-orange-600" />
          세션 관리
        </h3>
        <div className="space-y-3">
          {SESSIONS.map((session) => (
            <div
              key={session.id}
              className="flex items-center justify-between p-3 border border-[var(--border)] rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center text-[var(--text-secondary)]">
                  {session.device.includes('Windows') ? <Monitor size={18} /> : <Smartphone size={18} />}
                </div>
                <div>
                  <p className="text-sm font-medium text-[var(--text)]">{session.device}</p>
                  <p className="text-xs text-[var(--text-secondary)]">
                    IP: {session.ip} &middot; {session.lastActive}
                  </p>
                </div>
              </div>
              {session.isCurrent ? (
                <StatusBadge status="현재 세션" colorMap={{ '현재 세션': 'emerald' }} />
              ) : (
                <button onClick={() => { if (confirm(`이 세션(${session.device})을 종료하시겠습니까?`)) { alert('세션이 종료되었습니다.'); } }} className="h-[var(--btn-height)] px-3 text-xs font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors">
                  세션 종료
                </button>
              )}
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-[var(--border)]">
          <button onClick={() => { if (confirm('현재 세션을 제외한 모든 세션을 종료하시겠습니까?')) { alert('다른 모든 세션이 종료되었습니다.'); } }} className="h-[var(--btn-height)] px-4 text-sm font-medium text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors flex items-center gap-2">
            <LogOut size={14} />
            다른 세션 모두 종료
          </button>
        </div>
      </div>
    </div>
  );

  // ---------------------------------------------------------------------------
  // Tab: Notifications
  // ---------------------------------------------------------------------------

  const renderNotifications = () => (
    <div className="space-y-6">
      {/* Notification Channels */}
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-6">
        <h3 className="text-sm font-semibold text-[var(--text)] mb-4 flex items-center gap-2">
          <BellRing size={16} className="text-orange-600" />
          알림 채널
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Mail size={16} className="text-[var(--text-secondary)]" />
              <span className="text-sm text-[var(--text)]">이메일 알림</span>
            </div>
            <Toggle checked={emailNoti} onChange={setEmailNoti} />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell size={16} className="text-[var(--text-secondary)]" />
              <span className="text-sm text-[var(--text)]">브라우저 알림</span>
            </div>
            <Toggle checked={browserNoti} onChange={setBrowserNoti} />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare size={16} className="text-[var(--text-secondary)]" />
              <span className="text-sm text-[var(--text)]">SMS 알림</span>
            </div>
            <Toggle checked={smsNoti} onChange={setSmsNoti} />
          </div>
          <div className="pt-3 border-t border-[var(--border)]">
            <label className="block text-sm font-medium text-[var(--text)] mb-1">수신 이메일</label>
            <input
              type="email"
              defaultValue="admin@jinuchem.com"
              className="w-full max-w-sm h-[var(--btn-height)] px-3 text-sm border border-[var(--border)] rounded-lg bg-[var(--bg)] text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
        </div>
      </div>

      {/* Notification Types */}
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-6">
        <h3 className="text-sm font-semibold text-[var(--text)] mb-4 flex items-center gap-2">
          <Settings size={16} className="text-orange-600" />
          알림 유형별 설정
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th className="text-left py-2.5 px-3 text-xs font-medium text-[var(--text-secondary)]">알림 유형</th>
                <th className="text-center py-2.5 px-3 text-xs font-medium text-[var(--text-secondary)]">이메일</th>
                <th className="text-center py-2.5 px-3 text-xs font-medium text-[var(--text-secondary)]">브라우저</th>
                <th className="text-center py-2.5 px-3 text-xs font-medium text-[var(--text-secondary)]">SMS</th>
              </tr>
            </thead>
            <tbody>
              {notiTypes.map((noti) => (
                <tr key={noti.id} className="border-b border-[var(--border)] last:border-b-0">
                  <td className="py-3 px-3 text-[var(--text)]">{noti.label}</td>
                  <td className="py-3 px-3">
                    <div className="flex justify-center">
                      <Toggle
                        checked={noti.email}
                        onChange={() => toggleNotiType(noti.id, 'email')}
                      />
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex justify-center">
                      <Toggle
                        checked={noti.browser}
                        onChange={() => toggleNotiType(noti.id, 'browser')}
                      />
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex justify-center">
                      <Toggle
                        checked={noti.sms}
                        onChange={() => toggleNotiType(noti.id, 'sms')}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Notification Schedule */}
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-6">
        <h3 className="text-sm font-semibold text-[var(--text)] mb-4 flex items-center gap-2">
          <BellOff size={16} className="text-orange-600" />
          알림 스케줄
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--text)] mb-2">방해금지 시간</label>
            <div className="flex items-center gap-3">
              <input
                type="time"
                value={dndStart}
                onChange={(e) => setDndStart(e.target.value)}
                className="h-[var(--btn-height)] px-3 text-sm border border-[var(--border)] rounded-lg bg-[var(--bg)] text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <span className="text-sm text-[var(--text-secondary)]">~</span>
              <input
                type="time"
                value={dndEnd}
                onChange={(e) => setDndEnd(e.target.value)}
                className="h-[var(--btn-height)] px-3 text-sm border border-[var(--border)] rounded-lg bg-[var(--bg)] text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>
          <div className="flex items-center justify-between pt-3 border-t border-[var(--border)]">
            <span className="text-sm text-[var(--text)]">주말 알림 수신</span>
            <Toggle checked={weekendNoti} onChange={setWeekendNoti} />
          </div>
          <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <AlertTriangle size={16} className="text-amber-600 mt-0.5 shrink-0" />
            <p className="text-xs text-amber-700">
              긴급 알림(시스템 장애, 보안 이벤트)은 방해금지 시간 및 주말에도 항상 수신됩니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  // ---------------------------------------------------------------------------
  // Tab: Activity Log
  // ---------------------------------------------------------------------------

  const renderActivity = () => (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: '오늘 활동', value: '23건', icon: <Activity size={18} /> },
          { label: '이번 주', value: '156건', icon: <BarChart3 size={18} /> },
          { label: '이번 달', value: '892건', icon: <Zap size={18} /> },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 bg-orange-50 rounded-lg flex items-center justify-center text-orange-600">
                {stat.icon}
              </div>
              <span className="text-xs text-[var(--text-secondary)]">{stat.label}</span>
            </div>
            <p className="text-2xl font-bold text-[var(--text)]">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <Filter size={14} className="text-[var(--text-secondary)]" />
          <span className="text-sm text-[var(--text-secondary)]">활동 유형:</span>
        </div>
        <select
          value={activityFilter}
          onChange={(e) => {
            setActivityFilter(e.target.value);
            setActivityPage(1);
          }}
          className="h-[var(--btn-height)] px-3 text-sm border border-[var(--border)] rounded-lg bg-[var(--bg)] text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          {ACTIVITY_FILTER_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <div className="flex items-center gap-2 ml-auto">
          <input
            type="date"
            defaultValue="2026-04-03"
            className="h-[var(--btn-height)] px-3 text-sm border border-[var(--border)] rounded-lg bg-[var(--bg)] text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <span className="text-sm text-[var(--text-secondary)]">~</span>
          <input
            type="date"
            defaultValue="2026-04-03"
            className="h-[var(--btn-height)] px-3 text-sm border border-[var(--border)] rounded-lg bg-[var(--bg)] text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
      </div>

      {/* Activity Table */}
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] bg-gray-50/50">
                <th className="text-left py-2.5 px-4 text-xs font-medium text-[var(--text-secondary)]">시간</th>
                <th className="text-left py-2.5 px-4 text-xs font-medium text-[var(--text-secondary)]">활동 유형</th>
                <th className="text-left py-2.5 px-4 text-xs font-medium text-[var(--text-secondary)]">상세 내용</th>
                <th className="text-left py-2.5 px-4 text-xs font-medium text-[var(--text-secondary)]">IP 주소</th>
                <th className="text-left py-2.5 px-4 text-xs font-medium text-[var(--text-secondary)]">결과</th>
              </tr>
            </thead>
            <tbody>
              {pagedActivity.map((entry) => (
                <tr
                  key={entry.id}
                  className={`border-b border-[var(--border)] last:border-b-0 ${
                    entry.result === '실패' ? 'bg-red-50/50' : ''
                  }`}
                >
                  <td className="py-2.5 px-4 text-[var(--text)] whitespace-nowrap">{entry.datetime}</td>
                  <td className="py-2.5 px-4">
                    <ActivityTypeBadge type={entry.type} />
                  </td>
                  <td className="py-2.5 px-4 text-[var(--text)]">{entry.detail}</td>
                  <td className="py-2.5 px-4 font-mono text-xs text-[var(--text)]">{entry.ip}</td>
                  <td className="py-2.5 px-4">
                    <StatusBadge status={entry.result} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={activityPage}
        totalPages={totalActivityPages}
        onPageChange={setActivityPage}
      />
    </div>
  );

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return renderProfile();
      case 'security':
        return renderSecurity();
      case 'notifications':
        return renderNotifications();
      case 'activity':
        return renderActivity();
      default:
        return renderProfile();
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text)]">마이페이지</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            관리자 계정 정보 및 개인 설정을 관리합니다.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <AdminTabs tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Tab Content */}
      {renderTabContent()}
    </div>
  );
}
