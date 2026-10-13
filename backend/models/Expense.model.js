import mongoose from "mongoose";

const ExpenseSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: [0.01, "Amount must be greater than 0"],
    },
    category: {
      type: String,
      required: true,
      trim: true,
      maxlength: 60,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 200,
    },
    date: {
      type: Date,
      required: true,
    },
    source: {
      type: String,
      enum: ["manual", "receipt_scan"],
      default: "manual",
    },
    
    receiptImageUrl: {
      type: String,
      default: null,
    },
    merchant: {
      type: String,
      trim: true,
      maxlength: 100,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

// Every query filters by user and works with dates
ExpenseSchema.index({ userId: 1, date: -1 });

export default mongoose.model("Expense", ExpenseSchema);
