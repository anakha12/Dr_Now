import { Expose } from "class-transformer";

export class AvailabilityRuleResponseDTO {
  @Expose()
  id!: string;

  @Expose()
  doctorId!: string;

  @Expose()
  dayOfWeek!: number;

  @Expose()
  startTime!: string;

  @Expose()
  endTime!: string;

  @Expose()
  slotDuration!: number;
}
