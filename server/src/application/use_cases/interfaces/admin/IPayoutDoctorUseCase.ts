export interface IPayoutDoctorUseCase {
  execute(doctorId: string): Promise<void>;
}
