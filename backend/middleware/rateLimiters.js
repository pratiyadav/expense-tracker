import rateLimit from "express-rate-limit";

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  message: {
    success: false,
    message: "Too many attempts, please try again after some time",
    statusCode: 429,
  },
});

export const forgotPasswordLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 5,
  message: {
    success: false,
    message: "Too many reset requests, please try again later",
    statusCode: 429,
  },
});

export const scanLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 30,
  keyGenerator: (req) => req.user._id.toString(),
  message: {
    success: false,
    message: "Receipt scan limit reached, please try again later",
    statusCode: 429,
  },
});
