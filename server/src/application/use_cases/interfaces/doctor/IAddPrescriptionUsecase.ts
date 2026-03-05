
import { AddPrescriptionDTO } from "../../../../interfaces/dto/request/add-prescription.dto";
import { PrescriptionDTO } from "../../../../interfaces/dto/response/prescription/prescription.dto";

export interface IAddPrescriptionUseCase {
  execute(dto: AddPrescriptionDTO & { bookingId: string }): Promise<PrescriptionDTO>;
}