import { IsEmail, IsNotEmpty, MinLength, Matches, IsOptional } from "class-validator";

export class UserRegisterDTO {
  @IsNotEmpty({ message: "Username is required" })
  name!: string;

  @IsEmail({}, { message: "Invalid email format" })
  email!: string;

  @MinLength(6, { message: "Password must be at least 6 characters" })
  password!: string;

  @IsOptional()
  isDonner?: boolean;
}
