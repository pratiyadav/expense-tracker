import { GoogleGenAI } from "@google/genai";
import { ApiError } from "../utils/ApiError.js";

export const extractReceiptData = async (base64Image, mediaType) => {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  const prompt = `Look at this receipt image and extract the following information. Respond with ONLY valid JSON, no other text, no markdown formatting:
{
  "merchant": "store or business name",
  "amount": total amount as a number (no currency symbol),
  "date": "date in YYYY-MM-DD format as printed on the receipt",
  "category_suggestions": [
    { "category": "most likely category", "confidence": 0.0 to 1.0 },
    { "category": "second likely category", "confidence": 0.0 to 1.0 }
  ]
}
If any field cannot be determined, use null for that field. Do not guess.`;

  let response;
  try {
    response = await ai.models.generateContent({
      model: process.env.GEMINI_MODEL || "gemini-3.5-flash-lite",
      contents: [
        {
          inlineData: {
            mimeType: mediaType,
            data: base64Image,
          },
        },
        {
          text: prompt,
        },
      ],
    });
  } catch (err) {
    console.error("Gemini API error:", err.message);
    throw new ApiError(503, "Receipt scanning is unavailable right now, please enter the expense manually");
  }

  const responseText = response.text || "";
  const cleaned = responseText.replace(/```json|```/g, "").trim();

  try {
    return JSON.parse(cleaned);
  } catch (err) {
    throw new ApiError(422, "Could not read this receipt, please enter the expense manually");
  }
};
