import { IsInt, IsString, Min, Max } from "class-validator";
import { Type } from "class-transformer";

export class AddDoctorAvailabilityRuleDTO {
  @IsString()
  doctorId!: string;

  @IsInt()
  @Min(0)
  @Max(6)
  @Type(() => Number) // ensures string numbers ("1") become number
  dayOfWeek!: number;

  @IsString()
  startTime!: string;   // "09:00"

  @IsString()
  endTime!: string;     // "17:00"

  @IsInt()
  @Min(5)
  @Max(240)
  @Type(() => Number)
  slotDuration!: number;  // e.g., 30 minutes
}
