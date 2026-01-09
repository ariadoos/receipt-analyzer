import * as React from "react";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import type { DateRange } from "react-day-picker";

function formatDate(date?: Date) {
  if (!date) return "";
  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

const now = new Date();

const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

const Filter = () => {
  const [open, setOpen] = React.useState(false);
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
    from: startOfMonth,
    to: endOfMonth,
  });

  const fromValue = formatDate(dateRange?.from);
  const toValue = formatDate(dateRange?.to);

  return (
    <div className="flex items-center gap-3 justify-center">
      <Label className="px-1">Viewing</Label>

      {/* FROM */}
      <div className="relative">
        <Input value={fromValue} placeholder="From date" className="bg-background pr-10" />
      </div>

      <span>to</span>

      {/* TO */}
      <div className="relative">
        <Input value={toValue} placeholder="To date" className="bg-background pr-10" />

        {/* Calendar Trigger */}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="ghost" className="absolute top-1/2 right-2 size-6 -translate-y-1/2">
              <CalendarIcon className="size-3.5" />
            </Button>
          </PopoverTrigger>

          <PopoverContent className="w-auto p-0" align="end">
            <Calendar mode="range" selected={dateRange} onSelect={setDateRange} numberOfMonths={2} />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default Filter;
