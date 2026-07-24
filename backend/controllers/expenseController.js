import Expense from "../models/Expense.model.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const addExpense = asyncHandler(async (req, res) => {
  const { amount, category, description, date, merchant, receiptImageUrl, source } = req.body;

  if (!amount || !category || !date) {
    throw new ApiError(400, "Amount, category, and date are required");
  }

  const expense = await Expense.create({
    userId: req.user._id,
    amount,
    category,
    description,
    date,
    merchant: merchant || null,
    receiptImageUrl: receiptImageUrl || null,
    source: source || "manual",
  });

  return res
    .status(201)
    .json(new ApiResponse(201, expense, "Expense added successfully"));
});



const getExpense = asyncHandler(async (req, res) => {
  const expenses = await Expense.find({ userId: req.user._id });

  return res
    .status(200)
    .json(new ApiResponse(200, expenses, "Fetched the expense successfully"));
});

const updateExpense = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const expense = await Expense.findOneAndUpdate(
    { _id: id, userId: req.user._id },
    req.body,
    { new: true },
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

export { addExpense, getExpense, updateExpense, deleteExpense};
