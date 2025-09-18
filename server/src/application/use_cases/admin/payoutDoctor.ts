import { IBookingRepository } from "../../../domain/repositories/bookingRepository";
import { IAdminWalletRepository } from "../../../domain/repositories/adminWalletRepository";
import { IDoctorRepository } from "../../../domain/repositories/doctorRepository";
import { AdminWalletTransaction } from "../../../domain/entities/adminWalletEntity";
import { IPayoutDoctorUseCase } from "../interfaces/admin/IPayoutDoctorUseCase";
import { ErrorMessages } from "../../../utils/Messages";

export class PayoutDoctorUseCase implements IPayoutDoctorUseCase{
  constructor(
    private _bookingRepo: IBookingRepository,
    private _doctorRepo: IDoctorRepository,
    private _walletRepo: IAdminWalletRepository
  ) {}

  async execute(doctorId: string): Promise<void> {
    const bookings = await this._bookingRepo.getDoctorBookings(doctorId);

    const pendingBookings = bookings.filter(
      (b) => b.payoutStatus === "Pending" && b.status === "Completed"
    );

    if (!pendingBookings.length) {
      throw new Error( ErrorMessages.NO_PENDING_PAYOUTS);
    }

    const totalAmount = pendingBookings.reduce(
      (sum, b) => sum + (b.doctorEarning || 0),
      0
    );

    const transaction: AdminWalletTransaction = {
      type: "debit",
      amount: totalAmount,
      doctorId,
      description: `Payout to Doctor ID: ${doctorId}`,
      date: new Date(),
    };


    await this._walletRepo.createTransaction(transaction);


    await this._doctorRepo.creditWallet(doctorId, {
      amount: totalAmount,
      description: "Payout for completed bookings",
      date: new Date(),
    });

    const bookingIds = pendingBookings.map((b) => b.id).filter(Boolean) as string[];
    await this._bookingRepo.markPayoutAsPaid(bookingIds);
  }
}
