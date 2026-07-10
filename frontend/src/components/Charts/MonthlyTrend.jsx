import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import axiosInstance from "../../api/axiosInstance";

const MonthlyTrend = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axiosInstance.get("/analytics/monthly");
      const formatted = response.data.data.map((item) => ({
        month: `${item._id.month}/${item._id.year}`,
        totalSpent: item.totalSpent,
      }));
      setData(formatted);
    };
    fetchData();
  }, []);

  if (data.length === 0) return <p>No expense data yet.</p>;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="totalSpent" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default MonthlyTrend;