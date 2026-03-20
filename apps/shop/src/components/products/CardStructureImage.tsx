'use client';

import { useState, useEffect } from 'react';
import { FlaskConical } from 'lucide-react';

interface CardStructureImageProps {
  casNumber?: string;
  fallbackFormula?: string;
  className?: string;
}

const PUBCHEM_BASE = 'https://pubchem.ncbi.nlm.nih.gov/rest/pug';

export function CardStructureImage({ casNumber, fallbackFormula, className = '' }: CardStructureImageProps) {
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!casNumber) return;
    // PubChem에서 CAS번호로 직접 이미지 URL 생성 (API 호출 없이)
    setImgSrc(`${PUBCHEM_BASE}/compound/name/${casNumber}/PNG?image_size=200x200`);
  }, [casNumber]);

  if (!imgSrc || failed) {
    return (
      <div className={`flex items-center justify-center bg-gray-50 ${className}`}>
        <span className="text-3xl font-mono text-gray-300">{fallbackFormula || '?'}</span>
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-center bg-white ${className}`}>
      <img
        src={imgSrc}
        alt={`${casNumber} structure`}
        className="max-w-full max-h-full object-contain p-2"
        onError={() => setFailed(true)}
        loading="lazy"
      />
    </div>
  );
}
