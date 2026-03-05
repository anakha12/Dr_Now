import { Server, Socket } from "socket.io";
import { socketAuthMiddleware } from "./socketAuth";
import { ChatSocketService } from "../../services/chatSocketService";

export const initSocketServer = (
  io: Server,
  chatSocketService: ChatSocketService
) => {
  io.use(socketAuthMiddleware);

  io.on("connection", (socket: Socket) => {
    console.log("User connected:", socket.data?.user?.id);

    socket.on("join-room", (bookingId: string) =>
      chatSocketService.handleJoinRoom(socket, bookingId)
    );

    socket.on(
      "send-message",
      (data: { bookingId: string; message: string }) =>
        chatSocketService.handleSendMessage(socket, io, data)
    );

    // ---------------- VIDEO CALL ----------------

    socket.on("video-offer", ({ bookingId, offer }) => {
      socket.to(bookingId).emit("video-offer", { offer });
    });

    socket.on("video-answer", ({ bookingId, answer }) => {
      socket.to(bookingId).emit("video-answer", { answer });
    });

    socket.on("ice-candidate", ({ bookingId, candidate }) => {
      socket.to(bookingId).emit("ice-candidate", { candidate });
    });

    socket.on("end-call", ({ bookingId }) => {
      io.to(bookingId).emit("call-ended");
    });

    // --------------------------------------------

    socket.on("leave-room", (bookingId: string) => {
      socket.leave(bookingId);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.data?.user?.id);
    });
  });
};