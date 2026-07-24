import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const extractReceiptData = async (base64Image, mediaType) => {
  const prompt = `Look at this receipt image and extract the following information. Respond with ONLY valid JSON, no other text, no markdown formatting:
{
  "merchant": "store or business name",
  "amount": total amount as a number (no currency symbol),
  "date": "date in YYYY-MM-DD format, use today's date if not visible",
  "category_suggestions": [
    { "category": "most likely category", "confidence": 0.0 to 1.0 },
    { "category": "second likely category", "confidence": 0.0 to 1.0 }
  ]
}
If any field cannot be determined, use null for that field.`;

  let response;
  try {
    response = await ai.models.generateContent({
      model: "gemini-flash-latest",
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
    throw err;
  }

  const responseText = response.text;
  const cleaned = responseText.replace(/```json|```/g, "").trim();
  return JSON.parse(cleaned);
};
