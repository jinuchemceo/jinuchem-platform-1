'use client';

import { useState } from 'react';
import {
  Building2,
  Users,
  Truck,
  Code,
  FileText,
} from 'lucide-react';

type Tab = 'profile' | 'staff' | 'shipping' | 'api' | 'tax';

const tabs: { label: string; value: Tab; icon: React.ReactNode }[] = [
  { label: '회사 정보', value: 'profile', icon: <Building2 size={16} /> },
  { label: '담당자', value: 'staff', icon: <Users size={16} /> },
  { label: '배송 설정', value: 'shipping', icon: <Truck size={16} /> },
  { label: 'API 연동', value: 'api', icon: <Code size={16} /> },
  { label: '세금/증빙', value: 'tax', icon: <FileText size={16} /> },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('profile');

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>회사 관리</h1>

      {/* Tabs */}
      <div className="flex gap-1 border-b" style={{ borderColor: 'var(--border)' }}>
        {tabs.map(tab => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors"
            style={{
              borderColor: activeTab === tab.value ? 'var(--primary)' : 'transparent',
              color: activeTab === tab.value ? 'var(--primary)' : 'var(--text-secondary)',
            }}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white text-xl font-bold">S</div>
            <div><h3 className="text-lg font-bold" style={{ color: 'var(--text)' }}>Sigma-Aldrich Korea</h3><button className="text-xs font-semibold mt-1" style={{ color: 'var(--primary)' }}>로고 변경</button></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            {[
              { label: '상호명', value: 'Sigma-Aldrich Korea Co., Ltd.' },
              { label: '사업자번호', value: '120-86-12345' },
              { label: '대표자', value: 'John Smith' },
              { label: '대표전화', value: '02-1234-5678' },
              { label: '이메일', value: 'supplier@sigmaaldrich.co.kr' },
              { label: '영업시간', value: '평일 09:00 ~ 18:00' },
            ].map(item => (
              <div key={item.label}>
                <label className="text-xs font-semibold block mb-1" style={{ color: 'var(--text-secondary)' }}>{item.label}</label>
                <input type="text" defaultValue={item.value} className="w-full h-[38px] px-3 border rounded-lg text-sm focus:outline-none" style={{ borderColor: 'var(--border)', color: 'var(--text)', background: 'var(--bg-card)' }} />
              </div>
            ))}
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold block mb-1" style={{ color: 'var(--text-secondary)' }}>주소</label>
              <input type="text" defaultValue="서울특별시 강남구 테헤란로 152, 강남파이낸스센터 22층" className="w-full h-[38px] px-3 border rounded-lg text-sm focus:outline-none" style={{ borderColor: 'var(--border)', color: 'var(--text)', background: 'var(--bg-card)' }} />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold block mb-1" style={{ color: 'var(--text-secondary)' }}>회사 소개</label>
              <textarea defaultValue="글로벌 화학/생명과학 시약 공급 전문 기업" className="w-full h-20 px-3 py-2 border rounded-lg text-sm resize-none focus:outline-none" style={{ borderColor: 'var(--border)', color: 'var(--text)', background: 'var(--bg-card)' }} />
            </div>
          </div>
          <div className="flex justify-end pt-2"><button className="px-5 h-[38px] rounded-lg text-sm font-semibold text-white" style={{ background: 'var(--primary)' }}>저장</button></div>
        </div>
      )}

      {/* Staff Tab */}
      {activeTab === 'staff' && (
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold" style={{ color: 'var(--text)' }}>담당자 목록</h3>
            <button className="px-4 h-[38px] rounded-lg text-sm font-semibold text-white" style={{ background: 'var(--primary)' }}>+ 담당자 추가</button>
          </div>
          <table className="w-full text-sm">
            <thead><tr className="border-b-2" style={{ borderColor: 'var(--border)' }}><th className="text-left px-4 py-3 font-semibold" style={{ color: 'var(--text-secondary)' }}>이름</th><th className="text-left px-4 py-3 font-semibold" style={{ color: 'var(--text-secondary)' }}>역할</th><th className="text-left px-4 py-3 font-semibold" style={{ color: 'var(--text-secondary)' }}>이메일</th><th className="text-left px-4 py-3 font-semibold" style={{ color: 'var(--text-secondary)' }}>최근 로그인</th><th className="text-center px-4 py-3 font-semibold" style={{ color: 'var(--text-secondary)' }}>관리</th></tr></thead>
            <tbody>
              {[
                { name: '김공급', role: '관리자', email: 'kim@sigma.co.kr', lastLogin: '2026-04-02' },
                { name: '이담당', role: '주문/배송', email: 'lee@sigma.co.kr', lastLogin: '2026-04-02' },
                { name: '박담당', role: '상품/가격', email: 'park@sigma.co.kr', lastLogin: '2026-04-01' },
                { name: '최담당', role: 'CS/문의', email: 'choi@sigma.co.kr', lastLogin: '2026-04-01' },
              ].map(s => (
                <tr key={s.name} className="border-b" style={{ borderColor: 'var(--border)' }}>
                  <td className="px-4 py-3 font-medium" style={{ color: 'var(--text)' }}>{s.name}</td>
                  <td className="px-4 py-3"><span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>{s.role}</span></td>
                  <td className="px-4 py-3" style={{ color: 'var(--text-secondary)' }}>{s.email}</td>
                  <td className="px-4 py-3" style={{ color: 'var(--text-secondary)' }}>{s.lastLogin}</td>
                  <td className="px-4 py-3 text-center"><button className="text-xs font-semibold px-3 py-1 rounded-lg border hover:bg-gray-50" style={{ borderColor: 'var(--border)', color: 'var(--text)' }}>수정</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Shipping Tab */}
      {activeTab === 'shipping' && (
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div><label className="text-xs font-semibold block mb-1" style={{ color: 'var(--text-secondary)' }}>기본 택배사</label><select className="w-full h-[38px] px-3 border rounded-lg text-sm" style={{ borderColor: 'var(--border)', color: 'var(--text)', background: 'var(--bg-card)' }}><option>CJ대한통운</option><option>로젠택배</option><option>한진택배</option><option>우체국</option></select></div>
            <div><label className="text-xs font-semibold block mb-1" style={{ color: 'var(--text-secondary)' }}>배송비 정책</label><select className="w-full h-[38px] px-3 border rounded-lg text-sm" style={{ borderColor: 'var(--border)', color: 'var(--text)', background: 'var(--bg-card)' }}><option>50,000원 이상 무료배송</option><option>무조건 무료배송</option><option>유료배송 (3,000원)</option></select></div>
            <div><label className="text-xs font-semibold block mb-1" style={{ color: 'var(--text-secondary)' }}>당일출고 마감시간</label><input type="time" defaultValue="15:00" className="w-full h-[38px] px-3 border rounded-lg text-sm" style={{ borderColor: 'var(--border)', color: 'var(--text)', background: 'var(--bg-card)' }} /></div>
            <div><label className="text-xs font-semibold block mb-1" style={{ color: 'var(--text-secondary)' }}>출고 불가일</label><input type="text" defaultValue="토, 일, 공휴일" className="w-full h-[38px] px-3 border rounded-lg text-sm" style={{ borderColor: 'var(--border)', color: 'var(--text)', background: 'var(--bg-card)' }} /></div>
            <div className="sm:col-span-2"><label className="text-xs font-semibold block mb-1" style={{ color: 'var(--text-secondary)' }}>반품 주소</label><input type="text" defaultValue="경기도 평택시 포승읍 물류단지로 88" className="w-full h-[38px] px-3 border rounded-lg text-sm" style={{ borderColor: 'var(--border)', color: 'var(--text)', background: 'var(--bg-card)' }} /></div>
          </div>
          <div className="flex justify-end pt-2"><button className="px-5 h-[38px] rounded-lg text-sm font-semibold text-white" style={{ background: 'var(--primary)' }}>저장</button></div>
        </div>
      )}

      {/* API Tab */}
      {activeTab === 'api' && (
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center justify-between p-4 border rounded-xl" style={{ borderColor: 'var(--border)' }}><div><p className="font-medium" style={{ color: 'var(--text)' }}>ERP 연동</p><p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>SAP ERP</p></div><span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-semibold">연결됨</span></div>
            <div className="flex items-center justify-between p-4 border rounded-xl" style={{ borderColor: 'var(--border)' }}><div><p className="font-medium" style={{ color: 'var(--text)' }}>WMS 연동</p><p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>창고관리</p></div><span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-semibold">연결됨</span></div>
          </div>
          <div><label className="text-xs font-semibold block mb-1" style={{ color: 'var(--text-secondary)' }}>웹훅 URL</label><input type="text" defaultValue="https://api.sigma.co.kr/webhook" className="w-full h-[38px] px-3 border rounded-lg text-sm font-mono" style={{ borderColor: 'var(--border)', color: 'var(--text)', background: 'var(--bg-card)' }} /></div>
          <div><label className="text-xs font-semibold block mb-1" style={{ color: 'var(--text-secondary)' }}>API Key</label><div className="flex gap-2"><input type="text" defaultValue="jk_a1b2c3d4e5f6..." className="flex-1 h-[38px] px-3 border rounded-lg text-sm font-mono" style={{ borderColor: 'var(--border)', color: 'var(--text)', background: 'var(--bg-card)' }} readOnly /><button className="px-4 h-[38px] rounded-lg text-sm font-semibold border hover:bg-gray-50" style={{ borderColor: 'var(--border)', color: 'var(--text)' }}>재발급</button></div></div>
          <div className="flex justify-end pt-2"><button className="px-5 h-[38px] rounded-lg text-sm font-semibold text-white" style={{ background: 'var(--primary)' }}>저장</button></div>
        </div>
      )}

      {/* Tax Tab */}
      {activeTab === 'tax' && (
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { name: '사업자등록증', status: '등록 완료' },
              { name: '통장사본', status: '등록 완료' },
              { name: '통신판매업 신고증', status: '등록 완료' },
            ].map(doc => (
              <div key={doc.name} className="border rounded-xl p-5 text-center" style={{ borderColor: 'var(--border)' }}>
                <FileText size={24} className="mx-auto mb-2" style={{ color: 'var(--text-secondary)' }} />
                <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{doc.name}</p>
                <p className="text-xs mt-1 text-green-600 font-semibold">{doc.status}</p>
                <button className="mt-3 text-xs font-semibold px-3 py-1 rounded-lg" style={{ color: 'var(--primary)', background: 'var(--primary-light)' }}>변경</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
