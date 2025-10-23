import express from "express";
import { Login, Register } from "../controllers/auth.controller.js";
const AuthRoute = express.Router();

AuthRoute.post("/register", Register);
AuthRoute.post("/login", Login);

export { AuthRoute };
