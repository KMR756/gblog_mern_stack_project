import axios from "axios";
import { getDispatch } from "../store";
import { removeUser } from "../redux/user/user.slice";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // Cookie পাঠানো ও গ্রহণের জন্য দরকারি
});

// --- Response Interceptor ---
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const dispatch = getDispatch(); // Redux dispatch
    const originalRequest = error.config;

    // যদি Access Token expire হয়
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // Refresh token দিয়ে নতুন access token তৈরি
        await api.post("/auth/refresh");
        // আগের request আবার পাঠাও
        return api(originalRequest);
      } catch (err) {
        // Refresh token fail হলে user logout করাও
        dispatch(removeUser());
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
