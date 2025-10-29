import React from "react";
import { Button } from "./ui/button";
import { FcGoogle } from "react-icons/fc";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "@/helper/firebase.config";
import { RouteIndex } from "@/helper/RoutesName";
import { ShowToast } from "@/helper/ShowToast";
import { useNavigate } from "react-router";
import { setUser } from "@/redux/user/user.slice";
import { useDispatch } from "react-redux";
import api from "@/helper/axios";

const GoogleLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      // 1. Initial Google/Firebase authentication (remains the same)
      const googleResponse = await signInWithPopup(auth, provider);
      const user = googleResponse.user;

      if (!user?.email) {
        ShowToast("error", "Failed to retrieve Google account information.");
        return;
      }

      const bodyData = {
        name: user.displayName || "Unnamed User",
        email: user.email,
        avatar: user.photoURL || "",
      };

      // 2. CONVERSION TO AXIOS
      // Use the 'api' instance. Base URL and withCredentials: true are automatic.
      const response = await api.post(
        `/auth/google-login`, // Use relative path
        bodyData // Axios sends the bodyData as JSON automatically
      );

      // Axios successfully returns a 2xx status code.
      // The response data is now accessed via response.data.
      const data = response.data;

      // ✅ Dispatch user and token to Redux
      // NOTE: If your backend returns the Access Token via an HTTP-only cookie,
      // you should NOT try to read it from data. If it returns it in the body,
      // ensure you dispatch it here.
      dispatch(
        setUser({
          user: data.data.user,
          // Include token if your backend sends it in the response body:
          // token: data.data.token || null,
        })
      );

      ShowToast("success", data?.message || "Login successful!");
      navigate(RouteIndex);
    } catch (error) {
      console.error("Google login error:", error);

      // 3. AXIOS ERROR HANDLING
      // Check if the error has a response object (i.e., it's an HTTP error)
      const message =
        error.response?.data?.message ||
        error.message ||
        "Something went wrong with Google login";

      ShowToast("error", message);
    }
  };

  return (
    <Button
      variant="outline"
      className="flex items-center gap-3 md:w-1/2 mx-auto"
      onClick={handleGoogleLogin}
    >
      <FcGoogle className="text-xl" />
      Continue with Google
    </Button>
  );
};

export default GoogleLogin;
