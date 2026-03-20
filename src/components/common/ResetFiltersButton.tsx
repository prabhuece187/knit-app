import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type ResetFiltersButtonProps = {
  onReset: () => void;
  show?: boolean;
  resetLabel?: string;
  containerClassName?: string;
  buttonClassName?: string;
};

export default function ResetFiltersButton({
  onReset,
  show = true,
  resetLabel = "Reset",
  containerClassName,
  buttonClassName,
}: ResetFiltersButtonProps) {
  if (!show) return null;

  return (
    <div className={cn("flex items-center space-x-1", containerClassName)}>
      <Button
        variant="ghost"
        size="sm"
        onClick={onReset}
        className={cn("h-8 px-2 text-xs", buttonClassName)}
      >
        {resetLabel} <X className="h-3 w-3" />
      </Button>
    </div>
  );
}

