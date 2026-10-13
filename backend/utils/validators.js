import { ApiError } from "./ApiError.js";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Only accept real strings. This blocks NoSQL-injection payloads such as
// { "email": { "$ne": null } }, which arrive as objects, not strings.
export const requireString = (value, field, { max = 200 } = {}) => {
  if (typeof value !== "string" || !value.trim()) {
    throw new ApiError(400, `${field} is required`);
  }
  const trimmed = value.trim();
  if (trimmed.length > max) {
    throw new ApiError(400, `${field} must be at most ${max} characters`);
  }
  return trimmed;
};

// Optional string: undefined/null -> undefined, otherwise must be a string.
export const optionalString = (value, field, { max = 200 } = {}) => {
  if (value === undefined || value === null) return undefined;
  if (typeof value !== "string") {
    throw new ApiError(400, `${field} must be text`);
  }
  const trimmed = value.trim();
  if (trimmed.length > max) {
    throw new ApiError(400, `${field} must be at most ${max} characters`);
  }
  return trimmed;
};

export const parseEmail = (value) => {
  const email = requireString(value, "Email", { max: 254 }).toLowerCase();
  if (!EMAIL_RE.test(email)) {
    throw new ApiError(400, "Please enter a valid email address");
  }
  return email;
};

// bcrypt only uses the first 72 bytes of a password, so cap the length.
export const parsePassword = (value) => {
  if (typeof value !== "string" || value.length < 8) {
    throw new ApiError(400, "Password must be at least 8 characters");
  }
  if (Buffer.byteLength(value, "utf8") > 72) {
    throw new ApiError(400, "Password must be at most 72 bytes");
  }
  return value;
};

export const parseAmount = (value) => {
  const n =
    typeof value === "number"
      ? value
      : typeof value === "string" && value.trim() !== ""
        ? Number(value.trim())
        : NaN;
  if (!Number.isFinite(n) || n <= 0) {
    throw new ApiError(400, "Amount must be a positive number");
  }
  if (n > 1e9) throw new ApiError(400, "Amount is too large");
  return Math.round(n * 100) / 100; // keep two decimal places
};

export const parseDate = (value) => {
  const date = typeof value === "string" ? new Date(value) : null;
  if (!date || Number.isNaN(date.getTime())) {
    throw new ApiError(400, "A valid date is required");
  }
  return date;
};

// "  FOOD  " / "food" / "Food" all become "Food", so the category chart does
// not split one category into several slices.
export const normalizeLabel = (value, field) => {
  const v = requireString(value, field, { max: 60 }).replace(/\s+/g, " ");
  return v.charAt(0).toUpperCase() + v.slice(1).toLowerCase();
};

// Accept only receipt images that were uploaded to this app's Cloudinary account.
export const cloudinaryUrlOrNull = (value) => {
  if (typeof value !== "string" || !value) return null;
  const cloud = process.env.CLOUDINARY_CLOUD_NAME;
  const prefix = cloud
    ? `https://res.cloudinary.com/${cloud}/`
    : "https://res.cloudinary.com/";
  if (!value.startsWith(prefix) || value.length > 500) {
    throw new ApiError(400, "Invalid receipt image URL");
  }
  return value;
};
