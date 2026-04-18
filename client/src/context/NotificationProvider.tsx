import { useState, useEffect, type ReactNode, useCallback } from "react";
import { useSelector } from "react-redux";
import { NotificationContext } from "./NotificationContext";
import { Messages } from "../constants/messages";
import type { Notification, NotificationType } from "../types/notification";
import { notificationApiService } from "../services/notificationService";
import { userAxios, doctorAxios, adminAxios } from "../services/axiosInstances";
import type { RootState } from "../redux/store";

interface BackendNotification {
  id?: string;
  _id?: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: string;
}

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<Notification[]>([]);
  const [dbNotifications, setDbNotifications] = useState<Notification[]>([]);

  // Selection of axios instance based on current role
  const userRoleState = useSelector((state: RootState) => state.userAuth);
  const doctorRoleState = useSelector((state: RootState) => state.doctorAuth);
  const adminRoleState = useSelector((state: RootState) => state.adminAuth);

  const getAxiosInstance = useCallback(() => {
    if (doctorRoleState.isAuthenticated) return doctorAxios;
    if (adminRoleState.isAuthenticated) return adminAxios;
    if (userRoleState.isAuthenticated) return userAxios;
    return userAxios;
  }, [doctorRoleState.isAuthenticated, adminRoleState.isAuthenticated, userRoleState.isAuthenticated]);

  const [confirmState, setConfirmState] = useState<{
    message: string;
    resolve: (val: boolean) => void;
  } | null>(null);

  const [inputPromptState, setInputPromptState] = useState<{
    message: string;
    placeholder?: string;
    value: string;
    resolve: (val: string | null) => void;
  } | null>(null);

  // Map backend notifications to frontend types
  const mapBackendNotification = useCallback((n: BackendNotification): Notification => ({
    id: n.id || (n._id as string),
    message: n.message,
    type: (n.type?.toUpperCase() as NotificationType) || "INFO",
    read: n.read || false,
    timestamp: new Date(n.createdAt || Date.now()),
  }), []);

  const fetchDbNotifications = useCallback(async () => {
    const isAnyAuth = userRoleState.isAuthenticated || doctorRoleState.isAuthenticated || adminRoleState.isAuthenticated;
    if (!isAnyAuth) return;

    try {
      const axios = getAxiosInstance();
      const response = await notificationApiService.getNotifications(axios);
      if (response && response.success && response.notifications) {
        const mapped = response.notifications.map(mapBackendNotification);
        setDbNotifications(mapped);
      }
    } catch (error) {
      console.error("Failed to fetch notifications from DB", error);
    }
  }, [getAxiosInstance, mapBackendNotification, userRoleState.isAuthenticated, doctorRoleState.isAuthenticated, adminRoleState.isAuthenticated]);

  // Initial fetch and polling
  useEffect(() => {
    fetchDbNotifications();
    const interval = setInterval(fetchDbNotifications, 30000); // Poll every 30s
    return () => clearInterval(interval);
  }, [fetchDbNotifications]);

  const addNotification = (message: string, type: NotificationType = "INFO") => {
    const newToast: Notification = {
      id: `toast-${Date.now()}`,
      message,
      type,
      read: false,
      timestamp: new Date(),
    };

    setToasts((prev) => [newToast, ...prev]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
    }, 3000);
  };

  const markAsRead = async (id: string) => {
    try {
      const axios = getAxiosInstance();
      await notificationApiService.markAsRead(id, axios);
      setDbNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    } catch (error) {
      console.error("Failed to mark notification as read", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const axios = getAxiosInstance();
      await notificationApiService.markAllAsRead(axios);
      setDbNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (error) {
      console.error("Failed to mark all as read", error);
    }
  };

  const confirmMessage = (message: string): Promise<boolean> =>
    new Promise((resolve) => setConfirmState({ message, resolve }));

  const promptInput = (
    message: string,
    placeholder = ""
  ): Promise<string | null> =>
    new Promise((resolve) =>
      setInputPromptState({ message, placeholder, value: "", resolve })
    );

  const handleConfirm = (choice: boolean) => {
    confirmState?.resolve(choice);
    setConfirmState(null);
  };

  const handleInputSubmit = (value: string | null) => {
    inputPromptState?.resolve(value);
    setInputPromptState(null);
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications: dbNotifications, // Expose persistent ones for bell/list
        addNotification,
        markAsRead,
        markAllAsRead,
        confirmMessage,
        promptInput,
        fetchNotifications: fetchDbNotifications,
      }}
    >
      {children}

      {/* Toast Overlay (Unchanged functionally, but uses 'toasts' state) */}
      <div className="fixed top-20 right-5 z-[9999] space-y-2 w-80">
        {toasts.map((n) => (
          <div
            key={n.id}
            className={`px-4 py-3 rounded shadow-lg text-white border-l-4 transform animate-slide-in-right transition-all duration-300 ${
              n.type === "SUCCESS"
                ? "bg-green-600 border-green-800"
                : n.type === "ERROR"
                ? "bg-red-600 border-red-800"
                : n.type === "WARNING"
                ? "bg-yellow-600 border-yellow-800 text-black"
                : "bg-blue-600 border-blue-800"
            }`}
          >
            {n.message}
          </div>
        ))}
      </div>

      {/* Confirm Modal */}
      {confirmState && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[10000] flex justify-center items-center">
          <div className="bg-white rounded-2xl p-6 shadow-2xl w-[90%] max-w-md border border-gray-100">
            <p className="text-lg mb-6 text-gray-800 font-semibold leading-snug">
              {confirmState.message}
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => handleConfirm(false)}
                className="px-5 py-2 rounded-xl text-gray-600 font-medium hover:bg-gray-100 transition-colors"
              >
                {Messages.COMMON.CANCEL}
              </button>

              <button
                onClick={() => handleConfirm(true)}
                className="px-6 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold shadow-md hover:shadow-lg transition-all"
              >
                {Messages.COMMON.CONFIRM_BUTTON}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Input Prompt Modal */}
      {inputPromptState && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[10000] flex justify-center items-center">
          <div className="bg-white rounded-2xl p-6 shadow-2xl w-[90%] max-w-md border border-gray-100">
            <p className="text-lg font-semibold text-gray-800 mb-4 leading-snug">
              {inputPromptState.message}
            </p>

            <input
              type="text"
              placeholder={inputPromptState.placeholder}
              value={inputPromptState.value}
              onChange={(e) =>
                setInputPromptState((prev) =>
                  prev ? { ...prev, value: e.target.value } : null
                )
              }
              className="w-full px-4 py-3 border border-gray-200 rounded-xl mb-6 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleInputSubmit(inputPromptState.value);
                }
              }}
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => handleInputSubmit(null)}
                className="px-5 py-2 rounded-xl text-gray-600 font-medium hover:bg-gray-100 transition-colors"
              >
                {Messages.COMMON.CANCEL}
              </button>

              <button
                onClick={() => handleInputSubmit(inputPromptState.value)}
                className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md hover:shadow-lg transition-all"
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