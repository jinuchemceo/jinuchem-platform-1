import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');

  if (code) {
    // OAuth 콜백 처리 (Google, GitHub 등)
    // TODO: Supabase에서 code를 세션으로 교환
  }

  return NextResponse.redirect(new URL('/dashboard', request.url));
}
