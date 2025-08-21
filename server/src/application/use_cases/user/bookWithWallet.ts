import { IUserRepository } from "../../../domain/repositories/userRepository";
import { IBookingRepository } from "../../../domain/repositories/bookingRepository";
import { IDoctorRepository } from "../../../domain/repositories/doctorRepository";
import { IAdminWalletRepository } from "../../../domain/repositories/adminWalletRepository";
import { WalletTransactionUser } from "../../../domain/entities/walletTransactionUserEntity";
import { IBookWithWallet } from "../interfaces/user/IBookWithWallet";

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
    if (!user) throw new Error("User not found");

    if ((user.walletBalance || 0) < amount) {
      throw new Error("Insufficient wallet balance");
    }

    console.log("creditCommission amount =", amount);

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

    const booking = await this._bookingRepository.createBooking({
      doctorId,
      userId,
      slot,
      date,
      paymentStatus: "paid",
      status: "Upcoming",
      commissionAmount,
      doctorEarning,
    });
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

    return { message: "Appointment booked using wallet" };
  }
}