import mongoose, { Schema, Document } from 'mongoose';

export interface IAdminWalletTransaction {
  type: 'credit' | 'debit';
  amount: number;
  doctorId?: mongoose.Types.ObjectId;
  userId?: mongoose.Types.ObjectId;
  bookingId?: mongoose.Types.ObjectId;
  description: string;
  date?: Date;
}

export interface IAdminWallet extends Document {
  totalBalance: number;
  transactions: IAdminWalletTransaction[];
}

const adminWalletSchema = new Schema<IAdminWallet>({
  totalBalance: { type: Number, default: 0 },
  transactions: [
    {
      type: {
        type: String,
        enum: ['credit', 'debit'],
        required: true,
      },
      amount: { type: Number, required: true },
      doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' },
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
      bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
      description: { type: String },
      date: { type: Date, default: Date.now },
    },
  ],
});

export default mongoose.model<IAdminWallet>('AdminWallet', adminWalletSchema);
