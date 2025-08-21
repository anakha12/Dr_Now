export interface IGetDoctorById {
  execute(doctorId: string): Promise<any | null>;
}
