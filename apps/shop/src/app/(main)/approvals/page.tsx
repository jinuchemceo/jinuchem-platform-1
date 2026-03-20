'use client';

import { useState } from 'react';
import { Clock, Search, Eye, ShieldCheck, CreditCard, FileText, Building2, ChevronDown } from 'lucide-react';
import { formatCurrency } from '@jinuchem/shared';

interface ApprovalItem {
  id: string;
  orderNumber: string;
  products: string;
  itemCount: number;
  totalAmount: number;
  requester: string;
  department: string;
  requestedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  note?: string;
}

const sampleApprovals: ApprovalItem[] = [
  {
    id: '1',
    orderNumber: 'ORD-20260319-001',
    products: 'Ethyl alcohol, Pure 500mL',
    itemCount: 3,
    totalAmount: 598830,
    requester: '김연구',
    department: '유기화학실험실',
    requestedAt: '2026-03-19',
    status: 'pending',
  },
  {
    id: '2',
    orderNumber: 'ORD-20260318-002',
    products: 'Methanol, HPLC Grade 4L',
    itemCount: 2,
    totalAmount: 177300,
    requester: '이분석',
    department: '분석화학실험실',
    requestedAt: '2026-03-18',
    status: 'pending',
  },
  {
    id: '3',
    orderNumber: 'ORD-20260317-003',
    products: 'PIPES, 고순도 25G',
    itemCount: 1,
    totalAmount: 503100,
    requester: '박실험',
    department: '생화학실험실',
    requestedAt: '2026-03-17',
    status: 'approved',
    note: '긴급 실험 건으로 승인',
  },
  {
    id: '4',
    orderNumber: 'ORD-20260316-001',
    products: 'Toluene 1L',
    itemCount: 1,
    totalAmount: 58860,
    requester: '최화학',
    department: '유기화학실험실',
    requestedAt: '2026-03-16',
    status: 'pending',
  },
];

type PaymentMethod = 'card' | 'tax_invoice' | 'bank_transfer';

const statusColors: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-700',
  approved: 'bg-emerald-100 text-emerald-700',
  rejected: 'bg-red-100 text-red-700',
};

const statusLabels: Record<string, string> = {
  pending: '대기',
  approved: '결제완료',
  rejected: '거절',
};

export default function ApprovalsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<ApprovalItem | null>(null);
  const [approvals, setApprovals] = useState(sampleApprovals);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [toast, setToast] = useState<string | null>(null);

  // Card inputs
  const [cardNumber, setCardNumber] = useState(['', '', '', '']);
  // Tax invoice
  const [bizRegNo, setBizRegNo] = useState('');
  // Bank transfer
  const [selectedBank, setSelectedBank] = useState('');
  const [accountNo, setAccountNo] = useState('');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const pendingItems = approvals.filter((a) => a.status === 'pending');
  const completedItems = approvals.filter((a) => a.status !== 'pending');

  const filtered = pendingItems.filter((a) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      a.orderNumber.toLowerCase().includes(q) ||
      a.products.toLowerCase().includes(q) ||
      a.requester.includes(q)
    );
  });

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (filtered.every((a) => selectedIds.has(a.id))) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filtered.map((a) => a.id)));
    }
  };

  const selectedTotal = approvals
    .filter((a) => selectedIds.has(a.id))
    .reduce((sum, a) => sum + a.totalAmount, 0);

  const selectedVat = Math.round(selectedTotal * 0.1);
  const selectedGrandTotal = selectedTotal + selectedVat;

  const handlePayment = () => {
    if (selectedIds.size === 0) {
      showToast('결제할 주문을 선택해주세요.');
      return;
    }

    // Validate payment method inputs
    if (paymentMethod === 'card') {
      if (cardNumber.some((n) => n.length < 4)) {
        showToast('카드번호를 정확히 입력해주세요.');
        return;
      }
    } else if (paymentMethod === 'tax_invoice') {
      if (bizRegNo.length < 10) {
        showToast('사업자등록번호를 정확히 입력해주세요.');
        return;
      }
    } else if (paymentMethod === 'bank_transfer') {
      if (!selectedBank || !accountNo) {
        showToast('은행 및 계좌번호를 입력해주세요.');
        return;
      }
    }

    setApprovals((prev) =>
      prev.map((a) =>
        selectedIds.has(a.id) ? { ...a, status: 'approved' as const, note: '결제 완료' } : a
      )
    );
    setSelectedIds(new Set());
    showToast(`${selectedIds.size}건 결제가 완료되었습니다.`);
  };

  const updateCardNumber = (index: number, value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 4);
    setCardNumber((prev) => {
      const next = [...prev];
      next[index] = digits;
      return next;
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[var(--text)]">결제하기</h1>
        <span className="text-sm text-[var(--text-secondary)]">
          결제 대기 {pendingItems.length}건
        </span>
      </div>

      {/* Search */}
      <div className="flex items-center gap-3 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="주문번호/제품/요청자 검색"
            className="w-full h-[38px] pl-9 pr-4 border border-[var(--border)] rounded-lg text-sm bg-[var(--bg-card)] text-[var(--text)]"
          />
        </div>
        {selectedIds.size > 0 && (
          <span className="text-sm text-blue-600 font-medium">
            {selectedIds.size}건 선택됨 | 합계: {formatCurrency(selectedGrandTotal)}
          </span>
        )}
      </div>

      {/* Pending Orders Table */}
      <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border)] overflow-hidden mb-6">
        <div className="px-4 py-3 border-b border-[var(--border)] bg-gray-50">
          <h3 className="text-sm font-semibold text-[var(--text)] flex items-center gap-2">
            <Clock size={14} />
            결제 대기 주문
          </h3>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--border)]">
              <th className="w-[50px] px-4 py-3">
                <input
                  type="checkbox"
                  checked={filtered.length > 0 && filtered.every((a) => selectedIds.has(a.id))}
                  onChange={toggleSelectAll}
                  className="accent-blue-600"
                />
              </th>
              <th className="text-left px-4 py-3 font-medium text-[var(--text-secondary)]">주문번호</th>
              <th className="text-left px-4 py-3 font-medium text-[var(--text-secondary)]">제품</th>
              <th className="text-right px-4 py-3 font-medium text-[var(--text-secondary)]">금액</th>
              <th className="text-center px-4 py-3 font-medium text-[var(--text-secondary)]">요청자</th>
              <th className="text-center px-4 py-3 font-medium text-[var(--text-secondary)]">부서</th>
              <th className="text-center px-4 py-3 font-medium text-[var(--text-secondary)]">요청일</th>
              <th className="text-center px-4 py-3 font-medium text-[var(--text-secondary)]">상태</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item) => (
              <tr
                key={item.id}
                className={`border-b border-[var(--border)] last:border-0 hover:bg-gray-50 transition-colors ${
                  selectedIds.has(item.id) ? 'bg-blue-50/30' : ''
                }`}
              >
                <td className="px-4 py-3 text-center">
                  <input
                    type="checkbox"
                    checked={selectedIds.has(item.id)}
                    onChange={() => toggleSelect(item.id)}
                    className="accent-blue-600"
                  />
                </td>
                <td className="px-4 py-3 font-mono text-xs text-[var(--text)]">{item.orderNumber}</td>
                <td className="px-4 py-3">
                  <span className="text-[var(--text)]">{item.products}</span>
                  {item.itemCount > 1 && (
                    <span className="text-[var(--text-secondary)] ml-1">외 {item.itemCount - 1}건</span>
                  )}
                </td>
                <td className="px-4 py-3 text-right font-medium text-[var(--text)]">
                  {formatCurrency(item.totalAmount)}
                </td>
                <td className="px-4 py-3 text-center text-[var(--text)]">{item.requester}</td>
                <td className="px-4 py-3 text-center text-[var(--text-secondary)]">{item.department}</td>
                <td className="px-4 py-3 text-center text-[var(--text-secondary)]">{item.requestedAt}</td>
                <td className="px-4 py-3 text-center">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[item.status]}`}>
                    {statusLabels[item.status]}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-[var(--text-secondary)]">
            <ShieldCheck size={40} className="mx-auto mb-3 opacity-30" />
            <p>결제 대기 중인 주문이 없습니다</p>
          </div>
        )}
      </div>

      {/* Payment Method Section */}
      <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border)] p-6 mb-6">
        <h3 className="text-base font-semibold text-[var(--text)] mb-5 flex items-center gap-2">
          <CreditCard size={18} />
          결제 수단 선택
        </h3>

        {/* Payment Method Radio */}
        <div className="flex gap-4 mb-6">
          <label
            className={`flex-1 flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-colors ${
              paymentMethod === 'card'
                ? 'border-blue-600 bg-blue-50'
                : 'border-[var(--border)] hover:border-gray-300'
            }`}
          >
            <input
              type="radio"
              name="paymentMethod"
              value="card"
              checked={paymentMethod === 'card'}
              onChange={() => setPaymentMethod('card')}
              className="accent-blue-600"
            />
            <div>
              <CreditCard size={18} className={paymentMethod === 'card' ? 'text-blue-600' : 'text-[var(--text-secondary)]'} />
            </div>
            <span className={`text-sm font-medium ${paymentMethod === 'card' ? 'text-blue-600' : 'text-[var(--text)]'}`}>
              카드결제
            </span>
          </label>

          <label
            className={`flex-1 flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-colors ${
              paymentMethod === 'tax_invoice'
                ? 'border-blue-600 bg-blue-50'
                : 'border-[var(--border)] hover:border-gray-300'
            }`}
          >
            <input
              type="radio"
              name="paymentMethod"
              value="tax_invoice"
              checked={paymentMethod === 'tax_invoice'}
              onChange={() => setPaymentMethod('tax_invoice')}
              className="accent-blue-600"
            />
            <div>
              <FileText size={18} className={paymentMethod === 'tax_invoice' ? 'text-blue-600' : 'text-[var(--text-secondary)]'} />
            </div>
            <span className={`text-sm font-medium ${paymentMethod === 'tax_invoice' ? 'text-blue-600' : 'text-[var(--text)]'}`}>
              세금계산서 발행
            </span>
          </label>

          <label
            className={`flex-1 flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-colors ${
              paymentMethod === 'bank_transfer'
                ? 'border-blue-600 bg-blue-50'
                : 'border-[var(--border)] hover:border-gray-300'
            }`}
          >
            <input
              type="radio"
              name="paymentMethod"
              value="bank_transfer"
              checked={paymentMethod === 'bank_transfer'}
              onChange={() => setPaymentMethod('bank_transfer')}
              className="accent-blue-600"
            />
            <div>
              <Building2 size={18} className={paymentMethod === 'bank_transfer' ? 'text-blue-600' : 'text-[var(--text-secondary)]'} />
            </div>
            <span className={`text-sm font-medium ${paymentMethod === 'bank_transfer' ? 'text-blue-600' : 'text-[var(--text)]'}`}>
              계좌이체
            </span>
          </label>
        </div>

        {/* Payment Details */}
        <div className="bg-[var(--bg)] rounded-xl p-5 mb-5">
          {paymentMethod === 'card' && (
            <div>
              <label className="block text-sm font-medium text-[var(--text)] mb-3">카드번호</label>
              <div className="flex gap-2 items-center">
                {cardNumber.map((num, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={num}
                      onChange={(e) => updateCardNumber(i, e.target.value)}
                      maxLength={4}
                      placeholder="0000"
                      className={`w-[80px] h-[38px] px-3 text-center border border-[var(--border)] rounded-lg text-sm bg-[var(--bg-card)] text-[var(--text)] ${
                        i >= 1 && i <= 2 ? 'tracking-[0.3em]' : ''
                      }`}
                      style={i >= 1 && i <= 2 ? { WebkitTextSecurity: 'disc' } as React.CSSProperties : {}}
                    />
                    {i < 3 && <span className="text-[var(--text-secondary)]">-</span>}
                  </div>
                ))}
              </div>
              <p className="text-xs text-[var(--text-secondary)] mt-2">연구비카드 (온라인 상거래 플랫폼 연동 예정) / 법인카드 / 개인카드 모두 가능합니다</p>
            </div>
          )}

          {paymentMethod === 'tax_invoice' && (
            <div>
              <label className="block text-sm font-medium text-[var(--text)] mb-3">사업자등록번호</label>
              <input
                type="text"
                value={bizRegNo}
                onChange={(e) => setBizRegNo(e.target.value.replace(/\D/g, '').slice(0, 10))}
                placeholder="사업자등록번호 10자리"
                className="w-[300px] h-[38px] px-4 border border-[var(--border)] rounded-lg text-sm bg-[var(--bg-card)] text-[var(--text)]"
              />
              <p className="text-xs text-[var(--text-secondary)] mt-2">세금계산서는 결제 후 3영업일 이내에 발행됩니다</p>
            </div>
          )}

          {paymentMethod === 'bank_transfer' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--text)] mb-2">은행 선택</label>
                <select
                  value={selectedBank}
                  onChange={(e) => setSelectedBank(e.target.value)}
                  className="w-[200px] h-[38px] px-3 border border-[var(--border)] rounded-lg text-sm bg-[var(--bg-card)] text-[var(--text)]"
                >
                  <option value="">은행 선택</option>
                  <option value="kookmin">국민은행</option>
                  <option value="shinhan">신한은행</option>
                  <option value="woori">우리은행</option>
                  <option value="hana">하나은행</option>
                  <option value="nonghyup">농협</option>
                  <option value="ibk">기업은행</option>
                  <option value="sc">SC제일은행</option>
                  <option value="daegu">대구은행</option>
                  <option value="busan">부산은행</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text)] mb-2">계좌번호</label>
                <input
                  type="text"
                  value={accountNo}
                  onChange={(e) => setAccountNo(e.target.value.replace(/\D/g, ''))}
                  placeholder="계좌번호 입력 (숫자만)"
                  className="w-[300px] h-[38px] px-4 border border-[var(--border)] rounded-lg text-sm bg-[var(--bg-card)] text-[var(--text)]"
                />
              </div>
              <p className="text-xs text-[var(--text-secondary)]">입금 확인까지 1~2영업일이 소요될 수 있습니다</p>
            </div>
          )}
        </div>

        {/* Summary + Pay Button */}
        {selectedIds.size > 0 && (
          <div className="flex items-center justify-between pt-4 border-t border-[var(--border)]">
            <div className="text-sm text-[var(--text-secondary)]">
              선택 {selectedIds.size}건
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-xs text-[var(--text-secondary)]">소계: {formatCurrency(selectedTotal)}</p>
                <p className="text-xs text-[var(--text-secondary)]">VAT: {formatCurrency(selectedVat)}</p>
                <p className="text-lg font-bold text-blue-600">총 {formatCurrency(selectedGrandTotal)}</p>
              </div>
              <button
                onClick={handlePayment}
                className="h-[42px] px-8 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <CreditCard size={16} />
                결제하기
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Completed Orders */}
      {completedItems.length > 0 && (
        <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border)] overflow-hidden">
          <div className="px-4 py-3 border-b border-[var(--border)] bg-gray-50">
            <h3 className="text-sm font-semibold text-[var(--text)]">결제 완료/거절 내역</h3>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th className="text-left px-4 py-3 font-medium text-[var(--text-secondary)]">주문번호</th>
                <th className="text-left px-4 py-3 font-medium text-[var(--text-secondary)]">제품</th>
                <th className="text-right px-4 py-3 font-medium text-[var(--text-secondary)]">금액</th>
                <th className="text-center px-4 py-3 font-medium text-[var(--text-secondary)]">요청자</th>
                <th className="text-center px-4 py-3 font-medium text-[var(--text-secondary)]">상태</th>
                <th className="text-center px-4 py-3 font-medium text-[var(--text-secondary)]">비고</th>
              </tr>
            </thead>
            <tbody>
              {completedItems.map((item) => (
                <tr key={item.id} className="border-b border-[var(--border)] last:border-0">
                  <td className="px-4 py-3 font-mono text-xs">
                    <button
                      onClick={() => setSelectedItem(item)}
                      className="text-blue-600 hover:underline font-medium"
                    >
                      {item.orderNumber}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-[var(--text)]">{item.products}</td>
                  <td className="px-4 py-3 text-right font-medium text-[var(--text)]">{formatCurrency(item.totalAmount)}</td>
                  <td className="px-4 py-3 text-center text-[var(--text)]">{item.requester}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[item.status]}`}>
                      {statusLabels[item.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center text-xs text-[var(--text-secondary)]">{item.note || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center" onClick={() => setSelectedItem(null)}>
          <div className="bg-[var(--bg-card)] rounded-2xl w-[600px] max-h-[80vh] overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-[var(--text)]">주문 상세</h2>
              <button onClick={() => setSelectedItem(null)} className="text-[var(--text-secondary)] hover:text-[var(--text)] text-xl">&times;</button>
            </div>
            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div><span className="text-[var(--text-secondary)]">주문번호</span><p className="font-mono font-medium text-[var(--text)]">{selectedItem.orderNumber}</p></div>
                <div><span className="text-[var(--text-secondary)]">요청자</span><p className="font-medium text-[var(--text)]">{selectedItem.requester}</p></div>
                <div><span className="text-[var(--text-secondary)]">부서</span><p className="text-[var(--text)]">{selectedItem.department}</p></div>
                <div><span className="text-[var(--text-secondary)]">요청일</span><p className="text-[var(--text)]">{selectedItem.requestedAt}</p></div>
                <div><span className="text-[var(--text-secondary)]">금액</span><p className="font-bold text-[var(--text)]">{formatCurrency(selectedItem.totalAmount)}</p></div>
                <div><span className="text-[var(--text-secondary)]">상태</span><p><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[selectedItem.status]}`}>{statusLabels[selectedItem.status]}</span></p></div>
              </div>

              {/* Order Items */}
              <div className="border-t border-[var(--border)] pt-4">
                <h3 className="text-sm font-semibold text-[var(--text)] mb-3">주문 품목</h3>
                <div className="bg-[var(--bg)] rounded-lg p-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[var(--text)]">{selectedItem.products}</span>
                    <span className="font-medium text-[var(--text)]">{formatCurrency(selectedItem.totalAmount)}</span>
                  </div>
                  {selectedItem.itemCount > 1 && (
                    <p className="text-xs text-[var(--text-secondary)] mt-1">외 {selectedItem.itemCount - 1}건</p>
                  )}
                </div>
              </div>

              {/* Shipping Info */}
              <div className="border-t border-[var(--border)] pt-4">
                <h3 className="text-sm font-semibold text-[var(--text)] mb-3">배송지 정보</h3>
                <div className="text-sm text-[var(--text-secondary)] space-y-1">
                  <p>경상국립대학교 {selectedItem.department}</p>
                  <p>경상남도 진주시 진주대로501 자연과학대학</p>
                  <p>{selectedItem.requester} / 055-772-1234</p>
                </div>
              </div>

              {/* Payment Info */}
              <div className="border-t border-[var(--border)] pt-4">
                <h3 className="text-sm font-semibold text-[var(--text)] mb-3">결제 정보</h3>
                <div className="text-sm text-[var(--text-secondary)] space-y-1">
                  <p>청구기관: 경상국립대학교 산학협력단</p>
                  <p>PO번호: {selectedItem.orderNumber.replace('ORD-', '')}-{selectedItem.requester}</p>
                </div>
              </div>

              {selectedItem.note && (
                <div className="border-t border-[var(--border)] pt-3">
                  <span className="text-[var(--text-secondary)]">비고</span>
                  <p className="text-[var(--text)]">{selectedItem.note}</p>
                </div>
              )}
            </div>
            <button onClick={() => setSelectedItem(null)} className="mt-5 w-full h-[38px] bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700">
              닫기
            </button>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-800 text-white px-6 py-3 rounded-lg shadow-xl text-sm z-50 animate-fade-in">
          {toast}
        </div>
      )}
    </div>
  );
}
