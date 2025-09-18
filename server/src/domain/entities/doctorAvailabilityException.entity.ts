
export class DoctorAvailabilityException {
  constructor(
    public doctorId: string,
    public date: string,         
    public isAvailable: boolean, 
    public startTime?: string,   
    public endTime?: string,
    public slotDuration?: number,
    public _id?: string
  ) {}

  
  isLeave(): boolean {
    return this.isAvailable === false;
  }

  isPartialAvailability(): boolean {
    return this.isAvailable === true && !!this.startTime && !!this.endTime;
  }
}
