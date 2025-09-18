import { AvailabilityRuleResponseDTO } from "../../../../interfaces/dto/response/doctor/availability-rule-response.dto";

export interface IGetDoctorAvailabilityRules {
  execute(doctorId: string): Promise<AvailabilityRuleResponseDTO[]>;
}
