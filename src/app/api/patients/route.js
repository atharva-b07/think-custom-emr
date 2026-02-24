import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
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
    const search = searchParams.get('search') || '';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '15', 10);
    const status = searchParams.get('status'); // 'active' or 'inactive'

    const query = {};

    // Filter by active/inactive
    if (status === 'active') query.isActive = true;
    else if (status === 'inactive') query.isActive = false;

    // Search by name or MRN
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { mrn: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;

    const [patients, total] = await Promise.all([
      Patient.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Patient.countDocuments(query),
    ]);

    // Transform to match frontend expected shape
    const transformed = patients.map((p) => ({
      id: p._id,
      mrn: p.mrn,
      name: `${p.firstName} ${p.lastName}`,
      gender: p.gender,
      dob: formatDob(p.dob),
      age: calcAge(p.dob),
      contactDetails: [p.phone, p.email].filter(Boolean).join(' | '),
      lastAppointment: p.lastAppointment || null,
      tags: p.tags || [],
      portalStatus: p.portalStatus,
    }));

    return NextResponse.json({
      patients: transformed,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Patients GET error:', error);
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

    // Generate MRN
    const count = await Patient.countDocuments();
    const mrn = `MRN-${String(200000 + count + 1).padStart(6, '0')}`;

    const patient = await Patient.create({
      mrn,
      firstName: body.firstName,
      lastName: body.lastName,
      gender: body.gender,
      dob: new Date(body.dob),
      email: body.email,
      phone: body.phone,
      address: body.address,
      insurance: body.insurance,
      tags: body.tags || [],
      portalStatus: body.portalStatus || 'Pending',
    });

    return NextResponse.json(
      {
        success: true,
        patient: {
          id: patient._id,
          mrn: patient.mrn,
          name: patient.name,
          gender: patient.gender,
          dob: patient.formattedDob,
          age: patient.age,
          contactDetails: patient.contactDetails,
          tags: patient.tags,
          portalStatus: patient.portalStatus,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Patients POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function formatDob(date) {
  if (!date) return '';
  const d = new Date(date);
  return `${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}/${d.getFullYear()}`;
}

function calcAge(dob) {
  if (!dob) return 0;
  const today = new Date();
  const birth = new Date(dob);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}
