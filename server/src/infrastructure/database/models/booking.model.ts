import mongoose, { Schema, Document } from 'mongoose';

export interface IMedicine {
  name: string;
  dose: string;
  frequency: string;
  duration: string;
  notes?: string;
}

export interface IPrescription {
  doctorName: string;
  date: string;
  medicines: IMedicine[];
  notes?: string;
}

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
  prescription?: IPrescription;
  isReviewed: boolean;
}

const MedicineSchema: Schema = new Schema({
  name: { type: String, required: true },
  dose: { type: String, required: true },
  frequency: { type: String, required: true },
  duration: { type: String, required: true },
  notes: { type: String },
});

const PrescriptionSchema: Schema = new Schema({
  doctorName: { type: String, required: true },
  date: { type: String, required: true },
  medicines: { type: [MedicineSchema], required: true },
  notes: { type: String },
});

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
    cancellationReason: { type: String, default: '' },
    prescription: { type: PrescriptionSchema },
    isReviewed: { type: Boolean, default: false },
  },
  { timestamps: true }
);


BookingSchema.index(
  { doctorId: 1, date: 1, startTime: 1 }, 
  { unique: true }
);


export default mongoose.model<IBooking>('Booking', BookingSchema);
