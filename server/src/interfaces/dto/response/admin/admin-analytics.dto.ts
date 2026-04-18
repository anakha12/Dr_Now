import { Expose, Type } from "class-transformer";

export class DailyRevenueDTO {
  @Expose()
  date!: string;

  @Expose()
  revenue!: number;
}

export class StatusCountDTO {
  @Expose()
  status!: string;

  @Expose()
  count!: number;
}

export class DepartmentPopularityDTO {
  @Expose()
  department!: string;

  @Expose()
  count!: number;
}

export class TopDoctorDTO {
  @Expose()
  doctorId!: string;

  @Expose()
  doctorName!: string;

  @Expose()
  earnings!: number;

  @Expose()
  consultations!: number;
}

export class AdminAnalyticsResponseDTO {
  @Expose()
  @Type(() => StatusCountDTO)
  bookingStatusBreakdown!: StatusCountDTO[];

  @Expose()
  @Type(() => DailyRevenueDTO)
  revenueTrend!: DailyRevenueDTO[];

  @Expose()
  @Type(() => DepartmentPopularityDTO)
  departmentPopularity!: DepartmentPopularityDTO[];

  @Expose()
  @Type(() => TopDoctorDTO)
  topDoctors!: TopDoctorDTO[];

  @Expose()
  cancellationRate!: number;
}
