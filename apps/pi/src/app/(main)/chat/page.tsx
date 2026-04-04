'use client';

import { useState } from 'react';
import { Send, Search, ChevronDown, ChevronRight, Paperclip, Phone, MoreHorizontal } from 'lucide-react';

const labMembers = [
  { id: 1, name: '김연구', role: '선임연구원', online: true, lastMsg: '시약 도착 확인했습니다.', time: '14:22' },
  { id: 2, name: '박석사', role: '석사과정', online: true, lastMsg: '견적 요청 보내셨나요?', time: '11:05' },
  { id: 3, name: '이박사', role: '박사과정', online: false, lastMsg: 'Acetone 추가 주문 부탁드립니다.', time: '어제' },
  { id: 4, name: '최학생', role: '학부연구생', online: false, lastMsg: 'HPLC 용매 재고 없습니다.', time: '04-01' },
];

const suppliers = [
  { id: 5, name: 'Sigma-Aldrich', role: '공급사', online: true, lastMsg: '견적서 첨부 확인 부탁드립니다.', time: '10:30' },
  { id: 6, name: 'TCI Korea', role: '공급사', online: false, lastMsg: '재고 확인 완료되었습니다.', time: '04-02' },
  { id: 7, name: 'Alfa Aesar', role: '공급사', online: false, lastMsg: '배송 출발 안내드립니다.', time: '03-30' },
];

const messages = [
  { id: 1, sender: '김연구', me: false, text: '교수님, Sodium hydroxide 1kg x5 주문 넣어도 될까요?', time: '14:15' },
  { id: 2, sender: '나', me: true, text: '네, 승인 넣어주세요. 재고가 얼마나 남았나요?', time: '14:18' },
  { id: 3, sender: '김연구', me: false, text: '현재 500g 정도 남아있습니다. 이번 주 합성에 사용할 예정입니다.', time: '14:19' },
  { id: 4, sender: '나', me: true, text: '알겠습니다. 승인 처리하겠습니다.', time: '14:20' },
  { id: 5, sender: '김연구', me: false, text: '시약 도착 확인했습니다. 감사합니다.', time: '14:22' },
];

export default function ChatPage() {
  const [selectedChat, setSelectedChat] = useState(1);
  const [labOpen, setLabOpen] = useState(true);
  const [supplierOpen, setSupplierOpen] = useState(true);
  const [messageText, setMessageText] = useState('');

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-900 mb-1">대화</h1>
      <p className="text-sm text-gray-500 mb-6">연구실원 및 공급사와 실시간 대화합니다.</p>

      <div className="flex gap-4 h-[calc(100vh-240px)] min-h-[500px]">
        {/* Chat List */}
        <div className="w-72 bg-white border border-gray-200 rounded-xl overflow-hidden flex flex-col flex-shrink-0">
          <div className="p-3 border-b border-gray-200">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" placeholder="대화 검색..."
                className="w-full pl-8 pr-3 h-[34px] border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {/* Lab Members */}
            <button onClick={() => setLabOpen(!labOpen)} className="w-full flex items-center gap-1 px-3 py-2 text-xs font-bold text-gray-400 uppercase hover:bg-gray-50">
              {labOpen ? <ChevronDown size={12} /> : <ChevronRight size={12} />} 연구실원
            </button>
            {labOpen && labMembers.map(m => (
              <button
                key={m.id}
                onClick={() => setSelectedChat(m.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-left hover:bg-gray-50 transition-colors ${
                  selectedChat === m.id ? 'bg-blue-50 border-r-2 border-blue-500' : ''
                }`}
              >
                <div className="relative flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">
                    {m.name.charAt(0)}
                  </div>
                  {m.online && <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 border-2 border-white rounded-full" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900 truncate">{m.name}</span>
                    <span className="text-[10px] text-gray-400 flex-shrink-0">{m.time}</span>
                  </div>
                  <p className="text-xs text-gray-500 truncate">{m.lastMsg}</p>
                </div>
              </button>
            ))}

            {/* Suppliers */}
            <button onClick={() => setSupplierOpen(!supplierOpen)} className="w-full flex items-center gap-1 px-3 py-2 text-xs font-bold text-gray-400 uppercase hover:bg-gray-50 mt-1">
              {supplierOpen ? <ChevronDown size={12} /> : <ChevronRight size={12} />} 공급사
            </button>
            {supplierOpen && suppliers.map(s => (
              <button
                key={s.id}
                onClick={() => setSelectedChat(s.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-left hover:bg-gray-50 transition-colors ${
                  selectedChat === s.id ? 'bg-blue-50 border-r-2 border-blue-500' : ''
                }`}
              >
                <div className="relative flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs font-bold">
                    {s.name.charAt(0)}
                  </div>
                  {s.online && <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 border-2 border-white rounded-full" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900 truncate">{s.name}</span>
                    <span className="text-[10px] text-gray-400 flex-shrink-0">{s.time}</span>
                  </div>
                  <p className="text-xs text-gray-500 truncate">{s.lastMsg}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 bg-white border border-gray-200 rounded-xl overflow-hidden flex flex-col">
          {/* Chat Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">김</div>
              <div>
                <div className="text-sm font-medium text-gray-900">김연구</div>
                <div className="text-xs text-green-500">온라인</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400"><Phone size={16} /></button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400"><MoreHorizontal size={16} /></button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
            <div className="text-center text-xs text-gray-400 py-2">2026년 4월 3일</div>
            {messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.me ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[70%] ${msg.me ? 'order-2' : ''}`}>
                  {!msg.me && <span className="text-xs text-gray-400 mb-0.5 block">{msg.sender}</span>}
                  <div className={`px-3 py-2 rounded-xl text-sm ${
                    msg.me ? 'bg-blue-500 text-white rounded-br-sm' : 'bg-white border border-gray-200 text-gray-800 rounded-bl-sm'
                  }`}>
                    {msg.text}
                  </div>
                  <span className={`text-[10px] text-gray-400 mt-0.5 block ${msg.me ? 'text-right' : ''}`}>{msg.time}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-3 border-t border-gray-200">
            <div className="flex items-center gap-2">
              <button className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400"><Paperclip size={16} /></button>
              <input
                type="text"
                placeholder="메시지를 입력하세요..."
                value={messageText}
                onChange={e => setMessageText(e.target.value)}
                className="flex-1 h-[38px] px-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="h-[38px] px-4 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 flex items-center gap-1">
                <Send size={14} /> 전송
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
