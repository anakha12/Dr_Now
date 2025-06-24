import { BookingRepository } from "../../../domain/repositories/bookingRepository";

export class GetUserBookings {
  constructor(private readonly bookingRepository: BookingRepository) {}

  async execute(userId: string) {
    const bookings = await this.bookingRepository.findUserBookings(userId);

    return bookings.map((b) => ({
        id: b.id,
        doctorName: b.doctorName,     
        department: b.department,     
        userId: b.userId,
        date: b.date,
        time: `${b.slot.from} - ${b.slot.to}`,
        amount: "N/A",
        status: b.status,
        canCancel: b.paymentStatus === "paid" && b.status !== "Cancelled",
        createdAt: b.createdAt,
        }));

  }
}
