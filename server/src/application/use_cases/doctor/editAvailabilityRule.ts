
import { BaseUseCase } from "../base-usecase";
import { EditDoctorAvailabilityRuleDTO } from "../../../interfaces/dto/request/edit-doctor-availability-rule.dto";
import { IEditDoctorAvailabilityRule } from "../interfaces/doctor/IEditDoctorAvailabilityRuleUseCase";
import { IAvailabilityRuleRepository } from "../../../domain/repositories/IAvailabilityRuleRepository";
import { DoctorAvailabilityRule } from "../../../domain/entities/doctorAvailabilityRule.entity";
import { Messages } from "../../../utils/Messages";

export class EditDoctorAvailabilityRuleUseCase
  extends BaseUseCase<EditDoctorAvailabilityRuleDTO, { message: string }>
  implements IEditDoctorAvailabilityRule
{
  constructor(private readonly ruleRepo: IAvailabilityRuleRepository) {
    super();
  }

  async execute( data: EditDoctorAvailabilityRuleDTO): Promise<{ message: string }> {

    const dto = await this.validateDto(EditDoctorAvailabilityRuleDTO, data);


    const existingRule = await this.ruleRepo.findByDoctorAndDay(dto.doctorId, dto.dayOfWeek);

    if (!existingRule) {

      const newRule = new DoctorAvailabilityRule(
        dto.doctorId,
        dto.dayOfWeek,
        dto.startTime || "",
        dto.endTime || "",
        dto.slotDuration || 30
      );
      await this.ruleRepo.create(newRule);
      return { message: Messages.RULE_ADDED };
    }


    existingRule.startTime = dto.startTime ?? existingRule.startTime;
    existingRule.endTime = dto.endTime ?? existingRule.endTime;
    existingRule.slotDuration = dto.slotDuration ?? existingRule.slotDuration;

    await this.ruleRepo.update(existingRule);

    return { message: Messages.RULE_UPDATED };
  }
}
