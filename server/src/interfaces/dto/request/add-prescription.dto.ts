
import { Type } from "class-transformer";
import { IsString, IsArray, ValidateNested, IsOptional } from "class-validator";

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

export class AddPrescriptionDTO {
  @IsString()
  doctorName!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MedicineDTO)
  medicines!: MedicineDTO[];

  @IsOptional()
  @IsString()
  notes?: string;
}