export interface IGetBookedSlots {
  execute(doctorId: string, date: string): Promise<any[]>;
}
