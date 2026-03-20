'use client';

import { useState } from 'react';
import {
  List,
  DollarSign,
  Warehouse,
  Plus,
  Pencil,
  Search,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';

type ProductTab = 'list' | 'price' | 'inventory';

interface Product {
  catalogNo: string;
  name: string;
  casNo: string;
  category: string;
  variants: number;
  status: '판매중' | '품절' | '단종';
}

interface PriceEntry {
  catalogNo: string;
  name: string;
  size: string;
  listPrice: string;
  salePrice: string;
  discountRate: string;
  validUntil: string;
}

interface InventoryEntry {
  catalogNo: string;
  name: string;
  size: string;
  stockQty: number;
  sameDayShip: boolean;
  deliveryDate: string;
}

const sampleProducts: Product[] = [
  { catalogNo: 'JC-SC-001', name: 'Sodium Chloride (NaCl)', casNo: '7647-14-5', category: '무기염', variants: 4, status: '판매중' },
  { catalogNo: 'JC-ET-002', name: 'Ethanol (C2H5OH)', casNo: '64-17-5', category: '알코올', variants: 3, status: '판매중' },
  { catalogNo: 'JC-AC-003', name: 'Acetonitrile (CH3CN)', casNo: '75-05-8', category: '유기용매', variants: 5, status: '판매중' },
  { catalogNo: 'JC-MT-004', name: 'Methanol (CH3OH)', casNo: '67-56-1', category: '알코올', variants: 4, status: '판매중' },
  { catalogNo: 'JC-SA-005', name: 'Sulfuric Acid (H2SO4)', casNo: '7664-93-9', category: '무기산', variants: 2, status: '판매중' },
  { catalogNo: 'JC-TL-006', name: 'Toluene (C7H8)', casNo: '108-88-3', category: '유기용매', variants: 3, status: '품절' },
  { catalogNo: 'JC-HX-007', name: 'Hexane (C6H14)', casNo: '110-54-3', category: '유기용매', variants: 2, status: '판매중' },
  { catalogNo: 'JC-HA-008', name: 'Hydrochloric Acid (HCl)', casNo: '7647-01-0', category: '무기산', variants: 3, status: '판매중' },
  { catalogNo: 'JC-PH-012', name: 'Potassium Hydroxide (KOH)', casNo: '1310-58-3', category: '무기염기', variants: 2, status: '단종' },
  { catalogNo: 'JC-IP-015', name: 'Isopropanol (C3H8O)', casNo: '67-63-0', category: '알코올', variants: 3, status: '판매중' },
];

const samplePrices: PriceEntry[] = [
  { catalogNo: 'JC-SC-001', name: 'Sodium Chloride', size: '100g', listPrice: '₩8,000', salePrice: '₩6,800', discountRate: '15%', validUntil: '2026-06-30' },
  { catalogNo: 'JC-SC-001', name: 'Sodium Chloride', size: '500g', listPrice: '₩15,000', salePrice: '₩12,750', discountRate: '15%', validUntil: '2026-06-30' },
  { catalogNo: 'JC-SC-001', name: 'Sodium Chloride', size: '1kg', listPrice: '₩25,000', salePrice: '₩21,250', discountRate: '15%', validUntil: '2026-06-30' },
  { catalogNo: 'JC-ET-002', name: 'Ethanol (200 Proof)', size: '500mL', listPrice: '₩35,000', salePrice: '₩31,500', discountRate: '10%', validUntil: '2026-06-30' },
  { catalogNo: 'JC-ET-002', name: 'Ethanol (200 Proof)', size: '4L', listPrice: '₩85,000', salePrice: '₩76,500', discountRate: '10%', validUntil: '2026-06-30' },
  { catalogNo: 'JC-AC-003', name: 'Acetonitrile (HPLC)', size: '1L', listPrice: '₩65,000', salePrice: '₩58,500', discountRate: '10%', validUntil: '2026-06-30' },
  { catalogNo: 'JC-AC-003', name: 'Acetonitrile (HPLC)', size: '2.5L', listPrice: '₩120,000', salePrice: '₩102,000', discountRate: '15%', validUntil: '2026-06-30' },
  { catalogNo: 'JC-MT-004', name: 'Methanol (ACS Grade)', size: '2.5L', listPrice: '₩65,000', salePrice: '₩55,250', discountRate: '15%', validUntil: '2026-06-30' },
  { catalogNo: 'JC-MT-004', name: 'Methanol (ACS Grade)', size: '4L', listPrice: '₩75,000', salePrice: '₩67,500', discountRate: '10%', validUntil: '2026-06-30' },
  { catalogNo: 'JC-SA-005', name: 'Sulfuric Acid (98%)', size: '2.5L', listPrice: '₩95,000', salePrice: '₩85,500', discountRate: '10%', validUntil: '2026-06-30' },
];

const sampleInventory: InventoryEntry[] = [
  { catalogNo: 'JC-SC-001', name: 'Sodium Chloride', size: '100g', stockQty: 150, sameDayShip: true, deliveryDate: '2026-03-21' },
  { catalogNo: 'JC-SC-001', name: 'Sodium Chloride', size: '500g', stockQty: 85, sameDayShip: true, deliveryDate: '2026-03-21' },
  { catalogNo: 'JC-SC-001', name: 'Sodium Chloride', size: '1kg', stockQty: 42, sameDayShip: true, deliveryDate: '2026-03-21' },
  { catalogNo: 'JC-ET-002', name: 'Ethanol (200 Proof)', size: '500mL', stockQty: 60, sameDayShip: true, deliveryDate: '2026-03-21' },
  { catalogNo: 'JC-ET-002', name: 'Ethanol (200 Proof)', size: '4L', stockQty: 25, sameDayShip: false, deliveryDate: '2026-03-24' },
  { catalogNo: 'JC-AC-003', name: 'Acetonitrile (HPLC)', size: '1L', stockQty: 38, sameDayShip: true, deliveryDate: '2026-03-21' },
  { catalogNo: 'JC-AC-003', name: 'Acetonitrile (HPLC)', size: '2.5L', stockQty: 12, sameDayShip: false, deliveryDate: '2026-03-25' },
  { catalogNo: 'JC-MT-004', name: 'Methanol (ACS Grade)', size: '2.5L', stockQty: 55, sameDayShip: true, deliveryDate: '2026-03-21' },
  { catalogNo: 'JC-MT-004', name: 'Methanol (ACS Grade)', size: '4L', stockQty: 0, sameDayShip: false, deliveryDate: '2026-04-01' },
  { catalogNo: 'JC-SA-005', name: 'Sulfuric Acid (98%)', size: '2.5L', stockQty: 8, sameDayShip: false, deliveryDate: '2026-03-26' },
  { catalogNo: 'JC-TL-006', name: 'Toluene (ACS Grade)', size: '4L', stockQty: 0, sameDayShip: false, deliveryDate: '2026-04-05' },
  { catalogNo: 'JC-HX-007', name: 'Hexane (HPLC Grade)', size: '4L', stockQty: 20, sameDayShip: true, deliveryDate: '2026-03-21' },
];

const tabConfig: { key: ProductTab; label: string; icon: React.ReactNode }[] = [
  { key: 'list', label: '제품 목록', icon: <List size={16} /> },
  { key: 'price', label: '가격 관리', icon: <DollarSign size={16} /> },
  { key: 'inventory', label: '재고 관리', icon: <Warehouse size={16} /> },
];

const productStatusStyles: Record<string, string> = {
  '판매중': 'bg-green-100 text-green-700',
  '품절': 'bg-red-100 text-red-700',
  '단종': 'bg-gray-100 text-gray-500',
};

export default function ProductsPage() {
  const [activeTab, setActiveTab] = useState<ProductTab>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [inventoryData, setInventoryData] = useState(sampleInventory);

  const toggleSameDayShip = (index: number) => {
    setInventoryData((prev) =>
      prev.map((item, i) => (i === index ? { ...item, sameDayShip: !item.sameDayShip } : item))
    );
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text)]">제품 관리</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">제품, 가격, 재고를 통합 관리하세요</p>
        </div>
        <button className="h-[var(--btn-height)] px-5 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2">
          <Plus size={16} />
          제품 등록
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-[var(--border)]">
        {tabConfig.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.key
                ? 'border-purple-600 text-purple-600'
                : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text)]'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
        <input
          type="search"
          placeholder="카탈로그번호, 제품명, CAS번호 검색..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 h-[var(--btn-height)] border border-[var(--border)] rounded-lg bg-[var(--bg)] text-sm focus:outline-none focus:border-purple-500 text-[var(--text)]"
        />
      </div>

      {/* Tab Content */}
      {activeTab === 'list' && (
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] bg-gray-50">
                <th className="text-left px-5 py-3 text-[var(--text-secondary)] font-medium">카탈로그번호</th>
                <th className="text-left px-5 py-3 text-[var(--text-secondary)] font-medium">제품명</th>
                <th className="text-left px-5 py-3 text-[var(--text-secondary)] font-medium">CAS No.</th>
                <th className="text-left px-5 py-3 text-[var(--text-secondary)] font-medium">카테고리</th>
                <th className="text-center px-5 py-3 text-[var(--text-secondary)] font-medium">규격 수</th>
                <th className="text-center px-5 py-3 text-[var(--text-secondary)] font-medium">상태</th>
                <th className="text-center px-5 py-3 text-[var(--text-secondary)] font-medium">관리</th>
              </tr>
            </thead>
            <tbody>
              {sampleProducts
                .filter(
                  (p) =>
                    !searchQuery ||
                    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    p.catalogNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    p.casNo.includes(searchQuery)
                )
                .map((product) => (
                  <tr key={product.catalogNo} className="border-b border-[var(--border)] last:border-0 hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3 font-medium text-purple-600">{product.catalogNo}</td>
                    <td className="px-5 py-3 font-medium text-[var(--text)]">{product.name}</td>
                    <td className="px-5 py-3 text-[var(--text-secondary)]">{product.casNo}</td>
                    <td className="px-5 py-3 text-[var(--text)]">{product.category}</td>
                    <td className="px-5 py-3 text-center text-[var(--text)]">{product.variants}개</td>
                    <td className="px-5 py-3 text-center">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${productStatusStyles[product.status]}`}>
                        {product.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-center">
                      <button className="w-8 h-8 inline-flex items-center justify-center rounded-lg text-[var(--text-secondary)] hover:bg-gray-100 transition-colors">
                        <Pencil size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'price' && (
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] bg-gray-50">
                <th className="text-left px-5 py-3 text-[var(--text-secondary)] font-medium">카탈로그번호</th>
                <th className="text-left px-5 py-3 text-[var(--text-secondary)] font-medium">제품명</th>
                <th className="text-center px-5 py-3 text-[var(--text-secondary)] font-medium">규격</th>
                <th className="text-right px-5 py-3 text-[var(--text-secondary)] font-medium">정가</th>
                <th className="text-right px-5 py-3 text-[var(--text-secondary)] font-medium">판매가</th>
                <th className="text-center px-5 py-3 text-[var(--text-secondary)] font-medium">할인율</th>
                <th className="text-center px-5 py-3 text-[var(--text-secondary)] font-medium">유효기간</th>
                <th className="text-center px-5 py-3 text-[var(--text-secondary)] font-medium">관리</th>
              </tr>
            </thead>
            <tbody>
              {samplePrices
                .filter(
                  (p) =>
                    !searchQuery ||
                    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    p.catalogNo.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((price, index) => (
                  <tr key={`${price.catalogNo}-${price.size}`} className="border-b border-[var(--border)] last:border-0 hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3 font-medium text-purple-600">{price.catalogNo}</td>
                    <td className="px-5 py-3 text-[var(--text)]">{price.name}</td>
                    <td className="px-5 py-3 text-center text-[var(--text)]">{price.size}</td>
                    <td className="px-5 py-3 text-right text-[var(--text-secondary)] line-through">{price.listPrice}</td>
                    <td className="px-5 py-3 text-right font-semibold text-[var(--text)]">{price.salePrice}</td>
                    <td className="px-5 py-3 text-center">
                      <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-600">
                        {price.discountRate}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-center text-[var(--text-secondary)]">{price.validUntil}</td>
                    <td className="px-5 py-3 text-center">
                      <button className="w-8 h-8 inline-flex items-center justify-center rounded-lg text-[var(--text-secondary)] hover:bg-gray-100 transition-colors">
                        <Pencil size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'inventory' && (
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] bg-gray-50">
                <th className="text-left px-5 py-3 text-[var(--text-secondary)] font-medium">카탈로그번호</th>
                <th className="text-left px-5 py-3 text-[var(--text-secondary)] font-medium">제품명</th>
                <th className="text-center px-5 py-3 text-[var(--text-secondary)] font-medium">규격</th>
                <th className="text-center px-5 py-3 text-[var(--text-secondary)] font-medium">재고 수량</th>
                <th className="text-center px-5 py-3 text-[var(--text-secondary)] font-medium">당일출고</th>
                <th className="text-center px-5 py-3 text-[var(--text-secondary)] font-medium">납품예정일</th>
              </tr>
            </thead>
            <tbody>
              {inventoryData
                .filter(
                  (p) =>
                    !searchQuery ||
                    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    p.catalogNo.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((item, index) => (
                  <tr key={`${item.catalogNo}-${item.size}`} className="border-b border-[var(--border)] last:border-0 hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3 font-medium text-purple-600">{item.catalogNo}</td>
                    <td className="px-5 py-3 text-[var(--text)]">{item.name}</td>
                    <td className="px-5 py-3 text-center text-[var(--text)]">{item.size}</td>
                    <td className="px-5 py-3 text-center">
                      <span className={`font-semibold ${item.stockQty === 0 ? 'text-red-500' : item.stockQty < 15 ? 'text-orange-500' : 'text-[var(--text)]'}`}>
                        {item.stockQty}
                      </span>
                      {item.stockQty === 0 && (
                        <span className="ml-2 inline-flex px-1.5 py-0.5 rounded text-[10px] font-medium bg-red-100 text-red-600">
                          품절
                        </span>
                      )}
                      {item.stockQty > 0 && item.stockQty < 15 && (
                        <span className="ml-2 inline-flex px-1.5 py-0.5 rounded text-[10px] font-medium bg-orange-100 text-orange-600">
                          부족
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-center">
                      <button
                        onClick={() => toggleSameDayShip(index)}
                        className="inline-flex items-center justify-center"
                      >
                        {item.sameDayShip ? (
                          <ToggleRight size={24} className="text-purple-600" />
                        ) : (
                          <ToggleLeft size={24} className="text-gray-300" />
                        )}
                      </button>
                    </td>
                    <td className="px-5 py-3 text-center text-[var(--text-secondary)]">{item.deliveryDate}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      <div className="flex items-center justify-center gap-1">
        <button className="w-9 h-9 flex items-center justify-center rounded-full text-sm text-[var(--text-secondary)] hover:bg-gray-100">
          &lt;
        </button>
        <button className="w-9 h-9 flex items-center justify-center rounded-full text-sm bg-purple-600 text-white font-medium">
          1
        </button>
        <button className="w-9 h-9 flex items-center justify-center rounded-full text-sm text-[var(--text-secondary)] hover:bg-gray-100">
          2
        </button>
        <button className="w-9 h-9 flex items-center justify-center rounded-full text-sm text-[var(--text-secondary)] hover:bg-gray-100">
          3
        </button>
        <button className="w-9 h-9 flex items-center justify-center rounded-full text-sm text-[var(--text-secondary)] hover:bg-gray-100">
          &gt;
        </button>
      </div>
    </div>
  );
}
