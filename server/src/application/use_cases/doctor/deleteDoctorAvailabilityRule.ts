// src/application/usecases/doctor/deleteDoctorAvailabilityRule.usecase.ts
import { BaseUseCase } from "../base-usecase";
import { IDeleteDoctorAvailabilityRuleUseCase } from "../interfaces/doctor/IDeleteDoctorAvailabilityRuleUseCase";
import { IAvailabilityRuleRepository } from "../../../domain/repositories/IAvailabilityRuleRepository";
import { ErrorMessages, Messages } from "../../../utils/Messages";

export class DeleteDoctorAvailabilityRuleUseCase
  extends BaseUseCase<{ doctorId: string; dayOfWeek: number }, { message: string }>
  implements IDeleteDoctorAvailabilityRuleUseCase
{
  constructor(private readonly ruleRepo: IAvailabilityRuleRepository) {
    super();
  }

  async execute(data: { doctorId: string; dayOfWeek: number }): Promise<{ message: string }> {
    const { doctorId, dayOfWeek } = data;

    const existingRule = await this.ruleRepo.findByDoctorAndDay(doctorId, dayOfWeek);

    if (!existingRule || !existingRule.id) {
      throw new Error( ErrorMessages.RULE_NOT_FOUND);
    }

    await this.ruleRepo.delete(existingRule.id);

    return { message: Messages.RULE_DELETED };
  }
}
