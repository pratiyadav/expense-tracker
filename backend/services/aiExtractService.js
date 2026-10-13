import { GoogleGenAI } from "@google/genai";
import { ApiError } from "../utils/ApiError.js";

// Pin a model through GEMINI_MODEL if you need stable behaviour; "-latest"
// aliases can start pointing at a different model without any code change.
const MODEL = process.env.GEMINI_MODEL || "gemini-3.5-flash-lite";
const TIMEOUT_MS = 25000;

// Created on first use, so it never depends on when dotenv was loaded.
let client;
const getClient = () => {
  if (!process.env.GEMINI_API_KEY) {
    throw new ApiError(500, "Receipt scanning is not configured");
  }
  client ??= new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  return client;
};

const PROMPT = `Look at this receipt image and extract the following information. Respond with ONLY valid JSON, no other text, no markdown formatting:
{
  "merchant": "store or business name",
  "amount": total amount as a number (no currency symbol),
  "date": "date in YYYY-MM-DD format exactly as printed on the receipt",
  "category_suggestions": [
    { "category": "most likely category", "confidence": 0.0 to 1.0 },
    { "category": "second likely category", "confidence": 0.0 to 1.0 }
  ]
}
If any field cannot be determined from the image, use null for that field. Do not guess the date.`;

const withTimeout = (promise, ms) =>
  Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(Object.assign(new Error("Gemini request timed out"), { status: 504 })), ms),
    ),
  ]);

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const callGemini = async (base64Image, mediaType) =>
  withTimeout(
    getClient().models.generateContent({
      model: MODEL,
      contents: [
        { inlineData: { mimeType: mediaType, data: base64Image } },
        { text: PROMPT },
      ],
    }),
    TIMEOUT_MS,
  );

// Turns the model's raw text into safe, validated data. Exported for testing.
export const parseReceiptJson = (rawText) => {
  if (typeof rawText !== "string" || !rawText.trim()) {
    throw new ApiError(422, "Could not read this receipt. Please enter it manually.");
  }

  let cleaned = rawText.replace(/```json|```/g, "").trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start !== -1 && end > start) cleaned = cleaned.slice(start, end + 1);

  let parsed;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    throw new ApiError(422, "Could not read this receipt. Please enter it manually.");
  }

  const amount = Number(parsed.amount);
  const dateOk =
    typeof parsed.date === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(parsed.date) &&
    !Number.isNaN(new Date(parsed.date).getTime());

  const suggestions = Array.isArray(parsed.category_suggestions)
    ? parsed.category_suggestions
        .filter((s) => s && typeof s.category === "string" && s.category.trim())
        .slice(0, 3)
        .map((s) => ({
          category: s.category.trim().slice(0, 60),
          confidence: Math.min(1, Math.max(0, Number(s.confidence) || 0)),
        }))
    : [];

  return {
    merchant: typeof parsed.merchant === "string" && parsed.merchant.trim()
      ? parsed.merchant.trim().slice(0, 100)
      : null,
    amount: Number.isFinite(amount) && amount > 0 ? amount : null,
    date: dateOk ? parsed.date : null,
    category_suggestions: suggestions,
  };
};

export const extractReceiptData = async (base64Image, mediaType) => {
  let response;
  try {
    try {
      response = await callGemini(base64Image, mediaType);
    } catch (err) {
      // One retry for rate limits and temporary server errors
      if ([429, 500, 503, 504].includes(err.status)) {
        await wait(1500);
        response = await callGemini(base64Image, mediaType);
      } else {
        throw err;
      }
    }
  } catch (err) {
    if (err instanceof ApiError) throw err;
    console.error("Gemini API error:", err.message);
    if (err.status === 429) {
      throw new ApiError(429, "Receipt scanning is busy right now. Please try again shortly.");
    }
    throw new ApiError(502, "Receipt scanning is unavailable. Please enter the expense manually.");
  }

  return parseReceiptJson(response.text);
};
