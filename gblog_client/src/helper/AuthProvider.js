// src/components/AuthProvider.jsx
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser, removeUser } from "@/redux/user/user.slice";
import { ShowToast } from "./ShowToast";

const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const checkAndRefreshUser = async () => {
      try {
        const hasRefreshRes = await fetch(
          "http://localhost:8000/api/auth/has-refresh",
          {
            credentials: "include",
          }
        );
        const { hasRefresh } = await hasRefreshRes.json();

        if (!hasRefresh) return; // 🛑 stop if no cookie

        const res = await fetch(`http://localhost:8000/api/auth/refresh`, {
          method: "POST",
          credentials: "include",
        });
        const data = await res.json();

        if (data?.data?.user && data?.data?.token) {
          dispatch(setUser({ user: data.data.user, token: data.data.token }));
        } else {
          dispatch(removeUser());
        }
      } catch (err) {
        dispatch(removeUser());
        ShowToast("error", "Failed to refresh login session");
      }
    };

    checkAndRefreshUser();
  }, [dispatch]);

  return children;
};

export default AuthProvider;
