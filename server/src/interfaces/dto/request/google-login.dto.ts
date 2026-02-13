
import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class GoogleLoginRequestDTO {
  @IsEmail({}, { message: "Email must be valid" })
  email!: string;

  @IsOptional()
  @IsString({ message: "Name must be a string" })
  name?: string;

  @IsNotEmpty({ message: "UID is required" })
  @IsString({ message: "UID must be a string" })
  uid!: string;
}
