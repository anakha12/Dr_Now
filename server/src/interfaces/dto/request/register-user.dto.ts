import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";
import { Transform } from "class-transformer";

export class RegisterUserRequestDTO {
  @IsEmail({}, { message: "Invalid email address" })
  email!: string;

  @IsString()
  @IsNotEmpty({ message: "Password is required" })
  @MinLength(6, { message: "Password must be at least 6 characters" })
  password!: string;

  @IsString()
  @IsNotEmpty({ message: "OTP is required" })
  @Transform(({ value }) => value?.toString())
  otp!: string;
}
