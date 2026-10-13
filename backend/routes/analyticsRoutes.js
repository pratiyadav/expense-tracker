import express from "express";
import {
  getMonthlySpending, getCategoryBreakdown,
  getMonthlyIncome, getIncomeSourceBreakdown, getTotals, getOverview,
} from "../controllers/analyticsController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/monthly", protect, getMonthlySpending);
router.get("/category", protect, getCategoryBreakdown);
router.get("/income-monthly", protect, getMonthlyIncome);
router.get("/income-source", protect, getIncomeSourceBreakdown);
router.get("/totals", protect, getTotals);
router.get("/overview", protect, getOverview);

export default router;
