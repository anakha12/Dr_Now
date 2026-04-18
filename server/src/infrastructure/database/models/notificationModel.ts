import mongoose, { Schema, Document } from "mongoose";

export interface INotification extends Document {
  _id: mongoose.Types.ObjectId;
  recipientId: mongoose.Types.ObjectId;
  message: string;
  type: string;
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema: Schema = new Schema<INotification>(
  {
    recipientId: { type: Schema.Types.ObjectId, required: true },
    message: { type: String, required: true },
    type: { type: String, default: "info" },
    read: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<INotification>("notification", NotificationSchema);
