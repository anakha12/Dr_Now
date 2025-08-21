import { IBookingRepository } from "../../../domain/repositories/bookingRepository";
import { IUserRepository } from "../../../domain/repositories/userRepository";
import { IAdminWalletRepository } from "../../../domain/repositories/adminWalletRepository";
import { ICancelDoctorBooking } from "../interfaces/doctor/ICancelDoctorBooking";

export class CancelDoctorBooking implements ICancelDoctorBooking{
  constructor(
    private _bookingRepository: IBookingRepository,
    private _userRepository: IUserRepository,
    private _adminWalletRepository: IAdminWalletRepository
  ) {}

  async execute(doctorId: string, bookingId: string, reason: string): Promise<{ success: boolean; message?: string }> {
    const booking = await this._bookingRepository.findById(bookingId);

    if (!booking) {
      return { success: false, message: "Booking not found" };
    }

    if (booking.doctorId.toString() !== doctorId.toString()) {
      return { success: false, message: "You are not authorized to cancel this booking" };
    }

    if (booking.status !== "Upcoming") {
      return { success: false, message: "Only upcoming bookings can be cancelled" };
    }

    const appointmentDateTime = new Date(`${booking.date}T${booking.slot.from}`);
    const now = new Date();
    if (now > appointmentDateTime) {
      return { success: false, message: "Cannot cancel past appointments" };
    }

    
 
    await this._bookingRepository.cancelBooking(bookingId, reason);

    const refundAmount = (booking.doctorEarning || 0) + (booking.commissionAmount || 0);

    const user = await this._userRepository.findUserById(booking.userId);
    console.log(user)
    if (!user) return { success: false, message: "User not found" };

    // Credit user wallet
    await this._userRepository.updateUser(user.id!, {
      $inc: { walletBalance: refundAmount },
      $push: {
        walletTransactions: {
          type: "credit",
          amount: refundAmount,
          reason: "Doctor cancelled appointment",
          bookingId,
          date: new Date(),
        },
      },
    });

    // Debit admin wallet
    await this._adminWalletRepository.debitCommission(
      {
        type: "debit",
        amount: refundAmount,
        userId: user.id!,
        bookingId,
        description: "Refund to user on doctor cancellation",
      },
      refundAmount
    );

 
    await this._bookingRepository.updateRefundStatus(bookingId, "Refunded");

    return { success: true };
  }
}
