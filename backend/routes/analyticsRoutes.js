import express from "express";
import { getMonthlySpending, getCategoryBreakdown } from "../controllers/analyticsController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/monthly", protect, getMonthlySpending);
router.get("/category", protect, getCategoryBreakdown);

export default router;