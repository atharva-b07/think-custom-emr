import mongoose from 'mongoose';

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
  tags: [{
    label: { type: String },
    color: { type: String },
  }],
  portalStatus: { type: String, enum: ['Active', 'Inactive', 'Pending'], default: 'Pending' },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

// Virtual for full name
PatientSchema.virtual('name').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual for age
PatientSchema.virtual('age').get(function () {
  if (!this.dob) return null;
  const today = new Date();
  const birth = new Date(this.dob);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
});

// Virtual for formatted contact details (matches frontend pattern)
PatientSchema.virtual('contactDetails').get(function () {
  return [this.phone, this.email].filter(Boolean).join(' | ');
});

// Virtual for formatted DOB (MM/DD/YYYY)
PatientSchema.virtual('formattedDob').get(function () {
  if (!this.dob) return '';
  const d = new Date(this.dob);
  return `${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}/${d.getFullYear()}`;
});

PatientSchema.set('toJSON', { virtuals: true });
PatientSchema.set('toObject', { virtuals: true });

// Text index for search
PatientSchema.index({ firstName: 'text', lastName: 'text', mrn: 'text' });

export default mongoose.models.Patient || mongoose.model('Patient', PatientSchema);
