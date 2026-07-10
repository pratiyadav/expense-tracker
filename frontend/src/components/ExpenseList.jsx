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
    <div>
      <h3>{editingExpense ? "Edit Expense" : "Add Expense"}</h3>
      <ExpenseForm
        initialData={editingExpense || {}}
        onSuccess={() => {
          setEditingExpense(null);
          fetchExpenses();
        }}
      />

      <h3>Your Expenses</h3>
      <ul>
        {expenses.map((exp) => (
          <li key={exp._id}>
            {exp.category} — ₹{exp.amount} — {exp.description} — {new Date(exp.date).toLocaleDateString()}
            <button onClick={() => setEditingExpense(exp)}>Edit</button>
            <button onClick={() => handleDelete(exp._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ExpenseList;