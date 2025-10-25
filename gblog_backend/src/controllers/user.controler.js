import User from "../models/user.models.js";
import { handleError } from "../utils/HandleError.js";
import { handleSucces } from "../utils/HandleSuccess.js";
import bcryptjs from "bcryptjs";

// GET current user profile
export const getUserProfile = async (req, res, next) => {
  try {
    const userId = req.user._id; // set from auth middleware
    const user = await User.findById(userId).select("-password -refreshToken");
    if (!user) {
      return next(handleError(404, "User not found"));
    }

    res.status(200).json(handleSucces(200, "User profile fetched", user));
  } catch (error) {
    next(handleError(500, error.message));
  }
};

// UPDATE user profile
export const updateUserProfile = async (req, res, next) => {
  try {
    const userId = req.user._id; // from auth middleware
    const { name, email, password, avater } = req.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (avater) updateData.avater = avater;

    // If password is being updated, hash it
    if (password) {
      const hashedPassword = await bcryptjs.hash(password, 12);
      updateData.password = hashedPassword;
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      select: "-password -refreshToken",
    });

    if (!updatedUser) {
      return next(handleError(404, "User not found"));
    }

    res
      .status(200)
      .json(
        handleSucces(200, "User profile updated successfully", updatedUser)
      );
  } catch (error) {
    next(handleError(500, error.message));
  }
};
