
import { IsBoolean, IsDateString, IsOptional, IsString, IsNumber } from "class-validator";

export class AddDoctorAvailabilityExceptionDTO {
  @IsString()
  doctorId!: string;

  @IsDateString()
  date!: string; 

  @IsBoolean()
  isAvailable!: boolean;

  @IsOptional()
  @IsString()
  startTime?: string;

  @IsOptional()
  @IsString()
  endTime?: string;

  @IsOptional()
  @IsNumber()
  slotDuration?: number;
}
