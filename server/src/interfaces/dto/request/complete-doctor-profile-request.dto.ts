import {
  IsString,
  IsArray,
  ValidateNested
} from "class-validator";
import { Type } from "class-transformer";

class EducationDTO {

  @IsString()
  degree!: string;

  @IsString()
  institution!: string;

  @IsString()
  year!: string;
}

class ExperienceDTO {

  @IsString()
  hospital!: string;

  @IsString()
  role!: string;

  @IsString()
  years!: string;
}

export class CompleteDoctorProfileRequestDTO {

  @IsString()
  bio!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EducationDTO)
  education!: EducationDTO[];

  @IsArray()
  @IsString({ each: true })
  awards!: string[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ExperienceDTO)
  experience!: ExperienceDTO[];

  @IsArray()
  @IsString({ each: true })
  affiliatedHospitals!: string[];
}