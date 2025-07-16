import { IBookingRepository } from "../../../domain/repositories/bookingRepository";

export class GetUserBookings {
  constructor(private readonly _bookingRepository: IBookingRepository) {}

 async execute(userId: string, page: number, limit: number) {
  const { bookings, total } = await this._bookingRepository.findUserBookings(userId, page, limit);

  const transformed = bookings.map((b) => ({
    id: b.id,
    doctorName: b.doctorName,
    department: b.department,
    userId: b.userId,
    date: b.date,
    time: `${b.slot.from} - ${b.slot.to}`,
    amount: (b.doctorEarning ?? 0) + (b.commissionAmount ?? 0),
    status: b.status,
    canCancel: b.paymentStatus === "paid" && b.status !== "Cancelled",
    createdAt: b.createdAt,
  }));

  const totalPages = Math.ceil(total / limit);

  return { bookings: transformed, totalPages };
}

}
