'use client';

import { useState } from 'react';
import { Send, Paperclip, Eye, MessageSquarePlus, ClipboardList } from 'lucide-react';

interface InquiryItem {
  id: string;
  inquiryNumber: string;
  type: string;
  title: string;
  content: string;
  status: 'received' | 'processing' | 'answered';
  createdAt: string;
  answer?: string;
  answeredAt?: string;
}

const sampleInquiries: InquiryItem[] = [
  {
    id: '1',
    inquiryNumber: 'INQ-20260318-001',
    type: '배송',
    title: 'ORD-20260317-001 배송 일정 문의',
    content: '주문한 시약의 정확한 배송일을 알고 싶습니다. 실험 일정이 있어 긴급합니다.',
    status: 'answered',
    createdAt: '2026-03-18',
    answer: '해당 주문은 3월 21일(금) 오전 중 도착 예정입니다. 배송 추적 번호는 문자로 발송해드렸습니다.',
    answeredAt: '2026-03-19',
  },
  {
    id: '2',
    inquiryNumber: 'INQ-20260317-002',
    type: '제품',
    title: 'Sodium Hydroxide COA 요청',
    content: 'Lot번호 SH-20260215에 대한 COA(시험성적서)를 발급해주실 수 있나요?',
    status: 'processing',
    createdAt: '2026-03-17',
  },
  {
    id: '3',
    inquiryNumber: 'INQ-20260316-001',
    type: '주문/결제',
    title: '기관 후불결제 등록 문의',
    content: '경상국립대학교 화학과로 기관 후불결제를 등록하고 싶습니다. 필요한 서류가 무엇인가요?',
    status: 'received',
    createdAt: '2026-03-16',
  },
];

const inquiryTypeOptions = [
  { value: '', label: '유형을 선택하세요' },
  { value: '주문/결제', label: '주문/결제' },
  { value: '배송', label: '배송' },
  { value: '제품', label: '제품' },
  { value: '계정', label: '계정' },
  { value: '기타', label: '기타' },
];

const statusConfig: Record<string, { label: string; color: string }> = {
  received: { label: '접수', color: 'bg-blue-100 text-blue-700' },
  processing: { label: '처리중', color: 'bg-amber-100 text-amber-700' },
  answered: { label: '답변완료', color: 'bg-emerald-100 text-emerald-700' },
};

type TabKey = 'write' | 'list';

export default function InquiryPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('write');
  const [selectedInquiry, setSelectedInquiry] = useState<InquiryItem | null>(null);

  // Form state
  const [formType, setFormType] = useState('');
  const [formOrderNo, setFormOrderNo] = useState('');
  const [formTitle, setFormTitle] = useState('');
  const [formContent, setFormContent] = useState('');

  const handleSubmit = () => {
    if (!formType || !formTitle || !formContent) {
      alert('유형, 제목, 내용을 모두 입력해주세요');
      return;
    }
    alert('문의가 접수되었습니다');
    setFormType(''); setFormOrderNo(''); setFormTitle(''); setFormContent('');
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[var(--text)]">1:1 문의하기</h1>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 mb-6 border-b border-[var(--border)]">
        <button
          onClick={() => setActiveTab('write')}
          className={`flex items-center gap-1.5 px-4 h-[42px] text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'write' ? 'border-blue-600 text-blue-600' : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text)]'
          }`}
        >
          <MessageSquarePlus size={14} /> 문의 작성
        </button>
        <button
          onClick={() => setActiveTab('list')}
          className={`flex items-center gap-1.5 px-4 h-[42px] text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'list' ? 'border-blue-600 text-blue-600' : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text)]'
          }`}
        >
          <ClipboardList size={14} /> 문의 내역
          <span className="ml-1 px-1.5 py-0.5 rounded-full text-xs bg-gray-100 text-gray-500">
            {sampleInquiries.length}
          </span>
        </button>
      </div>

      {activeTab === 'write' ? (
        /* Write Form */
        <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border)] p-6 max-w-[700px]">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--text)] mb-1.5">문의 유형</label>
              <select
                value={formType}
                onChange={(e) => setFormType(e.target.value)}
                className="w-full h-[38px] px-3 border border-[var(--border)] rounded-lg bg-[var(--bg)] text-sm text-[var(--text)]"
              >
                {inquiryTypeOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text)] mb-1.5">관련 주문번호 (선택)</label>
              <select
                value={formOrderNo}
                onChange={(e) => setFormOrderNo(e.target.value)}
                className="w-full h-[38px] px-3 border border-[var(--border)] rounded-lg bg-[var(--bg)] text-sm text-[var(--text)]"
              >
                <option value="">선택 안함</option>
                <option value="ORD-20260317-001">ORD-20260317-001 - Ethyl alcohol, Pure 500mL</option>
                <option value="ORD-20260315-003">ORD-20260315-003 - Acetone, ACS Grade 2.5L</option>
                <option value="ORD-20260312-002">ORD-20260312-002 - PIPES, 고순도 5G</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text)] mb-1.5">제목</label>
              <input
                type="text"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="문의 제목을 입력하세요"
                className="w-full h-[38px] px-3 border border-[var(--border)] rounded-lg bg-[var(--bg)] text-sm text-[var(--text)]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text)] mb-1.5">내용</label>
              <textarea
                rows={6}
                value={formContent}
                onChange={(e) => setFormContent(e.target.value)}
                placeholder="문의 내용을 상세히 입력해주세요"
                className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--bg)] text-sm text-[var(--text)] resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text)] mb-1.5">파일 첨부 (선택)</label>
              <div className="border border-dashed border-[var(--border)] rounded-lg p-4 text-center">
                <Paperclip size={20} className="mx-auto mb-2 text-[var(--text-secondary)]" />
                <p className="text-sm text-[var(--text-secondary)]">클릭하여 파일 첨부 (최대 10MB)</p>
                <p className="text-xs text-[var(--text-secondary)] mt-1">jpg, png, pdf, xlsx 지원</p>
              </div>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            className="mt-5 h-[38px] px-6 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 flex items-center gap-1.5"
          >
            <Send size={14} /> 문의 등록
          </button>
        </div>
      ) : (
        /* Inquiry List */
        <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border)] overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-[var(--border)]">
                <th className="text-left px-4 py-3 font-medium text-[var(--text-secondary)]">문의번호</th>
                <th className="text-center px-4 py-3 font-medium text-[var(--text-secondary)]">유형</th>
                <th className="text-left px-4 py-3 font-medium text-[var(--text-secondary)]">제목</th>
                <th className="text-center px-4 py-3 font-medium text-[var(--text-secondary)]">상태</th>
                <th className="text-center px-4 py-3 font-medium text-[var(--text-secondary)]">등록일</th>
                <th className="text-center px-4 py-3 font-medium text-[var(--text-secondary)]">상세</th>
              </tr>
            </thead>
            <tbody>
              {sampleInquiries.map((inquiry) => (
                <tr key={inquiry.id} className="border-b border-[var(--border)] last:border-0 hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-xs text-[var(--text)]">{inquiry.inquiryNumber}</td>
                  <td className="px-4 py-3 text-center">
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">{inquiry.type}</span>
                  </td>
                  <td className="px-4 py-3 text-[var(--text)]">{inquiry.title}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusConfig[inquiry.status].color}`}>
                      {statusConfig[inquiry.status].label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center text-[var(--text-secondary)]">{inquiry.createdAt}</td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => setSelectedInquiry(inquiry)}
                      className="text-blue-600 hover:underline text-xs font-medium flex items-center gap-1 mx-auto"
                    >
                      <Eye size={12} /> 상세
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Detail Modal */}
      {selectedInquiry && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center" onClick={() => setSelectedInquiry(null)}>
          <div className="bg-[var(--bg-card)] rounded-2xl w-[600px] max-h-[80vh] overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-[var(--text)]">문의 상세</h2>
              <button onClick={() => setSelectedInquiry(null)} className="text-[var(--text-secondary)] hover:text-[var(--text)] text-xl">&times;</button>
            </div>

            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-3 gap-3">
                <div><span className="text-[var(--text-secondary)]">문의번호</span><p className="font-mono text-[var(--text)]">{selectedInquiry.inquiryNumber}</p></div>
                <div><span className="text-[var(--text-secondary)]">유형</span><p className="text-[var(--text)]">{selectedInquiry.type}</p></div>
                <div><span className="text-[var(--text-secondary)]">상태</span><p><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusConfig[selectedInquiry.status].color}`}>{statusConfig[selectedInquiry.status].label}</span></p></div>
              </div>

              <div className="border-t border-[var(--border)] pt-3">
                <h3 className="font-semibold text-[var(--text)] mb-2">{selectedInquiry.title}</h3>
                <p className="text-[var(--text-secondary)] leading-relaxed">{selectedInquiry.content}</p>
                <p className="text-xs text-[var(--text-secondary)] mt-2">{selectedInquiry.createdAt}</p>
              </div>

              {selectedInquiry.answer && (
                <div className="border-t border-[var(--border)] pt-3">
                  <h3 className="font-semibold text-emerald-700 mb-2">답변</h3>
                  <div className="bg-emerald-50 rounded-lg p-3">
                    <p className="text-[var(--text)] leading-relaxed">{selectedInquiry.answer}</p>
                    <p className="text-xs text-[var(--text-secondary)] mt-2">{selectedInquiry.answeredAt}</p>
                  </div>
                </div>
              )}
            </div>

            <button onClick={() => setSelectedInquiry(null)} className="mt-5 w-full h-[38px] bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700">
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
