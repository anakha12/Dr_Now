import { Type } from "class-transformer";
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
  IsArray,
  Min
} from "class-validator";

/* ------------------ Education ------------------ */
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

/* ------------------ Experience ------------------ */
class ExperienceDTO {
  @IsString()
  @IsNotEmpty()
  hospital!: string;

  @IsString()
  @IsNotEmpty()
  role!: string;

  @IsNumber()
  @Type(() => Number)
  @Min(0)
  years!: number;
}

/* ------------------ Main DTO ------------------ */
export class UpdateDoctorProfileDTO {

  @IsString()
  @IsNotEmpty()
  doctorId!: string;

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
  @Type(() => Number)
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


  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @IsOptional()
  consultFee?: number;

  @IsBoolean()
  @IsOptional()
  confirm?: boolean;


  @IsArray()
  @IsOptional()
  awards?: string[];


  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EducationDTO)
  @IsOptional()
  education?: EducationDTO[];

 
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ExperienceDTO)
  @IsOptional()
  experience?: ExperienceDTO[];

  @IsArray()
  @IsOptional()
  affiliatedHospitals?: string[];
}
