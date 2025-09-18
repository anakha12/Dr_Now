
import { DoctorAvailabilityException } from "../entities/doctorAvailabilityException.entity";

export interface IDoctorAvailabilityExceptionRepository {
  createException(exception: Partial<DoctorAvailabilityException>): Promise<DoctorAvailabilityException>;
  getExceptionsForDoctor(doctorId: string): Promise<DoctorAvailabilityException[]>;
  deleteException(id: string): Promise<boolean>; 
}
