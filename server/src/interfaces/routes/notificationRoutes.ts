import { Router } from "express";
import { NotificationController } from "../controllers/notificationController";
import { GetNotificationsUseCase } from "../../application/use_cases/notifications/getNotifications";
import { MarkAsReadUseCase } from "../../application/use_cases/notifications/markAsRead";
import { MarkAllAsReadUseCase } from "../../application/use_cases/notifications/markAllAsRead";
import { NotificationRepositoryImpl } from "../../infrastructure/database/repositories/notificationRepositoryImpl";
import { verifyToken, AuthRequest } from "../middleware/authMiddleware";
import { Role } from "../../utils/Constance";

const router = Router();

// DI Setup
const notificationRepository = new NotificationRepositoryImpl();
const getNotificationsUseCase = new GetNotificationsUseCase(notificationRepository);
const markAsReadUseCase = new MarkAsReadUseCase(notificationRepository);
const markAllAsReadUseCase = new MarkAllAsReadUseCase(notificationRepository);

const notificationController = new NotificationController(
  getNotificationsUseCase,
  markAsReadUseCase,
  markAllAsReadUseCase
);

router.get(
  "/",
  verifyToken([Role.USER, Role.DOCTOR, Role.ADMIN]),
  (req, res) => notificationController.getNotifications(req as AuthRequest, res)
);
router.put(
  "/:id/read",
  verifyToken([Role.USER, Role.DOCTOR, Role.ADMIN]),
  (req, res) => notificationController.markAsRead(req as AuthRequest, res)
);
router.put(
  "/read-all",
  verifyToken([Role.USER, Role.DOCTOR, Role.ADMIN]),
  (req, res) => notificationController.markAllAsRead(req as AuthRequest, res)
);

export default router;
