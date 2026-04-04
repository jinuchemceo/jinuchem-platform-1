'use client';

import { useState } from 'react';
import { Bell, CheckCircle, Package, Truck, AlertTriangle, Settings, Eye, Check } from 'lucide-react';

const tabs = [
  { key: 'all', label: '전체', count: 12 },
  { key: 'unread', label: '읽지않음', count: 5 },
  { key: 'approval', label: '승인', count: 4 },
  { key: 'order', label: '주문/배송', count: 6 },
  { key: 'system', label: '시스템', count: 2 },
];

const notifications = [
  { id: 1, type: 'approval', icon: <CheckCircle size={16} />, iconColor: 'text-yellow-500', bgColor: 'bg-yellow-50', title: '구매 승인 요청', desc: '김연구님이 Sodium hydroxide 1kg x5 구매 승인을 요청했습니다.', time: '10분 전', read: false, action: '승인하기' },
  { id: 2, type: 'approval', icon: <CheckCircle size={16} />, iconColor: 'text-yellow-500', bgColor: 'bg-yellow-50', title: '구매 승인 요청', desc: '박석사님이 PIPES 25G + Toluene 2.5L 구매 승인을 요청했습니다.', time: '2시간 전', read: false, action: '승인하기' },
  { id: 3, type: 'order', icon: <Truck size={16} />, iconColor: 'text-blue-500', bgColor: 'bg-blue-50', title: '배송 출발', desc: 'ORD-2026-0410 주문이 배송 출발했습니다. 내일 도착 예정입니다.', time: '3시간 전', read: false, action: '추적하기' },
  { id: 4, type: 'order', icon: <Package size={16} />, iconColor: 'text-green-500', bgColor: 'bg-green-50', title: '배송 완료', desc: 'ORD-2026-0409 주문이 배송 완료되었습니다. 수령 확인해 주세요.', time: '어제', read: false, action: '확인하기' },
  { id: 5, type: 'system', icon: <AlertTriangle size={16} />, iconColor: 'text-red-500', bgColor: 'bg-red-50', title: '예산 경고', desc: '시약 품목 예산이 80%를 초과했습니다. 잔여: 2,800,000원', time: '어제', read: false, action: '확인하기' },
  { id: 6, type: 'approval', icon: <CheckCircle size={16} />, iconColor: 'text-green-500', bgColor: 'bg-green-50', title: '승인 완료', desc: '이박사님의 Acetone ACS 25mL x10 구매가 승인되었습니다.', time: '2일 전', read: true },
  { id: 7, type: 'order', icon: <Package size={16} />, iconColor: 'text-green-500', bgColor: 'bg-green-50', title: '배송 완료', desc: 'ORD-2026-0408 주문이 배송 완료되었습니다.', time: '3일 전', read: true },
  { id: 8, type: 'approval', icon: <CheckCircle size={16} />, iconColor: 'text-red-500', bgColor: 'bg-red-50', title: '승인 반려', desc: '이박사님의 Dichloromethane 2.5L 구매를 반려했습니다.', time: '4일 전', read: true },
  { id: 9, type: 'order', icon: <Truck size={16} />, iconColor: 'text-blue-500', bgColor: 'bg-blue-50', title: '배송 출발', desc: 'ORD-2026-0405 주문이 배송 출발했습니다.', time: '5일 전', read: true },
  { id: 10, type: 'order', icon: <Package size={16} />, iconColor: 'text-green-500', bgColor: 'bg-green-50', title: '배송 완료', desc: 'ORD-2026-0405 주문이 배송 완료되었습니다.', time: '6일 전', read: true },
  { id: 11, type: 'system', icon: <Bell size={16} />, iconColor: 'text-gray-500', bgColor: 'bg-gray-50', title: '시스템 공지', desc: '4월 정기점검 안내: 4/10(토) 02:00~06:00 서비스 일시 중단', time: '1주 전', read: true },
  { id: 12, type: 'order', icon: <Package size={16} />, iconColor: 'text-green-500', bgColor: 'bg-green-50', title: '주문 접수', desc: 'ORD-2026-0404 주문이 접수되었습니다.', time: '1주 전', read: true },
];

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState('all');

  const filtered = notifications.filter(n => {
    if (activeTab === 'unread') return !n.read;
    if (activeTab !== 'all' && n.type !== activeTab) return false;
    return true;
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900 mb-1">알림 센터</h1>
          <p className="text-sm text-gray-500">모든 알림을 확인하고 관리합니다.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="h-[38px] px-4 bg-white border border-gray-300 text-gray-600 rounded-lg text-sm hover:bg-gray-50 flex items-center gap-1.5">
            <Check size={14} /> 모두 읽음
          </button>
          <button className="h-[38px] px-4 bg-white border border-gray-300 text-gray-600 rounded-lg text-sm hover:bg-gray-50 flex items-center gap-1.5">
            <Settings size={14} /> 알림 설정
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.key ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label} <span className={`ml-1 px-1.5 py-0.5 rounded-full text-xs ${activeTab === tab.key ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'}`}>{tab.count}</span>
          </button>
        ))}
      </div>

      {/* Notification List */}
      <div className="space-y-2">
        {filtered.map(n => (
          <div
            key={n.id}
            className={`flex items-start gap-3 p-4 rounded-xl border transition-colors ${
              n.read ? 'bg-white border-gray-200' : 'bg-blue-50/50 border-blue-200'
            }`}
          >
            <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${n.bgColor}`}>
              <span className={n.iconColor}>{n.icon}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-sm font-medium text-gray-900">{n.title}</span>
                {!n.read && <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />}
              </div>
              <p className="text-sm text-gray-600">{n.desc}</p>
              <span className="text-xs text-gray-400 mt-1 block">{n.time}</span>
            </div>
            {n.action && (
              <button className="h-[30px] px-3 bg-blue-500 text-white rounded-md text-xs font-medium hover:bg-blue-600 flex-shrink-0">
                {n.action}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
