import { AdminWalletRepository } from "../../../domain/repositories/adminWalletRepository";
import { BookingRepository } from "../../../domain/repositories/bookingRepository";

export class GetWalletSummary {
  constructor(
    private walletRepo: AdminWalletRepository,
    private bookingRepo: BookingRepository
  ) {}

  async execute() {
    const wallet = await this.walletRepo.getSummary();
    const bookings = await this.bookingRepo.getPaidBookings(); 

    let totalCommission = 0;
    let pendingDoctorPayouts = 0;

    for (const booking of bookings) {
      totalCommission += booking.commissionAmount || 0;
      if (booking.payoutStatus === "Pending") {
        pendingDoctorPayouts += booking.doctorEarning || 0;
      }
    }
    console.log('pendingDoctorPayouts',pendingDoctorPayouts);
    return {
      totalBalance: wallet.totalBalance,
      transactionCount: wallet.transactionCount,
      totalCommission,
      pendingDoctorPayouts,
    };
  }
}
