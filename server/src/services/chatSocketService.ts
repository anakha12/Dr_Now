
import { Server, Socket } from "socket.io";
import { ISendMessageUseCase } from "../application/use_cases/interfaces/chat/ISendMessageUseCase";
import { IGetMessagesUseCase } from "../application/use_cases/interfaces/chat/IGetMessagesUseCase";
import { IBookingRepository } from "../domain/repositories/IBookingRepository";
import { NotificationRepository } from "../domain/repositories/notificationRepository";
import { ChatRole } from "../utils/Constance";

export class ChatSocketService {
  constructor(
    private sendMessageUseCase: ISendMessageUseCase,
    private getMessagesUseCase: IGetMessagesUseCase,
    private bookingRepository: IBookingRepository,
    private notificationRepository: NotificationRepository
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

      // --- Create notification for the OTHER party in the booking ---
      try {
        const booking = await this.bookingRepository.findBookingById(data.bookingId);
        if (booking) {
          const senderIsDoctor = user.role === "doctor";
          const recipientId = senderIsDoctor
            ? booking.userId.toString()
            : booking.doctorId.toString();

          const senderLabel = senderIsDoctor ? "Your doctor" : "Your patient";

          await this.notificationRepository.createNotification({
            recipientId,
            message: `${senderLabel} sent you a new message.`,
            type: "info",
            read: false,
          });
        }
      } catch (notifErr) {
        console.error("Failed to create chat notification:", notifErr);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        socket.emit("error-message", { message: err.message });
      } else {
        socket.emit("error-message", { message: "Unknown error occurred" });
      }
    }
  }
}
