export const globalErrorHandler = (err, req, res, next) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      statusCode: err.statusCode,
      message: err.message,
      errors: err.errors || [],
      stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
  }

  console.error("Unexpected Error:", err);
  return res.status(500).json({
    success: false,
    statusCode: 500,
    message: "Internal Server Error",
  });
};
