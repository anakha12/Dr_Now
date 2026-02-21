import { io, type Socket } from "socket.io-client";

const SOCKET_URL = "http://localhost:5000"; 

export let socket: Socket;

export const connectSocket = () => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      withCredentials: true,
      autoConnect: false,
    });

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
    });

    socket.on("disconnect", (reason) => {
      console.log("Socket disconnected:", reason);
    });

    socket.on("connect_error", (err) => {
      console.log("Socket connection failed:", err.message);
    });
  }

  if (!socket.connected) {
    socket.connect();
  }
};