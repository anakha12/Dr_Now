
export interface BookingWithExtras {
  id: string;
  userId: string;
  doctorId: string;
  doctorName: string;
  department: string;
  patientName: string;
  startTime: string;
  endTime: string;
  date: string;
  status: 'Upcoming' | 'Cancelled' | 'Completed';
  paymentStatus: 'pending' | 'paid' | 'failed';
  transactionId?: string;
  doctorEarning?: number;
  commissionAmount?: number;
  payoutStatus: 'Pending' | 'Paid';
  refundStatus: 'NotRequired' | 'Refunded';
  cancellationReason?: string;
  createdAt: Date;
}
