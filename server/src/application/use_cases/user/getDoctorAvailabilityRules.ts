import { BaseUseCase } from "../base-usecase";
import { IGetDoctorAvailabilityRules } from "../interfaces/user/IGetDoctorAvailabilityRules";
import { IAvailabilityRuleRepository } from "../../../domain/repositories/IAvailabilityRuleRepository";
import { AvailabilityRuleResponseDTO } from "../../../interfaces/dto/response/doctor/availability-rule-response.dto";
import { GetDoctorBasicsDTO } from "../../../interfaces/dto/request/doctor-basic.dto";
import { plainToInstance } from "class-transformer";

export class GetDoctorAvailabilityRulesUseCase
  extends BaseUseCase<GetDoctorBasicsDTO, AvailabilityRuleResponseDTO[]>
  implements IGetDoctorAvailabilityRules
{
  constructor(private readonly _availabilityRepo: IAvailabilityRuleRepository) {
    super();
  }

  async execute(doctorIdOrDto: string | GetDoctorBasicsDTO): Promise<AvailabilityRuleResponseDTO[]> {
    const dto = typeof doctorIdOrDto === "string"
      ? await this.validateDto(GetDoctorBasicsDTO, { doctorId: doctorIdOrDto })
      : await this.validateDto(GetDoctorBasicsDTO, doctorIdOrDto);

    const rules = await this._availabilityRepo.findByDoctor(dto.doctorId);


    if (!rules || rules.length === 0) {
      throw new Error("No availability rules found for this doctor");
    }


    const plainRules = rules.map(rule => ({
      id: rule.id!,
      doctorId: rule.doctorId,
      dayOfWeek: rule.dayOfWeek,
      startTime: rule.startTime,
      endTime: rule.endTime,
      slotDuration: rule.slotDuration,
    }));

    return plainToInstance(AvailabilityRuleResponseDTO, plainRules, {
      excludeExtraneousValues: true,
    });
  }
}
