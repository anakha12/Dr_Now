interface Education {
  degree: string;
  institution: string;
  year: string;
}

interface Experience {
  hospital: string;
  role: string;
  years: string;
}

export interface CompleteProfileDTO {
  bio: string;
  education: Education[];
  awards: string[];
  experience: Experience[];
  affiliatedHospitals: string[];
}

export interface ICompleteDoctorProfile {
  execute(
    doctorId: string,
    profileData: CompleteProfileDTO
  ): Promise<any>; 
}
