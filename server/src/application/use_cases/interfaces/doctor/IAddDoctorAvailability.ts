import { AddDoctorAvailabilityRuleDTO } from "../../../../interfaces/dto/request/add-doctor-availability-rule.dto";

export interface IAddDoctorAvailabilityRule {
  execute(dto: AddDoctorAvailabilityRuleDTO): Promise<{ message: string }>;
}
