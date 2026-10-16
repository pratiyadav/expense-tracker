import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";

dotenv.config();

const names = ["CLOUDINARY_CLOUD_NAME", "CLOUDINARY_API_KEY", "CLOUDINARY_API_SECRET"];

for (const name of names) {
  const value = process.env[name];
  if (!value) {
    console.log(name, "MISSING");
  } else {
    const notes = [];
    if (value !== value.trim()) notes.push("HAS SPACES");
    if (/['"]/.test(value)) notes.push("HAS QUOTES");
    console.log(name, "length", value.length, notes.join(" "));
  }
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

try {
  const result = await cloudinary.api.ping();
  console.log("Ping result:", result);
} catch (err) {
  console.log("Ping failed:", err.http_code, err.message);
}