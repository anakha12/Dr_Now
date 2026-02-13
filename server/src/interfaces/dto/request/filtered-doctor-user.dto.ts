import { IsOptional, IsString, IsNumber, Min } from "class-validator";

export class GetFilteredDoctorsRequestDTO {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  specialization?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  maxFee?: number;

  @IsOptional()
  @IsString()
  gender?: string;

  @IsNumber()
  @Min(1)
  page = 1;

  @IsNumber()
  @Min(1)
  limit = 6;
}
