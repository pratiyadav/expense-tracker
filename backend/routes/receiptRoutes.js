import express from "express";
import { scanReceipt } from "../controllers/receiptController.js";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post("/scan", protect, upload.single("receipt"), scanReceipt);

export default router;