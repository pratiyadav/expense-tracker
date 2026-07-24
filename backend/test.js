import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function test() {
  try {
    const models = await ai.models.list();
    console.log(models);
  } catch (err) {
    console.error(err);
  }
}

test();