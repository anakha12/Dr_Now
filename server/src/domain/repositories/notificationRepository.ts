import { NotificationEntity } from "../entities/notificationEntity";

export interface NotificationRepository {
  createNotification(notification: NotificationEntity): Promise<NotificationEntity>;
  getNotificationsByRecipientId(recipientId: string): Promise<NotificationEntity[]>;
  markAsRead(notificationId: string): Promise<NotificationEntity | null>;
  markAllAsRead(recipientId: string): Promise<void>;
  deleteNotification(notificationId: string): Promise<void>;
}
