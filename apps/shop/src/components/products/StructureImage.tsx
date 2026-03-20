'use client';

import { useState, useEffect } from 'react';
import { Loader2, ExternalLink, Maximize2, FlaskConical } from 'lucide-react';

interface PubChemData {
  cid: number;
  structureImageUrl: string;
  structure2dUrl: string;
  molecularFormula?: string;
  molecularWeight?: number;
  canonicalSmiles?: string;
  iupacName?: string;
  synonyms?: string[];
}

interface StructureImageProps {
  casNumber?: string;
  productName?: string;
  fallbackFormula?: string;
}

export function StructureImage({ casNumber, productName, fallbackFormula }: StructureImageProps) {
  const [data, setData] = useState<PubChemData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [viewMode, setViewMode] = useState<'2d' | 'info'>('2d');

  useEffect(() => {
    async function fetchStructure() {
      if (!casNumber && !productName) {
        setLoading(false);
        return;
      }

      try {
        const param = casNumber ? `cas=${casNumber}` : `name=${encodeURIComponent(productName!)}`;
        const res = await fetch(`/api/pubchem?${param}`);
        if (res.ok) {
          const json = await res.json();
          setData(json.data);
        } else {
          setError(true);
        }
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchStructure();
  }, [casNumber, productName]);

  // 로딩 상태
  if (loading) {
    return (
      <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border)] p-8 flex flex-col items-center justify-center min-h-[350px]">
        <Loader2 size={32} className="animate-spin text-blue-500 mb-3" />
        <p className="text-sm text-[var(--text-secondary)]">PubChem에서 구조식 로딩 중...</p>
      </div>
    );
  }

  // PubChem 데이터 없음 → 폴백
  if (error || !data) {
    return (
      <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border)] p-8 flex flex-col items-center justify-center min-h-[350px]">
        <FlaskConical size={48} className="text-gray-300 mb-3" />
        <span className="text-4xl font-mono text-gray-300 mb-2">{fallbackFormula || '?'}</span>
        <p className="text-xs text-[var(--text-secondary)]">구조식 이미지를 불러올 수 없습니다</p>
      </div>
    );
  }

  return (
    <>
      {/* 구조식 이미지 */}
      <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border)] overflow-hidden">
        <div className="relative group cursor-pointer" onClick={() => setShowModal(true)}>
          <img
            src={data.structureImageUrl}
            alt={`${casNumber || productName} 구조식`}
            className="w-full h-[300px] object-contain p-4 bg-white"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
            <Maximize2 size={24} className="text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg" />
          </div>
        </div>

        {/* PubChem 정보 바 */}
        <div className="px-4 py-2 bg-gray-50 border-t border-[var(--border)] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs text-[var(--text-secondary)]">PubChem CID: {data.cid}</span>
            {data.canonicalSmiles && (
              <span className="text-xs text-[var(--text-secondary)] truncate max-w-[200px]" title={data.canonicalSmiles}>
                SMILES: {data.canonicalSmiles}
              </span>
            )}
          </div>
          <a
            href={`https://pubchem.ncbi.nlm.nih.gov/compound/${data.cid}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-600 hover:underline flex items-center gap-1"
            onClick={(e) => e.stopPropagation()}
          >
            PubChem <ExternalLink size={10} />
          </a>
        </div>
      </div>

      {/* 확대 모달 */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-8" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl max-w-[700px] w-full overflow-hidden" onClick={(e) => e.stopPropagation()}>
            {/* 탭 */}
            <div className="flex border-b">
              <button
                onClick={() => setViewMode('2d')}
                className={`flex-1 py-3 text-sm font-medium ${viewMode === '2d' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
              >
                2D 구조식
              </button>
              <button
                onClick={() => setViewMode('info')}
                className={`flex-1 py-3 text-sm font-medium ${viewMode === 'info' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
              >
                화학 정보
              </button>
            </div>

            {viewMode === '2d' ? (
              <div className="p-6">
                <img
                  src={data.structure2dUrl}
                  alt="2D 구조식"
                  className="w-full max-h-[500px] object-contain"
                />
              </div>
            ) : (
              <div className="p-6 space-y-3">
                {data.iupacName && (
                  <div>
                    <span className="text-xs text-gray-500">IUPAC Name</span>
                    <p className="text-sm font-medium">{data.iupacName}</p>
                  </div>
                )}
                {data.molecularFormula && (
                  <div>
                    <span className="text-xs text-gray-500">Molecular Formula</span>
                    <p className="text-sm font-medium">{data.molecularFormula}</p>
                  </div>
                )}
                {data.molecularWeight && (
                  <div>
                    <span className="text-xs text-gray-500">Molecular Weight</span>
                    <p className="text-sm font-medium">{data.molecularWeight} g/mol</p>
                  </div>
                )}
                {data.canonicalSmiles && (
                  <div>
                    <span className="text-xs text-gray-500">SMILES</span>
                    <p className="text-sm font-mono break-all">{data.canonicalSmiles}</p>
                  </div>
                )}
                {data.synonyms && data.synonyms.length > 0 && (
                  <div>
                    <span className="text-xs text-gray-500">Synonyms</span>
                    <p className="text-sm">{data.synonyms.slice(0, 5).join(', ')}</p>
                  </div>
                )}
              </div>
            )}

            <div className="px-6 pb-4 flex justify-between">
              <a
                href={`https://pubchem.ncbi.nlm.nih.gov/compound/${data.cid}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:underline flex items-center gap-1"
              >
                PubChem에서 보기 <ExternalLink size={12} />
              </a>
              <button onClick={() => setShowModal(false)} className="h-[38px] px-6 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700">
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
