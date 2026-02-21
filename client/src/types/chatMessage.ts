export interface ChatMessage {
  id: string;
  senderRole: "user" | "doctor";
  message: string;
  createdAt: string; 
  bookingId: string;
}
