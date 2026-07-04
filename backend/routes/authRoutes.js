import express from "express";
import { registerUser, loginUSer } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUSer);

export default router;