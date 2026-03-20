// ================================================================
// PubChem API 클라이언트 — 구조식 이미지 + 화학물질 정보
// https://pubchem.ncbi.nlm.nih.gov/docs/pug-rest
// ================================================================

const PUBCHEM_BASE = 'https://pubchem.ncbi.nlm.nih.gov/rest/pug';
const PUBCHEM_VIEW = 'https://pubchem.ncbi.nlm.nih.gov/rest/pug_view';

export interface PubChemCompound {
  cid: number;
  casNumber?: string;
  iupacName?: string;
  molecularFormula?: string;
  molecularWeight?: number;
  canonicalSmiles?: string;
  inchi?: string;
  structureImageUrl: string;
  structure2dUrl: string;
  structure3dUrl: string;
  synonyms?: string[];
  description?: string;
}

export interface PubChemProperty {
  CID: number;
  MolecularFormula?: string;
  MolecularWeight?: number;
  CanonicalSMILES?: string;
  IsomericSMILES?: string;
  InChI?: string;
  IUPACName?: string;
  ExactMass?: number;
  MonoisotopicMass?: number;
  TPSA?: number;
  Complexity?: number;
  HBondDonorCount?: number;
  HBondAcceptorCount?: number;
  RotatableBondCount?: number;
  XLogP?: number;
}

/**
 * CAS번호로 PubChem CID 조회
 */
export async function getCidByCas(casNumber: string): Promise<number | null> {
  try {
    const res = await fetch(
      `${PUBCHEM_BASE}/compound/name/${casNumber}/cids/JSON`,
      { next: { revalidate: 86400 } } // 24시간 캐시
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data.IdentifierList?.CID?.[0] ?? null;
  } catch {
    return null;
  }
}

/**
 * 제품명으로 PubChem CID 조회
 */
export async function getCidByName(name: string): Promise<number | null> {
  try {
    const res = await fetch(
      `${PUBCHEM_BASE}/compound/name/${encodeURIComponent(name)}/cids/JSON`,
      { next: { revalidate: 86400 } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data.IdentifierList?.CID?.[0] ?? null;
  } catch {
    return null;
  }
}

/**
 * CID로 구조식 이미지 URL 생성
 */
export function getStructureImageUrl(cid: number, size: number = 300): string {
  return `${PUBCHEM_BASE}/compound/cid/${cid}/PNG?image_size=${size}x${size}`;
}

/**
 * CID로 2D 구조식 SVG URL
 */
export function getStructure2dUrl(cid: number): string {
  return `${PUBCHEM_BASE}/compound/cid/${cid}/PNG?record_type=2d&image_size=500x500`;
}

/**
 * CID로 3D 구조식 이미지 URL
 */
export function getStructure3dUrl(cid: number): string {
  return `${PUBCHEM_BASE}/compound/cid/${cid}/PNG?record_type=3d&image_size=500x500`;
}

/**
 * CID로 화학물질 속성 조회
 */
export async function getCompoundProperties(cid: number): Promise<PubChemProperty | null> {
  try {
    const properties = [
      'MolecularFormula', 'MolecularWeight', 'CanonicalSMILES', 'IsomericSMILES',
      'InChI', 'IUPACName', 'ExactMass', 'MonoisotopicMass', 'TPSA',
      'Complexity', 'HBondDonorCount', 'HBondAcceptorCount',
      'RotatableBondCount', 'XLogP',
    ].join(',');

    const res = await fetch(
      `${PUBCHEM_BASE}/compound/cid/${cid}/property/${properties}/JSON`,
      { next: { revalidate: 86400 } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data.PropertyTable?.Properties?.[0] ?? null;
  } catch {
    return null;
  }
}

/**
 * CID로 동의어 조회
 */
export async function getSynonyms(cid: number, limit: number = 10): Promise<string[]> {
  try {
    const res = await fetch(
      `${PUBCHEM_BASE}/compound/cid/${cid}/synonyms/JSON`,
      { next: { revalidate: 86400 } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return (data.InformationList?.Information?.[0]?.Synonym ?? []).slice(0, limit);
  } catch {
    return [];
  }
}

/**
 * CAS번호로 전체 화합물 정보 조회 (통합)
 */
export async function getCompoundByCas(casNumber: string): Promise<PubChemCompound | null> {
  const cid = await getCidByCas(casNumber);
  if (!cid) return null;

  const [properties, synonyms] = await Promise.all([
    getCompoundProperties(cid),
    getSynonyms(cid),
  ]);

  return {
    cid,
    casNumber,
    iupacName: properties?.IUPACName,
    molecularFormula: properties?.MolecularFormula,
    molecularWeight: properties?.MolecularWeight,
    canonicalSmiles: properties?.CanonicalSMILES,
    inchi: properties?.InChI,
    structureImageUrl: getStructureImageUrl(cid),
    structure2dUrl: getStructure2dUrl(cid),
    structure3dUrl: getStructure3dUrl(cid),
    synonyms,
  };
}

/**
 * 이름으로 전체 화합물 정보 조회 (통합)
 */
export async function getCompoundByName(name: string): Promise<PubChemCompound | null> {
  const cid = await getCidByName(name);
  if (!cid) return null;

  const [properties, synonyms] = await Promise.all([
    getCompoundProperties(cid),
    getSynonyms(cid),
  ]);

  return {
    cid,
    iupacName: properties?.IUPACName,
    molecularFormula: properties?.MolecularFormula,
    molecularWeight: properties?.MolecularWeight,
    canonicalSmiles: properties?.CanonicalSMILES,
    inchi: properties?.InChI,
    structureImageUrl: getStructureImageUrl(cid),
    structure2dUrl: getStructure2dUrl(cid),
    structure3dUrl: getStructure3dUrl(cid),
    synonyms,
  };
}

/**
 * SMILES로 구조식 이미지 URL 생성
 */
export function getStructureFromSmiles(smiles: string, size: number = 300): string {
  return `${PUBCHEM_BASE}/compound/smiles/${encodeURIComponent(smiles)}/PNG?image_size=${size}x${size}`;
}

/**
 * 분자식으로 화합물 검색
 */
export async function searchByFormula(formula: string): Promise<number[]> {
  try {
    const res = await fetch(
      `${PUBCHEM_BASE}/compound/fastformula/${encodeURIComponent(formula)}/cids/JSON?MaxRecords=10`,
      { next: { revalidate: 86400 } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.IdentifierList?.CID ?? [];
  } catch {
    return [];
  }
}
