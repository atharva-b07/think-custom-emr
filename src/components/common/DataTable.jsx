'use client';

import clsx from 'clsx';

export default function DataTable({
  columns,
  data,
  onRowClick,
  showCheckbox = false,
  emptyMessage = 'No data available',
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            {showCheckbox && (
              <th className="px-4 py-3 w-10">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </th>
            )}
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {data && data.length > 0 ? (
            data.map((row, rowIndex) => (
              <tr
                key={row.id || rowIndex}
                onClick={() => onRowClick?.(row)}
                className={clsx(
                  'bg-white hover:bg-gray-50 transition-colors',
                  onRowClick && 'cursor-pointer'
                )}
              >
                {showCheckbox && (
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      onClick={(e) => e.stopPropagation()}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                )}
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className="px-4 py-3 text-gray-700 whitespace-nowrap"
                  >
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length + (showCheckbox ? 1 : 0)}
                className="px-4 py-12 text-center text-gray-500"
              >
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
