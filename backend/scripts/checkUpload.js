import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const tinyPng =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";

try {
  const result = await cloudinary.uploader.upload(tinyPng, { folder: "finsight-test" });
  console.log("Upload worked:", result.secure_url);
  await cloudinary.uploader.destroy(result.public_id);
  console.log("Test image deleted");
} catch (err) {
  console.log("Upload failed:", err.http_code, err.message);
}