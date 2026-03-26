'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft, ShoppingCart, ChevronRight, Truck, Clock,
  Package, RefreshCw, FileText, Download, CheckCircle, AlertCircle, Info,
} from 'lucide-react';
import { sampleSupplies } from '@/lib/mock-data';
import { formatCurrency } from '@jinuchem/shared';
import { useCartStore } from '@/stores/cartStore';

const SUBSCRIPTION_PERIODS = [
  { value: '1w', label: '1주' },
  { value: '2w', label: '2주' },
  { value: '1m', label: '1개월' },
  { value: '2m', label: '2개월' },
  { value: '3m', label: '3개월' },
];

// 호환성 정보 (mock)
const COMPATIBILITY: Record<string, { compatible: string[]; incompatible: string[] }> = {
  s1: {
    compatible: ['HPLC 시스템', 'Vacuum manifold', '주사기형 홀더'],
    incompatible: ['고온(>100C) 환경', '강산성 용액'],
  },
  s3: {
    compatible: ['Eppendorf Research Plus', 'Gilson Pipetman P200', 'Thermo Finnpipette'],
    incompatible: ['비표준 피펫'],
  },
};

// 대체품 정보 (mock)
const ALTERNATIVES: Record<string, { id: string; name: string; supplier: string; price: number }[]> = {
  s1: [
    { id: 's1-alt1', name: '시린지 필터 0.22um Nylon (100개/팩)', supplier: 'Pall', price: 172000 },
    { id: 's1-alt2', name: '시린지 필터 0.45um PVDF (100개/팩)', supplier: 'Millipore', price: 168000 },
  ],
  s2: [
    { id: 's2-alt1', name: '라텍스 장갑 (M) 100매', supplier: 'Ansell', price: 22000 },
    { id: 's2-alt2', name: '바이닐 장갑 (M) 100매', supplier: 'Kimberly-Clark', price: 18500 },
  ],
  s3: [
    { id: 's3-alt1', name: '마이크로피펫 팁 200uL 필터 (1000개)', supplier: 'Eppendorf', price: 68000 },
  ],
};

export default function SupplyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const supply = sampleSupplies.find((s) => s.id === params.id);
  const [quantity, setQuantity] = useState(1);
  const [subscriptionEnabled, setSubscriptionEnabled] = useState(false);
  const [subscriptionPeriod, setSubscriptionPeriod] = useState('1m');
  const [toast, setToast] = useState<string | null>(null);
  const addToCart = useCartStore((s) => s.addItem);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  if (!supply) {
    return (
      <div className="text-center py-20">
        <p className="text-lg text-[var(--text-secondary)]">제품을 찾을 수 없습니다</p>
        <button onClick={() => router.push('/supplies')} className="mt-4 text-blue-600 hover:underline">
          소모품 목록으로 돌아가기
        </button>
      </div>
    );
  }

  const variant = supply.variants[0];
  const price = variant.salePrice ?? variant.listPrice;
  const totalPrice = price * quantity;
  const compatibility = COMPATIBILITY[supply.id];
  const alternatives = ALTERNATIVES[supply.id] ?? [];

  const handleAddToCart = () => {
    addToCart({
      productId: supply.id,
      productName: supply.name,
      catalogNo: supply.catalogNo || '',
      supplierName: supply.supplierName,
      variantId: variant.id,
      size: variant.size,
      unit: variant.unit,
      unitPrice: price,
      quantity,
    });
    showToast(`${supply.name} ${quantity}개가 장바구니에 추가되었습니다.`);
  };

  return (
    <div>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)] mb-6">
        <button onClick={() => router.push('/supplies')} className="hover:text-[var(--text)] flex items-center gap-1">
          <ArrowLeft size={14} />
          소모품 주문
        </button>
        <ChevronRight size={14} />
        <span className="text-[var(--text-secondary)]">{supply.categoryName}</span>
        <ChevronRight size={14} />
        <span className="text-[var(--text)]">{supply.name}</span>
      </div>

      <div className="grid grid-cols-[1fr_1fr] gap-8">
        {/* Left: Product Info Card */}
        <div>
          {/* Product Image Placeholder */}
          <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border)] p-8 mb-4 flex flex-col items-center justify-center min-h-[280px]">
            <Package size={64} className="text-[var(--text-secondary)] opacity-30 mb-4" />
            <p className="text-sm text-[var(--text-secondary)]">{supply.categoryName}</p>
            <p className="text-lg font-semibold text-[var(--text)] mt-1 text-center">{supply.name}</p>
          </div>

          {/* Compatibility */}
          {compatibility && (
            <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border)] p-4 mb-4">
              <h3 className="text-sm font-semibold text-[var(--text)] mb-3 flex items-center gap-2">
                <Info size={16} className="text-blue-500" />
                호환성 정보
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs font-medium text-emerald-600 mb-1.5 flex items-center gap-1">
                    <CheckCircle size={12} /> 호환 가능
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {compatibility.compatible.map((item) => (
                      <span key={item} className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs rounded-lg border border-emerald-200">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-medium text-red-600 mb-1.5 flex items-center gap-1">
                    <AlertCircle size={12} /> 비호환/주의
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {compatibility.incompatible.map((item) => (
                      <span key={item} className="px-2.5 py-1 bg-red-50 text-red-700 text-xs rounded-lg border border-red-200">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Documents */}
          <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border)] p-4">
            <h3 className="text-sm font-semibold text-[var(--text)] mb-3 flex items-center gap-2">
              <FileText size={16} />
              문서 다운로드
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {['SDS', 'Spec Sheet', 'KC 인증서'].map((doc) => (
                <button
                  key={doc}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-[var(--text)] border border-[var(--border)] rounded-lg hover:border-blue-400 hover:text-blue-600 transition-colors"
                >
                  <Download size={14} />
                  {doc}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Details + Purchase */}
        <div>
          {/* Supplier + Catalog */}
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm text-blue-600 font-medium">{supply.supplierName}</span>
            <span className="text-sm text-[var(--text-secondary)]">|</span>
            <span className="text-sm text-[var(--text-secondary)]">{supply.catalogNo}</span>
          </div>

          {/* Product Name */}
          <h1 className="text-2xl font-bold text-[var(--text)] mb-1">{supply.name}</h1>
          <p className="text-sm text-[var(--text-secondary)] mb-4">{supply.categoryName}</p>

          {/* Specs Table */}
          <div className="bg-[var(--bg)] rounded-xl p-4 mb-4">
            <div className="grid grid-cols-2 gap-y-3 text-sm">
              <div>
                <span className="text-[var(--text-secondary)]">카탈로그 번호</span>
                <p className="font-medium text-[var(--text)] mt-0.5">{supply.catalogNo}</p>
              </div>
              <div>
                <span className="text-[var(--text-secondary)]">카테고리</span>
                <p className="font-medium text-[var(--text)] mt-0.5">{supply.categoryName}</p>
              </div>
              <div>
                <span className="text-[var(--text-secondary)]">포장 단위</span>
                <p className="font-medium text-[var(--text)] mt-0.5">{variant.size} / {variant.unit}</p>
              </div>
              <div>
                <span className="text-[var(--text-secondary)]">공급사</span>
                <p className="font-medium text-[var(--text)] mt-0.5">{supply.supplierName}</p>
              </div>
            </div>
          </div>

          {/* Price Table */}
          <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border)] overflow-hidden mb-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800 border-b border-[var(--border)]">
                  <th className="text-left px-4 py-2.5 font-medium text-[var(--text-secondary)]">포장단위</th>
                  <th className="text-right px-4 py-2.5 font-medium text-[var(--text-secondary)]">단가</th>
                  <th className="text-center px-4 py-2.5 font-medium text-[var(--text-secondary)]">재고</th>
                  <th className="text-center px-4 py-2.5 font-medium text-[var(--text-secondary)]">납품예정일</th>
                </tr>
              </thead>
              <tbody>
                {supply.variants.map((v) => (
                  <tr key={v.id} className="border-b border-[var(--border)] last:border-0">
                    <td className="px-4 py-3 font-medium text-[var(--text)]">
                      {v.size} / {v.unit}
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-[var(--text)]">
                      {formatCurrency(v.salePrice ?? v.listPrice)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {v.stockQty > 0 ? (
                        <span className="text-emerald-600 font-medium">{v.stockQty}</span>
                      ) : (
                        <span className="text-red-500">품절</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center text-sm text-[var(--text-secondary)]">
                      <div className="flex items-center justify-center gap-1">
                        {v.sameDayShip && <Truck size={12} className="text-emerald-600" />}
                        {v.deliveryDate || '-'}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Subscription Option */}
          {supply.subscriptionAvailable && (
            <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border)] p-4 mb-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-[var(--text)] flex items-center gap-2">
                  <RefreshCw size={16} className="text-blue-500" />
                  정기배송
                </h3>
                <label className="flex items-center gap-2 cursor-pointer">
                  <span className="text-sm text-[var(--text-secondary)]">
                    {subscriptionEnabled ? '활성' : '비활성'}
                  </span>
                  <button
                    onClick={() => setSubscriptionEnabled(!subscriptionEnabled)}
                    className={`relative w-10 h-5 rounded-full transition-colors ${
                      subscriptionEnabled ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                        subscriptionEnabled ? 'translate-x-5' : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                </label>
              </div>
              {subscriptionEnabled && (
                <div className="flex gap-2">
                  {SUBSCRIPTION_PERIODS.map((period) => (
                    <button
                      key={period.value}
                      onClick={() => setSubscriptionPeriod(period.value)}
                      className={`px-3 h-[38px] rounded-lg text-sm font-medium border transition-colors ${
                        subscriptionPeriod === period.value
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-[var(--bg-card)] text-[var(--text)] border-[var(--border)] hover:border-blue-400'
                      }`}
                    >
                      {period.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Quantity + Actions */}
          <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border)] p-4">
            <div className="flex items-center gap-4 mb-4">
              <span className="text-sm text-[var(--text-secondary)]">수량</span>
              <div className="flex items-center border border-[var(--border)] rounded-lg overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-[38px] h-[38px] flex items-center justify-center text-[var(--text)] hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  -
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-[60px] h-[38px] text-center text-sm font-medium text-[var(--text)] border-x border-[var(--border)] bg-[var(--bg-card)]"
                />
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-[38px] h-[38px] flex items-center justify-center text-[var(--text)] hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  +
                </button>
              </div>
              <div className="ml-auto text-right">
                <p className="text-xs text-[var(--text-secondary)]">합계 (VAT 별도)</p>
                <p className="text-xl font-bold text-[var(--text)]">{formatCurrency(totalPrice)}</p>
              </div>
            </div>

            {variant.sameDayShip && (
              <div className="flex items-center gap-2 mb-4 px-3 py-2 bg-emerald-50 dark:bg-emerald-950 rounded-lg">
                <Clock size={14} className="text-emerald-600" />
                <span className="text-xs text-emerald-700 dark:text-emerald-400 font-medium">
                  오후 3시 이전 주문 시 당일출고 | 납품예정일: {variant.deliveryDate}
                </span>
              </div>
            )}

            {subscriptionEnabled && (
              <div className="flex items-center gap-2 mb-4 px-3 py-2 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <RefreshCw size={14} className="text-blue-600" />
                <span className="text-xs text-blue-700 dark:text-blue-400 font-medium">
                  정기배송: {SUBSCRIPTION_PERIODS.find((p) => p.value === subscriptionPeriod)?.label}마다 자동 배송
                </span>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                className="flex-1 h-[42px] bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <ShoppingCart size={16} />
                장바구니 담기
              </button>
              <button className="flex-1 h-[42px] border-2 border-blue-600 text-blue-600 font-medium rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950 transition-colors">
                바로 주문하기
              </button>
              <button className="h-[42px] px-4 border border-[var(--border)] text-[var(--text-secondary)] rounded-lg hover:border-blue-400 hover:text-blue-600 transition-colors flex items-center gap-1">
                <Package size={14} />
                견적 요청
              </button>
            </div>
          </div>

          {/* Alternatives */}
          {alternatives.length > 0 && (
            <div className="mt-4 bg-[var(--bg-card)] rounded-xl border border-[var(--border)] p-4">
              <h3 className="text-sm font-semibold text-[var(--text)] mb-3 flex items-center gap-2">
                <Package size={16} className="text-amber-500" />
                대체품 추천
              </h3>
              <div className="space-y-2">
                {alternatives.map((alt) => (
                  <div
                    key={alt.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-[var(--border)] hover:border-blue-300 transition-colors cursor-pointer"
                  >
                    <div>
                      <p className="text-sm font-medium text-[var(--text)]">{alt.name}</p>
                      <p className="text-xs text-[var(--text-secondary)]">{alt.supplier}</p>
                    </div>
                    <span className="text-sm font-bold text-[var(--text)]">{formatCurrency(alt.price)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-800 text-white px-6 py-3 rounded-lg shadow-xl text-sm z-50 animate-fade-in">
          {toast}
        </div>
      )}
    </div>
  );
}
