'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  Upload,
  Plus,
  X,
  Check,
} from 'lucide-react';

const steps = [
  { num: 1, label: '기본 정보' },
  { num: 2, label: '상세 정보' },
  { num: 3, label: '가격/포장' },
  { num: 4, label: '문서 첨부' },
];

interface VariantRow {
  id: number;
  size: string;
  unit: string;
  listPrice: string;
  salePrice: string;
  stock: string;
  sameDay: boolean;
  deliveryDays: string;
}

export default function ProductNewPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [productType, setProductType] = useState<'reagent' | 'supply'>('reagent');
  const [variants, setVariants] = useState<VariantRow[]>([
    { id: 1, size: '500', unit: 'mL', listPrice: '', salePrice: '', stock: '', sameDay: true, deliveryDays: '1' },
  ]);

  const addVariant = () => {
    setVariants(prev => [...prev, {
      id: Date.now(), size: '', unit: 'mL', listPrice: '', salePrice: '', stock: '', sameDay: false, deliveryDays: '2',
    }]);
  };

  const removeVariant = (id: number) => {
    setVariants(prev => prev.filter(v => v.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => router.push('/products?tab=list')} className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold text-[var(--text)]">상품 등록</h1>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center justify-center gap-0">
        {steps.map((step, i) => (
          <div key={step.num} className="flex items-center">
            <div className="flex items-center gap-2 px-4 py-2">
              <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 ${
                currentStep === step.num ? 'bg-purple-600 text-white border-purple-600' :
                currentStep > step.num ? 'bg-green-500 text-white border-green-500' :
                'bg-white text-[var(--text-secondary)] border-[var(--border)]'
              }`}>
                {currentStep > step.num ? <Check size={14} /> : step.num}
              </span>
              <span className={`text-sm ${currentStep === step.num ? 'font-semibold text-[var(--text)]' : 'text-[var(--text-secondary)]'}`}>
                {step.label}
              </span>
            </div>
            {i < steps.length - 1 && <div className="w-10 h-0.5 bg-[var(--border)]" />}
          </div>
        ))}
      </div>

      <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-xl p-6">
        {/* Step 1: Basic Info */}
        {currentStep === 1 && (
          <div className="space-y-5">
            <h3 className="text-lg font-bold">기본 정보</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-[var(--text-secondary)] block mb-1.5">제품 유형</label>
                <select
                  value={productType}
                  onChange={e => setProductType(e.target.value as 'reagent' | 'supply')}
                  className="w-full h-[38px] px-3 border border-[var(--border)] rounded-lg text-sm focus:outline-none focus:border-purple-500"
                >
                  <option value="reagent">시약</option>
                  <option value="supply">소모품</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-semibold text-[var(--text-secondary)] block mb-1.5">카테고리</label>
                <select className="w-full h-[38px] px-3 border border-[var(--border)] rounded-lg text-sm focus:outline-none focus:border-purple-500">
                  <option>유기화합물</option><option>무기화합물</option><option>용매</option><option>생화학시약</option><option>분석용시약</option><option>고분자</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="text-sm font-semibold text-[var(--text-secondary)] block mb-1.5">제품명 (한글)</label>
                <input type="text" className="w-full h-[38px] px-3 border border-[var(--border)] rounded-lg text-sm focus:outline-none focus:border-purple-500" placeholder="예: 에틸 알코올, 순수" />
              </div>
              <div className="sm:col-span-2">
                <label className="text-sm font-semibold text-[var(--text-secondary)] block mb-1.5">제품명 (영문)</label>
                <input type="text" className="w-full h-[38px] px-3 border border-[var(--border)] rounded-lg text-sm focus:outline-none focus:border-purple-500" placeholder="예: Ethyl alcohol, Pure" />
              </div>
              <div>
                <label className="text-sm font-semibold text-[var(--text-secondary)] block mb-1.5">카탈로그번호</label>
                <input type="text" className="w-full h-[38px] px-3 border border-[var(--border)] rounded-lg text-sm focus:outline-none focus:border-purple-500" placeholder="예: 459844" />
              </div>
              <div>
                <label className="text-sm font-semibold text-[var(--text-secondary)] block mb-1.5">브랜드</label>
                <select className="w-full h-[38px] px-3 border border-[var(--border)] rounded-lg text-sm focus:outline-none focus:border-purple-500">
                  <option>Sigma-Aldrich</option><option>Merck</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="text-sm font-semibold text-[var(--text-secondary)] block mb-1.5">제품 설명</label>
                <textarea className="w-full h-20 px-3 py-2 border border-[var(--border)] rounded-lg text-sm resize-none focus:outline-none focus:border-purple-500" placeholder="제품 설명을 입력하세요" />
              </div>
              <div className="sm:col-span-2">
                <label className="text-sm font-semibold text-[var(--text-secondary)] block mb-1.5">제품 이미지 (최대 5장)</label>
                <div className="border-2 border-dashed border-[var(--border)] rounded-lg p-8 text-center cursor-pointer hover:border-purple-400 hover:bg-purple-50/30 transition-colors">
                  <Upload size={24} className="mx-auto mb-2 text-[var(--text-secondary)]" />
                  <p className="text-sm text-[var(--text-secondary)]">이미지를 드래그하거나 클릭하여 업로드</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Detail Info */}
        {currentStep === 2 && (
          <div className="space-y-5">
            <h3 className="text-lg font-bold">{productType === 'reagent' ? '상세 정보 (시약)' : '상세 정보 (소모품)'}</h3>
            {productType === 'reagent' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><label className="text-sm font-semibold text-[var(--text-secondary)] block mb-1.5">CAS 번호</label><input type="text" className="w-full h-[38px] px-3 border border-[var(--border)] rounded-lg text-sm focus:outline-none focus:border-purple-500" placeholder="예: 64-17-5" /></div>
                <div><label className="text-sm font-semibold text-[var(--text-secondary)] block mb-1.5">분자식</label><input type="text" className="w-full h-[38px] px-3 border border-[var(--border)] rounded-lg text-sm focus:outline-none focus:border-purple-500" placeholder="예: C2H5OH" /></div>
                <div><label className="text-sm font-semibold text-[var(--text-secondary)] block mb-1.5">분자량</label><input type="text" className="w-full h-[38px] px-3 border border-[var(--border)] rounded-lg text-sm focus:outline-none focus:border-purple-500" placeholder="예: 46.07" /></div>
                <div><label className="text-sm font-semibold text-[var(--text-secondary)] block mb-1.5">순도</label><input type="text" className="w-full h-[38px] px-3 border border-[var(--border)] rounded-lg text-sm focus:outline-none focus:border-purple-500" placeholder="예: >=99.5%" /></div>
                <div><label className="text-sm font-semibold text-[var(--text-secondary)] block mb-1.5">등급</label><select className="w-full h-[38px] px-3 border border-[var(--border)] rounded-lg text-sm focus:outline-none focus:border-purple-500"><option>ACS</option><option>HPLC</option><option>GR</option><option>Reagent</option><option>특급</option><option>1급</option></select></div>
                <div><label className="text-sm font-semibold text-[var(--text-secondary)] block mb-1.5">신호어</label><select className="w-full h-[38px] px-3 border border-[var(--border)] rounded-lg text-sm focus:outline-none focus:border-purple-500"><option>위험</option><option>경고</option><option>해당없음</option></select></div>
                <div className="sm:col-span-2"><label className="text-sm font-semibold text-[var(--text-secondary)] block mb-1.5">동의어</label><input type="text" className="w-full h-[38px] px-3 border border-[var(--border)] rounded-lg text-sm focus:outline-none focus:border-purple-500" placeholder="쉼표로 구분 (예: Ethanol, EtOH)" /></div>
                <div className="sm:col-span-2">
                  <label className="text-sm font-semibold text-[var(--text-secondary)] block mb-1.5">GHS 픽토그램</label>
                  <div className="flex flex-wrap gap-3">
                    {['인화성', '부식성', '급성독성', '자극성', '건강유해', '환경유해', '산화성'].map(g => (
                      <label key={g} className="flex items-center gap-1.5 text-sm cursor-pointer"><input type="checkbox" className="accent-purple-600" />{g}</label>
                    ))}
                  </div>
                </div>
                <div className="sm:col-span-2"><label className="text-sm font-semibold text-[var(--text-secondary)] block mb-1.5">H-code</label><input type="text" className="w-full h-[38px] px-3 border border-[var(--border)] rounded-lg text-sm focus:outline-none focus:border-purple-500" placeholder="예: H225 고인화성 액체 및 증기" /></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><label className="text-sm font-semibold text-[var(--text-secondary)] block mb-1.5">재질</label><input type="text" className="w-full h-[38px] px-3 border border-[var(--border)] rounded-lg text-sm focus:outline-none focus:border-purple-500" placeholder="예: PP, PE, Glass" /></div>
                <div><label className="text-sm font-semibold text-[var(--text-secondary)] block mb-1.5">용량</label><input type="text" className="w-full h-[38px] px-3 border border-[var(--border)] rounded-lg text-sm focus:outline-none focus:border-purple-500" placeholder="예: 200uL" /></div>
                <div><label className="text-sm font-semibold text-[var(--text-secondary)] block mb-1.5">멸균 여부</label><select className="w-full h-[38px] px-3 border border-[var(--border)] rounded-lg text-sm focus:outline-none focus:border-purple-500"><option>비멸균</option><option>멸균</option></select></div>
                <div><label className="text-sm font-semibold text-[var(--text-secondary)] block mb-1.5">인증</label><input type="text" className="w-full h-[38px] px-3 border border-[var(--border)] rounded-lg text-sm focus:outline-none focus:border-purple-500" placeholder="예: KC, CE" /></div>
                <div><label className="text-sm font-semibold text-[var(--text-secondary)] block mb-1.5">정기배송 가능</label><select className="w-full h-[38px] px-3 border border-[var(--border)] rounded-lg text-sm focus:outline-none focus:border-purple-500"><option>가능</option><option>불가</option></select></div>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Pricing/Variants */}
        {currentStep === 3 && (
          <div className="space-y-5">
            <h3 className="text-lg font-bold">포장단위 / 가격 설정</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-[var(--border)]">
                    <th className="text-left px-3 py-2 font-semibold text-[var(--text-secondary)]">사이즈</th>
                    <th className="text-left px-3 py-2 font-semibold text-[var(--text-secondary)]">단위</th>
                    <th className="text-left px-3 py-2 font-semibold text-[var(--text-secondary)]">정가</th>
                    <th className="text-left px-3 py-2 font-semibold text-[var(--text-secondary)]">할인가</th>
                    <th className="text-left px-3 py-2 font-semibold text-[var(--text-secondary)]">재고</th>
                    <th className="text-left px-3 py-2 font-semibold text-[var(--text-secondary)]">당일출고</th>
                    <th className="text-left px-3 py-2 font-semibold text-[var(--text-secondary)]">납품일</th>
                    <th className="px-3 py-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {variants.map(v => (
                    <tr key={v.id} className="border-b border-[var(--border)]">
                      <td className="px-3 py-2"><input type="text" defaultValue={v.size} className="w-20 h-8 px-2 border border-[var(--border)] rounded text-sm" /></td>
                      <td className="px-3 py-2"><select defaultValue={v.unit} className="h-8 px-2 border border-[var(--border)] rounded text-sm"><option>mL</option><option>L</option><option>g</option><option>kg</option></select></td>
                      <td className="px-3 py-2"><input type="text" className="w-24 h-8 px-2 border border-[var(--border)] rounded text-sm" placeholder="0" /></td>
                      <td className="px-3 py-2"><input type="text" className="w-24 h-8 px-2 border border-[var(--border)] rounded text-sm" placeholder="0" /></td>
                      <td className="px-3 py-2"><input type="text" className="w-16 h-8 px-2 border border-[var(--border)] rounded text-sm" placeholder="0" /></td>
                      <td className="px-3 py-2"><input type="checkbox" defaultChecked={v.sameDay} className="accent-purple-600" /></td>
                      <td className="px-3 py-2"><input type="text" defaultValue={v.deliveryDays} className="w-12 h-8 px-2 border border-[var(--border)] rounded text-sm" />일</td>
                      <td className="px-3 py-2"><button onClick={() => removeVariant(v.id)} className="p-1 text-[var(--text-secondary)] hover:text-red-500"><X size={16} /></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button onClick={addVariant} className="flex items-center gap-1.5 px-3 py-1.5 border border-[var(--border)] rounded-lg text-sm font-semibold hover:bg-gray-50">
              <Plus size={14} /> 포장단위 추가
            </button>
          </div>
        )}

        {/* Step 4: Documents */}
        {currentStep === 4 && (
          <div className="space-y-5">
            <h3 className="text-lg font-bold">문서 첨부</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {['SDS (한글)', 'SDS (영문)', 'COA', 'COO', 'Spec Sheet', 'KC 인증서'].map(doc => (
                <div key={doc}>
                  <label className="text-sm font-semibold text-[var(--text-secondary)] block mb-1.5">{doc}</label>
                  <div className="border border-dashed border-[var(--border)] rounded-lg p-4 text-center text-sm text-[var(--text-secondary)] cursor-pointer hover:border-purple-400 hover:bg-purple-50/30 transition-colors">
                    <Upload size={18} className="mx-auto mb-1" />
                    PDF 업로드
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-8 pt-5 border-t border-[var(--border)]">
          <div>
            {currentStep > 1 && (
              <button onClick={() => setCurrentStep(prev => prev - 1)} className="flex items-center gap-1.5 px-4 h-[38px] border border-[var(--border)] rounded-lg text-sm font-semibold hover:bg-gray-50">
                <ArrowLeft size={16} /> 이전
              </button>
            )}
          </div>
          <div className="flex gap-2">
            {currentStep === 4 ? (
              <>
                <button className="px-4 h-[38px] border border-[var(--border)] rounded-lg text-sm font-semibold hover:bg-gray-50">
                  미리보기
                </button>
                <button
                  onClick={() => router.push('/products?tab=list')}
                  className="px-4 h-[38px] bg-purple-600 text-white rounded-lg text-sm font-semibold hover:bg-purple-700"
                >
                  상품 등록
                </button>
              </>
            ) : (
              <button onClick={() => setCurrentStep(prev => prev + 1)} className="flex items-center gap-1.5 px-4 h-[38px] bg-purple-600 text-white rounded-lg text-sm font-semibold hover:bg-purple-700">
                다음 <ArrowRight size={16} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
