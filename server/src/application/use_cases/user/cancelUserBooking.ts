import { IBookingRepository } from "../../../domain/repositories/IBookingRepository";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { IAdminWalletRepository } from "../../../domain/repositories/IAdminWalletRepository";
import { ICancelUserBooking } from "../interfaces/user/ICancelUserBooking";
import { ErrorMessages, Messages } from "../../../utils/Messages";
import { CancelBookingRequestDTO } from "../../../interfaces/dto/request/cancel-booking.request.dto";
import { CancelBookingResponseDTO } from "../../../interfaces/dto/response/user/cancel-booking.dto";
import { BaseUseCase } from "../base-usecase";
import { NotificationRepositoryImpl } from "../../../infrastructure/database/repositories/notificationRepositoryImpl";

export class CancelUserBookingUseCase
  extends BaseUseCase<CancelBookingRequestDTO, CancelBookingResponseDTO>
  implements ICancelUserBooking {

  constructor(
    private _bookingRepository: IBookingRepository,
    private _userRepository: IUserRepository,
    private _adminWalletRepository: IAdminWalletRepository
  ) {
    super();
  }

  async execute(
    input: CancelBookingRequestDTO
  ): Promise<CancelBookingResponseDTO> {

    const dto = await this.validateDto(
      CancelBookingRequestDTO,
      input
    );

    const { bookingId, userId, reason } = dto;

    const booking = await this._bookingRepository.findBookingById(bookingId);

    if (!booking) {
      return { success: false, message: ErrorMessages.BOOKING_NOT_FOUND };
    }

    if (booking.userId.toString() !== userId) {
      return { success: false, message: Messages.UNAUTHORIZED };
    }

    if (booking.status !== "Upcoming") {
      return { success: false, message: ErrorMessages.NON_UPCOMING_BOOKING };
    }

    const appointmentDateTime = new Date(`${booking.date}T${booking.startTime}`);

    if (new Date() > appointmentDateTime) {
      return { success: false, message: ErrorMessages.CANNOT_CANCEL_PAST };
    }

    await this._bookingRepository.cancelBooking(bookingId, reason);

    const refundAmount =
      (booking.doctorEarning || 0) +
      (booking.commissionAmount || 0);

    const user = await this._userRepository.findUserById(booking.userId);

    if (!user) {
      return { success: false, message: Messages.USER_NOT_FOUND };
    }

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

    await this._bookingRepository.updateRefundStatus(
      bookingId,
      "Refunded"
    );

    // Trigger Notification for the Doctor
    try {
      const notificationRepository = new NotificationRepositoryImpl();
      await notificationRepository.createNotification({
        recipientId: booking.doctorId.toString(),
        message: `Cancellation: Patient ${user.name} has cancelled their appointment on ${booking.date} (${booking.startTime}).`,
        type: "warning",
        read: false,
      });
    } catch (err) {
      console.error("Failed to create cancellation notification", err);
    }

    return { success: true };
  }
}
