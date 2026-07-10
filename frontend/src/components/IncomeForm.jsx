import { useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";

const IncomeForm = ({ initialData = {}, onSuccess }) => {
  const [amount, setAmount] = useState(initialData.amount || "");
  const [source, setSource] = useState(initialData.source || "");
  const [date, setDate] = useState(initialData.date || "");
  const [error, setError] = useState("");

  useEffect(() => {
    if (initialData._id) {
      setAmount(initialData.amount);
      setSource(initialData.source);
      setDate(initialData.date?.split("T")[0]);
    }
  }, [initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (initialData._id) {
        await axiosInstance.put(`/income/${initialData._id}`, { amount, source, date });
      } else {
        await axiosInstance.post("/income", { amount, source, date });
      }
      setAmount("");
      setSource("");
      setDate("");
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save income");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} required />
      <input type="text" placeholder="Source (e.g. Salary)" value={source} onChange={(e) => setSource(e.target.value)} required />
      <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
      {error && <p style={{ color: "red" }}>{error}</p>}
      <button type="submit">{initialData._id ? "Update" : "Add"} Income</button>
    </form>
  );
};

export default IncomeForm;