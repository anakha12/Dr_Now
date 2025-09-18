
import { AddDoctorAvailabilityExceptionDTO } from "../../../../interfaces/dto/request/add-doctor-exception.dto";
import { DoctorAvailabilityExceptionResponseDTO } from "../../../../interfaces/dto/response/doctor/doctor-exception-response.dto";

export interface IAddDoctorAvailabilityException {
  execute(dto: AddDoctorAvailabilityExceptionDTO): Promise<DoctorAvailabilityExceptionResponseDTO>;
}
