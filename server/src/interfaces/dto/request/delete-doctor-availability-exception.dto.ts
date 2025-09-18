// src/interfaces/dto/request/delete-doctor-availability-exception.dto.ts
import { IsString } from "class-validator";

export class DeleteDoctorAvailabilityExceptionDTO {
  @IsString()
  doctorId!: string;

  @IsString()
  exceptionId!: string;
}
