export const appointments = [
  {
    id: 1,
    location: 'Location 1',
    room: 'Room 1',
    providerName: 'Dr. Rebecca Shaw',
    time: '09:00 AM - 09:30 AM',
    appointmentType: 'New',
    intakeFormStatus: 'Completed',
    insuranceEligibilityStatus: 'Verified',
    patientName: 'John Anderson',
    patientDOB: '03/15/1971',
    patientAge: 54,
    patientGender: 'Male',
    contactNumber: '(555) 123-4567',
  },
  {
    id: 2,
    location: 'Virtual',
    room: 'Room 3',
    providerName: 'Dr. James Carter',
    time: '10:00 AM - 10:30 AM',
    appointmentType: 'Follow Up',
    intakeFormStatus: 'Pending',
    insuranceEligibilityStatus: 'Pending',
    patientName: 'Sarah Mitchell',
    patientDOB: '07/22/1987',
    patientAge: 38,
    patientGender: 'Female',
    contactNumber: '(555) 987-6543',
  },
  {
    id: 3,
    location: 'Location 2',
    room: 'Room 5',
    providerName: 'Dr. Priya Patel',
    time: '11:00 AM - 11:45 AM',
    appointmentType: 'New',
    intakeFormStatus: 'Completed',
    insuranceEligibilityStatus: 'Verified',
    patientName: 'Robert Williams',
    patientDOB: '11/05/1958',
    patientAge: 67,
    patientGender: 'Male',
    contactNumber: '(555) 456-7890',
  },
];

export const locations = ['Virtual', 'Location 1', 'Location 2', 'Location 3'];

export const rooms = ['Room 1', 'Room 2', 'Room 3', 'Room 5', 'Room 7'];

export const statuses = ['Scheduled', 'Checked In', 'In Exam', 'Completed', 'Cancelled'];

export const appointmentTypes = ['New', 'Follow Up'];
