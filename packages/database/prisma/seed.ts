// ================================================================
// JINUCHEM 시드 데이터 — 프로토타입 app.js에서 포팅
// ================================================================

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 시드 데이터 투입 시작...\n');

  // 1. 조직
  console.log('1/8 조직 생성...');
  const org1 = await prisma.organization.create({
    data: { orgName: '경상국립대학교 화학과', bizNo: '609-82-05765', representative: '김교수', address: '경상남도 진주시 진주대로501', phone: '055-772-1230', budgetYearly: 36000000 },
  });
  const org2 = await prisma.organization.create({
    data: { orgName: '서울대학교 생명과학부', bizNo: '120-82-00310', representative: '이교수', address: '서울특별시 관악구 관악로1', phone: '02-880-6700', budgetYearly: 50000000 },
  });
  const orgSupplier = await prisma.organization.create({
    data: { orgName: '(주)지누켐', bizNo: '470-81-02870', representative: '김병선', address: '경상남도 진주시 진주대로501, 창업보육센터 C동 214호', phone: '070-8027-2696' },
  });

  // 2. 사용자
  console.log('2/8 사용자 생성...');
  const researcher = await prisma.user.create({
    data: { orgId: org1.id, roleName: 'researcher', name: '김연구', email: 'researcher@gnu.ac.kr', phone: '010-1234-5678', department: '화학과', labName: '유기화학실험실' },
  });
  const orgAdmin = await prisma.user.create({
    data: { orgId: org1.id, roleName: 'org_admin', name: '김교수', email: 'professor@gnu.ac.kr', phone: '010-9876-5432', department: '화학과', labName: '유기화학실험실' },
  });
  const supplier = await prisma.user.create({
    data: { orgId: orgSupplier.id, roleName: 'supplier', name: '김공급', email: 'supplier@jinuchem.com', phone: '070-8027-2696', department: '영업팀' },
  });
  const sysAdmin = await prisma.user.create({
    data: { orgId: orgSupplier.id, roleName: 'sys_admin', name: '관리자', email: 'admin@jinuchem.com', phone: '070-8027-2697', department: '개발팀' },
  });

  // 3. 공급사
  console.log('3/8 공급사 생성...');
  const sigma = await prisma.supplier.create({ data: { name: 'Sigma-Aldrich', code: 'SIGMA', contactEmail: 'korea@sigmaaldrich.com', contactPhone: '080-023-7111' } });
  const tci = await prisma.supplier.create({ data: { name: 'TCI', code: 'TCI', contactEmail: 'info@sejinci.co.kr', contactPhone: '02-2163-0900' } });
  const alfa = await prisma.supplier.create({ data: { name: 'Alfa Aesar', code: 'ALFA', contactEmail: 'korea@thermofisher.com', contactPhone: '080-048-8800' } });

  // 4. 카테고리
  console.log('4/8 카테고리 생성...');
  const catOrganic = await prisma.category.create({ data: { name: '유기화합물', productType: 'reagent', icon: 'flask', sortOrder: 1 } });
  const catInorganic = await prisma.category.create({ data: { name: '무기화합물', productType: 'reagent', icon: 'atom', sortOrder: 2 } });
  const catSolvent = await prisma.category.create({ data: { name: '용매', productType: 'reagent', icon: 'droplet', sortOrder: 3 } });
  const catBiochem = await prisma.category.create({ data: { name: '생화학시약', productType: 'reagent', icon: 'dna', sortOrder: 4 } });
  const catFilter = await prisma.category.create({ data: { name: '필터/여과', productType: 'supply', icon: 'filter', sortOrder: 1 } });
  const catPipette = await prisma.category.create({ data: { name: '피펫/팁', productType: 'supply', icon: 'pipette', sortOrder: 2 } });
  const catTube = await prisma.category.create({ data: { name: '튜브/바이알', productType: 'supply', icon: 'test-tube', sortOrder: 3 } });
  const catGlove = await prisma.category.create({ data: { name: '장갑/보호구', productType: 'supply', icon: 'shield', sortOrder: 4 } });

  // 5. 시약 제품 (8개)
  console.log('5/8 시약 제품 생성...');
  const reagents = [
    { name: 'Ethyl alcohol, Pure', nameEn: 'Ethanol', catalogNo: '459844', supplierId: sigma.id, categoryId: catSolvent.id, cas: '64-17-5', formula: 'C₂H₅OH', mw: 46.07, purity: '99.5%', grade: 'ACS reagent', ghs: ['flame', 'exclamation'], variants: [{ size: '500', unit: 'mL', list: 158239, sale: 142415, disc: 10, qty: 15, ship: true, date: '2026-03-25' }, { size: '1', unit: 'L', list: 294858, qty: 8, ship: true, date: '2026-03-25' }, { size: '2.5', unit: 'L', list: 542400, qty: 3, ship: false, date: '2026-03-28' }] },
    { name: 'Acetone', nameEn: 'Acetone', catalogNo: 'A0003', supplierId: tci.id, categoryId: catSolvent.id, cas: '67-64-1', formula: 'CH₃COCH₃', mw: 58.08, purity: '99.5%', grade: 'ACS Grade', ghs: ['flame', 'exclamation'], variants: [{ size: '500', unit: 'mL', list: 45600, qty: 25, ship: true, date: '2026-03-25' }, { size: '2.5', unit: 'L', list: 87800, qty: 12, ship: true, date: '2026-03-25' }] },
    { name: 'Methanol', nameEn: 'Methanol', catalogNo: '322415', supplierId: sigma.id, categoryId: catSolvent.id, cas: '67-56-1', formula: 'CH₃OH', mw: 32.04, purity: '99.9%', grade: 'HPLC Grade', ghs: ['flame', 'skull', 'health'], variants: [{ size: '1', unit: 'L', list: 68500, qty: 20, ship: true, date: '2026-03-25' }, { size: '4', unit: 'L', list: 98500, sale: 88650, disc: 10, qty: 5, ship: false, date: '2026-03-27' }] },
    { name: 'Sodium Hydroxide', nameEn: 'Sodium Hydroxide', catalogNo: 'S5881', supplierId: sigma.id, categoryId: catInorganic.id, cas: '1310-73-2', formula: 'NaOH', mw: 40.0, purity: '97%', grade: 'ACS reagent', ghs: ['corrosion', 'exclamation'], variants: [{ size: '500', unit: 'g', list: 52300, qty: 30, ship: true, date: '2026-03-25' }, { size: '1', unit: 'kg', list: 89700, qty: 10, ship: true, date: '2026-03-25' }] },
    { name: 'Hydrochloric Acid', nameEn: 'Hydrochloric Acid', catalogNo: 'H1758', supplierId: alfa.id, categoryId: catInorganic.id, cas: '7647-01-0', formula: 'HCl', mw: 36.46, purity: '37%', grade: 'ACS reagent', ghs: ['corrosion', 'exclamation'], variants: [{ size: '500', unit: 'mL', list: 43200, sale: 38880, disc: 10, qty: 18, ship: true, date: '2026-03-25' }] },
    { name: 'PIPES', nameEn: 'PIPES', catalogNo: 'P0058', supplierId: tci.id, categoryId: catBiochem.id, cas: '5625-37-6', formula: 'C₈H₁₈N₂O₆S₂', mw: 302.37, purity: '99%', grade: '고순도', ghs: ['exclamation'], variants: [{ size: '5', unit: 'g', list: 226200, qty: 4, ship: true, date: '2026-03-25' }, { size: '25', unit: 'g', list: 503100, qty: 2, ship: false, date: '2026-03-29' }] },
    { name: 'Dichloromethane', nameEn: 'DCM', catalogNo: '270997', supplierId: sigma.id, categoryId: catSolvent.id, cas: '75-09-2', formula: 'CH₂Cl₂', mw: 84.93, purity: '99.5%', grade: 'ACS reagent', ghs: ['health', 'exclamation'], variants: [{ size: '1', unit: 'L', list: 76800, qty: 14, ship: true, date: '2026-03-25' }] },
    { name: 'Toluene', nameEn: 'Toluene', catalogNo: '244511', supplierId: alfa.id, categoryId: catSolvent.id, cas: '108-88-3', formula: 'C₇H₈', mw: 92.14, purity: '99.5%', grade: 'ACS reagent', ghs: ['flame', 'health', 'exclamation'], variants: [{ size: '1', unit: 'L', list: 65400, sale: 58860, disc: 10, qty: 22, ship: true, date: '2026-03-25' }] },
  ];

  for (const r of reagents) {
    const product = await prisma.product.create({
      data: {
        supplierId: r.supplierId, categoryId: r.categoryId, productType: 'reagent',
        name: r.name, nameEn: r.nameEn, catalogNo: r.catalogNo,
        reagentDetail: {
          create: { casNumber: r.cas, formula: r.formula, molWeight: r.mw, purity: r.purity, grade: r.grade, ghsPictograms: r.ghs, signalWord: r.ghs.includes('skull') ? '위험' : '경고' },
        },
        variants: {
          create: r.variants.map((v) => ({
            size: v.size, unit: v.unit, listPrice: v.list, salePrice: v.sale ?? null, discountRate: v.disc ?? null,
            stockQty: v.qty, sameDayShip: v.ship, deliveryDate: new Date(v.date),
          })),
        },
      },
    });
  }

  // 6. 소모품 제품 (6개)
  console.log('6/8 소모품 제품 생성...');
  const supplies = [
    { name: '시린지 필터 0.22um PVDF (100개/팩)', catalogNo: 'SF-2201', supplierId: sigma.id, categoryId: catFilter.id, sub: true, variants: [{ size: '100개', unit: '팩', list: 185000, qty: 50, ship: true }] },
    { name: '니트릴 장갑 (M) 100매', catalogNo: 'NG-M100', supplierId: alfa.id, categoryId: catGlove.id, sub: true, variants: [{ size: '100매', unit: '박스', list: 28500, qty: 200, ship: true }] },
    { name: '마이크로피펫 팁 200uL (1000개)', catalogNo: 'PT-200', supplierId: sigma.id, categoryId: catPipette.id, sub: true, variants: [{ size: '1000개', unit: '팩', list: 45000, qty: 80, ship: true }] },
    { name: '원심분리 튜브 15mL (500개)', catalogNo: 'CT-1550', supplierId: tci.id, categoryId: catTube.id, sub: false, variants: [{ size: '500개', unit: '박스', list: 92000, qty: 30, ship: true }] },
    { name: '파라필름 M (100mm x 38m)', catalogNo: 'PF-100', supplierId: alfa.id, categoryId: catFilter.id, sub: true, variants: [{ size: '1', unit: '롤', list: 32000, qty: 45, ship: true }] },
    { name: '비커 250mL (유리, 눈금)', catalogNo: 'BK-250', supplierId: sigma.id, categoryId: catFilter.id, sub: false, variants: [{ size: '1', unit: '개', list: 8500, qty: 100, ship: true }] },
  ];

  for (const s of supplies) {
    await prisma.product.create({
      data: {
        supplierId: s.supplierId, categoryId: s.categoryId, productType: 'supply',
        name: s.name, catalogNo: s.catalogNo,
        supplyDetail: { create: { subscriptionAvailable: s.sub } },
        variants: {
          create: s.variants.map((v) => ({
            size: v.size, unit: v.unit, listPrice: v.list, stockQty: v.qty, sameDayShip: v.ship, deliveryDate: new Date('2026-03-25'),
          })),
        },
      },
    });
  }

  // 7. FAQ
  console.log('7/8 FAQ 생성...');
  const faqs = [
    { category: 'order' as const, question: '주문 후 취소가 가능한가요?', answer: '주문 접수 후 출고 전까지 취소가 가능합니다. 오후 4시 이전에 고객센터로 연락해주세요.' },
    { category: 'delivery' as const, question: '당일 출고 기준이 어떻게 되나요?', answer: '오후 3시 이전 주문 건에 한해 당일 출고됩니다. 국내 재고가 있는 제품에 한합니다.' },
    { category: 'delivery' as const, question: '배송 기간은 얼마나 걸리나요?', answer: '국내 재고 제품은 주문 후 1-2일, 해외 발주 제품은 7-14일 소요됩니다.' },
    { category: 'product' as const, question: 'SDS(안전보건자료)는 어디서 받나요?', answer: '제품 상세 페이지에서 한글 SDS, 영문 SDS를 다운로드할 수 있습니다.' },
    { category: 'product' as const, question: 'COA(분석성적서)는 어떻게 받나요?', answer: '제품 상세 페이지에서 로트번호별 COA를 다운로드할 수 있습니다.' },
    { category: 'account' as const, question: '조직 관리자 권한은 어떻게 받나요?', answer: '기관 내 기존 관리자에게 권한 부여를 요청하거나, 고객센터로 문의해주세요.' },
    { category: 'order' as const, question: '견적서 발급은 어떻게 하나요?', answer: '증빙서류 메뉴에서 주문을 선택한 후 견적서 버튼을 클릭하면 PDF로 발급됩니다.' },
    { category: 'etc' as const, question: 'E-Note와 연동하려면 어떻게 하나요?', answer: '마이페이지 > 연동 설정에서 JINU E-Note 계정을 연결할 수 있습니다.' },
  ];
  for (const faq of faqs) {
    await prisma.fAQ.create({ data: { ...faq, sortOrder: faqs.indexOf(faq) + 1 } });
  }

  // 8. 공지사항
  console.log('8/8 공지사항 생성...');
  await prisma.notice.create({ data: { title: 'JINU Shop 오픈 안내', content: 'JINUCHEM 통합 플랫폼이 오픈되었습니다. 다양한 시약과 소모품을 편리하게 주문하세요.', isPinned: true } });
  await prisma.notice.create({ data: { title: '3월 프로모션 안내', content: '3월 한정 HPLC급 용매 전 품목 10% 할인 이벤트를 진행합니다.' } });
  await prisma.notice.create({ data: { title: '배송 지연 안내', content: '일부 수입 시약의 통관 지연으로 납품일이 1-2일 지연될 수 있습니다.' } });

  // 9. API Rate Limits
  await prisma.apiRateLimit.createMany({
    data: [
      { tier: 'free', dailyLimit: 100, monthlyLimit: 3000, burstLimit: 10 },
      { tier: 'basic', dailyLimit: 1000, monthlyLimit: 30000, burstLimit: 50 },
      { tier: 'pro', dailyLimit: 10000, monthlyLimit: 300000, burstLimit: 200 },
      { tier: 'enterprise', dailyLimit: -1, monthlyLimit: -1, burstLimit: -1 },
    ],
  });

  console.log('\n✅ 시드 데이터 투입 완료!');
  console.log(`  - 조직: 3개`);
  console.log(`  - 사용자: 4명 (연구원, 조직관리자, 공급자, 시스템관리자)`);
  console.log(`  - 공급사: 3개 (Sigma-Aldrich, TCI, Alfa Aesar)`);
  console.log(`  - 카테고리: 8개 (시약4 + 소모품4)`);
  console.log(`  - 시약: 8개 (포장단위 포함)`);
  console.log(`  - 소모품: 6개`);
  console.log(`  - FAQ: 8개`);
  console.log(`  - 공지사항: 3개`);
  console.log(`  - API Rate Limit: 4개 티어`);
}

main()
  .then(async () => { await prisma.$disconnect(); })
  .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); });
