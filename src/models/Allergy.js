import mongoose from 'mongoose';

const AllergySchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  allergyType: { type: String, enum: ['Drug', 'Food', 'Environment'], required: true },
  allergyName: { type: String, required: true, trim: true },
  reaction: { type: String, required: true, trim: true },
  severity: { type: String, enum: ['Mild', 'Moderate', 'Severe'], required: true },
  onsetDate: { type: Date, required: true },
  recordedDate: { type: Date, default: Date.now },
  recordedBy: { type: String, required: true, trim: true },
  recordedByRole: { type: String, enum: ['Staff', 'Patient', 'Provider'], required: true },
  note: { type: String, trim: true, default: '' },
}, { timestamps: true });

// Format date as DD-MM-YYYY
function formatDateDDMMYYYY(date) {
  if (!date) return '';
  const d = new Date(date);
  return `${String(d.getDate()).padStart(2, '0')}-${String(d.getMonth() + 1).padStart(2, '0')}-${d.getFullYear()}`;
}

// Virtual for formatted onset date
AllergySchema.virtual('formattedOnsetDate').get(function () {
  return formatDateDDMMYYYY(this.onsetDate);
});

// Virtual for formatted recorded date
AllergySchema.virtual('formattedRecordedDate').get(function () {
  return formatDateDDMMYYYY(this.recordedDate);
});

AllergySchema.set('toJSON', { virtuals: true });
AllergySchema.set('toObject', { virtuals: true });

// Index for efficient patient lookups
AllergySchema.index({ patient: 1, createdAt: -1 });

export default mongoose.models.Allergy || mongoose.model('Allergy', AllergySchema);
