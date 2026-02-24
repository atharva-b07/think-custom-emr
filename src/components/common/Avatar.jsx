import clsx from 'clsx';

const colors = [
  'bg-blue-500',
  'bg-green-500',
  'bg-purple-500',
  'bg-orange-500',
  'bg-pink-500',
  'bg-teal-500',
];

export default function Avatar({ name, size = 'md', className }) {
  const initials =
    name
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || '?';

  const colorIndex = name ? name.charCodeAt(0) % colors.length : 0;

  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
  };

  return (
    <div
      className={clsx(
        'rounded-full flex items-center justify-center text-white font-semibold',
        colors[colorIndex],
        sizes[size],
        className
      )}
    >
      {initials}
    </div>
  );
}
