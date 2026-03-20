'use client';

import { useState } from 'react';
import { Trash2, Plus, Minus, Tag, ShoppingCart, ArrowRight, Mail, Printer } from 'lucide-react';
import { formatCurrency } from '@jinuchem/shared';
import Link from 'next/link';

interface CartItem {
  id: string;
  productName: string;
  catalogNo: string;
  supplierName: string;
  size: string;
  unitPrice: number;
  quantity: number;
  formula?: string;
}

const initialItems: CartItem[] = [
  { id: '1', productName: 'Ethyl alcohol, Pure', catalogNo: '459844', supplierName: 'Sigma-Aldrich', size: '500mL', unitPrice: 142415, quantity: 2, formula: 'C₂H₅OH' },
  { id: '2', productName: 'Acetone, ACS Grade', catalogNo: 'A0003', supplierName: 'TCI', size: '2.5L', unitPrice: 87800, quantity: 1, formula: 'CH₃COCH₃' },
  { id: '3', productName: 'PIPES, 고순도', catalogNo: 'P0058', supplierName: 'TCI', size: '5G', unitPrice: 226200, quantity: 1, formula: 'C₈H₁₈N₂O₆S₂' },
];

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>(initialItems);
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [addCatalogNo, setAddCatalogNo] = useState('');

  const updateQuantity = (id: string, delta: number) => {
    setItems(items.map((item) =>
      item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
    ));
  };

  const removeItem = (id: string) => setItems(items.filter((item) => item.id !== id));

  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const discount = promoApplied ? Math.round(subtotal * 0.05) : 0;
  const taxable = subtotal - discount;
  const vat = Math.round(taxable * 0.1);
  const total = taxable + vat;

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

      <div className="grid grid-cols-[1fr_340px] gap-6">
        {/* Cart Items */}
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="bg-[var(--bg-card)] rounded-xl border border-[var(--border)] p-4 flex items-center gap-4">
              {/* Formula */}
              <div className="w-[80px] h-[80px] bg-gray-50 rounded-lg flex items-center justify-center shrink-0">
                <span className="text-sm font-mono text-gray-300">{item.formula}</span>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs text-blue-600 font-medium">{item.supplierName}</span>
                  <span className="text-xs text-[var(--text-secondary)]">{item.catalogNo}</span>
                </div>
                <h3 className="text-sm font-semibold text-[var(--text)] mb-1">{item.productName}</h3>
                <p className="text-xs text-[var(--text-secondary)]">{item.size}</p>
              </div>

              {/* Quantity */}
              <div className="flex items-center border border-[var(--border)] rounded-lg overflow-hidden">
                <button onClick={() => updateQuantity(item.id, -1)} className="w-[34px] h-[34px] flex items-center justify-center hover:bg-gray-100">
                  <Minus size={14} />
                </button>
                <span className="w-[40px] text-center text-sm font-medium text-[var(--text)]">{item.quantity}</span>
                <button onClick={() => updateQuantity(item.id, 1)} className="w-[34px] h-[34px] flex items-center justify-center hover:bg-gray-100">
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

          {items.length === 0 && (
            <div className="text-center py-20 text-[var(--text-secondary)]">
              <ShoppingCart size={48} className="mx-auto mb-4 opacity-30" />
              <p className="text-lg font-medium mb-1">장바구니가 비어있습니다</p>
              <Link href="/order" className="text-sm text-blue-600 hover:underline">시약 주문하러 가기</Link>
            </div>
          )}

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

            <button className="mt-2 w-full h-[38px] border border-[var(--border)] text-[var(--text-secondary)] text-sm rounded-lg hover:border-blue-400">
              견적 요청
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
