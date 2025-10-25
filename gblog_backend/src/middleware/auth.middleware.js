// middlewares/auth.middleware.js
import jwt from "jsonwebtoken";
import { handleError } from "../utils/HandleError.js";

export const verifyToken = (req, res, next) => {
  try {
    // Get token from cookie
    const token = req.cookies?.access_token;
    if (!token) {
      return next(handleError(401, "Access denied. No token provided."));
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // attach user payload to request
    next();
  } catch (error) {
    return next(handleError(401, "Invalid or expired token."));
  }
};
