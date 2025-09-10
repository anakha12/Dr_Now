
import { IsEmail, IsString, MinLength } from "class-validator";

export class DoctorLoginDTO {
  @IsEmail()
  email!: string;

  @IsString()
//   @MinLength(6)
  password!: string;
}
