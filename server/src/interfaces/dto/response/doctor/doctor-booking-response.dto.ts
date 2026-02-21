import { Expose, Type } from "class-transformer";

class SlotDTO {
  @Expose()
  from!: string;

  @Expose()
  to!: string;
}

export class DoctorBookingListResponseDTO {
  @Expose()
  id!: string;

  @Expose()
  date!: string;

  @Expose()
  status!: string;

  @Expose()
  patientName!: string;
  @Expose()
  department!: string; 

  @Expose()
  @Type(() => SlotDTO)
  slot!: SlotDTO;
}
