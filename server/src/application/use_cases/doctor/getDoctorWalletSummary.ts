import { IDoctorRepository } from "../../../domain/repositories/doctorRepository";
import { IGetDoctorWalletSummary } from "../interfaces/doctor/IGetDoctorWalletSummary";
import { plainToInstance } from "class-transformer";
import { DoctorWalletSummaryDTO, WalletTransactionDTO } from "../../../interfaces/dto/response/doctor/doctor-wallet-summary.dto";

export class GetDoctorWalletSummary implements IGetDoctorWalletSummary {
  constructor(private _doctorRepository: IDoctorRepository) {}

  async execute(doctorId: string, page: number, limit: number): Promise<DoctorWalletSummaryDTO> {
    const doctor = await this._doctorRepository.getDoctorById(doctorId);

    const walletBalance = doctor.walletBalance ?? 0;
    const allTransactions = doctor.walletTransactions ?? [];

    const sorted = allTransactions.sort(
      (a, b) => (b.date?.getTime() || 0) - (a.date?.getTime() || 0)
    );

    const start = (page - 1) * limit;
    const paginated = sorted.slice(start, start + limit);

    // Map transactions to DTO
    const transactionsDto = paginated.map(t => plainToInstance(WalletTransactionDTO, t, { excludeExtraneousValues: true }));

    return plainToInstance(DoctorWalletSummaryDTO, {
      walletBalance,
      transactions: transactionsDto,
      totalTransactions: allTransactions.length,
    }, { excludeExtraneousValues: true });
  }
}
