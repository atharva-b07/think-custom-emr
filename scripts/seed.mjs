import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// ─── CONFIG ───────────────────────────────────────────────────────────────────
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('Set MONGODB_URI environment variable');
  process.exit(1);
}

// ─── SCHEMAS (inline to avoid ESM import issues with Next.js models) ──────────
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true, lowercase: true },
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  password: { type: String, required: true },
  name: { type: String, required: true, trim: true },
  role: { type: String, enum: ['Administrator', 'Provider', 'Staff'], default: 'Provider' },
}, { timestamps: true });

const PatientSchema = new mongoose.Schema({
  mrn: { type: String, required: true, unique: true },
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  gender: { type: String, enum: ['M', 'F', 'O'], required: true },
  dob: { type: Date, required: true },
  email: { type: String, trim: true, lowercase: true },
  phone: { type: String, trim: true },
  address: { type: String, trim: true },
  insurance: { type: String, trim: true },
  tags: [{ label: String, color: String }],
  portalStatus: { type: String, enum: ['Active', 'Inactive', 'Pending'], default: 'Pending' },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

const AppointmentSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  providerName: { type: String, required: true, trim: true },
  location: { type: String, required: true, trim: true },
  room: { type: String, trim: true },
  date: { type: Date, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  duration: { type: String },
  appointmentType: { type: String, enum: ['New', 'Follow Up'], default: 'New' },
  status: { type: String, enum: ['Scheduled', 'Checked In', 'In Exam', 'Completed', 'Cancelled', 'No Show'], default: 'Scheduled' },
  intakeFormStatus: { type: String, enum: ['Pending', 'Completed'], default: 'Pending' },
  insuranceEligibilityStatus: { type: String, enum: ['Pending', 'Verified', 'Denied'], default: 'Pending' },
  visitType: { type: String, enum: ['In-Person', 'Virtual'], default: 'In-Person' },
  reason: { type: String, trim: true },
  notes: { type: String, trim: true },
  isEncounterSigned: { type: Boolean, default: false },
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);
const Patient = mongoose.model('Patient', PatientSchema);
const Appointment = mongoose.model('Appointment', AppointmentSchema);

// ─── DATA POOLS ───────────────────────────────────────────────────────────────
const firstNamesM = [
  'James', 'John', 'Robert', 'Michael', 'William', 'David', 'Richard', 'Joseph',
  'Thomas', 'Charles', 'Christopher', 'Daniel', 'Matthew', 'Anthony', 'Mark',
  'Donald', 'Steven', 'Paul', 'Andrew', 'Joshua', 'Kenneth', 'Kevin', 'Brian',
  'George', 'Timothy', 'Ronald', 'Edward', 'Jason', 'Jeffrey', 'Ryan', 'Jacob',
  'Gary', 'Nicholas', 'Eric', 'Jonathan', 'Stephen', 'Larry', 'Justin', 'Scott',
  'Brandon', 'Benjamin', 'Samuel', 'Raymond', 'Gregory', 'Frank', 'Alexander',
  'Patrick', 'Jack', 'Dennis', 'Jerry', 'Tyler', 'Aaron', 'Jose', 'Nathan',
  'Henry', 'Douglas', 'Peter', 'Adam', 'Zachary', 'Walter',
];

const firstNamesF = [
  'Mary', 'Patricia', 'Jennifer', 'Linda', 'Barbara', 'Elizabeth', 'Susan',
  'Jessica', 'Sarah', 'Karen', 'Lisa', 'Nancy', 'Betty', 'Margaret', 'Sandra',
  'Ashley', 'Dorothy', 'Kimberly', 'Emily', 'Donna', 'Michelle', 'Carol',
  'Amanda', 'Melissa', 'Deborah', 'Stephanie', 'Rebecca', 'Sharon', 'Laura',
  'Cynthia', 'Kathleen', 'Amy', 'Angela', 'Shirley', 'Anna', 'Brenda',
  'Pamela', 'Emma', 'Nicole', 'Helen', 'Samantha', 'Katherine', 'Christine',
  'Debra', 'Rachel', 'Carolyn', 'Janet', 'Catherine', 'Maria', 'Heather',
  'Diane', 'Ruth', 'Julie', 'Olivia', 'Joyce', 'Virginia', 'Victoria',
  'Kelly', 'Lauren', 'Christina',
];

const lastNames = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
  'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson',
  'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson',
  'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson',
  'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen',
  'Hill', 'Flores', 'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera',
  'Campbell', 'Mitchell', 'Carter', 'Roberts', 'Gomez', 'Phillips', 'Evans',
  'Turner', 'Diaz', 'Parker', 'Cruz', 'Edwards', 'Collins', 'Reyes', 'Stewart',
  'Morris', 'Morales', 'Murphy', 'Cook', 'Rogers', 'Gutierrez', 'Ortiz', 'Morgan',
];

const tagOptions = [
  { label: 'Diabetic', color: 'red' },
  { label: 'Hypertension', color: 'purple' },
  { label: 'Insurance Pending', color: 'blue' },
  { label: 'Migraine', color: 'orange' },
  { label: 'Anxiety', color: 'cyan' },
  { label: 'Asthma', color: 'pink' },
  { label: 'COPD', color: 'indigo' },
  { label: 'Hyperlipidemia', color: 'violet' },
  { label: 'Social Stressors', color: 'green' },
  { label: 'Prior Authorization', color: 'amber' },
  { label: 'Referral Required', color: 'teal' },
  { label: 'Anemia', color: 'fuchsia' },
  { label: 'Substance Use', color: 'rose' },
  { label: 'Verification Required', color: 'yellow' },
];

const insurances = [
  'Blue Cross Blue Shield', 'Aetna', 'United Healthcare', 'Cigna', 'Humana',
  'Kaiser Permanente', 'Molina Healthcare', 'Anthem', 'Medicare', 'Medicaid',
  'Self Pay',
];

const providers = [
  'Dr. Rebecca Shaw', 'Dr. James Carter', 'Dr. Priya Patel',
  'Dr. Michael Chen', 'Dr. Sarah Williams', 'Dr. David Rodriguez',
];

const locations = ['Location 1', 'Location 2', 'Location 3', 'Virtual'];
const rooms = ['Room 1', 'Room 2', 'Room 3', 'Room 5', 'Room 7', 'Room 8', 'Room 10'];

const visitReasons = [
  'Annual physical examination', 'Follow-up consultation', 'Blood work review',
  'Medication adjustment', 'New patient intake', 'Diabetes management review',
  'Post-surgical follow-up', 'Hypertension management', 'Chest pain evaluation',
  'Respiratory assessment', 'Mental health screening', 'Immunization update',
  'Weight management consultation', 'Dermatology referral follow-up',
  'Orthopedic evaluation', 'Cardiac stress test review', 'Lab results discussion',
  'Prenatal visit', 'Well-child check', 'Chronic pain management',
  'Allergy assessment', 'GI consultation', 'Neurological evaluation',
  'Pre-operative evaluation', 'Wound care assessment',
];

const streets = [
  'Main St', 'Oak Ave', 'Maple Dr', 'Cedar Ln', 'Pine St', 'Elm Blvd',
  'Washington Ave', 'Park Rd', 'Lake Dr', 'Hill St', 'River Rd', 'Forest Ave',
  'Church St', 'Spring St', 'Valley Rd', 'Sunset Blvd', 'Highland Ave',
];

const cities = [
  'Springfield', 'Franklin', 'Clinton', 'Georgetown', 'Fairview', 'Salem',
  'Madison', 'Arlington', 'Riverside', 'Bristol', 'Jackson', 'Burlington',
];

const states = ['CA', 'TX', 'FL', 'NY', 'PA', 'IL', 'OH', 'GA', 'NC', 'MI', 'NJ', 'VA'];

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickN(arr, min, max) {
  const n = min + Math.floor(Math.random() * (max - min + 1));
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}

function randomDate(startYear, endYear) {
  const start = new Date(startYear, 0, 1).getTime();
  const end = new Date(endYear, 11, 31).getTime();
  return new Date(start + Math.random() * (end - start));
}

function randomPhone() {
  const area = 200 + Math.floor(Math.random() * 800);
  const mid = 200 + Math.floor(Math.random() * 800);
  const last = 1000 + Math.floor(Math.random() * 9000);
  return `(${area}) ${mid}-${last}`;
}

function randomAddress() {
  const num = 100 + Math.floor(Math.random() * 9900);
  return `${num} ${pick(streets)}, ${pick(cities)}, ${pick(states)} ${10000 + Math.floor(Math.random() * 90000)}`;
}

function timeSlot(hour, minute) {
  const h = hour > 12 ? hour - 12 : hour;
  const ampm = hour >= 12 ? 'PM' : 'AM';
  return `${String(h === 0 ? 12 : h).padStart(2, '0')}:${String(minute).padStart(2, '0')} ${ampm}`;
}

function addMinutes(hour, minute, add) {
  const total = hour * 60 + minute + add;
  return { hour: Math.floor(total / 60), minute: total % 60 };
}

// ─── SEED FUNCTION ────────────────────────────────────────────────────────────
async function seed() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(MONGODB_URI);
  console.log('Connected. Clearing existing data...');

  await Promise.all([User.deleteMany({}), Patient.deleteMany({}), Appointment.deleteMany({})]);

  // ── 1. Create demo user ──────────────────────────────────────────────────────
  const hashedPassword = await bcrypt.hash('demo@123', 10);
  await User.create({
    username: 'demo',
    email: 'demo@customemr.com',
    password: hashedPassword,
    name: 'Demo User',
    role: 'Administrator',
  });
  console.log('Created demo user (demo / demo@123)');

  // ── 2. Create patients ───────────────────────────────────────────────────────
  const patientDocs = [];
  const totalPatients = 180;

  for (let i = 0; i < totalPatients; i++) {
    const isMale = Math.random() > 0.48;
    const firstName = isMale ? pick(firstNamesM) : pick(firstNamesF);
    const lastName = pick(lastNames);
    const dob = randomDate(1940, 2006);
    const portalOptions = ['Active', 'Inactive', 'Pending'];
    const portalWeights = [0.55, 0.25, 0.2];
    const r = Math.random();
    const portal = r < portalWeights[0] ? portalOptions[0] : r < portalWeights[0] + portalWeights[1] ? portalOptions[1] : portalOptions[2];

    patientDocs.push({
      mrn: `MRN-${String(204001 + i).padStart(6, '0')}`,
      firstName,
      lastName,
      gender: isMale ? 'M' : 'F',
      dob,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@email.com`,
      phone: randomPhone(),
      address: randomAddress(),
      insurance: pick(insurances),
      tags: pickN(tagOptions, 0, 3),
      portalStatus: portal,
      isActive: Math.random() > 0.1,
    });
  }

  const createdPatients = await Patient.insertMany(patientDocs);
  console.log(`Created ${createdPatients.length} patients`);

  // ── 3. Create appointments ───────────────────────────────────────────────────
  const appointmentDocs = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Generate appointments for past 7 days + next 7 days
  for (let dayOffset = -7; dayOffset <= 7; dayOffset++) {
    const date = new Date(today);
    date.setDate(date.getDate() + dayOffset);

    // Skip weekends
    const dow = date.getDay();
    if (dow === 0 || dow === 6) continue;

    // 4-8 appointments per day
    const apptCount = 4 + Math.floor(Math.random() * 5);

    for (let j = 0; j < apptCount; j++) {
      const patient = pick(createdPatients);
      const hour = 8 + Math.floor(Math.random() * 9); // 8 AM to 4 PM
      const minute = pick([0, 15, 30, 45]);
      const durationMin = pick([15, 20, 30, 45, 60]);
      const end = addMinutes(hour, minute, durationMin);

      const isPast = dayOffset < 0 || (dayOffset === 0 && hour < new Date().getHours());
      const isToday = dayOffset === 0;

      let status;
      if (isPast && !isToday) {
        const r = Math.random();
        status = r < 0.7 ? 'Completed' : r < 0.85 ? 'No Show' : 'Cancelled';
      } else if (isToday) {
        const r = Math.random();
        status = r < 0.2 ? 'Completed' : r < 0.35 ? 'In Exam' : r < 0.55 ? 'Checked In' : 'Scheduled';
      } else {
        status = 'Scheduled';
      }

      const loc = pick(locations);
      const isEncounterSigned = status === 'Completed' ? Math.random() > 0.35 : false;

      appointmentDocs.push({
        patient: patient._id,
        providerName: pick(providers),
        location: loc,
        room: loc === 'Virtual' ? '' : pick(rooms),
        date,
        startTime: timeSlot(hour, minute),
        endTime: timeSlot(end.hour, end.minute),
        duration: `${durationMin} min`,
        appointmentType: pick(['New', 'Follow Up']),
        status,
        intakeFormStatus: isPast || status === 'Checked In' || status === 'In Exam' ? 'Completed' : pick(['Pending', 'Completed']),
        insuranceEligibilityStatus: Math.random() > 0.2 ? 'Verified' : 'Pending',
        visitType: loc === 'Virtual' ? 'Virtual' : 'In-Person',
        reason: pick(visitReasons),
        isEncounterSigned,
      });
    }
  }

  const createdAppointments = await Appointment.insertMany(appointmentDocs);
  console.log(`Created ${createdAppointments.length} appointments`);

  // ── Stats ────────────────────────────────────────────────────────────────────
  const unsignedCount = appointmentDocs.filter((a) => !a.isEncounterSigned && (a.status === 'Completed' || a.status === 'In Exam')).length;
  const todayCount = appointmentDocs.filter((a) => {
    const d = new Date(a.date);
    return d.toDateString() === today.toDateString();
  }).length;

  console.log('\n── Seed Summary ──');
  console.log(`Users:                1 (demo / demo@123)`);
  console.log(`Patients:             ${createdPatients.length}`);
  console.log(`Appointments:         ${createdAppointments.length}`);
  console.log(`Today's appointments: ${todayCount}`);
  console.log(`Unsigned encounters:  ${unsignedCount}`);
  console.log('──────────────────\n');

  await mongoose.disconnect();
  console.log('Done. Database seeded successfully.');
}

seed().catch((err) => {
  console.error('Seed error:', err);
  process.exit(1);
});
