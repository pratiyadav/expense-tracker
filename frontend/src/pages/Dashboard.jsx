import { useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";
import OverviewComparison from "../components/Charts/OverviewComparison";
import CategoryBreakdown from "../components/Charts/CategoryBreakdown";

const Dashboard = () => {
  const [totals, setTotals] = useState({ income: 0, expense: 0 });

  useEffect(() => {
    const fetchTotals = async () => {
      const [expenseRes, incomeRes] = await Promise.all([
        axiosInstance.get("/expenses"),
        axiosInstance.get("/income"),
      ]);
      const totalExpense = expenseRes.data.data.reduce((sum, e) => sum + Number(e.amount), 0);
      const totalIncome = incomeRes.data.data.reduce((sum, i) => sum + Number(i.amount), 0);
      setTotals({ income: totalIncome, expense: totalExpense });
    };
    fetchTotals();
  }, []);

  const net = totals.income - totals.expense;
  const fmt = (n) => `₹${Math.abs(n).toLocaleString("en-IN")}`;

  return (
    <div className="page-container">
      <h1>Dashboard</h1>

      <div className="stat-row">
        <div className="stat-card">
          <div className="stat-icon purple">₹</div>
          <div><span className="stat-label">Total Balance</span><span className="stat-value">{net < 0 ? "−" : ""}{fmt(net)}</span></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green">↑</div>
          <div><span className="stat-label">Total Income</span><span className="stat-value">{fmt(totals.income)}</span></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon red">↓</div>
          <div><span className="stat-label">Total Expenses</span><span className="stat-value">{fmt(totals.expense)}</span></div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="card"><h2>Income vs Expense</h2><OverviewComparison /></div>
        <div className="card"><h2>Category Breakdown</h2><CategoryBreakdown /></div>
      </div>
    </div>
  );
};

export default Dashboard;