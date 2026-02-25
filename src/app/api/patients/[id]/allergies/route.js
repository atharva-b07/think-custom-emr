import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Patient from '@/models/Patient';
import Allergy from '@/models/Allergy';
import { getAuthUser } from '@/lib/auth';

// GET /api/patients/[id]/allergies — List all allergies for a patient
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

    const allergies = await Allergy.find({ patient: id })
      .sort({ createdAt: -1 })
      .lean();

    const formatted = allergies.map((a) => ({
      id: a._id,
      allergyType: a.allergyType,
      allergyName: a.allergyName,
      reaction: a.reaction,
      severity: a.severity,
      onsetDate: formatDDMMYYYY(a.onsetDate),
      recordedDate: formatDDMMYYYY(a.recordedDate),
      recordedBy: a.recordedBy,
      recordedByRole: a.recordedByRole,
      note: a.note || '',
    }));

    return NextResponse.json({ allergies: formatted });
  } catch (error) {
    console.error('Allergies GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/patients/[id]/allergies — Create a new allergy record
export async function POST(request, { params }) {
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

    const body = await request.json();

    // Validation
    const errors = validateAllergy(body);
    if (errors.length > 0) {
      return NextResponse.json({ error: errors.join(', ') }, { status: 400 });
    }

    const allergy = await Allergy.create({
      patient: id,
      allergyType: body.allergyType,
      allergyName: body.allergyName.trim(),
      reaction: body.reaction.trim(),
      severity: body.severity,
      onsetDate: new Date(body.onsetDate),
      recordedDate: new Date(),
      recordedBy: body.recordedBy.trim(),
      recordedByRole: body.recordedByRole,
      note: body.note?.trim() || '',
    });

    return NextResponse.json({
      allergy: {
        id: allergy._id,
        allergyType: allergy.allergyType,
        allergyName: allergy.allergyName,
        reaction: allergy.reaction,
        severity: allergy.severity,
        onsetDate: formatDDMMYYYY(allergy.onsetDate),
        recordedDate: formatDDMMYYYY(allergy.recordedDate),
        recordedBy: allergy.recordedBy,
        recordedByRole: allergy.recordedByRole,
        note: allergy.note || '',
      },
    }, { status: 201 });
  } catch (error) {
    console.error('Allergies POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function validateAllergy(body) {
  const errors = [];
  const validTypes = ['Drug', 'Food', 'Environment'];
  const validSeverities = ['Mild', 'Moderate', 'Severe'];
  const validRoles = ['Staff', 'Patient', 'Provider'];

  if (!body.allergyType || !validTypes.includes(body.allergyType)) {
    errors.push('Allergy type must be one of: Drug, Food, or Environment');
  }
  if (!body.allergyName?.trim()) {
    errors.push('Allergy name is required');
  }
  if (!body.reaction?.trim()) {
    errors.push('Reaction is required');
  }
  if (!body.severity || !validSeverities.includes(body.severity)) {
    errors.push('Severity must be one of: Mild, Moderate, or Severe');
  }
  if (!body.onsetDate) {
    errors.push('Onset date is required');
  }
  if (!body.recordedBy?.trim()) {
    errors.push('Recorded by is required');
  }
  if (!body.recordedByRole || !validRoles.includes(body.recordedByRole)) {
    errors.push('Recorded by role must be one of: Staff, Patient, or Provider');
  }

  return errors;
}

function formatDDMMYYYY(date) {
  if (!date) return '';
  const d = new Date(date);
  return `${String(d.getDate()).padStart(2, '0')}-${String(d.getMonth() + 1).padStart(2, '0')}-${d.getFullYear()}`;
}
