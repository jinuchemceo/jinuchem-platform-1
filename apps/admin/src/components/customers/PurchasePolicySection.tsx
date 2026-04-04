'use client';

import { useState } from 'react';
import {
  ShieldCheck,
  ToggleLeft,
  ToggleRight,
  Wallet,
  Bell,
  ChevronDown,
  ChevronUp,
  Settings,
  ArrowRight,
} from 'lucide-react';

// ─── Types ──────────────────────────────────────────────────────────────────

interface ApprovalSettings {
  requireApproval: boolean;
  thresholdAmount: number; // 만원 단위
  autoApproveRegular: boolean;
  autoApproveReorder: boolean;
  approvalSteps: 1 | 2;
}

interface DepartmentBudget {
  id: string;
  name: string;
  allocated: number;
  used: number;
}

interface BudgetAlertThreshold {
  percent: number;
  enabled: boolean;
}

// ─── Mock Data ──────────────────────────────────────────────────────────────

const defaultApprovalSettings: ApprovalSettings = {
  requireApproval: true,
  thresholdAmount: 50,
  autoApproveRegular: true,
  autoApproveReorder: false,
  approvalSteps: 1,
};

const mockDepartments: DepartmentBudget[] = [
  { id: 'dep-1', name: '유기화학 연구실', allocated: 5000000, used: 3250000 },
  { id: 'dep-2', name: '분석화학 연구실', allocated: 3000000, used: 2850000 },
  { id: 'dep-3', name: '생화학 연구실', allocated: 4000000, used: 1200000 },
];

const defaultAlertThresholds: BudgetAlertThreshold[] = [
  { percent: 80, enabled: true },
  { percent: 90, enabled: true },
  { percent: 100, enabled: true },
];

// ─── Helpers ────────────────────────────────────────────────────────────────

function formatKRW(value: number): string {
  if (value >= 100000000) return `${(value / 100000000).toFixed(1)}억`;
  if (value >= 10000) return `${(value / 10000).toLocaleString()}만`;
  return `${value.toLocaleString()}원`;
}

function usagePercent(used: number, allocated: number): number {
  if (allocated === 0) return 0;
  return Math.round((used / allocated) * 100);
}

function progressColor(pct: number): string {
  if (pct >= 90) return 'bg-red-500';
  if (pct >= 80) return 'bg-amber-500';
  return 'bg-emerald-500';
}

function progressTextColor(pct: number): string {
  if (pct >= 90) return 'text-red-600';
  if (pct >= 80) return 'text-amber-600';
  return 'text-emerald-600';
}

// ─── Toggle Component ───────────────────────────────────────────────────────

function Toggle({
  enabled,
  onToggle,
  label,
  description,
}: {
  enabled: boolean;
  onToggle: () => void;
  label: string;
  description?: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-3">
      <div className="flex-1">
        <span className="text-sm font-medium text-[var(--text)]">{label}</span>
        {description && (
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">{description}</p>
        )}
      </div>
      <button
        onClick={onToggle}
        className="shrink-0 mt-0.5 text-[var(--text-secondary)] hover:text-orange-600 transition-colors"
        aria-label={enabled ? '비활성화' : '활성화'}
      >
        {enabled ? (
          <ToggleRight size={28} className="text-orange-600" />
        ) : (
          <ToggleLeft size={28} />
        )}
      </button>
    </div>
  );
}

// ─── Component ──────────────────────────────────────────────────────────────

export function PurchasePolicySection() {
  const [approval, setApproval] = useState<ApprovalSettings>(defaultApprovalSettings);
  const [departments] = useState<DepartmentBudget[]>(mockDepartments);
  const [monthlyBudgetLimit, setMonthlyBudgetLimit] = useState<number>(12000000);
  const [alertThresholds, setAlertThresholds] = useState<BudgetAlertThreshold[]>(defaultAlertThresholds);
  const [approvalExpanded, setApprovalExpanded] = useState(true);
  const [budgetExpanded, setBudgetExpanded] = useState(true);

  const totalAllocated = departments.reduce((sum, d) => sum + d.allocated, 0);
  const totalUsed = departments.reduce((sum, d) => sum + d.used, 0);
  const totalPct = usagePercent(totalUsed, totalAllocated);

  function toggleAlert(index: number) {
    setAlertThresholds((prev) =>
      prev.map((t, i) => (i === index ? { ...t, enabled: !t.enabled } : t))
    );
  }

  return (
    <div className="space-y-5">
      {/* ──────────────────────────────────────────────────────────────────────
          Section Header
          ────────────────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 pt-2">
        <Settings size={18} className="text-orange-600" />
        <h3 className="text-base font-semibold text-[var(--text)]">
          기관별 구매 정책
        </h3>
      </div>

      {/* ──────────────────────────────────────────────────────────────────────
          Card 1: 승인 워크플로우 설정
          ────────────────────────────────────────────────────────────────── */}
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl overflow-hidden">
        {/* Card Header */}
        <button
          onClick={() => setApprovalExpanded(!approvalExpanded)}
          className="w-full flex items-center justify-between px-5 py-4 border-b border-[var(--border)] hover:bg-[var(--bg)] transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <ShieldCheck size={18} className="text-orange-600" />
            <h4 className="text-sm font-semibold text-[var(--text)]">승인 워크플로우 설정</h4>
          </div>
          {approvalExpanded ? (
            <ChevronUp size={16} className="text-[var(--text-secondary)]" />
          ) : (
            <ChevronDown size={16} className="text-[var(--text-secondary)]" />
          )}
        </button>

        {approvalExpanded && (
          <div className="px-5 py-4 space-y-1 divide-y divide-[var(--border)]">
            {/* Toggle: 주문 승인 필요 여부 */}
            <Toggle
              enabled={approval.requireApproval}
              onToggle={() =>
                setApproval((prev) => ({ ...prev, requireApproval: !prev.requireApproval }))
              }
              label="주문 승인 필요"
              description="활성화 시 지정 금액 이상의 주문에 대해 승인 절차를 진행합니다."
            />

            {/* 승인 금액 기준 */}
            <div className="py-3">
              <label className="text-sm font-medium text-[var(--text)]">승인 금액 기준</label>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5 mb-2">
                설정 금액 이상의 주문 시 조직장 승인이 필요합니다.
              </p>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={approval.thresholdAmount}
                  onChange={(e) =>
                    setApproval((prev) => ({
                      ...prev,
                      thresholdAmount: Number(e.target.value),
                    }))
                  }
                  min={0}
                  step={10}
                  className="w-32 h-[var(--btn-height)] px-3 text-sm bg-[var(--bg)] border border-[var(--border)] rounded-lg text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
                <span className="text-sm text-[var(--text-secondary)]">만원 이상</span>
              </div>
            </div>

            {/* 자동 승인 조건 */}
            <div className="space-y-0">
              <Toggle
                enabled={approval.autoApproveRegular}
                onToggle={() =>
                  setApproval((prev) => ({
                    ...prev,
                    autoApproveRegular: !prev.autoApproveRegular,
                  }))
                }
                label="정기 주문 자동 승인"
                description="정기 구독 주문은 승인 절차를 자동으로 통과합니다."
              />
              <Toggle
                enabled={approval.autoApproveReorder}
                onToggle={() =>
                  setApproval((prev) => ({
                    ...prev,
                    autoApproveReorder: !prev.autoApproveReorder,
                  }))
                }
                label="재주문 자동 승인"
                description="이전에 승인된 동일 품목의 재주문은 자동 승인됩니다."
              />
            </div>

            {/* 승인 단계 */}
            <div className="py-3">
              <label className="text-sm font-medium text-[var(--text)]">승인 단계</label>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5 mb-3">
                주문 승인에 필요한 결재 단계를 설정합니다.
              </p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setApproval((prev) => ({ ...prev, approvalSteps: 1 }))}
                  className={`h-[var(--btn-height)] px-4 rounded-lg text-sm font-medium border transition-colors ${
                    approval.approvalSteps === 1
                      ? 'bg-orange-600 text-white border-orange-600'
                      : 'bg-[var(--bg)] text-[var(--text)] border-[var(--border)] hover:border-orange-400'
                  }`}
                >
                  1단계 (조직장)
                </button>
                <ArrowRight size={14} className="text-[var(--text-secondary)]" />
                <button
                  onClick={() => setApproval((prev) => ({ ...prev, approvalSteps: 2 }))}
                  className={`h-[var(--btn-height)] px-4 rounded-lg text-sm font-medium border transition-colors ${
                    approval.approvalSteps === 2
                      ? 'bg-orange-600 text-white border-orange-600'
                      : 'bg-[var(--bg)] text-[var(--text)] border-[var(--border)] hover:border-orange-400'
                  }`}
                >
                  2단계 (조직장 / 기관장)
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ──────────────────────────────────────────────────────────────────────
          Card 2: 예산 관리 정책
          ────────────────────────────────────────────────────────────────── */}
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl overflow-hidden">
        {/* Card Header */}
        <button
          onClick={() => setBudgetExpanded(!budgetExpanded)}
          className="w-full flex items-center justify-between px-5 py-4 border-b border-[var(--border)] hover:bg-[var(--bg)] transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <Wallet size={18} className="text-orange-600" />
            <h4 className="text-sm font-semibold text-[var(--text)]">예산 관리 정책</h4>
          </div>
          {budgetExpanded ? (
            <ChevronUp size={16} className="text-[var(--text-secondary)]" />
          ) : (
            <ChevronDown size={16} className="text-[var(--text-secondary)]" />
          )}
        </button>

        {budgetExpanded && (
          <div className="px-5 py-4 space-y-5">
            {/* 월간 예산 한도 */}
            <div>
              <label className="text-sm font-medium text-[var(--text)]">월간 예산 한도</label>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5 mb-2">
                기관 전체의 월간 구매 예산 한도를 설정합니다.
              </p>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={monthlyBudgetLimit.toLocaleString()}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/,/g, '');
                    const num = parseInt(raw, 10);
                    if (!isNaN(num)) setMonthlyBudgetLimit(num);
                  }}
                  className="w-48 h-[var(--btn-height)] px-3 text-sm bg-[var(--bg)] border border-[var(--border)] rounded-lg text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
                <span className="text-sm text-[var(--text-secondary)]">원 / 월</span>
              </div>
              {/* Summary bar */}
              <div className="mt-3 p-3 bg-[var(--bg)] rounded-lg">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-[var(--text-secondary)]">
                    전체 사용: {formatKRW(totalUsed)} / {formatKRW(totalAllocated)}
                  </span>
                  <span className={`font-semibold ${progressTextColor(totalPct)}`}>
                    {totalPct}%
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${progressColor(totalPct)}`}
                    style={{ width: `${Math.min(totalPct, 100)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* 부서별 예산 분배 테이블 */}
            <div>
              <h5 className="text-sm font-medium text-[var(--text)] mb-3">부서별 예산 분배</h5>
              <div className="border border-[var(--border)] rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[var(--bg)] border-b border-[var(--border)]">
                      <th className="text-left px-4 py-2.5 font-semibold text-[var(--text-secondary)] text-xs uppercase tracking-wider">
                        부서명
                      </th>
                      <th className="text-right px-4 py-2.5 font-semibold text-[var(--text-secondary)] text-xs uppercase tracking-wider">
                        배정액
                      </th>
                      <th className="text-right px-4 py-2.5 font-semibold text-[var(--text-secondary)] text-xs uppercase tracking-wider">
                        사용액
                      </th>
                      <th className="text-right px-4 py-2.5 font-semibold text-[var(--text-secondary)] text-xs uppercase tracking-wider">
                        잔여
                      </th>
                      <th className="text-left px-4 py-2.5 font-semibold text-[var(--text-secondary)] text-xs uppercase tracking-wider min-w-[160px]">
                        사용률
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border)]">
                    {departments.map((dept) => {
                      const pct = usagePercent(dept.used, dept.allocated);
                      const remaining = dept.allocated - dept.used;
                      return (
                        <tr
                          key={dept.id}
                          className="hover:bg-[var(--bg)] transition-colors"
                        >
                          <td className="px-4 py-3 font-medium text-[var(--text)]">
                            {dept.name}
                          </td>
                          <td className="px-4 py-3 text-right text-[var(--text)]">
                            {formatKRW(dept.allocated)}
                          </td>
                          <td className="px-4 py-3 text-right text-[var(--text)]">
                            {formatKRW(dept.used)}
                          </td>
                          <td className={`px-4 py-3 text-right font-medium ${remaining < 0 ? 'text-red-600' : 'text-[var(--text)]'}`}>
                            {formatKRW(remaining)}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2.5">
                              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full transition-all ${progressColor(pct)}`}
                                  style={{ width: `${Math.min(pct, 100)}%` }}
                                />
                              </div>
                              <span className={`text-xs font-semibold w-10 text-right ${progressTextColor(pct)}`}>
                                {pct}%
                              </span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 초과 시 알림 설정 */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Bell size={16} className="text-orange-600" />
                <h5 className="text-sm font-medium text-[var(--text)]">예산 초과 알림 설정</h5>
              </div>
              <p className="text-xs text-[var(--text-secondary)] mb-3">
                예산 사용률이 설정된 비율에 도달하면 관리자에게 알림을 전송합니다.
              </p>
              <div className="space-y-2">
                {alertThresholds.map((threshold, idx) => (
                  <div
                    key={threshold.percent}
                    className="flex items-center justify-between p-3 bg-[var(--bg)] rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`inline-flex items-center justify-center w-12 h-7 rounded text-xs font-bold ${
                          threshold.percent === 100
                            ? 'bg-red-100 text-red-700'
                            : threshold.percent === 90
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}
                      >
                        {threshold.percent}%
                      </span>
                      <span className="text-sm text-[var(--text)]">
                        예산의 {threshold.percent}% 도달 시 알림
                      </span>
                    </div>
                    <button
                      onClick={() => toggleAlert(idx)}
                      className="text-[var(--text-secondary)] hover:text-orange-600 transition-colors"
                      aria-label={threshold.enabled ? '비활성화' : '활성화'}
                    >
                      {threshold.enabled ? (
                        <ToggleRight size={24} className="text-orange-600" />
                      ) : (
                        <ToggleLeft size={24} />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
