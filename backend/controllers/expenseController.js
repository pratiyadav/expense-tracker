import Expense from "../models/Expense.model.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {
  parseAmount,
  parseDate,
  normalizeLabel,
  optionalString,
  cloudinaryUrlOrNull,
} from "../utils/validators.js";

const addExpense = asyncHandler(async (req, res) => {
  const { amount, category, description, date, merchant, receiptImageUrl, source } = req.body ?? {};

  if (amount === undefined || !category || !date) {
    throw new ApiError(400, "Amount, category, and date are required");
  }

  const expense = await Expense.create({
    userId: req.user._id,
    amount: parseAmount(amount),
    category: normalizeLabel(category, "Category"),
    description: optionalString(description, "Description", { max: 200 }),
    date: parseDate(date),
    merchant: optionalString(merchant, "Merchant", { max: 100 }) || null,
    receiptImageUrl: cloudinaryUrlOrNull(receiptImageUrl),
    source: source === "receipt_scan" ? "receipt_scan" : "manual",
  });

  return res
    .status(201)
    .json(new ApiResponse(201, expense, "Expense added successfully"));
});

const getExpense = asyncHandler(async (req, res) => {
  const expenses = await Expense.find({ userId: req.user._id }).sort({ date: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, expenses, "Fetched the expense successfully"));
});

const updateExpense = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const body = req.body ?? {};

  // Whitelist: only these fields can change. Passing req.body straight in
  // would let a client overwrite userId or source (mass assignment).
  const update = {};
  if (body.amount !== undefined) update.amount = parseAmount(body.amount);
  if (body.category !== undefined) update.category = normalizeLabel(body.category, "Category");
  if (body.description !== undefined) update.description = optionalString(body.description, "Description", { max: 200 });
  if (body.date !== undefined) update.date = parseDate(body.date);
  if (body.merchant !== undefined) update.merchant = optionalString(body.merchant, "Merchant", { max: 100 }) || null;

  if (Object.keys(update).length === 0) {
    throw new ApiError(400, "No valid fields to update");
  }

  const expense = await Expense.findOneAndUpdate(
    { _id: id, userId: req.user._id },
    { $set: update },
    { new: true, runValidators: true },
  );
  if (!expense) {
    throw new ApiError(404, "Expense not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, expense, "Expense updated successfully"));
});

const deleteExpense = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const expense = await Expense.findOneAndDelete({ _id: id, userId: req.user._id });

  if (!expense) {
    throw new ApiError(404, "Expense not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Expense deleted successfully"));
});

export { addExpense, getExpense, updateExpense, deleteExpense };
