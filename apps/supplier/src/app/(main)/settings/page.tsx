'use client';

import {
  User,
  Bell,
  Users,
  Truck,
  Code,
  FileText,
} from 'lucide-react';

const settingsCards = [
  { icon: <User size={24} />, title: '공급사 프로필', desc: '회사 정보, 로고, 소개, 영업시간', color: 'bg-purple-50 text-purple-600' },
  { icon: <Bell size={24} />, title: '알림 설정', desc: '유형별 알림 on/off, 수신 방법', color: 'bg-blue-50 text-blue-600' },
  { icon: <Users size={24} />, title: '담당자 관리', desc: '담당자 추가/삭제, 역할 설정', color: 'bg-green-50 text-green-600' },
  { icon: <Truck size={24} />, title: '배송 설정', desc: '택배사, 배송비, 마감시간, 출고불가일', color: 'bg-amber-50 text-amber-600' },
  { icon: <Code size={24} />, title: 'API 연동', desc: 'ERP/WMS 연동, 웹훅 설정', color: 'bg-indigo-50 text-indigo-600' },
  { icon: <FileText size={24} />, title: '세금/증빙', desc: '사업자등록증, 통장사본, 세금계산서', color: 'bg-red-50 text-red-600' },
];

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[var(--text)]">설정</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {settingsCards.map(card => (
          <div
            key={card.title}
            className="bg-[var(--card-bg)] border border-[var(--border)] rounded-xl p-8 text-center cursor-pointer hover:shadow-lg hover:-translate-y-0.5 transition-all"
          >
            <div className={`w-12 h-12 rounded-xl ${card.color} flex items-center justify-center mx-auto mb-3`}>
              {card.icon}
            </div>
            <h3 className="text-[15px] font-bold mb-1">{card.title}</h3>
            <p className="text-xs text-[var(--text-secondary)]">{card.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
