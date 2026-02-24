'use client';

import clsx from 'clsx';

export default function TabGroup({ tabs, activeTab, onTabChange }) {
  return (
    <div className="flex border-b border-gray-200">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onTabChange(tab.key)}
          className={clsx(
            'px-4 py-2.5 text-sm font-medium transition-colors relative whitespace-nowrap',
            activeTab === tab.key
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700 border-b-2 border-transparent'
          )}
        >
          {tab.label}
          {tab.count !== undefined && tab.count !== null && (
            <span
              className={clsx(
                'ml-2 inline-flex items-center justify-center rounded-full px-2 py-0.5 text-xs font-medium',
                activeTab === tab.key
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-600'
              )}
            >
              {tab.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
