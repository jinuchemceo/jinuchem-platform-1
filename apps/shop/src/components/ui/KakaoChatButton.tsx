'use client';

import { MessageCircle } from 'lucide-react';

export function KakaoChatButton() {
  const handleClick = () => {
    window.open('https://pf.kakao.com/_jinuchem', '_blank');
  };

  return (
    <button
      onClick={handleClick}
      className="fixed right-6 bottom-6 z-50 flex items-center gap-2 px-4 py-3 rounded-full shadow-lg hover:scale-105 transition-transform cursor-pointer border-0"
      style={{ backgroundColor: '#FEE500', color: '#3C1E1E', marginBottom: '60px' }}
      aria-label="카카오톡 상담"
    >
      {/* Kakao speech bubble icon */}
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 3C6.48 3 2 6.58 2 11c0 2.83 1.88 5.31 4.7 6.73-.15.56-.54 2.03-.62 2.34-.1.39.14.39.3.28.12-.08 1.94-1.31 2.73-1.85.61.09 1.24.14 1.89.14 5.52 0 10-3.58 10-8S17.52 3 12 3Z"
          fill="#3C1E1E"
        />
      </svg>
      <span className="text-sm font-semibold whitespace-nowrap">카카오톡 상담</span>
    </button>
  );
}
