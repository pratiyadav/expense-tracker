import express from "express";
import {
  registerUser, loginUser, logoutUser, getMe,
  uploadAvatar, forgotPassword, resetPassword,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/me", protect, getMe);
router.put("/avatar", protect, upload.single("avatar"), uploadAvatar);
router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:token", resetPassword);

export default router;