import Expense from "../models/Expense.model.js";
import Income from "../models/Income.model.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const getMonthlySpending = asyncHandler(async (req, res) => {
  const monthlyData = await Expense.aggregate([
    { $match: { userId: req.user._id } },
    { $group: { _id: { year: { $year: "$date" }, month: { $month: "$date" } }, totalSpent: { $sum: "$amount" } } },
    { $sort: { "_id.year": 1, "_id.month": 1 } },
  ]);
  return res.status(200).json(new ApiResponse(200, monthlyData, "Monthly spending fetched successfully"));
});

const getCategoryBreakdown = asyncHandler(async (req, res) => {
  const categoryData = await Expense.aggregate([
    { $match: { userId: req.user._id } },
    { $group: { _id: "$category", totalSpent: { $sum: "$amount" } } },
  ]);
  return res.status(200).json(new ApiResponse(200, categoryData, "Category breakdown fetched successfully"));
});

const getMonthlyIncome = asyncHandler(async (req, res) => {
  const monthlyData = await Income.aggregate([
    { $match: { userId: req.user._id } },
    { $group: { _id: { year: { $year: "$date" }, month: { $month: "$date" } }, totalIncome: { $sum: "$amount" } } },
    { $sort: { "_id.year": 1, "_id.month": 1 } },
  ]);
  return res.status(200).json(new ApiResponse(200, monthlyData, "Monthly income fetched successfully"));
});

const getIncomeSourceBreakdown = asyncHandler(async (req, res) => {
  const sourceData = await Income.aggregate([
    { $match: { userId: req.user._id } },
    { $group: { _id: "$source", totalIncome: { $sum: "$amount" } } },
  ]);
  return res.status(200).json(new ApiResponse(200, sourceData, "Income source breakdown fetched successfully"));
});

const getOverview = asyncHandler(async (req, res) => {
  const [expenseData, incomeData] = await Promise.all([
    Expense.aggregate([
      { $match: { userId: req.user._id } },
      { $group: { _id: { year: { $year: "$date" }, month: { $month: "$date" } }, total: { $sum: "$amount" } } },
    ]),
    Income.aggregate([
      { $match: { userId: req.user._id } },
      { $group: { _id: { year: { $year: "$date" }, month: { $month: "$date" } }, total: { $sum: "$amount" } } },
    ]),
  ]);

  const merged = {};
  expenseData.forEach((item) => {
    const key = `${item._id.year}-${item._id.month}`;
    merged[key] = merged[key] || { year: item._id.year, month: item._id.month, income: 0, expense: 0 };
    merged[key].expense = item.total;
  });
  incomeData.forEach((item) => {
    const key = `${item._id.year}-${item._id.month}`;
    merged[key] = merged[key] || { year: item._id.year, month: item._id.month, income: 0, expense: 0 };
    merged[key].income = item.total;
  });

  const overview = Object.values(merged).sort((a, b) => a.year - b.year || a.month - b.month);
  return res.status(200).json(new ApiResponse(200, overview, "Overview fetched successfully"));
});

export { getMonthlySpending, getCategoryBreakdown, getMonthlyIncome, getIncomeSourceBreakdown, getOverview };