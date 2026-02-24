/* ═══════════════════════════════════════════════════════════════════════════
   NOTIFICATION CARDS (Provider Dashboard)
   ═══════════════════════════════════════════════════════════════════════════ */
export const notifications = [
  { id: 1, label: 'Patient Intake Forms', count: 17, color: '#4A90D9' },
  { id: 2, label: 'eRX Request', count: 29, color: '#F5A623' },
  { id: 3, label: 'Lab Results', count: 7, color: '#7B68EE' },
  { id: 4, label: 'Faxes', count: 17, color: '#50C878' },
  { id: 5, label: 'Referrals', count: 6, color: '#FF6B6B' },
  { id: 6, label: 'Tasks', count: 10, color: '#20B2AA' },
  { id: 7, label: 'Unsigned Encounter', count: 5, color: '#FF8C00' },
  { id: 8, label: 'Claim Received', count: 2, color: '#9370DB' },
];

/* ═══════════════════════════════════════════════════════════════════════════
   APPOINTMENTS (Provider + Staff)
   ═══════════════════════════════════════════════════════════════════════════ */
export const appointments = [
  {
    id: 1,
    time: '09:00 AM',
    duration: '30 min',
    patientName: 'John Anderson',
    type: 'In-Person',
    status: 'In Exam',
    description: 'Annual physical examination and blood work review',
    isHighlighted: true,
  },
  {
    id: 2,
    time: '09:30 AM',
    duration: '20 min',
    patientName: 'Sarah Mitchell',
    type: 'Virtual',
    status: 'Checked In',
    description: 'Follow-up consultation for medication adjustment',
    isHighlighted: false,
  },
  {
    id: 3,
    time: '10:00 AM',
    duration: '45 min',
    patientName: 'Robert Williams',
    type: 'In-Person',
    status: 'Scheduled',
    description: 'New patient intake and comprehensive health assessment',
    isHighlighted: false,
  },
  {
    id: 4,
    time: '10:45 AM',
    duration: '30 min',
    patientName: 'Emily Chen',
    type: 'In-Person',
    status: 'Scheduled',
    description: 'Diabetes management review and lab results discussion',
    isHighlighted: true,
  },
  {
    id: 5,
    time: '11:15 AM',
    duration: '20 min',
    patientName: 'Michael Davis',
    type: 'Virtual',
    status: 'Scheduled',
    description: 'Post-surgical follow-up and wound care assessment',
    isHighlighted: false,
  },
  {
    id: 6,
    time: '11:45 AM',
    duration: '30 min',
    patientName: 'Lisa Thompson',
    type: 'In-Person',
    status: 'Scheduled',
    description: 'Hypertension management and lifestyle counseling',
    isHighlighted: false,
  },
];

/* ═══════════════════════════════════════════════════════════════════════════
   TO DO TASKS
   ═══════════════════════════════════════════════════════════════════════════ */
export const todoTasks = [
  {
    id: 1,
    title: 'Review lab results and update treatment plan',
    patientName: 'John Anderson',
    patientId: 'PT-10234',
    patientInfo: 'Male, 54 yrs | DOB: 03/15/1971',
    assignedBy: 'Dr. Rebecca Shaw',
    date: '2026-02-24',
    status: 'Pending',
  },
  {
    id: 2,
    title: 'Complete prior authorization for MRI imaging',
    patientName: 'Sarah Mitchell',
    patientId: 'PT-10587',
    patientInfo: 'Female, 38 yrs | DOB: 07/22/1987',
    assignedBy: 'Dr. James Carter',
    date: '2026-02-24',
    status: 'NEW',
  },
  {
    id: 3,
    title: 'Send referral to cardiology specialist',
    patientName: 'Robert Williams',
    patientId: 'PT-10891',
    patientInfo: 'Male, 67 yrs | DOB: 11/05/1958',
    assignedBy: 'Dr. Rebecca Shaw',
    date: '2026-02-23',
    status: 'Pending',
  },
];

/* ═══════════════════════════════════════════════════════════════════════════
   MESSAGES
   ═══════════════════════════════════════════════════════════════════════════ */
export const messages = [
  {
    id: 1,
    senderName: 'Dr. Rebecca Shaw',
    avatar: 'RS',
    time: '10:30 AM',
    preview: 'Please review the updated lab results for patient Anderson...',
    unreadCount: 3,
  },
  {
    id: 2,
    senderName: 'Nurse Kelly Martinez',
    avatar: 'KM',
    time: '10:15 AM',
    preview: 'Patient in Room 3 is ready for examination...',
    unreadCount: 1,
  },
  {
    id: 3,
    senderName: 'Dr. James Carter',
    avatar: 'JC',
    time: '09:45 AM',
    preview: 'Can we discuss the treatment plan for Mrs. Chen?',
    unreadCount: 2,
  },
  {
    id: 4,
    senderName: 'Front Desk - Maria',
    avatar: 'FM',
    time: '09:30 AM',
    preview: 'New patient walk-in requesting urgent care appointment...',
    unreadCount: 0,
  },
  {
    id: 5,
    senderName: 'Lab Department',
    avatar: 'LD',
    time: '09:00 AM',
    preview: 'STAT lab results are ready for review - critical values flagged...',
    unreadCount: 5,
  },
  {
    id: 6,
    senderName: 'Dr. Priya Patel',
    avatar: 'PP',
    time: '08:45 AM',
    preview: 'Referral response received from cardiology department...',
    unreadCount: 1,
  },
  {
    id: 7,
    senderName: 'Billing - Susan Clark',
    avatar: 'SC',
    time: '08:30 AM',
    preview: 'Insurance pre-auth approved for patient Williams procedure...',
    unreadCount: 0,
  },
  {
    id: 8,
    senderName: 'Pharmacy - CVS Main St',
    avatar: 'PH',
    time: '08:00 AM',
    preview: 'Prescription clarification needed for Metformin dosage...',
    unreadCount: 2,
  },
];

/* ═══════════════════════════════════════════════════════════════════════════
   UNSIGNED ENCOUNTERS
   ═══════════════════════════════════════════════════════════════════════════ */
export const unsignedEncounters = [
  {
    id: 1,
    patientName: 'John Anderson',
    dob: '03/15/1971',
    age: 54,
    gender: 'Male',
    provider: 'Dr. Rebecca Shaw',
    date: '2026-02-22',
    status: 'Unsigned',
  },
  {
    id: 2,
    patientName: 'Emily Chen',
    dob: '09/10/1980',
    age: 45,
    gender: 'Female',
    provider: 'Dr. James Carter',
    date: '2026-02-21',
    status: 'Co-Sign',
  },
  {
    id: 3,
    patientName: 'Michael Davis',
    dob: '01/28/1965',
    age: 61,
    gender: 'Male',
    provider: 'Dr. Rebecca Shaw',
    date: '2026-02-20',
    status: 'Unsigned',
  },
];

/* ═══════════════════════════════════════════════════════════════════════════
   ADMIN DASHBOARD — Stats
   ═══════════════════════════════════════════════════════════════════════════ */
export const adminStats = [
  { label: 'Providers', value: 426, change: 5, trend: 'up' },
  { label: 'Patients', value: 656, change: 5, trend: 'up' },
  { label: 'Appointments', value: 48, change: 5, trend: 'up' },
  { label: 'Encounters', value: 35, change: 5, trend: 'down' },
];

/* ═══════════════════════════════════════════════════════════════════════════
   ADMIN DASHBOARD — Provider Table
   ═══════════════════════════════════════════════════════════════════════════ */
export const providers = [
  { id: '#P1231', name: 'Oliver Jake', npi: '1370003950', contact: '202-555-0119', specialty: 'Surgery', experience: 12, totalPatient: 34, status: true },
  { id: '#P1232', name: 'Liam Olivia', npi: '9915078221', contact: '202-555-0162', specialty: 'Orthopedics', experience: 21, totalPatient: 43, status: false },
  { id: '#P1233', name: 'Noah Emma', npi: '4465766572', contact: '202-555-0164', specialty: 'Internal Medicine', experience: 14, totalPatient: 47, status: false },
  { id: '#P1234', name: 'Oliver Charlotte', npi: '7656724714', contact: '202-555-0164', specialty: 'Dermatology', experience: 16, totalPatient: 32, status: true },
  { id: '#P1235', name: 'Elijah Amelia', npi: '4795786779', contact: '202-555-0164', specialty: 'Pediatrics', experience: 21, totalPatient: 25, status: false },
  { id: '#P1236', name: 'Jam Ava', npi: '6982744974', contact: '202-555-0137', specialty: 'Surgery', experience: 32, totalPatient: 27, status: true },
  { id: '#P1237', name: 'Lukas Mia', npi: '8115228669', contact: '202-555-0139', specialty: 'Orthopedics', experience: 24, totalPatient: 31, status: false },
  { id: '#P1238', name: 'Sophia William', npi: '8061157318', contact: '202-555-0137', specialty: 'Internal Medicine', experience: 16, totalPatient: 16, status: true },
  { id: '#P1239', name: 'Henry Evelyn', npi: '2585645999', contact: '202-555-0164', specialty: 'Dermatology', experience: 19, totalPatient: 19, status: true },
  { id: '#P1241', name: 'Dave Longbottom', npi: '2984891038', contact: '202-555-0162', specialty: 'Orthopedics', experience: 31, totalPatient: 35, status: true },
  { id: '#P1242', name: 'Luna Lovegood', npi: '1238179778', contact: '202-555-0139', specialty: 'Dermatology', experience: 12, totalPatient: 27, status: false },
  { id: '#P1243', name: 'Draco Malfoy', npi: '5056087229', contact: '202-555-0119', specialty: 'Pediatrics', experience: 16, totalPatient: 21, status: true },
];

/* ═══════════════════════════════════════════════════════════════════════════
   STAFF DASHBOARD — Stats
   ═══════════════════════════════════════════════════════════════════════════ */
export const staffStats = [
  { label: "TODAY'S PATIENTS", value: 59, subtitle: '4 from Yesterday' },
  { label: 'APPOINTMENTS SCHEDULED', value: 34, subtitle: '5 Pending Check-in' },
  { label: 'URGENT TASKS', value: '05', subtitle: '3 Required Attention', urgent: true },
  { label: 'LAB RESULTS PENDING', value: '$10,324', subtitle: '10 Awaiting Review', urgent: true },
];

/* ═══════════════════════════════════════════════════════════════════════════
   STAFF DASHBOARD — Today's Schedule
   ═══════════════════════════════════════════════════════════════════════════ */
export const todaySchedule = [
  { id: 1, time: '09:00 AM', duration: '30 min', patient: 'Henna West', type: 'In-Person', status: 'Completed', appointmentType: 'New Appointment', provider: 'Anya Sharma', action: 'Check Out' },
  { id: 2, time: '09:30 AM', duration: '30 min', patient: 'Naomi Ziegler', type: 'In-Person', status: 'Checked In', appointmentType: 'New Appointment', provider: 'Ben Carter', action: 'Check In' },
  { id: 3, time: '10:30 AM', duration: '60 min', patient: 'James Turner', type: 'Virtual', status: 'Scheduled', appointmentType: 'Follow-Up Appointment', provider: 'Chloe Davis', action: 'Check In' },
  { id: 4, time: '11:30 AM', duration: '30 min', patient: 'Sofia Chen', type: 'In-Person', status: 'Scheduled', appointmentType: 'New Appointment', provider: 'Ethan Foster', action: 'Check In' },
  { id: 5, time: '01:00 PM', duration: '30 min', patient: 'Liam Brown', type: 'Virtual', status: 'Scheduled', appointmentType: 'Follow-Up Appointment', provider: 'Gisele Hayes', action: 'Check In' },
  { id: 6, time: '02:00 PM', duration: '30 min', patient: 'Olivia Smith', type: 'In-Person', status: 'Scheduled', appointmentType: 'Follow-Up Appointment', provider: 'Ian Garcia', action: 'Check In' },
];

/* ═══════════════════════════════════════════════════════════════════════════
   STAFF DASHBOARD — To Do Tasks
   ═══════════════════════════════════════════════════════════════════════════ */
export const staffTodoTasks = [
  { id: 1, title: 'Review Lab Results', patient: 'John Anderson', priority: 'High', dueDate: '12-03-2025', completed: false },
  { id: 2, title: 'Complete Prior Authorization', patient: 'Margaret Johnson', priority: 'High', dueDate: '12-03-2025', completed: false },
  { id: 3, title: 'Schedule follow-up appointment', patient: 'Thomas Brown', priority: 'High', dueDate: '12-03-2025', completed: false },
  { id: 4, title: 'Review Lab Results', patient: 'Kareem Weatherly', priority: 'High', dueDate: '12-03-2025', completed: false },
  { id: 5, title: 'Review Lab Results', patient: 'Eloise Abernathy', priority: 'Low', dueDate: '12-03-2025', completed: false },
  { id: 6, title: 'Update medication list', patient: 'Patricia Davis', priority: 'Medium', dueDate: '12-03-2025', completed: false },
  { id: 7, title: 'Call for appointment confirmation', patient: 'Robert Williams', priority: 'High', dueDate: 'Today, 1:00 PM', completed: true },
  { id: 8, title: 'Call for appointment confirmation', patient: 'Robert Williams', priority: 'High', dueDate: 'Today, 1:00 PM', completed: true },
];

/* ═══════════════════════════════════════════════════════════════════════════
   STAFF DASHBOARD — Recent Activities
   ═══════════════════════════════════════════════════════════════════════════ */
export const recentActivities = [
  { id: 1, title: 'Critical Lab Value Alert', priority: 'High', time: '2 minutes ago' },
  { id: 2, title: 'New Message from Dr. James', time: '2 minutes ago' },
  { id: 3, title: 'Patient Check-in Completed', time: '12 minutes ago' },
  { id: 4, title: 'Task Assigned to You', time: '1 hour ago' },
  { id: 5, title: 'Appointment Reminder Sent', time: '2 hour ago' },
  { id: 6, title: 'Referral Approved', time: 'Yesterday' },
];
