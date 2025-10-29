// middleware/globalErrorHandler.js
import { ApiError } from "../utils/ApiError.js";

export const globalErrorHandler = (err, req, res, next) => {
  // Log unexpected errors for server monitoring
  if (!(err instanceof ApiError)) {
    console.error("🔥 Unexpected Error:", err);
  }

  // Safe fallback values
  const statusCode =
    err.statusCode && Number.isInteger(err.statusCode) ? err.statusCode : 500;
  const message = err.message || "Internal Server Error";

  // Send structured JSON error response
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    errors: err.errors || [],
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};
