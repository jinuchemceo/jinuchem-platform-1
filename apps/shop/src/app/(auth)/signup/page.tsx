'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Mail, Lock, User, Building2, FlaskConical, Phone, Beaker } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState(1); // 1: 기본정보, 2: 조직정보
  const [form, setForm] = useState({
    email: '', password: '', confirmPassword: '', name: '', phone: '',
    role: 'researcher', orgName: '', department: '', labName: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const updateForm = (key: string, value: string) => setForm({ ...form, [key]: value });

  const handleNext = () => {
    if (!form.email || !form.password || !form.name) {
      setError('필수 항목을 모두 입력해주세요.');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }
    if (form.password.length < 8) {
      setError('비밀번호는 8자 이상이어야 합니다.');
      return;
    }
    setError('');
    setStep(2);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
          name: form.name,
          phone: form.phone,
          role: form.role,
          orgName: form.orgName,
          department: form.department,
          labName: form.labName,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || '회원가입에 실패했습니다.');
        return;
      }

      alert('회원가입이 완료되었습니다. 로그인해주세요.');
      router.push('/login');
    } catch {
      setError('회원가입에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[480px]">
      {/* Logo */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-600 rounded-2xl mb-3">
          <FlaskConical size={28} className="text-white" />
        </div>
        <h1 className="text-xl font-bold text-gray-900">JINU Shop 회원가입</h1>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center justify-center gap-3 mb-6">
        <div className={`flex items-center gap-2 ${step >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>1</div>
          <span className="text-sm font-medium">기본 정보</span>
        </div>
        <div className="w-8 h-px bg-gray-300" />
        <div className={`flex items-center gap-2 ${step >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>2</div>
          <span className="text-sm font-medium">조직 정보</span>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-8">
        {error && (
          <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
            {error}
          </div>
        )}

        {step === 1 ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">이름 *</label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" value={form.name} onChange={(e) => updateForm('name', e.target.value)} placeholder="홍길동" className="w-full h-[42px] pl-10 pr-4 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" required />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">이메일 *</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="email" value={form.email} onChange={(e) => updateForm('email', e.target.value)} placeholder="name@organization.ac.kr" className="w-full h-[42px] pl-10 pr-4 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" required />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">연락처</label>
              <div className="relative">
                <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="tel" value={form.phone} onChange={(e) => updateForm('phone', e.target.value)} placeholder="010-0000-0000" className="w-full h-[42px] pl-10 pr-4 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">비밀번호 *</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type={showPassword ? 'text' : 'password'} value={form.password} onChange={(e) => updateForm('password', e.target.value)} placeholder="8자 이상" className="w-full h-[42px] pl-10 pr-10 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">비밀번호 확인 *</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="password" value={form.confirmPassword} onChange={(e) => updateForm('confirmPassword', e.target.value)} placeholder="비밀번호 재입력" className="w-full h-[42px] pl-10 pr-4 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" required />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">역할 *</label>
              <select value={form.role} onChange={(e) => updateForm('role', e.target.value)} className="w-full h-[42px] px-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="researcher">연구원</option>
                <option value="org_admin">조직관리자</option>
                <option value="supplier">공급자</option>
              </select>
            </div>
            <button onClick={handleNext} className="w-full h-[42px] bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700">
              다음 단계
            </button>
          </div>
        ) : (
          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">소속 기관 *</label>
              <div className="relative">
                <Building2 size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" value={form.orgName} onChange={(e) => updateForm('orgName', e.target.value)} placeholder="경상국립대학교" className="w-full h-[42px] pl-10 pr-4 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" required />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">부서/학과</label>
              <input type="text" value={form.department} onChange={(e) => updateForm('department', e.target.value)} placeholder="화학과" className="w-full h-[42px] px-4 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">실험실명</label>
              <div className="relative">
                <Beaker size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" value={form.labName} onChange={(e) => updateForm('labName', e.target.value)} placeholder="유기화학실험실" className="w-full h-[42px] pl-10 pr-4 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setStep(1)} className="flex-1 h-[42px] border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50">
                이전
              </button>
              <button type="submit" disabled={loading} className="flex-1 h-[42px] bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50">
                {loading ? '가입 중...' : '회원가입'}
              </button>
            </div>
          </form>
        )}
      </div>

      <div className="text-center mt-6">
        <span className="text-sm text-gray-500">이미 계정이 있으신가요? </span>
        <Link href="/login" className="text-sm text-blue-600 font-medium hover:underline">로그인</Link>
      </div>
    </div>
  );
}
