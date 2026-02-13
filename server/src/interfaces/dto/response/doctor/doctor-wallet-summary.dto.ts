
import { Expose, Type } from "class-transformer";

export class WalletTransactionDTO {
  @Expose()
  type!: "credit" | "debit";

  @Expose()
  amount!: number;

  @Expose()
  reason!: string;

  @Expose()
  date!: Date;
}

export class DoctorWalletSummaryDTO {
  @Expose()
  walletBalance!: number;

  @Expose()
  @Type(() => WalletTransactionDTO)
  transactions!: WalletTransactionDTO[];

  @Expose()
  totalTransactions!: number;
}
