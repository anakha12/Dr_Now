import mongoose, { Schema, Document } from 'mongoose';

export interface IDoctorAvailabilityException extends Document {
  doctorId: mongoose.Types.ObjectId;
  date: string;           // "2025-09-15"
  isAvailable: boolean;   // false = leave, true = special availability
  startTime?: string;     // only if isAvailable = true
  endTime?: string;
  slotDuration?: number;
}

const DoctorAvailabilityExceptionSchema = new Schema<IDoctorAvailabilityException>(
  {
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
    date: { type: String, required: true },
    isAvailable: { type: Boolean, required: true },
    startTime: { type: String },
    endTime: { type: String },
    slotDuration: { type: Number },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IDoctorAvailabilityException>(
  'DoctorAvailabilityException',
  DoctorAvailabilityExceptionSchema
);
