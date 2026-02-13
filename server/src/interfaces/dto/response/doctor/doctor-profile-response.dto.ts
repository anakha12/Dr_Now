// src/interfaces/dto/response/doctor/doctor-profile-response.dto.ts
import { Expose, Exclude, Type } from "class-transformer";

// --- Nested DTOs ---

@Exclude()
export class SlotDTO {
  @Expose()
  from!: string;

  @Expose()
  to!: string;
}

@Exclude()
export class AvailabilityDTO {
  @Expose()
  date!: string;

  @Expose()
  @Type(() => SlotDTO)
  slots!: SlotDTO[];
}

@Exclude()
export class EducationDTO {
  @Expose()
  degree!: string;

  @Expose()
  institution!: string;

  @Expose()
  year!: string | number;
}

@Exclude()
export class ExperienceDTO {
  @Expose()
  hospital!: string;

  @Expose()
  role!: string;

  @Expose()
  years!: string | number;
}

// --- Main DTO ---

@Exclude()
export class DoctorProfileResponseDTO {
  @Expose()
  id!: string;

  @Expose()
  name!: string;

  @Expose()
  email!: string;

  @Expose()
  phone!: string;

  @Expose()
  age!: string;

  @Expose()
  gender!: string;

  @Expose()
  yearsOfExperience!: number;

  @Expose()
  specialization!: string;

  @Expose()
  consultFee!: string;

  @Expose()
  profileImage!: string;

  @Expose()
  medicalLicense!: string;

  @Expose()
  idProof!: string;

  @Expose()
  isVerified!: boolean;

  @Expose()
  isActive!: boolean;

  @Expose()
  isBlocked!: boolean;

  @Expose()
  isRejected?: boolean;

  @Expose()
  rejectionReason?: string;

  @Expose()
  bio?: string;

  @Expose()
  @Type(() => EducationDTO)
  education?: EducationDTO[];

  @Expose()
  awards?: string[];

  @Expose()
  @Type(() => ExperienceDTO)
  experience?: ExperienceDTO[];

  @Expose()
  affiliatedHospitals?: string[];

  @Expose()
  @Type(() => AvailabilityDTO)
  availability!: AvailabilityDTO[];
}
