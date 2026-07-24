import { useRef, useState } from "react";
import axiosInstance from "../api/axiosInstance";

const ReceiptUpload = ({ onScanComplete }) => {
  const fileInputRef = useRef(null);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState("");

  const handleButtonClick = () => fileInputRef.current?.click();

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setError("");
    setScanning(true);

    const formData = new FormData();
    formData.append("receipt", file);

    try {
      const response = await axiosInstance.post("/receipts/scan", formData);
      onScanComplete(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to scan receipt");
    } finally {
      setScanning(false);
      e.target.value = "";
    }
  };

  return (
    <div className="receipt-upload">
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: "none" }}
      />
      <button type="button" className="btn-primary" onClick={handleButtonClick} disabled={scanning}>
        {scanning ? "Scanning receipt..." : "📷 Scan Receipt"}
      </button>
      {error && <p className="error-text">{error}</p>}
    </div>
  );
};

export default ReceiptUpload;