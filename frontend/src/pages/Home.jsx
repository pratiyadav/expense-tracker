import ExpenseList from "../components/ExpenseList";
import IncomeList from "../components/IncomeList";
import MonthlyTrend from "../components/Charts/MonthlyTrend";
import CategoryBreakdown from "../components/Charts/CategoryBreakdown";

const Home = () => {
  return (
    <div style={{ padding: "1rem" }}>
      <h1>Dashboard</h1>

      <section>
        <h2>Monthly Spending</h2>
        <MonthlyTrend />
      </section>

      <section>
        <h2>Category Breakdown</h2>
        <CategoryBreakdown />
      </section>

      <section>
        <ExpenseList />
      </section>

      <section>
        <IncomeList />
      </section>
    </div>
  );
};

export default Home;