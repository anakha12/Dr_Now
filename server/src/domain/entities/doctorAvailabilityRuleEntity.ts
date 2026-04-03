
export class DoctorAvailabilityRule {
  constructor(
    public doctorId: string,
    public dayOfWeek: number,  
    public startTime: string,  
    public endTime: string,  
    public slotDuration: number,
    public id?: string 
  ) {}

  isValid(): boolean {
    return this.startTime < this.endTime && this.slotDuration > 0;
  }
}
