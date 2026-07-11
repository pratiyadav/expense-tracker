import ExpenseList from "../components/ExpenseList";
import MonthlyTrend from "../components/Charts/MonthlyTrend";

const ExpensePage = () => (
  <div className="page-container">
    <h1>Expenses</h1>
    <div className="card"><h2>Spending Trend</h2><MonthlyTrend /></div>
    <ExpenseList />
  </div>
);

export default ExpensePage;