// src/components/AuthProvider.jsx
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser, removeUser } from "@/redux/user/user.slice";
import { ShowToast } from "./ShowToast";

const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const refreshUser = async () => {
      try {
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

    refreshUser();
  }, [dispatch]);

  return children;
};

export default AuthProvider;
