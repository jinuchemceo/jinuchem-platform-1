'use client';

import { useState } from 'react';
import {
  MessageSquare,
  Star,
  Send,
  Paperclip,
  X,
} from 'lucide-react';

type InquiryStatus = '미답변' | '답변완료';
type InquiryType = '제품' | '주문' | '배송' | '가격' | '기타';

interface Inquiry {
  id: string;
  type: InquiryType;
  title: string;
  requester: string;
  org: string;
  orderId?: string;
  date: string;
  status: InquiryStatus;
}

interface Review {
  id: string;
  product: string;
  rating: number;
  author: string;
  org: string;
  content: string;
  date: string;
  reply?: string;
}

interface ChatRoom {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  unread: number;
}

const sampleInquiries: Inquiry[] = [
  { id: 'INQ-001', type: '제품', title: 'Ethyl alcohol COA 요청', requester: '김연구', org: '서울대', orderId: 'ORD-0401-012', date: '2026-04-02', status: '미답변' },
  { id: 'INQ-002', type: '배송', title: '배송 지연 문의', requester: '이박사', org: 'KAIST', orderId: 'ORD-0330-008', date: '2026-04-01', status: '미답변' },
  { id: 'INQ-003', type: '가격', title: '대량 구매 할인 문의', requester: '최과장', org: 'LG화학', date: '2026-04-01', status: '미답변' },
  { id: 'INQ-004', type: '제품', title: 'Methanol 재입고 일정', requester: '박연구', org: '포항공대', date: '2026-03-30', status: '답변완료' },
  { id: 'INQ-005', type: '주문', title: '주문 수량 변경 요청', requester: '정연구', org: '연세대', orderId: 'ORD-0328-003', date: '2026-03-29', status: '답변완료' },
];

const sampleReviews: Review[] = [
  { id: 'R-001', product: 'Ethyl alcohol, Pure 500mL', rating: 5, author: '김연구', org: '서울대', content: '순도가 높고 배송이 빨라서 항상 만족합니다. 연구실에서 자주 사용하는 시약이라 재주문도 편리해요.', date: '2026-04-01' },
  { id: 'R-002', product: 'Acetone, ACS Reagent 2.5L', rating: 4, author: '이박사', org: 'KAIST', content: '품질은 좋으나 포장이 좀 아쉽습니다. 배송 중 외부 박스가 찌그러져 있었어요.', date: '2026-03-29', reply: '불편을 드려 죄송합니다. 포장 개선하도록 하겠습니다.' },
  { id: 'R-003', product: 'Dichloromethane, ACS 2.5L', rating: 5, author: '박연구', org: '포항공대', content: 'ACS 등급답게 순도가 정확하고 실험 결과가 일관됩니다.', date: '2026-03-27' },
  { id: 'R-004', product: 'NaOH pellets 1kg', rating: 3, author: '최과장', org: 'LG화학', content: '기본적인 품질은 괜찮으나 가격 대비 용량이 아쉬워요.', date: '2026-03-25' },
];

const sampleChats: ChatRoom[] = [
  { id: 'CH-001', name: '김연구 (서울대)', lastMessage: 'COA 파일 보내드립니다', time: '10:30', unread: 2 },
  { id: 'CH-002', name: '이박사 (KAIST)', lastMessage: '배송 언제 도착하나요?', time: '어제', unread: 0 },
  { id: 'CH-003', name: '최과장 (LG화학)', lastMessage: '대량 구매 견적 가능할까요?', time: '3/30', unread: 0 },
];

const typeStyles: Record<InquiryType, string> = {
  '제품': 'bg-purple-50 text-purple-700',
  '주문': 'bg-green-50 text-green-700',
  '배송': 'bg-purple-50 text-purple-700',
  '가격': 'bg-amber-50 text-amber-700',
  '기타': 'bg-gray-50 text-gray-700',
};

export default function CustomersPage() {
  const [activeTab, setActiveTab] = useState<'inquiry' | 'review' | 'chat'>('inquiry');
  const [activeChatId, setActiveChatId] = useState('CH-001');

  const tabs = [
    { label: '문의 관리', value: 'inquiry' as const, count: sampleInquiries.filter(i => i.status === '미답변').length },
    { label: '리뷰 관리', value: 'review' as const, count: sampleReviews.filter(r => !r.reply).length },
    { label: '1:1 채팅', value: 'chat' as const, count: sampleChats.reduce((a, c) => a + c.unread, 0) },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[var(--text)]">고객 관리</h1>

      {/* Tabs */}
      <div className="flex gap-2">
        {tabs.map(tab => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`px-4 py-2 text-sm rounded-lg border transition-colors flex items-center gap-2 ${
              activeTab === tab.value
                ? 'bg-purple-600 text-white border-purple-600'
                : 'bg-[var(--card-bg)] text-[var(--text-secondary)] border-[var(--border)] hover:bg-gray-50'
            }`}
          >
            {tab.label}
            {tab.count > 0 && (
              <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${
                activeTab === tab.value ? 'bg-white/20' : 'bg-red-500 text-white'
              }`}>{tab.count}</span>
            )}
          </button>
        ))}
      </div>

      {/* Inquiry Tab */}
      {activeTab === 'inquiry' && (
        <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-[var(--border)]">
                <th className="text-left px-4 py-3 font-semibold text-[var(--text-secondary)]">유형</th>
                <th className="text-left px-4 py-3 font-semibold text-[var(--text-secondary)]">제목</th>
                <th className="text-left px-4 py-3 font-semibold text-[var(--text-secondary)]">문의자</th>
                <th className="text-left px-4 py-3 font-semibold text-[var(--text-secondary)]">관련주문</th>
                <th className="text-left px-4 py-3 font-semibold text-[var(--text-secondary)]">문의일</th>
                <th className="text-left px-4 py-3 font-semibold text-[var(--text-secondary)]">상태</th>
                <th className="text-left px-4 py-3 font-semibold text-[var(--text-secondary)]">관리</th>
              </tr>
            </thead>
            <tbody>
              {sampleInquiries.map(inq => (
                <tr key={inq.id} className="border-b border-[var(--border)] hover:bg-purple-50/30 transition-colors">
                  <td className="px-4 py-3"><span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${typeStyles[inq.type]}`}>{inq.type}</span></td>
                  <td className="px-4 py-3 font-medium">{inq.title}</td>
                  <td className="px-4 py-3">{inq.requester} ({inq.org})</td>
                  <td className="px-4 py-3 font-mono text-xs">{inq.orderId || '-'}</td>
                  <td className="px-4 py-3">{inq.date}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${inq.status === '미답변' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>{inq.status}</span>
                  </td>
                  <td className="px-4 py-3">
                    <button className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${inq.status === '미답변' ? 'bg-purple-600 text-white hover:bg-purple-700' : 'border border-[var(--border)] hover:bg-gray-50'}`}>
                      {inq.status === '미답변' ? '답변' : '상세'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Review Tab */}
      {activeTab === 'review' && (
        <div className="space-y-4">
          {/* Review Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-xl p-5">
              <p className="text-sm text-[var(--text-secondary)]">전체 리뷰</p>
              <p className="text-2xl font-bold mt-1">{sampleReviews.length}건</p>
            </div>
            <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-xl p-5">
              <p className="text-sm text-[var(--text-secondary)]">평균 평점</p>
              <p className="text-2xl font-bold mt-1">{(sampleReviews.reduce((a, r) => a + r.rating, 0) / sampleReviews.length).toFixed(1)} / 5.0</p>
            </div>
            <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-xl p-5">
              <p className="text-sm text-[var(--text-secondary)]">미답글 리뷰</p>
              <p className="text-2xl font-bold mt-1 text-amber-600">{sampleReviews.filter(r => !r.reply).length}건</p>
            </div>
          </div>
          {/* Review List */}
          {sampleReviews.map(review => (
            <div key={review.id} className="bg-[var(--card-bg)] border border-[var(--border)] rounded-xl p-5">
              <div className="flex items-center gap-3 flex-wrap mb-2">
                <div className="text-amber-400 text-sm">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</div>
                <span className="text-sm font-semibold">{review.product}</span>
                <span className="text-xs text-[var(--text-secondary)] ml-auto">{review.date}</span>
              </div>
              <p className="text-xs text-[var(--text-secondary)] mb-2">{review.author} ({review.org})</p>
              <p className="text-sm leading-relaxed mb-3">{review.content}</p>
              {review.reply ? (
                <div className="bg-purple-50 p-3 rounded-lg text-sm">
                  <strong className="text-purple-700">Sigma-Aldrich 답변:</strong> {review.reply}
                </div>
              ) : (
                <button className="px-3 py-1.5 border border-[var(--border)] text-xs font-semibold rounded-lg hover:bg-gray-50">답글 작성</button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Chat Tab */}
      {activeTab === 'chat' && (
        <div className="grid grid-cols-[280px_1fr] bg-[var(--card-bg)] border border-[var(--border)] rounded-xl overflow-hidden" style={{ minHeight: 480 }}>
          {/* Chat List */}
          <div className="border-r border-[var(--border)] overflow-y-auto">
            {sampleChats.map(chat => (
              <div
                key={chat.id}
                onClick={() => setActiveChatId(chat.id)}
                className={`flex items-center gap-3 px-4 py-3.5 border-b border-[var(--border)] cursor-pointer transition-colors ${activeChatId === chat.id ? 'bg-purple-50' : 'hover:bg-gray-50'}`}
              >
                <div className="w-9 h-9 rounded-full bg-purple-500 text-white flex items-center justify-center text-sm font-bold shrink-0">
                  {chat.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">{chat.name}</p>
                  <p className="text-xs text-[var(--text-secondary)] truncate">{chat.lastMessage}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[10px] text-[var(--text-secondary)]">{chat.time}</p>
                  {chat.unread > 0 && (
                    <span className="inline-block mt-1 w-4.5 h-4.5 bg-red-500 text-white text-[10px] font-bold rounded-full text-center leading-[18px]">{chat.unread}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
          {/* Chat Window */}
          <div className="flex flex-col">
            <div className="flex-1 p-4 space-y-3 overflow-y-auto">
              <div className="flex justify-start"><div className="bg-gray-100 px-3.5 py-2 rounded-xl rounded-bl-sm text-sm max-w-[70%]">안녕하세요, Ethyl alcohol 500mL 주문건 COA 받을 수 있을까요?</div></div>
              <div className="flex justify-end"><div className="bg-purple-600 text-white px-3.5 py-2 rounded-xl rounded-br-sm text-sm max-w-[70%]">안녕하세요! 네, 해당 로트번호 COA 파일 보내드립니다.</div></div>
              <div className="flex justify-end"><div className="bg-purple-600 text-white px-3.5 py-2 rounded-xl rounded-br-sm text-sm max-w-[70%] flex items-center gap-2"><Paperclip size={14} /> COA_459844_LOT2026A.pdf</div></div>
            </div>
            <div className="flex gap-2 px-4 py-3 border-t border-[var(--border)]">
              <input type="text" className="flex-1 h-[38px] px-3.5 border border-[var(--border)] rounded-lg text-sm focus:outline-none focus:border-purple-500" placeholder="메시지를 입력하세요..." />
              <button className="w-[38px] h-[38px] bg-purple-600 text-white rounded-lg flex items-center justify-center hover:bg-purple-700"><Send size={16} /></button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
