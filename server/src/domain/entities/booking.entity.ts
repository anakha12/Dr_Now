
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
    public id?: string 
  ) {}


  overlapsWith(other: Booking): boolean {
    return this.date === other.date &&
      !(this.endTime <= other.startTime || this.startTime >= other.endTime);
  }

  isPaid(): boolean {
    return this.paymentStatus === 'paid';
  }
}
