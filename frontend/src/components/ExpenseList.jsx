import { useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";
import ExpenseForm from "./ExpenseForm";
import DownloadButton from "./DownloadButton";
import { getCategoryStyle } from "../utils/categoryStyle";

const ExpenseList = ({ prefillData, onPrefillUsed }) => {
  const [expenses, setExpenses] = useState([]);
  const [editingExpense, setEditingExpense] = useState(null);

  const fetchExpenses = async () => {
    const response = await axiosInstance.get("/expenses");
    setExpenses(response.data.data);
  };

  useEffect(() => { fetchExpenses(); }, []);

  const handleDelete = async (id) => {
    await axiosInstance.delete(`/expenses/${id}`);
    fetchExpenses();
  };

  const formInitialData = editingExpense || prefillData || {};

  const handleFormSuccess = () => {
    setEditingExpense(null);
    if (prefillData) onPrefillUsed?.();
    fetchExpenses();
  };

  return (
    <div className="card">
      <h2>{editingExpense ? "Edit Expense" : "Add Expense"}</h2>
      <ExpenseForm
        key={editingExpense?._id || (prefillData ? "prefill" : "blank")}
        initialData={formInitialData}
        onSuccess={handleFormSuccess}
      />

      <div className="list-header">
        <h3 className="section-subtitle" style={{ margin: 0 }}>Your Expenses</h3>
        <DownloadButton
          data={expenses}
          columns={[
            { key: "category", label: "Category" },
            { key: "amount", label: "Amount" },
            { key: "description", label: "Description" },
            { key: "date", label: "Date" },
          ]}
          filename="expenses.csv"
        />
      </div>

      <ul className="transaction-list">
        {expenses.map((exp) => {
          const style = getCategoryStyle(exp.category);
          return (
            <li key={exp._id} className="transaction-row">
              <div className="transaction-icon" style={{ background: style.bg, color: style.color }}>{style.emoji}</div>
              <div className="transaction-info">
                <span className="transaction-title">
                  {exp.category}
                  {exp.source === "receipt_scan" && <span className="scanned-badge">📷 Scanned</span>}
                </span>
                <span className="transaction-date">{exp.description ? `${exp.description} · ` : ""}{new Date(exp.date).toLocaleDateString()}</span>
              </div>
              <span className="pill expense-pill">− ₹{Number(exp.amount).toLocaleString("en-IN")}</span>
              <div className="transaction-actions">
                <button className="ghost-action" onClick={() => setEditingExpense(exp)}>Edit</button>
                <button className="ghost-action danger" onClick={() => handleDelete(exp._id)}>Delete</button>
              </div>
            </li>
          );
        })}
      </ul>
      {expenses.length === 0 && <p className="empty-note">No expenses yet — add your first one above.</p>}
    </div>
  );
};

export default ExpenseList;