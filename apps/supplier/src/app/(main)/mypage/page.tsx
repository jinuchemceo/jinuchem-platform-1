'use client';

import {
  User,
  Mail,
  Phone,
  Shield,
  Bell,
} from 'lucide-react';

export default function MyPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>마이페이지</h1>

      {/* Profile Card */}
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-6">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white text-2xl font-bold">
            S
          </div>
          <div>
            <h2 className="text-xl font-bold" style={{ color: 'var(--text)' }}>김공급</h2>
            <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Sigma-Aldrich Korea / 공급사 관리자</p>
            <span className="inline-block mt-2 text-[11px] font-semibold px-2.5 py-0.5 rounded-full"
              style={{ background: 'rgba(52,199,89,0.15)', color: '#34C759' }}>
              Premium
            </span>
          </div>
          <button className="ml-auto px-4 h-[38px] rounded-lg text-sm font-semibold border transition-colors hover:bg-gray-50"
            style={{ borderColor: 'var(--border)', color: 'var(--text)' }}>
            프로필 수정
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Account Info */}
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-6">
          <h3 className="text-base font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--text)' }}>
            <Shield size={18} style={{ color: 'var(--text-secondary)' }} /> 계정 정보
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between"><span style={{ color: 'var(--text-secondary)' }}>아이디</span><span className="font-medium" style={{ color: 'var(--text)' }}>sigma_korea</span></div>
            <div className="flex items-center justify-between"><span style={{ color: 'var(--text-secondary)' }}>이름</span><span className="font-medium" style={{ color: 'var(--text)' }}>김공급</span></div>
            <div className="flex items-center justify-between"><span style={{ color: 'var(--text-secondary)' }}>역할</span><span className="font-medium" style={{ color: 'var(--text)' }}>공급사 관리자</span></div>
            <div className="flex items-center justify-between"><span style={{ color: 'var(--text-secondary)' }}>가입일</span><span className="font-medium" style={{ color: 'var(--text)' }}>2025-06-15</span></div>
            <div className="flex items-center justify-between"><span style={{ color: 'var(--text-secondary)' }}>비밀번호</span><button className="text-xs font-semibold px-3 py-1 rounded-lg" style={{ color: 'var(--primary)', background: 'var(--primary-light)' }}>변경</button></div>
          </div>
        </div>

        {/* Contact */}
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-6">
          <h3 className="text-base font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--text)' }}>
            <Mail size={18} style={{ color: 'var(--text-secondary)' }} /> 연락처
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-3"><Phone size={16} style={{ color: 'var(--text-secondary)' }} /><span style={{ color: 'var(--text-secondary)' }}>전화번호</span><span className="font-medium" style={{ color: 'var(--text)' }}>010-1234-5678</span></div>
            <div className="flex items-center gap-3"><Mail size={16} style={{ color: 'var(--text-secondary)' }} /><span style={{ color: 'var(--text-secondary)' }}>이메일</span><span className="font-medium" style={{ color: 'var(--text)' }}>kim@sigmaaldrich.co.kr</span></div>
          </div>
        </div>

        {/* Notification Preferences */}
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-6 lg:col-span-2">
          <h3 className="text-base font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--text)' }}>
            <Bell size={18} style={{ color: 'var(--text-secondary)' }} /> 알림 설정
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            {[
              { label: '신규 주문 알림', checked: true },
              { label: '견적 요청 알림', checked: true },
              { label: '문의/리뷰 알림', checked: true },
              { label: '재고 부족 알림', checked: true },
              { label: '정산 완료 알림', checked: false },
              { label: '마케팅 알림', checked: false },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between">
                <span style={{ color: 'var(--text)' }}>{item.label}</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked={item.checked} className="sr-only peer" />
                  <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:bg-purple-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full" />
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
