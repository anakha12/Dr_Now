

import mongoose, { Schema, Document } from 'mongoose';
import {Role} from "../../../utils/Constance"
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
  age: string;
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
  isRejected?: boolean;
  rejectionReason?:string;
  walletBalance?: number;
  totalEarned?: number;
  walletTransactions?: {
    type: 'credit' | 'debit';
    amount: number;
    reason: string;
    bookingId?: mongoose.Types.ObjectId;
    date?: Date;
  }[];
  bio?: string;
  education?: {
    degree: string;
    institution: string;
    year: string;
  }[];
  awards?: string[];
  experience?: {
    hospital: string;
    role: string;
    years: String ;
  }[];
  affiliatedHospitals?: string[];
  role: Role;
}

const DoctorSchema: Schema = new Schema<IDoctor>(
  {
    name: { type: String, required: true },
    role: {type: String,enum:Object.values(Role),default: Role.DOCTOR,required: true},
    email: { type: String, required: true, unique: true },
    age: { type: String, required: true},
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
    isRejected: { type: Boolean, default: false },
    rejectionReason: { type: String, default: null },
    walletBalance: { type: Number, default: 0 },
    totalEarned: { type: Number, default: 0 },
    walletTransactions: [
      {
        type: {
          type: String,
          enum: ['credit', 'debit'],
          required: true,
        },
        amount: { type: Number, required: true },
        reason: { type: String, required: true },
        bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
        date: { type: Date, default: Date.now },
      }
    ],
    bio: { type: String },
    education: [
      {
        degree: String,
        institution: String,
        year: String,
      },
    ],
    awards: [String],
    experience: [
      {
        hospital: String,
        role: String,
        years: String ,
      },
    ],
    affiliatedHospitals: [String],
  },

  {
    timestamps: true,
  }
);

export default mongoose.model<IDoctor>('Doctor', DoctorSchema);
