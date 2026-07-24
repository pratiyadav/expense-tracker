import { useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";

const ExpenseForm = ({ initialData = {}, onSuccess }) => {
  const [amount, setAmount] = useState(initialData.amount || "");
  const [category, setCategory] = useState(initialData.category || "");
  const [description, setDescription] = useState(initialData.description || "");
  const [date, setDate] = useState(initialData.date || "");
  const [error, setError] = useState("");

  useEffect(() => {
    setAmount(initialData.amount || "");
    setCategory(initialData.category || "");
    setDescription(initialData.description || "");
    setDate(initialData.date?.split?.("T")[0] || initialData.date || "");
  }, [initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const payload = { amount, category, description, date };
    if (!initialData._id && initialData.merchant) {
      payload.merchant = initialData.merchant;
      payload.receiptImageUrl = initialData.receiptImageUrl;
      payload.source = initialData.source;
    }

    try {
      if (initialData._id) {
        await axiosInstance.put(`/expenses/${initialData._id}`, payload);
      } else {
        await axiosInstance.post("/expenses", payload);
      }
      setAmount(""); setCategory(""); setDescription(""); setDate("");
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save expense");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="entry-form">
      <div className="field-group">
        <label>Amount</label>
        <input type="number" placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)} required />
      </div>
      <div className="field-group">
        <label>Category</label>
        <input type="text" placeholder="Food, Travel..." value={category} onChange={(e) => setCategory(e.target.value)} required />
      </div>
      <div className="field-group">
        <label>Description</label>
        <input type="text" placeholder="Optional note" value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>
      <div className="field-group">
        <label>Date</label>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
      </div>
      <button type="submit" className="btn-primary">{initialData._id ? "Update" : "Add"} Expense</button>
      {error && <p className="error-text">{error}</p>}
    </form>
  );
};

export default ExpenseForm;