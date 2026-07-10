import { useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";

const ExpenseForm = ({ initialData = {}, onSuccess }) => {
  const [amount, setAmount] = useState(initialData.amount || "");
  const [category, setCategory] = useState(initialData.category || "");
  const [description, setDescription] = useState(initialData.description || "");
  const [date, setDate] = useState(initialData.date || "");
  const [error, setError] = useState("");

  useEffect(() => {
    if (initialData._id) {
      setAmount(initialData.amount);
      setCategory(initialData.category);
      setDescription(initialData.description);
      setDate(initialData.date?.split("T")[0]);
    }
  }, [initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (initialData._id) {
        await axiosInstance.put(`/expenses/${initialData._id}`, { amount, category, description, date });
      } else {
        await axiosInstance.post("/expenses", { amount, category, description, date });
      }
      setAmount("");
      setCategory("");
      setDescription("");
      setDate("");
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save expense");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-row">
        <input type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} required />
        <input type="text" placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)} required />
        <input type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        <button type="submit">{initialData._id ? "Update" : "Add"} Expense</button>
      </div>
      {error && <p className="error-text">{error}</p>}
    </form>
  );
};

export default ExpenseForm;