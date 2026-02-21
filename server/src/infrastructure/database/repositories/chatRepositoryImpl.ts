import { Types } from "mongoose";
import {
  IChatRepository,
  SaveMessageDTO,
} from "../../../domain/repositories/IChatRepository";
import { ChatMessageEntity } from "../../../domain/entities/chatMessageEntity";
import ChatMessageModel, {
  ChatMessageDocument,
} from "../models/chatMessageMoodel";

export class ChatRepository implements IChatRepository {

  async saveMessage(
    data: SaveMessageDTO
  ): Promise<ChatMessageEntity> {

    const created: ChatMessageDocument =
      await ChatMessageModel.create({
        bookingId: new Types.ObjectId(data.bookingId),
        senderId: new Types.ObjectId(data.senderId),
        senderRole:
          data.senderRole === "user" ? "USER" : "DOCTOR",
        message: data.message,
      });

    return this.mapToEntity(created);
  }

  async getMessagesByBookingId(
    bookingId: string
  ): Promise<ChatMessageEntity[]> {

    const messages: ChatMessageDocument[] =
      await ChatMessageModel.find({
        bookingId: new Types.ObjectId(bookingId),
      }).sort({ createdAt: 1 });

    return messages.map((msg) => this.mapToEntity(msg));
  }

  private mapToEntity(
    doc: ChatMessageDocument
  ): ChatMessageEntity {
    return {
      id: doc._id.toString(),
      bookingId: doc.bookingId.toString(),
      senderId: doc.senderId.toString(),
      senderRole:
        doc.senderRole === "USER" ? "user" : "doctor",
      message: doc.message,
      createdAt: doc.createdAt,
    };
  }
}