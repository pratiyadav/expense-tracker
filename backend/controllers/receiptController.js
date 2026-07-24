import cloudinary from "../config/cloudinary.js";
import { extractReceiptData } from "../services/aiExtractService.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const scanReceipt = asyncHandler(async (req, res) => {
  if (!req.file) throw new ApiError(400, "No receipt image uploaded");

  const base64Image = req.file.buffer.toString("base64");
  const mediaType = req.file.mimetype;

  const extractedData = await extractReceiptData(base64Image, mediaType);

  const uploadFromBuffer = () =>
    new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "finsight-receipts" },
        (error, result) => (result ? resolve(result) : reject(error))
      );
      stream.end(req.file.buffer);
    });

  const uploadResult = await uploadFromBuffer();

  return res.status(200).json(
    new ApiResponse(200, {
      ...extractedData,
      receiptImageUrl: uploadResult.secure_url,
    }, "Receipt scanned successfully")
  );
});

export { scanReceipt };