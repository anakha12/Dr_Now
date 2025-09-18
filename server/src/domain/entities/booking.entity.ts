
export class Booking {
  constructor(
    public doctorId: string,
    public userId: string,
    public date: string,          // "2025-09-15"
    public startTime: string,     // "10:00"
    public endTime: string,       // "10:30"
    public status: 'Upcoming' | 'Cancelled' | 'Completed' = 'Upcoming',
    public paymentStatus: 'pending' | 'paid' | 'failed' = 'pending',
    public transactionId?: string,
    public doctorEarning?: number,
    public commissionAmount?: number,
    public payoutStatus: 'Pending' | 'Paid' = 'Pending',
    public refundStatus: 'NotRequired' | 'Refunded' = 'NotRequired',
    public cancellationReason?: string
  ) {}


  overlapsWith(other: Booking): boolean {
    return this.date === other.date &&
      !(this.endTime <= other.startTime || this.startTime >= other.endTime);
  }

  isPaid(): boolean {
    return this.paymentStatus === 'paid';
  }
}
