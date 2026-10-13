import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function test() {
  const models = [
    "models/gemini-2.5-flash",
    "models/gemini-2.5-pro",
    "models/gemini-2.0-flash",
    "models/gemini-flash-latest",
    "models/gemini-pro-latest",
  ];

  for (const model of models) {
    try {
      console.log(`\nTesting ${model}...`);

      const response = await ai.models.generateContent({
        model,
        contents: "Say hello",
      });

      console.log("✅ SUCCESS");
      console.log(response.text);
    } catch (e) {
      console.log("❌ FAILED");
      console.log(e.message);
    }
  }
}

test();