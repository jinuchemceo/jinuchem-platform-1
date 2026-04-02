import Link from 'next/link';

export function Footer() {
  return (
    <footer
      className="px-8 py-8"
      style={{
        background: 'var(--bg-secondary)',
        borderTop: '0.5px solid var(--border)',
      }}
    >
      <div className="flex flex-wrap justify-between items-start gap-8 max-w-5xl">
        {/* Brand + Info */}
        <div className="flex-1 min-w-[260px]">
          <p
            className="text-[17px] font-bold tracking-tight mb-3"
            style={{ color: 'var(--text)' }}
          >
            Jinuchem
          </p>

          {/* Policy links */}
          <div className="flex gap-4 mb-4">
            <Link
              href="#"
              className="text-[13px] font-semibold transition-opacity hover:opacity-70"
              style={{ color: 'var(--text)' }}
            >
              개인정보처리방침
            </Link>
            <Link
              href="#"
              className="text-[13px] transition-opacity hover:opacity-70"
              style={{ color: 'var(--text-secondary)' }}
            >
              서비스 이용약관
            </Link>
          </div>

          {/* Company info */}
          <div
            className="text-[12px] leading-[1.9]"
            style={{ color: 'var(--text-secondary)' }}
          >
            <p>상호명 : (주)지누켐 &nbsp;|&nbsp; 사업자번호 : 470-81-02870</p>
            <p>대표자명 : 김병선</p>
            <p>주소 : 경상남도 진주시 진주대로501, 창업보육센터 C동 214호</p>
            <p>연락처 : 010-5651-1053 &nbsp;|&nbsp; jinuchem.reagent@gmail.com</p>
          </div>

          <p
            className="text-[11px] mt-3"
            style={{ color: 'var(--text-tertiary)' }}
          >
            Copyright &copy; {new Date().getFullYear()} JINUCHEM. All rights reserved.
          </p>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col gap-2 shrink-0">
          <Link
            href="#"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[10px] text-[14px] font-medium transition-opacity hover:opacity-80"
            style={{
              background: 'var(--primary-light)',
              color: 'var(--primary)',
            }}
          >
            지누 E-Note 바로가기
          </Link>
          <Link
            href="#"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[10px] text-[14px] transition-opacity hover:opacity-80"
            style={{
              background: 'var(--bg-card)',
              color: 'var(--text-secondary)',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            지누 E-Note 매뉴얼
          </Link>
        </div>
      </div>
    </footer>
  );
}
