'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Mail, Lock, FlaskConical } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // TODO: Supabase Auth 실제 연동
      // const { data, error } = await supabase.auth.signInWithPassword({ email, password });

      // 데모용: 이메일로 역할 판별하여 라우팅
      if (email === 'researcher@gnu.ac.kr') {
        router.push('/dashboard');
      } else if (email === 'supplier@jinuchem.com') {
        window.location.href = 'http://localhost:3002';
      } else if (email === 'admin@jinuchem.com') {
        window.location.href = 'http://localhost:3003';
      } else if (email && password) {
        router.push('/dashboard');
      } else {
        setError('이메일과 비밀번호를 입력해주세요.');
      }
    } catch {
      setError('로그인에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[420px]">
      {/* Logo */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4">
          <FlaskConical size={32} className="text-white" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">JINU Shop</h1>
        <p className="text-sm text-gray-500 mt-1">B2B 시약/소모품 통합 구매 플랫폼</p>
      </div>

      {/* Login Form */}
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">로그인</h2>

        {error && (
          <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">이메일</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@organization.ac.kr"
                className="w-full h-[42px] pl-10 pr-4 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">비밀번호</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="8자 이상 영문+숫자+특수문자"
                className="w-full h-[42px] pl-10 pr-10 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
              <input type="checkbox" className="accent-blue-600" />
              로그인 상태 유지
            </label>
            <a href="#" className="text-sm text-blue-600 hover:underline">
              비밀번호 찾기
            </a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-[42px] bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? '로그인 중...' : '로그인'}
          </button>
        </form>

        {/* Demo accounts */}
        <div className="mt-6 pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-400 mb-3 text-center">데모 계정</p>
          <div className="space-y-1.5">
            {[
              { email: 'researcher@gnu.ac.kr', role: '연구원', color: 'bg-blue-100 text-blue-700' },
              { email: 'professor@gnu.ac.kr', role: '조직관리자', color: 'bg-green-100 text-green-700' },
              { email: 'supplier@jinuchem.com', role: '공급자', color: 'bg-purple-100 text-purple-700' },
              { email: 'admin@jinuchem.com', role: '관리자', color: 'bg-orange-100 text-orange-700' },
            ].map((demo) => (
              <button
                key={demo.email}
                onClick={() => { setEmail(demo.email); setPassword('demo1234!'); }}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-50 text-left transition-colors"
              >
                <span className="text-xs text-gray-600 font-mono">{demo.email}</span>
                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${demo.color}`}>
                  {demo.role}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Sign Up Link */}
      <div className="text-center mt-6">
        <span className="text-sm text-gray-500">계정이 없으신가요? </span>
        <Link href="/signup" className="text-sm text-blue-600 font-medium hover:underline">
          회원가입
        </Link>
      </div>

      {/* Platform Links */}
      <div className="flex justify-center gap-4 mt-4">
        <span className="text-xs text-gray-400">JINUCHEM 플랫폼:</span>
        <a href="http://localhost:3001" className="text-xs text-gray-500 hover:text-blue-600">E-Note</a>
        <a href="http://localhost:3002" className="text-xs text-gray-500 hover:text-blue-600">공급사</a>
        <a href="http://localhost:3004" className="text-xs text-gray-500 hover:text-blue-600">API</a>
      </div>
    </div>
  );
}
