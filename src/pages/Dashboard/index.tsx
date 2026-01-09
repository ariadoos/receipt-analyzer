import BudgetActualBarChart from "./BudgetActualBarChart";
import CategoriesPieChart from "./CategoriesPieChart";
import DailyAverage from "./DailyAverage";
import Filter from "./Filter";
import Overview from "./Overview";
import SpendingTrend from "./SpendingTrend";

const Dashboard = () => {
  const categories = [
    { name: "Food", spent: 450, budget: 600, color: "#ef4444" },
    { name: "Transport", spent: 280, budget: 400, color: "#3b82f6" },
    { name: "Entertainment", spent: 180, budget: 300, color: "#a855f7" },
    { name: "Bills", spent: 330, budget: 500, color: "#22c55e" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-row justify-end">
        <Filter></Filter>
      </div>

      <Overview />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CategoriesPieChart categories={categories}></CategoriesPieChart>

        <BudgetActualBarChart categories={categories}></BudgetActualBarChart>

        <SpendingTrend></SpendingTrend>

        <DailyAverage></DailyAverage>
      </div>
    </div>
  );
};

export default Dashboard;
