import { useEffect, useState,useRef } from "react";
import { useParams } from "react-router-dom";
import { socket, connectSocket } from "../../services/socket";
import type { ChatMessage } from "../../types/chatMessage";

const ChatPage = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null)
  const [input, setInput] = useState("");

  useEffect(() => {
    if (!bookingId) return;

    connectSocket();

    socket.emit("join-room", bookingId);

    socket.off("previous-messages");
    socket.off("receive-message");
    socket.off("error-message");

    socket.on("previous-messages", (msgs: ChatMessage[]) => setMessages(msgs));
    socket.on("receive-message", (msg: ChatMessage) => setMessages((prev) => [...prev, msg]));
    socket.on("error-message", (err: { message: string }) => alert(err.message));

    return () => {
      socket.emit("leave-room", bookingId);
      socket.off("previous-messages");
      socket.off("receive-message");
      socket.off("error-message");
    };
  }, [bookingId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    const trimmed = input.trim();
    if (!trimmed || !bookingId) return;

    socket.emit("send-message", { bookingId, message: trimmed });
    setInput("");
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 border rounded-lg bg-white mb-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`mb-2 p-2 rounded ${
              msg.senderRole === "user" ? "bg-teal-100 self-end" : "bg-gray-200 self-start"
            }`}
          >
            <span className="font-medium">{msg.senderRole}</span>: {msg.message}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <div className="flex">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 border rounded-l-lg px-4 py-2"
        />
        <button
          onClick={sendMessage}
          className="bg-teal-600 text-white px-4 py-2 rounded-r-lg hover:bg-teal-700"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatPage;
