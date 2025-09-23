
export type NotificationType = keyof typeof import("../constants/messages").NotificationDefaults;

export interface Notification {
  id: string;
  message: string;
  type: NotificationType;
  read: boolean;
  timestamp: Date;
}

export interface NotificationContextType {
  notifications: Notification[];
  addNotification: (message: string, type?: NotificationType) => void;
  markAllAsRead: () => void;
  confirmMessage: (message: string) => Promise<boolean>;
  promptInput: (message: string, placeholder?: string) => Promise<string | null>;
}