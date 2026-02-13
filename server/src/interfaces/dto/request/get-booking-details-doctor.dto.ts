import { IsString, IsNotEmpty } from "class-validator";

export class GetBookingDetailsDoctorDTO {
  @IsString()
  @IsNotEmpty()
  bookingId!: string;

  @IsString()
  @IsNotEmpty()
  doctorId!: string;
}
