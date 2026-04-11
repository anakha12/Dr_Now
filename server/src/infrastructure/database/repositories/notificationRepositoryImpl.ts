import { NotificationRepository } from "../../../domain/repositories/notificationRepository";
import { NotificationEntity } from "../../../domain/entities/notificationEntity";
import NotificationModel from "../models/notificationModel";
import mongoose from "mongoose";

export class NotificationRepositoryImpl implements NotificationRepository {
  async createNotification(notification: NotificationEntity): Promise<NotificationEntity> {
    const created = await NotificationModel.create(notification);
    return this.mapToEntity(created);
  }

  async getNotificationsByRecipientId(recipientId: string): Promise<NotificationEntity[]> {
    const notifications = await NotificationModel.find({ recipientId: new mongoose.Types.ObjectId(recipientId) })
      .sort({ createdAt: -1 })
      .exec();
    return notifications.map(this.mapToEntity);
  }

  async markAsRead(notificationId: string): Promise<NotificationEntity | null> {
    const notification = await NotificationModel.findByIdAndUpdate(
      notificationId,
      { read: true },
      { new: true }
    ).exec();
    if (!notification) return null;
    return this.mapToEntity(notification);
  }

  async markAllAsRead(recipientId: string): Promise<void> {
    await NotificationModel.updateMany(
      { recipientId: new mongoose.Types.ObjectId(recipientId), read: false },
      { read: true }
    ).exec();
  }

  async deleteNotification(notificationId: string): Promise<void> {
    await NotificationModel.findByIdAndDelete(notificationId).exec();
  }

  private mapToEntity(doc: any): NotificationEntity {
    return {
      id: doc._id.toString(),
      recipientId: doc.recipientId.toString(),
      message: doc.message,
      type: doc.type,
      read: doc.read,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }
}
