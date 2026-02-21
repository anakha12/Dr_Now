
export class ChatMessageResponseDTO {
  id!: string;
  bookingId!: string;
  senderId!: string;
  senderRole!: "user" | "doctor";
  message!: string;
  createdAt!: string;
}
