'use client';

import { useState } from 'react';
import { FileText, Download, Building2, CreditCard, Search, CheckSquare, Printer } from 'lucide-react';
import { formatCurrency } from '@jinuchem/shared';

interface OrderDoc {
  id: string;
  orderNumber: string;
  products: string;
  items: { name: string; catalogNo: string; supplier: string; size: string; qty: number; unitPrice: number }[];
  totalAmount: number;
  orderedAt: string;
  status: string;
}

const sampleOrderDocs: OrderDoc[] = [
  { id: '1', orderNumber: 'ORD-20260317-001', products: 'Ethyl alcohol, Pure 500mL 외 2건', totalAmount: 598830, orderedAt: '2026-03-17', status: '배송중',
    items: [
      { name: 'Ethyl alcohol, Pure', catalogNo: '459844', supplier: 'Sigma-Aldrich', size: '500mL', qty: 2, unitPrice: 142415 },
      { name: 'Acetone, ACS Grade', catalogNo: 'A0003', supplier: 'TCI', size: '2.5L', qty: 1, unitPrice: 87800 },
      { name: 'PIPES, 고순도', catalogNo: 'P0058', supplier: 'TCI', size: '5G', qty: 1, unitPrice: 226200 },
    ] },
  { id: '2', orderNumber: 'ORD-20260315-003', products: 'Acetone, ACS Grade 2.5L', totalAmount: 96580, orderedAt: '2026-03-15', status: '배송완료',
    items: [{ name: 'Acetone, ACS Grade', catalogNo: 'A0003', supplier: 'TCI', size: '2.5L', qty: 1, unitPrice: 87800 }] },
  { id: '3', orderNumber: 'ORD-20260312-002', products: 'PIPES, 고순도 5G', totalAmount: 248820, orderedAt: '2026-03-12', status: '배송완료',
    items: [{ name: 'PIPES, 고순도', catalogNo: 'P0058', supplier: 'TCI', size: '5G', qty: 1, unitPrice: 226200 }] },
  { id: '4', orderNumber: 'ORD-20260310-001', products: 'Methanol, HPLC Grade 4L', totalAmount: 175890, orderedAt: '2026-03-10', status: '배송완료',
    items: [{ name: 'Methanol, HPLC Grade', catalogNo: '322415', supplier: 'Sigma-Aldrich', size: '4L', qty: 2, unitPrice: 88650 }] },
  { id: '5', orderNumber: 'ORD-20260305-004', products: 'Sodium Hydroxide 1kg', totalAmount: 98670, orderedAt: '2026-03-05', status: '배송완료',
    items: [{ name: 'Sodium Hydroxide', catalogNo: 'S5881', supplier: 'Sigma-Aldrich', size: '1kg', qty: 1, unitPrice: 89700 }] },
];

type DocType = 'estimate' | 'transaction' | 'delivery';

const DOC_TITLES: Record<DocType, string> = {
  estimate: '견 적 서',
  transaction: '거 래 명 세 서',
  delivery: '납 품 확 인 서',
};

export default function DocumentsPage() {
  const [period, setPeriod] = useState('1m');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [previewDoc, setPreviewDoc] = useState<{ type: DocType; orders: OrderDoc[] } | null>(null);

  const filtered = sampleOrderDocs.filter((o) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return o.orderNumber.toLowerCase().includes(q) || o.products.toLowerCase().includes(q);
    }
    return true;
  });

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]);
  };

  const toggleAll = () => {
    setSelectedIds(selectedIds.length === filtered.length ? [] : filtered.map((o) => o.id));
  };

  const handleIssue = (type: DocType) => {
    if (selectedIds.length === 0) { alert('주문을 선택해주세요'); return; }
    const orders = sampleOrderDocs.filter((o) => selectedIds.includes(o.id));
    setPreviewDoc({ type, orders });
  };

  const printDocument = () => {
    if (!previewDoc) return;
    const { type, orders } = previewDoc;
    const today = new Date().toLocaleDateString('ko-KR');
    const docNo = `DOC-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;

    const allItems = orders.flatMap((o) => o.items.map((item) => ({ ...item, orderNumber: o.orderNumber })));
    const subtotal = allItems.reduce((s, i) => s + i.unitPrice * i.qty, 0);
    const vat = Math.round(subtotal * 0.1);
    const total = subtotal + vat;

    const extraFields: Record<DocType, string> = {
      estimate: `<tr><td style="border:1px solid #ddd;padding:8px;background:#f8f9fa;font-weight:600;width:120px;">유효기간</td><td style="border:1px solid #ddd;padding:8px;">발행일로부터 30일</td><td style="border:1px solid #ddd;padding:8px;background:#f8f9fa;font-weight:600;width:120px;">결제조건</td><td style="border:1px solid #ddd;padding:8px;">납품 후 30일 이내</td></tr>`,
      transaction: `<tr><td style="border:1px solid #ddd;padding:8px;background:#f8f9fa;font-weight:600;width:120px;">거래일자</td><td style="border:1px solid #ddd;padding:8px;">${today}</td><td style="border:1px solid #ddd;padding:8px;background:#f8f9fa;font-weight:600;width:120px;">거래유형</td><td style="border:1px solid #ddd;padding:8px;">매출</td></tr>`,
      delivery: `<tr><td style="border:1px solid #ddd;padding:8px;background:#f8f9fa;font-weight:600;width:120px;">납품일자</td><td style="border:1px solid #ddd;padding:8px;">${today}</td><td style="border:1px solid #ddd;padding:8px;background:#f8f9fa;font-weight:600;width:120px;">납품장소</td><td style="border:1px solid #ddd;padding:8px;">경상국립대학교 화학과</td></tr>`,
    };

    const rows = allItems.map((item, i) => `
      <tr>
        <td style="border:1px solid #ddd;padding:8px;text-align:center;">${i + 1}</td>
        <td style="border:1px solid #ddd;padding:8px;">${item.name}</td>
        <td style="border:1px solid #ddd;padding:8px;text-align:center;">${item.catalogNo}</td>
        <td style="border:1px solid #ddd;padding:8px;text-align:center;">${item.supplier}</td>
        <td style="border:1px solid #ddd;padding:8px;text-align:center;">${item.size}</td>
        <td style="border:1px solid #ddd;padding:8px;text-align:right;">${item.unitPrice.toLocaleString('ko-KR')}</td>
        <td style="border:1px solid #ddd;padding:8px;text-align:center;">${item.qty}</td>
        <td style="border:1px solid #ddd;padding:8px;text-align:right;">${(item.unitPrice * item.qty).toLocaleString('ko-KR')}</td>
      </tr>`).join('');

    const stampSection = type === 'delivery' ? `
      <div style="display:flex;justify-content:space-between;margin-top:40px;">
        <div style="text-align:center;width:45%;">
          <p style="font-size:14px;font-weight:600;margin-bottom:40px;">공 급 자</p>
          <div style="border-top:1px solid #333;padding-top:8px;">
            <p style="font-size:13px;">(주)지누켐</p>
            <p style="font-size:12px;color:#666;">대표이사 김병선 (인)</p>
          </div>
        </div>
        <div style="text-align:center;width:45%;">
          <p style="font-size:14px;font-weight:600;margin-bottom:40px;">인 수 자</p>
          <div style="border-top:1px solid #333;padding-top:8px;">
            <p style="font-size:13px;">경상국립대학교 화학과</p>
            <p style="font-size:12px;color:#666;">(인)</p>
          </div>
        </div>
      </div>` : '';

    const pw = window.open('', '_blank', 'width=900,height=700');
    if (!pw) return;

    pw.document.write(`<!DOCTYPE html><html><head><title>${DOC_TITLES[type]} - ${docNo}</title>
<style>
  body{font-family:'Noto Sans KR',sans-serif;padding:40px;color:#333;max-width:800px;margin:0 auto;}
  h1{text-align:center;font-size:26px;margin-bottom:4px;letter-spacing:8px;}
  .subtitle{text-align:center;color:#666;font-size:13px;margin-bottom:24px;}
  table{width:100%;border-collapse:collapse;margin:16px 0;}
  th{background:#f0f4f8;border:1px solid #ddd;padding:10px;font-size:12px;font-weight:600;}
  td{font-size:12px;}
  .info-table td{font-size:13px;}
  .summary{margin-top:16px;text-align:right;}
  .summary div{font-size:13px;margin:4px 0;}
  .summary .total{font-size:18px;font-weight:bold;color:#1e40af;margin-top:8px;}
  .footer{text-align:center;font-size:11px;color:#999;margin-top:40px;padding-top:16px;border-top:1px solid #eee;}
  @media print{body{padding:20px;} .no-print{display:none;}}
</style></head><body>
  <h1>${DOC_TITLES[type]}</h1>
  <p class="subtitle">문서번호: ${docNo}</p>
  <hr style="border:none;border-top:2px solid #1e40af;margin-bottom:24px;"/>

  <table class="info-table" style="margin-bottom:24px;">
    <tr>
      <td style="border:1px solid #ddd;padding:8px;background:#f8f9fa;font-weight:600;width:120px;">문서번호</td>
      <td style="border:1px solid #ddd;padding:8px;">${docNo}</td>
      <td style="border:1px solid #ddd;padding:8px;background:#f8f9fa;font-weight:600;width:120px;">발행일자</td>
      <td style="border:1px solid #ddd;padding:8px;">${today}</td>
    </tr>
    ${extraFields[type]}
    <tr>
      <td style="border:1px solid #ddd;padding:8px;background:#f8f9fa;font-weight:600;">공급자</td>
      <td style="border:1px solid #ddd;padding:8px;">(주)지누켐 | 사업자번호: 470-81-02870</td>
      <td style="border:1px solid #ddd;padding:8px;background:#f8f9fa;font-weight:600;">대표자</td>
      <td style="border:1px solid #ddd;padding:8px;">김병선</td>
    </tr>
    <tr>
      <td style="border:1px solid #ddd;padding:8px;background:#f8f9fa;font-weight:600;">주소</td>
      <td colspan="3" style="border:1px solid #ddd;padding:8px;">경상남도 진주시 진주대로501, 창업보육센터 C동 214호</td>
    </tr>
    <tr>
      <td style="border:1px solid #ddd;padding:8px;background:#f8f9fa;font-weight:600;">공급받는자</td>
      <td style="border:1px solid #ddd;padding:8px;">경상국립대학교 산학협력단</td>
      <td style="border:1px solid #ddd;padding:8px;background:#f8f9fa;font-weight:600;">담당자</td>
      <td style="border:1px solid #ddd;padding:8px;">김연구</td>
    </tr>
  </table>

  <table>
    <thead><tr>
      <th style="width:35px;">No.</th><th>제품명</th><th style="width:85px;">카탈로그번호</th>
      <th style="width:90px;">공급사</th><th style="width:60px;">용량</th>
      <th style="width:80px;">단가(원)</th><th style="width:40px;">수량</th><th style="width:90px;">금액(원)</th>
    </tr></thead>
    <tbody>${rows}</tbody>
  </table>

  <div class="summary">
    <div>공급가액: ${subtotal.toLocaleString('ko-KR')}원</div>
    <div>부가세(10%): ${vat.toLocaleString('ko-KR')}원</div>
    <div class="total">합계금액: ${total.toLocaleString('ko-KR')}원</div>
  </div>

  ${stampSection}

  <p class="footer">본 문서는 JINU Shop(jinuchem.com)에서 전자 발행되었습니다.<br/>문의: 010-5651-1053 | jinuchem.reagent@gmail.com</p>
  <script>window.onload=function(){window.print();}</script>
</body></html>`);
    pw.document.close();
    setPreviewDoc(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[var(--text)]">증빙서류</h1>
      </div>

      {/* Period Filters */}
      <div className="flex items-center gap-3 mb-6">
        {['1w', '1m', '3m', '6m'].map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`h-[38px] px-4 text-sm rounded-lg border transition-colors ${
              period === p ? 'bg-blue-600 text-white border-blue-600' : 'border-[var(--border)] text-[var(--text)] hover:border-blue-400'
            }`}
          >
            {p === '1w' ? '1주일' : p === '1m' ? '1개월' : p === '3m' ? '3개월' : '6개월'}
          </button>
        ))}
        <input type="date" defaultValue="2026-01-01" className="h-[38px] px-3 border border-[var(--border)] rounded-lg text-sm bg-[var(--bg-card)] text-[var(--text)]" />
        <span className="text-[var(--text-secondary)]">~</span>
        <input type="date" defaultValue="2026-03-20" className="h-[38px] px-3 border border-[var(--border)] rounded-lg text-sm bg-[var(--bg-card)] text-[var(--text)]" />
        <button className="h-[38px] px-5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 flex items-center gap-1.5">
          <Search size={14} /> 조회
        </button>
      </div>

      {/* Order List */}
      <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border)] overflow-hidden mb-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-[var(--border)]">
              <th className="w-[40px] px-4 py-3">
                <input type="checkbox" checked={selectedIds.length === filtered.length && filtered.length > 0} onChange={toggleAll} className="accent-blue-600" />
              </th>
              <th className="text-left px-4 py-3 font-medium text-[var(--text-secondary)]">주문번호</th>
              <th className="text-left px-4 py-3 font-medium text-[var(--text-secondary)]">제품</th>
              <th className="text-right px-4 py-3 font-medium text-[var(--text-secondary)]">금액</th>
              <th className="text-center px-4 py-3 font-medium text-[var(--text-secondary)]">주문일</th>
              <th className="text-center px-4 py-3 font-medium text-[var(--text-secondary)]">상태</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((order) => (
              <tr key={order.id} className={`border-b border-[var(--border)] last:border-0 hover:bg-gray-50 cursor-pointer ${selectedIds.includes(order.id) ? 'bg-blue-50' : ''}`} onClick={() => toggleSelect(order.id)}>
                <td className="px-4 py-3"><input type="checkbox" checked={selectedIds.includes(order.id)} onChange={() => toggleSelect(order.id)} className="accent-blue-600" onClick={(e) => e.stopPropagation()} /></td>
                <td className="px-4 py-3 font-mono text-xs text-[var(--text)]">{order.orderNumber}</td>
                <td className="px-4 py-3 text-[var(--text)]">{order.products}</td>
                <td className="px-4 py-3 text-right font-medium text-[var(--text)]">{formatCurrency(order.totalAmount)}</td>
                <td className="px-4 py-3 text-center text-[var(--text-secondary)]">{order.orderedAt}</td>
                <td className="px-4 py-3 text-center"><span className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">{order.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Issue Documents Section */}
      <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border)] p-5">
        <div className="flex items-center gap-2 mb-4">
          <CheckSquare size={16} className="text-blue-600" />
          <h2 className="text-base font-semibold text-[var(--text)]">
            선택 항목 증빙서류 발급
            {selectedIds.length > 0 && (
              <span className="ml-2 text-sm font-normal text-blue-600">({selectedIds.length}건 선택)</span>
            )}
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-[var(--text-secondary)] mb-3">거래 증빙서류</p>
            <div className="flex gap-2">
              <button onClick={() => handleIssue('estimate')} className="h-[38px] px-4 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 flex items-center gap-1.5">
                <FileText size={14} /> 견적서
              </button>
              <button onClick={() => handleIssue('transaction')} className="h-[38px] px-4 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 flex items-center gap-1.5">
                <FileText size={14} /> 거래명세서
              </button>
              <button onClick={() => handleIssue('delivery')} className="h-[38px] px-4 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 flex items-center gap-1.5">
                <FileText size={14} /> 납품확인서
              </button>
            </div>
          </div>
          <div>
            <p className="text-sm text-[var(--text-secondary)] mb-3">회사 서류</p>
            <div className="flex gap-2">
              <button className="h-[38px] px-4 border border-[var(--border)] text-[var(--text)] text-sm rounded-lg hover:border-blue-400 flex items-center gap-1.5">
                <Building2 size={14} /> 사업자등록증
              </button>
              <button className="h-[38px] px-4 border border-[var(--border)] text-[var(--text)] text-sm rounded-lg hover:border-blue-400 flex items-center gap-1.5">
                <CreditCard size={14} /> 통장사본
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setPreviewDoc(null)}>
          <div className="bg-[var(--bg-card)] rounded-2xl w-[700px] max-h-[85vh] overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-[var(--text)]">{DOC_TITLES[previewDoc.type]} 미리보기</h2>
              <button onClick={() => setPreviewDoc(null)} className="text-[var(--text-secondary)] hover:text-[var(--text)] text-xl">&times;</button>
            </div>

            {/* Preview Content */}
            <div className="border border-[var(--border)] rounded-xl p-5 mb-4">
              <h3 className="text-center text-xl font-bold text-[var(--text)] mb-1 tracking-[6px]">{DOC_TITLES[previewDoc.type]}</h3>
              <p className="text-center text-xs text-[var(--text-secondary)] mb-4">(주)지누켐</p>

              <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                <div><span className="text-[var(--text-secondary)]">발행일자:</span> <span className="text-[var(--text)]">{new Date().toLocaleDateString('ko-KR')}</span></div>
                <div><span className="text-[var(--text-secondary)]">공급받는자:</span> <span className="text-[var(--text)]">경상국립대학교 산학협력단</span></div>
              </div>

              <table className="w-full text-xs border-collapse mb-4">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-[var(--border)] px-2 py-2 w-[30px]">No.</th>
                    <th className="border border-[var(--border)] px-2 py-2 text-left">제품명</th>
                    <th className="border border-[var(--border)] px-2 py-2 w-[70px]">공급사</th>
                    <th className="border border-[var(--border)] px-2 py-2 w-[50px]">용량</th>
                    <th className="border border-[var(--border)] px-2 py-2 w-[70px] text-right">단가</th>
                    <th className="border border-[var(--border)] px-2 py-2 w-[35px]">수량</th>
                    <th className="border border-[var(--border)] px-2 py-2 w-[80px] text-right">금액</th>
                  </tr>
                </thead>
                <tbody>
                  {previewDoc.orders.flatMap((o) => o.items).map((item, i) => (
                    <tr key={i}>
                      <td className="border border-[var(--border)] px-2 py-1.5 text-center text-[var(--text)]">{i + 1}</td>
                      <td className="border border-[var(--border)] px-2 py-1.5 text-[var(--text)]">{item.name}</td>
                      <td className="border border-[var(--border)] px-2 py-1.5 text-center text-[var(--text)]">{item.supplier}</td>
                      <td className="border border-[var(--border)] px-2 py-1.5 text-center text-[var(--text)]">{item.size}</td>
                      <td className="border border-[var(--border)] px-2 py-1.5 text-right text-[var(--text)]">{formatCurrency(item.unitPrice)}</td>
                      <td className="border border-[var(--border)] px-2 py-1.5 text-center text-[var(--text)]">{item.qty}</td>
                      <td className="border border-[var(--border)] px-2 py-1.5 text-right font-medium text-[var(--text)]">{formatCurrency(item.unitPrice * item.qty)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {(() => {
                const allItems = previewDoc.orders.flatMap((o) => o.items);
                const sub = allItems.reduce((s, i) => s + i.unitPrice * i.qty, 0);
                const v = Math.round(sub * 0.1);
                return (
                  <div className="text-right space-y-1 text-sm">
                    <p className="text-[var(--text-secondary)]">공급가액: {formatCurrency(sub)}</p>
                    <p className="text-[var(--text-secondary)]">부가세(10%): {formatCurrency(v)}</p>
                    <p className="text-lg font-bold text-blue-600">합계: {formatCurrency(sub + v)}</p>
                  </div>
                );
              })()}
            </div>

            <div className="flex gap-3">
              <button onClick={() => setPreviewDoc(null)} className="flex-1 h-[38px] border border-[var(--border)] text-sm text-[var(--text)] rounded-lg hover:bg-gray-50">
                닫기
              </button>
              <button onClick={printDocument} className="flex-1 h-[38px] bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 flex items-center justify-center gap-1.5">
                <Printer size={14} /> 인쇄하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
