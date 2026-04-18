import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { IBookingRepository } from "../../../domain/repositories/IBookingRepository";
import { IDoctorRepository } from "../../../domain/repositories/IDoctorRepository";
import { IAdminWalletRepository } from "../../../domain/repositories/IAdminWalletRepository";
import { WalletTransactionUser } from "../../../domain/entities/walletTransactionUserEntity";
import { IBookWithWallet } from "../interfaces/user/IBookWithWallet";
import { Booking } from "../../../domain/entities/bookingEntity";
import { ErrorMessages, Messages } from "../../../utils/Messages";
import { NotificationRepositoryImpl } from "../../../infrastructure/database/repositories/notificationRepositoryImpl";

export class BookWithWalletUseCase implements IBookWithWallet {
  constructor(
    private _userRepository: IUserRepository,
    private _doctorRepository: IDoctorRepository,
    private _bookingRepository: IBookingRepository,
    private _adminWalletRepo: IAdminWalletRepository 
  ) {}

  async execute(
    userId: string,
    doctorId: string,
    slot: { from: string; to: string },
    amount: number,
    date: string
  ) {
    const user = await this._userRepository.findUserById(userId);
    if (!user) throw new Error( Messages.USER_NOT_FOUND);

    if ((user.walletBalance || 0) < amount) {
      throw new Error( ErrorMessages.INSUFFICIENT_WALLET_BALANCE);
    }

    const transaction: WalletTransactionUser = {
      amount: -amount,
      type: "debit",
      reason: `Appointment booked with doctor on ${date} (${slot.from} - ${slot.to})`,
      date: new Date(),
    };

    await this._userRepository.updateUserWalletAndTransactions(userId, -amount, transaction);

    const commissionRate = 0.1;
    const commissionAmount = parseFloat((amount * commissionRate).toFixed(2));
    const doctorEarning = parseFloat((amount - commissionAmount).toFixed(2));

    const booking = await this._bookingRepository.createBooking(new Booking(
      doctorId,
      userId,
      date,
      slot.from,
      slot.to,
      "Upcoming",
      "paid",
      undefined,
      doctorEarning,
      commissionAmount
    ));
    const amountNum = typeof amount === "string" ? parseFloat(amount) : amount; 

    
    await this._adminWalletRepo.creditCommission(
      {
        amount: amountNum,
        doctorId,
        userId,
        bookingId: booking.id,
        description: "Commission from booking (wallet)",
        type: "credit",
      },
      amountNum 
    );

    // Trigger Notification for the Doctor
    try {
      const notificationRepository = new NotificationRepositoryImpl();
      await notificationRepository.createNotification({
        recipientId: doctorId,
        message: `New Booking: Patient booked an appointment on ${date} (${slot.from} - ${slot.to}) via Wallet.`,
        type: "success",
        read: false,
      });
    } catch (notifErr) {
      console.error("Failed to create notification", notifErr);
    }

    return { message: Messages.WALLET_BOOKING_SUCCESS};
  }
}