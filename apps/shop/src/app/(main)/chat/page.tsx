'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Search, MessageCircle, MoreVertical } from 'lucide-react';

interface ChatRoom {
  id: string;
  name: string;
  role: string;
  lastMessage: string;
  lastTime: string;
  unread: number;
  avatar: string;
}

interface Message {
  id: string;
  roomId: string;
  sender: 'me' | 'other';
  text: string;
  time: string;
}

const chatRooms: ChatRoom[] = [
  { id: '1', name: 'Sigma-Aldrich 담당자', role: '공급사', lastMessage: '네, 해당 제품 3월 24일 입고 예정입니다.', lastTime: '오후 2:30', unread: 1, avatar: 'SA' },
  { id: '2', name: 'TCI 영업팀', role: '공급사', lastMessage: '견적서를 보내드렸습니다. 확인 부탁드립니다.', lastTime: '오전 11:15', unread: 0, avatar: 'TC' },
  { id: '3', name: 'JINU 고객센터', role: '관리자', lastMessage: '기관 후불결제 승인 완료되었습니다.', lastTime: '어제', unread: 0, avatar: 'JC' },
];

const sampleMessages: Record<string, Message[]> = {
  '1': [
    { id: 'm1', roomId: '1', sender: 'me', text: '안녕하세요, Dichloromethane 4L 재고 확인 부탁드립니다.', time: '오후 1:45' },
    { id: 'm2', roomId: '1', sender: 'other', text: '안녕하세요, 김연구님. 확인 도와드리겠습니다.', time: '오후 1:48' },
    { id: 'm3', roomId: '1', sender: 'other', text: '현재 해당 제품은 일시 품절 상태입니다.', time: '오후 1:50' },
    { id: 'm4', roomId: '1', sender: 'me', text: '입고 예정일이 언제인가요?', time: '오후 2:15' },
    { id: 'm5', roomId: '1', sender: 'other', text: '네, 해당 제품 3월 24일 입고 예정입니다.', time: '오후 2:30' },
  ],
  '2': [
    { id: 'm6', roomId: '2', sender: 'other', text: '안녕하세요, TCI 영업팀입니다. PIPES 대량 구매 건 견적서를 첨부드립니다.', time: '오전 10:30' },
    { id: 'm7', roomId: '2', sender: 'me', text: '감사합니다. 검토 후 연락드리겠습니다.', time: '오전 11:00' },
    { id: 'm8', roomId: '2', sender: 'other', text: '견적서를 보내드렸습니다. 확인 부탁드립니다.', time: '오전 11:15' },
  ],
  '3': [
    { id: 'm9', roomId: '3', sender: 'me', text: '경상국립대학교 화학과 기관 후불결제 등록 요청드립니다.', time: '어제 오후 3:00' },
    { id: 'm10', roomId: '3', sender: 'other', text: '서류 확인 후 처리해드리겠습니다. 영업일 1~2일 소요됩니다.', time: '어제 오후 3:30' },
    { id: 'm11', roomId: '3', sender: 'other', text: '기관 후불결제 승인 완료되었습니다.', time: '어제 오후 5:00' },
  ],
};

export default function ChatPage() {
  const [activeRoomId, setActiveRoomId] = useState('1');
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState(sampleMessages);
  const [roomSearch, setRoomSearch] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeRoom = chatRooms.find((r) => r.id === activeRoomId);
  const roomMessages = messages[activeRoomId] || [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [roomMessages.length]);

  const handleSend = () => {
    if (!inputText.trim()) return;
    const newMessage: Message = {
      id: `m${Date.now()}`,
      roomId: activeRoomId,
      sender: 'me',
      text: inputText,
      time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => ({
      ...prev,
      [activeRoomId]: [...(prev[activeRoomId] || []), newMessage],
    }));
    setInputText('');
  };

  const filteredRooms = chatRooms.filter((r) =>
    r.name.toLowerCase().includes(roomSearch.toLowerCase())
  );

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--text)]">대화</h1>
      </div>

      <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border)] overflow-hidden flex" style={{ height: 'calc(100vh - 220px)', minHeight: '500px' }}>
        {/* Left: Chat Room List */}
        <div className="w-[300px] border-r border-[var(--border)] flex flex-col">
          <div className="p-3">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
              <input
                type="text"
                value={roomSearch}
                onChange={(e) => setRoomSearch(e.target.value)}
                placeholder="대화 검색..."
                className="w-full pl-9 pr-3 h-[34px] border border-[var(--border)] rounded-lg text-xs bg-[var(--bg)] text-[var(--text)]"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {filteredRooms.map((room) => (
              <button
                key={room.id}
                onClick={() => setActiveRoomId(room.id)}
                className={`w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-gray-50 transition-colors ${
                  activeRoomId === room.id ? 'bg-blue-50' : ''
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                  {room.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-sm font-medium text-[var(--text)] truncate">{room.name}</span>
                    <span className="text-[10px] text-[var(--text-secondary)] shrink-0 ml-2">{room.lastTime}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-[var(--text-secondary)] truncate">{room.lastMessage}</p>
                    {room.unread > 0 && (
                      <span className="ml-2 w-5 h-5 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center shrink-0">
                        {room.unread}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right: Chat Messages */}
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="px-5 py-3 border-b border-[var(--border)] flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-[var(--text)]">{activeRoom?.name}</h3>
              <p className="text-xs text-[var(--text-secondary)]">{activeRoom?.role}</p>
            </div>
            <button className="text-[var(--text-secondary)] hover:text-[var(--text)]">
              <MoreVertical size={16} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-5 space-y-3">
            {roomMessages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[70%] ${msg.sender === 'me' ? 'order-1' : ''}`}>
                  <div
                    className={`px-4 py-2.5 rounded-2xl text-sm ${
                      msg.sender === 'me'
                        ? 'bg-blue-600 text-white rounded-br-md'
                        : 'bg-gray-100 text-[var(--text)] rounded-bl-md'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <p className={`text-[10px] mt-1 text-[var(--text-secondary)] ${msg.sender === 'me' ? 'text-right' : ''}`}>
                    {msg.time}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="px-4 py-3 border-t border-[var(--border)]">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }}
                placeholder="메시지를 입력하세요..."
                className="flex-1 h-[38px] px-4 border border-[var(--border)] rounded-lg text-sm bg-[var(--bg)] text-[var(--text)]"
              />
              <button
                onClick={handleSend}
                disabled={!inputText.trim()}
                className="h-[38px] w-[38px] bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center disabled:opacity-40"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
