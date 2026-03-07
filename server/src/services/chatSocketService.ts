
import { Server, Socket } from "socket.io";
import { ISendMessageUseCase } from "../application/use_cases/interfaces/chat/ISendMessageUseCase";
import { IGetMessagesUseCase } from "../application/use_cases/interfaces/chat/IGetMessagesUseCase";
import { ChatRole } from "../utils/Constance";

export class ChatSocketService {
  constructor(
    private sendMessageUseCase: ISendMessageUseCase,
    private getMessagesUseCase: IGetMessagesUseCase
  ) {}

  async handleJoinRoom(socket: Socket, bookingId: string) {
    socket.join(bookingId);

    const messages = await this.getMessagesUseCase.execute({ bookingId });
    socket.emit("previous-messages", messages);
  }

  async handleSendMessage(socket: Socket, io: Server, data: { bookingId: string; message: string }) {
    const user = socket.data.user;

    try {
      const savedMessage = await this.sendMessageUseCase.execute({
        bookingId: data.bookingId,
        senderId: user.id,
        senderRole: user.role === "doctor" ? ChatRole.DOCTOR : ChatRole.USER,
        message: data.message,
      });

      io.to(data.bookingId).emit("receive-message", savedMessage);
    } catch (err: unknown) {
      if (err instanceof Error) {
        socket.emit("error-message", { message: err.message });
      } else {
        socket.emit("error-message", { message: "Unknown error occurred" });
      }
    }
  }
}
