'use client';

import { Filter } from 'lucide-react';
import clsx from 'clsx';

export default function FilterButton({ onClick, isActive = false }) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        'flex items-center gap-2 px-4 py-2.5 border rounded-lg text-sm font-medium transition-colors',
        isActive
          ? 'border-blue-500 bg-blue-50 text-blue-600'
          : 'border-gray-300 bg-white text-gray-600 hover:bg-gray-50'
      )}
    >
      <Filter className="w-4 h-4" />
      Filters
    </button>
  );
}
