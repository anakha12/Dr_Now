export interface IUpdateDoctorProfile {
  execute(doctorId: string, updates: any): Promise<any>;
}
