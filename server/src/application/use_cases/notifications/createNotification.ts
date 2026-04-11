import { NotificationRepository } from "../../../domain/repositories/notificationRepository";
import { NotificationEntity } from "../../../domain/entities/notificationEntity";

export class CreateNotificationUseCase {
  constructor(private notificationRepository: NotificationRepository) {}

  async execute(notificationData: NotificationEntity): Promise<NotificationEntity> {
    return await this.notificationRepository.createNotification(notificationData);
  }
}
