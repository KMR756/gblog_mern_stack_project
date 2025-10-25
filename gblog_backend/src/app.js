import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { AuthRoute } from "./routes/Auth.route.js";
import { UserRoute } from "./routes/User.Route.js";
const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

// routers
app.use("/api/auth", AuthRoute);
app.use("/api", UserRoute);

app.use((err, req, res, next) => {
  console.error(`[ERROR] ${err.statusCode || 500} - ${err.message}`);

  res.status(err.statusCode || 500).json({
    success: false,
    statusCode: err.statusCode || 500,
    message: err.message || "internal server error.",
  });
});

export { app };
