import { IAdminWalletRepository } from "../../../domain/repositories/adminWalletRepository";
import { IBookingRepository } from "../../../domain/repositories/bookingRepository";
import { IGetWalletSummaryUseCase } from "../interfaces/admin/IGetWalletSummaryUseCase";
import { WalletSummaryResponseDTO } from "../../../interfaces/dto/response/admin/wallet-summary-response.dto";
import { plainToInstance } from "class-transformer";

export class GetWalletSummary implements IGetWalletSummaryUseCase{
  constructor(
    private _walletRepo: IAdminWalletRepository,
    private _bookingRepo: IBookingRepository
  ) {}

  async execute() {
    const wallet = await this._walletRepo.getSummary();
    const bookings = await this._bookingRepo.getBookingsForWalletSummary(); 

    let totalCommission = 0;
    let pendingDoctorPayouts = 0;

    for (const booking of bookings) {
      totalCommission += booking.commissionAmount || 0;
      if (booking.payoutStatus === "Pending") {
        pendingDoctorPayouts += booking.doctorEarning || 0;
      }
    }
    return plainToInstance(
      WalletSummaryResponseDTO,
      {
        totalBalance: wallet.totalBalance,
        transactionCount: wallet.transactionCount,
        totalCommission,
        pendingDoctorPayouts,
      },
      { excludeExtraneousValues: true }
    );
  }
}

