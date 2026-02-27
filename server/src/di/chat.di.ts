import { ChatRepository } from "../infrastructure/database/repositories/chatRepositoryImpl";
import { SendMessageUseCase } from "../application/use_cases/chat/sendMessageUseCase";
import { GetMessagesUseCase } from "../application/use_cases/chat/getMessagesUseCase";
import { ChatController } from "../interfaces/controllers/chatController";
import { ChatSocketService } from "../services/chatSocketService";

const chatRepository = new ChatRepository();

const sendMessageUseCase = new SendMessageUseCase(chatRepository);
const getMessagesUseCase = new GetMessagesUseCase(chatRepository);

const chatController = new ChatController(sendMessageUseCase);

const chatSocketService = new ChatSocketService(
  sendMessageUseCase,
  getMessagesUseCase 
);

export { chatController, sendMessageUseCase, chatSocketService };
