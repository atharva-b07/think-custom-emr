import clsx from 'clsx';

const statusStyles = {
  'Rejected': 'bg-red-100 text-red-800',
  'Accepted': 'bg-green-100 text-green-800',
  'Closed': 'bg-gray-100 text-gray-800',
  'Re-submitted': 'bg-orange-100 text-orange-800',
  'Submitted': 'bg-blue-100 text-blue-800',
  'Secondary Claim': 'bg-blue-100 text-blue-800',
  'Partial - Paid': 'bg-purple-100 text-purple-800',
  'Pending': 'bg-yellow-100 text-yellow-800',
  'Completed': 'bg-green-100 text-green-800',
  'Partially Approved': 'bg-blue-100 text-blue-800',
  'To Be Previewed': 'bg-orange-100 text-orange-800',
  'NEW': 'bg-green-100 text-green-800',
  'Unsigned': 'bg-yellow-100 text-yellow-800',
  'Co-Sign': 'bg-blue-100 text-blue-800',
  'In Exam': 'bg-blue-100 text-blue-800',
  'Checked In': 'bg-green-100 text-green-800',
  'Scheduled': 'bg-gray-100 text-gray-800',
  'Active': 'bg-green-100 text-green-800',
  'Inactive': 'bg-red-100 text-red-800',
};

export default function StatusBadge({ status }) {
  const style = statusStyles[status] || 'bg-gray-100 text-gray-800';

  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-3 py-1 text-xs font-medium',
        style
      )}
    >
      {status}
    </span>
  );
}
