import { IAdminWalletRepository } from "../../../domain/repositories/adminWalletRepository";
import { IBookingRepository } from "../../../domain/repositories/bookingRepository";

export class GetWalletSummary {
  constructor(
    private _walletRepo: IAdminWalletRepository,
    private _bookingRepo: IBookingRepository
  ) {}

  async execute() {
    const wallet = await this._walletRepo.getSummary();
    const bookings = await this._bookingRepo.getPaidBookings(); 

    let totalCommission = 0;
    let pendingDoctorPayouts = 0;

    for (const booking of bookings) {
      totalCommission += booking.commissionAmount || 0;
      if (booking.payoutStatus === "Pending") {
        pendingDoctorPayouts += booking.doctorEarning || 0;
      }
    }
    return {
      totalBalance: wallet.totalBalance,
      transactionCount: wallet.transactionCount,
      totalCommission,
      pendingDoctorPayouts,
    };
  }
}
