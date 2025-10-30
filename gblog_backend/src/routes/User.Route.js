import express from "express";
import { getUser } from "../controllers/user.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const UserRoute = express.Router();

UserRoute.get("/get-user/:userID", verifyToken, getUser);

export { UserRoute };
