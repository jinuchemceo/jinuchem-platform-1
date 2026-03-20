// ================================================================
// JINUCHEM 공유 유틸리티
// ================================================================

/**
 * 통화 포맷 (원화)
 * @example formatCurrency(158239) => "\\158,239"
 */
export function formatCurrency(amount: number): string {
  return `\\${amount.toLocaleString('ko-KR')}`;
}

/**
 * 날짜 포맷 (한국어)
 * @example formatDate(new Date()) => "2026-03-19"
 */
export function formatDate(date: Date | string, format: 'short' | 'long' | 'iso' = 'iso'): string {
  const d = typeof date === 'string' ? new Date(date) : date;

  switch (format) {
    case 'short':
      return `${d.getMonth() + 1}/${d.getDate()}`;
    case 'long':
      return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;
    case 'iso':
    default:
      return d.toISOString().split('T')[0];
  }
}

/**
 * CAS 번호 패턴 감지
 * @example isCasNumber("64-17-5") => true
 */
export function isCasNumber(input: string): boolean {
  return /^\d{2,7}-\d{2}-\d$/.test(input.trim());
}

/**
 * CAS 번호 정규화
 */
export function normalizeCasNumber(input: string): string | null {
  const match = input.trim().match(/(\d{2,7})-(\d{2})-(\d)/);
  return match ? `${match[1]}-${match[2]}-${match[3]}` : null;
}

/**
 * PO번호 자동 생성
 * @example generatePoNumber("김연구") => "20260319-김연구"
 */
export function generatePoNumber(userName: string): string {
  const now = new Date();
  const dateStr = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
  return `${dateStr}-${userName}`;
}

/**
 * 주문번호 자동 생성
 * @example generateOrderNumber() => "ORD-20260319-001"
 */
export function generateOrderNumber(sequence: number): string {
  const now = new Date();
  const dateStr = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
  return `ORD-${dateStr}-${String(sequence).padStart(3, '0')}`;
}

/**
 * VAT 계산 (10%)
 */
export function calculateVat(subtotal: number, discountAmount: number = 0): {
  subtotal: number;
  discount: number;
  taxableAmount: number;
  vat: number;
  total: number;
} {
  const taxableAmount = subtotal - discountAmount;
  const vat = Math.round(taxableAmount * 0.1);
  return {
    subtotal,
    discount: discountAmount,
    taxableAmount,
    vat,
    total: taxableAmount + vat,
  };
}

/**
 * 할인율 계산
 */
export function calculateDiscountRate(listPrice: number, salePrice: number): number {
  if (listPrice <= 0) return 0;
  return Math.round(((listPrice - salePrice) / listPrice) * 100);
}

/**
 * 검색어 하이라이트
 */
export function highlightMatch(text: string, query: string): string {
  if (!query) return text;
  const regex = new RegExp(`(${escapeRegex(query)})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
}

/**
 * 정규식 이스케이프
 */
export function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * 클래스명 조합 유틸리티
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * 딜레이 유틸리티
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * 디바운스
 */
export function debounce<T extends (...args: unknown[]) => void>(
  fn: T,
  ms: number
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
}
