// src/api/axios.js (Revised & Corrected)
import axios from "axios";
// Import Redux utilities
import { getStore, getDispatch } from "../store"; // Adjusted path for typical structure
import { removeUser, setUser } from "../redux/user/user.slice";
import { ShowToast } from "./ShowToast";
// Assuming ShowToast is accessible globally or can be imported here

// Create the Axios Instance
const api = axios.create({
  baseURL: "http://localhost:8000/api",
  withCredentials: true, // Crucial for sending the Refresh Token cookie
});

// --- 1. REQUEST INTERCEPTOR (Attaches the Access Token from Redux) ---
api.interceptors.request.use(
  (config) => {
    // FIX: Must CALL getStore()
    const store = getStore();
    // Get the access token from the current Redux state
    const token = store?.getState()?.user?.token; // FIX: Must CALL getState()

    // If a token exists, add it to the Authorization header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// --- 2. RESPONSE INTERCEPTOR (Handles 401 and Token Refresh) ---
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    // FIX: Must CALL getDispatch()
    const dispatch = getDispatch(); // Get dispatch function

    // Check if error is 401 and we haven't tried to refresh yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // ... rest of the try block remains correct ...
        const refreshRes = await axios.post(
          "http://localhost:8000/api/auth/refresh",
          {},
          { withCredentials: true }
        );

        const { user, token } = refreshRes.data.data || {};

        if (user && token) {
          // --- STEP B: UPDATE REDUX WITH NEW USER AND TOKEN ---
          dispatch(setUser({ user, token }));

          // --- STEP C: RETRY THE ORIGINAL FAILED REQUEST ---
          return api(originalRequest);
        } else {
          throw new Error("Refresh failed, data missing.");
        }
      } catch (err) {
        // --- STEP D: LOGOUT ON REFRESH FAILURE ---
        dispatch(removeUser());
        ShowToast("error", "Session expired. Please login again.");
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
