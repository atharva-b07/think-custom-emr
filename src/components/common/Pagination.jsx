'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import clsx from 'clsx';

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  const getPageNumbers = () => {
    const pages = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage > 3) {
        pages.push('...');
      }

      // Show pages around current
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push('...');
      }

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-1">
      {/* Previous button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={clsx(
          'flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors',
          currentPage === 1
            ? 'text-gray-300 cursor-not-allowed'
            : 'text-gray-600 hover:bg-gray-100'
        )}
      >
        <ChevronLeft className="w-4 h-4" />
        Previous
      </button>

      {/* Page numbers */}
      {getPageNumbers().map((page, index) =>
        page === '...' ? (
          <span key={`dots-${index}`} className="px-2 py-2 text-sm text-gray-400">
            ...
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={clsx(
              'w-9 h-9 flex items-center justify-center text-sm font-medium rounded-lg transition-colors',
              currentPage === page
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            )}
          >
            {page}
          </button>
        )
      )}

      {/* Next button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={clsx(
          'flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors',
          currentPage === totalPages
            ? 'text-gray-300 cursor-not-allowed'
            : 'text-gray-600 hover:bg-gray-100'
        )}
      >
        Next
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
