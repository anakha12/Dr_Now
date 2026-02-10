 import { PendingDoctorPayoutResponseDTO } from "../../../../interfaces/dto/response/admin/pending-doctor-payout.dto";
 
 
 export interface IGetPendingDoctorPayoutsUseCase {
  execute(
    page: number,
    limit: number
  ): Promise<{
    doctors: PendingDoctorPayoutResponseDTO[];
    totalPages: number;
  }>;
}
