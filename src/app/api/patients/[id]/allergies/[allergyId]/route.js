import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Patient from '@/models/Patient';
import Allergy from '@/models/Allergy';
import { getAuthUser } from '@/lib/auth';

// PUT /api/patients/[id]/allergies/[allergyId] — Update an allergy record
export async function PUT(request, { params }) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { id, allergyId } = await params;
    const patient = await Patient.findById(id).lean();
    if (!patient) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
    }

    const allergy = await Allergy.findOne({ _id: allergyId, patient: id });
    if (!allergy) {
      return NextResponse.json({ error: 'Allergy not found' }, { status: 404 });
    }

    const body = await request.json();

    // Validation
    const errors = validateAllergy(body);
    if (errors.length > 0) {
      return NextResponse.json({ error: errors.join(', ') }, { status: 400 });
    }

    allergy.allergyType = body.allergyType;
    allergy.allergyName = body.allergyName.trim();
    allergy.reaction = body.reaction.trim();
    allergy.severity = body.severity;
    allergy.onsetDate = new Date(body.onsetDate);
    allergy.recordedBy = body.recordedBy.trim();
    allergy.recordedByRole = body.recordedByRole;
    allergy.note = body.note?.trim() || '';
    // recordedDate is NOT changed on update

    await allergy.save();

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
    });
  } catch (error) {
    console.error('Allergy PUT error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/patients/[id]/allergies/[allergyId] — Delete an allergy record
export async function DELETE(request, { params }) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { id, allergyId } = await params;
    const patient = await Patient.findById(id).lean();
    if (!patient) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
    }

    const allergy = await Allergy.findOneAndDelete({ _id: allergyId, patient: id });
    if (!allergy) {
      return NextResponse.json({ error: 'Allergy not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Allergy deleted successfully' });
  } catch (error) {
    console.error('Allergy DELETE error:', error);
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
