import { Card } from "@/components/ui/card";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const trendData = [
  { date: "Dec 1", Food: 45, Transport: 30, Entertainment: 0, Bills: 60 },
  { date: "Dec 5", Food: 120, Transport: 50, Entertainment: 32, Bills: 0 },
  { date: "Dec 10", Food: 180, Transport: 90, Entertainment: 80, Bills: 110 },
  { date: "Dec 15", Food: 280, Transport: 140, Entertainment: 120, Bills: 220 },
  { date: "Dec 20", Food: 380, Transport: 210, Entertainment: 150, Bills: 280 },
  { date: "Dec 25", Food: 450, Transport: 280, Entertainment: 180, Bills: 330 },
];

const SpendingTrend = () => {
  return (
    <Card className="p-4">
      <h3 className="font-semibold mb-4">Spending Trend</h3>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={trendData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" fontSize={12} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="Food" stroke="#ef4444" strokeWidth={2} />
          <Line type="monotone" dataKey="Transport" stroke="#3b82f6" strokeWidth={2} />
          <Line type="monotone" dataKey="Entertainment" stroke="#a855f7" strokeWidth={2} />
          <Line type="monotone" dataKey="Bills" stroke="#22c55e" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default SpendingTrend;
