// src/utils/api.js (Revised & Corrected)
import axios from "axios";
// Import Redux utilities
import { getStore, getDispatch } from "../store"; // Adjusted path
import { setUser, removeUser } from "../redux/user/user.slice";
import { ShowToast } from "./ShowToast";

const api = axios.create({
  baseURL: "http://localhost:8000/api",
  withCredentials: true, // important for cookies
});

// Attach token to every request
api.interceptors.request.use(
  (config) => {
    // FIX 1: Must CALL getStore() and getState()
    const token = getStore()?.getState()?.user?.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 errors and refresh token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const res = await axios.post(
          "http://localhost:8000/api/auth/refresh",
          {},
          { withCredentials: true }
        );

        const { token, user } = res.data?.data || {};

        // FIX 2: Get dispatch once here
        const dispatch = getDispatch();

        if (!token) {
          // FIX 3: Must CALL dispatch
          dispatch(removeUser());
          ShowToast("error", "Session expired. Please login again.");
          return Promise.reject(error);
        }

        // Update Redux
        // FIX 4: Must CALL dispatch
        dispatch(setUser({ user, token }));

        // FIX 5: Use the 'api' instance for retries for consistency
        // The request interceptor (above) will handle adding the new token.
        return api(originalRequest);
      } catch (err) {
        // FIX 6: Must CALL dispatch
        getDispatch()(removeUser()); // or const dispatch = getDispatch(); dispatch(removeUser());
        ShowToast("error", "Session expired. Please login again.");
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
