'use client';

import { useState } from 'react';
import { User, Mail, Phone, Building2, FlaskConical, Shield, MapPin, Plus, Trash2, Bell, Package, CreditCard, Truck, AlertTriangle, Tag, Pencil, Search, X } from 'lucide-react';

// 다음 우편번호 API 타입
declare global {
  interface Window {
    daum: {
      Postcode: new (options: {
        oncomplete: (data: {
          zonecode: string;
          roadAddress: string;
          jibunAddress: string;
          buildingName: string;
          apartment: string;
        }) => void;
        width?: string | number;
        height?: string | number;
      }) => { open: () => void };
    };
  }
}

interface Address {
  id: string;
  label: string;
  recipient: string;
  phone: string;
  zonecode: string;
  address: string;
  detail: string;
  memo: string;
  isDefault: boolean;
}

const initialAddresses: Address[] = [
  {
    id: '1',
    label: '연구실',
    recipient: '김연구',
    phone: '055-772-1234',
    zonecode: '52828',
    address: '경상남도 진주시 진주대로501',
    detail: '자연과학대학 3층 302호 유기화학실험실',
    memo: '수위실에 맡겨주세요',
    isDefault: true,
  },
  {
    id: '2',
    label: '사무실',
    recipient: '김연구',
    phone: '055-772-1235',
    zonecode: '52828',
    address: '경상남도 진주시 진주대로501',
    detail: '자연과학대학 2층 203호',
    memo: '',
    isDefault: false,
  },
];

interface NotifSetting {
  key: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  enabled: boolean;
}

export default function MyPage() {
  const [addresses, setAddresses] = useState(initialAddresses);
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [newLabel, setNewLabel] = useState('');
  const [newRecipient, setNewRecipient] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newZonecode, setNewZonecode] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [newDetail, setNewDetail] = useState('');
  const [newMemo, setNewMemo] = useState('');

  // 프로필 수정
  const [showProfileEdit, setShowProfileEdit] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: '김연구', phone: '055-772-1234', department: '화학과', labName: '유기화학실험실',
  });

  const [notifications, setNotifications] = useState<NotifSetting[]>([
    { key: 'quote', label: '견적 알림', description: '견적 도착 및 변경 시 알림', icon: <CreditCard size={16} />, enabled: true },
    { key: 'order', label: '주문 알림', description: '주문 상태 변경 시 알림', icon: <Package size={16} />, enabled: true },
    { key: 'ship', label: '배송 알림', description: '배송 출발, 도착 시 알림', icon: <Truck size={16} />, enabled: true },
    { key: 'stock', label: '재고 알림', description: '시약장 재고 부족 시 알림', icon: <AlertTriangle size={16} />, enabled: false },
    { key: 'promo', label: '프로모션 알림', description: '할인, 이벤트 정보 알림', icon: <Tag size={16} />, enabled: false },
  ]);

  const toggleNotification = (key: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.key === key ? { ...n, enabled: !n.enabled } : n))
    );
  };

  const resetAddressForm = () => {
    setNewLabel(''); setNewRecipient(''); setNewPhone(''); setNewZonecode(''); setNewAddress(''); setNewDetail(''); setNewMemo('');
  };

  const handleAddAddress = () => {
    if (!newLabel || !newRecipient || !newAddress) return;
    if (editingAddressId) {
      setAddresses((prev) => prev.map((a) => a.id === editingAddressId ? { ...a, label: newLabel, recipient: newRecipient, phone: newPhone, zonecode: newZonecode, address: newAddress, detail: newDetail, memo: newMemo } : a));
      setEditingAddressId(null);
    } else {
      const newAddr: Address = { id: String(Date.now()), label: newLabel, recipient: newRecipient, phone: newPhone, zonecode: newZonecode, address: newAddress, detail: newDetail, memo: newMemo, isDefault: false };
      setAddresses((prev) => [...prev, newAddr]);
    }
    setShowAddAddress(false);
    resetAddressForm();
  };

  const startEditAddress = (addr: Address) => {
    setEditingAddressId(addr.id);
    setNewLabel(addr.label); setNewRecipient(addr.recipient); setNewPhone(addr.phone); setNewZonecode(addr.zonecode); setNewAddress(addr.address); setNewDetail(addr.detail); setNewMemo(addr.memo);
    setShowAddAddress(true);
  };

  // 다음 우편번호 API 호출
  const openPostcode = () => {
    if (!window.daum) {
      // 스크립트 동적 로드
      const script = document.createElement('script');
      script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
      script.onload = () => execPostcode();
      document.head.appendChild(script);
    } else {
      execPostcode();
    }
  };

  const execPostcode = () => {
    new window.daum.Postcode({
      oncomplete: (data) => {
        const fullAddress = data.roadAddress || data.jibunAddress;
        setNewZonecode(data.zonecode);
        setNewAddress(fullAddress + (data.buildingName ? ` (${data.buildingName})` : ''));
      },
    }).open();
  };

  const removeAddress = (id: string) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
  };

  const setDefaultAddress = (id: string) => {
    setAddresses((prev) =>
      prev.map((a) => ({ ...a, isDefault: a.id === id }))
    );
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--text)]">마이페이지</h1>
      </div>

      <div className="space-y-6 max-w-[800px]">
        {/* Profile Section */}
        <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border)] p-6">
          <h2 className="text-lg font-semibold text-[var(--text)] mb-5">프로필 정보</h2>
          <div className="flex items-start gap-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-white text-2xl font-bold shrink-0">
              K
            </div>
            <div className="flex-1 grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-3">
                <User size={16} className="text-[var(--text-secondary)]" />
                <div>
                  <p className="text-xs text-[var(--text-secondary)]">이름</p>
                  <p className="font-medium text-[var(--text)]">김연구</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={16} className="text-[var(--text-secondary)]" />
                <div>
                  <p className="text-xs text-[var(--text-secondary)]">이메일</p>
                  <p className="font-medium text-[var(--text)]">kim.research@gnu.ac.kr</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={16} className="text-[var(--text-secondary)]" />
                <div>
                  <p className="text-xs text-[var(--text-secondary)]">전화번호</p>
                  <p className="font-medium text-[var(--text)]">055-772-1234</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Building2 size={16} className="text-[var(--text-secondary)]" />
                <div>
                  <p className="text-xs text-[var(--text-secondary)]">소속 기관</p>
                  <p className="font-medium text-[var(--text)]">경상국립대학교 화학과</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FlaskConical size={16} className="text-[var(--text-secondary)]" />
                <div>
                  <p className="text-xs text-[var(--text-secondary)]">연구실</p>
                  <p className="font-medium text-[var(--text)]">유기화학실험실</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Shield size={16} className="text-[var(--text-secondary)]" />
                <div>
                  <p className="text-xs text-[var(--text-secondary)]">역할</p>
                  <p className="font-medium text-[var(--text)]">
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">연구원</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
          <button
            onClick={() => setShowProfileEdit(true)}
            className="mt-5 h-[38px] px-4 border border-[var(--border)] text-sm text-[var(--text)] rounded-lg hover:border-blue-400 flex items-center gap-1.5"
          >
            <Pencil size={14} /> 프로필 수정
          </button>
        </div>

        {/* Shipping Addresses */}
        <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border)] p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold text-[var(--text)]">배송지 관리</h2>
            <button
              onClick={() => setShowAddAddress(true)}
              className="h-[38px] px-4 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 flex items-center gap-1.5"
            >
              <Plus size={14} /> 배송지 추가
            </button>
          </div>

          <div className="space-y-3">
            {addresses.map((addr) => (
              <div
                key={addr.id}
                className={`p-4 rounded-lg border transition-colors ${
                  addr.isDefault ? 'border-blue-300 bg-blue-50' : 'border-[var(--border)]'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold text-[var(--text)]">{addr.label}</span>
                      {addr.isDefault && (
                        <span className="px-2 py-0.5 bg-blue-600 text-white text-[10px] font-medium rounded">기본</span>
                      )}
                    </div>
                    <p className="text-sm text-[var(--text)]">{addr.recipient} / {addr.phone}</p>
                    <p className="text-sm text-[var(--text-secondary)]">[{addr.zonecode}] {addr.address}</p>
                    <p className="text-sm text-[var(--text-secondary)]">{addr.detail}</p>
                    {addr.memo && <p className="text-xs text-amber-600 mt-1">메모: {addr.memo}</p>}
                  </div>
                  <div className="flex items-center gap-1">
                    {!addr.isDefault && (
                      <button
                        onClick={() => setDefaultAddress(addr.id)}
                        className="h-[30px] px-3 border border-[var(--border)] text-xs text-[var(--text-secondary)] rounded-lg hover:border-blue-400"
                      >
                        기본설정
                      </button>
                    )}
                    <button
                      onClick={() => startEditAddress(addr)}
                      className="h-[30px] w-[30px] border border-[var(--border)] rounded-lg flex items-center justify-center text-[var(--text-secondary)] hover:text-blue-500 hover:border-blue-300"
                      title="수정"
                    >
                      <Pencil size={12} />
                    </button>
                    <button
                      onClick={() => removeAddress(addr.id)}
                      className="h-[30px] w-[30px] border border-[var(--border)] rounded-lg flex items-center justify-center text-[var(--text-secondary)] hover:text-red-500 hover:border-red-300"
                      title="삭제"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add/Edit Address Form */}
          {showAddAddress && (
            <div className="mt-4 p-5 border border-blue-200 bg-blue-50/30 rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-[var(--text)]">{editingAddressId ? '배송지 수정' : '새 배송지 추가'}</h3>
                <button onClick={() => { setShowAddAddress(false); setEditingAddressId(null); resetAddressForm(); }} className="text-[var(--text-secondary)] hover:text-[var(--text)]"><X size={16} /></button>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs text-[var(--text-secondary)] mb-1">배송지명 *</label>
                  <input type="text" value={newLabel} onChange={(e) => setNewLabel(e.target.value)} placeholder="예: 연구실" className="w-full h-[38px] px-3 border border-[var(--border)] rounded-lg bg-white text-sm text-[var(--text)]" />
                </div>
                <div>
                  <label className="block text-xs text-[var(--text-secondary)] mb-1">수령인 *</label>
                  <input type="text" value={newRecipient} onChange={(e) => setNewRecipient(e.target.value)} placeholder="이름" className="w-full h-[38px] px-3 border border-[var(--border)] rounded-lg bg-white text-sm text-[var(--text)]" />
                </div>
                <div>
                  <label className="block text-xs text-[var(--text-secondary)] mb-1">연락처</label>
                  <input type="text" value={newPhone} onChange={(e) => setNewPhone(e.target.value)} placeholder="전화번호" className="w-full h-[38px] px-3 border border-[var(--border)] rounded-lg bg-white text-sm text-[var(--text)]" />
                </div>
              </div>
              <div>
                <label className="block text-xs text-[var(--text-secondary)] mb-1">주소 *</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newZonecode}
                    readOnly
                    placeholder="우편번호"
                    className="w-[120px] h-[38px] px-3 border border-[var(--border)] rounded-lg bg-gray-50 text-sm text-[var(--text)] cursor-default"
                  />
                  <button
                    type="button"
                    onClick={openPostcode}
                    className="h-[38px] px-4 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 flex items-center gap-1.5"
                  >
                    <Search size={14} /> 주소 찾기
                  </button>
                </div>
                <input
                  type="text"
                  value={newAddress}
                  readOnly
                  placeholder="주소 찾기 버튼을 클릭하세요"
                  className="w-full h-[38px] px-3 border border-[var(--border)] rounded-lg bg-gray-50 text-sm text-[var(--text)] cursor-default"
                />
              </div>
              <div>
                <label className="block text-xs text-[var(--text-secondary)] mb-1">상세 주소</label>
                <input type="text" value={newDetail} onChange={(e) => setNewDetail(e.target.value)} placeholder="건물명, 층, 호, 실험실 등" className="w-full h-[38px] px-3 border border-[var(--border)] rounded-lg bg-white text-sm text-[var(--text)]" />
              </div>
              <div>
                <label className="block text-xs text-[var(--text-secondary)] mb-1">배송 메모</label>
                <input type="text" value={newMemo} onChange={(e) => setNewMemo(e.target.value)} placeholder="예: 수위실에 맡겨주세요, 부재 시 연락 바랍니다" className="w-full h-[38px] px-3 border border-[var(--border)] rounded-lg bg-white text-sm text-[var(--text)]" />
              </div>
              <div className="flex gap-2 pt-1">
                <button onClick={() => { setShowAddAddress(false); setEditingAddressId(null); resetAddressForm(); }} className="h-[38px] px-4 border border-[var(--border)] text-sm text-[var(--text-secondary)] rounded-lg hover:border-blue-400">취소</button>
                <button onClick={handleAddAddress} className="h-[38px] px-4 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700">{editingAddressId ? '수정 완료' : '추가'}</button>
              </div>
            </div>
          )}
        </div>

        {/* Notification Settings */}
        <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border)] p-6">
          <h2 className="text-lg font-semibold text-[var(--text)] mb-5 flex items-center gap-2">
            <Bell size={18} /> 알림 설정
          </h2>
          <div className="space-y-3">
            {notifications.map((notif) => (
              <div key={notif.key} className="flex items-center justify-between py-3 border-b border-[var(--border)] last:border-0">
                <div className="flex items-center gap-3">
                  <span className="text-[var(--text-secondary)]">{notif.icon}</span>
                  <div>
                    <p className="text-sm font-medium text-[var(--text)]">{notif.label}</p>
                    <p className="text-xs text-[var(--text-secondary)]">{notif.description}</p>
                  </div>
                </div>
                <button
                  onClick={() => toggleNotification(notif.key)}
                  className={`w-11 h-6 rounded-full transition-colors relative ${
                    notif.enabled ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                      notif.enabled ? 'translate-x-[22px]' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Profile Edit Modal */}
      {showProfileEdit && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center" onClick={() => setShowProfileEdit(false)}>
          <div className="bg-[var(--bg-card)] rounded-2xl w-[480px] p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-[var(--text)]">프로필 수정</h2>
              <button onClick={() => setShowProfileEdit(false)} className="text-[var(--text-secondary)] hover:text-[var(--text)]"><X size={18} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--text)] mb-1">이름</label>
                <input type="text" value={profileForm.name} onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })} className="w-full h-[38px] px-3 border border-[var(--border)] rounded-lg bg-[var(--bg)] text-sm text-[var(--text)]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text)] mb-1">전화번호</label>
                <input type="text" value={profileForm.phone} onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })} className="w-full h-[38px] px-3 border border-[var(--border)] rounded-lg bg-[var(--bg)] text-sm text-[var(--text)]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text)] mb-1">부서/학과</label>
                <input type="text" value={profileForm.department} onChange={(e) => setProfileForm({ ...profileForm, department: e.target.value })} className="w-full h-[38px] px-3 border border-[var(--border)] rounded-lg bg-[var(--bg)] text-sm text-[var(--text)]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text)] mb-1">연구실명</label>
                <input type="text" value={profileForm.labName} onChange={(e) => setProfileForm({ ...profileForm, labName: e.target.value })} className="w-full h-[38px] px-3 border border-[var(--border)] rounded-lg bg-[var(--bg)] text-sm text-[var(--text)]" />
              </div>
              <div className="flex gap-2 pt-2">
                <button onClick={() => setShowProfileEdit(false)} className="flex-1 h-[38px] border border-[var(--border)] text-sm rounded-lg text-[var(--text)]">취소</button>
                <button onClick={() => setShowProfileEdit(false)} className="flex-1 h-[38px] bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700">저장</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
