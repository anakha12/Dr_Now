import { createContext, useContext, useState, type ReactNode } from "react";
import { Messages } from "../constants/messages";
import type { Notification,NotificationType,NotificationContextType } from "../types/notification";


const NotificationContext = createContext<NotificationContextType | null>(null);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [confirmState, setConfirmState] = useState<{ message: string; resolve: (val: boolean) => void } | null>(null);
  const [inputPromptState, setInputPromptState] = useState<{ message: string; placeholder?: string; resolve: (val: string | null) => void } | null>(null);

  const addNotification = (message: string, type: NotificationType = "INFO") => {
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

  const confirmMessage = (message: string): Promise<boolean> =>
    new Promise((resolve) => setConfirmState({ message, resolve }));

  const promptInput = (message: string, placeholder = ""): Promise<string | null> =>
    new Promise((resolve) => setInputPromptState({ message, placeholder, resolve }));

  const markAllAsRead = () => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

  const handleConfirm = (choice: boolean) => {
    confirmState?.resolve(choice);
    setConfirmState(null);
  };

  const handleInputSubmit = (value: string | null) => {
    inputPromptState?.resolve(value);
    setInputPromptState(null);
  };

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, markAllAsRead, confirmMessage, promptInput }}>
      {children}

      {/* Notification UI */}
      <div className="fixed top-5 right-5 z-50 space-y-2 w-80">
        {notifications.map((n) => (
          <div
            key={n.id}
            className={`px-4 py-3 rounded shadow text-white animate-slide-in-right transition-all duration-300 ${
              n.type === "SUCCESS"
                ? "bg-green-600"
                : n.type === "ERROR"
                ? "bg-red-600"
                : n.type === "WARNING"
                ? "bg-yellow-600 text-black"
                : "bg-blue-600"
            }`}
          >
            {n.message}
          </div>
        ))}
      </div>

      {/* Confirm Modal */}
      {confirmState && (
        <div className="fixed inset-0 bg-white/10 backdrop-blur-sm z-50 flex justify-center items-center">
          <div className="bg-gray-200 rounded-2xl p-6 shadow-lg w-[90%] max-w-md">
            <p className="text-lg mb-4 text-gray-800 font-semibold">{confirmState.message}</p>
            <div className="flex justify-end gap-4">
              <button onClick={() => handleConfirm(false)} className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400">
                {Messages.COMMON.CANCEL}
              </button>
              <button onClick={() => handleConfirm(true)} className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white">
                {Messages.COMMON.CONFIRM_BUTTON}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Input Prompt Modal */}
      {inputPromptState && (
        <div className="fixed inset-0 bg-white/10 backdrop-blur-sm z-50 flex justify-center items-center">
          <div className="bg-white rounded-2xl p-6 shadow-xl w-[90%] max-w-md">
            <p className="text-lg font-semibold text-gray-800 mb-4">{inputPromptState.message}</p>
            <input
              type="text"
              placeholder={inputPromptState.placeholder}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4"
              autoFocus
              onKeyDown={(e) => e.key === "Enter" && handleInputSubmit((e.target as HTMLInputElement).value)}
            />
            <div className="flex justify-end gap-4">
              <button onClick={() => handleInputSubmit(null)} className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400">
                {Messages.COMMON.CANCEL}
              </button>
              <button
                onClick={() => {
                  const input = document.querySelector<HTMLInputElement>("input");
                  handleInputSubmit(input?.value || null);
                }}
                className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white"
              >
                {Messages.COMMON.SUBMIT}
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
  if (!context) throw new Error("useNotifications must be used within a NotificationProvider");
  return context;
};
