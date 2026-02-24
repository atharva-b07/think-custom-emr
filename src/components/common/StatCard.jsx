'use client';

import clsx from 'clsx';

export default function StatCard({ label, value, isActive, onClick, icon, className }) {
  return (
    <div
      onClick={onClick}
      className={clsx(
        'bg-white rounded-lg border p-4 transition-all duration-200',
        isActive && 'border-l-4 border-l-blue-600',
        onClick && 'cursor-pointer hover:shadow-md',
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">
            {label}
          </p>
          <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
        </div>
        {icon && (
          <div className="text-gray-400">{icon}</div>
        )}
      </div>
    </div>
  );
}
