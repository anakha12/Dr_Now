import { NotificationRepository } from "../../../domain/repositories/notificationRepository";

export class MarkAllAsReadUseCase {
  constructor(private notificationRepository: NotificationRepository) {}

  async execute(recipientId: string): Promise<void> {
    await this.notificationRepository.markAllAsRead(recipientId);
  }
}
