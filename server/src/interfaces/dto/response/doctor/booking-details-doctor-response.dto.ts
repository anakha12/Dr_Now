import { Exclude, Expose } from "class-transformer";

@Exclude()
export class BookingDetailsDoctorResponseDTO {
  @Expose()
  id!: string;

  @Expose()
  userId!: string;

  @Expose()
  doctorId!: string;

  @Expose()
  date!: string;

  @Expose()
  startTime!: string;

  @Expose()
  endTime!: string;

  @Expose()
  status!: string;

  @Expose()
  doctorEarning!: number;

  @Expose()
  commissionAmount!: number;

  @Expose()
  totalAmount!: number;
}
