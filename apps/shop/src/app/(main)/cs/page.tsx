'use client';

import { useState } from 'react';
import { Search, Phone, Mail, Clock, ChevronDown, ChevronRight, ClipboardList, FileText, CreditCard, MessageSquare, Bell, ExternalLink } from 'lucide-react';
import Link from 'next/link';

interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

const topFaqs: FaqItem[] = [
  { id: '1', question: '주문 후 배송까지 얼마나 걸리나요?', answer: '당일출고 제품은 오후 3시 이전 주문 시 당일 발송됩니다. 일반 제품은 주문일 기준 2~5 영업일 이내 배송됩니다. 수입 시약의 경우 7~14 영업일이 소요될 수 있습니다.' },
  { id: '2', question: '견적서는 어떻게 발급받나요?', answer: '주문 관리 > 증빙서류 메뉴에서 해당 주문을 선택한 후 견적서 발급 버튼을 클릭하시면 됩니다. PDF로 다운로드하거나 이메일로 발송할 수 있습니다.' },
  { id: '3', question: '반품/교환은 어떻게 하나요?', answer: '제품 수령 후 7일 이내에 주문 관리 > 취소/반품 내역에서 신청하실 수 있습니다. 단, 시약 특성상 개봉 후에는 반품이 불가능하며, 파손/오배송의 경우 무료 교환 처리됩니다.' },
  { id: '4', question: '기관 결제(후불)로 주문할 수 있나요?', answer: '기관 결제는 조직관리자가 등록한 기관 정보를 바탕으로 이용 가능합니다. 마이페이지에서 기관 결제 신청을 하시면 영업일 기준 1~2일 내 승인 처리됩니다.' },
  { id: '5', question: 'SDS(안전보건자료)는 어디서 다운로드하나요?', answer: '제품 상세 페이지에서 한글/영문 SDS를 다운로드할 수 있습니다. 또는 검색창에서 제품명이나 CAS번호로 검색한 후 문서 탭에서 바로 다운로드하실 수 있습니다.' },
];

const popularKeywords = ['배송', '결제', '반품', '시약', '계정'];

const notices = [
  { id: '1', title: '2026년 3월 시스템 정기점검 안내 (3/22 02:00~06:00)', date: '2026-03-15', isNew: true },
  { id: '2', title: 'Sigma-Aldrich 제품 가격 변동 안내', date: '2026-03-10', isNew: true },
  { id: '3', title: '연구기관 후불결제 서비스 오픈', date: '2026-03-01', isNew: false },
];

export default function CsPage() {
  const [faqSearchQuery, setFaqSearchQuery] = useState('');
  const [openFaqId, setOpenFaqId] = useState<string | null>(null);

  const filteredFaqs = topFaqs.filter((faq) => {
    if (!faqSearchQuery) return true;
    const q = faqSearchQuery.toLowerCase();
    return faq.question.toLowerCase().includes(q) || faq.answer.toLowerCase().includes(q);
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[var(--text)]">고객센터</h1>
      </div>

      {/* Search Bar */}
      <div className="bg-gradient-to-r from-blue-600 to-violet-600 rounded-xl p-8 mb-6">
        <h2 className="text-xl font-bold text-white text-center mb-2">무엇을 도와드릴까요?</h2>
        <p className="text-blue-100 text-sm text-center mb-4">자주 묻는 질문을 검색하거나 1:1 문의를 남겨주세요</p>
        <div className="relative max-w-[500px] mx-auto">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={faqSearchQuery}
            onChange={(e) => setFaqSearchQuery(e.target.value)}
            placeholder="질문을 검색하세요..."
            className="w-full pl-10 pr-4 h-[42px] rounded-lg text-sm bg-white text-gray-900"
          />
        </div>
        <div className="flex items-center justify-center gap-2 mt-3">
          <span className="text-xs text-blue-200">인기 키워드:</span>
          {popularKeywords.map((keyword) => (
            <button
              key={keyword}
              onClick={() => setFaqSearchQuery(keyword)}
              className="px-3 py-1 bg-white/20 rounded-full text-xs text-white hover:bg-white/30 transition-colors"
            >
              {keyword}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-[1fr_320px] gap-6">
        {/* Left: FAQ + Notices */}
        <div className="space-y-6">
          {/* TOP 5 FAQ */}
          <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border)] p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-[var(--text)]">TOP 5 자주 묻는 질문</h2>
              <Link href="/faq" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                전체보기 <ChevronRight size={14} />
              </Link>
            </div>
            <div className="divide-y divide-[var(--border)]">
              {filteredFaqs.map((faq) => (
                <div key={faq.id}>
                  <button
                    onClick={() => setOpenFaqId(openFaqId === faq.id ? null : faq.id)}
                    className="w-full flex items-center justify-between py-3 text-left"
                  >
                    <span className="text-sm font-medium text-[var(--text)] flex items-center gap-2">
                      <span className="text-blue-600 font-bold">Q</span>
                      {faq.question}
                    </span>
                    <ChevronDown
                      size={16}
                      className={`text-[var(--text-secondary)] transition-transform ${openFaqId === faq.id ? 'rotate-180' : ''}`}
                    />
                  </button>
                  {openFaqId === faq.id && (
                    <div className="pb-3 pl-6 text-sm text-[var(--text-secondary)] leading-relaxed">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Notices */}
          <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border)] p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-[var(--text)] flex items-center gap-2">
                <Bell size={16} /> 공지사항
              </h2>
            </div>
            <div className="divide-y divide-[var(--border)]">
              {notices.map((notice) => (
                <div key={notice.id} className="flex items-center justify-between py-3">
                  <span className="text-sm text-[var(--text)] flex items-center gap-2">
                    {notice.isNew && (
                      <span className="px-1.5 py-0.5 bg-red-500 text-white text-[10px] font-bold rounded">NEW</span>
                    )}
                    {notice.title}
                  </span>
                  <span className="text-xs text-[var(--text-secondary)] shrink-0 ml-4">{notice.date}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Quick Links + Contact */}
        <div className="space-y-6">
          {/* Quick Links */}
          <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border)] p-5">
            <h2 className="text-base font-semibold text-[var(--text)] mb-4">바로가기</h2>
            <div className="space-y-2">
              <Link href="/orders" className="flex items-center gap-3 px-4 py-3 text-sm text-[var(--text)] bg-[var(--bg)] rounded-lg border border-[var(--border)] hover:border-blue-400 transition-colors">
                <ClipboardList size={16} className="text-[var(--text-secondary)]" /> 주문내역
                <ExternalLink size={12} className="ml-auto text-[var(--text-secondary)]" />
              </Link>
              <Link href="/documents" className="flex items-center gap-3 px-4 py-3 text-sm text-[var(--text)] bg-[var(--bg)] rounded-lg border border-[var(--border)] hover:border-blue-400 transition-colors">
                <FileText size={16} className="text-[var(--text-secondary)]" /> 증빙서류
                <ExternalLink size={12} className="ml-auto text-[var(--text-secondary)]" />
              </Link>
              <Link href="/approvals" className="flex items-center gap-3 px-4 py-3 text-sm text-[var(--text)] bg-[var(--bg)] rounded-lg border border-[var(--border)] hover:border-blue-400 transition-colors">
                <CreditCard size={16} className="text-[var(--text-secondary)]" /> 결제하기
                <ExternalLink size={12} className="ml-auto text-[var(--text-secondary)]" />
              </Link>
              <Link href="/inquiry" className="flex items-center gap-3 px-4 py-3 text-sm text-[var(--text)] bg-[var(--bg)] rounded-lg border border-[var(--border)] hover:border-blue-400 transition-colors">
                <MessageSquare size={16} className="text-[var(--text-secondary)]" /> 1:1 문의
                <ExternalLink size={12} className="ml-auto text-[var(--text-secondary)]" />
              </Link>
            </div>
          </div>

          {/* Contact Info */}
          <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border)] p-5">
            <h2 className="text-base font-semibold text-[var(--text)] mb-4">고객센터 연락처</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Phone size={14} className="text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-[var(--text)]">1588-0000</p>
                  <p className="text-xs text-[var(--text-secondary)]">유료 (평일 09:00~18:00)</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                  <Mail size={14} className="text-emerald-600" />
                </div>
                <div>
                  <p className="font-medium text-[var(--text)]">support@jinuchem.com</p>
                  <p className="text-xs text-[var(--text-secondary)]">이메일 문의</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center">
                  <Clock size={14} className="text-violet-600" />
                </div>
                <div>
                  <p className="font-medium text-[var(--text)]">평일 09:00~18:00</p>
                  <p className="text-xs text-[var(--text-secondary)]">점심 12:00~13:00 / 주말, 공휴일 휴무</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
