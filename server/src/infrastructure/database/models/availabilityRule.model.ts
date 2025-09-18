import mongoose, { Schema, Document } from 'mongoose';

export interface IDoctorAvailabilityRule extends Document {
  doctorId: mongoose.Types.ObjectId;
  dayOfWeek: number;    
  startTime: string;    
  endTime: string;      
  slotDuration: number;  
}

const DoctorAvailabilityRuleSchema = new Schema<IDoctorAvailabilityRule>(
  {
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
    dayOfWeek: { type: Number, required: true, min: 0, max: 6 },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    slotDuration: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IDoctorAvailabilityRule>(
  'DoctorAvailabilityRule',
  DoctorAvailabilityRuleSchema
);
