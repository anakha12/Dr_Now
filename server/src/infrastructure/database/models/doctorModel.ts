

import mongoose, { Schema, Document } from 'mongoose';

export interface Slot {
  from: string;
  to: string;
}

export interface Availability {
  date: string;
  slots: Slot[];
}

export interface IDoctor extends Document {
  name: string;
  email: string;
  phone: string;
  yearsOfExperience: number;
  specialization: string;
  password: string;
  isVerified: boolean;
  isActive: boolean;
  profileImage: string;
  medicalLicense: string;
  idProof: string;
  gender: string;
  consultFee: string;
  isBlocked: boolean;
  otp?: string;
  otpExpiresAt?: Date;
  availability: Availability[]; 
  isRejected?: boolean;
}

const slotSchema = new Schema<Slot>({
  from: { type: String, required: true },
  to: { type: String, required: true },
});

const availabilitySchema = new Schema<Availability>({
  date: { type: String, required: true },
  slots: { type: [slotSchema], default: [] },
});

const DoctorSchema: Schema = new Schema<IDoctor>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    yearsOfExperience: { type: Number, required: true },
    specialization: { type: String, required: true },
    password: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    profileImage: { type: String, required: true },
    medicalLicense: { type: String, required: true },
    idProof: { type: String, required: true },
    gender: { type: String, required: true },
    consultFee: { type: String, required: true },
    isBlocked: { type: Boolean, default: false },
    otp: { type: String },
    otpExpiresAt: { type: Date },
    availability: { type: [availabilitySchema], default: [] }, 
    isRejected: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IDoctor>('Doctor', DoctorSchema);
