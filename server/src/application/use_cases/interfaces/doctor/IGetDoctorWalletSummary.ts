import { DoctorWalletSummaryDTO } from "../../../../interfaces/dto/response/doctor/doctor-wallet-summary.dto";

export interface IGetDoctorWalletSummary {
  execute(
    doctorId: string,
    page: number,
    limit: number
  ): Promise<DoctorWalletSummaryDTO>;
}
