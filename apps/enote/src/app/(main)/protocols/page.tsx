'use client';

import { useState } from 'react';
import {
  Plus,
  Search,
  BookOpen,
  ListOrdered,
  Beaker,
  ShoppingCart,
  ChevronRight,
  ChevronDown,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  ArrowLeft,
} from 'lucide-react';

interface ProtocolReagent {
  cas: string;
  name: string;
  quantity: string;
  unit: string;
  matched: boolean;
}

interface Protocol {
  id: string;
  title: string;
  description: string;
  stepsCount: number;
  reagentCount: number;
  createdDate: string;
  isTemplate: boolean;
  steps: string[];
  reagents: ProtocolReagent[];
}

const protocols: Protocol[] = [
  {
    id: 'PROT-001',
    title: 'Sol-Gel TiO2 합성 프로토콜',
    description: '졸-겔법을 이용한 이산화티타늄 나노입자 합성. 전구체 가수분해 및 축합 반응을 통해 균일한 나노입자를 제조한다.',
    stepsCount: 6,
    reagentCount: 4,
    createdDate: '2026-02-15',
    isTemplate: false,
    steps: [
      'Titanium isopropoxide 10 mL를 에탄올 50 mL에 용해시킨다.',
      '증류수 5 mL와 HCl 0.5 mL를 혼합한 산성 용액을 준비한다.',
      '교반하면서 산성 용액을 전구체 용액에 적가한다 (1 mL/min).',
      '60 도에서 2시간 동안 숙성시킨다.',
      '원심분리하여 침전물을 수집하고, 에탄올로 3회 세척한다.',
      '80 도에서 12시간 건조 후, 450 도에서 2시간 소성한다.',
    ],
    reagents: [
      { cas: '546-68-9', name: 'Titanium(IV) isopropoxide', quantity: '10', unit: 'mL', matched: true },
      { cas: '64-17-5', name: 'Ethanol (99.5%)', quantity: '50', unit: 'mL', matched: true },
      { cas: '7647-01-0', name: 'Hydrochloric acid', quantity: '0.5', unit: 'mL', matched: true },
      { cas: '7732-18-5', name: 'Distilled Water', quantity: '5', unit: 'mL', matched: false },
    ],
  },
  {
    id: 'PROT-002',
    title: 'HPLC Method Validation',
    description: 'HPLC 분석법 유효성 검증 프로토콜. 직선성, 정밀성, 정확성, 검출한계, 정량한계를 평가한다.',
    stepsCount: 8,
    reagentCount: 3,
    createdDate: '2026-02-20',
    isTemplate: false,
    steps: [
      '표준품 stock solution 1000 ppm을 조제한다.',
      '직선성: 10, 50, 100, 200, 500 ppm 희석 용액을 준비한다.',
      '각 농도에서 3회 반복 측정하여 검량선을 작성한다.',
      '일내 정밀성: 100 ppm 시료를 6회 반복 측정한다.',
      '일간 정밀성: 3일간 매일 3회 반복 측정한다.',
      '정확성: 80, 100, 120% 수준의 회수율 시험을 수행한다.',
      'LOD = 3.3 x (sigma/S), LOQ = 10 x (sigma/S)로 계산한다.',
      '결과를 정리하고 분석 리포트를 작성한다.',
    ],
    reagents: [
      { cas: '75-05-8', name: 'Acetonitrile (HPLC grade)', quantity: '500', unit: 'mL', matched: true },
      { cas: '67-56-1', name: 'Methanol (HPLC grade)', quantity: '200', unit: 'mL', matched: true },
      { cas: '7732-18-5', name: 'Ultrapure Water', quantity: '1000', unit: 'mL', matched: false },
    ],
  },
  {
    id: 'PROT-003',
    title: '항균 활성 평가 프로토콜',
    description: '디스크 확산법 및 MIC/MBC 측정을 통한 항균 활성 평가. E. coli 및 S. aureus 표준 균주 사용.',
    stepsCount: 7,
    reagentCount: 5,
    createdDate: '2026-03-01',
    isTemplate: false,
    steps: [
      'LB 배지를 제조하고 121 도에서 15분간 멸균한다.',
      '표준 균주를 0.5 McFarland로 조정한다.',
      '디스크 확산법: 6 mm 디스크에 시료 용액을 점적한다.',
      '37 도에서 18-24시간 배양 후 억제 존 직경을 측정한다.',
      'MIC: 2-fold serial dilution으로 최소 억제 농도를 결정한다.',
      'MBC: MIC 이상 농도 배양액을 고체 배지에 도말한다.',
      '37 도에서 24시간 배양 후 콜로니 형성 여부를 확인한다.',
    ],
    reagents: [
      { cas: '69-52-3', name: 'Ampicillin sodium salt', quantity: '100', unit: 'mg', matched: true },
      { cas: '8013-07-8', name: 'LB Broth (Miller)', quantity: '25', unit: 'g', matched: true },
      { cas: '9002-18-0', name: 'Agar', quantity: '15', unit: 'g', matched: true },
      { cas: '7647-14-5', name: 'Sodium chloride', quantity: '10', unit: 'g', matched: true },
      { cas: '77-86-1', name: 'Tris base', quantity: '5', unit: 'g', matched: false },
    ],
  },
  {
    id: 'TMPL-001',
    title: 'MTT Assay 프로토콜 (템플릿)',
    description: 'MTT 세포 독성 시험 표준 프로토콜. 96-well plate 기반 세포 생존율 측정.',
    stepsCount: 5,
    reagentCount: 3,
    createdDate: '2026-01-10',
    isTemplate: true,
    steps: [
      '96-well plate에 세포를 1x10^4 cells/well로 분주한다.',
      '24시간 배양 후, 시료를 농도별로 처리한다.',
      '48시간 추가 배양 후, MTT 용액 (5 mg/mL) 20 uL를 첨가한다.',
      '4시간 후 상등액을 제거하고 DMSO 150 uL를 첨가하여 formazan을 용해한다.',
      '570 nm에서 흡광도를 측정하고 세포 생존율을 계산한다.',
    ],
    reagents: [
      { cas: '298-93-1', name: 'MTT (Thiazolyl Blue)', quantity: '50', unit: 'mg', matched: true },
      { cas: '67-68-5', name: 'DMSO', quantity: '50', unit: 'mL', matched: true },
      { cas: '10049-04-4', name: 'Trypan Blue', quantity: '10', unit: 'mL', matched: false },
    ],
  },
];

export default function ProtocolsPage() {
  const [activeTab, setActiveTab] = useState<'my' | 'templates'>('my');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProtocol, setSelectedProtocol] = useState<Protocol | null>(null);

  const filtered = protocols.filter((p) => {
    const matchTab = activeTab === 'templates' ? p.isTemplate : !p.isTemplate;
    const matchSearch =
      !searchQuery ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchTab && matchSearch;
  });

  // Protocol Detail View
  if (selectedProtocol) {
    const matchedCount = selectedProtocol.reagents.filter((r) => r.matched).length;
    const unmatchedReagents = selectedProtocol.reagents.filter((r) => !r.matched);

    return (
      <div className="space-y-6">
        {/* Back Button */}
        <button
          onClick={() => setSelectedProtocol(null)}
          className="flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text)] transition-colors"
        >
          <ArrowLeft size={16} />
          프로토콜 목록으로 돌아가기
        </button>

        {/* Protocol Header */}
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs text-[var(--text-secondary)] font-mono">{selectedProtocol.id}</span>
                {selectedProtocol.isTemplate && (
                  <span className="text-xs px-2 py-0.5 bg-violet-100 text-violet-700 rounded-full font-medium">템플릿</span>
                )}
              </div>
              <h1 className="text-xl font-bold text-[var(--text)]">{selectedProtocol.title}</h1>
              <p className="text-sm text-[var(--text-secondary)] mt-2">{selectedProtocol.description}</p>
              <div className="flex items-center gap-4 mt-3">
                <span className="text-xs text-[var(--text-secondary)] flex items-center gap-1">
                  <ListOrdered size={12} />
                  {selectedProtocol.stepsCount}단계
                </span>
                <span className="text-xs text-[var(--text-secondary)] flex items-center gap-1">
                  <Beaker size={12} />
                  시약 {selectedProtocol.reagentCount}종
                </span>
                <span className="text-xs text-[var(--text-secondary)] flex items-center gap-1">
                  <Clock size={12} />
                  {selectedProtocol.createdDate}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="flex items-center gap-2 px-4 h-[var(--btn-height)] text-sm font-medium text-teal-600 border border-teal-200 rounded-lg hover:bg-teal-50 transition-colors">
                <FileText size={14} />
                실험에 적용
              </button>
            </div>
          </div>
        </div>

        {/* Steps */}
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl">
          <div className="px-6 py-4 border-b border-[var(--border)]">
            <h2 className="text-base font-semibold text-[var(--text)] flex items-center gap-2">
              <ListOrdered size={16} className="text-teal-600" />
              실험 단계 ({selectedProtocol.steps.length}단계)
            </h2>
          </div>
          <div className="p-6 space-y-4">
            {selectedProtocol.steps.map((step, idx) => (
              <div key={idx} className="flex gap-4">
                <div className="w-7 h-7 rounded-full bg-teal-100 text-teal-700 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </div>
                <p className="text-sm text-[var(--text)] leading-relaxed">{step}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Reagent Table */}
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl">
          <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)]">
            <h2 className="text-base font-semibold text-[var(--text)] flex items-center gap-2">
              <Beaker size={16} className="text-teal-600" />
              필요 시약 ({selectedProtocol.reagents.length}종)
            </h2>
            <span className="text-xs text-[var(--text-secondary)]">
              JINU Shop 매칭: {matchedCount}/{selectedProtocol.reagents.length}
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 text-xs text-[var(--text-secondary)]">
                  <th className="text-left px-6 py-3 font-medium">CAS No.</th>
                  <th className="text-left px-6 py-3 font-medium">시약명</th>
                  <th className="text-right px-6 py-3 font-medium">필요량</th>
                  <th className="text-center px-6 py-3 font-medium">단위</th>
                  <th className="text-center px-6 py-3 font-medium">Shop 매칭</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {selectedProtocol.reagents.map((reagent) => (
                  <tr key={reagent.cas} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-3 text-sm font-mono text-[var(--text-secondary)]">{reagent.cas}</td>
                    <td className="px-6 py-3 text-sm font-medium text-[var(--text)]">{reagent.name}</td>
                    <td className="px-6 py-3 text-sm text-right text-[var(--text)]">{reagent.quantity}</td>
                    <td className="px-6 py-3 text-sm text-center text-[var(--text-secondary)]">{reagent.unit}</td>
                    <td className="px-6 py-3 text-center">
                      {reagent.matched ? (
                        <CheckCircle size={16} className="text-green-500 inline" />
                      ) : (
                        <XCircle size={16} className="text-gray-300 inline" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Order from Shop Button */}
          <div className="px-6 py-4 border-t border-[var(--border)] flex items-center justify-between">
            <div className="text-sm text-[var(--text-secondary)]">
              {unmatchedReagents.length > 0
                ? `매칭되지 않은 시약 ${unmatchedReagents.length}종은 Shop에서 검색이 필요합니다.`
                : '모든 시약이 JINU Shop에 등록되어 있습니다.'}
            </div>
            <a
              href="http://localhost:3000/order"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 h-[var(--btn-height)] bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              <ShoppingCart size={16} />
              JINU Shop에서 주문
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Protocol List View
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text)]">프로토콜</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">실험 프로토콜을 관리하고, 시약 목록을 JINU Shop과 연동합니다.</p>
        </div>
        <button className="flex items-center gap-2 px-4 h-[var(--btn-height)] bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 transition-colors">
          <Plus size={16} />
          새 프로토콜
        </button>
      </div>

      {/* Content */}
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl">
        {/* Search + Tabs */}
        <div className="p-4 border-b border-[var(--border)] flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="프로토콜명으로 검색..."
              className="w-full pl-10 pr-4 h-[var(--btn-height)] border border-[var(--border)] rounded-lg bg-[var(--bg)] text-sm focus:outline-none focus:border-teal-500 text-[var(--text)]"
            />
          </div>
        </div>

        <div className="flex border-b border-[var(--border)] px-4">
          <button
            onClick={() => setActiveTab('my')}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'my'
                ? 'border-teal-600 text-teal-600'
                : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text)]'
            }`}
          >
            내 프로토콜 ({protocols.filter((p) => !p.isTemplate).length})
          </button>
          <button
            onClick={() => setActiveTab('templates')}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'templates'
                ? 'border-teal-600 text-teal-600'
                : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text)]'
            }`}
          >
            템플릿 ({protocols.filter((p) => p.isTemplate).length})
          </button>
        </div>

        {/* Protocol List */}
        <div className="divide-y divide-[var(--border)]">
          {filtered.map((protocol) => (
            <div
              key={protocol.id}
              onClick={() => setSelectedProtocol(protocol)}
              className="flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <BookOpen size={14} className="text-teal-600 shrink-0" />
                  <span className="text-xs text-[var(--text-secondary)] font-mono">{protocol.id}</span>
                  {protocol.isTemplate && (
                    <span className="text-xs px-2 py-0.5 bg-violet-100 text-violet-700 rounded-full font-medium">템플릿</span>
                  )}
                </div>
                <p className="text-sm font-semibold text-[var(--text)] truncate">{protocol.title}</p>
                <p className="text-xs text-[var(--text-secondary)] mt-0.5 truncate">{protocol.description}</p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-xs text-[var(--text-secondary)] flex items-center gap-1">
                    <ListOrdered size={12} />
                    {protocol.stepsCount}단계
                  </span>
                  <span className="text-xs text-[var(--text-secondary)] flex items-center gap-1">
                    <Beaker size={12} />
                    시약 {protocol.reagentCount}종
                  </span>
                  <span className="text-xs text-[var(--text-secondary)] flex items-center gap-1">
                    <Clock size={12} />
                    {protocol.createdDate}
                  </span>
                </div>
              </div>
              <ChevronRight size={16} className="text-[var(--text-secondary)] shrink-0 ml-4" />
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="py-12 text-center text-sm text-[var(--text-secondary)]">
              검색 결과가 없습니다.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
