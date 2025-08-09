"use client";

import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import type { DateRange } from "react-day-picker";

const presets = [
  { label: "Today", getRange: () => ({ from: new Date(), to: new Date() }) },
  {
    label: "Yesterday",
    getRange: () => {
      const y = new Date();
      y.setDate(y.getDate() - 1);
      return { from: y, to: y };
    },
  },
  {
    label: "Last 7 Days",
    getRange: () => {
      const to = new Date();
      const from = new Date();
      from.setDate(to.getDate() - 6);
      return { from, to };
    },
  },
  {
    label: "This Week",
    getRange: () => {
      const now = new Date();
      const from = new Date(now);
      from.setDate(now.getDate() - now.getDay());
      return { from, to: now };
    },
  },
  {
    label: "Last Week",
    getRange: () => {
      const now = new Date();
      const to = new Date(now);
      to.setDate(now.getDate() - now.getDay() - 1);
      const from = new Date(to);
      from.setDate(to.getDate() - 6);
      return { from, to };
    },
  },
  {
    label: "This Month",
    getRange: () => {
      const now = new Date();
      const from = new Date(now.getFullYear(), now.getMonth(), 1);
      return { from, to: now };
    },
  },
  {
    label: "Previous Month",
    getRange: () => {
      const now = new Date();
      const from = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const to = new Date(now.getFullYear(), now.getMonth(), 0);
      return { from, to };
    },
  },
  {
    label: "Current Fiscal Year",
    getRange: () => {
      const now = new Date();
      const fyStart = new Date(now.getFullYear(), 3, 1); // April 1
      if (now < fyStart) fyStart.setFullYear(fyStart.getFullYear() - 1);
      return { from: fyStart, to: now };
    },
  },
  {
    label: "Previous Fiscal Year",
    getRange: () => {
      const now = new Date();
      const fyStart = new Date(now.getFullYear(), 3, 1);
      if (now < fyStart) fyStart.setFullYear(fyStart.getFullYear() - 1);
      const prevStart = new Date(fyStart);
      prevStart.setFullYear(prevStart.getFullYear() - 1);
      const prevEnd = new Date(fyStart);
      prevEnd.setDate(prevEnd.getDate() - 1);
      return { from: prevStart, to: prevEnd };
    },
  },
  {
    label: "Last 365 Days",
    getRange: () => {
      const to = new Date();
      const from = new Date();
      from.setDate(to.getDate() - 364);
      return { from, to };
    },
  },
];

export default function DateRangePicker({
  className,
  value,
  onChange,
}: {
  className?: string;
  value?: DateRange;
  onChange?: (range: DateRange | undefined) => void;
}) {
  const today = new Date();
  const defaultTodayRange: DateRange = { from: today, to: today };

  const [open, setOpen] = React.useState(false);
  const [showCalendar, setShowCalendar] = React.useState(false);
  const [tempRange, setTempRange] = React.useState<DateRange | undefined>(
    value ?? defaultTodayRange
  );

  // Set initial value on mount if not provided
  React.useEffect(() => {
    if (!value && onChange) {
      onChange(defaultTodayRange);
    }
  }, []);

  // Update tempRange when value changes
  React.useEffect(() => {
    if (value) setTempRange(value);
  }, [value]);

  const handleConfirm = () => {
    if (tempRange?.from && tempRange?.to) {
      onChange?.(tempRange);
      setOpen(false);
      setShowCalendar(false);
    }
  };

  const handleBack = () => {
    setShowCalendar(false);
  };

  const renderLabel = () => {
    const current = value ?? defaultTodayRange;
    if (current?.from && current?.to) {
      return `${format(current.from, "LLL dd, y")} - ${format(
        current.to,
        "LLL dd, y"
      )}`;
    }
    return showCalendar ? "Custom Date Range" : "Pick a date range";
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal text-xs",
              !value && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {renderLabel()}
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-80 p-2" align="start">
          {!showCalendar ? (
            <div className="space-y-2">
              {presets.map((preset) => (
                <Button
                  key={preset.label}
                  variant="ghost"
                  className="w-full justify-start mb-0"
                  onClick={() => {
                    const selected = preset.getRange();
                    onChange?.(selected);
                    setOpen(false);
                  }}
                >
                  {preset.label}
                </Button>
              ))}
              <Button
                variant="outline"
                className="w-full mt-2 text-center"
                onClick={() => {
                  setTempRange(undefined);
                  setShowCalendar(true);
                }}
              >
                Custom Date Range
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-medium text-muted-foreground pb-2">
                <div className="text-left">
                  <div className="text-primary font-semibold">
                    {tempRange?.from
                      ? format(tempRange.from, "dd MMM yyyy")
                      : "Select Start Date"}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-primary font-semibold">
                    {tempRange?.from && !tempRange?.to
                      ? "Select End Date"
                      : tempRange?.to
                      ? format(tempRange.to, "dd MMM yyyy")
                      : "End Date"}
                  </div>
                </div>
              </div>
              <div className="flex justify-center items-center">
                <Calendar
                  initialFocus
                  mode="range"
                  selected={undefined}
                  defaultMonth={tempRange?.from}
                  onDayClick={(selectedDate) => {
                    if (!selectedDate) return;

                    if (
                      !tempRange?.from ||
                      (tempRange?.from && tempRange?.to)
                    ) {
                      setTempRange({ from: selectedDate, to: undefined });
                    } else if (selectedDate < tempRange.from) {
                      setTempRange({ from: selectedDate, to: undefined });
                    } else {
                      setTempRange({ from: tempRange.from, to: selectedDate });
                    }
                  }}
                  modifiers={{
                    range_start: tempRange?.from,
                    range_end: tempRange?.to,
                    range_middle:
                      tempRange?.from && tempRange?.to
                        ? { from: tempRange.from, to: tempRange.to }
                        : undefined,
                  }}
                  modifiersClassNames={{
                    range_start: "bg-violet-600 text-white",
                    range_end: "bg-violet-600 text-white",
                    range_middle: "bg-violet-100 text-violet-900",
                  }}
                  className="rdb"
                />
              </div>
              <div className="flex justify-between gap-2 pt-4">
                <Button onClick={handleBack}>Back</Button>
                <Button
                  onClick={handleConfirm}
                  disabled={!tempRange?.from || !tempRange?.to}
                >
                  OK
                </Button>
              </div>
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
}
