import "reflect-metadata";
import dotenv from "dotenv";
dotenv.config(); 
import express from "express";
import mongoose from "mongoose";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import userRoutes from "./interfaces/routes/userRoutes";
import adminRoutes from "./interfaces/routes/adminRoutes";
import prescriptionRoutes from "./interfaces/routes/prescriptionRoutes";
import doctorRoutes from "./interfaces/routes/doctorRoutes";  
import webhookRoutes from "./interfaces/routes/stripeWebhook";
import notificationRoutes from "./interfaces/routes/notificationRoutes";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
import { AppMessages } from "./utils/Messages";
import logger from "./utils/Logger";
import { initSocketServer } from "./infrastructure/socket/socketServer";
import { chatSocketService } from "./di/chat.di";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();  
const server = http.createServer(app)

app.use("/api/stripe", webhookRoutes); 


app.use(
  cors({
    origin: process.env.CLIENT_URL, 
    credentials: true, 
  })
);

const io=new SocketIOServer(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    credentials: true
  }
});


initSocketServer(io,chatSocketService);
app.use(cookieParser());
app.use(express.json()); 
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

mongoose.connect(process.env.MONGO_URI as string)
  .then(() => logger.info(AppMessages.MONGODB_CONNECTED))
  .catch(err => logger.error(AppMessages.MONGODB_ERROR(err), { stack: err.stack }));


app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/doctor", doctorRoutes);
app.use("/api/doctor", prescriptionRoutes);
app.use("/api/notifications", notificationRoutes);


const port = Number(process.env.PORT);
server.listen(port, () => {
  logger.info(AppMessages.SERVER_RUNNING(port));
});
