import { Exclude, Expose } from "class-transformer";

@Exclude()
export class CancelDoctorBookingResponseDTO {
  @Expose()
  success!: boolean;

  @Expose()
  message?: string;
}
