import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Patient from '@/models/Patient';
import Appointment from '@/models/Appointment';
import { getAuthUser } from '@/lib/auth';

export async function GET(request, { params }) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { id } = await params;
    const patient = await Patient.findById(id).lean();

    if (!patient) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
    }

    // Get upcoming appointments for this patient
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const upcomingAppointments = await Appointment.find({
      patient: id,
      date: { $gte: today },
      status: { $nin: ['Cancelled', 'No Show'] },
    })
      .sort({ date: 1, startTime: 1 })
      .limit(5)
      .lean();

    // Get last appointment
    const lastAppointment = await Appointment.findOne({
      patient: id,
      date: { $lt: today },
    })
      .sort({ date: -1 })
      .lean();

    const dob = patient.dob ? new Date(patient.dob) : null;

    return NextResponse.json({
      patient: {
        id: patient._id,
        mrn: patient.mrn,
        firstName: patient.firstName,
        lastName: patient.lastName,
        name: `${patient.firstName} ${patient.lastName}`,
        gender: patient.gender,
        dob: dob ? `${String(dob.getMonth() + 1).padStart(2, '0')}/${String(dob.getDate()).padStart(2, '0')}/${dob.getFullYear()}` : '',
        age: dob ? calcAge(dob) : 0,
        email: patient.email || '',
        phone: patient.phone || '',
        address: patient.address || '',
        insurance: patient.insurance || '',
        tags: patient.tags || [],
        portalStatus: patient.portalStatus,
        isActive: patient.isActive,
      },
      upcomingAppointments: upcomingAppointments.map((apt) => ({
        id: apt._id,
        date: apt.date ? apt.date.toISOString().split('T')[0] : '',
        startTime: apt.startTime,
        endTime: apt.endTime,
        provider: apt.providerName,
        location: apt.location,
        room: apt.room,
        visitType: apt.visitType,
        status: apt.status,
        reason: apt.reason || '',
      })),
      lastAppointment: lastAppointment
        ? {
            date: lastAppointment.date ? lastAppointment.date.toISOString().split('T')[0] : '',
            provider: lastAppointment.providerName,
            status: lastAppointment.status,
          }
        : null,
    });
  } catch (error) {
    console.error('Patient GET by ID error:', error);
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
