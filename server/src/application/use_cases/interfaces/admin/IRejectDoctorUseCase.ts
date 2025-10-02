export interface IRejectDoctorUseCase {
  execute(doctorId: string, reason: string): Promise<void>;
}
