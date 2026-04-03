
import { BaseUseCase } from "../base-usecase";
import { AddPrescriptionDTO } from "../../../interfaces/dto/request/add-prescription.dto";
import { PrescriptionDTO } from "../../../interfaces/dto/response/prescription/prescription.dto";
import { IPrescriptionRepository } from "../../../domain/repositories/IPrescriptionRepository";

export class AddPrescriptionUseCase extends BaseUseCase<AddPrescriptionDTO, PrescriptionDTO> {
  constructor(private prescriptionRepo: IPrescriptionRepository) {
    super();
  }

  async execute(dto: AddPrescriptionDTO & { bookingId: string }): Promise<PrescriptionDTO> {

    const validatedDto = await this.validateDto(AddPrescriptionDTO, dto);


    const prescriptionData = {
      doctorName: validatedDto.doctorName,
      date: new Date().toISOString(),
      medicines: validatedDto.medicines,
      notes: validatedDto.notes,
    };


    const savedPrescription = await this.prescriptionRepo.addPrescription(
      dto.bookingId,
      prescriptionData
    );


    const response: PrescriptionDTO = {
      doctorName: savedPrescription.doctorName,
      date: savedPrescription.date,
      medicines: savedPrescription.medicines,
      notes: savedPrescription.notes,
    };

    return response;
  }
}