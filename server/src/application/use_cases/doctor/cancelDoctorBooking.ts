import { IBookingRepository } from "../../../domain/repositories/bookingRepository";
import { IUserRepository } from "../../../domain/repositories/userRepository";
import { IAdminWalletRepository } from "../../../domain/repositories/adminWalletRepository";
import { ICancelDoctorBooking } from "../interfaces/doctor/ICancelDoctorBooking";
import { ErrorMessages, Messages } from "../../../utils/Messages";

export class CancelDoctorBooking implements ICancelDoctorBooking{
  constructor(
    private _bookingRepository: IBookingRepository,
    private _userRepository: IUserRepository,
    private _adminWalletRepository: IAdminWalletRepository
  ) {}

  async execute(doctorId: string, bookingId: string, reason: string): Promise<{ success: boolean; message?: string }> {
    const booking = await this._bookingRepository.findById(bookingId);

    if (!booking) {
      return { success: false, message: ErrorMessages.BOOKING_NOT_FOUND };
    }

    if (booking.doctorId.toString() !== doctorId.toString()) {
      return { success: false, message: ErrorMessages.UNAUTHORIZED_CANCELLATION };
    }

    if (booking.status !== "Upcoming") {
      return { success: false, message: ErrorMessages.NON_UPCOMING_BOOKING };
    }

    const appointmentDateTime = new Date(`${booking.date}T${booking.slot.from}`);
    const now = new Date();
    if (now > appointmentDateTime) {
      return { success: false, message: ErrorMessages.CANNOT_CANCEL_PAST};
    }

    
 
    await this._bookingRepository.cancelBooking(bookingId, reason);

    const refundAmount = (booking.doctorEarning || 0) + (booking.commissionAmount || 0);

    const user = await this._userRepository.findUserById(booking.userId);
    console.log(user)
    if (!user) return { success: false, message: ErrorMessages.USER_NOT_FOUND };

  
    await this._userRepository.updateUser(user.id!, {
      $inc: { walletBalance: refundAmount },
      $push: {
        walletTransactions: {
          type: "credit",
          amount: refundAmount,
          reason: Messages.BOOKING_CANCELLED_BY_DOCTOR,
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
        description: "Refund to user on doctor cancellation",
      },
      refundAmount
    );

 
    await this._bookingRepository.updateRefundStatus(bookingId, "Refunded");

    return { success: true, message: Messages.REFUND_PROCESSED};
  }
}
