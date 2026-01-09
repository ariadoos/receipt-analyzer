import { Card } from "@/components/ui/card";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const CategoriesPieChart = ({
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
      <h3 className="font-semibold mb-4">Spending by Category</h3>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={categories}
            dataKey="spent"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            label={({ name, value }) => `${name}: $${value}`}
          >
            {categories.map((e, i) => (
              <Cell key={i} fill={e.color} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default CategoriesPieChart;
