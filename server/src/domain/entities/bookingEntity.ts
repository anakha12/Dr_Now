export interface Slot {
  from: string;
  to: string;
}
export interface EnrichedBooking extends Booking {
  doctorName: string;
  department: string;
  patientName: string;
}

export interface EnrichedDoctorBooking extends Booking {
  patientName: string;
}

export interface Booking {
  id?: string;
  doctorId: string;
  userId: string;
  date: string;
  slot: Slot;
  paymentStatus: 'pending' | 'paid' | 'failed';
  transactionId?: string;
  status: 'Upcoming' | 'Cancelled' | 'Completed'; 
  createdAt?: Date;
  updatedAt?: Date;
  doctorEarning?: number;
  commissionAmount?: number;
  payoutStatus?: 'Pending' | 'Paid';
  refundStatus?: 'NotRequired' | 'Refunded';
  cancellationReason?: string;
}
