// src/components/AuthProvider.jsx
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser, removeUser } from "../redux/user/user.slice";
import { ShowToast } from "./ShowToast";

const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const checkAndRefreshUser = async () => {
      try {
        const hasRefreshRes = await fetch(
          "http://localhost:8000/api/auth/has-refresh",
          { credentials: "include" }
        );
        const { hasRefresh } = await hasRefreshRes.json();

        if (!hasRefresh) {
          dispatch(removeUser());
          return;
        }

        const res = await fetch(`http://localhost:8000/api/auth/refresh`, {
          method: "POST",
          credentials: "include",
        });
        const data = await res.json();

        if (data?.data?.user && data?.data?.token) {
          dispatch(setUser({ user: data.data.user }));
        } else {
          dispatch(removeUser());
        }
      } catch (err) {
        dispatch(removeUser());
        ShowToast("error", "Failed to refresh login session");
      }
    };

    checkAndRefreshUser();

    // 🕒 Poll every 10 seconds
    const interval = setInterval(checkAndRefreshUser, 10000);
    return () => clearInterval(interval);
  }, [dispatch]);

  return children;
};

export default AuthProvider;
