import { Exclude, Expose, Transform } from "class-transformer";

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

  // Map DB fields into slot { from, to }
  @Expose()
  @Transform(({ obj }) => ({ from: obj.startTime, to: obj.endTime }))
  slot!: { from: string; to: string };

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

  // Computed getters
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
