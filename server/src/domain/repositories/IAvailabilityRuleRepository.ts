import { DoctorAvailabilityRule } from "../../domain/entities/doctorAvailabilityRule.entity";


export interface IAvailabilityRuleRepository {
  findByDoctorAndDay(
    doctorId: string,
    dayOfWeek: number
  ): Promise<DoctorAvailabilityRule | null>;

  create(rule: DoctorAvailabilityRule): Promise<DoctorAvailabilityRule>;
  findByDoctor(doctorId: string): Promise<DoctorAvailabilityRule[]>;
  delete(ruleId: string): Promise<void>;
  update(rule: DoctorAvailabilityRule): Promise<DoctorAvailabilityRule>
}
