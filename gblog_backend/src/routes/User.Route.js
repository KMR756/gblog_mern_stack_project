import express from "express";

import {
  getUserProfile,
  updateUserProfile,
} from "../controllers/user.controler.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const UserRoute = express.Router();

UserRoute.get("/user/me", verifyToken, getUserProfile);
UserRoute.put("/user/me", verifyToken, updateUserProfile);

export { UserRoute };

// api/user/me
