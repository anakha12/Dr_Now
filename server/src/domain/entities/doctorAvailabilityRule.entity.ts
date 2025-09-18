
export class DoctorAvailabilityRule {
  constructor(
    public doctorId: string,
    public dayOfWeek: number,  
    public startTime: string,  
    public endTime: string,  
    public slotDuration: number,
    public id?: string 
  ) {}

  // Business rule: ensure slot rule is valid
  isValid(): boolean {
    return this.startTime < this.endTime && this.slotDuration > 0;
  }
}
