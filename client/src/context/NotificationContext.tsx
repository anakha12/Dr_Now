import { createContext, useContext, useState, type ReactNode } from "react";

type NotificationType = "success" | "error" | "info" | "warning";

export interface Notification {
  id: string;
  message: string;
  type: NotificationType;
  read: boolean;
  timestamp: Date;
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (message: string, type?: NotificationType) => void;
  markAllAsRead: () => void;
  confirmMessage: (message: string) => Promise<boolean>; 
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [confirmState, setConfirmState] = useState<{
    message: string;
    resolve: (val: boolean) => void;
  } | null>(null);

  const addNotification = (message: string, type: NotificationType = "info") => {
    const newNotification: Notification = {
      id: Date.now().toString(),
      message,
      type,
      read: false,
      timestamp: new Date(),
    };
    setNotifications((prev) => [newNotification, ...prev]);

    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== newNotification.id));
    }, 3000);
  };

  const confirmMessage = (message: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setConfirmState({ message, resolve });
    });
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleConfirm = (choice: boolean) => {
    if (confirmState) {
      confirmState.resolve(choice);
      setConfirmState(null);
    }
  };

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, markAllAsRead, confirmMessage }}>
      {children}

     
      <div className="fixed top-5 right-5 z-50 space-y-2 w-80">
        {notifications.map((n) => (
          <div
            key={n.id}
            className={`px-4 py-3 rounded shadow text-white animate-slide-in-right transition-all duration-300
              ${n.type === "success" ? "bg-green-600" : ""}
              ${n.type === "error" ? "bg-red-600" : ""}
              ${n.type === "warning" ? "bg-yellow-600 text-black" : ""}
              ${n.type === "info" ? "bg-blue-600" : ""}
            `}
          >
            {n.message}
          </div>
        ))}
      </div>

      {confirmState && (
        <div className="fixed inset-0 bg-white/10 backdrop-blur-sm z-50 flex justify-center items-center">
          <div className="bg-gray-200 rounded-2xl p-6 shadow-lg w-[90%] max-w-md">
            <p className="text-lg mb-4 text-gray-800 font-semibold">{confirmState.message}</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => handleConfirm(false)}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={() => handleConfirm(true)}
                className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
};
