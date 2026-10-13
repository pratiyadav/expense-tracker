import { useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";
import OverviewComparison from "../components/Charts/OverviewComparison";
import CategoryBreakdown from "../components/Charts/CategoryBreakdown";

const Dashboard = () => {
  const [totals, setTotals] = useState({ income: 0, expense: 0 });
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTotals = async () => {
      try {
        // Totals are summed in MongoDB, so the browser no longer downloads every record
        const response = await axiosInstance.get("/analytics/totals");
        setTotals(response.data.data);
      } catch (err) {
        setError(err.response?.data?.message || "Could not load your totals");
      }
    };
    fetchTotals();
  }, []);

  const net = totals.income - totals.expense;
  const fmt = (n) => `₹${Math.abs(n).toLocaleString("en-IN")}`;

  return (
    <div className="page-container">
      <h1>Dashboard</h1>
      {error && <p className="error-text">{error}</p>}

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
