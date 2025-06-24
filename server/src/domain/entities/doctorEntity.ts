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
}
