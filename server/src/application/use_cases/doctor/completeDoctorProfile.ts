import { IDoctorRepository } from "../../../domain/repositories/doctorRepository";

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

interface CompleteProfileDTO {
  bio: string;
  education: Education[];
  awards: string[];
  experience: Experience[];
  affiliatedHospitals: string[];
}
 
export class CompleteDoctorProfile {
  constructor(private readonly _doctorRepo: IDoctorRepository) {}

  async execute(doctorId: string, profileData: CompleteProfileDTO) {
    if (!doctorId) throw new Error("Doctor ID is required");

    return await this._doctorRepo.completeProfile(doctorId, profileData);
  }
}
