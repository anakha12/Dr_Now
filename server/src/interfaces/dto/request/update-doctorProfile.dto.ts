import { Type } from "class-transformer";
import { IsBoolean, IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";

class EducationDTO {
  @IsString()
  @IsNotEmpty()
  degree!: string;

  @IsString()
  @IsNotEmpty()
  institution!: string;

  @IsNumber()
  @Type(() => Number)
  year!: number;
}

class ExperienceDTO {
  @IsString()
  @IsNotEmpty()
  hospital!: string;

  @IsString()
  @IsNotEmpty()
  role!: string;

  @IsNumber()
  @Type(() => Number)
  years!: number;
}

export class UpdateDoctorProfileDTO {
  @IsString()
  @IsNotEmpty()
  doctorId!: string; // ✅ Added for clean architecture compliance

  @IsString()
  @IsOptional()
  name?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  bio?: string;

  @IsNumber()
  @IsOptional()
  yearsOfExperience?: number;

  @IsString()
  @IsOptional()
  specialization?: string;

  @IsString()
  @IsOptional()
  profileImage?: string;

  @IsString()
  @IsOptional()
  medicalLicense?: string;

  @IsString()
  @IsOptional()
  idProof?: string;

  @IsString()
  @IsOptional()
  gender?: string;

  @IsString()
  @IsOptional()
  consultFee?: string;

  @IsBoolean()
  @IsOptional()
  confirm?: boolean;

  @IsOptional()
  awards?: string[];

  @ValidateNested({ each: true })
  @Type(() => EducationDTO)
  @IsOptional()
  education?: EducationDTO[];

  @ValidateNested({ each: true })
  @Type(() => ExperienceDTO)
  @IsOptional()
  experience?: ExperienceDTO[];

  @IsOptional()
  affiliatedHospitals?: string[];
}
