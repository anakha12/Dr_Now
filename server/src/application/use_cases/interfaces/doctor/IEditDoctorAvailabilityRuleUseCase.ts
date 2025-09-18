
import { EditDoctorAvailabilityRuleDTO } from "../../../../interfaces/dto/request/edit-doctor-availability-rule.dto";

export interface IEditDoctorAvailabilityRule {
  execute(data: EditDoctorAvailabilityRuleDTO): Promise<{ message: string }>;
}
