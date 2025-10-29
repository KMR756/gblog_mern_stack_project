import User from "../models/user.models.js";
import jwt from "jsonwebtoken";
import { generateTokens } from "../utils/token.js";
import { AsyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import {
  COOKIE_OPTIONS,
  setAuthCookies,
  sanitizeUser,
} from "../utils/auth.utils.js";

// REGISTER
export const Register = AsyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    throw new ApiError(400, "All fields are required.");

  if (await User.findOne({ email }))
    throw new ApiError(409, "User already registered.");

  const user = await User.create({ name, email, password }); // password auto-hashed

  const { accessToken, refreshToken } = generateTokens(user);
  user.refreshToken = refreshToken;
  await user.save();

  setAuthCookies(res, accessToken, refreshToken);

  res
    .status(201)
    .json(
      new ApiResponse(
        201,
        { user: sanitizeUser(user) },
        "Registration successful."
      )
    );
});

// LOGIN
export const Login = AsyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password)))
    throw new ApiError(404, "Invalid login credentials.");

  const { accessToken, refreshToken } = generateTokens(user);
  user.refreshToken = refreshToken;
  await user.save();

  setAuthCookies(res, accessToken, refreshToken);

  res
    .status(200)
    .json(
      new ApiResponse(200, { user: sanitizeUser(user) }, "Login successful.")
    );
});

// GOOGLE LOGIN
export const GoogleLogin = AsyncHandler(async (req, res) => {
  const { name, email, avatar } = req.body;
  if (!email || !name) throw new ApiError(400, "Google login data missing.");

  let user = await User.findOne({ email });
  if (!user) {
    const randomPassword = Math.random().toString(36).slice(-8);
    user = await User.create({
      name,
      email,
      password: randomPassword,
      avatar,
    });
  }

  const { accessToken, refreshToken } = generateTokens(user);
  user.refreshToken = refreshToken;

  await user.save();

  setAuthCookies(res, accessToken, refreshToken);

  res
    .status(200)
    .json(
      new ApiResponse(200, { user: sanitizeUser(user) }, "Login successful.")
    );
});

// CHECK REFRESH TOKEN
export const HasRefreshToken = (req, res) => {
  const refreshToken = req.cookies.refresh_token;
  if (refreshToken) {
    return res.json({ hasRefresh: true });
  } else {
    return res.json({ hasRefresh: false });
  }
};

const clearAuthCookies = (res) => {
  res.clearCookie("access_token", COOKIE_OPTIONS);
  res.clearCookie("refresh_token", COOKIE_OPTIONS);
};

// REFRESH TOKEN
export const RefreshToken = AsyncHandler(async (req, res) => {
  const { refresh_token } = req.cookies;
  if (!refresh_token) {
    clearAuthCookies(res); // clear cookies if missing
    throw new ApiError(401, "No refresh token provided.");
  }

  const user = await User.findOne({ refreshToken: refresh_token });
  if (!user) {
    clearAuthCookies(res); // clear cookies if invalid
    throw new ApiError(403, "Invalid refresh token.");
  }

  try {
    jwt.verify(refresh_token, process.env.JWT_REFRESH_SECRET);
  } catch (err) {
    clearAuthCookies(res); // clear cookies if token expired
    throw new ApiError(403, "Invalid or expired refresh token.");
  }

  // Generate new tokens
  const { accessToken, refreshToken: newRefreshToken } = generateTokens(user);
  user.refreshToken = newRefreshToken;
  await user.save();

  setAuthCookies(res, accessToken, newRefreshToken);

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { user: sanitizeUser(user), token: accessToken },
        "Token refreshed successfully."
      )
    );
});

// LOGOUT
export const Logout = AsyncHandler(async (req, res) => {
  const { refresh_token } = req.cookies;
  if (refresh_token)
    await User.updateOne(
      { refreshToken: refresh_token },
      { $unset: { refreshToken: "" } }
    );

  clearAuthCookies(res);

  res.status(200).json(new ApiResponse(200, null, "Logout successful."));
});
