import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from "recharts";
import axiosInstance from "../../api/axiosInstance";

const OverviewComparison = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axiosInstance.get("/analytics/overview");
      setData(response.data.data.map((item) => ({ month: `${item.month}/${item.year}`, Income: item.income, Expense: item.expense })));
    };
    fetchData();
  }, []);

  if (data.length === 0) return <p className="empty-note">No data yet.</p>;

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
        <XAxis dataKey="month" stroke="var(--color-ink-light)" fontSize={12} />
        <YAxis stroke="var(--color-ink-light)" fontSize={12} />
        <Tooltip />
        <Legend />
        <Bar dataKey="Income" fill="var(--color-income)" radius={[4, 4, 0, 0]} />
        <Bar dataKey="Expense" fill="var(--color-expense)" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default OverviewComparison;