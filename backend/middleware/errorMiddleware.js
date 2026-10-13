import { ApiError } from "../utils/ApiError.js";

const errorHandler = (err, req, res, next) => {
  let error = err;

  // If it's not already an ApiError, translate known error types, then wrap it
  if (!(error instanceof ApiError)) {
    let statusCode = error.statusCode || error.status || 500;
    let message = error.message || "Something went wrong";

    if (error.name === "ValidationError" && error.errors) {
      statusCode = 400;
      message = Object.values(error.errors)
        .map((e) => e.message)
        .join(", ");
    } else if (error.name === "CastError") {
      statusCode = 400;
      message = `Invalid ${error.path}`;
    } else if (error.code === 11000) {
      statusCode = 409;
      message = "That record already exists";
    } else if (error.name === "MulterError") {
      statusCode = 400;
      message =
        error.code === "LIMIT_FILE_SIZE"
          ? "Image is too large (max 5 MB)"
          : error.message;
    }

    if (statusCode >= 500) {
      console.error(err);
      if (process.env.NODE_ENV === "production") {
        message = "Internal server error"; // never leak internals in production
      }
    }

    error = new ApiError(statusCode, message, error?.errors || [], err.stack);
  }

  const response = {
    success: false,
    message: error.message,
    statusCode: error.statusCode,
    ...(process.env.NODE_ENV === "development" ? { stack: error.stack } : {}),
  };

  return res.status(error.statusCode).json(response);
};

export { errorHandler };
