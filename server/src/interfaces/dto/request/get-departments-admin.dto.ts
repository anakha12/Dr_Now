import { IsInt, IsOptional, Min, IsString } from "class-validator";
import { Transform } from "class-transformer";

export class GetDepartmentsRequestDTO {
  @IsInt()
  @Min(1)
  @Transform(({ value }) => parseInt(value))
  page!: number;

  @IsInt()
  @Min(1)
  @Transform(({ value }) => parseInt(value))
  limit!: number;

  @IsOptional()
  @IsString()
  search?: string;
}
