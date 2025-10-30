import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { AuthRoute } from "./routes/Auth.route.js";
import { globalErrorHandler } from "./middleware/globalErrorHandler.js";
import { UserRoute } from "./routes/User.Route.js";

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));

app.use("/api/auth", AuthRoute);
app.use("/api", UserRoute);

app.use(globalErrorHandler);

export { app };

// registration POST : http://localhost:8000/api/auth/register
// login POST: http://localhost:8000/api/auth/login
// google-login POST: http://localhost:8000/api/auth/google-login
// logout POST: http://localhost:8000/api/auth/logout
// refresh POST: http://localhost:8000/api/auth/refresh
// has-refresh POST: http://localhost:8000/api/auth/has-refresh
// has-refresh get: http://localhost:8000/api/get-user
