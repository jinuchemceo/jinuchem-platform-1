'use client';

import { useState } from 'react';
import { Search, Download, FileText, AlertTriangle, ChevronDown } from 'lucide-react';

interface MsdsResult {
  id: string;
  productName: string;
  casNo: string;
  catalogNo: string;
  supplier: string;
  hasKoreanSds: boolean;
  hasEnglishSds: boolean;
  status: '등록완료' | '미등록';
}

const sampleMsdsData: MsdsResult[] = [
  { id: '1', productName: 'Ethyl alcohol, Pure', casNo: '64-17-5', catalogNo: '459844', supplier: 'Sigma-Aldrich', hasKoreanSds: true, hasEnglishSds: true, status: '등록완료' },
  { id: '2', productName: 'Acetone, ACS Grade', casNo: '67-64-1', catalogNo: 'A0003', supplier: 'TCI', hasKoreanSds: true, hasEnglishSds: true, status: '등록완료' },
  { id: '3', productName: 'Methanol, HPLC Grade', casNo: '67-56-1', catalogNo: '322415', supplier: 'Sigma-Aldrich', hasKoreanSds: true, hasEnglishSds: true, status: '등록완료' },
  { id: '4', productName: 'Sodium Hydroxide', casNo: '1310-73-2', catalogNo: 'S5881', supplier: 'Sigma-Aldrich', hasKoreanSds: true, hasEnglishSds: true, status: '등록완료' },
  { id: '5', productName: 'PIPES, 고순도', casNo: '5625-37-6', catalogNo: 'P0058', supplier: 'TCI', hasKoreanSds: true, hasEnglishSds: false, status: '등록완료' },
  { id: '6', productName: 'Hydrochloric acid, 35%', casNo: '7647-01-0', catalogNo: '320331', supplier: 'Sigma-Aldrich', hasKoreanSds: true, hasEnglishSds: true, status: '등록완료' },
  { id: '7', productName: 'Toluene, Anhydrous', casNo: '108-88-3', catalogNo: 'T0290', supplier: 'TCI', hasKoreanSds: false, hasEnglishSds: true, status: '등록완료' },
  { id: '8', productName: 'Dimethyl sulfoxide', casNo: '67-68-5', catalogNo: 'D8418', supplier: 'Alfa Aesar', hasKoreanSds: false, hasEnglishSds: false, status: '미등록' },
];

type SearchType = 'productName' | 'casNo' | 'catalogNo';

const searchTypeLabels: Record<SearchType, string> = {
  productName: '제품명',
  casNo: 'CAS번호',
  catalogNo: '제품번호',
};

export default function MsdsPage() {
  const [searchType, setSearchType] = useState<SearchType>('productName');
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<MsdsResult[]>(sampleMsdsData);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = () => {
    setHasSearched(true);
    if (!searchQuery.trim()) {
      setResults(sampleMsdsData);
      return;
    }
    const q = searchQuery.toLowerCase().trim();
    const filtered = sampleMsdsData.filter((item) => {
      switch (searchType) {
        case 'productName':
          return item.productName.toLowerCase().includes(q);
        case 'casNo':
          return item.casNo.includes(q);
        case 'catalogNo':
          return item.catalogNo.toLowerCase().includes(q);
        default:
          return false;
      }
    });
    setResults(filtered);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[var(--text)]">MSDS/SDS 검색</h1>
      </div>

      {/* Search Section */}
      <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border)] p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Search size={18} className="text-blue-600" />
          <h2 className="text-base font-semibold text-[var(--text)]">안전보건자료(SDS) 검색</h2>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value as SearchType)}
              className="h-[38px] pl-3 pr-8 border border-[var(--border)] rounded-lg text-sm bg-[var(--bg-card)] text-[var(--text)] appearance-none cursor-pointer"
            >
              {Object.entries(searchTypeLabels).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] pointer-events-none" />
          </div>
          <input
            type="text"
            placeholder={
              searchType === 'productName' ? '제품명을 입력하세요' :
              searchType === 'casNo' ? 'CAS번호를 입력하세요 (예: 64-17-5)' :
              '제품번호를 입력하세요'
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 h-[38px] px-3 border border-[var(--border)] rounded-lg text-sm bg-[var(--bg-card)] text-[var(--text)]"
          />
          <button
            onClick={handleSearch}
            className="h-[38px] px-5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 flex items-center gap-1.5"
          >
            <Search size={14} /> 검색
          </button>
        </div>
      </div>

      {/* Results Table */}
      <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border)] overflow-hidden mb-6">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)]">
          <div className="flex items-center gap-2">
            <FileText size={16} className="text-blue-600" />
            <h2 className="text-base font-semibold text-[var(--text)]">검색 결과</h2>
            <span className="text-sm text-[var(--text-secondary)]">({results.length}건)</span>
          </div>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-[var(--border)]">
              <th className="text-left px-5 py-3 font-medium text-[var(--text-secondary)]">제품명</th>
              <th className="text-center px-4 py-3 font-medium text-[var(--text-secondary)]">CAS No.</th>
              <th className="text-center px-4 py-3 font-medium text-[var(--text-secondary)]">제품번호</th>
              <th className="text-center px-4 py-3 font-medium text-[var(--text-secondary)]">공급사</th>
              <th className="text-center px-4 py-3 font-medium text-[var(--text-secondary)]">한글 SDS</th>
              <th className="text-center px-4 py-3 font-medium text-[var(--text-secondary)]">영문 SDS</th>
              <th className="text-center px-4 py-3 font-medium text-[var(--text-secondary)]">상태</th>
            </tr>
          </thead>
          <tbody>
            {results.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-5 py-12 text-center text-[var(--text-secondary)]">
                  검색 결과가 없습니다. 다른 검색어로 다시 시도해주세요.
                </td>
              </tr>
            ) : (
              results.map((item) => (
                <tr key={item.id} className="border-b border-[var(--border)] last:border-0 hover:bg-gray-50">
                  <td className="px-5 py-3 font-medium text-[var(--text)]">{item.productName}</td>
                  <td className="px-4 py-3 text-center font-mono text-xs text-[var(--text)]">{item.casNo}</td>
                  <td className="px-4 py-3 text-center font-mono text-xs text-[var(--text)]">{item.catalogNo}</td>
                  <td className="px-4 py-3 text-center text-[var(--text)]">{item.supplier}</td>
                  <td className="px-4 py-3 text-center">
                    {item.hasKoreanSds ? (
                      <button className="h-[38px] px-3 border border-[var(--border)] text-[var(--text)] text-xs rounded-lg hover:border-blue-400 hover:text-blue-600 inline-flex items-center gap-1">
                        <Download size={12} /> 한글 SDS
                      </button>
                    ) : (
                      <span className="text-xs text-[var(--text-secondary)]">-</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {item.hasEnglishSds ? (
                      <button className="h-[38px] px-3 border border-[var(--border)] text-[var(--text)] text-xs rounded-lg hover:border-blue-400 hover:text-blue-600 inline-flex items-center gap-1">
                        <Download size={12} /> 영문 SDS
                      </button>
                    ) : (
                      <span className="text-xs text-[var(--text-secondary)]">-</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      item.status === '등록완료' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Info Note */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
        <AlertTriangle size={18} className="text-amber-600 mt-0.5 shrink-0" />
        <div>
          <p className="text-sm font-medium text-amber-800 mb-1">MSDS/SDS 안내</p>
          <p className="text-sm text-amber-700">
            MSDS는 화학물질의 유해위험성, 응급조치요령, 취급방법 등을 설명한 자료입니다.
            화학물질을 취급하는 모든 작업장에서는 해당 물질의 MSDS를 비치하고, 근로자에게 교육해야 합니다.
            SDS가 미등록된 제품은 고객센터(1:1 문의)를 통해 요청하실 수 있습니다.
          </p>
        </div>
      </div>
    </div>
  );
}
