import { useState, useEffect } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import axiosInstance from "../../api/axiosInstance";
import { CHART_COLORS } from "../../utils/categoryStyle";

const CategoryBreakdown = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axiosInstance.get("/analytics/category");
      const formatted = response.data.data.map((item) => ({
        name: item._id,
        value: item.totalSpent,
      }));
      setData(formatted);
    };
    fetchData();
  }, []);

  const total = data.reduce((sum, d) => sum + d.value, 0);

  if (data.length === 0) return <p className="empty-note">No expense data yet.</p>;

  return (
    <div className="donut-wrapper">
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" innerRadius={70} outerRadius={100} paddingAngle={3}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} stroke="none" />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
      <div className="donut-center">
        <span className="donut-label">Total Spent</span>
        <span className="donut-value">₹{total.toLocaleString("en-IN")}</span>
      </div>
      <ul className="chart-legend">
        {data.map((entry, index) => (
          <li key={entry.name}>
            <span className="legend-dot" style={{ background: CHART_COLORS[index % CHART_COLORS.length] }} />
            {entry.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryBreakdown;