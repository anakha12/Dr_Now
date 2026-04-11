export interface NotificationEntity {
  id?: string;
  recipientId: string; // The user id (Doctor/Patient/Admin)
  message: string;
  type: string; // e.g. 'success', 'error', 'info', 'warning'
  read: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
