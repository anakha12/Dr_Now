export interface IVerifyDoctorUseCase {
  execute(doctorId: string): Promise<void>;
}
