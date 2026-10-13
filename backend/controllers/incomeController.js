import Income from "../models/Income.model.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { parseAmount, parseDate, normalizeLabel } from "../utils/validators.js";

const addIncome = asyncHandler(async (req, res) => {
  const { amount, source, date } = req.body ?? {};

  if (amount === undefined || !source || !date) {
    throw new ApiError(400, "Amount, source and date are required");
  }

  const income = await Income.create({
    userId: req.user._id,
    amount: parseAmount(amount),
    source: normalizeLabel(source, "Source"),
    date: parseDate(date),
  });

  return res
    .status(201)
    .json(new ApiResponse(201, income, "Income added successfully"));
});

const getIncome = asyncHandler(async (req, res) => {
  const incomes = await Income.find({ userId: req.user._id }).sort({ date: -1 });

  return res.status(200).json(
    new ApiResponse(200, incomes, "Income Fetched successfully"),
  );
});

const updateIncome = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const body = req.body ?? {};

  // Whitelist fields (no mass assignment of userId)
  const update = {};
  if (body.amount !== undefined) update.amount = parseAmount(body.amount);
  if (body.source !== undefined) update.source = normalizeLabel(body.source, "Source");
  if (body.date !== undefined) update.date = parseDate(body.date);

  if (Object.keys(update).length === 0) {
    throw new ApiError(400, "No valid fields to update");
  }

  const income = await Income.findOneAndUpdate(
    { _id: id, userId: req.user._id },
    { $set: update },
    { new: true, runValidators: true },
  );

  if (!income) {
    throw new ApiError(404, "Income not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, income, "Income updated successfully"));
});

const deleteIncome = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const income = await Income.findOneAndDelete({
    _id: id,
    userId: req.user._id,
  });

  if (!income) {
    throw new ApiError(404, "Income not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Income deleted successfully"));
});

export { addIncome, getIncome, updateIncome, deleteIncome };
