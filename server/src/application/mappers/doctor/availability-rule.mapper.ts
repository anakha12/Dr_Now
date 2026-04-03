import { AvailabilityRuleResponseDTO } from "../../../interfaces/dto/response/doctor/availability-rule-response.dto";
import { DoctorAvailabilityRule } from "../../../domain/entities/doctorAvailabilityRuleEntity"; 

export class AvailabilityRuleMapper {

  static toResponseDTO(rules: DoctorAvailabilityRule[]): AvailabilityRuleResponseDTO[] {
    return rules.map(rule => ({
      id: rule.id ?? "",
      doctorId: rule.doctorId,
      dayOfWeek: rule.dayOfWeek,
      startTime: rule.startTime,
      endTime: rule.endTime,
      slotDuration: rule.slotDuration,
    }));
  }
}