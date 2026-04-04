'use client';

import { useState } from 'react';
import { Save, Building, MapPin, Shield, CreditCard } from 'lucide-react';

export default function SettingsPage() {
  const [autoApproveLimit, setAutoApproveLimit] = useState('200000');
  const [maxOrderAmount, setMaxOrderAmount] = useState('5000000');

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900 mb-1">연구실 설정</h1>
          <p className="text-sm text-gray-500">연구실 기본 정보와 구매 정책을 설정합니다.</p>
        </div>
        <button className="h-[38px] px-4 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 flex items-center gap-1.5">
          <Save size={14} /> 저장
        </button>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* 기본 정보 */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Building size={16} className="text-blue-500" />
            <h2 className="text-sm font-bold text-gray-900">기본 정보</h2>
          </div>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">연구실명</label>
              <input type="text" defaultValue="유기합성 연구실" className="w-full h-[38px] px-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">소속 기관</label>
              <input type="text" defaultValue="한국과학기술원 (KAIST)" className="w-full h-[38px] px-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">PI (책임연구자)</label>
              <input type="text" defaultValue="김지누 교수" className="w-full h-[38px] px-3 border border-gray-300 rounded-lg text-sm bg-gray-50" readOnly />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">연락처</label>
                <input type="text" defaultValue="042-350-1234" className="w-full h-[38px] px-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">이메일</label>
                <input type="text" defaultValue="jinu.kim@kaist.ac.kr" className="w-full h-[38px] px-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
          </div>
        </div>

        {/* 배송지 정보 */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <MapPin size={16} className="text-green-500" />
            <h2 className="text-sm font-bold text-gray-900">기본 배송지</h2>
          </div>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">수령인</label>
              <input type="text" defaultValue="김지누" className="w-full h-[38px] px-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">주소</label>
              <input type="text" defaultValue="대전광역시 유성구 대학로 291 KAIST 화학관 301호" className="w-full h-[38px] px-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">연락처</label>
              <input type="text" defaultValue="042-350-1234" className="w-full h-[38px] px-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">배송 비고</label>
              <input type="text" defaultValue="화학관 1층 시약 보관실 앞 배송 요청" className="w-full h-[38px] px-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
        </div>

        {/* 구매 승인 정책 */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Shield size={16} className="text-purple-500" />
            <h2 className="text-sm font-bold text-gray-900">구매 승인 정책</h2>
          </div>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">자동 승인 한도</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={autoApproveLimit}
                  onChange={e => setAutoApproveLimit(e.target.value)}
                  className="flex-1 h-[38px] px-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-500">원 이하</span>
              </div>
              <p className="text-xs text-gray-400 mt-1">이 금액 이하의 주문은 자동 승인됩니다.</p>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">1회 최대 주문 금액</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={maxOrderAmount}
                  onChange={e => setMaxOrderAmount(e.target.value)}
                  className="flex-1 h-[38px] px-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-500">원</span>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-2">알림 설정</label>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500" />
                  <span className="text-sm text-gray-700">승인 요청 시 이메일 알림</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500" />
                  <span className="text-sm text-gray-700">예산 80% 초과 시 알림</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500" />
                  <span className="text-sm text-gray-700">주간 지출 리포트 수신</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* 결제 방식 설정 */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <CreditCard size={16} className="text-amber-500" />
            <h2 className="text-sm font-bold text-gray-900">결제 방식 설정</h2>
          </div>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">기본 결제 방식</label>
              <select className="w-full h-[38px] px-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>후불 정산 (월말 일괄)</option>
                <option>선불 카드결제</option>
                <option>PO (구매주문서)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">PO 번호 형식</label>
              <input type="text" defaultValue="KAIST-CHEM-{YYYY}-{SEQ}" className="w-full h-[38px] px-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <p className="text-xs text-gray-400 mt-1">자동 생성 시 사용할 PO번호 형식</p>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">사업자등록번호</label>
              <input type="text" defaultValue="314-86-12345" className="w-full h-[38px] px-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-2">세금계산서</label>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="tax" defaultChecked className="w-4 h-4 border-gray-300 text-blue-500 focus:ring-blue-500" />
                  <span className="text-sm text-gray-700">전자세금계산서 자동 발행</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="tax" className="w-4 h-4 border-gray-300 text-blue-500 focus:ring-blue-500" />
                  <span className="text-sm text-gray-700">수동 요청</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
