import { NotificationRepository } from "../../../domain/repositories/notificationRepository";
import { NotificationEntity } from "../../../domain/entities/notificationEntity";

export class GetNotificationsUseCase {
  constructor(private notificationRepository: NotificationRepository) {}

  async execute(recipientId: string): Promise<NotificationEntity[]> {
    return await this.notificationRepository.getNotificationsByRecipientId(recipientId);
  }
}
