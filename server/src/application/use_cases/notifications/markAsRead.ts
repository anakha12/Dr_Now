import { NotificationRepository } from "../../../domain/repositories/notificationRepository";
import { NotificationEntity } from "../../../domain/entities/notificationEntity";

export class MarkAsReadUseCase {
  constructor(private notificationRepository: NotificationRepository) {}

  async execute(notificationId: string): Promise<NotificationEntity | null> {
    return await this.notificationRepository.markAsRead(notificationId);
  }
}
