import { Exclude, Expose, Type } from "class-transformer";

class SlotDTO {
  @Expose()
  from!: string;

  @Expose()
  to!: string;
}

@Exclude()
export class BookingDetailsDoctorResponseDTO {

  @Expose()
  id!: string;

  @Expose()
  patientName!: string;  

  @Expose()
  department!: string;    

  @Expose()
  date!: string;

  @Expose()
  @Type(() => SlotDTO)
  slot!: SlotDTO;         
  @Expose()
  status!: 'Upcoming' | 'Cancelled' | 'Completed';

  @Expose()
  totalAmount!: number;

  @Expose()
  doctorEarning!: number;

  @Expose()
  commissionAmount!: number;

  @Expose()
  payoutStatus!: 'Pending' | 'Paid';

  @Expose()
  paymentStatus!: string;

  @Expose()
  cancellationReason?: string;

   @Expose()
  createdAt!: string; 
}
