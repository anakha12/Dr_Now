import { IChatRepository } from "../../../domain/repositories/IChatRepository";
import { ISendMessageUseCase } from "../interfaces/chat/ISendMessageUseCase";
import { SendMessageRequestDTO } from "../../../interfaces/dto/request/chat/send-message.dto.";
import { SendMessageResponseDTO } from "../../../interfaces/dto/response/chat/send-message-response.dto";
import { ChatRole } from "../../../utils/Constance";

export class SendMessageUseCase implements ISendMessageUseCase {
  constructor(private readonly chatRepository: IChatRepository) {}

  async execute(
    data: SendMessageRequestDTO
  ): Promise<SendMessageResponseDTO> {

    if (!data.message.trim()) {
      throw new Error("Message cannot be empty");
    }

    if (
      data.senderRole !== ChatRole.DOCTOR &&
      data.senderRole !== ChatRole.USER
    ) {
      throw new Error("Only doctor or user can send messages");
    }

    // ✅ Pass plain object (no entity)
    const savedEntity = await this.chatRepository.saveMessage({
      bookingId: data.bookingId,
      senderId: data.senderId,
      senderRole: data.senderRole,
      message: data.message,
    });

    return {
      id: savedEntity.id,
      bookingId: savedEntity.bookingId,
      senderId: savedEntity.senderId,
      senderRole: savedEntity.senderRole,
      message: savedEntity.message,
      createdAt: savedEntity.createdAt,
    };
  }
}
