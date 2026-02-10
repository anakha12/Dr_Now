import { Exclude, Expose } from "class-transformer";

@Exclude()
export class WalletSummaryResponseDTO {
  @Expose()
  totalBalance!: number;

  @Expose()
  transactionCount!: number;

  @Expose()
  totalCommission!: number;

  @Expose()
  pendingDoctorPayouts!: number;
}
