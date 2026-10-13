import mongoose from "mongoose";

const IncomeSchema = new mongoose.Schema(
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
    source: {
      type: String,
      required: true,
      trim: true,
      maxlength: 60,
    },
    date: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

IncomeSchema.index({ userId: 1, date: -1 });

export default mongoose.model("Income", IncomeSchema);
