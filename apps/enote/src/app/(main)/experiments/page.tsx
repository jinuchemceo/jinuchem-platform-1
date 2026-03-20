'use client';

import { useState } from 'react';
import {
  Plus,
  Search,
  FlaskConical,
  Clock,
  Beaker,
  X,
  ChevronDown,
} from 'lucide-react';

type ExperimentStatus = '전체' | '초안' | '진행중' | '완료' | '보관';

interface Experiment {
  id: string;
  title: string;
  purpose: string;
  status: '초안' | '진행중' | '완료' | '보관';
  statusColor: string;
  createdDate: string;
  updatedDate: string;
  reagentCount: number;
  protocol?: string;
}

const experiments: Experiment[] = [
  {
    id: 'EXP-2026-042',
    title: 'TiO2 나노입자 합성 최적화',
    purpose: '졸-겔법을 이용한 TiO2 나노입자의 크기 및 결정성 최적화',
    status: '진행중',
    statusColor: 'bg-teal-100 text-teal-700',
    createdDate: '2026-03-20',
    updatedDate: '2026-03-20',
    reagentCount: 5,
    protocol: 'Sol-Gel TiO2 합성 프로토콜',
  },
  {
    id: 'EXP-2026-041',
    title: 'HPLC 분석법 유효성 검증',
    purpose: '신규 분석법의 직선성, 정밀성, 정확성 검증',
    status: '진행중',
    statusColor: 'bg-teal-100 text-teal-700',
    createdDate: '2026-03-19',
    updatedDate: '2026-03-20',
    reagentCount: 3,
    protocol: 'HPLC Method Validation',
  },
  {
    id: 'EXP-2026-040',
    title: '항균 코팅 소재 특성 평가',
    purpose: '은 나노입자 기반 항균 코팅의 MIC/MBC 측정',
    status: '완료',
    statusColor: 'bg-blue-100 text-blue-700',
    createdDate: '2026-03-15',
    updatedDate: '2026-03-18',
    reagentCount: 7,
    protocol: '항균 활성 평가 프로토콜',
  },
  {
    id: 'EXP-2026-039',
    title: 'PCR 프라이머 효율 테스트',
    purpose: '설계된 프라이머 세트의 증폭 효율 및 특이성 확인',
    status: '초안',
    statusColor: 'bg-gray-100 text-gray-700',
    createdDate: '2026-03-17',
    updatedDate: '2026-03-17',
    reagentCount: 2,
  },
  {
    id: 'EXP-2026-038',
    title: '형광 염료 안정성 평가',
    purpose: '광안정성 및 열안정성 조건별 형광 강도 변화 측정',
    status: '완료',
    statusColor: 'bg-blue-100 text-blue-700',
    createdDate: '2026-03-10',
    updatedDate: '2026-03-14',
    reagentCount: 4,
  },
  {
    id: 'EXP-2026-037',
    title: '세포 독성 시험 (MTT assay)',
    purpose: '신규 합성 화합물의 세포 독성 평가',
    status: '보관',
    statusColor: 'bg-orange-100 text-orange-700',
    createdDate: '2026-03-05',
    updatedDate: '2026-03-12',
    reagentCount: 6,
    protocol: 'MTT Assay 프로토콜',
  },
];

const statusTabs: ExperimentStatus[] = ['전체', '초안', '진행중', '완료', '보관'];

export default function ExperimentsPage() {
  const [activeTab, setActiveTab] = useState<ExperimentStatus>('전체');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewModal, setShowNewModal] = useState(false);
  const [newExp, setNewExp] = useState({ title: '', purpose: '', method: '', protocol: '' });

  const filtered = experiments.filter((exp) => {
    const matchStatus = activeTab === '전체' || exp.status === activeTab;
    const matchSearch =
      !searchQuery ||
      exp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchStatus && matchSearch;
  });

  const statusCount = (status: ExperimentStatus) => {
    if (status === '전체') return experiments.length;
    return experiments.filter((e) => e.status === status).length;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text)]">실험 목록</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">전자실험노트에 기록된 모든 실험을 관리합니다.</p>
        </div>
        <button
          onClick={() => setShowNewModal(true)}
          className="flex items-center gap-2 px-4 h-[var(--btn-height)] bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 transition-colors"
        >
          <Plus size={16} />
          새 실험
        </button>
      </div>

      {/* Search + Tabs */}
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl">
        <div className="p-4 border-b border-[var(--border)]">
          <div className="relative max-w-md">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="실험명 또는 실험번호로 검색..."
              className="w-full pl-10 pr-4 h-[var(--btn-height)] border border-[var(--border)] rounded-lg bg-[var(--bg)] text-sm focus:outline-none focus:border-teal-500 text-[var(--text)]"
            />
          </div>
        </div>

        {/* Status Tabs */}
        <div className="flex border-b border-[var(--border)] px-4">
          {statusTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab
                  ? 'border-teal-600 text-teal-600'
                  : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text)]'
              }`}
            >
              {tab} ({statusCount(tab)})
            </button>
          ))}
        </div>

        {/* Experiment List */}
        <div className="divide-y divide-[var(--border)]">
          {filtered.map((exp) => (
            <div
              key={exp.id}
              className="flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <FlaskConical size={14} className="text-teal-600 shrink-0" />
                  <span className="text-xs text-[var(--text-secondary)] font-mono">{exp.id}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${exp.statusColor}`}>
                    {exp.status}
                  </span>
                </div>
                <p className="text-sm font-semibold text-[var(--text)] truncate">{exp.title}</p>
                <p className="text-xs text-[var(--text-secondary)] mt-0.5 truncate">{exp.purpose}</p>
                {exp.protocol && (
                  <p className="text-xs text-teal-600 mt-1 flex items-center gap-1">
                    <Beaker size={12} />
                    {exp.protocol}
                  </p>
                )}
              </div>
              <div className="text-right shrink-0 ml-6">
                <p className="text-xs text-[var(--text-secondary)] flex items-center gap-1 justify-end">
                  <Clock size={12} />
                  {exp.updatedDate}
                </p>
                <p className="text-xs text-[var(--text-secondary)] mt-1">
                  시약 {exp.reagentCount}종
                </p>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="py-12 text-center text-sm text-[var(--text-secondary)]">
              검색 결과가 없습니다.
            </div>
          )}
        </div>
      </div>

      {/* New Experiment Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-[var(--bg-card)] rounded-xl shadow-2xl w-full max-w-lg mx-4">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)]">
              <h3 className="text-lg font-semibold text-[var(--text)]">새 실험 시작</h3>
              <button
                onClick={() => setShowNewModal(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-[var(--text-secondary)] hover:bg-gray-100"
              >
                <X size={18} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--text)] mb-1.5">실험 제목</label>
                <input
                  type="text"
                  value={newExp.title}
                  onChange={(e) => setNewExp({ ...newExp, title: e.target.value })}
                  placeholder="실험 제목을 입력하세요"
                  className="w-full px-4 h-[var(--btn-height)] border border-[var(--border)] rounded-lg bg-[var(--bg)] text-sm focus:outline-none focus:border-teal-500 text-[var(--text)]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text)] mb-1.5">실험 목적</label>
                <input
                  type="text"
                  value={newExp.purpose}
                  onChange={(e) => setNewExp({ ...newExp, purpose: e.target.value })}
                  placeholder="실험 목적을 입력하세요"
                  className="w-full px-4 h-[var(--btn-height)] border border-[var(--border)] rounded-lg bg-[var(--bg)] text-sm focus:outline-none focus:border-teal-500 text-[var(--text)]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text)] mb-1.5">실험 방법</label>
                <textarea
                  value={newExp.method}
                  onChange={(e) => setNewExp({ ...newExp, method: e.target.value })}
                  placeholder="실험 방법을 상세히 기술하세요"
                  rows={4}
                  className="w-full px-4 py-3 border border-[var(--border)] rounded-lg bg-[var(--bg)] text-sm focus:outline-none focus:border-teal-500 text-[var(--text)] resize-none"
                  style={{ height: 'auto' }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text)] mb-1.5">연결 프로토콜 (선택)</label>
                <div className="relative">
                  <select
                    value={newExp.protocol}
                    onChange={(e) => setNewExp({ ...newExp, protocol: e.target.value })}
                    className="w-full px-4 h-[var(--btn-height)] border border-[var(--border)] rounded-lg bg-[var(--bg)] text-sm focus:outline-none focus:border-teal-500 text-[var(--text)] appearance-none"
                  >
                    <option value="">프로토콜을 선택하세요</option>
                    <option value="sol-gel">Sol-Gel TiO2 합성 프로토콜</option>
                    <option value="hplc">HPLC Method Validation</option>
                    <option value="antibacterial">항균 활성 평가 프로토콜</option>
                    <option value="mtt">MTT Assay 프로토콜</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] pointer-events-none" />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-[var(--border)]">
              <button
                onClick={() => setShowNewModal(false)}
                className="px-4 h-[var(--btn-height)] text-sm font-medium text-[var(--text-secondary)] border border-[var(--border)] rounded-lg hover:bg-gray-50 transition-colors"
              >
                취소
              </button>
              <button
                onClick={() => setShowNewModal(false)}
                className="px-6 h-[var(--btn-height)] text-sm font-medium text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition-colors"
              >
                실험 시작
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
