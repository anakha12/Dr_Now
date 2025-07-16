

import mongoose, { Schema, Document } from 'mongoose';

export interface Slot {
  from: string;
  to: string;
}

export interface IBooking extends Document {
  doctorId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
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

const slotSchema = new Schema<Slot>({
  from: { type: String, required: true },
  to: { type: String, required: true },
});

const BookingSchema: Schema = new Schema<IBooking>(
  {
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    date: { type: String, required: true },
    slot: { type: slotSchema, required: true },
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
    cancellationReason: {
      type: String,
      default: ''
    }

  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IBooking>('Booking', BookingSchema);
