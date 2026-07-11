import { useState, useEffect } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import axiosInstance from "../../api/axiosInstance";

const IncomeTrend = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axiosInstance.get("/analytics/income-monthly");
      setData(response.data.data.map((item) => ({ month: `${item._id.month}/${item._id.year}`, totalIncome: item.totalIncome })));
    };
    fetchData();
  }, []);

  if (data.length === 0) return <p className="empty-note">No income data yet.</p>;

  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="incomeFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-income)" stopOpacity={0.35} />
            <stop offset="100%" stopColor="var(--color-income)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
        <XAxis dataKey="month" stroke="var(--color-ink-light)" fontSize={12} />
        <YAxis stroke="var(--color-ink-light)" fontSize={12} />
        <Tooltip />
        <Area type="monotone" dataKey="totalIncome" stroke="var(--color-income)" strokeWidth={2.5} fill="url(#incomeFill)" />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default IncomeTrend;