'use client';

import { useState, useMemo } from 'react';
import {
  Package, Plus, Upload, Edit, Trash2, Filter,
  FolderTree, RefreshCw, ChevronDown, ChevronRight, Eye, X, Layers, Tag,
} from 'lucide-react';
import { AdminTabs } from '@/components/shared/AdminTabs';
import { Modal } from '@/components/shared/Modal';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Pagination } from '@/components/shared/Pagination';
import { StatCard } from '@/components/shared/StatCard';
import { FilterBar } from '@/components/shared/FilterBar';
import {
  mockAdminProducts,
  mockCategories,
  mockSupplierMappings,
  type AdminProduct,
  type ProductVariant,
  type Category,
  type SupplierMapping,
} from '@/lib/admin-mock-data';
import { useAdminStore } from '@/stores/adminStore';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const TABS = [
  { id: '제품 목록', label: '제품 목록' },
  { id: '카테고리 관리', label: '카테고리 관리' },
  { id: '공급사 매핑', label: '공급사 매핑' },
];

const PER_PAGE = 8;

const fmt = (n: number) => n.toLocaleString('ko-KR');

type VariantStatus = '판매중' | '일시품절' | '판매중단';

// ---------------------------------------------------------------------------
// Helper: blank variant row
// ---------------------------------------------------------------------------
const blankVariant = (): ProductVariant => ({
  size: '', unit: 'mL', listPrice: 0, salePrice: 0, stock: 0, sameDayShip: false, status: '판매중',
});

// ---------------------------------------------------------------------------
// Helper: blank product form
// ---------------------------------------------------------------------------
interface ProductForm {
  name: string;
  casNumber: string;
  formula: string;
  mw: string;
  purity: string;
  grade: string;
  supplier: string;
  catalogNo: string;
  brand: string;
  category: string;
  type: '시약' | '소모품';
  variants: ProductVariant[];
}

const defaultProductForm = (): ProductForm => ({
  name: '', casNumber: '', formula: '', mw: '', purity: '', grade: '',
  supplier: '', catalogNo: '', brand: '', category: '',
  type: '시약', variants: [blankVariant()],
});

// ---------------------------------------------------------------------------
// Helper: blank category form
// ---------------------------------------------------------------------------
interface CategoryForm {
  name: string;
  parentId: string | null;
  description: string;
  status: '활성' | '비활성';
}

const defaultCategoryForm = (): CategoryForm => ({
  name: '', parentId: null, description: '', status: '활성',
});

// ---------------------------------------------------------------------------
// Helper: compute product status from variants
// ---------------------------------------------------------------------------
function getProductStatus(variants: ProductVariant[]): string {
  if (variants.length === 0) return '판매중단';
  const counts: Record<VariantStatus, number> = { '판매중': 0, '일시품절': 0, '판매중단': 0 };
  variants.forEach((v) => { counts[v.status] = (counts[v.status] || 0) + 1; });
  if (counts['판매중'] === variants.length) return '판매중';
  if (counts['판매중단'] === variants.length) return '판매중단';
  if (counts['일시품절'] > 0 && counts['판매중'] === 0) return '일시품절';
  // Mixed
  const parts: string[] = [];
  if (counts['판매중'] > 0) parts.push(`판매중 ${counts['판매중']}`);
  if (counts['일시품절'] > 0) parts.push(`품절 ${counts['일시품절']}`);
  if (counts['판매중단'] > 0) parts.push(`중단 ${counts['판매중단']}`);
  return parts.join(' / ');
}

// ---------------------------------------------------------------------------
// Helper: variant status badge
// ---------------------------------------------------------------------------
function VariantStatusBadge({ status }: { status: VariantStatus }) {
  const cls =
    status === '판매중' ? 'bg-emerald-100 text-emerald-700' :
    status === '일시품절' ? 'bg-amber-100 text-amber-700' :
    'bg-red-100 text-red-700';
  return <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${cls}`}>{status}</span>;
}

// ---------------------------------------------------------------------------
// Helper: product status display (computed from variants)
// ---------------------------------------------------------------------------
function ProductStatusDisplay({ variants }: { variants: ProductVariant[] }) {
  const label = getProductStatus(variants);
  if (label === '판매중') return <VariantStatusBadge status="판매중" />;
  if (label === '일시품절') return <VariantStatusBadge status="일시품절" />;
  if (label === '판매중단') return <VariantStatusBadge status="판매중단" />;
  // Mixed display
  const counts: Record<VariantStatus, number> = { '판매중': 0, '일시품절': 0, '판매중단': 0 };
  variants.forEach((v) => { counts[v.status] = (counts[v.status] || 0) + 1; });
  return (
    <div className="flex items-center gap-1 flex-wrap">
      {counts['판매중'] > 0 && <span className="text-xs px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-medium whitespace-nowrap">판매중 {counts['판매중']}</span>}
      {counts['일시품절'] > 0 && <span className="text-xs px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700 font-medium whitespace-nowrap">품절 {counts['일시품절']}</span>}
      {counts['판매중단'] > 0 && <span className="text-xs px-1.5 py-0.5 rounded-full bg-red-100 text-red-700 font-medium whitespace-nowrap">중단 {counts['판매중단']}</span>}
    </div>
  );
}

// ===========================================================================
// Page Component
// ===========================================================================
export default function ProductsPage() {
  // ------ Store ------
  const { productsTab, setProductsTab, selectedProductIds, toggleProductSelection, selectAllProducts, clearProductSelection, activeModal, modalData, openModal, closeModal } = useAdminStore();

  // ------ LOCAL MUTABLE STATE ------
  const [products, setProducts] = useState<AdminProduct[]>(() => mockAdminProducts.map((p) => ({ ...p, variants: p.variants.map((v) => ({ ...v })) })));
  const [categories, setCategories] = useState<Category[]>(() => mockCategories.map((c) => ({ ...c })));
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  // ------ Derived options (from mutable state) ------
  const supplierOptions = useMemo(() => ['전체', ...Array.from(new Set(products.map((p) => p.supplier).filter((s) => s !== '-')))], [products]);
  const categoryOptions = useMemo(() => ['전체', ...Array.from(new Set(categories.filter((c) => !c.parentId).map((c) => c.name)))], [categories]);

  // ------ Tab 1 local state ------
  const [search, setSearch] = useState('');
  const [supplierFilter, setSupplierFilter] = useState('전체');
  const [categoryFilter, setCategoryFilter] = useState('전체');
  const [typeFilter, setTypeFilter] = useState('전체');
  const [statusFilter, setStatusFilter] = useState('전체');
  const [page, setPage] = useState(1);

  // ------ Tab 2 local state ------
  const [expandedCats, setExpandedCats] = useState<Set<string>>(new Set());
  const [catForm, setCatForm] = useState<CategoryForm>(defaultCategoryForm());

  // ------ Product form state (add/edit) ------
  const [productForm, setProductForm] = useState<ProductForm>(defaultProductForm());

  // ======== Tab 1: Filtered products ========
  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (supplierFilter !== '전체' && p.supplier !== supplierFilter) return false;
      if (categoryFilter !== '전체' && p.category !== categoryFilter) return false;
      if (typeFilter !== '전체' && p.type !== typeFilter) return false;
      if (statusFilter !== '전체') {
        const productLabel = getProductStatus(p.variants);
        if (statusFilter === '판매중' && productLabel !== '판매중') return false;
        if (statusFilter === '일시품절' && productLabel !== '일시품절' && !productLabel.includes('품절')) return false;
        if (statusFilter === '판매중단' && productLabel !== '판매중단' && !productLabel.includes('중단')) return false;
      }
      if (search) {
        const q = search.toLowerCase();
        if (!p.name.toLowerCase().includes(q) && !p.catalogNo.toLowerCase().includes(q) && !p.casNumber.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [products, search, supplierFilter, categoryFilter, typeFilter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  // Stats
  const totalProducts = products.length;
  const reagentCount = products.filter((p) => p.type === '시약').length;
  const supplyCount = products.filter((p) => p.type === '소모품').length;
  const outOfStockCount = products.filter((p) => {
    const s = getProductStatus(p.variants);
    return s !== '판매중';
  }).length;

  // Selection helpers
  const currentIds = paginated.map((p) => p.id);
  const allSelected = currentIds.length > 0 && currentIds.every((id) => selectedProductIds.includes(id));

  // Category helpers
  const mainCats = categories.filter((c) => !c.parentId);
  const subCatsOf = (parentId: string) => categories.filter((c) => c.parentId === parentId);
  const mainCatCount = mainCats.length;
  const subCatCount = categories.filter((c) => c.parentId).length;

  const toggleExpand = (id: string) => {
    setExpandedCats((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  // ------ Open product detail ------
  const openProductDetail = (p: AdminProduct) => openModal('product-detail', p);

  // ------ Open product add/edit ------
  const openProductAdd = () => {
    setProductForm(defaultProductForm());
    openModal('product-form', null);
  };
  const openProductEdit = (p: AdminProduct) => {
    setProductForm({
      name: p.name, casNumber: p.casNumber, formula: '', mw: '', purity: '', grade: '',
      supplier: p.supplier, catalogNo: p.catalogNo, brand: p.supplier, category: p.category,
      type: p.type, variants: p.variants.map((v) => ({ ...v })),
    });
    openModal('product-form', p);
  };

  // ------ Save product ------
  const saveProduct = () => {
    if (!productForm.name.trim()) { showToast('제품명을 입력해 주세요.'); return; }
    if (modalData) {
      // Edit
      const target = modalData as AdminProduct;
      setProducts((prev) => prev.map((p) =>
        p.id === target.id
          ? {
              ...p,
              name: productForm.name,
              casNumber: productForm.casNumber,
              supplier: productForm.supplier,
              catalogNo: productForm.catalogNo,
              category: productForm.category,
              type: productForm.type,
              variants: productForm.variants.map((v) => ({ ...v })),
              status: getProductStatus(productForm.variants) as AdminProduct['status'],
            }
          : p
      ));
      showToast(`"${productForm.name}" 제품이 수정되었습니다.`);
    } else {
      // Add
      const newId = `PROD-${String(products.length + 1).padStart(3, '0')}`;
      const catNo = productForm.catalogNo || `NEW-${String(products.length + 1).padStart(4, '0')}`;
      const newProduct: AdminProduct = {
        id: newId,
        catalogNo: catNo,
        name: productForm.name,
        casNumber: productForm.casNumber || '-',
        supplier: productForm.supplier || '-',
        category: productForm.category || '기타',
        subCategory: '',
        type: productForm.type,
        variants: productForm.variants.map((v) => ({ ...v })),
        status: getProductStatus(productForm.variants) as AdminProduct['status'],
        createdAt: new Date().toISOString().slice(0, 10),
      };
      setProducts((prev) => [newProduct, ...prev]);
      showToast(`"${productForm.name}" 제품이 등록되었습니다.`);
    }
    closeModal();
  };

  // ------ Bulk actions ------
  const bulkStatusChange = () => {
    if (selectedProductIds.length === 0) return;
    setProducts((prev) => prev.map((p) =>
      selectedProductIds.includes(p.id)
        ? { ...p, variants: p.variants.map((v) => ({ ...v, status: '판매중단' as VariantStatus })), status: '판매중단' as AdminProduct['status'] }
        : p
    ));
    showToast(`${selectedProductIds.length}건의 제품이 판매중단으로 변경되었습니다.`);
    clearProductSelection();
  };

  const bulkCsvExport = () => {
    showToast(`CSV 내보내기 완료 (${selectedProductIds.length}건)`);
    clearProductSelection();
  };

  const bulkPriceAdjust = () => {
    showToast('가격 일괄 조정은 준비 중입니다.');
  };

  // ------ Category CRUD ------
  const openCategoryAdd = () => {
    setCatForm(defaultCategoryForm());
    openModal('category-form', null);
  };
  const openCategoryEdit = (cat: Category) => {
    setCatForm({ name: cat.name, parentId: cat.parentId, description: '', status: cat.status });
    openModal('category-form', cat);
  };
  const saveCategory = () => {
    if (!catForm.name.trim()) { showToast('카테고리명을 입력해 주세요.'); return; }
    if (modalData) {
      const target = modalData as Category;
      setCategories((prev) => prev.map((c) =>
        c.id === target.id ? { ...c, name: catForm.name, parentId: catForm.parentId, status: catForm.status } : c
      ));
      showToast(`"${catForm.name}" 카테고리가 수정되었습니다.`);
    } else {
      const newId = `CAT-${String(categories.length + 1).padStart(3, '0')}`;
      const newCat: Category = {
        id: newId,
        name: catForm.name,
        parentId: catForm.parentId,
        productCount: 0,
        status: catForm.status,
        order: categories.length + 1,
      };
      setCategories((prev) => [...prev, newCat]);
      showToast(`"${catForm.name}" 카테고리가 추가되었습니다.`);
    }
    closeModal();
  };
  const deleteCategory = (catId: string) => {
    const cat = categories.find((c) => c.id === catId);
    setCategories((prev) => prev.filter((c) => c.id !== catId && c.parentId !== catId));
    showToast(`"${cat?.name}" 카테고리가 삭제되었습니다.`);
  };

  // ------ Supplier detail ------
  const openSupplierDetail = (s: SupplierMapping) => openModal('supplier-detail', s);

  // Helper: minPrice for a product
  const minPrice = (p: AdminProduct) => Math.min(...p.variants.map((v) => v.salePrice));

  // ======================================================================
  // Pill button helper
  // ======================================================================
  const pill = (label: string, active: boolean, onClick: () => void) => (
    <button
      key={label}
      onClick={onClick}
      className={`h-[var(--btn-height)] px-4 text-sm font-medium rounded-full transition-colors ${
        active
          ? 'bg-orange-600 text-white'
          : 'bg-[var(--bg)] border border-[var(--border)] text-[var(--text-secondary)] hover:bg-gray-100'
      }`}
    >
      {label}
    </button>
  );

  // ======================================================================
  // RENDER
  // ======================================================================
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text)]">제품 관리</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            등록 제품 {totalProducts}건 | 공급사 {mockSupplierMappings.length}개
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => showToast('CSV 업로드 기능은 준비 중입니다.')}
            className="h-[var(--btn-height)] px-4 bg-[var(--bg)] border border-[var(--border)] text-[var(--text)] rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <Upload size={16} /> CSV 일괄 업로드
          </button>
          <button
            onClick={openProductAdd}
            className="h-[var(--btn-height)] px-4 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors flex items-center gap-2"
          >
            <Plus size={16} /> 제품 등록
          </button>
        </div>
      </div>

      {/* Tabs */}
      <AdminTabs tabs={TABS} activeTab={productsTab} onTabChange={setProductsTab} />

      {/* ================================================================ */}
      {/* TAB 1 : 제품 목록                                                 */}
      {/* ================================================================ */}
      {productsTab === '제품 목록' && (
        <>
          {/* Stat cards */}
          <div className="grid grid-cols-4 gap-4">
            <StatCard icon={<Package size={20} />} label="전체 제품" value={String(totalProducts)} change="+12" up />
            <StatCard icon={<Layers size={20} />} label="시약" value={String(reagentCount)} change="+8" up />
            <StatCard icon={<Tag size={20} />} label="소모품" value={String(supplyCount)} change="+4" up />
            <StatCard icon={<X size={20} />} label="품절/중단" value={String(outOfStockCount)} change="-2" up={false} />
          </div>

          {/* Filters */}
          <FilterBar searchValue={search} onSearchChange={(v) => { setSearch(v); setPage(1); }} searchPlaceholder="제품명, 카탈로그번호, CAS번호 검색...">
            {/* Supplier select */}
            <div className="flex items-center gap-2">
              <Filter size={14} className="text-[var(--text-secondary)]" />
              <select
                value={supplierFilter}
                onChange={(e) => { setSupplierFilter(e.target.value); setPage(1); }}
                className="h-[var(--btn-height)] px-3 border border-[var(--border)] rounded-lg bg-[var(--bg)] text-sm text-[var(--text)]"
              >
                {supplierOptions.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            {/* Category select */}
            <div className="flex items-center gap-2">
              <select
                value={categoryFilter}
                onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}
                className="h-[var(--btn-height)] px-3 border border-[var(--border)] rounded-lg bg-[var(--bg)] text-sm text-[var(--text)]"
              >
                {categoryOptions.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            {/* Type pills */}
            <div className="flex items-center gap-1.5">
              {['전체', '시약', '소모품'].map((t) =>
                pill(t, typeFilter === t, () => { setTypeFilter(t); setPage(1); })
              )}
            </div>
            {/* Status pills */}
            <div className="flex items-center gap-1.5">
              {['전체', '판매중', '품절', '중단'].map((s) => {
                const map: Record<string, string> = { '품절': '일시품절', '중단': '판매중단' };
                const val = map[s] || s;
                return pill(s, statusFilter === val, () => { setStatusFilter(val); setPage(1); });
              })}
            </div>
          </FilterBar>

          {/* Bulk action bar */}
          {selectedProductIds.length > 0 && (
            <div className="flex items-center gap-3 bg-orange-50 border border-orange-200 rounded-xl px-5 py-3">
              <span className="text-sm font-medium text-orange-700">{selectedProductIds.length}건 선택됨</span>
              <div className="flex items-center gap-2 ml-auto">
                <button onClick={bulkStatusChange} className="h-[var(--btn-height)] px-4 text-sm font-medium bg-white border border-[var(--border)] rounded-lg hover:bg-gray-50 transition-colors text-[var(--text)]">상태 변경</button>
                <button onClick={bulkPriceAdjust} className="h-[var(--btn-height)] px-4 text-sm font-medium bg-white border border-[var(--border)] rounded-lg hover:bg-gray-50 transition-colors text-[var(--text)]">가격 일괄 조정</button>
                <button onClick={bulkCsvExport} className="h-[var(--btn-height)] px-4 text-sm font-medium bg-white border border-[var(--border)] rounded-lg hover:bg-gray-50 transition-colors text-[var(--text)]">CSV 내보내기</button>
                <button onClick={clearProductSelection} className="h-[var(--btn-height)] px-3 text-sm text-[var(--text-secondary)] hover:text-[var(--text)]">
                  <X size={16} />
                </button>
              </div>
            </div>
          )}

          {/* Table */}
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[var(--bg)] border-b border-[var(--border)]">
                  <th className="w-10 px-4 py-3">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      onChange={() => selectAllProducts(currentIds)}
                      className="accent-orange-600"
                    />
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-[var(--text-secondary)]">카탈로그 번호</th>
                  <th className="text-left px-4 py-3 font-semibold text-[var(--text-secondary)]">제품명</th>
                  <th className="text-left px-4 py-3 font-semibold text-[var(--text-secondary)]">CAS No.</th>
                  <th className="text-left px-4 py-3 font-semibold text-[var(--text-secondary)]">공급사</th>
                  <th className="text-left px-4 py-3 font-semibold text-[var(--text-secondary)]">카테고리</th>
                  <th className="text-left px-4 py-3 font-semibold text-[var(--text-secondary)]">유형</th>
                  <th className="text-center px-4 py-3 font-semibold text-[var(--text-secondary)]">규격수</th>
                  <th className="text-right px-4 py-3 font-semibold text-[var(--text-secondary)]">최저가</th>
                  <th className="text-left px-4 py-3 font-semibold text-[var(--text-secondary)]">상태</th>
                  <th className="text-center px-4 py-3 font-semibold text-[var(--text-secondary)]">관리</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((p) => (
                  <tr
                    key={p.id}
                    className="border-b border-[var(--border)] hover:bg-[var(--bg)] transition-colors cursor-pointer"
                    onClick={() => openProductDetail(p)}
                  >
                    <td className="w-10 px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={selectedProductIds.includes(p.id)}
                        onChange={() => toggleProductSelection(p.id)}
                        className="accent-orange-600"
                      />
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-orange-600 font-medium">{p.catalogNo}</td>
                    <td className="px-4 py-3 font-medium text-[var(--text)]">{p.name}</td>
                    <td className="px-4 py-3 text-[var(--text-secondary)] font-mono text-xs">{p.casNumber}</td>
                    <td className="px-4 py-3 text-[var(--text-secondary)]">{p.supplier}</td>
                    <td className="px-4 py-3 text-[var(--text)]">{p.category}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${p.type === '시약' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'}`}>
                        {p.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center text-[var(--text)]">{p.variants.length}</td>
                    <td className="px-4 py-3 text-right font-medium text-[var(--text)]">{'\u20A9'}{fmt(minPrice(p))}</td>
                    <td className="px-4 py-3"><ProductStatusDisplay variants={p.variants} /></td>
                    <td className="px-4 py-3 text-center" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-center gap-1">
                        <button onClick={() => openProductDetail(p)} className="w-8 h-8 flex items-center justify-center rounded-lg text-[var(--text-secondary)] hover:bg-gray-100 transition-colors">
                          <Eye size={16} />
                        </button>
                        <button onClick={() => openProductEdit(p)} className="w-8 h-8 flex items-center justify-center rounded-lg text-[var(--text-secondary)] hover:bg-gray-100 transition-colors">
                          <Edit size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {paginated.length === 0 && (
                  <tr>
                    <td colSpan={11} className="text-center py-12 text-[var(--text-secondary)]">
                      검색 결과가 없습니다.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}

      {/* ================================================================ */}
      {/* TAB 2 : 카테고리 관리                                              */}
      {/* ================================================================ */}
      {productsTab === '카테고리 관리' && (
        <>
          {/* Stat cards */}
          <div className="grid grid-cols-2 gap-4">
            <StatCard icon={<FolderTree size={20} />} label="대분류" value={String(mainCatCount)} change="" up />
            <StatCard icon={<Tag size={20} />} label="소분류" value={String(subCatCount)} change="" up />
          </div>

          {/* Add button */}
          <div className="flex justify-end">
            <button onClick={openCategoryAdd} className="h-[var(--btn-height)] px-4 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors flex items-center gap-2">
              <Plus size={16} /> 카테고리 추가
            </button>
          </div>

          {/* Tree */}
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl overflow-hidden divide-y divide-[var(--border)]">
            {mainCats.map((cat) => {
              const subs = subCatsOf(cat.id);
              const isExpanded = expandedCats.has(cat.id);
              return (
                <div key={cat.id}>
                  {/* Main category row */}
                  <div
                    className="flex items-center gap-3 px-5 py-3.5 hover:bg-[var(--bg)] transition-colors cursor-pointer"
                    onClick={() => toggleExpand(cat.id)}
                  >
                    <button className="w-6 h-6 flex items-center justify-center text-[var(--text-secondary)]">
                      {subs.length > 0 ? (isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />) : <span className="w-4" />}
                    </button>
                    <FolderTree size={16} className="text-orange-600" />
                    <span className="font-medium text-[var(--text)] flex-1">{cat.name}</span>
                    <span className="text-xs text-[var(--text-secondary)] mr-4">{fmt(cat.productCount)}개 제품</span>
                    <StatusBadge status={cat.status} />
                    <div className="flex items-center gap-1 ml-3" onClick={(e) => e.stopPropagation()}>
                      <button onClick={() => openCategoryEdit(cat)} className="w-8 h-8 flex items-center justify-center rounded-lg text-[var(--text-secondary)] hover:bg-gray-100 transition-colors">
                        <Edit size={14} />
                      </button>
                      <button onClick={() => deleteCategory(cat.id)} className="w-8 h-8 flex items-center justify-center rounded-lg text-[var(--text-secondary)] hover:bg-red-50 hover:text-red-500 transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Subcategories */}
                  {isExpanded && subs.map((sub) => (
                    <div
                      key={sub.id}
                      className="flex items-center gap-3 pl-14 pr-5 py-3 bg-[var(--bg)] border-t border-[var(--border)] hover:bg-gray-100 transition-colors"
                    >
                      <Tag size={14} className="text-[var(--text-secondary)]" />
                      <span className="text-sm text-[var(--text)] flex-1">{sub.name}</span>
                      <span className="text-xs text-[var(--text-secondary)] mr-4">{fmt(sub.productCount)}개 제품</span>
                      <StatusBadge status={sub.status} />
                      <div className="flex items-center gap-1 ml-3">
                        <button onClick={() => openCategoryEdit(sub)} className="w-8 h-8 flex items-center justify-center rounded-lg text-[var(--text-secondary)] hover:bg-gray-200 transition-colors">
                          <Edit size={14} />
                        </button>
                        <button onClick={() => deleteCategory(sub.id)} className="w-8 h-8 flex items-center justify-center rounded-lg text-[var(--text-secondary)] hover:bg-red-50 hover:text-red-500 transition-colors">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* ================================================================ */}
      {/* TAB 3 : 공급사 매핑                                                */}
      {/* ================================================================ */}
      {productsTab === '공급사 매핑' && (
        <div className="grid grid-cols-2 gap-5">
          {mockSupplierMappings.map((s) => (
            <div
              key={s.id}
              onClick={() => openSupplierDetail(s)}
              className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5 hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-[var(--text)]">{s.name}</h3>
                <StatusBadge status={s.syncStatus} />
              </div>
              <div className="grid grid-cols-2 gap-y-3 text-sm mb-4">
                <div>
                  <span className="text-[var(--text-secondary)]">제품 수</span>
                  <p className="font-medium text-[var(--text)]">{fmt(s.productCount)}개</p>
                </div>
                <div>
                  <span className="text-[var(--text-secondary)]">평균 단가</span>
                  <p className="font-medium text-[var(--text)]">{'\u20A9'}{fmt(s.avgPrice)}</p>
                </div>
                <div>
                  <span className="text-[var(--text-secondary)]">최근 동기화</span>
                  <p className="font-medium text-[var(--text)]">{s.lastSync}</p>
                </div>
                <div>
                  <span className="text-[var(--text-secondary)]">연락처</span>
                  <p className="font-medium text-[var(--text)] text-xs truncate">{s.contact}</p>
                </div>
              </div>
              <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                <button onClick={() => showToast('동기화 요청을 전송했습니다.')} className="h-[var(--btn-height)] px-3 text-sm font-medium bg-[var(--bg)] border border-[var(--border)] rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-1.5 text-[var(--text)]">
                  <RefreshCw size={14} /> 동기화
                </button>
                <button onClick={() => openSupplierDetail(s)} className="h-[var(--btn-height)] px-3 text-sm font-medium text-orange-600 hover:underline">
                  상세 보기
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ================================================================ */}
      {/* MODALS                                                            */}
      {/* ================================================================ */}

      {/* --- Product Detail Modal --- */}
      {activeModal === 'product-detail' && modalData && (() => {
        const p = modalData as AdminProduct;
        return (
          <Modal isOpen onClose={closeModal} title="제품 상세" size="xl">
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center gap-3 flex-wrap">
                <h3 className="text-xl font-bold text-[var(--text)]">{p.name}</h3>
                <span className="text-xs px-2.5 py-1 rounded-full bg-orange-50 text-orange-700 font-medium">{p.supplier}</span>
                <ProductStatusDisplay variants={p.variants} />
              </div>

              {/* Info grid */}
              <div className="grid grid-cols-3 gap-4 text-sm">
                {[
                  ['카탈로그 번호', p.catalogNo],
                  ['CAS Number', p.casNumber],
                  ['카테고리', `${p.category} / ${p.subCategory}`],
                  ['유형', p.type],
                  ['등록일', p.createdAt],
                  ['규격 수', `${p.variants.length}개`],
                ].map(([label, val]) => (
                  <div key={label as string} className="bg-[var(--bg)] rounded-lg p-3">
                    <p className="text-[var(--text-secondary)] text-xs mb-1">{label}</p>
                    <p className="font-medium text-[var(--text)]">{val}</p>
                  </div>
                ))}
              </div>

              {/* Variants table */}
              <div>
                <h4 className="text-sm font-semibold text-[var(--text)] mb-2">규격 / 가격</h4>
                <div className="border border-[var(--border)] rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-[var(--bg)] border-b border-[var(--border)]">
                        <th className="text-left px-4 py-2.5 font-semibold text-[var(--text-secondary)]">용량/단위</th>
                        <th className="text-right px-4 py-2.5 font-semibold text-[var(--text-secondary)]">정가</th>
                        <th className="text-right px-4 py-2.5 font-semibold text-[var(--text-secondary)]">판매가</th>
                        <th className="text-right px-4 py-2.5 font-semibold text-[var(--text-secondary)]">할인율</th>
                        <th className="text-right px-4 py-2.5 font-semibold text-[var(--text-secondary)]">재고</th>
                        <th className="text-center px-4 py-2.5 font-semibold text-[var(--text-secondary)]">당일출고</th>
                        <th className="text-center px-4 py-2.5 font-semibold text-[var(--text-secondary)]">상태</th>
                        <th className="text-left px-4 py-2.5 font-semibold text-[var(--text-secondary)]">납품예정</th>
                      </tr>
                    </thead>
                    <tbody>
                      {p.variants.map((v, i) => {
                        const disc = Math.round((1 - v.salePrice / v.listPrice) * 100);
                        return (
                          <tr key={i} className="border-b border-[var(--border)] last:border-b-0">
                            <td className="px-4 py-2.5 font-medium text-[var(--text)]">{v.size} {v.unit}</td>
                            <td className="px-4 py-2.5 text-right text-[var(--text-secondary)] line-through">{'\u20A9'}{fmt(v.listPrice)}</td>
                            <td className="px-4 py-2.5 text-right font-medium text-[var(--text)]">{'\u20A9'}{fmt(v.salePrice)}</td>
                            <td className="px-4 py-2.5 text-right text-red-500 font-medium">{disc}%</td>
                            <td className="px-4 py-2.5 text-right text-[var(--text)]">{fmt(v.stock)}</td>
                            <td className="px-4 py-2.5 text-center">
                              {v.sameDayShip
                                ? <span className="text-xs px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full font-medium">당일출고</span>
                                : <span className="text-xs text-[var(--text-secondary)]">-</span>}
                            </td>
                            <td className="px-4 py-2.5 text-center"><VariantStatusBadge status={v.status} /></td>
                            <td className="px-4 py-2.5 text-sm text-[var(--text)]">{v.sameDayShip ? '오늘 출고' : '2~3일 이내'}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-end pt-2">
                <button
                  onClick={() => { closeModal(); openProductEdit(p); }}
                  className="h-[var(--btn-height)] px-5 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors flex items-center gap-2"
                >
                  <Edit size={16} /> 수정
                </button>
              </div>
            </div>
          </Modal>
        );
      })()}

      {/* --- Product Add/Edit Form Modal --- */}
      {activeModal === 'product-form' && (
        <Modal isOpen onClose={closeModal} title={modalData ? '제품 수정' : '제품 등록'} size="xl">
          <div className="space-y-6">
            {/* 기본 정보 */}
            <fieldset>
              <legend className="text-sm font-semibold text-[var(--text)] mb-3">기본 정보</legend>
              <div className="grid grid-cols-2 gap-4">
                <label className="block">
                  <span className="text-xs text-[var(--text-secondary)] mb-1 block">제품명 *</span>
                  <input value={productForm.name} onChange={(e) => setProductForm({ ...productForm, name: e.target.value })} className="w-full h-[var(--btn-height)] px-3 text-sm border border-[var(--border)] rounded-lg bg-[var(--bg)] text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-orange-500" />
                </label>
                <label className="block">
                  <span className="text-xs text-[var(--text-secondary)] mb-1 block">CAS Number</span>
                  <input value={productForm.casNumber} onChange={(e) => setProductForm({ ...productForm, casNumber: e.target.value })} className="w-full h-[var(--btn-height)] px-3 text-sm border border-[var(--border)] rounded-lg bg-[var(--bg)] text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-orange-500" />
                </label>
                <label className="block">
                  <span className="text-xs text-[var(--text-secondary)] mb-1 block">분자식</span>
                  <input value={productForm.formula} onChange={(e) => setProductForm({ ...productForm, formula: e.target.value })} className="w-full h-[var(--btn-height)] px-3 text-sm border border-[var(--border)] rounded-lg bg-[var(--bg)] text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-orange-500" />
                </label>
                <label className="block">
                  <span className="text-xs text-[var(--text-secondary)] mb-1 block">분자량 (MW)</span>
                  <input value={productForm.mw} onChange={(e) => setProductForm({ ...productForm, mw: e.target.value })} className="w-full h-[var(--btn-height)] px-3 text-sm border border-[var(--border)] rounded-lg bg-[var(--bg)] text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-orange-500" />
                </label>
                <label className="block">
                  <span className="text-xs text-[var(--text-secondary)] mb-1 block">순도 (Purity)</span>
                  <input value={productForm.purity} onChange={(e) => setProductForm({ ...productForm, purity: e.target.value })} placeholder="e.g. 99.5%" className="w-full h-[var(--btn-height)] px-3 text-sm border border-[var(--border)] rounded-lg bg-[var(--bg)] text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-orange-500" />
                </label>
                <label className="block">
                  <span className="text-xs text-[var(--text-secondary)] mb-1 block">등급 (Grade)</span>
                  <input value={productForm.grade} onChange={(e) => setProductForm({ ...productForm, grade: e.target.value })} placeholder="e.g. ACS, HPLC" className="w-full h-[var(--btn-height)] px-3 text-sm border border-[var(--border)] rounded-lg bg-[var(--bg)] text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-orange-500" />
                </label>
              </div>
            </fieldset>

            {/* 공급사 매핑 */}
            <fieldset>
              <legend className="text-sm font-semibold text-[var(--text)] mb-3">공급사 매핑</legend>
              <div className="grid grid-cols-3 gap-4">
                <label className="block">
                  <span className="text-xs text-[var(--text-secondary)] mb-1 block">공급사</span>
                  <select value={productForm.supplier} onChange={(e) => setProductForm({ ...productForm, supplier: e.target.value })} className="w-full h-[var(--btn-height)] px-3 text-sm border border-[var(--border)] rounded-lg bg-[var(--bg)] text-[var(--text)]">
                    <option value="">선택</option>
                    {mockSupplierMappings.map((s) => <option key={s.id} value={s.name}>{s.name}</option>)}
                  </select>
                </label>
                <label className="block">
                  <span className="text-xs text-[var(--text-secondary)] mb-1 block">카탈로그 번호</span>
                  <input value={productForm.catalogNo} onChange={(e) => setProductForm({ ...productForm, catalogNo: e.target.value })} className="w-full h-[var(--btn-height)] px-3 text-sm border border-[var(--border)] rounded-lg bg-[var(--bg)] text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-orange-500" />
                </label>
                <label className="block">
                  <span className="text-xs text-[var(--text-secondary)] mb-1 block">브랜드</span>
                  <input value={productForm.brand} onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })} className="w-full h-[var(--btn-height)] px-3 text-sm border border-[var(--border)] rounded-lg bg-[var(--bg)] text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-orange-500" />
                </label>
              </div>
            </fieldset>

            {/* 규격 관리 - with per-variant status */}
            <fieldset>
              <legend className="text-sm font-semibold text-[var(--text)] mb-3">규격 관리</legend>
              <div className="border border-[var(--border)] rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[var(--bg)] border-b border-[var(--border)]">
                      <th className="text-left px-3 py-2 text-xs font-semibold text-[var(--text-secondary)]">용량</th>
                      <th className="text-left px-3 py-2 text-xs font-semibold text-[var(--text-secondary)]">단위</th>
                      <th className="text-left px-3 py-2 text-xs font-semibold text-[var(--text-secondary)]">정가</th>
                      <th className="text-left px-3 py-2 text-xs font-semibold text-[var(--text-secondary)]">판매가</th>
                      <th className="text-left px-3 py-2 text-xs font-semibold text-[var(--text-secondary)]">재고</th>
                      <th className="text-center px-3 py-2 text-xs font-semibold text-[var(--text-secondary)]">당일출고</th>
                      <th className="text-left px-3 py-2 text-xs font-semibold text-[var(--text-secondary)]">상태</th>
                      <th className="w-10" />
                    </tr>
                  </thead>
                  <tbody>
                    {productForm.variants.map((v, i) => (
                      <tr key={i} className="border-b border-[var(--border)]">
                        <td className="px-2 py-1.5">
                          <input value={v.size} onChange={(e) => { const vs = [...productForm.variants]; vs[i] = { ...v, size: e.target.value }; setProductForm({ ...productForm, variants: vs }); }} className="w-full h-8 px-2 text-xs border border-[var(--border)] rounded bg-[var(--bg)] text-[var(--text)]" />
                        </td>
                        <td className="px-2 py-1.5">
                          <select value={v.unit} onChange={(e) => { const vs = [...productForm.variants]; vs[i] = { ...v, unit: e.target.value }; setProductForm({ ...productForm, variants: vs }); }} className="w-full h-8 px-2 text-xs border border-[var(--border)] rounded bg-[var(--bg)] text-[var(--text)]">
                            {['mL', 'L', 'g', 'kg', '매', '개', '장', 'ea'].map((u) => <option key={u} value={u}>{u}</option>)}
                          </select>
                        </td>
                        <td className="px-2 py-1.5">
                          <input type="number" value={v.listPrice || ''} onChange={(e) => { const vs = [...productForm.variants]; vs[i] = { ...v, listPrice: Number(e.target.value) }; setProductForm({ ...productForm, variants: vs }); }} className="w-full h-8 px-2 text-xs border border-[var(--border)] rounded bg-[var(--bg)] text-[var(--text)]" />
                        </td>
                        <td className="px-2 py-1.5">
                          <input type="number" value={v.salePrice || ''} onChange={(e) => { const vs = [...productForm.variants]; vs[i] = { ...v, salePrice: Number(e.target.value) }; setProductForm({ ...productForm, variants: vs }); }} className="w-full h-8 px-2 text-xs border border-[var(--border)] rounded bg-[var(--bg)] text-[var(--text)]" />
                        </td>
                        <td className="px-2 py-1.5">
                          <input type="number" value={v.stock || ''} onChange={(e) => { const vs = [...productForm.variants]; vs[i] = { ...v, stock: Number(e.target.value) }; setProductForm({ ...productForm, variants: vs }); }} className="w-full h-8 px-2 text-xs border border-[var(--border)] rounded bg-[var(--bg)] text-[var(--text)]" />
                        </td>
                        <td className="px-2 py-1.5 text-center">
                          <input type="checkbox" checked={v.sameDayShip} onChange={(e) => { const vs = [...productForm.variants]; vs[i] = { ...v, sameDayShip: e.target.checked }; setProductForm({ ...productForm, variants: vs }); }} className="accent-orange-600" />
                        </td>
                        <td className="px-2 py-1.5">
                          <select value={v.status} onChange={(e) => { const vs = [...productForm.variants]; vs[i] = { ...v, status: e.target.value as VariantStatus }; setProductForm({ ...productForm, variants: vs }); }} className="w-full h-8 px-2 text-xs border border-[var(--border)] rounded bg-[var(--bg)] text-[var(--text)]">
                            <option value="판매중">판매중</option>
                            <option value="일시품절">일시품절</option>
                            <option value="판매중단">판매중단</option>
                          </select>
                        </td>
                        <td className="px-2 py-1.5 text-center">
                          {productForm.variants.length > 1 && (
                            <button onClick={() => { const vs = productForm.variants.filter((_, idx) => idx !== i); setProductForm({ ...productForm, variants: vs }); }} className="text-[var(--text-secondary)] hover:text-red-500">
                              <Trash2 size={14} />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <button
                  onClick={() => setProductForm({ ...productForm, variants: [...productForm.variants, blankVariant()] })}
                  className="w-full py-2 text-xs font-medium text-orange-600 hover:bg-orange-50 transition-colors border-t border-[var(--border)]"
                >
                  + 규격 추가
                </button>
              </div>
            </fieldset>

            {/* Footer */}
            <div className="flex justify-end gap-3 pt-2 border-t border-[var(--border)]">
              <button onClick={closeModal} className="h-[var(--btn-height)] px-5 text-sm font-medium border border-[var(--border)] rounded-lg text-[var(--text)] hover:bg-gray-50 transition-colors">취소</button>
              <button onClick={saveProduct} className="h-[var(--btn-height)] px-5 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors">저장</button>
            </div>
          </div>
        </Modal>
      )}

      {/* --- Category Add/Edit Modal --- */}
      {activeModal === 'category-form' && (
        <Modal isOpen onClose={closeModal} title={modalData ? '카테고리 수정' : '카테고리 추가'} size="md">
          <div className="space-y-5">
            <label className="block">
              <span className="text-xs text-[var(--text-secondary)] mb-1 block">카테고리명 *</span>
              <input value={catForm.name} onChange={(e) => setCatForm({ ...catForm, name: e.target.value })} className="w-full h-[var(--btn-height)] px-3 text-sm border border-[var(--border)] rounded-lg bg-[var(--bg)] text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-orange-500" />
            </label>
            <label className="block">
              <span className="text-xs text-[var(--text-secondary)] mb-1 block">상위 카테고리</span>
              <select value={catForm.parentId || ''} onChange={(e) => setCatForm({ ...catForm, parentId: e.target.value || null })} className="w-full h-[var(--btn-height)] px-3 text-sm border border-[var(--border)] rounded-lg bg-[var(--bg)] text-[var(--text)]">
                <option value="">없음 (대분류)</option>
                {mainCats.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="text-xs text-[var(--text-secondary)] mb-1 block">설명</span>
              <textarea value={catForm.description} onChange={(e) => setCatForm({ ...catForm, description: e.target.value })} rows={3} className="w-full px-3 py-2 text-sm border border-[var(--border)] rounded-lg bg-[var(--bg)] text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none" />
            </label>
            <div>
              <span className="text-xs text-[var(--text-secondary)] mb-2 block">상태</span>
              <div className="flex items-center gap-4">
                {(['활성', '비활성'] as const).map((st) => (
                  <label key={st} className="flex items-center gap-2 text-sm text-[var(--text)] cursor-pointer">
                    <input type="radio" name="cat-status" checked={catForm.status === st} onChange={() => setCatForm({ ...catForm, status: st })} className="accent-orange-600" />
                    {st}
                  </label>
                ))}
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2 border-t border-[var(--border)]">
              <button onClick={closeModal} className="h-[var(--btn-height)] px-5 text-sm font-medium border border-[var(--border)] rounded-lg text-[var(--text)] hover:bg-gray-50 transition-colors">취소</button>
              <button onClick={saveCategory} className="h-[var(--btn-height)] px-5 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors">저장</button>
            </div>
          </div>
        </Modal>
      )}

      {/* --- Supplier Detail Modal --- */}
      {activeModal === 'supplier-detail' && modalData && (() => {
        const s = modalData as SupplierMapping;
        const supplierProducts = products.filter((p) => p.supplier === s.name);
        const syncHistory = [
          { date: '2026-03-20 06:00', status: '성공', duration: '2분 34초' },
          { date: '2026-03-19 06:00', status: '성공', duration: '2분 18초' },
          { date: '2026-03-18 06:00', status: '성공', duration: '3분 05초' },
          { date: '2026-03-17 06:00', status: '실패', duration: '-' },
          { date: '2026-03-16 06:00', status: '성공', duration: '2분 42초' },
        ];
        return (
          <Modal isOpen onClose={closeModal} title="공급사 상세" size="xl">
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center gap-3">
                <h3 className="text-xl font-bold text-[var(--text)]">{s.name}</h3>
                <StatusBadge status={s.syncStatus} />
              </div>

              {/* Info */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                {[
                  ['API URL', s.apiUrl],
                  ['연락처', s.contact],
                  ['최근 동기화', s.lastSync],
                  ['동기화 상태', s.syncStatus],
                ].map(([label, val]) => (
                  <div key={label as string} className="bg-[var(--bg)] rounded-lg p-3">
                    <p className="text-[var(--text-secondary)] text-xs mb-1">{label}</p>
                    <p className="font-medium text-[var(--text)] break-all">{val}</p>
                  </div>
                ))}
              </div>

              {/* Products mini table */}
              <div>
                <h4 className="text-sm font-semibold text-[var(--text)] mb-2">공급 제품 ({supplierProducts.length}개)</h4>
                <div className="border border-[var(--border)] rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-[var(--bg)] border-b border-[var(--border)]">
                        <th className="text-left px-4 py-2 font-semibold text-[var(--text-secondary)]">카탈로그 번호</th>
                        <th className="text-left px-4 py-2 font-semibold text-[var(--text-secondary)]">제품명</th>
                        <th className="text-right px-4 py-2 font-semibold text-[var(--text-secondary)]">최저가</th>
                        <th className="text-right px-4 py-2 font-semibold text-[var(--text-secondary)]">총 재고</th>
                      </tr>
                    </thead>
                    <tbody>
                      {supplierProducts.map((p) => (
                        <tr key={p.id} className="border-b border-[var(--border)] last:border-b-0">
                          <td className="px-4 py-2 font-mono text-xs text-orange-600">{p.catalogNo}</td>
                          <td className="px-4 py-2 text-[var(--text)]">{p.name}</td>
                          <td className="px-4 py-2 text-right text-[var(--text)]">{'\u20A9'}{fmt(minPrice(p))}</td>
                          <td className="px-4 py-2 text-right text-[var(--text)]">{fmt(p.variants.reduce((sum, v) => sum + v.stock, 0))}</td>
                        </tr>
                      ))}
                      {supplierProducts.length === 0 && (
                        <tr><td colSpan={4} className="text-center py-6 text-[var(--text-secondary)]">등록된 제품이 없습니다.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Sync history */}
              <div>
                <h4 className="text-sm font-semibold text-[var(--text)] mb-2">동기화 이력 (최근 5건)</h4>
                <div className="border border-[var(--border)] rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-[var(--bg)] border-b border-[var(--border)]">
                        <th className="text-left px-4 py-2 font-semibold text-[var(--text-secondary)]">일시</th>
                        <th className="text-left px-4 py-2 font-semibold text-[var(--text-secondary)]">상태</th>
                        <th className="text-left px-4 py-2 font-semibold text-[var(--text-secondary)]">소요 시간</th>
                      </tr>
                    </thead>
                    <tbody>
                      {syncHistory.map((h, i) => (
                        <tr key={i} className="border-b border-[var(--border)] last:border-b-0">
                          <td className="px-4 py-2 text-[var(--text)]">{h.date}</td>
                          <td className="px-4 py-2"><StatusBadge status={h.status} /></td>
                          <td className="px-4 py-2 text-[var(--text-secondary)]">{h.duration}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-end pt-2">
                <button onClick={() => { showToast('동기화 요청을 전송했습니다.'); }} className="h-[var(--btn-height)] px-5 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors flex items-center gap-2">
                  <RefreshCw size={16} /> 동기화 실행
                </button>
              </div>
            </div>
          </Modal>
        );
      })()}

      {/* ================================================================ */}
      {/* TOAST                                                             */}
      {/* ================================================================ */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-[60] bg-gray-900 text-white px-5 py-3 rounded-xl shadow-lg text-sm font-medium animate-in fade-in slide-in-from-bottom-4 duration-300">
          {toast}
        </div>
      )}
    </div>
  );
}
