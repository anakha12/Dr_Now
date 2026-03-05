
import { IsString, IsOptional, IsArray, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

export class MedicineDTO {
  @IsString()
  name!: string;

  @IsString()
  dose!: string;

  @IsString()
  frequency!: string;

  @IsString()
  duration!: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class PrescriptionDTO {
  @IsString()
  doctorName!: string;

  @IsString()
  date!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MedicineDTO)
  medicines!: MedicineDTO[];

  @IsOptional()
  @IsString()
  notes?: string;

  
}