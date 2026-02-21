
import { GetMessagesRequestDTO } from "../../../../interfaces/dto/request/chat/get-messages.dto";
import { ChatMessageResponseDTO } from "../../../../interfaces/dto/response/chat/get-messages-response.dto";

export interface IGetMessagesUseCase {
  execute(dto: GetMessagesRequestDTO): Promise<ChatMessageResponseDTO[]>;
}
