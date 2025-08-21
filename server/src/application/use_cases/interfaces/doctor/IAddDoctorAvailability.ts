export interface IAddDoctorAvailability {
  execute(
    doctorId: string,
    payload: {
      date: string;
      from: string;
      to: string;
    }
  ): Promise<{ message: string }>;
}
