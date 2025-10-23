import express from "express";
import { Login, Logout, Register } from "../controllers/auth.controller.js";
const AuthRoute = express.Router();

AuthRoute.post("/register", Register);
AuthRoute.post("/login", Login);

export { AuthRoute };
