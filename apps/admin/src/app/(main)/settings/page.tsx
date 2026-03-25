'use client';

import { useState } from 'react';
import {
  Settings,
  Save,
  Plus,
  MoreHorizontal,
  Megaphone,
  HelpCircle,
  Server,
  Bell,
  BellOff,
  Shield,
  Pin,
  ChevronUp,
  ChevronDown,
  Trash2,
  Pencil,
  Database,
  Globe,
  Lock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  HardDrive,
  Eye,
  EyeOff,
} from 'lucide-react';
import { AdminTabs } from '@/components/shared/AdminTabs';
import { Modal } from '@/components/shared/Modal';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { useAdminStore } from '@/stores/adminStore';
import {
  mockNotices,
  mockFaqs,
  mockSystemInfo,
  type Notice,
  type Faq,
} from '@/lib/admin-mock-data';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const TABS = [
  { id: 'general', label: '일반 설정' },
  { id: 'notices', label: '공지사항 관리' },
  { id: 'faqs', label: 'FAQ 관리' },
  { id: 'system', label: '시스템 정보' },
];

const NOTICE_CATEGORY_COLORS: Record<string, string> = {
  일반: 'blue',
  서비스: 'purple',
  점검: 'amber',
};

const NOTICE_STATUS_COLORS: Record<string, string> = {
  게시중: 'emerald',
  예약: 'blue',
  종료: 'gray',
};

const FAQ_CATEGORIES = ['전체', '주문', '배송', '제품', '계정', '기타'] as const;

const SERVICE_STATUS_DOT: Record<string, string> = {
  정상: 'bg-emerald-500',
  장애: 'bg-red-500',
  점검: 'bg-amber-500',
};

const ENV_VARS = [
  { name: 'NEXT_PUBLIC_SUPABASE_URL', masked: 'https://xxx...xxx.supabase.co' },
  { name: 'SUPABASE_SERVICE_ROLE_KEY', masked: 'eyJhbGci...****' },
  { name: 'DATABASE_URL', masked: 'postgresql://xxx:***@db.xxx.supabase.co:5432/postgres' },
  { name: 'ANTHROPIC_API_KEY', masked: 'sk-ant-api03-****...****' },
  { name: 'NEXT_PUBLIC_VERCEL_URL', masked: 'https://admin.jinuchem.com' },
  { name: 'PG_SECRET_KEY', masked: 'sk_live_****...****' },
  { name: 'PUBCHEM_API_BASE', masked: 'https://pubchem.ncbi.nlm.nih.gov/rest/pug' },
  { name: 'SMTP_HOST', masked: 'smtp.gmail.com' },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function SettingsPage() {
  const { settingsTab, setSettingsTab } = useAdminStore();

  // Map store tab label to internal id
  const tabLabelToId: Record<string, string> = {
    일반설정: 'general',
    '일반 설정': 'general',
    공지사항: 'notices',
    '공지사항 관리': 'notices',
    FAQ: 'faqs',
    'FAQ 관리': 'faqs',
    시스템정보: 'system',
    '시스템 정보': 'system',
  };
  const tabIdToLabel: Record<string, string> = {
    general: '일반 설정',
    notices: '공지사항 관리',
    faqs: 'FAQ 관리',
    system: '시스템 정보',
  };

  const activeTab = tabLabelToId[settingsTab] ?? 'general';
  const handleTabChange = (id: string) => {
    setSettingsTab(tabIdToLabel[id] ?? id);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--text)]">설정</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          플랫폼 설정 및 콘텐츠 관리
        </p>
      </div>

      {/* Tabs */}
      <AdminTabs tabs={TABS} activeTab={activeTab} onTabChange={handleTabChange} />

      {/* Tab Content */}
      {activeTab === 'general' && <GeneralSettings />}
      {activeTab === 'notices' && <NoticeManagement />}
      {activeTab === 'faqs' && <FaqManagement />}
      {activeTab === 'system' && <SystemInformation />}
    </div>
  );
}

// ===========================================================================
// Tab 1: 일반 설정
// ===========================================================================

function GeneralSettings() {
  const [platformSettings, setPlatformSettings] = useState({
    siteName: 'JINUCHEM 통합 플랫폼',
    vatRate: '10',
    sameDayCutoff: '15:00',
    orderPrefix: 'ORD-',
    poFormat: 'PO-YYYYMMDD-XXXX',
  });

  const [notifications, setNotifications] = useState({
    newOrder: true,
    paymentApproval: true,
    lowStock: true,
    apiRateLimit: false,
  });

  const [security, setSecurity] = useState({
    sessionTimeout: '30',
    maxLoginAttempts: '5',
  });

  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Card 1: Platform Settings */}
      <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border)] p-5">
        <div className="flex items-center gap-2 mb-5">
          <Settings size={18} className="text-orange-600" />
          <h2 className="text-base font-semibold text-[var(--text)]">플랫폼 설정</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <SettingField
            label="사이트명"
            value={platformSettings.siteName}
            readOnly
          />
          <SettingField
            label="부가세율 (%)"
            value={platformSettings.vatRate}
            onChange={(v) => setPlatformSettings((s) => ({ ...s, vatRate: v }))}
            suffix="%"
          />
          <SettingField
            label="당일출고 마감 시간"
            value={platformSettings.sameDayCutoff}
            onChange={(v) => setPlatformSettings((s) => ({ ...s, sameDayCutoff: v }))}
          />
          <SettingField
            label="주문번호 접두사"
            value={platformSettings.orderPrefix}
            onChange={(v) => setPlatformSettings((s) => ({ ...s, orderPrefix: v }))}
          />
          <SettingField
            label="PO 번호 형식"
            value={platformSettings.poFormat}
            readOnly
          />
        </div>
      </div>

      {/* Card 2: Notification Settings */}
      <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border)] p-5">
        <div className="flex items-center gap-2 mb-5">
          <Bell size={18} className="text-orange-600" />
          <h2 className="text-base font-semibold text-[var(--text)]">알림 설정</h2>
        </div>
        <div className="space-y-4">
          <ToggleRow
            label="신규 주문 알림"
            description="새 주문이 접수되면 알림을 받습니다"
            enabled={notifications.newOrder}
            onToggle={() =>
              setNotifications((n) => ({ ...n, newOrder: !n.newOrder }))
            }
          />
          <ToggleRow
            label="결제 승인 요청 알림"
            description="결제 승인 대기 건이 발생하면 알림을 받습니다"
            enabled={notifications.paymentApproval}
            onToggle={() =>
              setNotifications((n) => ({ ...n, paymentApproval: !n.paymentApproval }))
            }
          />
          <ToggleRow
            label="재고 부족 알림"
            description="재고가 최소 수량 이하로 떨어지면 알림을 받습니다"
            enabled={notifications.lowStock}
            onToggle={() =>
              setNotifications((n) => ({ ...n, lowStock: !n.lowStock }))
            }
          />
          <ToggleRow
            label="API Rate Limit 경고"
            description="API 호출이 Rate Limit의 80%를 초과하면 경고 알림을 받습니다"
            enabled={notifications.apiRateLimit}
            onToggle={() =>
              setNotifications((n) => ({ ...n, apiRateLimit: !n.apiRateLimit }))
            }
          />
        </div>
      </div>

      {/* Card 3: Security Settings */}
      <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border)] p-5">
        <div className="flex items-center gap-2 mb-5">
          <Shield size={18} className="text-orange-600" />
          <h2 className="text-base font-semibold text-[var(--text)]">보안 설정</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <SettingField
            label="세션 타임아웃"
            value={security.sessionTimeout}
            onChange={(v) => setSecurity((s) => ({ ...s, sessionTimeout: v }))}
            suffix="분"
          />
          <SettingField
            label="최대 로그인 시도"
            value={security.maxLoginAttempts}
            onChange={(v) => setSecurity((s) => ({ ...s, maxLoginAttempts: v }))}
            suffix="회"
          />
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="h-[var(--btn-height)] px-6 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors flex items-center gap-2"
        >
          <Save size={16} />
          {saved ? '저장 완료' : '설정 저장'}
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Setting field helper
// ---------------------------------------------------------------------------

function SettingField({
  label,
  value,
  onChange,
  readOnly,
  suffix,
}: {
  label: string;
  value: string;
  onChange?: (v: string) => void;
  readOnly?: boolean;
  suffix?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-[var(--text)] mb-1.5">
        {label}
      </label>
      <div className="relative">
        <input
          type="text"
          value={value}
          readOnly={readOnly}
          onChange={(e) => onChange?.(e.target.value)}
          className={`w-full h-[var(--btn-height)] px-3 border border-[var(--border)] rounded-lg text-sm text-[var(--text)] bg-[var(--bg)] focus:outline-none focus:border-orange-500 ${
            readOnly ? 'opacity-60 cursor-not-allowed' : ''
          }`}
        />
        {suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[var(--text-secondary)]">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Toggle row helper
// ---------------------------------------------------------------------------

function ToggleRow({
  label,
  description,
  enabled,
  onToggle,
}: {
  label: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-center justify-between py-2">
      <div>
        <p className="text-sm font-medium text-[var(--text)]">{label}</p>
        <p className="text-xs text-[var(--text-secondary)] mt-0.5">{description}</p>
      </div>
      <button
        onClick={onToggle}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          enabled ? 'bg-orange-600' : 'bg-gray-200'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm ${
            enabled ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );
}

// ===========================================================================
// Tab 2: 공지사항 관리
// ===========================================================================

function NoticeManagement() {
  const [notices, setNotices] = useState<Notice[]>(mockNotices);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  // Form state
  const [form, setForm] = useState({
    title: '',
    category: '일반' as Notice['category'],
    content: '',
    startDate: '',
    endDate: '',
    pinned: false,
  });

  const openCreate = () => {
    setEditingNotice(null);
    setForm({ title: '', category: '일반', content: '', startDate: '', endDate: '', pinned: false });
    setModalOpen(true);
  };

  const openEdit = (notice: Notice) => {
    setEditingNotice(notice);
    setForm({
      title: notice.title,
      category: notice.category,
      content: notice.content,
      startDate: notice.startDate,
      endDate: notice.endDate,
      pinned: notice.pinned,
    });
    setOpenMenuId(null);
    setModalOpen(true);
  };

  const handleSave = () => {
    if (editingNotice) {
      setNotices((prev) =>
        prev.map((n) =>
          n.id === editingNotice.id
            ? { ...n, ...form, status: n.status }
            : n
        )
      );
    } else {
      const newNotice: Notice = {
        id: `NTC-${String(notices.length + 1).padStart(3, '0')}`,
        ...form,
        status: '게시중',
        author: '한시스템',
        createdAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
      };
      setNotices((prev) => [newNotice, ...prev]);
    }
    setModalOpen(false);
  };

  const handleDelete = (id: string) => {
    setNotices((prev) => prev.filter((n) => n.id !== id));
    setDeleteId(null);
    setOpenMenuId(null);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-[var(--text-secondary)]">
          총 {notices.length}건
        </p>
        <button
          onClick={openCreate}
          className="h-[var(--btn-height)] px-4 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors flex items-center gap-2"
        >
          <Plus size={16} />
          공지 추가
        </button>
      </div>

      {/* Table */}
      <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[var(--bg)] border-b border-[var(--border)]">
                <th className="text-left px-5 py-3 font-medium text-[var(--text-secondary)]">ID</th>
                <th className="text-left px-5 py-3 font-medium text-[var(--text-secondary)]">제목</th>
                <th className="text-left px-5 py-3 font-medium text-[var(--text-secondary)]">카테고리</th>
                <th className="text-left px-5 py-3 font-medium text-[var(--text-secondary)]">상태</th>
                <th className="text-left px-5 py-3 font-medium text-[var(--text-secondary)]">작성자</th>
                <th className="text-left px-5 py-3 font-medium text-[var(--text-secondary)]">작성일</th>
                <th className="text-center px-5 py-3 font-medium text-[var(--text-secondary)]">관리</th>
              </tr>
            </thead>
            <tbody>
              {notices.map((notice) => (
                <tr
                  key={notice.id}
                  className="border-b border-[var(--border)] last:border-b-0 hover:bg-[var(--bg)] transition-colors"
                >
                  <td className="px-5 py-3 text-[var(--text-secondary)] font-mono text-xs">
                    {notice.id}
                  </td>
                  <td className="px-5 py-3 text-[var(--text)] font-medium">
                    <div className="flex items-center gap-2">
                      {notice.pinned && <Pin size={14} className="text-orange-500 shrink-0" />}
                      {notice.title}
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <StatusBadge status={notice.category} colorMap={NOTICE_CATEGORY_COLORS} />
                  </td>
                  <td className="px-5 py-3">
                    <StatusBadge status={notice.status} colorMap={NOTICE_STATUS_COLORS} />
                  </td>
                  <td className="px-5 py-3 text-[var(--text)]">{notice.author}</td>
                  <td className="px-5 py-3 text-[var(--text-secondary)] text-xs">
                    {notice.createdAt}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex justify-center relative">
                      <button
                        onClick={() =>
                          setOpenMenuId(openMenuId === notice.id ? null : notice.id)
                        }
                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors text-[var(--text-secondary)]"
                      >
                        <MoreHorizontal size={16} />
                      </button>
                      {openMenuId === notice.id && (
                        <div className="absolute right-0 top-9 z-20 w-32 bg-[var(--bg-card)] border border-[var(--border)] rounded-lg shadow-lg py-1">
                          <button
                            onClick={() => openEdit(notice)}
                            className="w-full px-3 py-2 text-left text-sm text-[var(--text)] hover:bg-[var(--bg)] flex items-center gap-2"
                          >
                            <Pencil size={14} /> 수정
                          </button>
                          <button
                            onClick={() => {
                              setDeleteId(notice.id);
                              setOpenMenuId(null);
                            }}
                            className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-[var(--bg)] flex items-center gap-2"
                          >
                            <Trash2 size={14} /> 삭제
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setDeleteId(null)} />
          <div className="relative bg-[var(--bg-card)] rounded-xl shadow-xl p-6 max-w-sm mx-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <AlertTriangle size={20} className="text-red-600" />
              </div>
              <h3 className="text-base font-semibold text-[var(--text)]">공지 삭제</h3>
            </div>
            <p className="text-sm text-[var(--text-secondary)] mb-5">
              이 공지사항을 삭제하시겠습니까? 삭제된 공지는 복구할 수 없습니다.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDeleteId(null)}
                className="h-[var(--btn-height)] px-4 border border-[var(--border)] rounded-lg text-sm text-[var(--text)] hover:bg-[var(--bg)] transition-colors"
              >
                취소
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="h-[var(--btn-height)] px-4 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create / Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingNotice ? '공지 수정' : '공지 추가'}
        size="lg"
      >
        <div className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-[var(--text)] mb-1.5">
              제목
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="공지 제목을 입력하세요"
              className="w-full h-[var(--btn-height)] px-3 border border-[var(--border)] rounded-lg text-sm text-[var(--text)] bg-[var(--bg)] focus:outline-none focus:border-orange-500"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-[var(--text)] mb-1.5">
              카테고리
            </label>
            <select
              value={form.category}
              onChange={(e) =>
                setForm((f) => ({ ...f, category: e.target.value as Notice['category'] }))
              }
              className="w-full h-[var(--btn-height)] px-3 border border-[var(--border)] rounded-lg text-sm text-[var(--text)] bg-[var(--bg)] focus:outline-none focus:border-orange-500"
            >
              <option value="일반">일반</option>
              <option value="서비스">서비스</option>
              <option value="점검">점검</option>
            </select>
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-[var(--text)] mb-1.5">
              내용
            </label>
            <textarea
              value={form.content}
              onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
              placeholder="공지 내용을 입력하세요"
              className="w-full h-32 px-3 py-2.5 border border-[var(--border)] rounded-lg text-sm text-[var(--text)] bg-[var(--bg)] focus:outline-none focus:border-orange-500 resize-none"
            />
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--text)] mb-1.5">
                시작일
              </label>
              <input
                type="date"
                value={form.startDate}
                onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))}
                className="w-full h-[var(--btn-height)] px-3 border border-[var(--border)] rounded-lg text-sm text-[var(--text)] bg-[var(--bg)] focus:outline-none focus:border-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--text)] mb-1.5">
                종료일
              </label>
              <input
                type="date"
                value={form.endDate}
                onChange={(e) => setForm((f) => ({ ...f, endDate: e.target.value }))}
                className="w-full h-[var(--btn-height)] px-3 border border-[var(--border)] rounded-lg text-sm text-[var(--text)] bg-[var(--bg)] focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>

          {/* Pin Toggle */}
          <div className="flex items-center justify-between py-1">
            <div className="flex items-center gap-2">
              <Pin size={16} className="text-[var(--text-secondary)]" />
              <span className="text-sm font-medium text-[var(--text)]">상단 고정</span>
            </div>
            <button
              onClick={() => setForm((f) => ({ ...f, pinned: !f.pinned }))}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                form.pinned ? 'bg-orange-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm ${
                  form.pinned ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-2 border-t border-[var(--border)]">
            <button
              onClick={() => setModalOpen(false)}
              className="h-[var(--btn-height)] px-4 border border-[var(--border)] rounded-lg text-sm text-[var(--text)] hover:bg-[var(--bg)] transition-colors"
            >
              취소
            </button>
            <button
              onClick={handleSave}
              className="h-[var(--btn-height)] px-5 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors"
            >
              {editingNotice ? '수정' : '추가'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

// ===========================================================================
// Tab 3: FAQ 관리
// ===========================================================================

function FaqManagement() {
  const [faqs, setFaqs] = useState<Faq[]>(mockFaqs);
  const [selectedCategory, setSelectedCategory] = useState<string>('전체');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<Faq | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const [form, setForm] = useState({
    category: '주문' as Faq['category'],
    question: '',
    answer: '',
    order: 1,
  });

  const filteredFaqs =
    selectedCategory === '전체'
      ? faqs
      : faqs.filter((f) => f.category === selectedCategory);

  const openCreate = () => {
    setEditingFaq(null);
    setForm({ category: '주문', question: '', answer: '', order: faqs.length + 1 });
    setModalOpen(true);
  };

  const openEdit = (faq: Faq) => {
    setEditingFaq(faq);
    setForm({
      category: faq.category,
      question: faq.question,
      answer: faq.answer,
      order: faq.order,
    });
    setOpenMenuId(null);
    setModalOpen(true);
  };

  const handleSave = () => {
    if (editingFaq) {
      setFaqs((prev) =>
        prev.map((f) =>
          f.id === editingFaq.id ? { ...f, ...form, status: f.status } : f
        )
      );
    } else {
      const newFaq: Faq = {
        id: `FAQ-${String(faqs.length + 1).padStart(3, '0')}`,
        ...form,
        status: '게시중',
      };
      setFaqs((prev) => [...prev, newFaq]);
    }
    setModalOpen(false);
  };

  const handleDelete = (id: string) => {
    setFaqs((prev) => prev.filter((f) => f.id !== id));
    setDeleteId(null);
    setOpenMenuId(null);
  };

  const moveUp = (id: string) => {
    setFaqs((prev) => {
      const idx = prev.findIndex((f) => f.id === id);
      if (idx <= 0) return prev;
      const arr = [...prev];
      [arr[idx - 1], arr[idx]] = [arr[idx], arr[idx - 1]];
      return arr.map((f, i) => ({ ...f, order: i + 1 }));
    });
  };

  const moveDown = (id: string) => {
    setFaqs((prev) => {
      const idx = prev.findIndex((f) => f.id === id);
      if (idx < 0 || idx >= prev.length - 1) return prev;
      const arr = [...prev];
      [arr[idx], arr[idx + 1]] = [arr[idx + 1], arr[idx]];
      return arr.map((f, i) => ({ ...f, order: i + 1 }));
    });
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 flex-wrap">
          {FAQ_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 h-[var(--btn-height)] text-sm rounded-full transition-colors ${
                selectedCategory === cat
                  ? 'bg-orange-600 text-white'
                  : 'bg-[var(--bg)] border border-[var(--border)] text-[var(--text-secondary)] hover:bg-gray-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <button
          onClick={openCreate}
          className="h-[var(--btn-height)] px-4 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors flex items-center gap-2"
        >
          <Plus size={16} />
          FAQ 추가
        </button>
      </div>

      {/* Table */}
      <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[var(--bg)] border-b border-[var(--border)]">
                <th className="text-center px-5 py-3 font-medium text-[var(--text-secondary)] w-16">
                  순서
                </th>
                <th className="text-left px-5 py-3 font-medium text-[var(--text-secondary)]">
                  카테고리
                </th>
                <th className="text-left px-5 py-3 font-medium text-[var(--text-secondary)]">
                  질문
                </th>
                <th className="text-left px-5 py-3 font-medium text-[var(--text-secondary)]">
                  답변
                </th>
                <th className="text-left px-5 py-3 font-medium text-[var(--text-secondary)]">
                  상태
                </th>
                <th className="text-center px-5 py-3 font-medium text-[var(--text-secondary)] w-24">
                  정렬
                </th>
                <th className="text-center px-5 py-3 font-medium text-[var(--text-secondary)] w-16">
                  관리
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredFaqs.map((faq, idx) => (
                <tr
                  key={faq.id}
                  className="border-b border-[var(--border)] last:border-b-0 hover:bg-[var(--bg)] transition-colors"
                >
                  <td className="px-5 py-3 text-center text-[var(--text-secondary)] font-mono text-xs">
                    {faq.order}
                  </td>
                  <td className="px-5 py-3">
                    <StatusBadge status={faq.category} />
                  </td>
                  <td className="px-5 py-3 text-[var(--text)] font-medium max-w-xs">
                    <span className="line-clamp-1">{faq.question}</span>
                  </td>
                  <td className="px-5 py-3 text-[var(--text-secondary)] max-w-xs">
                    <span className="line-clamp-1">
                      {faq.answer.length > 50
                        ? faq.answer.slice(0, 50) + '...'
                        : faq.answer}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <StatusBadge
                      status={faq.status}
                      colorMap={{ 게시중: 'emerald', 비게시: 'gray' }}
                    />
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => moveUp(faq.id)}
                        disabled={idx === 0}
                        className="w-7 h-7 flex items-center justify-center rounded hover:bg-gray-100 transition-colors disabled:opacity-30"
                      >
                        <ChevronUp size={16} className="text-[var(--text-secondary)]" />
                      </button>
                      <button
                        onClick={() => moveDown(faq.id)}
                        disabled={idx === filteredFaqs.length - 1}
                        className="w-7 h-7 flex items-center justify-center rounded hover:bg-gray-100 transition-colors disabled:opacity-30"
                      >
                        <ChevronDown size={16} className="text-[var(--text-secondary)]" />
                      </button>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex justify-center relative">
                      <button
                        onClick={() =>
                          setOpenMenuId(openMenuId === faq.id ? null : faq.id)
                        }
                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors text-[var(--text-secondary)]"
                      >
                        <MoreHorizontal size={16} />
                      </button>
                      {openMenuId === faq.id && (
                        <div className="absolute right-0 top-9 z-20 w-32 bg-[var(--bg-card)] border border-[var(--border)] rounded-lg shadow-lg py-1">
                          <button
                            onClick={() => openEdit(faq)}
                            className="w-full px-3 py-2 text-left text-sm text-[var(--text)] hover:bg-[var(--bg)] flex items-center gap-2"
                          >
                            <Pencil size={14} /> 수정
                          </button>
                          <button
                            onClick={() => {
                              setDeleteId(faq.id);
                              setOpenMenuId(null);
                            }}
                            className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-[var(--bg)] flex items-center gap-2"
                          >
                            <Trash2 size={14} /> 삭제
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filteredFaqs.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-[var(--text-secondary)]">
                    해당 카테고리에 등록된 FAQ가 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setDeleteId(null)} />
          <div className="relative bg-[var(--bg-card)] rounded-xl shadow-xl p-6 max-w-sm mx-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <AlertTriangle size={20} className="text-red-600" />
              </div>
              <h3 className="text-base font-semibold text-[var(--text)]">FAQ 삭제</h3>
            </div>
            <p className="text-sm text-[var(--text-secondary)] mb-5">
              이 FAQ를 삭제하시겠습니까? 삭제된 FAQ는 복구할 수 없습니다.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDeleteId(null)}
                className="h-[var(--btn-height)] px-4 border border-[var(--border)] rounded-lg text-sm text-[var(--text)] hover:bg-[var(--bg)] transition-colors"
              >
                취소
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="h-[var(--btn-height)] px-4 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create / Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingFaq ? 'FAQ 수정' : 'FAQ 추가'}
        size="lg"
      >
        <div className="space-y-4">
          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-[var(--text)] mb-1.5">
              카테고리
            </label>
            <select
              value={form.category}
              onChange={(e) =>
                setForm((f) => ({ ...f, category: e.target.value as Faq['category'] }))
              }
              className="w-full h-[var(--btn-height)] px-3 border border-[var(--border)] rounded-lg text-sm text-[var(--text)] bg-[var(--bg)] focus:outline-none focus:border-orange-500"
            >
              <option value="주문">주문</option>
              <option value="배송">배송</option>
              <option value="제품">제품</option>
              <option value="계정">계정</option>
              <option value="기타">기타</option>
            </select>
          </div>

          {/* Question */}
          <div>
            <label className="block text-sm font-medium text-[var(--text)] mb-1.5">
              질문
            </label>
            <input
              type="text"
              value={form.question}
              onChange={(e) => setForm((f) => ({ ...f, question: e.target.value }))}
              placeholder="질문을 입력하세요"
              className="w-full h-[var(--btn-height)] px-3 border border-[var(--border)] rounded-lg text-sm text-[var(--text)] bg-[var(--bg)] focus:outline-none focus:border-orange-500"
            />
          </div>

          {/* Answer */}
          <div>
            <label className="block text-sm font-medium text-[var(--text)] mb-1.5">
              답변
            </label>
            <textarea
              value={form.answer}
              onChange={(e) => setForm((f) => ({ ...f, answer: e.target.value }))}
              placeholder="답변을 입력하세요"
              className="w-full h-32 px-3 py-2.5 border border-[var(--border)] rounded-lg text-sm text-[var(--text)] bg-[var(--bg)] focus:outline-none focus:border-orange-500 resize-none"
            />
          </div>

          {/* Display Order */}
          <div>
            <label className="block text-sm font-medium text-[var(--text)] mb-1.5">
              표시 순서
            </label>
            <input
              type="number"
              min={1}
              value={form.order}
              onChange={(e) =>
                setForm((f) => ({ ...f, order: parseInt(e.target.value) || 1 }))
              }
              className="w-full h-[var(--btn-height)] px-3 border border-[var(--border)] rounded-lg text-sm text-[var(--text)] bg-[var(--bg)] focus:outline-none focus:border-orange-500"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-2 border-t border-[var(--border)]">
            <button
              onClick={() => setModalOpen(false)}
              className="h-[var(--btn-height)] px-4 border border-[var(--border)] rounded-lg text-sm text-[var(--text)] hover:bg-[var(--bg)] transition-colors"
            >
              취소
            </button>
            <button
              onClick={handleSave}
              className="h-[var(--btn-height)] px-5 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors"
            >
              {editingFaq ? '수정' : '추가'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

// ===========================================================================
// Tab 4: 시스템 정보
// ===========================================================================

function SystemInformation() {
  const [visibleEnvs, setVisibleEnvs] = useState<Set<string>>(new Set());

  const toggleEnvVisibility = (name: string) => {
    setVisibleEnvs((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  const sysInfo = mockSystemInfo;

  return (
    <div className="space-y-6">
      {/* Card 1: Platform Versions */}
      <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border)] p-5">
        <div className="flex items-center gap-2 mb-5">
          <Server size={18} className="text-orange-600" />
          <h2 className="text-base font-semibold text-[var(--text)]">플랫폼 버전</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[var(--bg)] border-b border-[var(--border)]">
                <th className="text-left px-5 py-3 font-medium text-[var(--text-secondary)]">
                  서비스
                </th>
                <th className="text-left px-5 py-3 font-medium text-[var(--text-secondary)]">
                  버전
                </th>
                <th className="text-left px-5 py-3 font-medium text-[var(--text-secondary)]">
                  배포일
                </th>
                <th className="text-left px-5 py-3 font-medium text-[var(--text-secondary)]">
                  상태
                </th>
              </tr>
            </thead>
            <tbody>
              {sysInfo.platformVersions.map((pv) => (
                <tr
                  key={pv.name}
                  className="border-b border-[var(--border)] last:border-b-0"
                >
                  <td className="px-5 py-3 text-[var(--text)] font-medium">
                    {pv.name}
                  </td>
                  <td className="px-5 py-3 text-[var(--text)] font-mono text-xs">
                    {pv.version}
                  </td>
                  <td className="px-5 py-3 text-[var(--text-secondary)] text-xs">
                    {pv.deployedAt}
                  </td>
                  <td className="px-5 py-3">
                    <StatusBadge status="정상" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Card 2: Database Stats */}
      <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border)] p-5">
        <div className="flex items-center gap-2 mb-5">
          <Database size={18} className="text-orange-600" />
          <h2 className="text-base font-semibold text-[var(--text)]">데이터베이스</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <DbStatItem label="전체 테이블" value={String(sysInfo.dbStats.tables)} />
          <DbStatItem label="전체 레코드" value={sysInfo.dbStats.rows} />
          <DbStatItem label="DB 용량" value={sysInfo.dbStats.size} />
          <DbStatItem label="마지막 백업" value={sysInfo.dbStats.lastBackup} />
        </div>
      </div>

      {/* Card 3: External Services */}
      <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border)] p-5">
        <div className="flex items-center gap-2 mb-5">
          <Globe size={18} className="text-orange-600" />
          <h2 className="text-base font-semibold text-[var(--text)]">외부 서비스</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[var(--bg)] border-b border-[var(--border)]">
                <th className="text-left px-5 py-3 font-medium text-[var(--text-secondary)]">
                  서비스
                </th>
                <th className="text-left px-5 py-3 font-medium text-[var(--text-secondary)]">
                  상태
                </th>
                <th className="text-left px-5 py-3 font-medium text-[var(--text-secondary)]">
                  응답 시간
                </th>
                <th className="text-left px-5 py-3 font-medium text-[var(--text-secondary)]">
                  마지막 확인
                </th>
              </tr>
            </thead>
            <tbody>
              {sysInfo.externalServices.map((svc) => (
                <tr
                  key={svc.name}
                  className="border-b border-[var(--border)] last:border-b-0"
                >
                  <td className="px-5 py-3 text-[var(--text)] font-medium">
                    {svc.name}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-2.5 h-2.5 rounded-full ${
                          SERVICE_STATUS_DOT[svc.status] ?? 'bg-gray-400'
                        }`}
                      />
                      <span
                        className={`text-sm ${
                          svc.status === '정상'
                            ? 'text-emerald-600'
                            : svc.status === '장애'
                            ? 'text-red-600'
                            : 'text-amber-600'
                        }`}
                      >
                        {svc.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-[var(--text)] font-mono text-xs">
                    {svc.latency}
                  </td>
                  <td className="px-5 py-3 text-[var(--text-secondary)] text-xs">
                    {svc.lastCheck}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Card 4: Environment Variables */}
      <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border)] p-5">
        <div className="flex items-center gap-2 mb-5">
          <Lock size={18} className="text-orange-600" />
          <h2 className="text-base font-semibold text-[var(--text)]">환경 변수</h2>
        </div>
        <div className="space-y-2">
          {ENV_VARS.map((env) => (
            <div
              key={env.name}
              className="flex items-center justify-between px-4 py-2.5 rounded-lg bg-[var(--bg)] border border-[var(--border)]"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-sm font-mono font-medium text-[var(--text)] shrink-0">
                  {env.name}
                </span>
                <span className="text-xs font-mono text-[var(--text-secondary)] truncate">
                  {visibleEnvs.has(env.name) ? env.masked : '************************************'}
                </span>
              </div>
              <button
                onClick={() => toggleEnvVisibility(env.name)}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors text-[var(--text-secondary)] shrink-0"
              >
                {visibleEnvs.has(env.name) ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// DB Stat Item helper
// ---------------------------------------------------------------------------

function DbStatItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-[var(--bg)] rounded-lg border border-[var(--border)] p-4 text-center">
      <p className="text-xs text-[var(--text-secondary)] mb-1">{label}</p>
      <p className="text-lg font-semibold text-[var(--text)]">{value}</p>
    </div>
  );
}
