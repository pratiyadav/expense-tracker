import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";

dotenv.config();

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

const timestamp = Math.floor(Date.now() / 1000);
const folder = "finsight-test";
const signature = cloudinary.utils.api_sign_request({ timestamp, folder }, apiSecret);

const tinyPng =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";

const form = new FormData();
form.append("file", tinyPng);
form.append("api_key", apiKey);
form.append("timestamp", String(timestamp));
form.append("folder", folder);
form.append("signature", signature);

const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
  method: "POST",
  body: form,
});

console.log("Status:", res.status);
console.log("Body:", await res.text());