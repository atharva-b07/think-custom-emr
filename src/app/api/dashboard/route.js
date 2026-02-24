import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Patient from '@/models/Patient';
import Appointment from '@/models/Appointment';
import { getAuthUser } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [
      totalPatients,
      activePatients,
      inactivePatients,
      totalAppointments,
      todayAppointments,
      unsignedEncounters,
      todayAppointmentsList,
    ] = await Promise.all([
      Patient.countDocuments(),
      Patient.countDocuments({ isActive: true }),
      Patient.countDocuments({ isActive: false }),
      Appointment.countDocuments(),
      Appointment.countDocuments({ date: { $gte: today, $lt: tomorrow } }),
      Appointment.countDocuments({ isEncounterSigned: false, status: { $in: ['Completed', 'In Exam'] } }),
      Appointment.find({ date: { $gte: today, $lt: tomorrow } })
        .populate('patient', 'firstName lastName dob gender')
        .sort({ startTime: 1 })
        .limit(20)
        .lean(),
    ]);

    // Transform today's appointments for dashboard display
    const appointmentsList = todayAppointmentsList.map((apt) => {
      const patient = apt.patient || {};
      return {
        id: apt._id,
        time: apt.startTime,
        duration: apt.duration || '30 min',
        patientName: patient.firstName ? `${patient.firstName} ${patient.lastName}` : 'Unknown',
        type: apt.visitType || 'In-Person',
        status: apt.status,
        description: apt.reason || apt.notes || '',
        isHighlighted: apt.status === 'In Exam' || apt.status === 'Checked In',
      };
    });

    // Get unsigned encounters list
    const unsignedList = await Appointment.find({
      isEncounterSigned: false,
      status: { $in: ['Completed', 'In Exam'] },
    })
      .populate('patient', 'firstName lastName dob gender')
      .sort({ date: -1 })
      .limit(20)
      .lean();

    const unsignedEncountersList = unsignedList.map((enc) => {
      const patient = enc.patient || {};
      const dob = patient.dob ? new Date(patient.dob) : null;
      return {
        id: enc._id,
        patientName: patient.firstName ? `${patient.firstName} ${patient.lastName}` : 'Unknown',
        dob: dob ? `${String(dob.getMonth() + 1).padStart(2, '0')}/${String(dob.getDate()).padStart(2, '0')}/${dob.getFullYear()}` : '',
        age: dob ? calcAge(dob) : 0,
        gender: patient.gender === 'M' ? 'Male' : patient.gender === 'F' ? 'Female' : 'Other',
        provider: enc.providerName,
        date: enc.date ? enc.date.toISOString().split('T')[0] : '',
        status: 'Unsigned',
      };
    });

    // Admin stats
    const adminStats = [
      { label: 'Providers', value: 12, change: 5, trend: 'up' },
      { label: 'Patients', value: totalPatients, change: 5, trend: 'up' },
      { label: 'Appointments', value: todayAppointments, change: 5, trend: 'up' },
      { label: 'Encounters', value: unsignedEncounters, change: 5, trend: 'down' },
    ];

    // Staff stats
    const staffStats = [
      { label: "TODAY'S PATIENTS", value: todayAppointments, subtitle: `${Math.floor(todayAppointments * 0.1)} from Yesterday` },
      { label: 'APPOINTMENTS SCHEDULED', value: todayAppointments, subtitle: `${Math.floor(todayAppointments * 0.15)} Pending Check-in` },
      { label: 'URGENT TASKS', value: '05', subtitle: '3 Required Attention', urgent: true },
      { label: 'LAB RESULTS PENDING', value: '$10,324', subtitle: '10 Awaiting Review', urgent: true },
    ];

    return NextResponse.json({
      stats: {
        totalPatients,
        activePatients,
        inactivePatients,
        totalAppointments,
        todayAppointments,
        unsignedEncounters,
      },
      adminStats,
      staffStats,
      appointments: appointmentsList,
      unsignedEncounters: unsignedEncountersList,
    });
  } catch (error) {
    console.error('Dashboard GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function calcAge(dob) {
  const today = new Date();
  const birth = new Date(dob);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}
