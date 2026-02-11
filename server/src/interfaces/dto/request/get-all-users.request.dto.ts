import { IsOptional, IsInt, Min, IsString, IsEnum, IsIn } from "class-validator";
import { Type } from "class-transformer";
import { UserSort, Gender } from "../../../utils/Constance";

export class GetAllUsersRequestDTO {

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit: number = 5;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(UserSort)
  sort?: UserSort;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  minAge?: number;

  @IsOptional()
  @Type(() => Number) 
  @IsInt()
  maxAge?: number;

  @IsOptional()
  @IsEnum(Gender)
  gender?: string;
}
