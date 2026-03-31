'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft, Truck, ShoppingCart, FileText, Heart, AlertTriangle,
  Download, ChevronRight, Shield, Clock, Package, Search, CheckCircle, XCircle,
} from 'lucide-react';
import { sampleReagents } from '@/lib/mock-data';
import { formatCurrency } from '@jinuchem/shared';
import { useFavoriteStore } from '@/stores/favoriteStore';
import { StructureImage } from '@/components/products/StructureImage';
import { useCartStore } from '@/stores/cartStore';
import type { VariantSummary } from '@jinuchem/shared';

// GHS 픽토그램 매핑 (SVG 아이콘 대체)
const GHS_LABELS: Record<string, { label: string; color: string; bgColor: string }> = {
  flame: { label: '인화성', color: 'text-red-700', bgColor: 'bg-red-50 border-red-200' },
  exclamation: { label: '유해성', color: 'text-amber-700', bgColor: 'bg-amber-50 border-amber-200' },
  skull: { label: '급성독성', color: 'text-red-800', bgColor: 'bg-red-100 border-red-300' },
  health: { label: '건강유해', color: 'text-orange-700', bgColor: 'bg-orange-50 border-orange-200' },
  corrosion: { label: '부식성', color: 'text-purple-700', bgColor: 'bg-purple-50 border-purple-200' },
  environment: { label: '환경유해', color: 'text-green-700', bgColor: 'bg-green-50 border-green-200' },
};

export default function ReagentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const reagent = sampleReagents.find((r) => r.id === params.id);
  const [selectedVariant, setSelectedVariant] = useState<VariantSummary | null>(
    reagent?.variants[0] ?? null
  );
  const [quantity, setQuantity] = useState(1);
  const [toast, setToast] = useState<string | null>(null);
  const [coaLotNumber, setCoaLotNumber] = useState('');
  const [coaSearched, setCoaSearched] = useState(false);
  const [coaLoading, setCoaLoading] = useState(false);
  const addToCart = useCartStore((s) => s.addItem);
  const { isFavorite: checkFav, toggleFavorite } = useFavoriteStore();
  const isFavorite = reagent ? checkFav(reagent.id) : false;

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const handleCoaSearch = async () => {
    if (!coaLotNumber.trim()) return;
    setCoaLoading(true);
    // Mock API delay
    await new Promise((resolve) => setTimeout(resolve, 600));
    setCoaSearched(true);
    setCoaLoading(false);
  };

  const handleAddToCart = () => {
    if (!reagent || !selectedVariant) return;
    addToCart({
      productId: reagent.id,
      productName: reagent.name,
      catalogNo: reagent.catalogNo || '',
      supplierName: reagent.supplierName,
      variantId: selectedVariant.id,
      size: selectedVariant.size,
      unit: selectedVariant.unit,
      unitPrice: selectedVariant.salePrice ?? selectedVariant.listPrice,
      quantity,
      formula: reagent.formula,
    });
    showToast(`${reagent.name} ${selectedVariant.size}${selectedVariant.unit} ${quantity}개가 장바구니에 추가되었습니다.`);
  };

  if (!reagent) {
    return (
      <div className="text-center py-20">
        <p className="text-lg text-[var(--text-secondary)]">제품을 찾을 수 없습니다</p>
        <button onClick={() => router.push('/order')} className="mt-4 text-blue-600 hover:underline">
          시약 목록으로 돌아가기
        </button>
      </div>
    );
  }

  const price = selectedVariant?.salePrice ?? selectedVariant?.listPrice ?? 0;
  const totalPrice = price * quantity;

  return (
    <div>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)] mb-6">
        <button onClick={() => router.push('/order')} className="hover:text-[var(--text)] flex items-center gap-1">
          <ArrowLeft size={14} />
          시약 주문
        </button>
        <ChevronRight size={14} />
        <span className="text-[var(--text)]">{reagent.name}</span>
      </div>

      <div className="grid grid-cols-[1fr_1fr] gap-8">
        {/* Left: Structure Image */}
        <div>
          <StructureImage
            casNumber={reagent.casNumber}
            productName={reagent.nameEn}
            fallbackFormula={reagent.formula}
          />

          {/* GHS Hazard Pictograms */}
          {reagent.ghsPictograms && reagent.ghsPictograms.length > 0 && (
            <div className="mt-4 bg-[var(--bg-card)] rounded-xl border border-[var(--border)] p-4">
              <h3 className="text-sm font-semibold text-[var(--text)] mb-3 flex items-center gap-2">
                <AlertTriangle size={16} className="text-amber-500" />
                GHS 위험 분류
              </h3>
              <div className="flex flex-wrap gap-2">
                {reagent.ghsPictograms.map((ghs) => {
                  const info = GHS_LABELS[ghs];
                  return info ? (
                    <span
                      key={ghs}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border ${info.bgColor} ${info.color}`}
                    >
                      {info.label}
                    </span>
                  ) : null;
                })}
              </div>
            </div>
          )}

          {/* Shipping Restriction */}
          {reagent.shippingRestriction && (
            <div className="mt-4 bg-orange-50 rounded-xl border border-orange-200 p-4">
              <h3 className="text-sm font-semibold text-orange-800 mb-3 flex items-center gap-2">
                <AlertTriangle size={16} className="text-orange-600" />
                배송 유의사항
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-3">
                  <span className="text-orange-700 font-medium w-[72px] shrink-0">위험 유형</span>
                  <span className="px-2 py-0.5 bg-orange-100 border border-orange-300 rounded text-orange-800 text-xs font-medium">
                    {reagent.shippingRestriction.type}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-orange-700 font-medium w-[72px] shrink-0">위험물 등급</span>
                  <span className="text-orange-800">{reagent.shippingRestriction.class}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-orange-700 font-medium w-[72px] shrink-0">배송 조건</span>
                  <span className="text-orange-800">{reagent.shippingRestriction.note}</span>
                </div>
                <div className="mt-3 px-3 py-2 bg-orange-100 border border-orange-300 rounded-lg">
                  <p className="text-xs text-orange-800 leading-relaxed">
                    <AlertTriangle size={12} className="inline-block mr-1 -mt-0.5 text-orange-600" />
                    본 제품은 유해화학물질로 분류되어 특수 배송 조건이 적용됩니다.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Documents */}
          <div className="mt-4 bg-[var(--bg-card)] rounded-xl border border-[var(--border)] p-4">
            <h3 className="text-sm font-semibold text-[var(--text)] mb-3 flex items-center gap-2">
              <FileText size={16} />
              문서 다운로드
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {['한글 SDS', '영문 SDS', 'COA', 'Spec Sheet'].map((doc) => (
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

          {/* COA Search */}
          <div className="mt-4 bg-[var(--bg-card)] rounded-xl border border-[var(--border)] p-4">
            <h3 className="text-sm font-semibold text-[var(--text)] mb-3 flex items-center gap-2">
              <Search size={16} />
              COA 조회
            </h3>
            <p className="text-xs text-[var(--text-secondary)] mb-3">
              Lot 번호를 입력하여 해당 제품의 성적서(COA)를 조회할 수 있습니다.
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                value={coaLotNumber}
                onChange={(e) => { setCoaLotNumber(e.target.value); setCoaSearched(false); }}
                placeholder="Lot 번호 입력 (예: MKCL1234)"
                className="flex-1 h-[38px] px-3 border border-[var(--border)] rounded-lg text-sm bg-[var(--bg)] text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={handleCoaSearch}
                disabled={!coaLotNumber.trim() || coaLoading}
                className="h-[38px] px-4 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
              >
                <Search size={14} />
                {coaLoading ? '조회 중...' : 'COA 조회'}
              </button>
            </div>

            {/* COA Result */}
            {coaSearched && coaLotNumber.trim() && (
              <div className="mt-4 border border-[var(--border)] rounded-lg overflow-hidden">
                {/* COA Header */}
                <div className="bg-gray-50 dark:bg-gray-800 px-4 py-3 border-b border-[var(--border)]">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-[var(--text)]">Certificate of Analysis (COA)</p>
                      <p className="text-xs text-[var(--text-secondary)] mt-0.5">성적서 조회 결과</p>
                    </div>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 border border-emerald-200 rounded-full text-xs font-medium text-emerald-700">
                      <CheckCircle size={12} />
                      적합
                    </span>
                  </div>
                </div>

                {/* COA Info */}
                <div className="px-4 py-3 border-b border-[var(--border)]">
                  <div className="grid grid-cols-3 gap-3 text-sm">
                    <div>
                      <span className="text-[var(--text-secondary)] text-xs">제품명</span>
                      <p className="font-medium text-[var(--text)] mt-0.5">{reagent.name}</p>
                    </div>
                    <div>
                      <span className="text-[var(--text-secondary)] text-xs">CAS No.</span>
                      <p className="font-medium text-[var(--text)] mt-0.5">{reagent.casNumber}</p>
                    </div>
                    <div>
                      <span className="text-[var(--text-secondary)] text-xs">Lot 번호</span>
                      <p className="font-medium text-[var(--text)] mt-0.5">{coaLotNumber}</p>
                    </div>
                  </div>
                </div>

                {/* Analysis Table */}
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-800 border-b border-[var(--border)]">
                      <th className="text-left px-4 py-2 font-medium text-[var(--text-secondary)]">분석 항목</th>
                      <th className="text-center px-4 py-2 font-medium text-[var(--text-secondary)]">규격</th>
                      <th className="text-center px-4 py-2 font-medium text-[var(--text-secondary)]">결과</th>
                      <th className="text-center px-4 py-2 font-medium text-[var(--text-secondary)]">판정</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { item: '순도 (Purity)', spec: '99.0% 이상', result: '99.5%', pass: true },
                      { item: '수분 (Water)', spec: '0.1% 이하', result: '0.03%', pass: true },
                      { item: '잔류용매 (Residual Solvents)', spec: '0.05% 이하', result: '0.01%', pass: true },
                      { item: '강열잔분 (Residue on Ignition)', spec: '0.01% 이하', result: '0.005%', pass: true },
                      { item: '중금속 (Heavy Metals)', spec: '10 ppm 이하', result: '< 5 ppm', pass: true },
                    ].map((row) => (
                      <tr key={row.item} className="border-b border-[var(--border)] last:border-0">
                        <td className="px-4 py-2.5 text-[var(--text)] font-medium">{row.item}</td>
                        <td className="px-4 py-2.5 text-center text-[var(--text-secondary)]">{row.spec}</td>
                        <td className="px-4 py-2.5 text-center text-[var(--text)] font-medium">{row.result}</td>
                        <td className="px-4 py-2.5 text-center">
                          {row.pass ? (
                            <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">
                              <CheckCircle size={14} />
                              적합
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-red-600 font-medium">
                              <XCircle size={14} />
                              부적합
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Download Button */}
                <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800 border-t border-[var(--border)]">
                  <button className="w-full h-[38px] bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                    <Download size={14} />
                    COA 다운로드 (PDF)
                  </button>
                </div>
              </div>
            )}

            {/* Placeholder when no search */}
            {!coaSearched && !coaLotNumber.trim() && (
              <div className="mt-3 text-center py-4 border border-dashed border-[var(--border)] rounded-lg">
                <FileText size={24} className="mx-auto text-gray-300 mb-2" />
                <p className="text-xs text-[var(--text-secondary)]">Lot 번호를 입력하면 COA를 조회할 수 있습니다.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right: Product Info */}
        <div>
          {/* Supplier + Catalog */}
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm text-blue-600 font-medium">{reagent.supplierName}</span>
            <span className="text-sm text-[var(--text-secondary)]">|</span>
            <span className="text-sm text-[var(--text-secondary)]">{reagent.catalogNo}</span>
          </div>

          {/* Product Name */}
          <h1 className="text-2xl font-bold text-[var(--text)] mb-1">{reagent.name}</h1>
          {reagent.nameEn && (
            <p className="text-base text-[var(--text-secondary)] mb-4">{reagent.nameEn}</p>
          )}

          {/* Favorite */}
          <button
            onClick={() => {
              if (!reagent) return;
              const v = selectedVariant || reagent.variants[0];
              const added = toggleFavorite({ productId: reagent.id, productName: reagent.name, productType: 'reagent', supplierName: reagent.supplierName, catalogNo: reagent.catalogNo, casNumber: reagent.casNumber, formula: reagent.formula, price: v?.salePrice ?? v?.listPrice ?? 0 });
              showToast(added ? '즐겨찾기에 추가' : '즐겨찾기에서 제거');
            }}
            className={`mb-4 flex items-center gap-1.5 text-sm ${isFavorite ? 'text-red-500' : 'text-[var(--text-secondary)]'} hover:text-red-500 transition-colors`}
          >
            <Heart size={16} fill={isFavorite ? 'currentColor' : 'none'} />
            {isFavorite ? '즐겨찾기 추가됨' : '즐겨찾기에 추가'}
          </button>

          {/* Specs Table */}
          <div className="bg-[var(--bg)] rounded-xl p-4 mb-4">
            <div className="grid grid-cols-2 gap-y-3 text-sm">
              <div>
                <span className="text-[var(--text-secondary)]">CAS No.</span>
                <p className="font-medium text-[var(--text)] mt-0.5">{reagent.casNumber}</p>
              </div>
              <div>
                <span className="text-[var(--text-secondary)]">분자식</span>
                <p className="font-medium text-[var(--text)] mt-0.5">{reagent.formula}</p>
              </div>
              <div>
                <span className="text-[var(--text-secondary)]">분자량</span>
                <p className="font-medium text-[var(--text)] mt-0.5">{reagent.molWeight} g/mol</p>
              </div>
              <div>
                <span className="text-[var(--text-secondary)]">순도</span>
                <p className="font-medium text-[var(--text)] mt-0.5">{reagent.purity}</p>
              </div>
              <div>
                <span className="text-[var(--text-secondary)]">등급</span>
                <p className="font-medium text-[var(--text)] mt-0.5">{reagent.grade}</p>
              </div>
            </div>
          </div>

          {/* Variant Price Table (TCI Style) */}
          <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border)] overflow-hidden mb-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-[var(--border)]">
                  <th className="text-left px-4 py-2.5 font-medium text-[var(--text-secondary)]">선택</th>
                  <th className="text-left px-4 py-2.5 font-medium text-[var(--text-secondary)]">포장단위</th>
                  <th className="text-right px-4 py-2.5 font-medium text-[var(--text-secondary)]">정가</th>
                  <th className="text-right px-4 py-2.5 font-medium text-[var(--text-secondary)]">할인가</th>
                  <th className="text-center px-4 py-2.5 font-medium text-[var(--text-secondary)]">재고</th>
                  <th className="text-center px-4 py-2.5 font-medium text-[var(--text-secondary)]">납품예정일</th>
                  <th className="text-center px-4 py-2.5 font-medium text-[var(--text-secondary)]">찜</th>
                </tr>
              </thead>
              <tbody>
                {reagent.variants.map((variant) => (
                  <tr
                    key={variant.id}
                    onClick={() => setSelectedVariant(variant)}
                    className={`border-b border-[var(--border)] last:border-0 cursor-pointer transition-colors ${
                      selectedVariant?.id === variant.id ? 'bg-blue-50' : 'hover:bg-gray-50'
                    }`}
                  >
                    <td className="px-4 py-3">
                      <input
                        type="radio"
                        name="variant"
                        checked={selectedVariant?.id === variant.id}
                        onChange={() => setSelectedVariant(variant)}
                        className="accent-blue-600"
                      />
                    </td>
                    <td className="px-4 py-3 font-medium text-[var(--text)]">
                      {variant.size}{variant.unit}
                    </td>
                    <td className="px-4 py-3 text-right text-[var(--text)]">
                      {variant.salePrice ? (
                        <span className="line-through text-[var(--text-secondary)]">
                          {formatCurrency(variant.listPrice)}
                        </span>
                      ) : (
                        formatCurrency(variant.listPrice)
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {variant.salePrice ? (
                        <span className="font-bold text-red-600">
                          {formatCurrency(variant.salePrice)}
                          <span className="ml-1 text-xs">({variant.discountRate}%)</span>
                        </span>
                      ) : (
                        <span className="text-[var(--text-secondary)]">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {variant.stockQty > 0 ? (
                        <span className="text-emerald-600 font-medium">{variant.stockQty}</span>
                      ) : (
                        <span className="text-red-500">품절</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center text-sm text-[var(--text-secondary)]">
                      <div className="flex items-center justify-center gap-1">
                        {variant.sameDayShip && <Truck size={12} className="text-emerald-600" />}
                        {variant.deliveryDate || '-'}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!reagent) return;
                          const favId = `${reagent.id}_${variant.id}`;
                          const added = toggleFavorite({
                            productId: favId,
                            productName: `${reagent.name} ${variant.size}${variant.unit}`,
                            productType: 'reagent',
                            supplierName: reagent.supplierName,
                            catalogNo: reagent.catalogNo,
                            casNumber: reagent.casNumber,
                            formula: reagent.formula,
                            price: variant.salePrice ?? variant.listPrice,
                          });
                          showToast(added ? `${variant.size}${variant.unit} 즐겨찾기에 추가` : `${variant.size}${variant.unit} 즐겨찾기에서 제거`);
                        }}
                        className={`transition-colors ${reagent && checkFav(`${reagent.id}_${variant.id}`) ? 'text-red-500' : 'text-[var(--text-secondary)] hover:text-red-400'}`}
                      >
                        <Heart size={14} fill={reagent && checkFav(`${reagent.id}_${variant.id}`) ? 'currentColor' : 'none'} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Quantity + Actions */}
          <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border)] p-4">
            <div className="flex items-center gap-4 mb-4">
              <span className="text-sm text-[var(--text-secondary)]">수량</span>
              <div className="flex items-center border border-[var(--border)] rounded-lg overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-[38px] h-[38px] flex items-center justify-center text-[var(--text)] hover:bg-gray-100"
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
                  className="w-[38px] h-[38px] flex items-center justify-center text-[var(--text)] hover:bg-gray-100"
                >
                  +
                </button>
              </div>
              <div className="ml-auto text-right">
                <p className="text-xs text-[var(--text-secondary)]">합계 (VAT 별도)</p>
                <p className="text-xl font-bold text-[var(--text)]">{formatCurrency(totalPrice)}</p>
              </div>
            </div>

            {selectedVariant?.sameDayShip && (
              <div className="flex items-center gap-2 mb-4 px-3 py-2 bg-emerald-50 rounded-lg">
                <Clock size={14} className="text-emerald-600" />
                <span className="text-xs text-emerald-700 font-medium">
                  오후 3시 이전 주문 시 당일출고 | 납품예정일: {selectedVariant.deliveryDate}
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
              <button className="flex-1 h-[42px] border-2 border-blue-600 text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-colors">
                바로 주문하기
              </button>
              <button className="h-[42px] px-4 border border-[var(--border)] text-[var(--text-secondary)] rounded-lg hover:border-blue-400 hover:text-blue-600 transition-colors flex items-center gap-1">
                <Package size={14} />
                견적 요청
              </button>
            </div>
          </div>
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
