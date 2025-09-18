import { BaseUseCase } from "../base-usecase";
import { AddDoctorAvailabilityRuleDTO } from "../../../interfaces/dto/request/add-doctor-availability-rule.dto";
import { IAddDoctorAvailabilityRule } from "../interfaces/doctor/IAddDoctorAvailability";
import { IAvailabilityRuleRepository } from "../../../domain/repositories/IAvailabilityRuleRepository";
import { DoctorAvailabilityRule } from "../../../domain/entities/doctorAvailabilityRule.entity";
import { Messages } from "../../../utils/Messages";

export class AddDoctorAvailabilityRuleUseCase
  extends BaseUseCase<AddDoctorAvailabilityRuleDTO, { message: string }>
  implements IAddDoctorAvailabilityRule
{
  constructor(private readonly ruleRepo: IAvailabilityRuleRepository) {
    super();
  }

  async execute(data: AddDoctorAvailabilityRuleDTO): Promise<{ message: string }> {
    console.log(data)

    const dto = await this.validateDto(AddDoctorAvailabilityRuleDTO, data);

    const existingRule = await this.ruleRepo.findByDoctorAndDay(dto.doctorId, dto.dayOfWeek);
    if (existingRule) throw new Error( Messages.RULE_ALREADY_EXISTS(dto.dayOfWeek));
  

    const ruleEntity = new DoctorAvailabilityRule(
      dto.doctorId,
      dto.dayOfWeek,
      dto.startTime,
      dto.endTime,
      dto.slotDuration
    );

    await this.ruleRepo.create(ruleEntity);

    return { message: Messages.RULE_ADDED };
  }
}
