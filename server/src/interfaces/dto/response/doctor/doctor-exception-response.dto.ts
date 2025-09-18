import { Exclude, Expose, Transform } from "class-transformer";

@Exclude()
export class DoctorAvailabilityExceptionResponseDTO {
  @Expose()
 @Transform(({ obj }) => obj._id.toString()) 
  _id!: string;

  @Expose()
  doctorId!: string;

  @Expose()
  date!: string;

  @Expose()
  isAvailable!: boolean;

  @Expose()
  startTime?: string;

  @Expose()
  endTime?: string;

  @Expose()
  slotDuration?: number;
}
