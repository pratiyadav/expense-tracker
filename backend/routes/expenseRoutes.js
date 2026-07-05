import express from "express";
import { addExpense, getExpense, updateExpense, deleteExpense } from "../controllers/expenseController.js";
import { protect } from "../middleware/authMiddleware.js";

console.log({ protect, addExpense, getExpense, updateExpense, deleteExpense });

const router = express.Router();

router.post("/", protect, addExpense);
router.get("/", protect, getExpense);
router.put("/:id", protect, updateExpense);
router.delete("/:id", protect, deleteExpense);
export default router;