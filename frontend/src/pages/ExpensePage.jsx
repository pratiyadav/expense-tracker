import { useState } from "react";
import ExpenseList from "../components/ExpenseList";
import MonthlyTrend from "../components/Charts/MonthlyTrend";
import ReceiptUpload from "../components/ReceiptUpload";

const ExpensePage = () => {
  const [scanResult, setScanResult] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");

  const handleScanComplete = (data) => {
    setScanResult(data);
    setSelectedCategory(data.category_suggestions?.[0]?.category || "");
  };

  const clearScan = () => {
    setScanResult(null);
    setSelectedCategory("");
  };

  const prefillData = scanResult
    ? {
        amount: scanResult.amount,
        category: selectedCategory,
        description: scanResult.merchant,
        date: scanResult.date,
        merchant: scanResult.merchant,
        receiptImageUrl: scanResult.receiptImageUrl,
        source: "receipt_scan",
      }
    : null;

  return (
    <div className="page-container">
      <h1>Expenses</h1>
      <div className="card"><h2>Spending Trend</h2><MonthlyTrend /></div>

      <div className="card">
        <h2>Scan a Receipt</h2>
        <ReceiptUpload onScanComplete={handleScanComplete} />

        {scanResult && (
          <div className="scan-review">
            <p className="scan-merchant">{scanResult.merchant} — ₹{scanResult.amount}</p>
            <p className="scan-label">Choose a category:</p>
            <div className="scan-category-options">
              {scanResult.category_suggestions?.map((s) => (
                <button
                  type="button"
                  key={s.category}
                  className={`category-chip${selectedCategory === s.category ? " selected" : ""}`}
                  onClick={() => setSelectedCategory(s.category)}
                >
                  {s.category} ({Math.round(s.confidence * 100)}%)
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <ExpenseList prefillData={prefillData} onPrefillUsed={clearScan} />
    </div>
  );
};

export default ExpensePage;