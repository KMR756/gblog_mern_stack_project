import User from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { AsyncHandler } from "../utils/asyncHandler.js";
import { sanitizeUser } from "../utils/auth.utils.js";

export const getUser = AsyncHandler(async (req, res) => {
  const { userID } = req.params;
  const user = await User.findById({ _id: userID });
  if (!user) {
    throw new ApiError(404, "user not found..");
  }
  res.status(200).json(new ApiResponse(200, { user: sanitizeUser(user) }));
});
