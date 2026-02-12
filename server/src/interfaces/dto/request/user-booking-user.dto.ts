import { IsOptional, IsString, IsIn, IsDateString, IsNumber, Min } from "class-validator";
import { Type } from "class-transformer";

export class GetUserBookingsRequestDTO {
  
    @IsString()
  userId!: string;

  @IsOptional()
  @IsIn(["Pending", "Completed", "Cancelled"])
  status?: string;

  @IsOptional()
  @IsDateString()
  date?: string;

  @IsOptional()
  @IsString()
  doctorName?: string;

  @IsOptional()
  @IsString()
  specialization?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit: number = 4;
}
