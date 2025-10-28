import User from "../models/user.models.js";
import { handleError } from "../utils/HandleError.js";
import bcryptjs from "bcryptjs";
import { handleSucces } from "../utils/HandleSuccess.js";
import jwt from "jsonwebtoken";
import { generateTokens } from "../utils/token.js";
// register controller
export const Register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    // check all fied are given or not
    if (!name || !email || !password) {
      return next(handleError(400, "all fields are required."));
    }
    // check user already registered or not
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(handleError(409, "user already registered. please log in."));
    }
    // hashing password
    const hashedPassword = await bcryptjs.hash(password, 12);
    // Create user
    //  const user = await User.create({
    //   name,
    //   email,
    //   password: hashedPassword,
    // });
    const user = new User({
      name,
      email,
      password: hashedPassword,
    });
    await user.save();

    // ✅ Generate tokens immediately
    const { accessToken, refreshToken } = generateTokens(user);
    user.refreshToken = refreshToken;
    await user.save();

    // Set cookies
    res.cookie("access_token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      path: "/",
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    // Return user + token
    res.status(201).json(
      handleSucces(201, "Registration successful. Logged in automatically.", {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avater: user.avater,
          createdAt: user.createdAt,
        },
        token: accessToken,
      })
    );
  } catch (error) {
    next(handleError(500, error?.message));
  }
};
// login controller
export const Login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return next(handleError(404, "invalid login credentials."));
    }

    const comparePassword = await bcryptjs.compare(password, user.password);
    if (!comparePassword) {
      return next(handleError(404, "invalid login credentials."));
    }
    const { accessToken, refreshToken } = generateTokens(user);

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie("access_token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      path: "/",
      maxAge: 5 * 60 * 1000,
    });
    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    res.status(200).json(
      handleSucces(200, "Login successful.", {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avater: user.avater,
          createdAt: user.createdAt,
        },
        token: accessToken, // optional: store in Redux
      })
    );
  } catch (error) {
    next(handleError(500, error.message));
  }
};
// goolge login controller
export const GoogleLogin = async (req, res, next) => {
  try {
    const { name, email, avater } = req.body;
    if (!email || !name) {
      return next(handleError(400, "Google login data missing."));
    }

    let user = await User.findOne({ email });
    if (!user) {
      const randomPassword = Math.random().toString(36).slice(-8);
      // console.log(password);

      const hashedPassword = await bcryptjs.hash(randomPassword, 12);

      user = new User({
        name,
        email,
        password: hashedPassword,
        avater: avater || "",
      });
      await user.save();
    }

    const { accessToken, refreshToken } = generateTokens(user);

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie("access_token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      path: "/",
      maxAge: 5 * 60 * 1000,
    });
    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    res.status(200).json(
      handleSucces(200, "Login successful.", {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avater: user.avater,
          createdAt: user.createdAt,
        },
        token: accessToken,
      })
    );
  } catch (error) {
    next(handleError(500, error.message));
  }
};
export const RefreshToken = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refresh_token;
    if (!refreshToken) {
      return next(handleError(401, "No refresh token provided"));
    }

    const user = await User.findOne({ refreshToken });
    // console.log(user);

    if (!user) {
      return next(handleError(403, "Invalid refresh token"));
    }

    jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET,
      async (err, decoded) => {
        if (err)
          return next(handleError(403, "Invalid or expired refresh token"));

        const user = await User.findById(decoded.id);
        if (!user || user.refreshToken !== refreshToken) {
          return next(handleError(403, "Invalid refresh token"));
        }

        const { accessToken, refreshToken: newRefreshToken } =
          generateTokens(user);
        user.refreshToken = newRefreshToken;
        await user.save();

        res.cookie("access_token", accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
          path: "/",
          maxAge: 15 * 60 * 1000,
        });

        res.cookie("refresh_token", newRefreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
          path: "/",
          maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.status(200).json(
          handleSucces(200, "Token refreshed successfully", {
            user: {
              _id: user._id,
              name: user.name,
              email: user.email,
              role: user.role,
              avater: user.avater,
              createdAt: user.createdAt,
            },
            token: accessToken,
          })
        );
      }
    );
  } catch (error) {
    next(handleError(500, error.message));
  }
};

// logout controller
export const Logout = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refresh_token;
    if (refreshToken) {
      await User.updateOne({ refreshToken }, { $unset: { refreshToken: "" } });
    }

    res.clearCookie("access_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      path: "/",
    });

    res.clearCookie("refresh_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      path: "/",
    });

    res.status(200).json(handleSucces(200, "Logout successful."));
  } catch (error) {
    next(handleError(500, error.message));
  }
};

// GET /api/auth/has-refresh
export const HasRefreshToken = (req, res) => {
  const refreshToken = req.cookies.refresh_token;
  if (refreshToken) {
    return res.json({ hasRefresh: true });
  } else {
    return res.json({ hasRefresh: false });
  }
};
