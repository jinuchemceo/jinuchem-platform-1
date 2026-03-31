'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  FlaskConical, Search, Package, CheckCircle, Truck,
  ArrowLeft, Clock, CircleDot, MapPin,
} from 'lucide-react';

type OrderStatus = 'confirmed' | 'paid' | 'preparing' | 'shipping' | 'delivered';

interface OrderResult {
  orderNo: string;
  orderDate: string;
  status: OrderStatus;
  items: { name: string; qty: number; price: string }[];
  totalPrice: string;
  trackingNo: string | null;
  deliveryDate: string | null;
}

const STATUS_STEPS: { key: OrderStatus; label: string; icon: React.ElementType }[] = [
  { key: 'confirmed', label: '주문확인', icon: CheckCircle },
  { key: 'paid', label: '결제완료', icon: CircleDot },
  { key: 'preparing', label: '배송준비', icon: Package },
  { key: 'shipping', label: '배송중', icon: Truck },
  { key: 'delivered', label: '배송완료', icon: MapPin },
];

const MOCK_ORDER: OrderResult = {
  orderNo: 'ORD-2026-03-00142',
  orderDate: '2026-03-28',
  status: 'shipping',
  items: [
    { name: 'Acetonitrile (HPLC grade)', qty: 2, price: '45,000' },
    { name: 'Methanol (ACS reagent)', qty: 1, price: '32,000' },
  ],
  totalPrice: '122,000',
  trackingNo: '6012345678901',
  deliveryDate: '2026-04-01',
};

export default function OrderTrackingPage() {
  const [orderNo, setOrderNo] = useState('');
  const [contact, setContact] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<OrderResult | null>(null);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setResult(null);
    setSearched(true);

    if (!orderNo.trim() || !contact.trim()) {
      setError('주문번호와 이메일 또는 전화번호를 입력해주세요.');
      return;
    }

    setLoading(true);

    // Mock API call
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Demo: show result if order number contains "142" or any input
    if (orderNo.includes('142') || orderNo.length >= 5) {
      setResult(MOCK_ORDER);
    } else {
      setError('해당 주문을 찾을 수 없습니다. 주문번호와 연락처를 다시 확인해주세요.');
    }

    setLoading(false);
  };

  const getStepIndex = (status: OrderStatus) =>
    STATUS_STEPS.findIndex((s) => s.key === status);

  const currentStepIndex = result ? getStepIndex(result.status) : -1;

  return (
    <div className="w-full max-w-[520px]">
      {/* Logo */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4">
          <FlaskConical size={32} className="text-white" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">JINU Shop</h1>
        <p className="text-sm text-gray-500 mt-1">비회원 주문 조회</p>
      </div>

      {/* Search Form */}
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">주문 조회</h2>
        <p className="text-sm text-gray-500 mb-6">
          주문번호와 주문 시 입력한 이메일 또는 전화번호를 입력하세요.
        </p>

        {error && (
          <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSearch} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">주문번호</label>
            <div className="relative">
              <Package size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={orderNo}
                onChange={(e) => setOrderNo(e.target.value)}
                placeholder="ORD-2026-03-00142"
                className="w-full h-[42px] pl-10 pr-4 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">이메일 또는 전화번호</label>
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="name@organization.ac.kr 또는 010-0000-0000"
                className="w-full h-[42px] pl-10 pr-4 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-[38px] bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              '조회 중...'
            ) : (
              <>
                <Search size={16} />
                조회
              </>
            )}
          </button>
        </form>

        {/* Result */}
        {result && (
          <div className="mt-8 pt-6 border-t border-gray-200">
            {/* Order Info */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-gray-500">주문번호</p>
                <p className="text-base font-semibold text-gray-900">{result.orderNo}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">주문일</p>
                <p className="text-sm font-medium text-gray-700">{result.orderDate}</p>
              </div>
            </div>

            {/* Status Timeline */}
            <div className="bg-gray-50 rounded-xl p-5 mb-4">
              <div className="flex items-center justify-between relative">
                {/* Progress line */}
                <div className="absolute top-5 left-5 right-5 h-0.5 bg-gray-200" />
                <div
                  className="absolute top-5 left-5 h-0.5 bg-blue-600 transition-all duration-500"
                  style={{ width: `${(currentStepIndex / (STATUS_STEPS.length - 1)) * (100 - (10 / (STATUS_STEPS.length - 1)) * 100 / 100 * 2)}%` }}
                />

                {STATUS_STEPS.map((step, idx) => {
                  const isCompleted = idx <= currentStepIndex;
                  const isCurrent = idx === currentStepIndex;
                  const StepIcon = step.icon;

                  return (
                    <div key={step.key} className="relative z-10 flex flex-col items-center gap-2">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                          isCurrent
                            ? 'bg-blue-600 text-white ring-4 ring-blue-100'
                            : isCompleted
                              ? 'bg-blue-600 text-white'
                              : 'bg-white text-gray-400 border-2 border-gray-200'
                        }`}
                      >
                        <StepIcon size={18} />
                      </div>
                      <span
                        className={`text-xs font-medium ${
                          isCurrent ? 'text-blue-600' : isCompleted ? 'text-gray-700' : 'text-gray-400'
                        }`}
                      >
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Tracking / Delivery Info */}
            {(result.trackingNo || result.deliveryDate) && (
              <div className="bg-blue-50 rounded-lg p-4 mb-4 flex items-start gap-3">
                <Truck size={18} className="text-blue-600 mt-0.5 shrink-0" />
                <div className="text-sm">
                  {result.trackingNo && (
                    <p className="text-gray-700">
                      <span className="font-medium">운송장번호:</span> {result.trackingNo}
                    </p>
                  )}
                  {result.deliveryDate && (
                    <p className="text-gray-700 mt-0.5">
                      <span className="font-medium">배송예정일:</span> {result.deliveryDate}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Order Items */}
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-4 py-2.5 border-b border-gray-200">
                <span className="text-sm font-medium text-gray-700">주문 상품</span>
              </div>
              <div className="divide-y divide-gray-100">
                {result.items.map((item, idx) => (
                  <div key={idx} className="px-4 py-3 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{item.name}</p>
                      <p className="text-xs text-gray-500">수량: {item.qty}</p>
                    </div>
                    <span className="text-sm font-medium text-gray-700">{item.price}원</span>
                  </div>
                ))}
              </div>
              <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">총 결제금액</span>
                <span className="text-base font-bold text-gray-900">{result.totalPrice}원</span>
              </div>
            </div>
          </div>
        )}

        {/* No result message */}
        {searched && !result && !error && !loading && (
          <div className="mt-6 text-center py-8">
            <Clock size={40} className="mx-auto text-gray-300 mb-3" />
            <p className="text-sm text-gray-500">조회 결과가 없습니다.</p>
          </div>
        )}
      </div>

      {/* Back to Login */}
      <div className="text-center mt-6">
        <Link href="/login" className="inline-flex items-center gap-1.5 text-sm text-blue-600 font-medium hover:underline">
          <ArrowLeft size={14} />
          로그인 페이지로 돌아가기
        </Link>
      </div>

      {/* Platform Links */}
      <div className="flex justify-center gap-4 mt-4">
        <span className="text-xs text-gray-400">JINUCHEM 플랫폼:</span>
        <a href="http://localhost:3001" className="text-xs text-gray-500 hover:text-blue-600">E-Note</a>
        <a href="http://localhost:3002" className="text-xs text-gray-500 hover:text-blue-600">공급사</a>
        <a href="http://localhost:3004" className="text-xs text-gray-500 hover:text-blue-600">API</a>
      </div>
    </div>
  );
}
