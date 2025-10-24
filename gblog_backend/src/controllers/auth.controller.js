import User from "../models/user.models.js";
import { handleError } from "../utils/HandleError.js";
import bcryptjs from "bcryptjs";
import { handleSucces } from "../utils/HandleSuccess.js";
import jwt from "jsonwebtoken";
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
    // Hide password in response
    const userWithOutPassword = {
      id: user._id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    };
    res
      .status(201)
      .json(handleSucces(201, "Registraion succesfully.", userWithOutPassword));
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
    const hashedPassword = user.password;
    const comparePassword = await bcryptjs.compare(password, hashedPassword);
    if (!comparePassword) {
      return next(handleError(404, "invalid login credentials."));
    }
    const token = await jwt.sign(
      {
        _id: user._id,
        user: user.name,
        email: user.email,
        avater: user.avater,
      },
      process.env.JWT_SECRET
    );
    res.cookie("access_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      path: "/",
    });
    res.status(200).json(
      handleSucces(200, "login succesfully.", {
        _id: user._id,
        role: user.role,

        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
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
    let user;
    user = await User.findOne({ email });
    if (!user) {
      const password = Math.random().toString(36).slice(-8);
      console.log(password);

      const hashedPassword = await bcryptjs.hash(password, 12);
      const newUser = new User({
        name,
        email,
        password: hashedPassword,
        avater: avater || "",
      });
      user = await newUser.save();
    }

    const payload = {
      _id: user._id,
      name: user.name,
      email: user.email,
      avater: user.avater,
      role: user.role,
    };
    const token = await jwt.sign(payload, process.env.JWT_SECRET);
    res.cookie("access_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      path: "/",
    });
    res.status(200).json(
      handleSucces(200, "login succesfully.", {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avater: user.avater,
        createdAt: user.createdAt,
      })
    );
  } catch (error) {
    next(handleError(500, error.message));
  }
};

// logout controller
export const Logout = async (req, res, next) => {};
