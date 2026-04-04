'use client';

import { Search, SlidersHorizontal, Grid3X3, List, ChevronLeft, ChevronRight } from 'lucide-react';

const categories = [
  { name: '실험용 장갑', count: 24 },
  { name: '피펫 팁', count: 18 },
  { name: '필터/멤브레인', count: 15 },
  { name: '바이알/튜브', count: 32 },
  { name: '안전보호구', count: 12 },
  { name: '세척용품', count: 8 },
];

const supplies = [
  { name: 'Nitrile Gloves (M)', category: '실험용 장갑', spec: '100매/box', price: '9,000', supplier: 'VWR' },
  { name: 'Pipette Tips 1000uL', category: '피펫 팁', spec: '1000개/pk', price: '25,000', supplier: 'Eppendorf' },
  { name: 'Syringe Filter 0.45um', category: '필터/멤브레인', spec: '100개/pk', price: '45,000', supplier: 'Millipore' },
  { name: 'Microcentrifuge Tube 1.5mL', category: '바이알/튜브', spec: '500개/pk', price: '18,000', supplier: 'Axygen' },
  { name: 'Safety Goggles', category: '안전보호구', spec: '1개', price: '12,000', supplier: '3M' },
  { name: 'Lab Detergent Alconox', category: '세척용품', spec: '1.8kg', price: '35,000', supplier: 'Alconox' },
  { name: 'Latex Gloves (L)', category: '실험용 장갑', spec: '100매/box', price: '7,500', supplier: 'VWR' },
  { name: 'Pipette Tips 200uL', category: '피펫 팁', spec: '1000개/pk', price: '22,000', supplier: 'Eppendorf' },
];

export default function SuppliesPage() {
  return (
    <div>
      <h1 className="text-xl font-bold text-gray-900 mb-1">소모품 주문</h1>
      <p className="text-sm text-gray-500 mb-6">실험실 소모품을 카테고리별로 검색하고 주문합니다.</p>

      {/* Search */}
      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="소모품명, 카테고리 검색..."
            className="w-full pl-9 pr-3 h-[38px] border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <button className="h-[38px] px-4 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600">검색</button>
        <div className="flex border border-gray-300 rounded-lg overflow-hidden">
          <button className="h-[38px] w-9 flex items-center justify-center bg-blue-500 text-white"><Grid3X3 size={14} /></button>
          <button className="h-[38px] w-9 flex items-center justify-center text-gray-400 hover:bg-gray-50"><List size={14} /></button>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Category Sidebar */}
        <div className="w-48 flex-shrink-0">
          <h3 className="text-xs font-bold text-gray-400 uppercase mb-2">카테고리</h3>
          <div className="space-y-1">
            {categories.map(c => (
              <button key={c.name} className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100">
                <span>{c.name}</span>
                <span className="text-xs text-gray-400">{c.count}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-1">
          <div className="grid grid-cols-3 gap-4 mb-6">
            {supplies.map((s, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                <span className="text-xs text-gray-400">{s.supplier}</span>
                <h3 className="text-sm font-medium text-gray-900 mt-1 mb-1">{s.name}</h3>
                <p className="text-xs text-gray-500 mb-1">{s.category}</p>
                <p className="text-xs text-gray-500 mb-3">{s.spec}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-blue-600">{s.price}원</span>
                  <button className="h-[30px] px-3 bg-blue-500 text-white rounded-md text-xs font-medium hover:bg-blue-600">담기</button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-center gap-1">
            <button className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 text-gray-400 hover:bg-gray-100"><ChevronLeft size={14} /></button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-500 text-white text-sm font-medium">1</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 text-gray-600 text-sm hover:bg-gray-100">2</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 text-gray-400 hover:bg-gray-100"><ChevronRight size={14} /></button>
          </div>
        </div>
      </div>
    </div>
  );
}
