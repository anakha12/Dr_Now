import { useEffect, useState, useRef, useCallback } from "react";
import { useParams } from "react-router-dom";
import { socket, connectSocket } from "../../services/socket";
import type { ChatMessage } from "../../types/chatMessage";
import { useNotifications } from "../../hooks/useNotifications";
import { completeBooking, getDoctorBookingDetails } from "../../services/doctorService";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send, Phone, PhoneOff, PhoneIncoming, User as UserIcon, MessageSquare, Clock
} from "lucide-react";

const EARLY_ACCESS_MINUTES = 5;

const DoctorChatPage = () => {
  const { bookingId } = useParams<{ bookingId: string }>();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");

  const [isCalling, setIsCalling] = useState(false);
  const [incomingCall, setIncomingCall] = useState(false);
  const { addNotification, confirmMessage } = useNotifications();

  const [bookingSlot, setBookingSlot] = useState<{ date: string; from: string; to: string } | null>(null);
  const [callAllowed, setCallAllowed] = useState(false);
  const [callStatusMsg, setCallStatusMsg] = useState("");
  const [otherPartyName, setOtherPartyName] = useState("");

  const bottomRef = useRef<HTMLDivElement>(null);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  const peerConnection = useRef<RTCPeerConnection | null>(null);
  const offerRef = useRef<RTCSessionDescriptionInit | null>(null);

  // ---------------- BOOKING TIME CHECK ----------------

  const checkBookingTime = useCallback(() => {
    if (!bookingSlot) {
      setCallAllowed(false);
      setCallStatusMsg("Loading booking info...");
      return;
    }

    const now = new Date();
    const { date, from, to } = bookingSlot;

    // Parse booking start & end times
    const [startH, startM] = from.split(":").map(Number);
    const [endH, endM] = to.split(":").map(Number);

    const bookingDate = new Date(date);
    const start = new Date(bookingDate);
    start.setHours(startH, startM, 0, 0);

    const end = new Date(bookingDate);
    end.setHours(endH, endM, 0, 0);

    // Allow early access
    const earlyStart = new Date(start.getTime() - EARLY_ACCESS_MINUTES * 60 * 1000);

    if (now < earlyStart) {
      const diff = earlyStart.getTime() - now.getTime();
      const mins = Math.floor(diff / 60000);
      const hrs = Math.floor(mins / 60);
      const remainMins = mins % 60;
      setCallAllowed(false);
      setCallStatusMsg(
        hrs > 0
          ? `Call available in ${hrs}h ${remainMins}m`
          : `Call available in ${remainMins}m`
      );
    } else if (now > end) {
      setCallAllowed(false);
      setCallStatusMsg("Booking time has ended");
    } else {
      setCallAllowed(true);
      setCallStatusMsg("");
    }
  }, [bookingSlot]);

  // Fetch booking details
  useEffect(() => {
    if (!bookingId) return;
    const fetchBooking = async () => {
      try {
        const data = await getDoctorBookingDetails(bookingId);
        const booking = data as any;
        setBookingSlot({
          date: booking.date,
          from: booking.slot?.from || booking.startTime || "",
          to: booking.slot?.to || booking.endTime || "",
        });
        setOtherPartyName(booking.patientName || "Patient");
      } catch (err) {
        console.error("Failed to fetch booking details:", err);
        // If we can't fetch, allow the call as a fallback
        setCallAllowed(true);
      }
    };
    fetchBooking();
  }, [bookingId]);

  // Re-check time every 30 seconds
  useEffect(() => {
    checkBookingTime();
    const interval = setInterval(checkBookingTime, 30000);
    return () => clearInterval(interval);
  }, [checkBookingTime]);

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
  }, [bookingId, addNotification]);

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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      sendMessage();
    }
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
    <motion.div
      initial={{ opacity: 0, scale: 0.98, filter: "blur(4px)" }}
      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="h-[calc(100vh-8rem)] min-h-[600px] bg-white/60 backdrop-blur-xl border border-slate-200 shadow-xl shadow-slate-200/50 rounded-[2rem] overflow-hidden flex flex-col relative"
    >
      {/* Background decoration inside card */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-teal-100/50 to-emerald-50/50 rounded-bl-full -z-10 pointer-events-none"></div>

      {/* HEADER */}
      <div className="flex items-center justify-between px-8 py-5 border-b border-slate-100 bg-white/50 backdrop-blur-md z-10 shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white shadow-lg shadow-teal-500/20">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-extrabold text-xl text-slate-800 tracking-tight">Chat with {otherPartyName ? otherPartyName : "Patient"}</h2>
            <p className="text-sm font-medium text-emerald-600 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Connected
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {!callAllowed && !isCalling && callStatusMsg && (
            <div className="flex items-center gap-2 text-sm font-medium text-amber-600 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-xl">
              <Clock className="w-4 h-4" />
              {callStatusMsg}
            </div>
          )}
          {!isCalling ? (
            <motion.button
              whileHover={callAllowed ? { scale: 1.05 } : {}}
              whileTap={callAllowed ? { scale: 0.95 } : {}}
              onClick={handleStartCall}
              disabled={!callAllowed}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold shadow-lg transition-all border ${
                callAllowed
                  ? "bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-teal-500/30 hover:shadow-teal-500/50 border-teal-500"
                  : "bg-slate-200 text-slate-400 border-slate-300 cursor-not-allowed shadow-none"
              }`}
            >
              <Phone className="w-4 h-4" /> Start Video
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleEndCall}
              className="flex items-center gap-2 bg-gradient-to-r from-rose-500 to-red-600 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-rose-500/30 hover:shadow-rose-500/50 transition-all border border-rose-500"
            >
              <PhoneOff className="w-4 h-4" /> End Call
            </motion.button>
          )}
        </div>
      </div>

      {/* INCOMING CALL OVERLAY */}
      <AnimatePresence>
        {incomingCall && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-24 left-1/2 -translate-x-1/2 bg-white border border-emerald-200 p-4 pr-6 pl-5 rounded-2xl shadow-2xl flex items-center gap-6 z-50"
          >
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center animate-pulse">
                  <PhoneIncoming className="w-6 h-6 text-emerald-600" />
                </div>
                {/* Ripple effect */}
                <div className="absolute inset-0 rounded-full border-2 border-emerald-400 animate-ping"></div>
              </div>
              <p className="font-bold text-slate-800">Incoming Video Call...</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAcceptCall}
              className="bg-emerald-500 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/30 whitespace-nowrap"
            >
              Accept
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* VIDEO SECTION */}
      <AnimatePresence>
        {isCalling && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="flex flex-col sm:flex-row gap-4 p-6 bg-slate-900 shrink-0 border-b border-slate-800"
          >
            <div className="relative flex-1 bg-slate-800 rounded-2xl overflow-hidden aspect-video border border-slate-700 shadow-2xl">
              <div className="absolute inset-0 flex flex-col items-center justify-center z-0 text-slate-600 gap-3">
                <UserIcon className="w-12 h-12" />
                <p className="font-medium text-sm">Waiting for video...</p>
              </div>
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover relative z-10 bg-slate-900"
              />
              <div className="absolute bottom-4 left-4 z-20 bg-black/60 backdrop-blur block px-3 py-1.5 rounded-lg text-white text-xs font-bold uppercase tracking-wider border border-white/10">
                Patient
              </div>
            </div>

            <div className="relative w-full sm:w-1/3 min-w-[200px] bg-slate-800 rounded-2xl overflow-hidden aspect-video border border-slate-700 shadow-2xl">
              <video
                ref={localVideoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover relative z-10 bg-slate-900 -scale-x-100" // Mirror local video
              />
              <div className="absolute bottom-4 left-4 z-20 bg-black/60 backdrop-blur block px-3 py-1.5 rounded-lg text-white text-xs font-bold uppercase tracking-wider border border-white/10">
                You
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CHAT MESSAGES */}
      <div className="flex-1 overflow-y-auto p-6 md:p-8 flex flex-col gap-4 scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 gap-4 opacity-50">
            <MessageSquare className="w-16 h-16" />
            <p className="font-medium text-lg">No messages yet. Say hi!</p>
          </div>
        ) : (
          messages.map((msg, idx) => {
            const isMe = msg.senderRole === "doctor";

            return (
              <motion.div
                key={msg.id || idx}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`flex flex-col max-w-[80%] ${isMe ? 'self-end items-end' : 'self-start items-start'}`}
              >
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 px-1">
                  {msg.senderRole}
                </span>
                <div
                  className={`px-5 py-3 rounded-2xl shadow-sm text-[15px] leading-relaxed relative
                    ${isMe
                      ? 'bg-gradient-to-br from-teal-500 to-emerald-600 text-white rounded-tr-sm shadow-teal-500/20'
                      : 'bg-white border border-slate-200 text-slate-700 rounded-tl-sm shadow-slate-200/50'
                    }
                  `}
                >
                  {msg.message}
                </div>
              </motion.div>
            );
          })
        )}
        {/* Invisible div for auto-scrolling */}
        <div ref={bottomRef} className="h-4 shrink-0" />
      </div>

      {/* MESSAGE INPUT */}
      <div className="p-4 md:p-6 bg-white/80 backdrop-blur-xl border-t border-slate-100 shrink-0">
        <div className="relative flex items-center">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message here..."
            className="w-full pl-6 pr-14 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-700 font-medium focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all shadow-inner placeholder:text-slate-400"
          />
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={sendMessage}
            disabled={!input.trim()}
            className="absolute right-2 p-2 bg-teal-500 text-white rounded-xl disabled:opacity-50 disabled:bg-slate-300 disabled:cursor-not-allowed hover:bg-teal-600 transition-colors"
          >
            <Send className="w-5 h-5 ml-0.5" />
          </motion.button>
        </div>
      </div>

    </motion.div>
  );
};

export default DoctorChatPage;