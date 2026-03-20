'use client';

import { useState } from 'react';
import { Trash2, Plus, Minus, Tag, ShoppingCart, ArrowRight, Mail, Printer, FileText, X } from 'lucide-react';
import { formatCurrency } from '@jinuchem/shared';
import { useCartStore } from '@/stores/cartStore';
import Link from 'next/link';

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart, getTotal } = useCartStore();
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [addCatalogNo, setAddCatalogNo] = useState('');
  const [showQuoteModal, setShowQuoteModal] = useState(false);

  const subtotal = getTotal();
  const discount = promoApplied ? Math.round(subtotal * 0.05) : 0;
  const taxable = subtotal - discount;
  const vat = Math.round(taxable * 0.1);
  const total = taxable + vat;

  const handlePrintQuote = () => {
    setShowQuoteModal(true);
  };

  const printQuote = () => {
    const printWindow = window.open('', '_blank', 'width=800,height=600');
    if (!printWindow) return;

    const today = new Date().toLocaleDateString('ko-KR');
    const quoteNo = `QT-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;

    const rows = items.map((item, i) => `
      <tr>
        <td style="border:1px solid #ddd;padding:8px;text-align:center;">${i + 1}</td>
        <td style="border:1px solid #ddd;padding:8px;">${item.productName}</td>
        <td style="border:1px solid #ddd;padding:8px;text-align:center;">${item.catalogNo}</td>
        <td style="border:1px solid #ddd;padding:8px;text-align:center;">${item.supplierName}</td>
        <td style="border:1px solid #ddd;padding:8px;text-align:center;">${item.size}${item.unit}</td>
        <td style="border:1px solid #ddd;padding:8px;text-align:right;">${Number(item.unitPrice).toLocaleString('ko-KR')}</td>
        <td style="border:1px solid #ddd;padding:8px;text-align:center;">${item.quantity}</td>
        <td style="border:1px solid #ddd;padding:8px;text-align:right;">${(item.unitPrice * item.quantity).toLocaleString('ko-KR')}</td>
      </tr>
    `).join('');

    printWindow.document.write(`
      <!DOCTYPE html>
      <html><head><title>견적서 - ${quoteNo}</title>
      <style>body{font-family:'Noto Sans KR',sans-serif;padding:40px;color:#333;}
      h1{text-align:center;font-size:24px;margin-bottom:8px;}
      table{width:100%;border-collapse:collapse;margin:20px 0;}
      th{background:#f8f9fa;border:1px solid #ddd;padding:10px;font-size:13px;}
      td{font-size:13px;}
      .info{display:flex;justify-content:space-between;margin:20px 0;}
      .info div{font-size:14px;}
      .summary{margin-top:20px;text-align:right;}
      .summary div{font-size:14px;margin:4px 0;}
      .summary .total{font-size:18px;font-weight:bold;color:#2563eb;}
      @media print{body{padding:20px;}}</style></head><body>
      <h1>견 적 서</h1>
      <p style="text-align:center;color:#666;font-size:14px;">JINUCHEM Co., Ltd.</p>
      <hr style="margin:20px 0;"/>
      <div class="info">
        <div><strong>견적번호:</strong> ${quoteNo}<br/><strong>견적일자:</strong> ${today}<br/><strong>유효기간:</strong> 발행일로부터 30일</div>
        <div style="text-align:right;"><strong>공급자:</strong> JINUCHEM<br/><strong>사업자번호:</strong> 123-45-67890<br/><strong>연락처:</strong> 02-1234-5678</div>
      </div>
      <table>
        <thead><tr>
          <th style="width:40px;">No.</th><th>제품명</th><th style="width:90px;">카탈로그번호</th>
          <th style="width:100px;">공급사</th><th style="width:70px;">용량</th>
          <th style="width:90px;">단가</th><th style="width:50px;">수량</th><th style="width:100px;">금액</th>
        </tr></thead>
        <tbody>${rows}</tbody>
      </table>
      <div class="summary">
        <div>소계: ${subtotal.toLocaleString('ko-KR')}원</div>
        ${discount > 0 ? `<div style="color:#dc2626;">할인: -${discount.toLocaleString('ko-KR')}원</div>` : ''}
        <div>VAT (10%): ${vat.toLocaleString('ko-KR')}원</div>
        <div class="total">총 금액: ${total.toLocaleString('ko-KR')}원</div>
      </div>
      <hr style="margin:30px 0;"/>
      <p style="text-align:center;font-size:12px;color:#999;">본 견적서는 JINU Shop에서 발행되었습니다.</p>
      <script>window.onload=function(){window.print();}</script>
      </body></html>
    `);
    printWindow.document.close();
    setShowQuoteModal(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[var(--text)]">장바구니</h1>
        <div className="flex gap-2">
          <button className="h-[38px] px-4 border border-[var(--border)] text-sm text-[var(--text-secondary)] rounded-lg hover:border-blue-400 flex items-center gap-1.5">
            <Mail size={14} /> 이메일 공유
          </button>
          <button className="h-[38px] px-4 border border-[var(--border)] text-sm text-[var(--text-secondary)] rounded-lg hover:border-blue-400 flex items-center gap-1.5">
            <Printer size={14} /> 인쇄
          </button>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-20 text-[var(--text-secondary)]">
          <ShoppingCart size={48} className="mx-auto mb-4 opacity-30" />
          <p className="text-lg font-medium mb-1">장바구니가 비어있습니다</p>
          <p className="text-sm mb-4">시약 또는 소모품을 장바구니에 추가해보세요</p>
          <Link href="/order" className="inline-flex items-center gap-1.5 h-[38px] px-4 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700">
            시약 주문하러 가기
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-[1fr_340px] gap-6">
          {/* Cart Items */}
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.id} className="bg-[var(--bg-card)] rounded-xl border border-[var(--border)] p-4 flex items-center gap-4">
                {/* Formula */}
                <div className="w-[80px] h-[80px] bg-gray-50 rounded-lg flex items-center justify-center shrink-0">
                  <span className="text-sm font-mono text-gray-300">{item.formula || '?'}</span>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-blue-600 font-medium">{item.supplierName}</span>
                    <span className="text-xs text-[var(--text-secondary)]">{item.catalogNo}</span>
                  </div>
                  <h3 className="text-sm font-semibold text-[var(--text)] mb-1">{item.productName}</h3>
                  <p className="text-xs text-[var(--text-secondary)]">{item.size}{item.unit}</p>
                </div>

                {/* Quantity */}
                <div className="flex items-center border border-[var(--border)] rounded-lg overflow-hidden">
                  <button
                    onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                    className="w-[34px] h-[34px] flex items-center justify-center hover:bg-gray-100"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-[40px] text-center text-sm font-medium text-[var(--text)]">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-[34px] h-[34px] flex items-center justify-center hover:bg-gray-100"
                  >
                    <Plus size={14} />
                  </button>
                </div>

                {/* Price */}
                <div className="text-right w-[120px] shrink-0">
                  <p className="text-xs text-[var(--text-secondary)]">{formatCurrency(item.unitPrice)} x {item.quantity}</p>
                  <p className="text-base font-bold text-[var(--text)]">{formatCurrency(item.unitPrice * item.quantity)}</p>
                </div>

                {/* Remove */}
                <button onClick={() => removeItem(item.id)} className="text-[var(--text-secondary)] hover:text-red-500 shrink-0">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}

            {/* Add by catalog number */}
            <div className="bg-[var(--bg-card)] rounded-xl border border-dashed border-[var(--border)] p-4">
              <p className="text-sm text-[var(--text-secondary)] mb-2">카탈로그번호로 직접 추가</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={addCatalogNo}
                  onChange={(e) => setAddCatalogNo(e.target.value)}
                  placeholder="카탈로그번호 입력..."
                  className="flex-1 h-[38px] px-4 border border-[var(--border)] rounded-lg text-sm bg-[var(--bg)] text-[var(--text)]"
                />
                <button className="h-[38px] px-4 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 flex items-center gap-1">
                  <Plus size={14} /> 추가
                </button>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="space-y-4">
            {/* Promo Code */}
            <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border)] p-4">
              <h3 className="text-sm font-semibold text-[var(--text)] mb-3 flex items-center gap-2">
                <Tag size={14} /> 프로모션 코드
              </h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="코드 입력..."
                  className="flex-1 h-[38px] px-3 border border-[var(--border)] rounded-lg text-sm bg-[var(--bg)] text-[var(--text)]"
                />
                <button
                  onClick={() => { if (promoCode) setPromoApplied(true); }}
                  className="h-[38px] px-4 border border-blue-600 text-blue-600 text-sm font-medium rounded-lg hover:bg-blue-50"
                >
                  적용
                </button>
              </div>
              {promoApplied && (
                <p className="text-xs text-emerald-600 mt-2">5% 할인이 적용되었습니다</p>
              )}
            </div>

            {/* Summary */}
            <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border)] p-5">
              <h3 className="text-base font-semibold text-[var(--text)] mb-4">주문 요약</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-[var(--text-secondary)]">제품 가격 ({items.length}개)</span>
                  <span className="text-[var(--text)]">{formatCurrency(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-red-600">
                    <span>할인 금액</span>
                    <span>-{formatCurrency(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-[var(--text-secondary)]">소계</span>
                  <span className="text-[var(--text)]">{formatCurrency(taxable)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--text-secondary)]">VAT (10%)</span>
                  <span className="text-[var(--text)]">{formatCurrency(vat)}</span>
                </div>
                <div className="border-t border-[var(--border)] pt-3 flex justify-between">
                  <span className="text-base font-bold text-[var(--text)]">총 결제금액</span>
                  <span className="text-xl font-bold text-blue-600">{formatCurrency(total)}</span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="mt-5 w-full h-[42px] bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                주문하기
                <ArrowRight size={16} />
              </Link>

              <button
                onClick={handlePrintQuote}
                className="mt-2 w-full h-[38px] border border-[var(--border)] text-[var(--text-secondary)] text-sm rounded-lg hover:border-blue-400 flex items-center justify-center gap-1.5"
              >
                <FileText size={14} />
                견적서 출력
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quote Print Modal */}
      {showQuoteModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center" onClick={() => setShowQuoteModal(false)}>
          <div className="bg-[var(--bg-card)] rounded-2xl w-[600px] max-h-[80vh] overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-[var(--text)]">견적서 미리보기</h2>
              <button onClick={() => setShowQuoteModal(false)} className="text-[var(--text-secondary)] hover:text-[var(--text)]">
                <X size={20} />
              </button>
            </div>

            <div className="border border-[var(--border)] rounded-xl p-5 mb-4">
              <h3 className="text-center text-xl font-bold text-[var(--text)] mb-1">견 적 서</h3>
              <p className="text-center text-sm text-[var(--text-secondary)] mb-4">JINUCHEM Co., Ltd.</p>

              <div className="flex justify-between text-sm mb-4">
                <div>
                  <p className="text-[var(--text-secondary)]">견적일자: {new Date().toLocaleDateString('ko-KR')}</p>
                  <p className="text-[var(--text-secondary)]">유효기간: 발행일로부터 30일</p>
                </div>
              </div>

              <table className="w-full text-sm border-collapse mb-4">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-[var(--border)] px-3 py-2 text-left">제품명</th>
                    <th className="border border-[var(--border)] px-3 py-2 text-center w-[70px]">용량</th>
                    <th className="border border-[var(--border)] px-3 py-2 text-right w-[80px]">단가</th>
                    <th className="border border-[var(--border)] px-3 py-2 text-center w-[50px]">수량</th>
                    <th className="border border-[var(--border)] px-3 py-2 text-right w-[90px]">금액</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id}>
                      <td className="border border-[var(--border)] px-3 py-2 text-[var(--text)]">{item.productName}</td>
                      <td className="border border-[var(--border)] px-3 py-2 text-center text-[var(--text)]">{item.size}{item.unit}</td>
                      <td className="border border-[var(--border)] px-3 py-2 text-right text-[var(--text)]">{formatCurrency(item.unitPrice)}</td>
                      <td className="border border-[var(--border)] px-3 py-2 text-center text-[var(--text)]">{item.quantity}</td>
                      <td className="border border-[var(--border)] px-3 py-2 text-right font-medium text-[var(--text)]">{formatCurrency(item.unitPrice * item.quantity)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="text-right space-y-1 text-sm">
                <p className="text-[var(--text-secondary)]">소계: {formatCurrency(subtotal)}</p>
                {discount > 0 && <p className="text-red-600">할인: -{formatCurrency(discount)}</p>}
                <p className="text-[var(--text-secondary)]">VAT (10%): {formatCurrency(vat)}</p>
                <p className="text-lg font-bold text-blue-600">총 금액: {formatCurrency(total)}</p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowQuoteModal(false)}
                className="flex-1 h-[38px] border border-[var(--border)] text-sm text-[var(--text)] rounded-lg hover:bg-gray-50"
              >
                닫기
              </button>
              <button
                onClick={printQuote}
                className="flex-1 h-[38px] bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 flex items-center justify-center gap-1.5"
              >
                <Printer size={14} /> 인쇄하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
