import { Card } from "@/components/ui/card";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const BudgetActualBarChart = ({
  categories,
}: {
  categories: {
    name: string;
    spent: number;
    budget: number;
    color: string;
  }[];
}) => {
  return (
    <Card className="p-4">
      <h3 className="font-semibold mb-4">Budget vs Actual</h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={categories}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} fontSize={12} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="budget" fill="#94a3b8" name="Budget" />
          <Bar dataKey="spent" fill="#3b82f6" name="Spent" />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default BudgetActualBarChart;
