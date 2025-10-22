import User from "../models/user.models.js";
import { handleError } from "../utils/HandleError.js";
import bcryptjs from "bcryptjs";
import { handleSucces } from "../utils/HandleSuccess.js";
// register controller
export const Register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    // check all fied are given or not
    if (!name || !email || !password) {
      return next(handleError(400, "all fields are required."));
    }
    // check user already registered or not
    const checkUser = await User.findOne({ email });
    if (checkUser) {
      return next(handleError(409, "user already registered. please log in."));
    }
    // hashing password

    const hashedPassword = await bcryptjs.hash(password, 12);
    const user = new User({
      name,
      email,
      password: hashedPassword,
    });
    await user.save();

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
    next(error);
  }
};
// login controller
export const Login = async (req, res) => {};

// goolge login controller
export const GoolgeLogin = async (req, res) => {};

// logout controller
export const Logout = async (req, res) => {};
