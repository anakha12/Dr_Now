import { IGetDoctorAvailability } from "../interfaces/doctor/IGetDoctorAvailability";
import { IAvailabilityRuleRepository } from "../../../domain/repositories/IAvailabilityRuleRepository";
import { AvailabilityRuleResponseDTO } from "../../../interfaces/dto/response/doctor/availability-rule-response.dto";
import { plainToInstance } from "class-transformer";

export class GetDoctorAvailability implements IGetDoctorAvailability {
  constructor(private readonly _availabilityRepo: IAvailabilityRuleRepository) {}

  async execute(doctorId: string): Promise<AvailabilityRuleResponseDTO[]> {

    const rules = await this._availabilityRepo.findByDoctor(doctorId);

    if (!rules || rules.length === 0) {
      throw new Error("No availability rules found for this doctor");
    }

    return plainToInstance(AvailabilityRuleResponseDTO, rules, {
      excludeExtraneousValues: true,
    });
  }
}
