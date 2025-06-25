import { BookingRepository } from "../../../domain/repositories/bookingRepository";
import { UserRepository } from "../../../domain/repositories/userRepository";
import { AdminWalletRepository } from "../../../domain/repositories/adminWalletRepository";

export class CancelUserBookingUseCase {
  constructor(
    private bookingRepository: BookingRepository,
    private userRepository: UserRepository,
    private adminWalletRepository: AdminWalletRepository
  ) {}

  async execute(bookingId: string, userId: string) {
    const booking = await this.bookingRepository.findById(bookingId);
    if (!booking) return { success: false, message: "Booking not found" };

    if (booking.userId.toString() !== userId.toString()) {
      return { success: false, message: "Unauthorized" };
    }

    if (booking.status !== "Upcoming") {
      return { success: false, message: "Only upcoming bookings can be cancelled" };
    }

    const appointmentDateTime = new Date(`${booking.date}T${booking.slot.from}`);
    const now = new Date();
    if (now > appointmentDateTime) {
      return { success: false, message: "Cannot cancel past appointments" };
    }

    // Cancel booking
    await this.bookingRepository.cancelBooking(bookingId);

    const refundAmount = (booking.doctorEarning || 0) + (booking.commissionAmount || 0);

    const user = await this.userRepository.findUserById(booking.userId);
    if (!user) return { success: false, message: "User not found" };


    await this.userRepository.updateUser(user.id!, {
      $inc: { walletBalance: refundAmount },
      $push: {
        walletTransactions: {
          type: "credit",
          amount: refundAmount,
          reason: "Appointment cancelled",
          bookingId,
          date: new Date(),
        },
      },
    });

    // Deduct from admin wallet
    await this.adminWalletRepository.debitCommission(
      {
        type: "debit",
        amount: refundAmount,
        userId: user.id!,
        bookingId,
        description: "Refund to user on appointment cancellation",
      },
      refundAmount
    );

    await this.bookingRepository.updateRefundStatus(bookingId, "Refunded");

    return { success: true };
  }
}
