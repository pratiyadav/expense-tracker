import User from "../models/Users.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import cloudinary from "../config/cloudinary.js";
import sendEmail from "../utils/sendEmail.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { parseEmail, parsePassword, requireString } from "../utils/validators.js";

// Case-insensitive lookup so accounts created before emails were lowercased
// (for example "Name@Mail.com") can still log in, without a data migration.
const CI = { locale: "en", strength: 2 };
const findByEmail = (email) => User.findOne({ email }).collation(CI);

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// One definition, used for both setting and clearing the cookie. A cookie can
// only be removed reliably when the same secure/sameSite options are used.
const cookieOptions = () => {
  const isProduction = process.env.NODE_ENV === "production";
  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
  };
};

const sendTokenCookie = (res, token) => {
  res.cookie("token", token, {
    ...cookieOptions(),
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

const publicUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  avatarUrl: user.avatarUrl,
});

export const registerUser = asyncHandler(async (req, res) => {
  const name = requireString(req.body?.name, "Name", { max: 80 });
  const email = parseEmail(req.body?.email);
  const password = parsePassword(req.body?.password);

  const userExists = await findByEmail(email);
  if (userExists) throw new ApiError(400, "User already exists");

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const user = await User.create({ name, email, password: hashedPassword });

  sendTokenCookie(res, generateToken(user._id));
  res.status(201).json(publicUser(user));
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body ?? {};
  if (typeof email !== "string" || typeof password !== "string" || !email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  const user = await findByEmail(email.trim().toLowerCase());
  if (!user) throw new ApiError(401, "Invalid credentials");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new ApiError(401, "Invalid credentials");

  sendTokenCookie(res, generateToken(user._id));
  res.json(publicUser(user));
});

export const logoutUser = asyncHandler(async (req, res) => {
  res.clearCookie("token", cookieOptions());
  res.status(200).json({ message: "Logged out successfully" });
});

export const getMe = asyncHandler(async (req, res) => {
  res.status(200).json(publicUser(req.user));
});

export const uploadAvatar = asyncHandler(async (req, res) => {
  if (!req.file) throw new ApiError(400, "No image uploaded");

  const uploadFromBuffer = () =>
    new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "finsight-avatars", transformation: [{ width: 300, height: 300, crop: "fill" }] },
        (error, result) => (result ? resolve(result) : reject(error)),
      );
      stream.end(req.file.buffer);
    });

  const result = await uploadFromBuffer();

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { avatarUrl: result.secure_url },
    { new: true },
  ).select("-password");

  res.status(200).json({ avatarUrl: user.avatarUrl });
});

const GENERIC_RESET_MESSAGE = "If that email exists, a reset link has been sent.";

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body ?? {};
  if (typeof email !== "string" || !email.trim()) {
    throw new ApiError(400, "Email is required");
  }

  const user = await findByEmail(email.trim().toLowerCase());

  // Same response whether or not the account exists (no user enumeration)
  if (!user) {
    return res.status(200).json({ message: GENERIC_RESET_MESSAGE });
  }

  const resetToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

  user.resetPasswordToken = hashedToken;
  user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
  await user.save();

  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
  const message = `You requested a password reset. Click the link below (valid for 15 minutes):\n\n${resetUrl}\n\nIf you didn't request this, ignore this email.`;

  try {
    await sendEmail({ to: user.email, subject: "FinSight AI — Password Reset", text: message });
  } catch (err) {
    // Do not leave a usable token behind if the email never went out
    user.resetPasswordToken = null;
    user.resetPasswordExpire = null;
    await user.save();
    console.error("Reset email failed:", err.message);
    throw new ApiError(500, "Could not send the reset email. Please try again later.");
  }

  res.status(200).json({ message: GENERIC_RESET_MESSAGE });
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const password = parsePassword(req.body?.password);

  const hashedToken = crypto.createHash("sha256").update(String(token)).digest("hex");

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) throw new ApiError(400, "Reset link is invalid or has expired");

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(password, salt);
  user.resetPasswordToken = null;
  user.resetPasswordExpire = null;
  user.passwordChangedAt = new Date(); // logs out every older session
  await user.save();

  res.status(200).json({ message: "Password reset successful. Please log in." });
});
