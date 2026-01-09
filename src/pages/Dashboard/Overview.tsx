import { Card } from "@/components/ui/card";

const Overview = () => {
  return (
    <Card className="p-4">
      <div className="flex justify-between items-center mb-4">
        <div>
          <div className="text-sm text-muted-foreground mb-1">Total Budget</div>
          <div className="text-3xl font-bold">$2,000</div>
        </div>
        <div>
          <div className="text-sm text-muted-foreground mb-1">Spent</div>
          <div className="text-3xl font-bold text-red-600">$1,240</div>
        </div>
        <div>
          <div className="text-sm text-muted-foreground mb-1">Remaining</div>
          <div className="text-3xl font-bold text-green-600">$760</div>
        </div>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-4">
        <div className="bg-chart-2 h-4 rounded-full" style={{ width: "62%" }}></div>
      </div>
    </Card>
  );
};

export default Overview;
