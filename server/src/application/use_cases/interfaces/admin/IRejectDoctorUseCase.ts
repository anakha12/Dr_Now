export interface IRejectDoctorUseCase {
  execute(doctorId: string): Promise<void>;
}
