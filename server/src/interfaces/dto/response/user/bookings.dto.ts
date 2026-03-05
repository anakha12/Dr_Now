// src/interfaces/dto/response/user/bookings.dto.ts
import { Exclude, Expose, Transform, Type } from "class-transformer";
import { PrescriptionDTO, SlotDTO } from "../doctor/doctor-booking-response.dto";

@Exclude()
export class BookingResponseDTO {
  @Expose()
  id!: string;

  @Expose()
  doctorName!: string;

  @Expose()
  department!: string;

  @Expose()
  userId!: string;

  @Expose()
  date!: string;

  @Expose()
  @Type(() => SlotDTO)
  @Transform(({ obj }) => ({ from: obj.startTime, to: obj.endTime }))
  slot!: SlotDTO;

  @Expose()
  doctorEarning?: number;

  @Expose()
  commissionAmount?: number;

  @Expose()
  status!: string;

  @Expose()
  paymentStatus!: string;

  @Expose()
  createdAt!: Date;

  // --------------------
  // Typed prescription (can be null if not present)
  // --------------------
  @Expose()
  @Type(() => PrescriptionDTO)
  prescription?: PrescriptionDTO | null;

  // --------------------
  // Computed fields
  // --------------------
  @Expose()
  get time(): string {
    return `${this.slot.from} - ${this.slot.to}`;
  }

  @Expose()
  get amount(): number {
    return (this.doctorEarning ?? 0) + (this.commissionAmount ?? 0);
  }

  @Expose()
  get canCancel(): boolean {
    return this.paymentStatus === "paid" && this.status !== "Cancelled";
  }
}