import { ChatMessageEntity } from "../entities/chatMessageEntity";

export interface SaveMessageDTO {
  bookingId: string;
  senderId: string;
  senderRole: "doctor" | "user";
  message: string;
}

export interface IChatRepository {
  saveMessage(data: SaveMessageDTO): Promise<ChatMessageEntity>;
  getMessagesByBookingId(bookingId: string): Promise<ChatMessageEntity[]>;
}

