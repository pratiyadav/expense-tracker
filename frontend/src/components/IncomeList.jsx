import { useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";
import IncomeForm from "./IncomeForm";
import DownloadButton from "./DownloadButton";
import { getCategoryStyle } from "../utils/categoryStyle";

const IncomeList = () => {
  const [incomes, setIncomes] = useState([]);
  const [editingIncome, setEditingIncome] = useState(null);

  const fetchIncomes = async () => {
    const response = await axiosInstance.get("/income");
    setIncomes(response.data.data);
  };

  useEffect(() => { fetchIncomes(); }, []);

  const handleDelete = async (id) => {
    await axiosInstance.delete(`/income/${id}`);
    fetchIncomes();
  };

  return (
    <div className="card">
      <h2>{editingIncome ? "Edit Income" : "Add Income"}</h2>
      <IncomeForm initialData={editingIncome || {}} onSuccess={() => { setEditingIncome(null); fetchIncomes(); }} />

      <div className="list-header">
        <h3 className="section-subtitle" style={{ margin: 0 }}>Your Income</h3>
        <DownloadButton
          data={incomes}
          columns={[
            { key: "source", label: "Source" },
            { key: "amount", label: "Amount" },
            { key: "date", label: "Date" },
          ]}
          filename="income.csv"
        />
      </div>

      <ul className="transaction-list">
        {incomes.map((inc) => {
          const style = getCategoryStyle(inc.source);
          return (
            <li key={inc._id} className="transaction-row">
              <div className="transaction-icon" style={{ background: style.bg, color: style.color }}>{style.emoji}</div>
              <div className="transaction-info">
                <span className="transaction-title">{inc.source}</span>
                <span className="transaction-date">{new Date(inc.date).toLocaleDateString()}</span>
              </div>
              <span className="pill income-pill">+ ₹{Number(inc.amount).toLocaleString("en-IN")}</span>
              <div className="transaction-actions">
                <button className="ghost-action" onClick={() => setEditingIncome(inc)}>Edit</button>
                <button className="ghost-action danger" onClick={() => handleDelete(inc._id)}>Delete</button>
              </div>
            </li>
          );
        })}
      </ul>
      {incomes.length === 0 && <p className="empty-note">No income logged yet — add your first one above.</p>}
    </div>
  );
};

export default IncomeList;