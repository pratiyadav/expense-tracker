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
    <div>
      <h3>{editingIncome ? "Edit Income" : "Add Income"}</h3>
      <IncomeForm
        initialData={editingIncome || {}}
        onSuccess={() => {
          setEditingIncome(null);
          fetchIncomes();
        }}
      />

      <h3>Your Income</h3>
      <ul>
        {incomes.map((inc) => (
          <li key={inc._id}>
            {inc.source} — ₹{inc.amount} — {new Date(inc.date).toLocaleDateString()}
            <button onClick={() => setEditingIncome(inc)}>Edit</button>
            <button onClick={() => handleDelete(inc._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default IncomeList;