import type { AxiosInstance } from "axios";
import { userAxios } from "./axiosInstances";
import { NotificationRoutes } from "../constants/apiRoutes";

// Helper to escape the role-based subpaths (e.g. /api/users -> /api/notifications)
const getPath = (route: string) => `..${route}`;

export const getNotifications = async (axios: AxiosInstance = userAxios) => {
  const response = await axios.get(getPath(NotificationRoutes.GET_NOTIFICATIONS));
  return response.data;
};

export const markAsRead = async (id: string, axios: AxiosInstance = userAxios) => {
  const response = await axios.put(getPath(NotificationRoutes.MARK_AS_READ(id)));
  return response.data;
};

export const markAllAsRead = async (axios: AxiosInstance = userAxios) => {
  const response = await axios.put(getPath(NotificationRoutes.MARK_ALL_AS_READ));
  return response.data;
};

export const notificationApiService = {
  getNotifications,
  markAsRead,
  markAllAsRead,
};

