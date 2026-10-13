import rateLimit from "express-rate-limit";

const handler = (message) => (req, res) =>
  res.status(429).json({ success: false, message, statusCode: 429 });

// Brute-force protection for login and register
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  handler: handler("Too many attempts. Please try again in a few minutes."),
});

// Stops someone from flooding an inbox with reset emails
export const forgotPasswordLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  handler: handler("Too many reset requests. Please try again later."),
});

// Protects the free Gemini quota. Runs after `protect`, so it counts per user.
export const scanLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 30,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  keyGenerator: (req) => String(req.user?._id),
  handler: handler("Receipt scan limit reached. Please try again later."),
});
