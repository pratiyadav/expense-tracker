import Expense from "../models/Expense.model.js"
import Income from "../models/Income.model.js"
import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const getMonthlySpending = asyncHandler( async (req, res) => {
    const monthlyData = await Expense.aggregate([
        {$match: {userId: req.user._id}},
        {
            $group: {
                _id: { year:{ $year: "$date"} , month: { $month: "$date"} },
                totalSpent: {$sum: "$amount"},
            },
        },
        {$sort: {"_id.year": 1, "_id.month": 1 }},
    ]);
    return res.status(200).json(new ApiResponse(200, monthlyData, "Monthly spending fetched successfully"));
});

const getCategoryBreakdown = asyncHandler( async(req, res) => {
    const categoryData = await Expense.aggregate([
        { $match: { userId: req.user._id}},
        {
            $group: {
                _id: "$category", 
            totalSpent: {$sum: "$amount"} 
            },
        },
    ]);

    return res.status(200).json(new ApiResponse(200, categoryData, "Category breakdown fetched successfully"));
});

export { getMonthlySpending, getCategoryBreakdown };