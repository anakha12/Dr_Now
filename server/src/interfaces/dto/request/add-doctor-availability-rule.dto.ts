import { IsInt, IsString, Min, Max } from "class-validator";
import { Type } from "class-transformer";

export class AddDoctorAvailabilityRuleDTO {
  @IsString()
  doctorId!: string;

  @IsInt()
  @Min(0)
  @Max(6)
  @Type(() => Number) 
  dayOfWeek!: number;

  @IsString()
  startTime!: string;   

  @IsString()
  endTime!: string;   

  @IsInt()
  @Min(5)
  @Max(240)
  @Type(() => Number)
  slotDuration!: number;  
}
