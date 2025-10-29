// middlewares/auth.middleware.js

import jwt from "jsonwebtoken";

import { AsyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
// Assuming you import AsyncHandler correctly here

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;

export const verifyToken = AsyncHandler(async (req, res, next) => {
  // 1. Get token from the access_token cookie
  const token = req.cookies.access_token;

  if (!token) {
    // If the access_token cookie is missing, we trigger the 401
    throw new ApiError(401, "Access Token cookie missing or invalid.");
  }

  // 2. Put verification logic INSIDE the AsyncHandler function
  try {
    // Verify token
    const decoded = jwt.verify(token, ACCESS_SECRET);
    req.user = decoded; // attach user payload to request

    // Call next() ONLY if the token is valid
    next();
  } catch (error) {
    // If jwt.verify fails (e.g., token expired or signature invalid),
    // we throw a 401 to trigger the refresh flow.
    throw new ApiError(401, "Access Token expired or invalid.");
    // Note: AsyncHandler will automatically catch this thrown error
    // and send the appropriate response.
  }
});
