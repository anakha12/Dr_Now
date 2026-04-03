import { DoctorAvailabilityExceptionResponseDTO } from "../../../interfaces/dto/response/doctor/doctor-exception-response.dto";
import { DoctorAvailabilityException } from "../../../domain/entities/doctorAvailabilityExceptionEntity"; 

export class DoctorAvailabilityExceptionMapper {

  static toResponseDTO(
    exceptions: DoctorAvailabilityException[]
  ): DoctorAvailabilityExceptionResponseDTO[] {

    return exceptions.map((ex) => ({
      _id: ex._id ? String(ex._id) : "",
      doctorId: ex.doctorId,
      date: ex.date,
      isAvailable: ex.isAvailable,
      startTime: ex.startTime,
      endTime: ex.endTime,
      slotDuration: ex.slotDuration,
    }));
  }
}