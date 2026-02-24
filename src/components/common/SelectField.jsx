'use client';

import FormField from './FormField';

export default function SelectField({
  label,
  value,
  onChange,
  options = [],
  placeholder = 'Select...',
  required = false,
}) {
  return (
    <FormField label={label} required={required}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="w-full border border-gray-300 rounded-lg p-2.5 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </FormField>
  );
}
