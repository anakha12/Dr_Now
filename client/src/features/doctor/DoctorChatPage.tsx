import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { socket, connectSocket } from "../../services/socket";
import type { ChatMessage } from "../../types/chatMessage";
import { useNotifications } from "../../context/NotificationContext";
import { completeBooking } from "../../services/doctorService";

const DoctorChatPage = () => {
  const { bookingId } = useParams<{ bookingId: string }>();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");

  const [isCalling, setIsCalling] = useState(false);
  const [incomingCall, setIncomingCall] = useState(false);
  const { addNotification, confirmMessage } = useNotifications();

  const bottomRef = useRef<HTMLDivElement>(null);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  const peerConnection = useRef<RTCPeerConnection | null>(null);
  const offerRef = useRef<RTCSessionDescriptionInit | null>(null);

  // ---------------- CLEANUP ----------------

  const cleanupCall = () => {
    setIsCalling(false);
    setIncomingCall(false);

    if (peerConnection.current) {
      peerConnection.current.close();
      peerConnection.current = null;
    }

    if (localVideoRef.current?.srcObject) {
      const tracks = (localVideoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach((track) => track.stop());
      localVideoRef.current.srcObject = null;
    }

    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }
  };

  // ---------------- SOCKET ----------------

  useEffect(() => {
    if (!bookingId) return;

    connectSocket();

    const joinRoom = () => {
      socket.emit("join-room", bookingId);
    };

    if (socket.connected) joinRoom();
    socket.on("connect", joinRoom);

    socket.on("previous-messages", setMessages);

    socket.on("receive-message", (msg: ChatMessage) => {
      setMessages((prev) => [...prev, msg]);
    });

    // -------- RECEIVE OFFER --------

    socket.on("video-offer", ({ offer }) => {
      console.log("Incoming call from patient");

      offerRef.current = offer;
      setIncomingCall(true);
    });

    // -------- RECEIVE ANSWER --------

    socket.on("video-answer", async ({ answer }) => {
      await peerConnection.current?.setRemoteDescription(answer);
    });

    // -------- ICE --------

    socket.on("ice-candidate", async ({ candidate }) => {
      await peerConnection.current?.addIceCandidate(candidate);
    });

    // -------- CALL ENDED --------

  socket.on("call-ended", async () => {
    addNotification("The other user left the call", "WARNING"); 
    cleanupCall();
  });

    return () => {
      socket.emit("leave-room", bookingId);
      socket.off();
    };
  }, [bookingId]);

  // ---------------- AUTO SCROLL ----------------

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ---------------- CHAT ----------------

  const sendMessage = () => {
    const trimmed = input.trim();
    if (!trimmed || !bookingId) return;

    socket.emit("send-message", { bookingId, message: trimmed });
    setInput("");
  };

  // ---------------- WEBRTC ----------------

  const createPeerConnection = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    if (localVideoRef.current) {
      localVideoRef.current.srcObject = stream;
    }

    peerConnection.current = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    stream.getTracks().forEach((track) => {
      peerConnection.current?.addTrack(track, stream);
    });

    peerConnection.current.ontrack = (event) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];

        remoteVideoRef.current.onloadedmetadata = () => {
          remoteVideoRef.current?.play();
        };
      }
    };

    peerConnection.current.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("ice-candidate", {
          bookingId,
          candidate: event.candidate,
        });
      }
    };
  };

  // ---------------- START CALL ----------------

  const handleStartCall = async () => {
    setIsCalling(true);

    await createPeerConnection();

    const offer = await peerConnection.current?.createOffer();
    await peerConnection.current?.setLocalDescription(offer!);

    socket.emit("video-offer", { bookingId, offer });
  };

  // ---------------- ACCEPT CALL ----------------

  const handleAcceptCall = async () => {
    setIncomingCall(false);
    setIsCalling(true);

    await createPeerConnection();

    if (offerRef.current) {
      await peerConnection.current?.setRemoteDescription(offerRef.current);
    }

    const answer = await peerConnection.current?.createAnswer();
    await peerConnection.current?.setLocalDescription(answer!);

    socket.emit("video-answer", { bookingId, answer });
  };

  // ---------------- END CALL ----------------

const handleEndCall = async () => {
  if (!bookingId) return;
  try {
    const confirmed = await confirmMessage("Are you sure you want to end the call?");
    if (!confirmed) return;
     await completeBooking(bookingId);
    socket.emit("end-call", { bookingId });
    cleanupCall();
  } catch (err) {
    console.error("Error completing booking:", err);
    addNotification("Failed to mark booking as completed", "ERROR");
    socket.emit("end-call", { bookingId });
    cleanupCall();
  }
};

  // ---------------- UI ----------------

  return (
    <div className="flex flex-col h-full">

      <div className="flex justify-between p-4 border-b bg-white">
        <h2 className="font-semibold text-lg">Doctor Chat</h2>

        {!isCalling ? (
          <button
            onClick={handleStartCall}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
           Start Call
          </button>
        ) : (
          <button
            onClick={handleEndCall}
            className="bg-red-600 text-white px-4 py-2 rounded"
          >
             End Call
          </button>
        )}
      </div>

      {/* Incoming call UI */}

      {incomingCall && (
        <div className="bg-yellow-100 p-4 flex justify-between items-center">
          <p className="font-semibold">📞 Incoming Call...</p>

          <button
            onClick={handleAcceptCall}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Accept Call
          </button>
        </div>
      )}

      {isCalling && (
        <div className="flex gap-4 p-4 bg-black">
          <video
            ref={localVideoRef}
            autoPlay
            muted
            playsInline
            className="w-1/2 rounded-lg"
          />

          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-1/2 rounded-lg"
          />
        </div>
      )}

      {/* Messages */}

      <div className="flex-1 overflow-y-auto p-4 bg-white">
        {messages.map((msg) => (
          <div key={msg.id} className="mb-2">
            <b>{msg.senderRole}:</b> {msg.message}
          </div>
        ))}

        <div ref={bottomRef} />
      </div>

      {/* Input */}

      <div className="flex">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 border px-4 py-2"
        />

        <button
          onClick={sendMessage}
          className="bg-teal-600 text-white px-4 py-2"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default DoctorChatPage;