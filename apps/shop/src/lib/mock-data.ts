// ================================================================
// 프로토타입 app.js에서 포팅한 시약/소모품 샘플 데이터
// DB 연결 전까지 사용 → Phase 3에서 Prisma 쿼리로 교체
// ================================================================

import type { ReagentCardData, SupplyCardData } from '@jinuchem/shared';

export const sampleReagents: ReagentCardData[] = [
  {
    id: '1',
    name: 'Ethyl alcohol, Pure',
    nameEn: 'Ethanol',
    catalogNo: '459844',
    casNumber: '64-17-5',
    formula: 'C₂H₅OH',
    molWeight: 46.07,
    grade: 'ACS reagent',
    purity: '99.5%',
    supplierName: 'Sigma-Aldrich',
    structureImg: '/images/ethanol.svg',
    variants: [
      { id: 'v1', size: '500', unit: 'mL', listPrice: 158239, salePrice: 142415, discountRate: 10, stockQty: 15, sameDayShip: true, deliveryDate: '2026-03-21' },
      { id: 'v2', size: '1', unit: 'L', listPrice: 294858, stockQty: 8, sameDayShip: true, deliveryDate: '2026-03-21' },
      { id: 'v3', size: '2.5', unit: 'L', listPrice: 542400, stockQty: 3, sameDayShip: false, deliveryDate: '2026-03-24' },
    ],
    ghsPictograms: ['flame', 'exclamation'],
  },
  {
    id: '2',
    name: 'Acetone',
    nameEn: 'Acetone',
    catalogNo: 'A0003',
    casNumber: '67-64-1',
    formula: 'CH₃COCH₃',
    molWeight: 58.08,
    grade: 'ACS Grade',
    purity: '99.5%',
    supplierName: 'TCI',
    variants: [
      { id: 'v4', size: '500', unit: 'mL', listPrice: 45600, stockQty: 25, sameDayShip: true, deliveryDate: '2026-03-21' },
      { id: 'v5', size: '2.5', unit: 'L', listPrice: 87800, stockQty: 12, sameDayShip: true, deliveryDate: '2026-03-21' },
    ],
    ghsPictograms: ['flame', 'exclamation'],
  },
  {
    id: '3',
    name: 'Methanol',
    nameEn: 'Methanol',
    catalogNo: '322415',
    casNumber: '67-56-1',
    formula: 'CH₃OH',
    molWeight: 32.04,
    grade: 'HPLC Grade',
    purity: '99.9%',
    supplierName: 'Sigma-Aldrich',
    variants: [
      { id: 'v6', size: '1', unit: 'L', listPrice: 68500, stockQty: 20, sameDayShip: true, deliveryDate: '2026-03-21' },
      { id: 'v7', size: '4', unit: 'L', listPrice: 98500, salePrice: 88650, discountRate: 10, stockQty: 5, sameDayShip: false, deliveryDate: '2026-03-23' },
    ],
    ghsPictograms: ['flame', 'skull', 'health'],
  },
  {
    id: '4',
    name: 'Sodium Hydroxide',
    nameEn: 'Sodium Hydroxide',
    catalogNo: 'S5881',
    casNumber: '1310-73-2',
    formula: 'NaOH',
    molWeight: 40.0,
    grade: 'ACS reagent',
    purity: '97%',
    supplierName: 'Sigma-Aldrich',
    variants: [
      { id: 'v8', size: '500', unit: 'g', listPrice: 52300, stockQty: 30, sameDayShip: true, deliveryDate: '2026-03-21' },
      { id: 'v9', size: '1', unit: 'kg', listPrice: 89700, stockQty: 10, sameDayShip: true, deliveryDate: '2026-03-21' },
    ],
    ghsPictograms: ['corrosion', 'exclamation'],
  },
  {
    id: '5',
    name: 'Hydrochloric Acid',
    nameEn: 'Hydrochloric Acid',
    catalogNo: 'H1758',
    casNumber: '7647-01-0',
    formula: 'HCl',
    molWeight: 36.46,
    grade: 'ACS reagent',
    purity: '37%',
    supplierName: 'Alfa Aesar',
    variants: [
      { id: 'v10', size: '500', unit: 'mL', listPrice: 43200, salePrice: 38880, discountRate: 10, stockQty: 18, sameDayShip: true, deliveryDate: '2026-03-21' },
      { id: 'v11', size: '2.5', unit: 'L', listPrice: 112500, stockQty: 6, sameDayShip: false, deliveryDate: '2026-03-24' },
    ],
    ghsPictograms: ['corrosion', 'exclamation'],
  },
  {
    id: '6',
    name: 'PIPES',
    nameEn: 'PIPES',
    catalogNo: 'P0058',
    casNumber: '5625-37-6',
    formula: 'C₈H₁₈N₂O₆S₂',
    molWeight: 302.37,
    grade: '고순도',
    purity: '99%',
    supplierName: 'TCI',
    variants: [
      { id: 'v12', size: '5', unit: 'g', listPrice: 226200, stockQty: 4, sameDayShip: true, deliveryDate: '2026-03-21' },
      { id: 'v13', size: '25', unit: 'g', listPrice: 503100, stockQty: 2, sameDayShip: false, deliveryDate: '2026-03-25' },
    ],
    ghsPictograms: ['exclamation'],
  },
  {
    id: '7',
    name: 'Dichloromethane',
    nameEn: 'Dichloromethane',
    catalogNo: '270997',
    casNumber: '75-09-2',
    formula: 'CH₂Cl₂',
    molWeight: 84.93,
    grade: 'ACS reagent',
    purity: '99.5%',
    supplierName: 'Sigma-Aldrich',
    variants: [
      { id: 'v14', size: '1', unit: 'L', listPrice: 76800, stockQty: 14, sameDayShip: true, deliveryDate: '2026-03-21' },
      { id: 'v15', size: '4', unit: 'L', listPrice: 198000, stockQty: 3, sameDayShip: false, deliveryDate: '2026-03-24' },
    ],
    ghsPictograms: ['health', 'exclamation'],
  },
  {
    id: '8',
    name: 'Toluene',
    nameEn: 'Toluene',
    catalogNo: '244511',
    casNumber: '108-88-3',
    formula: 'C₇H₈',
    molWeight: 92.14,
    grade: 'ACS reagent',
    purity: '99.5%',
    supplierName: 'Alfa Aesar',
    variants: [
      { id: 'v16', size: '1', unit: 'L', listPrice: 65400, salePrice: 58860, discountRate: 10, stockQty: 22, sameDayShip: true, deliveryDate: '2026-03-21' },
    ],
    ghsPictograms: ['flame', 'health', 'exclamation'],
  },
];

export const sampleSupplies: SupplyCardData[] = [
  { id: 's1', name: '시린지 필터 0.22um PVDF (100개/팩)', catalogNo: 'SF-2201', categoryName: '필터/여과', supplierName: 'Millipore', subscriptionAvailable: true, variants: [{ id: 'sv1', size: '100개', unit: '팩', listPrice: 185000, stockQty: 50, sameDayShip: true, deliveryDate: '2026-03-21' }] },
  { id: 's2', name: '니트릴 장갑 (M) 100매', catalogNo: 'NG-M100', categoryName: '장갑/보호구', supplierName: 'Kimberly-Clark', subscriptionAvailable: true, variants: [{ id: 'sv2', size: '100매', unit: '박스', listPrice: 28500, stockQty: 200, sameDayShip: true, deliveryDate: '2026-03-21' }] },
  { id: 's3', name: '마이크로피펫 팁 200uL (1000개)', catalogNo: 'PT-200', categoryName: '피펫/팁', supplierName: 'Eppendorf', subscriptionAvailable: true, variants: [{ id: 'sv3', size: '1000개', unit: '팩', listPrice: 45000, stockQty: 80, sameDayShip: true, deliveryDate: '2026-03-21' }] },
  { id: 's4', name: '원심분리 튜브 15mL (500개)', catalogNo: 'CT-1550', categoryName: '튜브/바이알', supplierName: 'Corning', subscriptionAvailable: false, variants: [{ id: 'sv4', size: '500개', unit: '박스', listPrice: 92000, stockQty: 30, sameDayShip: true, deliveryDate: '2026-03-21' }] },
  { id: 's5', name: '96-웰 플레이트 (평저, 50개)', catalogNo: 'WP-9650', categoryName: '플레이트/디쉬', supplierName: 'SPL Life Sciences', subscriptionAvailable: false, variants: [{ id: 'sv5', size: '50개', unit: '케이스', listPrice: 135000, stockQty: 15, sameDayShip: false, deliveryDate: '2026-03-24' }] },
  { id: 's6', name: '파라필름 M (100mm x 38m)', catalogNo: 'PF-100', categoryName: '일반 소모품', supplierName: 'Bemis', subscriptionAvailable: true, variants: [{ id: 'sv6', size: '1', unit: '롤', listPrice: 32000, stockQty: 45, sameDayShip: true, deliveryDate: '2026-03-21' }] },
  { id: 's7', name: '비커 250mL (유리, 눈금)', catalogNo: 'BK-250', categoryName: '유리기구', supplierName: 'Duran', subscriptionAvailable: false, variants: [{ id: 'sv7', size: '1', unit: '개', listPrice: 8500, stockQty: 100, sameDayShip: true, deliveryDate: '2026-03-21' }] },
  { id: 's8', name: '페트리 디쉬 90mm (500개)', catalogNo: 'PD-9050', categoryName: '플레이트/디쉬', supplierName: 'SPL Life Sciences', subscriptionAvailable: true, variants: [{ id: 'sv8', size: '500개', unit: '케이스', listPrice: 78000, stockQty: 20, sameDayShip: true, deliveryDate: '2026-03-21' }] },
];

export const supplierList = [
  'Sigma-Aldrich', 'TCI', 'Alfa Aesar', 'Millipore', 'Eppendorf',
  'Corning', 'SPL Life Sciences', 'Kimberly-Clark', 'Duran', 'Bemis',
];

export const gradeList = ['ACS reagent', 'ACS Grade', 'HPLC Grade', 'GR Grade', '특급', '1급', '고순도'];
