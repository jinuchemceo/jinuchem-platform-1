'use client';

import { ChevronRight, ChevronsRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const getPageNumbers = (): (number | 'ellipsis')[] => {
    const pages: (number | 'ellipsis')[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible + 2) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }

    pages.push(1);

    let start = Math.max(2, currentPage - 1);
    let end = Math.min(totalPages - 1, currentPage + 1);

    if (currentPage <= 3) {
      start = 2;
      end = maxVisible;
    } else if (currentPage >= totalPages - 2) {
      start = totalPages - maxVisible + 1;
      end = totalPages - 1;
    }

    if (start > 2) pages.push('ellipsis');
    for (let i = start; i <= end; i++) pages.push(i);
    if (end < totalPages - 1) pages.push('ellipsis');

    pages.push(totalPages);
    return pages;
  };

  const baseBtn = 'w-9 h-9 rounded-full flex items-center justify-center text-sm transition-colors';

  return (
    <div className="flex items-center justify-center gap-1.5">
      {getPageNumbers().map((page, idx) =>
        page === 'ellipsis' ? (
          <span key={`ellipsis-${idx}`} className="w-9 h-9 flex items-center justify-center text-sm text-[var(--text-secondary)]">
            ...
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`${baseBtn} ${
              currentPage === page
                ? 'bg-gray-900 text-white font-medium'
                : 'border border-[var(--border)] text-[var(--text)] hover:bg-gray-100'
            }`}
          >
            {page}
          </button>
        )
      )}

      {/* Next page */}
      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className={`${baseBtn} border border-[var(--border)] ${
          currentPage === totalPages
            ? 'text-gray-300 cursor-not-allowed'
            : 'text-[var(--text)] hover:bg-gray-100'
        }`}
      >
        <ChevronRight size={16} />
      </button>

      {/* Last page */}
      <button
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
        className={`${baseBtn} border border-[var(--border)] ${
          currentPage === totalPages
            ? 'text-gray-300 cursor-not-allowed'
            : 'text-[var(--text)] hover:bg-gray-100'
        }`}
      >
        <ChevronsRight size={16} />
      </button>
    </div>
  );
}
