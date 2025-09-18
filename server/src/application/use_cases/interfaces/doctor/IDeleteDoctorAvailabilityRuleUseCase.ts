
export interface IDeleteDoctorAvailabilityRuleUseCase {
  execute(data: { doctorId: string; dayOfWeek: number }): Promise<{ message: string }>;
}
