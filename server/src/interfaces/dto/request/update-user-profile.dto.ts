
import { IsOptional, IsString, IsNumber, IsDateString, IsEnum } from "class-validator";
import { Expose, Transform } from "class-transformer";

export class UpdateUserProfileRequestDTO {
  @IsString()
  userId!: string; // required

  @IsOptional()
  @IsString()
  @Expose()
  name?: string;

  @IsOptional()
  @IsString()
  @Expose()
  email?: string;

  @IsOptional()
  @IsString()
  @Expose()
  phone?: string;

  @IsOptional()
  @IsDateString()
  @Expose()
  dateOfBirth?: string;

  @IsOptional()
  @IsEnum(["male", "female", "other"])
  @Expose()
  gender?: string;

  @IsOptional()
  @IsString()
  @Expose()
  bloodGroup?: string;

  @IsOptional()
  @IsString()
  @Expose()
  address?: string;

  @IsOptional()
  @Expose()
  image?: string;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => (value !== undefined ? Number(value) : undefined))
  @Expose()
  age?: number;

  @IsOptional()
  file?: Express.Multer.File;
}
