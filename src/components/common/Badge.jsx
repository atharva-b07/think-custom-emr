import clsx from 'clsx';

const variantClasses = {
  primary: 'bg-blue-100 text-blue-800',
  success: 'bg-green-100 text-green-800',
  warning: 'bg-yellow-100 text-yellow-800',
  danger: 'bg-red-100 text-red-800',
  info: 'bg-sky-100 text-sky-800',
  secondary: 'bg-gray-100 text-gray-800',
  purple: 'bg-purple-100 text-purple-800',
  orange: 'bg-orange-100 text-orange-800',
  cyan: 'bg-cyan-100 text-cyan-800',
  pink: 'bg-pink-100 text-pink-800',
  blue: 'bg-blue-100 text-blue-800',
  red: 'bg-red-100 text-red-800',
  green: 'bg-green-100 text-green-800',
  yellow: 'bg-yellow-100 text-yellow-800',
};

const sizeClasses = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
};

export default function Badge({ label, variant = 'primary', size = 'sm' }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full font-medium',
        variantClasses[variant] || variantClasses.primary,
        sizeClasses[size] || sizeClasses.sm
      )}
    >
      {label}
    </span>
  );
}
