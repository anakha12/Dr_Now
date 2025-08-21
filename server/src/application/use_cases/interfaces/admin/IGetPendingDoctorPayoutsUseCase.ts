export interface IGetPendingDoctorPayoutsUseCase {
  execute(
    page: number,
    limit: number
  ): Promise<{
    doctors: any[];
    totalPages: number;
  }>;
}
