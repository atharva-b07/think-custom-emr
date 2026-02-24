'use client';

import FormField from './FormField';

export default function InputField({
  label,
  value,
  onChange,
  placeholder = '',
  type = 'text',
  required = false,
}) {
  return (
    <FormField label={label} required={required}>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full border border-gray-300 rounded-lg p-2.5 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
      />
    </FormField>
  );
}
