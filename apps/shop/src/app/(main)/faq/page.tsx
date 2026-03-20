'use client';

import { useState } from 'react';
import { Search, ChevronDown, HelpCircle } from 'lucide-react';

interface FaqItem {
  id: string;
  category: string;
  question: string;
  answer: string;
}

const faqData: FaqItem[] = [
  { id: '1', category: '주문', question: '주문 후 배송까지 얼마나 걸리나요?', answer: '당일출고 제품은 오후 3시 이전 주문 시 당일 발송됩니다. 일반 제품은 주문일 기준 2~5 영업일 이내 배송됩니다. 수입 시약의 경우 7~14 영업일이 소요될 수 있으며, 예상 배송일은 제품 상세 페이지에서 확인하실 수 있습니다.' },
  { id: '2', category: '주문', question: '최소 주문 수량이 있나요?', answer: '최소 주문 수량은 없습니다. 1개부터 주문 가능하며, 대량 구매 시 별도 할인이 적용될 수 있습니다. 대량 구매 견적은 1:1 문의를 통해 요청하시면 됩니다.' },
  { id: '3', category: '배송', question: '배송 추적은 어떻게 하나요?', answer: '주문 관리 > 주문 내역에서 배송중인 주문의 상세보기를 클릭하시면 배송 추적 정보를 확인하실 수 있습니다. 배송 시작 시 등록된 이메일과 알림으로도 송장번호가 발송됩니다.' },
  { id: '4', category: '배송', question: '토요일/공휴일에도 배송되나요?', answer: '기본 배송은 평일(월~금)에만 진행됩니다. 위험물이 아닌 일반 시약의 경우 익스프레스 배송(별도 추가금) 옵션으로 토요일 배송이 가능할 수 있으며, 이는 지역에 따라 다릅니다.' },
  { id: '5', category: '제품', question: 'SDS(안전보건자료)는 어디서 다운로드하나요?', answer: '제품 상세 페이지 하단의 문서 탭에서 한글/영문 SDS를 다운로드할 수 있습니다. COA(시험성적서), COO(원산지 증명서) 등 기타 문서도 동일한 위치에서 확인 가능합니다.' },
  { id: '6', category: '제품', question: '대체 시약을 찾고 싶어요', answer: '제품 상세 페이지에서 대체품 추천 기능을 제공하고 있습니다. 또한 고객센터에서 AI 기반 시약 추천 서비스를 이용하시면 용도와 사양에 맞는 대체 시약을 안내받으실 수 있습니다.' },
  { id: '7', category: '계정', question: '기관 결제(후불)로 주문할 수 있나요?', answer: '기관 결제는 조직관리자가 기관 정보를 등록하고 승인을 받은 후 이용 가능합니다. 마이페이지 > 기관 결제 신청에서 사업자등록증을 첨부하여 신청하시면, 영업일 기준 1~2일 내 승인됩니다.' },
  { id: '8', category: '계정', question: '연구실 동료를 초대하고 싶어요', answer: '마이페이지에서 연구실 멤버 관리 기능을 통해 동료를 초대할 수 있습니다. 초대된 연구원은 공유 장바구니를 함께 사용하고, 조직관리자의 승인 하에 주문할 수 있습니다.' },
  { id: '9', category: '기타', question: '견적서는 어떻게 발급받나요?', answer: '주문 관리 > 증빙서류 메뉴에서 주문을 선택한 후 견적서 발급 버튼을 클릭하시면 됩니다. PDF 다운로드 및 이메일 발송이 가능하며, 거래명세서와 납품확인서도 동일한 방법으로 발급됩니다.' },
  { id: '10', category: '기타', question: '연구노트(E-Note)와 연동할 수 있나요?', answer: 'JINU E-Note 전자실험노트를 사용 중이시라면, 내 시약장 메뉴에서 E-Note와 양방향 동기화가 가능합니다. 시약 사용 기록이 자동으로 실험노트에 반영되며, 실험 프로토콜에서 직접 시약을 주문하실 수도 있습니다.' },
];

type CategoryKey = 'all' | '주문' | '배송' | '제품' | '계정' | '기타';

const categories: { key: CategoryKey; label: string }[] = [
  { key: 'all', label: '전체' },
  { key: '주문', label: '주문' },
  { key: '배송', label: '배송' },
  { key: '제품', label: '제품' },
  { key: '계정', label: '계정' },
  { key: '기타', label: '기타' },
];

export default function FaqPage() {
  const [activeCategory, setActiveCategory] = useState<CategoryKey>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [openId, setOpenId] = useState<string | null>(null);

  const filtered = faqData.filter((faq) => {
    if (activeCategory !== 'all' && faq.category !== activeCategory) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return faq.question.toLowerCase().includes(q) || faq.answer.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[var(--text)]">자주 묻는 질문</h1>
        <span className="text-sm text-[var(--text-secondary)]">총 {filtered.length}개의 질문</span>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="질문을 검색하세요..."
          className="w-full pl-10 pr-4 h-[42px] border border-[var(--border)] rounded-lg bg-[var(--bg-card)] text-sm text-[var(--text)]"
        />
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-1 mb-6 border-b border-[var(--border)]">
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setActiveCategory(cat.key)}
            className={`px-4 h-[42px] text-sm font-medium border-b-2 transition-colors ${
              activeCategory === cat.key
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text)]'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* FAQ Accordion */}
      <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border)] divide-y divide-[var(--border)]">
        {filtered.map((faq) => (
          <div key={faq.id}>
            <button
              onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
              className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="px-2 py-0.5 bg-blue-100 text-blue-600 text-xs font-medium rounded">{faq.category}</span>
                <span className="text-sm font-medium text-[var(--text)]">{faq.question}</span>
              </div>
              <ChevronDown
                size={16}
                className={`text-[var(--text-secondary)] transition-transform shrink-0 ml-4 ${openId === faq.id ? 'rotate-180' : ''}`}
              />
            </button>
            {openId === faq.id && (
              <div className="px-5 pb-4 pl-[72px]">
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-[var(--text-secondary)]">
          <HelpCircle size={40} className="mx-auto mb-3 opacity-30" />
          <p className="text-lg font-medium mb-1">검색 결과가 없습니다</p>
          <p className="text-sm">다른 검색어를 시도하거나 1:1 문의를 이용해주세요</p>
        </div>
      )}
    </div>
  );
}
