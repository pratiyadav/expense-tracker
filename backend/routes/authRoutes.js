import express from "express";
import {
  registerUser, loginUser, logoutUser, getMe,
  uploadAvatar, forgotPassword, resetPassword,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";
import { authLimiter, forgotPasswordLimiter } from "../middleware/rateLimiters.js";

const router = express.Router();

router.post("/register", authLimiter, registerUser);
router.post("/login", authLimiter, loginUser);
router.post("/logout", logoutUser);
router.get("/me", protect, getMe);
router.put("/avatar", protect, upload.single("avatar"), uploadAvatar);
router.post("/forgot-password", forgotPasswordLimiter, forgotPassword);
router.put("/reset-password/:token", authLimiter, resetPassword);

export default router;
