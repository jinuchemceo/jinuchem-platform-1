'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface BannerData {
  id: string;
  title: string;
  description: string;
  type: string;
  imageGradient: string;
  linkUrl?: string;
}

const activeBanners: BannerData[] = [
  {
    id: 'BN-001',
    title: '봄맞이 시약 할인전',
    description:
      '유기화합물 전 품목 15% 할인! 3월 한정 특별 프로모션입니다. 지금 바로 할인된 가격으로 구매하세요.',
    type: '프로모션',
    imageGradient: 'from-blue-500 to-purple-600',
    linkUrl: '/order',
  },
];

const STORAGE_KEY = 'jinushop_banner_hide_until';

export default function BannerPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [hideToday, setHideToday] = useState(false);

  useEffect(() => {
    const hideUntil = localStorage.getItem(STORAGE_KEY);
    if (hideUntil) {
      const now = new Date();
      const hideDate = new Date(hideUntil);
      if (now < hideDate) {
        return;
      }
    }
    setIsOpen(true);
  }, []);

  const handleClose = () => {
    if (hideToday) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      localStorage.setItem(STORAGE_KEY, tomorrow.toISOString());
    }
    setIsOpen(false);
  };

  if (!isOpen || activeBanners.length === 0) {
    return null;
  }

  const banner = activeBanners[0];

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center animate-in fade-in duration-200"
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-4 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image / Gradient Area */}
        <div
          className={`bg-gradient-to-r ${banner.imageGradient} p-8 relative h-48 flex flex-col justify-end`}
        >
          <button
            onClick={handleClose}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
            aria-label="닫기"
          >
            <X size={16} />
          </button>
          <span className="inline-block px-3 py-1 text-xs font-medium text-white bg-white/30 rounded-full w-fit mb-3">
            {banner.type}
          </span>
          <h2 className="text-2xl font-bold text-white">{banner.title}</h2>
        </div>

        {/* Description */}
        <div className="p-6">
          <p className="text-sm text-gray-600 leading-relaxed mb-5">
            {banner.description}
          </p>
          {banner.linkUrl && (
            <a
              href={banner.linkUrl}
              className="inline-block bg-blue-600 text-white rounded-lg px-6 py-2.5 text-sm font-medium hover:bg-blue-700 transition-colors"
              onClick={handleClose}
            >
              자세히 보기
            </a>
          )}
        </div>

        {/* Bottom Bar */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between bg-gray-50">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={hideToday}
              onChange={(e) => setHideToday(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-blue-600"
            />
            <span className="text-sm text-gray-500">오늘 하루 안보기</span>
          </label>
          <button
            onClick={handleClose}
            className="text-sm text-gray-500 hover:text-gray-700 font-medium transition-colors"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
