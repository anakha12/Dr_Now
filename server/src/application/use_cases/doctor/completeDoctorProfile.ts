import { IDoctorRepository } from "../../../domain/repositories/doctorRepository";
import { Messages } from "../../../utils/Messages";
import { ICompleteDoctorProfile } from "../interfaces/doctor/ICompleteDoctorProfile";

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
 
export class CompleteDoctorProfile implements ICompleteDoctorProfile{
  constructor(private readonly _doctorRepo: IDoctorRepository) {}

  async execute(doctorId: string, profileData: CompleteProfileDTO) {
    if (!doctorId) throw new Error( Messages.DOCTOR_ID_REQUIRED);

    return await this._doctorRepo.completeProfile(doctorId, profileData);
  }
}
