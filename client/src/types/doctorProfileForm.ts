import type { DoctorProfile } from "../types/doctorProfile";

export interface DoctorProfileForm extends DoctorProfile {
  yearsOfExperience: number;
  specialization: string;
  profileImage: string;
  medicalLicense: string;
  idProof: string;
  gender: string;
  consultFee: number; 
  awards: string[];
  education: { degree: string; institution: string; year: string }[];
  experience: { hospital: string; role: string; years: string }[];
  affiliatedHospitals: string[];
}
