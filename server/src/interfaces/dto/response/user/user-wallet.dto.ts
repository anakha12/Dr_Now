
import { Exclude, Expose, Type } from "class-transformer";

@Exclude()
export class WalletTransactionDTO {
  @Expose()
  type!: "credit" | "debit";

  @Expose()
  amount!: number;

  @Expose()
  reason!: string;

  @Expose()
  bookingId!: string;

  @Expose()
  date!: Date;
}

@Exclude()
export class UserWalletResponseDTO {
  @Expose()
  walletBalance!: number;

  @Expose()
  @Type(() => WalletTransactionDTO)
  walletTransactions!: WalletTransactionDTO[];

  @Expose()
  totalTransactions!: number;
}
