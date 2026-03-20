// ================================================================
// PubChem API 프록시 — CAS번호로 구조식 + 화학물질 정보 조회
// ================================================================

import { NextRequest, NextResponse } from 'next/server';
import { getCompoundByCas, getCompoundByName } from '@jinuchem/shared/services/pubchem';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const cas = searchParams.get('cas');
  const name = searchParams.get('name');

  if (!cas && !name) {
    return NextResponse.json(
      { error: 'cas 또는 name 파라미터가 필요합니다' },
      { status: 400 }
    );
  }

  try {
    const compound = cas
      ? await getCompoundByCas(cas)
      : await getCompoundByName(name!);

    if (!compound) {
      return NextResponse.json(
        { error: '화합물을 찾을 수 없습니다' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: compound });
  } catch (error) {
    return NextResponse.json(
      { error: 'PubChem API 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}
