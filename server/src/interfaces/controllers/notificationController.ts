import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import { GetNotificationsUseCase } from "../../application/use_cases/notifications/getNotifications";
import { MarkAsReadUseCase } from "../../application/use_cases/notifications/markAsRead";
import { MarkAllAsReadUseCase } from "../../application/use_cases/notifications/markAllAsRead";

export class NotificationController {
  constructor(
    private getNotificationsUseCase: GetNotificationsUseCase,
    private markAsReadUseCase: MarkAsReadUseCase,
    private markAllAsReadUseCase: MarkAllAsReadUseCase
  ) {}

  async getNotifications(req: AuthRequest, res: Response): Promise<void> {
    try {
      // User ID should be attached by auth middleware
      const userId = req.user?.id || req.body.userId; 
      if (!userId) {
        res.status(401).json({ success: false, message: "Unauthorized" });
        return;
      }
      const notifications = await this.getNotificationsUseCase.execute(userId);
      res.status(200).json({ success: true, notifications });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async markAsRead(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updated = await this.markAsReadUseCase.execute(id);
      if (!updated) {
        res.status(404).json({ success: false, message: "Notification not found" });
        return;
      }
      res.status(200).json({ success: true, notification: updated });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async markAllAsRead(req: AuthRequest, res: Response): Promise<void> {
    try {
      // User ID should be attached by auth middleware
      const userId = req.user?.id || req.body.userId; 
      if (!userId) {
        res.status(401).json({ success: false, message: "Unauthorized" });
        return;
      }
      await this.markAllAsReadUseCase.execute(userId);
      res.status(200).json({ success: true, message: "All notifications marked as read" });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}
