'use client';

import { useState } from 'react';
import { User, Mail, Phone, Building2, FlaskConical, Shield, MapPin, Plus, Trash2, Bell, Package, CreditCard, Truck, AlertTriangle, Tag } from 'lucide-react';

interface Address {
  id: string;
  label: string;
  recipient: string;
  phone: string;
  address: string;
  detail: string;
  isDefault: boolean;
}

const initialAddresses: Address[] = [
  {
    id: '1',
    label: '연구실',
    recipient: '김연구',
    phone: '055-772-1234',
    address: '경상남도 진주시 진주대로501',
    detail: '자연과학대학 3층 302호 유기화학실험실',
    isDefault: true,
  },
  {
    id: '2',
    label: '사무실',
    recipient: '김연구',
    phone: '055-772-1235',
    address: '경상남도 진주시 진주대로501',
    detail: '자연과학대학 2층 203호',
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
  const [newLabel, setNewLabel] = useState('');
  const [newRecipient, setNewRecipient] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [newDetail, setNewDetail] = useState('');

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

  const handleAddAddress = () => {
    if (!newLabel || !newRecipient || !newAddress) return;
    const newAddr: Address = {
      id: String(Date.now()),
      label: newLabel,
      recipient: newRecipient,
      phone: newPhone,
      address: newAddress,
      detail: newDetail,
      isDefault: false,
    };
    setAddresses((prev) => [...prev, newAddr]);
    setShowAddAddress(false);
    setNewLabel(''); setNewRecipient(''); setNewPhone(''); setNewAddress(''); setNewDetail('');
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
          <button className="mt-5 h-[38px] px-4 border border-[var(--border)] text-sm text-[var(--text-secondary)] rounded-lg hover:border-blue-400">
            프로필 수정
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
                    <p className="text-sm text-[var(--text-secondary)]">{addr.address}</p>
                    <p className="text-sm text-[var(--text-secondary)]">{addr.detail}</p>
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
                      onClick={() => removeAddress(addr.id)}
                      className="h-[30px] w-[30px] border border-[var(--border)] rounded-lg flex items-center justify-center text-[var(--text-secondary)] hover:text-red-500 hover:border-red-300"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add Address Form */}
          {showAddAddress && (
            <div className="mt-4 p-4 border border-dashed border-[var(--border)] rounded-lg space-y-3">
              <h3 className="text-sm font-semibold text-[var(--text)]">새 배송지 추가</h3>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs text-[var(--text-secondary)] mb-1">배송지명</label>
                  <input type="text" value={newLabel} onChange={(e) => setNewLabel(e.target.value)} placeholder="예: 연구실" className="w-full h-[38px] px-3 border border-[var(--border)] rounded-lg bg-[var(--bg)] text-sm text-[var(--text)]" />
                </div>
                <div>
                  <label className="block text-xs text-[var(--text-secondary)] mb-1">수령인</label>
                  <input type="text" value={newRecipient} onChange={(e) => setNewRecipient(e.target.value)} placeholder="이름" className="w-full h-[38px] px-3 border border-[var(--border)] rounded-lg bg-[var(--bg)] text-sm text-[var(--text)]" />
                </div>
                <div>
                  <label className="block text-xs text-[var(--text-secondary)] mb-1">연락처</label>
                  <input type="text" value={newPhone} onChange={(e) => setNewPhone(e.target.value)} placeholder="전화번호" className="w-full h-[38px] px-3 border border-[var(--border)] rounded-lg bg-[var(--bg)] text-sm text-[var(--text)]" />
                </div>
              </div>
              <div>
                <label className="block text-xs text-[var(--text-secondary)] mb-1">주소</label>
                <input type="text" value={newAddress} onChange={(e) => setNewAddress(e.target.value)} placeholder="기본 주소" className="w-full h-[38px] px-3 border border-[var(--border)] rounded-lg bg-[var(--bg)] text-sm text-[var(--text)]" />
              </div>
              <div>
                <label className="block text-xs text-[var(--text-secondary)] mb-1">상세 주소</label>
                <input type="text" value={newDetail} onChange={(e) => setNewDetail(e.target.value)} placeholder="상세 주소" className="w-full h-[38px] px-3 border border-[var(--border)] rounded-lg bg-[var(--bg)] text-sm text-[var(--text)]" />
              </div>
              <div className="flex gap-2">
                <button onClick={() => setShowAddAddress(false)} className="h-[38px] px-4 border border-[var(--border)] text-sm text-[var(--text-secondary)] rounded-lg hover:border-blue-400">취소</button>
                <button onClick={handleAddAddress} className="h-[38px] px-4 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700">추가</button>
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
    </div>
  );
}
