'use client';

import { useState } from 'react';
import {
  ClipboardList,
  Search,
  Calendar,
  TrendingUp,
  Beaker,
  Filter,
  BarChart3,
} from 'lucide-react';

interface UsageRecord {
  id: string;
  date: string;
  experimentTitle: string;
  experimentId: string;
  reagentName: string;
  cas: string;
  quantityUsed: string;
  unit: string;
  lotNumber: string;
}

const usageRecords: UsageRecord[] = [
  {
    id: 'USE-001',
    date: '2026-03-20',
    experimentTitle: 'TiO2 나노입자 합성 최적화',
    experimentId: 'EXP-2026-042',
    reagentName: 'Titanium(IV) isopropoxide',
    cas: '546-68-9',
    quantityUsed: '10',
    unit: 'mL',
    lotNumber: 'TTIP-2024-015',
  },
  {
    id: 'USE-002',
    date: '2026-03-20',
    experimentTitle: 'TiO2 나노입자 합성 최적화',
    experimentId: 'EXP-2026-042',
    reagentName: 'Ethanol (99.5%)',
    cas: '64-17-5',
    quantityUsed: '50',
    unit: 'mL',
    lotNumber: 'EtOH-2025-201',
  },
  {
    id: 'USE-003',
    date: '2026-03-19',
    experimentTitle: 'HPLC 분석법 유효성 검증',
    experimentId: 'EXP-2026-041',
    reagentName: 'Acetonitrile (HPLC grade)',
    cas: '75-05-8',
    quantityUsed: '80',
    unit: 'mL',
    lotNumber: 'ACN-2025-112',
  },
  {
    id: 'USE-004',
    date: '2026-03-19',
    experimentTitle: 'HPLC 분석법 유효성 검증',
    experimentId: 'EXP-2026-041',
    reagentName: 'Methanol (HPLC grade)',
    cas: '67-56-1',
    quantityUsed: '40',
    unit: 'mL',
    lotNumber: 'MeOH-2025-089',
  },
  {
    id: 'USE-005',
    date: '2026-03-18',
    experimentTitle: '항균 코팅 소재 특성 평가',
    experimentId: 'EXP-2026-040',
    reagentName: 'Ampicillin sodium salt',
    cas: '69-52-3',
    quantityUsed: '50',
    unit: 'mg',
    lotNumber: 'AMP-2024-098',
  },
  {
    id: 'USE-006',
    date: '2026-03-18',
    experimentTitle: '항균 코팅 소재 특성 평가',
    experimentId: 'EXP-2026-040',
    reagentName: 'LB Broth (Miller)',
    cas: '8013-07-8',
    quantityUsed: '12.5',
    unit: 'g',
    lotNumber: 'LBB-2025-077',
  },
  {
    id: 'USE-007',
    date: '2026-03-17',
    experimentTitle: '항균 코팅 소재 특성 평가',
    experimentId: 'EXP-2026-040',
    reagentName: 'Sodium chloride',
    cas: '7647-14-5',
    quantityUsed: '5',
    unit: 'g',
    lotNumber: 'NaCl-2025-045',
  },
  {
    id: 'USE-008',
    date: '2026-03-15',
    experimentTitle: '항균 코팅 소재 특성 평가',
    experimentId: 'EXP-2026-040',
    reagentName: 'Agar',
    cas: '9002-18-0',
    quantityUsed: '7.5',
    unit: 'g',
    lotNumber: 'AGR-2025-022',
  },
];

const topReagents = [
  { name: 'Acetonitrile (HPLC)', used: '280 mL', percentage: 100 },
  { name: 'Ethanol (99.5%)', used: '210 mL', percentage: 75 },
  { name: 'Methanol (HPLC)', used: '160 mL', percentage: 57 },
  { name: 'Distilled Water', used: '1500 mL', percentage: 45 },
  { name: 'Hydrochloric acid', used: '30 mL', percentage: 11 },
];

export default function UsagePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFrom, setDateFrom] = useState('2026-03-01');
  const [dateTo, setDateTo] = useState('2026-03-20');

  const filtered = usageRecords.filter((record) => {
    const matchSearch =
      !searchQuery ||
      record.reagentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.cas.includes(searchQuery) ||
      record.experimentTitle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchDate = record.date >= dateFrom && record.date <= dateTo;
    return matchSearch && matchDate;
  });

  const thisMonthTotal = usageRecords.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--text)]">사용 기록</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">실험에서 사용한 시약의 기록을 조회하고 분석합니다.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Filters */}
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative flex-1 min-w-[200px]">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="시약명, CAS번호, 실험명 검색..."
                  className="w-full pl-10 pr-4 h-[var(--btn-height)] border border-[var(--border)] rounded-lg bg-[var(--bg)] text-sm focus:outline-none focus:border-teal-500 text-[var(--text)]"
                />
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={14} className="text-[var(--text-secondary)]" />
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="px-3 h-[var(--btn-height)] border border-[var(--border)] rounded-lg bg-[var(--bg)] text-sm text-[var(--text)]"
                />
                <span className="text-sm text-[var(--text-secondary)]">~</span>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="px-3 h-[var(--btn-height)] border border-[var(--border)] rounded-lg bg-[var(--bg)] text-sm text-[var(--text)]"
                />
              </div>
            </div>
          </div>

          {/* Usage Table */}
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)]">
              <h2 className="text-base font-semibold text-[var(--text)] flex items-center gap-2">
                <ClipboardList size={16} className="text-teal-600" />
                사용 로그
              </h2>
              <span className="text-xs text-[var(--text-secondary)]">
                총 {filtered.length}건
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 text-xs text-[var(--text-secondary)]">
                    <th className="text-left px-5 py-3 font-medium">날짜</th>
                    <th className="text-left px-5 py-3 font-medium">실험</th>
                    <th className="text-left px-5 py-3 font-medium">시약명</th>
                    <th className="text-left px-5 py-3 font-medium">CAS No.</th>
                    <th className="text-right px-5 py-3 font-medium">사용량</th>
                    <th className="text-left px-5 py-3 font-medium">Lot No.</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  {filtered.map((record) => (
                    <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-3 text-sm text-[var(--text-secondary)]">{record.date}</td>
                      <td className="px-5 py-3">
                        <p className="text-sm font-medium text-[var(--text)] truncate max-w-[200px]">{record.experimentTitle}</p>
                        <p className="text-xs text-[var(--text-secondary)] font-mono">{record.experimentId}</p>
                      </td>
                      <td className="px-5 py-3 text-sm text-[var(--text)]">{record.reagentName}</td>
                      <td className="px-5 py-3 text-sm font-mono text-[var(--text-secondary)]">{record.cas}</td>
                      <td className="px-5 py-3 text-sm text-right font-medium text-[var(--text)]">
                        {record.quantityUsed} {record.unit}
                      </td>
                      <td className="px-5 py-3 text-xs font-mono text-[var(--text-secondary)]">{record.lotNumber}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filtered.length === 0 && (
              <div className="py-12 text-center text-sm text-[var(--text-secondary)]">
                해당 기간에 사용 기록이 없습니다.
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar - Statistics */}
        <div className="space-y-6">
          {/* Monthly Summary */}
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5">
            <h2 className="text-base font-semibold text-[var(--text)] flex items-center gap-2 mb-4">
              <TrendingUp size={16} className="text-teal-600" />
              이번 달 통계
            </h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-teal-50 rounded-lg">
                <span className="text-sm text-[var(--text)]">총 사용 건수</span>
                <span className="text-lg font-bold text-teal-600">{thisMonthTotal}건</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <span className="text-sm text-[var(--text)]">사용 시약 종류</span>
                <span className="text-lg font-bold text-blue-600">7종</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-violet-50 rounded-lg">
                <span className="text-sm text-[var(--text)]">관련 실험</span>
                <span className="text-lg font-bold text-violet-600">3건</span>
              </div>
            </div>
          </div>

          {/* Top Used Reagents */}
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5">
            <h2 className="text-base font-semibold text-[var(--text)] flex items-center gap-2 mb-4">
              <BarChart3 size={16} className="text-teal-600" />
              자주 사용 시약 (이번 달)
            </h2>
            <div className="space-y-3">
              {topReagents.map((reagent, idx) => (
                <div key={reagent.name}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-[var(--text)] truncate flex-1 mr-2">
                      {idx + 1}. {reagent.name}
                    </span>
                    <span className="text-xs text-[var(--text-secondary)] shrink-0">{reagent.used}</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-teal-500 rounded-full transition-all"
                      style={{ width: `${reagent.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
