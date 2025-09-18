export  interface DoctorProfile {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  bio?: string;
  education?: { degree: string; institution: string; year: string }[];
  awards?: string[];
  experience?: { hospital: string; role: string; years: string }[];
  affiliatedHospitals?: string[];
}