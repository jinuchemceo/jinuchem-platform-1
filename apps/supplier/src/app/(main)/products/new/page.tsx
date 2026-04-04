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
  AlertTriangle,
} from 'lucide-react';

const steps = [
  { num: 1, label: '기본 정보' },
  { num: 2, label: '상세 정보' },
  { num: 3, label: '가격/포장' },
  { num: 4, label: '문서/배송' },
];

interface VariantRow {
  id: number;
  size: string;
  unit: string;
  listPrice: string;
  salePrice: string;
  discountRate: string;
  stock: string;
  sameDay: boolean;
  deliveryDate: string;
}

const inputStyle = "w-full h-[38px] px-3 border rounded-lg text-sm focus:outline-none";
const labelStyle = "text-sm font-semibold block mb-1.5";

export default function ProductNewPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [productType, setProductType] = useState<'reagent' | 'supply'>('reagent');
  const [category, setCategory] = useState('');
  const [customCategory, setCustomCategory] = useState(false);
  const [variants, setVariants] = useState<VariantRow[]>([
    { id: 1, size: '500', unit: 'mL', listPrice: '', salePrice: '', discountRate: '', stock: '', sameDay: true, deliveryDate: '' },
  ]);
  const [coaLots, setCoaLots] = useState<{ id: number; lot: string }[]>([{ id: 1, lot: '' }]);

  const addVariant = () => {
    setVariants(prev => [...prev, {
      id: Date.now(), size: '', unit: 'mL', listPrice: '', salePrice: '', discountRate: '', stock: '', sameDay: false, deliveryDate: '',
    }]);
  };
  const removeVariant = (id: number) => { setVariants(prev => prev.filter(v => v.id !== id)); };

  const calcDiscount = (list: string, sale: string) => {
    const l = parseFloat(list.replace(/,/g, ''));
    const s = parseFloat(sale.replace(/,/g, ''));
    if (l > 0 && s > 0 && s < l) return Math.round(((l - s) / l) * 100) + '%';
    return '';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => router.push('/products')} className="p-2 hover:bg-gray-100 rounded-lg"><ArrowLeft size={20} /></button>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>제품 등록</h1>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center justify-center gap-0">
        {steps.map((step, i) => (
          <div key={step.num} className="flex items-center">
            <div className="flex items-center gap-2 px-4 py-2">
              <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 ${
                currentStep === step.num ? 'bg-purple-600 text-white border-purple-600' :
                currentStep > step.num ? 'bg-green-500 text-white border-green-500' :
                'text-[var(--text-secondary)]'
              }`} style={currentStep < step.num ? { borderColor: 'var(--border)', background: 'var(--bg-card)' } : {}}>
                {currentStep > step.num ? <Check size={14} /> : step.num}
              </span>
              <span className={`text-sm ${currentStep === step.num ? 'font-semibold' : ''}`} style={{ color: currentStep === step.num ? 'var(--text)' : 'var(--text-secondary)' }}>
                {step.label}
              </span>
            </div>
            {i < steps.length - 1 && <div className="w-10 h-0.5" style={{ background: 'var(--border)' }} />}
          </div>
        ))}
      </div>

      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-6">

        {/* ===== Step 1: Basic Info ===== */}
        {currentStep === 1 && (
          <div className="space-y-5">
            <h3 className="text-lg font-bold" style={{ color: 'var(--text)' }}>기본 정보</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelStyle} style={{ color: 'var(--text-secondary)' }}>제품 유형</label>
                <select value={productType} onChange={e => setProductType(e.target.value as 'reagent' | 'supply')} className={inputStyle} style={{ borderColor: 'var(--border)', color: 'var(--text)' }}>
                  <option value="reagent">시약</option>
                  <option value="supply">소모품</option>
                </select>
              </div>
              <div>
                <label className={labelStyle} style={{ color: 'var(--text-secondary)' }}>카테고리</label>
                {customCategory ? (
                  <div className="flex gap-2">
                    <input type="text" value={category} onChange={e => setCategory(e.target.value)} className={`flex-1 ${inputStyle}`} style={{ borderColor: 'var(--border)', color: 'var(--text)' }} placeholder="카테고리 직접 입력" />
                    <button onClick={() => setCustomCategory(false)} className="px-3 h-[38px] border rounded-lg text-xs font-semibold hover:bg-gray-50" style={{ borderColor: 'var(--border)', color: 'var(--text)' }}>목록</button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <select value={category} onChange={e => setCategory(e.target.value)} className={`flex-1 ${inputStyle}`} style={{ borderColor: 'var(--border)', color: 'var(--text)' }}>
                      <option value="">선택하세요</option>
                      {productType === 'reagent' ? (
                        <><option>유기화합물</option><option>무기화합물</option><option>용매</option><option>생화학시약</option><option>분석용시약</option><option>고분자</option></>
                      ) : (
                        <><option>피펫 & 팁</option><option>필터 & 멤브레인</option><option>튜브 & 바이알</option><option>장갑 & 보호구</option><option>세척 & 멸균</option><option>기타 소모품</option></>
                      )}
                    </select>
                    <button onClick={() => { setCustomCategory(true); setCategory(''); }} className="px-3 h-[38px] border rounded-lg text-xs font-semibold hover:bg-gray-50" style={{ borderColor: 'var(--border)', color: 'var(--text)' }}>직접 입력</button>
                  </div>
                )}
              </div>
              <div className="sm:col-span-2"><label className={labelStyle} style={{ color: 'var(--text-secondary)' }}>제품명 (영문)</label><input type="text" className={inputStyle} style={{ borderColor: 'var(--border)', color: 'var(--text)' }} placeholder="예: Ethyl alcohol, Pure" /></div>
              <div className="sm:col-span-2"><label className={labelStyle} style={{ color: 'var(--text-secondary)' }}>동의어 / 별명</label><input type="text" className={inputStyle} style={{ borderColor: 'var(--border)', color: 'var(--text)' }} placeholder="예: Ethanol, EtOH (쉼표로 구분)" /></div>
              <div><label className={labelStyle} style={{ color: 'var(--text-secondary)' }}>카탈로그번호</label><input type="text" className={inputStyle} style={{ borderColor: 'var(--border)', color: 'var(--text)' }} placeholder="예: 459844" /></div>
              <div><label className={labelStyle} style={{ color: 'var(--text-secondary)' }}>브랜드 / 공급사</label><select className={inputStyle} style={{ borderColor: 'var(--border)', color: 'var(--text)' }}><option>Sigma-Aldrich</option><option>Merck</option><option>TCI</option><option>Alfa Aesar</option></select></div>
              <div className="sm:col-span-2"><label className={labelStyle} style={{ color: 'var(--text-secondary)' }}>제품 설명</label><textarea className="w-full h-20 px-3 py-2 border rounded-lg text-sm resize-none focus:outline-none" style={{ borderColor: 'var(--border)', color: 'var(--text)' }} placeholder="제품 설명을 입력하세요" /></div>
              <div className="sm:col-span-2">
                <label className={labelStyle} style={{ color: 'var(--text-secondary)' }}>구조식 / 제품 이미지</label>
                <div className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50 transition-colors" style={{ borderColor: 'var(--border)' }}>
                  <Upload size={24} className="mx-auto mb-2" style={{ color: 'var(--text-secondary)' }} />
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>구조식 이미지를 드래그하거나 클릭하여 업로드</p>
                  <p className="text-xs mt-1" style={{ color: 'var(--text-tertiary)' }}>PNG, SVG, JPG (최대 5장)</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===== Step 2: Detail Info ===== */}
        {currentStep === 2 && (
          <div className="space-y-5">
            <h3 className="text-lg font-bold" style={{ color: 'var(--text)' }}>{productType === 'reagent' ? '상세 정보 (시약)' : '상세 정보 (소모품)'}</h3>
            {productType === 'reagent' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><label className={labelStyle} style={{ color: 'var(--text-secondary)' }}>CAS 번호</label><input type="text" className={inputStyle} style={{ borderColor: 'var(--border)', color: 'var(--text)' }} placeholder="예: 64-17-5" /></div>
                <div><label className={labelStyle} style={{ color: 'var(--text-secondary)' }}>분자식</label><input type="text" className={inputStyle} style={{ borderColor: 'var(--border)', color: 'var(--text)' }} placeholder="예: C2H5OH" /></div>
                <div><label className={labelStyle} style={{ color: 'var(--text-secondary)' }}>분자량 (g/mol)</label><input type="text" className={inputStyle} style={{ borderColor: 'var(--border)', color: 'var(--text)' }} placeholder="예: 46.07" /></div>
                <div><label className={labelStyle} style={{ color: 'var(--text-secondary)' }}>순도</label><input type="text" className={inputStyle} style={{ borderColor: 'var(--border)', color: 'var(--text)' }} placeholder="예: 99.5%" /></div>
                <div><label className={labelStyle} style={{ color: 'var(--text-secondary)' }}>등급</label><select className={inputStyle} style={{ borderColor: 'var(--border)', color: 'var(--text)' }}><option>ACS reagent</option><option>HPLC Grade</option><option>GR Grade</option><option>Reagent Grade</option><option>특급</option><option>1급</option></select></div>
                <div><label className={labelStyle} style={{ color: 'var(--text-secondary)' }}>신호어</label><select className={inputStyle} style={{ borderColor: 'var(--border)', color: 'var(--text)' }}><option>위험</option><option>경고</option><option>해당없음</option></select></div>

                {/* GHS Section */}
                <div className="sm:col-span-2 p-4 rounded-xl" style={{ background: 'rgba(255,59,48,0.05)', border: '1px solid rgba(255,59,48,0.15)' }}>
                  <h4 className="text-sm font-bold mb-3 flex items-center gap-2" style={{ color: '#FF3B30' }}><AlertTriangle size={16} /> GHS 위험 분류</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold block mb-1" style={{ color: 'var(--text-secondary)' }}>GHS 픽토그램</label>
                      <div className="flex flex-wrap gap-2">
                        {['인화성', '부식성', '급성독성', '자극성', '건강유해', '환경유해', '산화성'].map(g => (
                          <label key={g} className="flex items-center gap-1 text-xs cursor-pointer px-2 py-1 rounded border" style={{ borderColor: 'var(--border)' }}><input type="checkbox" className="accent-red-500" />{g}</label>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-semibold block mb-1" style={{ color: 'var(--text-secondary)' }}>H-code (위험문구)</label>
                      <input type="text" className={inputStyle} style={{ borderColor: 'var(--border)', color: 'var(--text)' }} placeholder="예: H225 고인화성 액체 및 증기" />
                    </div>
                  </div>
                </div>

                {/* Shipping Restriction */}
                <div className="sm:col-span-2 p-4 rounded-xl" style={{ background: 'rgba(255,149,0,0.05)', border: '1px solid rgba(255,149,0,0.15)' }}>
                  <h4 className="text-sm font-bold mb-3" style={{ color: '#FF9500' }}>배송 유의사항</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div><label className="text-xs font-semibold block mb-1" style={{ color: 'var(--text-secondary)' }}>위험 유형</label><select className={inputStyle} style={{ borderColor: 'var(--border)', color: 'var(--text)' }}><option>해당없음</option><option>인화성</option><option>부식성</option><option>독성</option><option>산화성</option></select></div>
                    <div><label className="text-xs font-semibold block mb-1" style={{ color: 'var(--text-secondary)' }}>위험물 등급</label><input type="text" className={inputStyle} style={{ borderColor: 'var(--border)', color: 'var(--text)' }} placeholder="예: 4.1류" /></div>
                    <div><label className="text-xs font-semibold block mb-1" style={{ color: 'var(--text-secondary)' }}>배송 조건</label><select className={inputStyle} style={{ borderColor: 'var(--border)', color: 'var(--text)' }}><option>일반 배송</option><option>항공운송 제한</option><option>냉장 배송</option><option>특수 포장</option></select></div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><label className={labelStyle} style={{ color: 'var(--text-secondary)' }}>재질</label><input type="text" className={inputStyle} style={{ borderColor: 'var(--border)', color: 'var(--text)' }} placeholder="예: PP, PE, Glass" /></div>
                <div><label className={labelStyle} style={{ color: 'var(--text-secondary)' }}>용량/규격</label><input type="text" className={inputStyle} style={{ borderColor: 'var(--border)', color: 'var(--text)' }} placeholder="예: 200uL, 96well" /></div>
                <div><label className={labelStyle} style={{ color: 'var(--text-secondary)' }}>멸균 여부</label><select className={inputStyle} style={{ borderColor: 'var(--border)', color: 'var(--text)' }}><option>비멸균</option><option>멸균</option></select></div>
                <div><label className={labelStyle} style={{ color: 'var(--text-secondary)' }}>인증</label><input type="text" className={inputStyle} style={{ borderColor: 'var(--border)', color: 'var(--text)' }} placeholder="예: KC, CE, ISO" /></div>
                <div><label className={labelStyle} style={{ color: 'var(--text-secondary)' }}>정기배송 가능</label><select className={inputStyle} style={{ borderColor: 'var(--border)', color: 'var(--text)' }}><option>가능</option><option>불가</option></select></div>
                <div><label className={labelStyle} style={{ color: 'var(--text-secondary)' }}>호환 장비</label><input type="text" className={inputStyle} style={{ borderColor: 'var(--border)', color: 'var(--text)' }} placeholder="예: Eppendorf, Gilson" /></div>
              </div>
            )}
          </div>
        )}

        {/* ===== Step 3: Pricing / Variants ===== */}
        {currentStep === 3 && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold" style={{ color: 'var(--text)' }}>포장단위 / 가격 설정</h3>
              <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Shop 제품 상세에 표시되는 가격 테이블입니다</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2" style={{ borderColor: 'var(--border)' }}>
                    <th className="text-left px-3 py-2 font-semibold" style={{ color: 'var(--text-secondary)' }}>포장단위</th>
                    <th className="text-left px-3 py-2 font-semibold" style={{ color: 'var(--text-secondary)' }}>단위</th>
                    <th className="text-right px-3 py-2 font-semibold" style={{ color: 'var(--text-secondary)' }}>정가</th>
                    <th className="text-right px-3 py-2 font-semibold" style={{ color: 'var(--text-secondary)' }}>할인가</th>
                    <th className="text-center px-3 py-2 font-semibold" style={{ color: 'var(--text-secondary)' }}>할인율</th>
                    <th className="text-center px-3 py-2 font-semibold" style={{ color: 'var(--text-secondary)' }}>재고</th>
                    <th className="text-center px-3 py-2 font-semibold" style={{ color: 'var(--text-secondary)' }}>당일출고</th>
                    <th className="text-center px-3 py-2 font-semibold" style={{ color: 'var(--text-secondary)' }}>납품예정일</th>
                    <th className="px-2 py-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {variants.map(v => (
                    <tr key={v.id} className="border-b" style={{ borderColor: 'var(--border)' }}>
                      <td className="px-3 py-2"><input type="text" defaultValue={v.size} className="w-20 h-8 px-2 border rounded text-sm" style={{ borderColor: 'var(--border)' }} placeholder="500" /></td>
                      <td className="px-3 py-2"><select defaultValue={v.unit} className="h-8 px-2 border rounded text-sm" style={{ borderColor: 'var(--border)' }}><option>mL</option><option>L</option><option>g</option><option>kg</option><option>개</option><option>팩</option><option>박스</option></select></td>
                      <td className="px-3 py-2"><input type="text" className="w-28 h-8 px-2 border rounded text-sm text-right" style={{ borderColor: 'var(--border)' }} placeholder="158,239" /></td>
                      <td className="px-3 py-2"><input type="text" className="w-28 h-8 px-2 border rounded text-sm text-right" style={{ borderColor: 'var(--border)', color: 'var(--danger)' }} placeholder="142,415" /></td>
                      <td className="px-3 py-2 text-center"><span className="text-xs font-semibold" style={{ color: 'var(--danger)' }}>{v.discountRate || '10%'}</span></td>
                      <td className="px-3 py-2"><input type="text" className="w-16 h-8 px-2 border rounded text-sm text-center" style={{ borderColor: 'var(--border)' }} placeholder="15" /></td>
                      <td className="px-3 py-2 text-center"><input type="checkbox" defaultChecked={v.sameDay} className="accent-purple-600" /></td>
                      <td className="px-3 py-2"><input type="date" className="h-8 px-2 border rounded text-xs" style={{ borderColor: 'var(--border)' }} /></td>
                      <td className="px-2 py-2"><button onClick={() => removeVariant(v.id)} className="p-1 hover:text-red-500" style={{ color: 'var(--text-secondary)' }}><X size={16} /></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button onClick={addVariant} className="flex items-center gap-1.5 px-3 py-1.5 border rounded-lg text-sm font-semibold hover:bg-gray-50" style={{ borderColor: 'var(--border)', color: 'var(--text)' }}>
              <Plus size={14} /> 포장단위 추가
            </button>

            {/* Delivery Info */}
            <div className="p-4 rounded-xl" style={{ background: 'rgba(52,199,89,0.05)', border: '1px solid rgba(52,199,89,0.15)' }}>
              <p className="text-xs font-semibold" style={{ color: '#34C759' }}>당일출고 마감시간: 오후 3시 이전 주문 시 당일출고</p>
              <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>당일출고 체크된 포장단위는 Shop에서 "당일출고" 배지가 표시됩니다.</p>
            </div>
          </div>
        )}

        {/* ===== Step 4: Documents & Shipping ===== */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold" style={{ color: 'var(--text)' }}>문서 첨부</h3>

            {/* Document Upload */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {(productType === 'reagent'
                ? ['한글 SDS', '영문 SDS', 'COA', 'COO', 'Spec Sheet']
                : ['한글 SDS', '영문 SDS', 'Spec Sheet', 'KC 인증서']
              ).map(doc => (
                <div key={doc} className="flex items-center gap-3 p-3 border rounded-xl" style={{ borderColor: 'var(--border)' }}>
                  <Upload size={18} style={{ color: 'var(--text-secondary)' }} />
                  <div className="flex-1">
                    <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{doc}</p>
                    <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>PDF 업로드</p>
                  </div>
                  <button className="px-3 py-1.5 text-xs font-semibold rounded-lg" style={{ color: 'var(--primary)', background: 'var(--primary-light)' }}>파일 선택</button>
                </div>
              ))}
            </div>

            {/* COA Lot Management */}
            {productType === 'reagent' && (
              <div className="p-4 rounded-xl" style={{ border: '1px solid var(--border)' }}>
                <h4 className="text-sm font-bold mb-3" style={{ color: 'var(--text)' }}>COA 로트번호 관리</h4>
                <p className="text-xs mb-3" style={{ color: 'var(--text-secondary)' }}>로트번호별로 COA를 등록하면 구매자가 로트번호로 COA를 조회할 수 있습니다.</p>
                <div className="space-y-2">
                  {coaLots.map(lot => (
                    <div key={lot.id} className="flex gap-2">
                      <input type="text" className="flex-1 h-[34px] px-3 border rounded-lg text-sm" style={{ borderColor: 'var(--border)', color: 'var(--text)' }} placeholder="로트번호 (예: MKCL1234)" />
                      <button className="px-3 h-[34px] text-xs font-semibold rounded-lg" style={{ color: 'var(--primary)', background: 'var(--primary-light)' }}>COA 업로드</button>
                      {coaLots.length > 1 && (
                        <button onClick={() => setCoaLots(prev => prev.filter(l => l.id !== lot.id))} className="p-1" style={{ color: 'var(--text-secondary)' }}><X size={14} /></button>
                      )}
                    </div>
                  ))}
                  <button onClick={() => setCoaLots(prev => [...prev, { id: Date.now(), lot: '' }])} className="flex items-center gap-1 text-xs font-semibold" style={{ color: 'var(--primary)' }}>
                    <Plus size={12} /> 로트번호 추가
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-8 pt-5 border-t" style={{ borderColor: 'var(--border)' }}>
          <div>
            {currentStep > 1 && (
              <button onClick={() => setCurrentStep(prev => prev - 1)} className="flex items-center gap-1.5 px-4 h-[38px] border rounded-lg text-sm font-semibold hover:bg-gray-50" style={{ borderColor: 'var(--border)', color: 'var(--text)' }}>
                <ArrowLeft size={16} /> 이전
              </button>
            )}
          </div>
          <div className="flex gap-2">
            {currentStep === 4 ? (
              <>
                <button className="px-4 h-[38px] border rounded-lg text-sm font-semibold hover:bg-gray-50" style={{ borderColor: 'var(--border)', color: 'var(--text)' }}>미리보기</button>
                <button onClick={() => router.push('/products')} className="px-5 h-[38px] bg-purple-600 text-white rounded-lg text-sm font-semibold hover:bg-purple-700">제품 등록</button>
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
