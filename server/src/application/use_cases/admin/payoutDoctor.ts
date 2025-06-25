import { BookingRepository } from "../../../domain/repositories/bookingRepository";
import { AdminWalletRepository } from "../../../domain/repositories/adminWalletRepository";
import { DoctorRepository } from "../../../domain/repositories/doctorRepository";
import { AdminWalletTransaction } from "../../../domain/entities/adminWalletEntity";

export class PayoutDoctorUseCase {
  constructor(
    private bookingRepo: BookingRepository,
    private doctorRepo: DoctorRepository,
    private walletRepo: AdminWalletRepository
  ) {}

  async execute(doctorId: string): Promise<void> {
    const bookings = await this.bookingRepo.getDoctorBookings(doctorId);

    const pendingBookings = bookings.filter(
      (b) => b.payoutStatus === "Pending"
    );

    if (!pendingBookings.length) {
      throw new Error("No pending payouts for this doctor");
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


    await this.walletRepo.createTransaction(transaction);


    await this.doctorRepo.creditWallet(doctorId, {
      amount: totalAmount,
      description: "Payout for completed bookings",
      date: new Date(),
    });

    // 3. Update payoutStatus of those bookings
    const bookingIds = pendingBookings.map((b) => b.id).filter(Boolean) as string[];
    await this.bookingRepo.markPayoutAsPaid(bookingIds);
  }
}
