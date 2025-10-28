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

const GoogleLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
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

      // ✅ Send Google data to backend
      const response = await fetch(
        `http://localhost:8000/api/auth/google-login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(bodyData),
          credentials: "include",
        }
      );

      const data = await response.json();
      if (!response.ok) {
        ShowToast("error", data?.message || "Login failed");
        return;
      }

      // ✅ Dispatch user and token to Redux
      dispatch(
        setUser({
          user: data.data.user,
          token: data.data.token || null,
        })
      );

      ShowToast("success", data?.message || "Login successful!");
      navigate(RouteIndex);
    } catch (error) {
      console.error("Google login error:", error);
      ShowToast(
        "error",
        error.message || "Something went wrong with Google login"
      );
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
