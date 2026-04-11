import { ChatRepository } from "../infrastructure/database/repositories/chatRepositoryImpl";
import { SendMessageUseCase } from "../application/use_cases/chat/sendMessageUseCase";
import { GetMessagesUseCase } from "../application/use_cases/chat/getMessagesUseCase";
import { ChatController } from "../interfaces/controllers/chatController";
import { ChatSocketService } from "../services/chatSocketService";
import { BookingRepositoryImpl } from "../infrastructure/database/repositories/bookingRepositoryImpl";
import { NotificationRepositoryImpl } from "../infrastructure/database/repositories/notificationRepositoryImpl";

const chatRepository = new ChatRepository();
const bookingRepository = new BookingRepositoryImpl();
const notificationRepository = new NotificationRepositoryImpl();

const sendMessageUseCase = new SendMessageUseCase(chatRepository);
const getMessagesUseCase = new GetMessagesUseCase(chatRepository);

const chatController = new ChatController(sendMessageUseCase);

const chatSocketService = new ChatSocketService(
  sendMessageUseCase,
  getMessagesUseCase,
  bookingRepository,
  notificationRepository
);

export { chatController, sendMessageUseCase, chatSocketService };
