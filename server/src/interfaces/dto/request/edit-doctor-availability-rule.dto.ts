// src/interfaces/dto/request/edit-doctor-availability-rule.dto.ts
import { IsInt, IsOptional, IsString, Min, IsUUID } from "class-validator";

export class EditDoctorAvailabilityRuleDTO {
  @IsString()
  doctorId!: string;

  @IsInt()
  dayOfWeek!: number;

  @IsOptional()
  @IsString()
  startTime?: string;

  @IsOptional()
  @IsString()
  endTime?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  slotDuration?: number;
}
