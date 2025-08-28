import { IsEmail, IsNotEmpty, IsString, IsNumber, Min, Max, IsOptional } from "class-validator";
import { Transform } from "class-transformer";

export class DoctorRegisterDTO {
  @IsNotEmpty({ message: "Name is required" })
  @IsString()
  name!: string;

  @IsNotEmpty({ message: "Email is required" })
  @IsEmail({}, { message: "Invalid email format" })
  email!: string;

  @IsNotEmpty({ message: "Phone is required" })
  @IsString()
  phone!: string;

  @IsNotEmpty({ message: "Years of experience is required" })
  @IsNumber()
  @Transform(({ value }) => Number(value))
  yearsOfExperience!: number;

  @IsNotEmpty({ message: "Specialization is required" })
  @IsString()
  specialization!: string;

  @IsNotEmpty({ message: "Password is required" })
  @IsString()
  password!: string;

  @IsNotEmpty({ message: "Profile image is required" })
  @IsString()
  profileImage!: string;

  @IsNotEmpty({ message: "Medical license is required" })
  @IsString()
  medicalLicense!: string;

  @IsNotEmpty({ message: "ID proof is required" })
  @IsString()
  idProof!: string;

  @IsNotEmpty({ message: "Gender is required" })
  @IsString()
  gender!: string;

  @IsNotEmpty({ message: "Consultation fee is required" })
  @IsString()
  consultFee!: string;

  @IsNotEmpty({ message: "Age is required" })
  @IsString()
  age!: string;
}
