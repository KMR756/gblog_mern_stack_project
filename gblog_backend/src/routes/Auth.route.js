import express from "express";
import { Register } from "../controllers/auth.controller.js";
const AuthRoute = express.Router();

AuthRoute.post("/register", Register);

export { AuthRoute };
