
import { IsString } from "class-validator";

export class DeleteDoctorAvailabilityExceptionDTO {
  @IsString()
  doctorId!: string;

  @IsString()
  exceptionId!: string;
}
