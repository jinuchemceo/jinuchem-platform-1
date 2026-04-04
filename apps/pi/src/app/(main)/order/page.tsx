'use client';

import { Search, SlidersHorizontal, Grid3X3, List, ChevronLeft, ChevronRight } from 'lucide-react';

const suppliers = ['Sigma-Aldrich', 'TCI', 'Alfa Aesar'];
const sampleReagents = [
  { name: 'Sodium hydroxide', cas: '1310-73-2', formula: 'NaOH', supplier: 'Sigma-Aldrich', price: '45,600', unit: '1kg' },
  { name: 'Acetone', cas: '67-64-1', formula: 'C3H6O', supplier: 'TCI', price: '12,800', unit: '2.5L' },
  { name: 'Methanol', cas: '67-56-1', formula: 'CH3OH', supplier: 'Alfa Aesar', price: '50,300', unit: '1L' },
  { name: 'Toluene', cas: '108-88-3', formula: 'C7H8', supplier: 'Sigma-Aldrich', price: '89,400', unit: '2.5L' },
  { name: 'Ethanol', cas: '64-17-5', formula: 'C2H5OH', supplier: 'TCI', price: '62,000', unit: '2.5L' },
  { name: 'Chloroform', cas: '67-66-3', formula: 'CHCl3', supplier: 'Alfa Aesar', price: '89,000', unit: '4L' },
  { name: 'Dichloromethane', cas: '75-09-2', formula: 'CH2Cl2', supplier: 'Sigma-Aldrich', price: '56,000', unit: '2.5L' },
  { name: 'PIPES', cas: '5625-37-6', formula: 'C8H18N2O6S2', supplier: 'TCI', price: '128,000', unit: '25g' },
];

export default function OrderPage() {
  return (
    <div>
      <h1 className="text-xl font-bold text-gray-900 mb-1">시약 주문</h1>
      <p className="text-sm text-gray-500 mb-6">시약 카탈로그에서 필요한 시약을 검색하고 주문합니다.</p>

      {/* Search Bar */}
      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="시약명, CAS번호, 분자식, 카탈로그번호 검색..."
            className="w-full pl-9 pr-3 h-[38px] border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <button className="h-[38px] px-4 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600">검색</button>
        <button className="h-[38px] px-3 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 flex items-center gap-1 text-sm">
          <SlidersHorizontal size={14} /> 필터
        </button>
        <div className="flex border border-gray-300 rounded-lg overflow-hidden">
          <button className="h-[38px] w-9 flex items-center justify-center bg-blue-500 text-white"><Grid3X3 size={14} /></button>
          <button className="h-[38px] w-9 flex items-center justify-center text-gray-400 hover:bg-gray-50"><List size={14} /></button>
        </div>
      </div>

      {/* Supplier Filter */}
      <div className="flex items-center gap-2 mb-6">
        <span className="text-xs text-gray-500">공급사:</span>
        <button className="px-3 py-1 bg-blue-500 text-white rounded-full text-xs">전체</button>
        {suppliers.map(s => (
          <button key={s} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs hover:bg-gray-200">{s}</button>
        ))}
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {sampleReagents.map(r => (
          <div key={r.cas} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
            <div className="px-3 py-1.5 border-b border-gray-100">
              <span className="text-xs text-gray-500">{r.supplier}</span>
            </div>
            <div className="h-32 bg-gray-50 flex items-center justify-center">
              <span className="text-xs text-gray-300">구조식 이미지</span>
            </div>
            <div className="p-3">
              <h3 className="text-sm font-medium text-gray-900 mb-1">{r.name}</h3>
              <p className="text-xs text-gray-500 mb-0.5">CAS: {r.cas}</p>
              <p className="text-xs text-gray-500 mb-2">{r.formula} | {r.unit}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-blue-600">{r.price}원</span>
                <button className="h-[30px] px-3 bg-blue-500 text-white rounded-md text-xs font-medium hover:bg-blue-600">담기</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center gap-1">
        <button className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 text-gray-400 hover:bg-gray-100"><ChevronLeft size={14} /></button>
        <button className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-500 text-white text-sm font-medium">1</button>
        <button className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 text-gray-600 text-sm hover:bg-gray-100">2</button>
        <button className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 text-gray-600 text-sm hover:bg-gray-100">3</button>
        <button className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 text-gray-400 hover:bg-gray-100"><ChevronRight size={14} /></button>
      </div>
    </div>
  );
}
