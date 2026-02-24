import clsx from 'clsx';

export default function FormField({ label, children, required = false, className }) {
  return (
    <div className={clsx('space-y-1', className)}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
      {children}
    </div>
  );
}
