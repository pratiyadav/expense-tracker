import IncomeList from "../components/IncomeList";
import IncomeTrend from "../components/Charts/IncomeTrend";

const IncomePage = () => (
  <div className="page-container">
    <h1>Income</h1>
    <div className="card"><h2>Income Trend</h2><IncomeTrend /></div>
    <IncomeList />
  </div>
);

export default IncomePage;