import { useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";
import ExpenseForm from "./ExpenseForm";

const ExpenseList = () => {
  const [expenses, setExpenses] = useState([]);
  const [editingExpense, setEditingExpense] = useState(null);

  const fetchExpenses = async () => {
    const response = await axiosInstance.get("/expenses");
    setExpenses(response.data.data);
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleDelete = async (id) => {
    await axiosInstance.delete(`/expenses/${id}`);
    fetchExpenses();
  };

  return (
    <div className="card">
      <h3>{editingExpense ? "Edit Expense" : "Add Expense"}</h3>
      <ExpenseForm
        initialData={editingExpense || {}}
        onSuccess={() => {
          setEditingExpense(null);
          fetchExpenses();
        }}
      />

      <h3 style={{ marginTop: "1.5rem" }}>Your Expenses</h3>
      <ul className="entry-list">
        {expenses.map((exp) => (
          <li key={exp._id} className="entry-item">
            <span className="entry-details">
              {exp.category} — <span className="entry-amount">₹{exp.amount}</span> — {exp.description} — {new Date(exp.date).toLocaleDateString()}
            </span>
            <span className="entry-actions">
              <button className="btn-secondary" onClick={() => setEditingExpense(exp)}>Edit</button>
              <button className="btn-danger" onClick={() => handleDelete(exp._id)}>Delete</button>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ExpenseList;