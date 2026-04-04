'use client';

import { useState } from 'react';
import {
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  X,
  Calendar,
  Building2,
  Send,
} from 'lucide-react';

type QuoteStatus = '대기중' | '응답완료' | '만료';

interface QuoteItem {
  name: string;
  catalogNo: string;
  size: string;
  qty: number;
  requestedPrice?: string;
}

interface Quote {
  id: string;
  requester: string;
  org: string;
  items: QuoteItem[];
  requestedDate: string;
  dueDate: string;
  status: QuoteStatus;
  note?: string;
}

const sampleQuotes: Quote[] = [
  {
    id: 'QT-2026-0089',
    requester: '김연구',
    org: '서울대학교 화학과',
    items: [
      { name: 'Sodium Chloride', catalogNo: 'JC-SC-001', size: '500g', qty: 5 },
      { name: 'Potassium Hydroxide', catalogNo: 'JC-PH-012', size: '1kg', qty: 2 },
    ],
    requestedDate: '2026-03-18',
    dueDate: '2026-03-25',
    status: '대기중',
    note: '급한 건이라 빠른 회신 부탁드립니다.',
  },
  {
    id: 'QT-2026-0088',
    requester: '이박사',
    org: 'KAIST 생명과학과',
    items: [
      { name: 'Acetonitrile (HPLC Grade)', catalogNo: 'JC-AC-003', size: '2.5L', qty: 10 },
    ],
    requestedDate: '2026-03-17',
    dueDate: '2026-03-24',
    status: '대기중',
  },
  {
    id: 'QT-2026-0087',
    requester: '박교수',
    org: '연세대학교 약학대학',
    items: [
      { name: 'Methanol (ACS Grade)', catalogNo: 'JC-MT-004', size: '4L', qty: 3 },
      { name: 'Ethanol (200 Proof)', catalogNo: 'JC-ET-002', size: '4L', qty: 5 },
      { name: 'Isopropanol', catalogNo: 'JC-IP-015', size: '2.5L', qty: 2 },
    ],
    requestedDate: '2026-03-16',
    dueDate: '2026-03-23',
    status: '대기중',
  },
  {
    id: 'QT-2026-0085',
    requester: '최연구',
    org: '포항공대 신소재공학과',
    items: [
      { name: 'Sulfuric Acid (98%)', catalogNo: 'JC-SA-005', size: '2.5L', qty: 1 },
    ],
    requestedDate: '2026-03-14',
    dueDate: '2026-03-21',
    status: '응답완료',
  },
  {
    id: 'QT-2026-0080',
    requester: '정연구',
    org: '고려대학교 화공생명공학과',
    items: [
      { name: 'Toluene (ACS Grade)', catalogNo: 'JC-TL-006', size: '4L', qty: 2 },
      { name: 'Hexane (HPLC Grade)', catalogNo: 'JC-HX-007', size: '4L', qty: 3 },
    ],
    requestedDate: '2026-03-10',
    dueDate: '2026-03-17',
    status: '만료',
  },
];

const tabs: { label: string; status: QuoteStatus | 'all'; icon: React.ReactNode }[] = [
  { label: '대기중', status: '대기중', icon: <Clock size={16} /> },
  { label: '응답완료', status: '응답완료', icon: <CheckCircle size={16} /> },
  { label: '만료', status: '만료', icon: <XCircle size={16} /> },
];

const statusStyles: Record<QuoteStatus, string> = {
  '대기중': 'bg-yellow-100 text-yellow-700',
  '응답완료': 'bg-green-100 text-green-700',
  '만료': 'bg-gray-100 text-gray-500',
};

export default function QuotesPage() {
  const [activeTab, setActiveTab] = useState<QuoteStatus | 'all'>('대기중');
  const [modalQuote, setModalQuote] = useState<Quote | null>(null);
  const [priceInputs, setPriceInputs] = useState<Record<string, string>>({});
  const [validity, setValidity] = useState('7');
  const [responseNote, setResponseNote] = useState('');

  const filteredQuotes =
    activeTab === 'all'
      ? sampleQuotes
      : sampleQuotes.filter((q) => q.status === activeTab);

  const openModal = (quote: Quote) => {
    setModalQuote(quote);
    const defaults: Record<string, string> = {};
    quote.items.forEach((item, i) => {
      defaults[`${quote.id}-${i}`] = '';
    });
    setPriceInputs(defaults);
    setValidity('7');
    setResponseNote('');
  };

  const closeModal = () => {
    setModalQuote(null);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--text)]">견적 관리</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">고객 견적 요청을 확인하고 응답하세요</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-[var(--border)]">
        {tabs.map((tab) => {
          const count = sampleQuotes.filter((q) => q.status === tab.status).length;
          return (
            <button
              key={tab.label}
              onClick={() => setActiveTab(tab.status)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.status
                  ? 'border-purple-600 text-purple-600'
                  : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text)]'
              }`}
            >
              {tab.icon}
              {tab.label}
              <span className={`ml-1 px-1.5 py-0.5 rounded-full text-xs ${
                activeTab === tab.status ? 'bg-blue-100 text-purple-700' : 'bg-gray-100 text-gray-600'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Quote List */}
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--border)] bg-gray-50">
              <th className="text-left px-5 py-3 text-[var(--text-secondary)] font-medium">견적번호</th>
              <th className="text-left px-5 py-3 text-[var(--text-secondary)] font-medium">요청기관</th>
              <th className="text-left px-5 py-3 text-[var(--text-secondary)] font-medium">요청 제품</th>
              <th className="text-center px-5 py-3 text-[var(--text-secondary)] font-medium">요청일</th>
              <th className="text-center px-5 py-3 text-[var(--text-secondary)] font-medium">마감일</th>
              <th className="text-center px-5 py-3 text-[var(--text-secondary)] font-medium">상태</th>
              <th className="text-center px-5 py-3 text-[var(--text-secondary)] font-medium">액션</th>
            </tr>
          </thead>
          <tbody>
            {filteredQuotes.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-12 text-[var(--text-secondary)]">
                  해당 상태의 견적이 없습니다
                </td>
              </tr>
            ) : (
              filteredQuotes.map((quote) => (
                <tr key={quote.id} className="border-b border-[var(--border)] last:border-0 hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3 font-medium text-purple-600">{quote.id}</td>
                  <td className="px-5 py-3">
                    <div className="text-[var(--text)] font-medium">{quote.org}</div>
                    <div className="text-xs text-[var(--text-secondary)]">{quote.requester}</div>
                  </td>
                  <td className="px-5 py-3 text-[var(--text)]">
                    {quote.items[0].name}
                    {quote.items.length > 1 && (
                      <span className="text-[var(--text-secondary)]"> 외 {quote.items.length - 1}건</span>
                    )}
                  </td>
                  <td className="px-5 py-3 text-center text-[var(--text-secondary)]">{quote.requestedDate}</td>
                  <td className="px-5 py-3 text-center text-[var(--text-secondary)]">{quote.dueDate}</td>
                  <td className="px-5 py-3 text-center">
                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[quote.status]}`}>
                      {quote.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-center">
                    {quote.status === '대기중' && (
                      <button
                        onClick={() => openModal(quote)}
                        className="h-[var(--btn-height)] px-4 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors"
                      >
                        견적 응답
                      </button>
                    )}
                    {quote.status === '응답완료' && (
                      <span className="text-xs text-green-600 font-medium">응답 완료</span>
                    )}
                    {quote.status === '만료' && (
                      <span className="text-xs text-gray-400">기간 만료</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Quote Response Modal */}
      {modalQuote && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[var(--bg-card)] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)]">
              <div>
                <h3 className="text-lg font-bold text-[var(--text)]">견적 응답</h3>
                <p className="text-sm text-[var(--text-secondary)]">{modalQuote.id}</p>
              </div>
              <button
                onClick={closeModal}
                className="w-9 h-9 flex items-center justify-center rounded-lg text-[var(--text-secondary)] hover:bg-gray-100"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-4 space-y-5">
              {/* Quote Info */}
              <div className="flex gap-6 text-sm">
                <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                  <Building2 size={14} />
                  <span>{modalQuote.org}</span>
                </div>
                <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                  <Calendar size={14} />
                  <span>마감일: {modalQuote.dueDate}</span>
                </div>
              </div>

              {modalQuote.note && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800">
                  <span className="font-medium">요청사항:</span> {modalQuote.note}
                </div>
              )}

              {/* Price Input Table */}
              <div>
                <h4 className="text-sm font-semibold text-[var(--text)] mb-3">제품별 가격 입력</h4>
                <div className="border border-[var(--border)] rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 border-b border-[var(--border)]">
                        <th className="text-left px-4 py-2.5 text-[var(--text-secondary)] font-medium">제품명</th>
                        <th className="text-center px-4 py-2.5 text-[var(--text-secondary)] font-medium">규격</th>
                        <th className="text-center px-4 py-2.5 text-[var(--text-secondary)] font-medium">수량</th>
                        <th className="text-right px-4 py-2.5 text-[var(--text-secondary)] font-medium">단가 (원)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {modalQuote.items.map((item, i) => (
                        <tr key={i} className="border-b border-[var(--border)] last:border-0">
                          <td className="px-4 py-2.5">
                            <div className="font-medium text-[var(--text)]">{item.name}</div>
                            <div className="text-xs text-[var(--text-secondary)]">{item.catalogNo}</div>
                          </td>
                          <td className="px-4 py-2.5 text-center text-[var(--text)]">{item.size}</td>
                          <td className="px-4 py-2.5 text-center text-[var(--text)]">{item.qty}</td>
                          <td className="px-4 py-2.5 text-right">
                            <input
                              type="text"
                              placeholder="0"
                              value={priceInputs[`${modalQuote.id}-${i}`] || ''}
                              onChange={(e) =>
                                setPriceInputs((prev) => ({
                                  ...prev,
                                  [`${modalQuote.id}-${i}`]: e.target.value,
                                }))
                              }
                              className="w-32 h-[var(--btn-height)] px-3 border border-[var(--border)] rounded-lg text-right text-sm focus:outline-none focus:border-purple-500 text-[var(--text)] bg-[var(--bg)]"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Validity Period */}
              <div>
                <label className="block text-sm font-semibold text-[var(--text)] mb-2">견적 유효기간</label>
                <select
                  value={validity}
                  onChange={(e) => setValidity(e.target.value)}
                  className="h-[var(--btn-height)] px-3 border border-[var(--border)] rounded-lg text-sm text-[var(--text)] bg-[var(--bg)] focus:outline-none focus:border-purple-500"
                >
                  <option value="7">7일</option>
                  <option value="14">14일</option>
                  <option value="30">30일</option>
                  <option value="60">60일</option>
                </select>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-semibold text-[var(--text)] mb-2">비고</label>
                <textarea
                  value={responseNote}
                  onChange={(e) => setResponseNote(e.target.value)}
                  placeholder="견적 관련 추가 안내사항을 입력하세요"
                  rows={3}
                  className="w-full px-3 py-2 border border-[var(--border)] rounded-lg text-sm text-[var(--text)] bg-[var(--bg)] focus:outline-none focus:border-purple-500 resize-none"
                  style={{ height: 'auto' }}
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[var(--border)]">
              <button
                onClick={closeModal}
                className="h-[var(--btn-height)] px-5 border border-[var(--border)] rounded-lg text-sm font-medium text-[var(--text)] hover:bg-gray-50 transition-colors"
              >
                취소
              </button>
              <button
                onClick={closeModal}
                className="h-[var(--btn-height)] px-5 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors flex items-center gap-2"
              >
                <Send size={14} />
                견적 전송
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
