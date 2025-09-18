import { IBookingRepository } from "../../../domain/repositories/bookingRepository";
import { IUserRepository } from "../../../domain/repositories/userRepository";
import { IAdminWalletRepository } from "../../../domain/repositories/adminWalletRepository";
import { ICancelUserBooking } from "../interfaces/user/ICancelUserBooking";
import { ErrorMessages, Messages } from "../../../utils/Messages";

export class CancelUserBookingUseCase implements ICancelUserBooking{
  constructor(
    private _bookingRepository: IBookingRepository,
    private _userRepository: IUserRepository,
    private _adminWalletRepository: IAdminWalletRepository
  ) {}

  async execute(bookingId: string, userId: string, reason?: string) {
    const booking = await this._bookingRepository.findById(bookingId);
    if (!booking) return { success: false, message: ErrorMessages.BOOKING_NOT_FOUND };

    if (booking.userId.toString() !== userId.toString()) {
      return { success: false, message: Messages.UNAUTHORIZED };
    }

    if (booking.status !== "Upcoming") {
      return { success: false, message: ErrorMessages.NON_UPCOMING_BOOKING };
    }

    const appointmentDateTime = new Date(`${booking.date}T${booking.slot.from}`);
    const now = new Date();
    if (now > appointmentDateTime) {
      return { success: false, message: ErrorMessages.CANNOT_CANCEL_PAST };
    }

 
    await this._bookingRepository.cancelBooking(bookingId, reason);

    const refundAmount = (booking.doctorEarning || 0) + (booking.commissionAmount || 0);

    const user = await this._userRepository.findUserById(booking.userId);
    if (!user) return { success: false, message: Messages.USER_NOT_FOUND };


    await this._userRepository.updateUser(user.id!, {
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

 
    await this._adminWalletRepository.debitCommission(
      {
        type: "debit",
        amount: refundAmount,
        userId: user.id!,
        bookingId,
        description: "Refund to user on appointment cancellation",
      },
      refundAmount
    );

    await this._bookingRepository.updateRefundStatus(bookingId, "Refunded");

    return { success: true };
  }
}
