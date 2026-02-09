import { Exclude, Expose, Transform, Type } from "class-transformer";

@Exclude()
export class DoctorDetailsResponseDTO {
  @Expose() 
  @Transform(({ obj }) => obj._id?.toString()) 
  id!: string;

  @Expose() name!: string;
  @Expose() email!: string;
  @Expose() phone?: string;
  @Expose() gender?: string;
  @Expose() specialization?: string;
  @Expose() yearsOfExperience?: number;
  @Expose() profileImage?: string;
  @Expose() bio?: string;

  @Expose()
  @Transform(({ value }) => Number(value)) 
  consultFee?: number;

  @Expose() totalEarned?: number;
  @Expose() walletBalance?: number;

  @Expose()
  walletTransactions?: {
    type: string;
    amount: number;
    reason: string;
    date: string;
  }[];

  @Expose() affiliatedHospitals?: string[];
  @Expose() awards?: string[];

  @Expose()
  @Type(() => EducationDTO)
  education?: EducationDTO[];

  @Expose()
  @Type(() => ExperienceDTO)
  experience?: ExperienceDTO[];

  @Expose() medicalLicense?: string;
  @Expose() idProof?: string;
  @Expose() isVerified?: boolean;
  @Expose() isActive?: boolean;
  @Expose() isBlocked?: boolean;
  @Expose() isRejected?: boolean;
  @Expose() createdAt?: string;
  @Expose() updatedAt?: string;
}

@Exclude()
export class EducationDTO {
  @Expose() degree!: string;
  @Expose() institution!: string;
  @Expose() year!: string;
}

@Exclude()
export class ExperienceDTO {
  @Expose() hospital!: string;
  @Expose() role!: string;

  @Expose()
  @Transform(({ value }) => value?.toString())
  years!: string;
}
