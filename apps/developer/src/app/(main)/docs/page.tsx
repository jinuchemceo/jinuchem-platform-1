'use client';

import { useState } from 'react';
import { Copy, Check, ChevronDown, ChevronRight, Lock, Globe } from 'lucide-react';

interface Endpoint {
  method: 'GET' | 'POST';
  path: string;
  description: string;
  auth: boolean;
}

interface EndpointGroup {
  category: string;
  categoryKo: string;
  endpoints: Endpoint[];
}

const endpointGroups: EndpointGroup[] = [
  {
    category: 'Products',
    categoryKo: '제품',
    endpoints: [
      { method: 'GET', path: '/api/v1/products', description: '제품 목록 조회 (페이지네이션, 필터링)', auth: true },
      { method: 'GET', path: '/api/v1/products/:id', description: '제품 상세 정보 조회', auth: true },
      { method: 'GET', path: '/api/v1/products/search', description: '제품 검색 (시약명, CAS번호, 분자식)', auth: true },
    ],
  },
  {
    category: 'Chemicals',
    categoryKo: '화학물질',
    endpoints: [
      { method: 'GET', path: '/api/v1/chemicals/:cas', description: 'CAS번호 기반 화학물질 정보 조회', auth: true },
      { method: 'GET', path: '/api/v1/chemicals/:cas/suppliers', description: '화학물질별 공급사/가격 비교', auth: true },
    ],
  },
  {
    category: 'Pricing',
    categoryKo: '가격',
    endpoints: [
      { method: 'GET', path: '/api/v1/pricing/:productId', description: '제품별 가격 이력 조회', auth: true },
      { method: 'GET', path: '/api/v1/pricing/compare', description: '복수 제품 가격 비교', auth: true },
    ],
  },
  {
    category: 'AI',
    categoryKo: 'AI',
    endpoints: [
      { method: 'POST', path: '/api/v1/ai/recommend', description: 'AI 시약 추천 (구매이력 기반)', auth: true },
      { method: 'POST', path: '/api/v1/ai/predict', description: 'AI 소모량/예산 예측', auth: true },
      { method: 'POST', path: '/api/v1/ai/analytics', description: 'AI 구매 패턴 분석 리포트', auth: true },
    ],
  },
  {
    category: 'Knowledge Graph',
    categoryKo: '지식 그래프',
    endpoints: [
      { method: 'GET', path: '/api/v1/knowledge/:cas/relations', description: '시약 관계/호환성/대체품 조회', auth: true },
    ],
  },
];

const codeSamples = {
  curl: `curl -X GET "https://api.jinuchem.com/v1/products?page=1&limit=20" \\
  -H "Authorization: Bearer jk_live_your_api_key" \\
  -H "Content-Type: application/json"`,
  python: `import requests

API_KEY = "jk_live_your_api_key"
BASE_URL = "https://api.jinuchem.com/v1"

headers = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json"
}

# 제품 목록 조회
response = requests.get(
    f"{BASE_URL}/products",
    headers=headers,
    params={"page": 1, "limit": 20}
)

products = response.json()
print(f"총 {products['total']}개 제품")`,
  javascript: `const API_KEY = 'jk_live_your_api_key';
const BASE_URL = 'https://api.jinuchem.com/v1';

// 제품 목록 조회
const response = await fetch(\`\${BASE_URL}/products?page=1&limit=20\`, {
  headers: {
    'Authorization': \`Bearer \${API_KEY}\`,
    'Content-Type': 'application/json',
  },
});

const products = await response.json();
console.log(\`총 \${products.total}개 제품\`);`,
};

type CodeLang = keyof typeof codeSamples;

const methodColors: Record<string, string> = {
  GET: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  POST: 'bg-blue-100 text-blue-700 border-blue-200',
};

export default function DocsPage() {
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    Products: true,
    Chemicals: true,
    Pricing: true,
    AI: true,
    'Knowledge Graph': true,
  });
  const [selectedLang, setSelectedLang] = useState<CodeLang>('curl');
  const [copied, setCopied] = useState(false);

  const toggleGroup = (category: string) => {
    setOpenGroups((prev) => ({ ...prev, [category]: !prev[category] }));
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--text)]">API 문서</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">JINUCHEM External API v1 레퍼런스</p>
      </div>

      {/* Base URL */}
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5">
        <h2 className="text-base font-semibold text-[var(--text)] mb-3">Base URL</h2>
        <div className="flex items-center gap-3">
          <code className="flex-1 bg-slate-900 text-emerald-400 px-4 py-2.5 rounded-lg text-sm font-mono">
            https://api.jinuchem.com/v1
          </code>
          <button
            onClick={() => handleCopy('https://api.jinuchem.com/v1')}
            className="w-9 h-9 flex items-center justify-center rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
          </button>
        </div>
      </div>

      {/* Authentication */}
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <Lock size={18} className="text-blue-600" />
          <h2 className="text-base font-semibold text-[var(--text)]">인증 (Authentication)</h2>
        </div>
        <p className="text-sm text-[var(--text-secondary)] mb-3">
          모든 API 요청에는 API Key 인증이 필요합니다. API Key는 개발자 포털의 API Keys 페이지에서 발급받을 수 있습니다.
        </p>
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
          <p className="text-sm text-[var(--text)] mb-2 font-medium">요청 헤더에 API Key 포함:</p>
          <code className="text-sm font-mono text-blue-600">
            Authorization: Bearer jk_live_your_api_key
          </code>
        </div>
        <div className="mt-3 grid grid-cols-4 gap-3">
          <div className="p-3 bg-[var(--bg)] rounded-lg text-center">
            <div className="text-xs text-[var(--text-secondary)]">Free</div>
            <div className="text-sm font-bold text-[var(--text)] mt-1">100/일</div>
          </div>
          <div className="p-3 bg-[var(--bg)] rounded-lg text-center">
            <div className="text-xs text-[var(--text-secondary)]">Basic</div>
            <div className="text-sm font-bold text-[var(--text)] mt-1">1,000/일</div>
          </div>
          <div className="p-3 bg-[var(--bg)] rounded-lg text-center">
            <div className="text-xs text-[var(--text-secondary)]">Pro</div>
            <div className="text-sm font-bold text-[var(--text)] mt-1">5,000/일</div>
          </div>
          <div className="p-3 bg-[var(--bg)] rounded-lg text-center">
            <div className="text-xs text-[var(--text-secondary)]">Enterprise</div>
            <div className="text-sm font-bold text-[var(--text)] mt-1">50,000/일</div>
          </div>
        </div>
      </div>

      {/* Endpoints */}
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Globe size={18} className="text-blue-600" />
          <h2 className="text-base font-semibold text-[var(--text)]">엔드포인트 (12개)</h2>
        </div>

        <div className="space-y-2">
          {endpointGroups.map((group) => {
            const isOpen = openGroups[group.category] ?? false;
            return (
              <div key={group.category} className="border border-[var(--border)] rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleGroup(group.category)}
                  className="flex items-center w-full gap-3 px-4 py-3 bg-[var(--bg)] hover:bg-gray-50 transition-colors text-left"
                >
                  {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  <span className="text-sm font-semibold text-[var(--text)]">{group.categoryKo}</span>
                  <span className="text-xs text-[var(--text-secondary)]">({group.category})</span>
                  <span className="ml-auto text-xs text-[var(--text-secondary)]">{group.endpoints.length}개</span>
                </button>
                {isOpen && (
                  <div className="divide-y divide-[var(--border)]">
                    {group.endpoints.map((ep) => (
                      <div
                        key={ep.path}
                        className="flex items-center gap-4 px-4 py-3 hover:bg-blue-50/50 transition-colors cursor-pointer"
                      >
                        <span className={`text-xs font-bold px-2 py-0.5 rounded border ${methodColors[ep.method]}`}>
                          {ep.method}
                        </span>
                        <code className="text-sm font-mono text-[var(--text)] flex-shrink-0">{ep.path}</code>
                        <span className="text-sm text-[var(--text-secondary)] flex-1 text-right truncate">{ep.description}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Code Samples */}
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5">
        <h2 className="text-base font-semibold text-[var(--text)] mb-4">코드 샘플</h2>
        <div className="flex items-center gap-1 mb-3">
          {(['curl', 'python', 'javascript'] as CodeLang[]).map((lang) => (
            <button
              key={lang}
              onClick={() => setSelectedLang(lang)}
              className={`px-4 h-[var(--btn-height)] text-sm rounded-lg transition-colors ${
                selectedLang === lang
                  ? 'bg-blue-600 text-white font-medium'
                  : 'bg-[var(--bg)] text-[var(--text-secondary)] hover:bg-gray-100 border border-[var(--border)]'
              }`}
            >
              {lang === 'curl' ? 'cURL' : lang === 'python' ? 'Python' : 'JavaScript'}
            </button>
          ))}
        </div>
        <div className="relative">
          <pre className="bg-slate-900 text-slate-100 rounded-lg p-4 overflow-x-auto text-sm font-mono leading-relaxed">
            {codeSamples[selectedLang]}
          </pre>
          <button
            onClick={() => handleCopy(codeSamples[selectedLang])}
            className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-md bg-slate-700 text-slate-300 hover:bg-slate-600 transition-colors"
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
          </button>
        </div>
      </div>
    </div>
  );
}
