export interface Education {
  degree: string;
  institution: string;
  year: string;
}

export interface Experience {
  hospital: string;
  role: string;
  years: number;
}

export interface WalletTransaction {
  amount: number;
  type: "credit" | "debit";
  date: string;
  description?: string;
}

export interface Doctor {
  id: string;
  name: string;
  email: string;
  phone?: string;
  gender?: string;
  specialization?: string;
  yearsOfExperience?: number;
  consultFee?: number;
  bio?: string;
  profileImage?: string;
  medicalLicense?: string;
  idProof?: string;
  totalEarned?: number;
  walletBalance?: number;
  walletTransactions?: WalletTransaction[];
  affiliatedHospitals?: string[];
  awards?: string[];
  education?: Education[];
  experience?: Experience[];
  isVerified?: boolean;
  isActive?: boolean;
  isBlocked?: boolean;
  isRejected?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
