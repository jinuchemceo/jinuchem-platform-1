'use client';

import { useState } from 'react';
import { X, Search, Atom, FileText, FlaskConical } from 'lucide-react';
import { StructureEditor } from './StructureEditor';

type TabType = 'draw' | 'smiles' | 'formula';

interface StructureSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (query: string, type: string) => void;
}

export function StructureSearchModal({ isOpen, onClose, onSearch }: StructureSearchModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('draw');
  const [smilesInput, setSmilesInput] = useState('');
  const [formulaInput, setFormulaInput] = useState('');
  const [searchType, setSearchType] = useState<'exact' | 'substructure' | 'similarity'>('substructure');

  if (!isOpen) return null;

  const tabs: { key: TabType; label: string; icon: React.ReactNode }[] = [
    { key: 'draw', label: '구조식 그리기', icon: <FlaskConical size={14} /> },
    { key: 'smiles', label: 'SMILES', icon: <Atom size={14} /> },
    { key: 'formula', label: '분자식', icon: <FileText size={14} /> },
  ];

  const handleSearch = () => {
    if (activeTab === 'smiles' && smilesInput) {
      onSearch(smilesInput, 'smiles');
    } else if (activeTab === 'formula' && formulaInput) {
      onSearch(formulaInput, 'formula');
    }
    onClose();
  };

  const smilesExamples = [
    { name: 'Ethanol', smiles: 'CCO' },
    { name: 'Acetone', smiles: 'CC(=O)C' },
    { name: 'Benzene', smiles: 'c1ccccc1' },
    { name: 'Acetic acid', smiles: 'CC(=O)O' },
    { name: 'Methanol', smiles: 'CO' },
    { name: 'Toluene', smiles: 'Cc1ccccc1' },
  ];

  const formulaExamples = [
    { name: 'Ethanol', formula: 'C2H6O' },
    { name: 'Acetone', formula: 'C3H6O' },
    { name: 'Methanol', formula: 'CH4O' },
    { name: 'Glucose', formula: 'C6H12O6' },
    { name: 'Sulfuric acid', formula: 'H2SO4' },
    { name: 'Sodium chloride', formula: 'NaCl' },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center" onClick={onClose}>
      <div className="bg-[var(--bg-card)] rounded-2xl w-[720px] max-h-[80vh] overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)]">
          <h2 className="text-lg font-bold text-[var(--text)]">구조식 검색</h2>
          <button onClick={onClose} className="text-[var(--text-secondary)] hover:text-[var(--text)] text-xl">&times;</button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[var(--border)]">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text)]'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Search Type */}
          <div className="flex items-center gap-4 mb-5">
            <span className="text-sm text-[var(--text-secondary)]">검색 유형:</span>
            {[
              { key: 'exact', label: '정확 매칭' },
              { key: 'substructure', label: '서브스트럭처' },
              { key: 'similarity', label: '유사 구조' },
            ].map((opt) => (
              <label key={opt.key} className="flex items-center gap-1.5 text-sm cursor-pointer">
                <input
                  type="radio"
                  name="searchType"
                  value={opt.key}
                  checked={searchType === opt.key}
                  onChange={() => setSearchType(opt.key as typeof searchType)}
                  className="accent-blue-600"
                />
                <span className="text-[var(--text)]">{opt.label}</span>
              </label>
            ))}
          </div>

          {/* Draw Tab */}
          {activeTab === 'draw' && (
            <StructureEditor />
          )}

          {/* SMILES Tab */}
          {activeTab === 'smiles' && (
            <div>
              <label className="block text-sm font-medium text-[var(--text)] mb-2">SMILES 문자열 입력</label>
              <textarea
                value={smilesInput}
                onChange={(e) => setSmilesInput(e.target.value)}
                placeholder="예: CCO (Ethanol), CC(=O)C (Acetone), c1ccccc1 (Benzene)"
                className="w-full h-[100px] p-3 border border-[var(--border)] rounded-lg text-sm font-mono bg-white text-[var(--text)] resize-none focus:outline-none focus:border-blue-500"
              />

              {/* Preview */}
              {smilesInput && (
                <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-[var(--border)]">
                  <p className="text-xs text-[var(--text-secondary)] mb-1">미리보기</p>
                  <img
                    src={`https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/smiles/${encodeURIComponent(smilesInput)}/PNG?image_size=200x200`}
                    alt="Structure preview"
                    className="h-[120px] mx-auto"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                </div>
              )}

              {/* Examples */}
              <div className="mt-4">
                <p className="text-xs text-[var(--text-secondary)] mb-2">예시 SMILES:</p>
                <div className="flex flex-wrap gap-2">
                  {smilesExamples.map((ex) => (
                    <button
                      key={ex.smiles}
                      onClick={() => setSmilesInput(ex.smiles)}
                      className="px-3 py-1.5 bg-gray-100 rounded-full text-xs text-[var(--text)] hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    >
                      {ex.name} <span className="font-mono text-[var(--text-secondary)]">({ex.smiles})</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Formula Tab */}
          {activeTab === 'formula' && (
            <div>
              <label className="block text-sm font-medium text-[var(--text)] mb-2">분자식 입력</label>
              <input
                type="text"
                value={formulaInput}
                onChange={(e) => setFormulaInput(e.target.value)}
                placeholder="예: C2H6O (Ethanol), C3H6O (Acetone), H2SO4 (Sulfuric acid)"
                className="w-full h-[42px] px-4 border border-[var(--border)] rounded-lg text-sm font-mono bg-white text-[var(--text)] focus:outline-none focus:border-blue-500"
              />

              {/* Element selector */}
              <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-[var(--border)]">
                <p className="text-xs text-[var(--text-secondary)] mb-2">원소 빠른 입력:</p>
                <div className="flex flex-wrap gap-1.5">
                  {['C', 'H', 'O', 'N', 'S', 'P', 'F', 'Cl', 'Br', 'I', 'Na', 'K', 'Ca', 'Mg', 'Fe', 'Cu', 'Zn', 'Si'].map((el) => (
                    <button
                      key={el}
                      onClick={() => setFormulaInput((prev) => prev + el)}
                      className="w-9 h-9 text-xs font-bold text-[var(--text)] border border-[var(--border)] rounded hover:bg-blue-50 hover:border-blue-400 bg-white"
                    >
                      {el}
                    </button>
                  ))}
                  {['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'].map((n) => (
                    <button
                      key={n}
                      onClick={() => setFormulaInput((prev) => prev + n)}
                      className="w-9 h-9 text-xs font-bold text-blue-600 border border-blue-200 rounded hover:bg-blue-50 bg-white"
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>

              {/* Examples */}
              <div className="mt-4">
                <p className="text-xs text-[var(--text-secondary)] mb-2">예시 분자식:</p>
                <div className="flex flex-wrap gap-2">
                  {formulaExamples.map((ex) => (
                    <button
                      key={ex.formula}
                      onClick={() => setFormulaInput(ex.formula)}
                      className="px-3 py-1.5 bg-gray-100 rounded-full text-xs text-[var(--text)] hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    >
                      {ex.name} <span className="font-mono text-[var(--text-secondary)]">({ex.formula})</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[var(--border)]">
          <button
            onClick={onClose}
            className="h-[38px] px-5 border border-[var(--border)] rounded-lg text-sm text-[var(--text)] hover:bg-gray-100"
          >
            취소
          </button>
          <button
            onClick={handleSearch}
            disabled={activeTab === 'smiles' ? !smilesInput : activeTab === 'formula' ? !formulaInput : true}
            className="h-[38px] px-5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Search size={14} /> 검색
          </button>
        </div>
      </div>
    </div>
  );
}
