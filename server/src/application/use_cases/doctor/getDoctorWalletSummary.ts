import { IDoctorRepository } from "../../../domain/repositories/doctorRepository";
import { IGetDoctorWalletSummary } from "../interfaces/doctor/IGetDoctorWalletSummary";

export class GetDoctorWalletSummary implements IGetDoctorWalletSummary{
  constructor(private _doctorRepository: IDoctorRepository) {}

  async execute(doctorId: string, page: number, limit: number) {
    const doctor = await this._doctorRepository.getDoctorById(doctorId);

    const walletBalance = doctor.walletBalance ?? 0;
    const allTransactions = doctor.walletTransactions ?? [];

   console.log("walletBalance",walletBalance)
    const sorted = allTransactions.sort(
      (a, b) => (b.date?.getTime() || 0) - (a.date?.getTime() || 0)
    );

    const start = (page - 1) * limit;
    const paginated = sorted.slice(start, start + limit);

    return {
      walletBalance,
      transactions: paginated,
      totalTransactions: allTransactions.length,
    };
  }
}
