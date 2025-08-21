export interface IGetDoctorAvailability {
  execute(doctorId: string): Promise<any>;
}