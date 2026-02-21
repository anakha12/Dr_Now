// application/use_cases/chat/getMessagesUseCase.ts
import { IChatRepository } from "../../../domain/repositories/IChatRepository";
import { BaseUseCase } from "../base-usecase";
import { GetMessagesRequestDTO } from "../../../interfaces/dto/request/chat/get-messages.dto";
import { ChatMessageResponseDTO } from "../../../interfaces/dto/response/chat/get-messages-response.dto";
import { IGetMessagesUseCase } from "../interfaces/chat/IGetMessagesUseCase";

export class GetMessagesUseCase
  extends BaseUseCase<GetMessagesRequestDTO, ChatMessageResponseDTO[]>
  implements IGetMessagesUseCase
{
  constructor(private readonly chatRepository: IChatRepository) {
    super();
  }

  async execute(dto: GetMessagesRequestDTO): Promise<ChatMessageResponseDTO[]> {

    const validatedDto = await this.validateDto(GetMessagesRequestDTO, dto);


    const messages = await this.chatRepository.getMessagesByBookingId(validatedDto.bookingId);


    return messages.map((msg) => ({
      id: msg.id,
      bookingId: msg.bookingId,
      senderId: msg.senderId,
      senderRole: msg.senderRole,
      message: msg.message,
      createdAt: msg.createdAt.toISOString(),
    }));
  }
}
