import { SendMessageRequestDTO } from "../../../../interfaces/dto/request/chat/send-message.dto.";
import { SendMessageResponseDTO } from "../../../../interfaces/dto/response/chat/send-message-response.dto";

export interface ISendMessageUseCase {
  execute(data: SendMessageRequestDTO): Promise<SendMessageResponseDTO>;
}
