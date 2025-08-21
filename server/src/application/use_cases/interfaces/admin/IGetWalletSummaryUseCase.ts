export interface IGetWalletSummaryUseCase {
  execute(): Promise<{
    totalBalance: number;
    transactionCount: number;
    totalCommission: number;
    pendingDoctorPayouts: number;
  }>;
}
