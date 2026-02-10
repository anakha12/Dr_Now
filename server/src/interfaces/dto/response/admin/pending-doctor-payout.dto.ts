import { Exclude, Expose } from "class-transformer";

@Exclude()
export class PendingDoctorPayoutResponseDTO {

  @Expose()
  doctorId!: string;

  @Expose()
  doctorName!: string;

  @Expose()
  totalPendingAmount!: number;

  @Expose()
  pendingBookingsCount!: number;
}
