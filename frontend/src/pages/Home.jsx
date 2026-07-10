import ExpenseList from "../components/ExpenseList";
import IncomeList from "../components/IncomeList";
import MonthlyTrend from "../components/Charts/MonthlyTrend";
import CategoryBreakdown from "../components/Charts/CategoryBreakdown";

const Home = () => {
  return (
    <div className="page-container">
      <h1>Dashboard</h1>

      <div className="dashboard-grid">
        <div className="card">
          <h2>Monthly Spending</h2>
          <MonthlyTrend />
        </div>
        <div className="card">
          <h2>Category Breakdown</h2>
          <CategoryBreakdown />
        </div>
      </div>

      <ExpenseList />
      <IncomeList />
    </div>
  );
};

export default Home;