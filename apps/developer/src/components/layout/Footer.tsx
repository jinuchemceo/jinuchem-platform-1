import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-slate-800 text-slate-400 py-10 px-12">
      <div className="flex justify-between items-start gap-10">
        {/* Company Info */}
        <div className="flex-1">
          <div className="text-2xl font-bold text-white mb-4 tracking-tight">
            Jinuchem
          </div>
          <div className="flex gap-3 mb-4 text-sm">
            <Link href="#" className="text-slate-200 font-semibold hover:text-white">
              개인정보처리방침
            </Link>
            <span className="text-slate-600">|</span>
            <Link href="#" className="text-slate-200 font-semibold hover:text-white">
              서비스 이용약관
            </Link>
            <span className="text-slate-600">|</span>
            <Link href="#" className="text-slate-200 font-semibold hover:text-white">
              API 이용약관
            </Link>
          </div>
          <div className="text-sm leading-7">
            <p>상호명 : (주)지누켐</p>
            <p>사업자번호 : 470-81-02870</p>
            <p>대표자명 : 김병선</p>
            <p>주소 : 경상남도 진주시 진주대로501, 창업보육센터 C동 214호</p>
            <p>연락처 : 010-5651-1053</p>
            <p>e-mail : jinuchem.reagent@gmail.com</p>
          </div>
          <div className="text-slate-500 text-xs mt-2">
            Copyright &copy; JINUCHEM All rights reserved.
          </div>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col gap-3 shrink-0">
          <Link
            href="#"
            className="inline-flex items-center gap-2 px-6 py-3 border border-slate-600 rounded-lg text-slate-200 text-sm font-medium hover:border-white hover:text-white transition-colors"
          >
            JINU Shop 바로가기
          </Link>
          <Link
            href="#"
            className="inline-flex items-center gap-2 px-6 py-3 border border-slate-600 rounded-lg text-slate-200 text-sm font-medium hover:border-white hover:text-white transition-colors"
          >
            기술 지원 문의
          </Link>
        </div>
      </div>
    </footer>
  );
}
