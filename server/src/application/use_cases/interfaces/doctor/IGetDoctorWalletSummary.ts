export interface IGetDoctorWalletSummary {
  execute(
    doctorId: string,
    page: number,
    limit: number
  ): Promise<{
    walletBalance: number;
    transactions: {
      amount: number;
      type: string;
      date?: Date;
      [key: string]: any;
    }[];
    totalTransactions: number;
  }>;
}