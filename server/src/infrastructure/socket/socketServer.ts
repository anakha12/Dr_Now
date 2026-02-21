
import { Server, Socket } from "socket.io";
import { socketAuthMiddleware } from "./socketAuth";
import { ChatSocketService } from "../../services/chatSocketService";

export const initSocketServer = (io: Server, chatSocketService: ChatSocketService) => {
  io.use(socketAuthMiddleware);

  io.on("connection", (socket: Socket) => {
   

    socket.on("join-room", (bookingId: string) => chatSocketService.handleJoinRoom(socket, bookingId));

    socket.on("send-message", (data: { bookingId: string; message: string }) =>
      chatSocketService.handleSendMessage(socket, io, data)
    );

    socket.on("disconnect", () => console.log("User disconnected:", socket.data.user.id));
    socket.on("leave-room", (bookingId: string) => {
      socket.leave(bookingId);
    });
  });
};
