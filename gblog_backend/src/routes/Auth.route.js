import express from "express";
import {
  GoogleLogin,
  HasRefreshToken,
  Login,
  Logout,
  RefreshToken,
  Register,
} from "../controllers/auth.controller.js";
const AuthRoute = express.Router();

AuthRoute.post("/register", Register);
AuthRoute.post("/login", Login);
AuthRoute.post("/google-login", GoogleLogin);
AuthRoute.post("/logout", Logout);
AuthRoute.post("/refresh", RefreshToken);
AuthRoute.get("/has-refresh", HasRefreshToken);

export { AuthRoute };
