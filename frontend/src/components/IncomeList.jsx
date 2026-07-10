import { useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";
import IncomeForm from "./IncomeForm";

const IncomeList = () => {
  const [incomes, setIncomes] = useState([]);
  const [editingIncome, setEditingIncome] = useState(null);

  const fetchIncomes = async () => {
    const response = await axiosInstance.get("/income");
    setIncomes(response.data.data);
  };

  useEffect(() => {
    fetchIncomes();
  }, []);

  const handleDelete = async (id) => {
    await axiosInstance.delete(`/income/${id}`);
    fetchIncomes();
  };

  return (
    <div className="card">
      <h3>{editingIncome ? "Edit Income" : "Add Income"}</h3>
      <IncomeForm
        initialData={editingIncome || {}}
        onSuccess={() => {
          setEditingIncome(null);
          fetchIncomes();
        }}
      />

      <h3 style={{ marginTop: "1.5rem" }}>Your Income</h3>
      <ul className="entry-list">
        {incomes.map((inc) => (
          <li key={inc._id} className="entry-item">
            <span className="entry-details">
              {inc.source} — <span className="entry-amount">₹{inc.amount}</span> — {new Date(inc.date).toLocaleDateString()}
            </span>
            <span className="entry-actions">
              <button className="btn-secondary" onClick={() => setEditingIncome(inc)}>Edit</button>
              <button className="btn-danger" onClick={() => handleDelete(inc._id)}>Delete</button>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default IncomeList;