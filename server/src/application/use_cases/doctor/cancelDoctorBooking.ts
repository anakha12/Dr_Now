import { IBookingRepository } from "../../../domain/repositories/bookingRepository";
import { IUserRepository } from "../../../domain/repositories/userRepository";
import { IAdminWalletRepository } from "../../../domain/repositories/adminWalletRepository";
import { ICancelDoctorBooking } from "../interfaces/doctor/ICancelDoctorBooking";
import { CancelDoctorBookingResponseDTO } from "../../../interfaces/dto/response/doctor/cancel-doctor-booking-response.dto";
import { ErrorMessages, Messages } from "../../../utils/Messages";
import { plainToInstance } from "class-transformer";

export class CancelDoctorBooking implements ICancelDoctorBooking {
  constructor(
    private _bookingRepository: IBookingRepository,
    private _userRepository: IUserRepository,
    private _adminWalletRepository: IAdminWalletRepository
  ) {}

  async execute(
    doctorId: string,
    bookingId: string,
    reason: string
  ): Promise<CancelDoctorBookingResponseDTO> {
    const booking = await this._bookingRepository.findBookingById(bookingId);

    if (!booking) {
      return plainToInstance(CancelDoctorBookingResponseDTO, {
        success: false,
        message: ErrorMessages.BOOKING_NOT_FOUND,
      });
    }

    if (booking.doctorId.toString() !== doctorId.toString()) {
      return plainToInstance(CancelDoctorBookingResponseDTO, {
        success: false,
        message: ErrorMessages.UNAUTHORIZED_CANCELLATION,
      });
    }

    if (booking.status !== "Upcoming") {
      return plainToInstance(CancelDoctorBookingResponseDTO, {
        success: false,
        message: ErrorMessages.NON_UPCOMING_BOOKING,
      });
    }

    const appointmentDateTime = new Date(`${booking.date}T${booking.startTime}`);
    if (new Date() > appointmentDateTime) {
      return plainToInstance(CancelDoctorBookingResponseDTO, {
        success: false,
        message: ErrorMessages.CANNOT_CANCEL_PAST,
      });
    }


    await this._bookingRepository.cancelBooking(bookingId, reason);


    const refundAmount = (booking.doctorEarning || 0) + (booking.commissionAmount || 0);
    const user = await this._userRepository.findUserById(booking.userId);
    if (!user) {
      return plainToInstance(CancelDoctorBookingResponseDTO, {
        success: false,
        message: ErrorMessages.USER_NOT_FOUND,
      });
    }


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

    return plainToInstance(CancelDoctorBookingResponseDTO, {
      success: true,
      message: Messages.REFUND_PROCESSED,
    });
  }
}
