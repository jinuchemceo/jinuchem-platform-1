'use client';

import { useState } from 'react';
import { ChevronRight, MapPin, Building2, FileText, Truck, Mail, Check, ArrowLeft, ShoppingCart } from 'lucide-react';
import { formatCurrency, generatePoNumber } from '@jinuchem/shared';
import Link from 'next/link';

interface CartItem {
  id: string;
  productName: string;
  catalogNo: string;
  supplierName: string;
  size: string;
  unitPrice: number;
  quantity: number;
}

const cartItems: CartItem[] = [
  { id: '1', productName: 'Ethyl alcohol, Pure', catalogNo: '459844', supplierName: 'Sigma-Aldrich', size: '500mL', unitPrice: 142415, quantity: 2 },
  { id: '2', productName: 'Acetone, ACS Grade', catalogNo: 'A0003', supplierName: 'TCI', size: '2.5L', unitPrice: 87800, quantity: 1 },
  { id: '3', productName: 'PIPES, 고순도', catalogNo: 'P0058', supplierName: 'TCI', size: '5G', unitPrice: 226200, quantity: 1 },
];

const addresses = [
  { id: '1', label: '연구실 (기본)', recipient: '김연구', phone: '055-772-1234', address: '경상남도 진주시 진주대로501 자연과학대학 3층 302호', isDefault: true },
  { id: '2', label: '사무실', recipient: '김연구', phone: '055-772-1235', address: '경상남도 진주시 진주대로501 자연과학대학 2층 203호', isDefault: false },
];

export default function CheckoutPage() {
  const [step, setStep] = useState(1);

  // Step 1 form state
  const [selectedAddressId, setSelectedAddressId] = useState('1');
  const [billingOrg, setBillingOrg] = useState('경상국립대학교 산학협력단');
  const [poNumber] = useState(generatePoNumber('김연구'));
  const [deliveryNote, setDeliveryNote] = useState('');
  const [emailCc, setEmailCc] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('institution');

  const selectedAddress = addresses.find((a) => a.id === selectedAddressId);
  const subtotal = cartItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const vat = Math.round(subtotal * 0.1);
  const total = subtotal + vat;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Link href="/cart" className="text-[var(--text-secondary)] hover:text-[var(--text)]">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-bold text-[var(--text)]">주문서</h1>
        </div>
      </div>

      {/* Steps Indicator */}
      <div className="flex items-center justify-center gap-3 mb-8">
        <div className={`flex items-center gap-2 ${step >= 1 ? 'text-blue-600' : 'text-[var(--text-secondary)]'}`}>
          <span className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center ${
            step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
          }`}>
            {step > 1 ? <Check size={14} /> : '1'}
          </span>
          <span className="text-sm font-medium">주문 정보</span>
        </div>
        <ChevronRight size={16} className="text-[var(--text-secondary)]" />
        <div className={`flex items-center gap-2 ${step >= 2 ? 'text-blue-600' : 'text-[var(--text-secondary)]'}`}>
          <span className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center ${
            step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
          }`}>
            2
          </span>
          <span className="text-sm font-medium">확인 및 결제</span>
        </div>
      </div>

      <div className="grid grid-cols-[1fr_340px] gap-6">
        {/* Left Content */}
        <div className="space-y-5">
          {step === 1 ? (
            <>
              {/* Shipping Address */}
              <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border)] p-5">
                <h2 className="text-base font-semibold text-[var(--text)] mb-4 flex items-center gap-2">
                  <MapPin size={16} className="text-blue-600" /> 배송지 정보
                </h2>
                <div className="space-y-2">
                  {addresses.map((addr) => (
                    <label
                      key={addr.id}
                      className={`block p-3 rounded-lg border cursor-pointer transition-colors ${
                        selectedAddressId === addr.id ? 'border-blue-400 bg-blue-50' : 'border-[var(--border)] hover:border-blue-300'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <input
                          type="radio"
                          name="address"
                          checked={selectedAddressId === addr.id}
                          onChange={() => setSelectedAddressId(addr.id)}
                          className="mt-0.5 accent-blue-600"
                        />
                        <div className="text-sm">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="font-medium text-[var(--text)]">{addr.label}</span>
                            {addr.isDefault && <span className="px-1.5 py-0.5 bg-blue-600 text-white text-[10px] rounded">기본</span>}
                          </div>
                          <p className="text-[var(--text)]">{addr.recipient} / {addr.phone}</p>
                          <p className="text-[var(--text-secondary)]">{addr.address}</p>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Billing Info */}
              <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border)] p-5">
                <h2 className="text-base font-semibold text-[var(--text)] mb-4 flex items-center gap-2">
                  <Building2 size={16} className="text-blue-600" /> 청구 정보
                </h2>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-[var(--text)] mb-1.5">청구기관</label>
                    <input
                      type="text"
                      value={billingOrg}
                      onChange={(e) => setBillingOrg(e.target.value)}
                      className="w-full h-[38px] px-3 border border-[var(--border)] rounded-lg bg-[var(--bg)] text-sm text-[var(--text)]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text)] mb-1.5">PO번호 (자동생성)</label>
                    <input
                      type="text"
                      value={poNumber}
                      readOnly
                      className="w-full h-[38px] px-3 border border-[var(--border)] rounded-lg bg-gray-50 text-sm text-[var(--text)] font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text)] mb-1.5">결제 방법</label>
                    <div className="flex gap-2">
                      {[
                        { key: 'institution', label: '기관 후불결제' },
                        { key: 'card', label: '카드결제' },
                        { key: 'transfer', label: '계좌이체' },
                      ].map((m) => (
                        <button
                          key={m.key}
                          onClick={() => setPaymentMethod(m.key)}
                          className={`h-[38px] px-4 text-sm rounded-lg border transition-colors ${
                            paymentMethod === m.key ? 'bg-blue-600 text-white border-blue-600' : 'border-[var(--border)] text-[var(--text)] hover:border-blue-400'
                          }`}
                        >
                          {m.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Delivery Note + Email CC */}
              <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border)] p-5">
                <h2 className="text-base font-semibold text-[var(--text)] mb-4 flex items-center gap-2">
                  <Truck size={16} className="text-blue-600" /> 배송 요청사항
                </h2>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-[var(--text)] mb-1.5">배송 메모</label>
                    <input
                      type="text"
                      value={deliveryNote}
                      onChange={(e) => setDeliveryNote(e.target.value)}
                      placeholder="예: 부재 시 경비실에 맡겨주세요"
                      className="w-full h-[38px] px-3 border border-[var(--border)] rounded-lg bg-[var(--bg)] text-sm text-[var(--text)]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text)] mb-1.5 flex items-center gap-1">
                      <Mail size={14} /> 이메일 참조 (CC)
                    </label>
                    <input
                      type="email"
                      value={emailCc}
                      onChange={(e) => setEmailCc(e.target.value)}
                      placeholder="주문확인 이메일을 추가로 받을 주소"
                      className="w-full h-[38px] px-3 border border-[var(--border)] rounded-lg bg-[var(--bg)] text-sm text-[var(--text)]"
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={() => setStep(2)}
                className="w-full h-[42px] bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
              >
                다음 단계 <ChevronRight size={16} />
              </button>
            </>
          ) : (
            <>
              {/* Step 2: Review */}
              <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border)] p-5">
                <h2 className="text-base font-semibold text-[var(--text)] mb-4 flex items-center gap-2">
                  <MapPin size={16} className="text-blue-600" /> 배송지 확인
                </h2>
                {selectedAddress && (
                  <div className="text-sm text-[var(--text-secondary)] space-y-1">
                    <p className="font-medium text-[var(--text)]">{selectedAddress.label}</p>
                    <p>{selectedAddress.recipient} / {selectedAddress.phone}</p>
                    <p>{selectedAddress.address}</p>
                    {deliveryNote && <p className="text-blue-600">메모: {deliveryNote}</p>}
                  </div>
                )}
              </div>

              <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border)] p-5">
                <h2 className="text-base font-semibold text-[var(--text)] mb-4 flex items-center gap-2">
                  <Building2 size={16} className="text-blue-600" /> 청구 정보 확인
                </h2>
                <div className="text-sm space-y-1">
                  <p className="text-[var(--text-secondary)]">청구기관: <span className="text-[var(--text)]">{billingOrg}</span></p>
                  <p className="text-[var(--text-secondary)]">PO번호: <span className="font-mono text-[var(--text)]">{poNumber}</span></p>
                  <p className="text-[var(--text-secondary)]">결제방법: <span className="text-[var(--text)]">{
                    paymentMethod === 'institution' ? '기관 후불결제' : paymentMethod === 'card' ? '카드결제' : '계좌이체'
                  }</span></p>
                  {emailCc && <p className="text-[var(--text-secondary)]">이메일 CC: <span className="text-[var(--text)]">{emailCc}</span></p>}
                </div>
              </div>

              <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border)] p-5">
                <h2 className="text-base font-semibold text-[var(--text)] mb-4 flex items-center gap-2">
                  <ShoppingCart size={16} className="text-blue-600" /> 주문 상품 ({cartItems.length}개)
                </h2>
                <div className="space-y-3">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between py-2 border-b border-[var(--border)] last:border-0">
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-xs text-blue-600 font-medium">{item.supplierName}</span>
                          <span className="text-xs text-[var(--text-secondary)]">{item.catalogNo}</span>
                        </div>
                        <p className="text-sm font-medium text-[var(--text)]">{item.productName}</p>
                        <p className="text-xs text-[var(--text-secondary)]">{item.size} x {item.quantity}</p>
                      </div>
                      <span className="text-sm font-bold text-[var(--text)]">{formatCurrency(item.unitPrice * item.quantity)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 h-[42px] border border-[var(--border)] text-[var(--text-secondary)] text-sm font-medium rounded-lg hover:border-blue-400 flex items-center justify-center gap-2"
                >
                  <ArrowLeft size={16} /> 이전 단계
                </button>
                <button
                  onClick={() => alert('주문이 완료되었습니다!')}
                  className="flex-1 h-[42px] bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
                >
                  <FileText size={16} /> 주문 확정
                </button>
              </div>
            </>
          )}
        </div>

        {/* Right: Order Summary (always visible) */}
        <div className="sticky top-6">
          <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border)] p-5">
            <h3 className="text-base font-semibold text-[var(--text)] mb-4">주문 요약</h3>
            <div className="space-y-2 text-sm mb-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between">
                  <span className="text-[var(--text-secondary)] truncate mr-2">
                    {item.productName} x{item.quantity}
                  </span>
                  <span className="text-[var(--text)] shrink-0">{formatCurrency(item.unitPrice * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-[var(--border)] pt-3 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[var(--text-secondary)]">소계</span>
                <span className="text-[var(--text)]">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-secondary)]">VAT (10%)</span>
                <span className="text-[var(--text)]">{formatCurrency(vat)}</span>
              </div>
              <div className="border-t border-[var(--border)] pt-2 flex justify-between">
                <span className="text-base font-bold text-[var(--text)]">총 결제금액</span>
                <span className="text-xl font-bold text-blue-600">{formatCurrency(total)}</span>
              </div>
            </div>

            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-xs text-blue-700 font-medium mb-1">PO번호</p>
              <p className="text-sm font-mono text-blue-900">{poNumber}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
