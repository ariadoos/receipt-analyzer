import { Card } from "@/components/ui/card";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const dailyAverageData = [
  { day: "Mon", amount: 45 },
  { day: "Tue", amount: 78 },
  { day: "Wed", amount: 34 },
  { day: "Thu", amount: 92 },
  { day: "Fri", amount: 125 },
  { day: "Sat", amount: 156 },
  { day: "Sun", amount: 89 },
];

const DailyAverage = () => {
  return (
    <Card className="p-4">
      <h3 className="font-semibold mb-4">Daily Average</h3>
      <ResponsiveContainer width="100%" height={250}>
        <AreaChart data={dailyAverageData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" fontSize={12} />
          <YAxis />
          <Tooltip />
          <Area type="monotone" dataKey="amount" stroke="#8b5cf6" fill="#c4b5fd" />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default DailyAverage;
