export interface Slot {
  from: string;
  to: string;
}

export interface Availability {
  date: string;
  slots: Slot[];
}

export interface DoctorEntity {
  id?: string;
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
  walletBalance?: number;
  totalEarned?: number;
  walletTransactions?: {
    type: 'credit' | 'debit';
    amount: number;
    reason: string;
    bookingId?: string;
    date?: Date;
  }[];
  bio?: string;
  education?: {
    degree: string;
    institution: string;
    year: number;
  }[];
  awards?: string[];
  experience?: {
    hospital: string;
    role: string;
    years: number;
  }[];
  affiliatedHospitals?: string[];
}
