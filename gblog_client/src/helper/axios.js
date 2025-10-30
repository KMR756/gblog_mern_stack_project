import axios from "axios";
import { getDispatch } from "../store";
import { removeUser } from "../redux/user/user.slice";

const API_BASE_URL = import.meta.env.VITE_API_URL;

// 🔹 Main axios instance (used everywhere)
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // allow sending/receiving cookies
});

// 🔹 Separate instance for refresh (bypass interceptors)
const refreshInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// 🔹 Refresh lock system
let isRefreshing = false;
let refreshPromise = null;

// --- Response Interceptor ---
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const dispatch = getDispatch();
    const originalRequest = error.config;

    // ✅ If refresh call itself fails → logout immediately
    if (originalRequest.url.includes("/auth/refresh")) {
      dispatch(removeUser());
      return Promise.reject(error);
    }

    // ✅ Handle expired Access Token (401)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // 🧠 Ensure only one refresh request at a time
        if (!isRefreshing) {
          isRefreshing = true;
          refreshPromise = refreshInstance.post("/auth/refresh").finally(() => {
            isRefreshing = false;
          });
        }

        // Wait for the ongoing or new refresh request to complete
        await refreshPromise;

        // 🔁 Retry the original failed request
        return api(originalRequest);
      } catch (refreshError) {
        console.warn("Refresh token expired or invalid — logging out.");
        dispatch(removeUser());
        return Promise.reject(refreshError);
      }
    }

    // ❌ If not 401 or already retried, just reject
    return Promise.reject(error);
  }
);

export default api;
