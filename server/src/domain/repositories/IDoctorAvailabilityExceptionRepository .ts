
import { DoctorAvailabilityException } from "../entities/doctorAvailabilityExceptionEntity";

export interface IDoctorAvailabilityExceptionRepository {
  createException(exception: Partial<DoctorAvailabilityException>): Promise<DoctorAvailabilityException>;
  getExceptionsForDoctor(doctorId: string): Promise<DoctorAvailabilityException[]>;
  deleteException(id: string): Promise<boolean>; 
}
