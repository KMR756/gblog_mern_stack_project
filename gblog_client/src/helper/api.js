// src/utils/api.js
import axios from "axios";
import { store } from "../store";
import { setUser, removeUser } from "../redux/user/user.slice";
import { ShowToast } from "./ShowToast";

const api = axios.create({
  baseURL: "http://localhost:8000/api",
  withCredentials: true, // important for cookies
});

// Attach token to every request
api.interceptors.request.use(
  (config) => {
    const token = store.getState().user.token;
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

        if (!token) {
          store.dispatch(removeUser());
          ShowToast("error", "Session expired. Please login again.");
          return Promise.reject(error);
        }

        // Update Redux
        store.dispatch(setUser({ user, token }));

        // Retry original request
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return axios(originalRequest);
      } catch (err) {
        store.dispatch(removeUser());
        ShowToast("error", "Session expired. Please login again.");
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
