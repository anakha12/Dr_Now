import { Schema, model, Types, HydratedDocument } from "mongoose";


export interface ChatMessage {
  bookingId: Types.ObjectId;
  senderId: Types.ObjectId;
  senderRole: "USER" | "DOCTOR";
  message: string;
  createdAt: Date;
}


export type ChatMessageDocument = HydratedDocument<ChatMessage>;

const chatMessageSchema = new Schema<ChatMessage>(
  {
    bookingId: { type: Schema.Types.ObjectId, required: true, ref: "Booking" },
    senderId: { type: Schema.Types.ObjectId, required: true },
    senderRole: { type: String, enum: ["USER", "DOCTOR"], required: true },
    message: { type: String, required: true },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

const ChatMessageModel = model<ChatMessage>(
  "ChatMessage",
  chatMessageSchema
);

export default ChatMessageModel;
