import jwt from "jsonwebtoken";
import User from "../models/Users.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/AsyncHandler.js";

export const protect = asyncHandler(async (req, res, next) => {
  const token = req.cookies?.token;
  if (!token) throw new ApiError(401, "Not authorized, no token");

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    throw new ApiError(401, "Not authorized, token failed");
  }

  const user = await User.findById(decoded.id).select("-password");
  if (!user) throw new ApiError(401, "Not authorized, user no longer exists");

  // A password reset invalidates every token issued before it.
  if (
    user.passwordChangedAt &&
    decoded.iat < Math.floor(user.passwordChangedAt.getTime() / 1000)
  ) {
    throw new ApiError(401, "Session expired, please log in again");
  }

  req.user = user;
  next();
});
