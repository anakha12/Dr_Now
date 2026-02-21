export interface ChatMessageEntity {
  id: string;
  bookingId: string;
  senderId: string;
  senderRole: "doctor" | "user";
  message: string;
  createdAt: Date;
}
