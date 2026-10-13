import Expense from "../models/Expense.model.js";
import Income from "../models/Income.model.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// Group months in the user's timezone, not UTC. Without this, an entry at
// 11:30 pm on the last day of a month falls into the next month.
const TZ = process.env.APP_TIMEZONE || "Asia/Kolkata";
const yearMonth = {
  year: { $year: { date: "$date", timezone: TZ } },
  month: { $month: { date: "$date", timezone: TZ } },
};

const getMonthlySpending = asyncHandler(async (req, res) => {
  const monthlyData = await Expense.aggregate([
    { $match: { userId: req.user._id } },
    { $group: { _id: yearMonth, totalSpent: { $sum: "$amount" } } },
    { $sort: { "_id.year": 1, "_id.month": 1 } },
  ]);
  return res.status(200).json(new ApiResponse(200, monthlyData, "Monthly spending fetched successfully"));
});

const getCategoryBreakdown = asyncHandler(async (req, res) => {
  const categoryData = await Expense.aggregate([
    { $match: { userId: req.user._id } },
    { $group: { _id: "$category", totalSpent: { $sum: "$amount" } } },
    { $sort: { totalSpent: -1 } },
  ]);
  return res.status(200).json(new ApiResponse(200, categoryData, "Category breakdown fetched successfully"));
});

const getMonthlyIncome = asyncHandler(async (req, res) => {
  const monthlyData = await Income.aggregate([
    { $match: { userId: req.user._id } },
    { $group: { _id: yearMonth, totalIncome: { $sum: "$amount" } } },
    { $sort: { "_id.year": 1, "_id.month": 1 } },
  ]);
  return res.status(200).json(new ApiResponse(200, monthlyData, "Monthly income fetched successfully"));
});

const getIncomeSourceBreakdown = asyncHandler(async (req, res) => {
  const sourceData = await Income.aggregate([
    { $match: { userId: req.user._id } },
    { $group: { _id: "$source", totalIncome: { $sum: "$amount" } } },
    { $sort: { totalIncome: -1 } },
  ]);
  return res.status(200).json(new ApiResponse(200, sourceData, "Income source breakdown fetched successfully"));
});

// Dashboard totals, computed in MongoDB instead of downloading every record
const getTotals = asyncHandler(async (req, res) => {
  const [expenseTotal, incomeTotal] = await Promise.all([
    Expense.aggregate([
      { $match: { userId: req.user._id } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]),
    Income.aggregate([
      { $match: { userId: req.user._id } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]),
  ]);
  return res.status(200).json(
    new ApiResponse(
      200,
      { expense: expenseTotal[0]?.total ?? 0, income: incomeTotal[0]?.total ?? 0 },
      "Totals fetched successfully",
    ),
  );
});

const getOverview = asyncHandler(async (req, res) => {
  // The two pipelines are independent, so run them concurrently
  const [expenseData, incomeData] = await Promise.all([
    Expense.aggregate([
      { $match: { userId: req.user._id } },
      { $group: { _id: yearMonth, total: { $sum: "$amount" } } },
    ]),
    Income.aggregate([
      { $match: { userId: req.user._id } },
      { $group: { _id: yearMonth, total: { $sum: "$amount" } } },
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

export { getMonthlySpending, getCategoryBreakdown, getMonthlyIncome, getIncomeSourceBreakdown, getTotals, getOverview };
