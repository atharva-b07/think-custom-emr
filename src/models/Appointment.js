import mongoose from 'mongoose';

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

// Virtual for formatted time range
AppointmentSchema.virtual('time').get(function () {
  return `${this.startTime} - ${this.endTime}`;
});

AppointmentSchema.set('toJSON', { virtuals: true });
AppointmentSchema.set('toObject', { virtuals: true });

AppointmentSchema.index({ date: 1, providerName: 1 });
AppointmentSchema.index({ patient: 1, date: -1 });

export default mongoose.models.Appointment || mongoose.model('Appointment', AppointmentSchema);
