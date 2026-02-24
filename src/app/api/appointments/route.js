import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Appointment from '@/models/Appointment';
import Patient from '@/models/Patient';
import { getAuthUser } from '@/lib/auth';

export async function GET(request) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    const provider = searchParams.get('provider');
    const status = searchParams.get('status');
    const location = searchParams.get('location');
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '50', 10);

    const query = {};

    if (date) {
      const dayStart = new Date(date);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(date);
      dayEnd.setHours(23, 59, 59, 999);
      query.date = { $gte: dayStart, $lte: dayEnd };
    }

    if (provider) query.providerName = { $regex: provider, $options: 'i' };
    if (status) query.status = status;
    if (location) query.location = location;

    const skip = (page - 1) * limit;

    const [appointments, total] = await Promise.all([
      Appointment.find(query)
        .populate('patient', 'firstName lastName dob gender phone mrn')
        .sort({ date: 1, startTime: 1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Appointment.countDocuments(query),
    ]);

    // Transform to match frontend expected shape
    const transformed = appointments.map((apt) => {
      const patient = apt.patient || {};
      const dob = patient.dob ? new Date(patient.dob) : null;
      const formattedDob = dob
        ? `${String(dob.getMonth() + 1).padStart(2, '0')}/${String(dob.getDate()).padStart(2, '0')}/${dob.getFullYear()}`
        : '';
      const age = dob ? calcAge(dob) : 0;

      return {
        id: apt._id,
        location: apt.location,
        room: apt.room,
        providerName: apt.providerName,
        time: `${apt.startTime} - ${apt.endTime}`,
        startTime: apt.startTime,
        endTime: apt.endTime,
        duration: apt.duration,
        appointmentType: apt.appointmentType,
        intakeFormStatus: apt.intakeFormStatus,
        insuranceEligibilityStatus: apt.insuranceEligibilityStatus,
        status: apt.status,
        visitType: apt.visitType,
        patientName: patient.firstName ? `${patient.firstName} ${patient.lastName}` : 'Unknown',
        patientDOB: formattedDob,
        patientAge: age,
        patientGender: patient.gender === 'M' ? 'Male' : patient.gender === 'F' ? 'Female' : 'Other',
        contactNumber: patient.phone || '',
        patientId: patient._id,
        reason: apt.reason,
        date: apt.date,
        isEncounterSigned: apt.isEncounterSigned,
      };
    });

    return NextResponse.json({
      appointments: transformed,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error('Appointments GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const body = await request.json();

    const appointment = await Appointment.create({
      patient: body.patientId,
      providerName: body.providerName,
      location: body.location,
      room: body.room,
      date: new Date(body.date),
      startTime: body.startTime,
      endTime: body.endTime,
      duration: body.duration,
      appointmentType: body.appointmentType,
      status: body.status || 'Scheduled',
      intakeFormStatus: body.intakeFormStatus || 'Pending',
      insuranceEligibilityStatus: body.insuranceEligibilityStatus || 'Pending',
      visitType: body.visitType || 'In-Person',
      reason: body.reason,
      notes: body.notes,
    });

    return NextResponse.json({ success: true, appointment }, { status: 201 });
  } catch (error) {
    console.error('Appointments POST error:', error);
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
