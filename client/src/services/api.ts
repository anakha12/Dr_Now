import axios, { type AxiosInstance } from "axios";
import toast from "react-hot-toast";

interface CreateAxiosOptions {
  baseURL: string;
  refreshEndpoint: string;
  redirectPath: string;
  skipInterceptorUrls?: string[];
}

let isRefreshing = false;

export function createAxiosInstance(options: CreateAxiosOptions): AxiosInstance {
  const instance = axios.create({
    baseURL: options.baseURL,
    withCredentials: true,
  });

  instance.interceptors.response.use(
    (res) => res,
    async (err) => {
      const originalRequest = err.config;

      const skipUrls = [
        options.refreshEndpoint,
        "/login",
        ...(options.skipInterceptorUrls || []),
      ];

      const shouldSkip = skipUrls.some((url) =>
        originalRequest.url?.includes(url)
      );
      if (shouldSkip) return Promise.reject(err);

      if (
        err.response?.status === 401 &&
        !originalRequest._retry &&
        !isRefreshing
      ) {
        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const refreshResponse = await instance.get(options.refreshEndpoint);
          isRefreshing = false;

          if (refreshResponse.status === 200) {
            return instance(originalRequest); 
          } else {
            throw new Error("Refresh failed");
          }
        } catch (refreshError) {
          isRefreshing = false;
          toast.error("Session expired. Please log in again.");
          window.location.href = options.redirectPath;
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(err);
    }
  );

  return instance;
}
