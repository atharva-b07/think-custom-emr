export const prescriptions = [
  {
    id: 1,
    prescriptionId: 'RX-10254',
    requestType: 'Renewal',
    dateTime: '2026-02-24 09:15 AM',
    patientName: 'John Anderson',
    totalMedication: 3,
    overallStatus: 'Partially Approved',
    from: 'Dr. Rebecca Shaw',
    pharmacy: 'CVS Pharmacy - Main St',
  },
  {
    id: 2,
    prescriptionId: 'RX-10255',
    requestType: 'Change',
    dateTime: '2026-02-23 02:30 PM',
    patientName: 'Sarah Mitchell',
    totalMedication: 2,
    overallStatus: 'Completed',
    from: 'Dr. James Carter',
    pharmacy: 'Walgreens - Oak Avenue',
  },
  {
    id: 3,
    prescriptionId: 'RX-10256',
    requestType: 'Pending',
    dateTime: '2026-02-23 11:00 AM',
    patientName: 'Robert Williams',
    totalMedication: 5,
    overallStatus: 'Pending',
    from: 'Dr. Priya Patel',
    pharmacy: 'Rite Aid - Elm Street',
  },
];

export const stats = [
  { label: 'PENDING', value: 28, color: 'yellow' },
  { label: 'SENT', value: 26, color: 'blue' },
  { label: 'PRIOR AUTHORIZATION REQUIRED', value: 14, color: 'red' },
  { label: 'PICKED UP', value: 0, color: 'green' },
];
