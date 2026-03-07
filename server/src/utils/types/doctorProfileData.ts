export interface Education {
  degree: string;
  institution: string;
  year: string;
}

export interface Experience {
  hospital: string;
  role: string;
  years: string;
}

export interface DoctorProfileData {
  bio: string;
  education: Education[];             
  awards?: string[];
  experience: Experience[];          
  affiliatedHospitals?: string[];
}