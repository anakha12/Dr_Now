import express from "express";
import { chatController } from "../../di/chat.di";
import { verifyToken } from "../middleware/authMiddleware";
import { Role } from "../../utils/Constance";

const router = express.Router();

router.post("/send-message", verifyToken([Role.USER, Role.DOCTOR]), chatController.sendMessage.bind(chatController));

export default router;
