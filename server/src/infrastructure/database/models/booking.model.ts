import mongoose, { Schema, Document } from 'mongoose';

export interface IBooking extends Document {
  _id: mongoose.Types.ObjectId; 
  doctorId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  date: string; 
  startTime: string; 
  endTime: string;
  paymentStatus: 'pending' | 'paid' | 'failed';
  transactionId?: string; 
  status: 'Upcoming' | 'Cancelled' | 'Completed';
  doctorEarning?: number;
  commissionAmount?: number;
  payoutStatus?: 'Pending' | 'Paid';
  refundStatus?: 'NotRequired' | 'Refunded';
  cancellationReason?: string;
}

const BookingSchema: Schema = new Schema<IBooking>(
  {
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    date: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed'],
      default: 'pending',
    },
    transactionId: { type: String },
    status: {
      type: String,
      enum: ['Upcoming', 'Cancelled', 'Completed'],
      default: 'Upcoming',
    },
    doctorEarning: { type: Number },
    commissionAmount: { type: Number },
    payoutStatus: {
      type: String,
      enum: ['Pending', 'Paid'],
      default: 'Pending',
    },
    refundStatus: {
      type: String,
      enum: ['NotRequired', 'Refunded'],
      default: 'NotRequired',
    },
    cancellationReason: { type: String, default: '' }
  },
  { timestamps: true }
);

export default mongoose.model<IBooking>('Booking', BookingSchema);
