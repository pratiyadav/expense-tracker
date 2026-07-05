import Income from "../models/Income.model.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const addIncome = asyncHandler(async (req, res) => {
  const { amount, source, date } = req.body;

  if (!amount || !source || !date) {
    throw new ApiError(400, "Amount, source and date are required");
  }

  const income = await Income.create({
    userId: req.user._id,
    amount,
    source,
    date,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, income, "Income added successfully"));
});

const getIncome = asyncHandler(async (req, res) => {
  const incomes = await Income.find({ userId: req.user._id });

  return res.status(200).json(
    new ApiResponse(200, incomes, "Income Fetched successfully"),
  );
});

const updateIncome = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const income = await Income.findOneAndUpdate(
    {
      _id: id,
      userId: req.user._id,
    },
    req.body,
    { new: true },
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
