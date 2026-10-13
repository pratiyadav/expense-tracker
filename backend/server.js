// Must be the first import: ES module imports run before the rest of this file,
// so loading .env here guarantees every other module sees the variables.
import "dotenv/config";
import dns from "dns";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import expenseRoutes from "./routes/expenseRoutes.js";
import incomeRoutes from "./routes/incomeRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import receiptRoutes from "./routes/receiptRoutes.js";
import { errorHandler } from "./middleware/errorMiddleware.js";
import { ApiError } from "./utils/ApiError.js";

dns.setDefaultResultOrder("ipv4first");

connectDB();

const app = express();

// Render (and most hosts) put one proxy in front of the app. Needed so
// rate limiting sees each visitor's real IP instead of the proxy's.
app.set("trust proxy", 1);

app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);
app.use(express.json({ limit: "100kb" }));
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/income", incomeRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/receipts", receiptRoutes);

app.get("/", (req, res) => {
  res.send("Expense Tracker API is running");
});

app.use((req, res, next) => {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
