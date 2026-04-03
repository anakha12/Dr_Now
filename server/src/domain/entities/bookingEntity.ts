import { IPrescription  } from "../../infrastructure/database/models/booking.model";

export class Booking {
  constructor(
    public doctorId: string,
    public userId: string,
    public date: string,          
    public startTime: string,    
    public endTime: string,      
    public status: 'Upcoming' | 'Cancelled' | 'Completed' = 'Upcoming',
    public paymentStatus: 'pending' | 'paid' | 'failed' = 'pending',
    public transactionId?: string,
    public doctorEarning?: number,
    public commissionAmount?: number,
    public payoutStatus: 'Pending' | 'Paid' = 'Pending',
    public refundStatus: 'NotRequired' | 'Refunded' = 'NotRequired',
    public cancellationReason?: string,
    public patientName?: string,    
    public department?: string,
    public id?: string,
    public doctorName?: string,
    public prescription?: IPrescription | null,
    public createdAt: string = new Date().toISOString()
  ) {}


  overlapsWith(other: Booking): boolean {
    return this.date === other.date &&
      !(this.endTime <= other.startTime || this.startTime >= other.endTime);
  }

  isPaid(): boolean {
    return this.paymentStatus === 'paid';
  }
}
