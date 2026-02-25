import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface StepNavigationProps {
  onBack?: () => void;
  onNext?: () => void;
  backLabel?: string;
  nextLabel?: string;
  isLoading?: boolean;
  isNextDisabled?: boolean;
  isBackDisabled?: boolean;
  showBack?: boolean;
  showNext?: boolean;
  className?: string;
}

export default function StepNavigation({
  onBack,
  onNext,
  backLabel = "Back",
  nextLabel = "Next",
  isLoading = false,
  isNextDisabled = false,
  isBackDisabled = false,
  showBack = true,
  showNext = true,
  className,
}: StepNavigationProps) {
  return (
    <div className={cn("flex justify-between", className)}>
      {showBack && onBack ? (
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          disabled={isBackDisabled || isLoading}
          className="flex items-center"
        >
          ← {backLabel}
        </Button>
      ) : (
        <div />
      )}

      {showNext && onNext && (
        <Button
          type="button"
          onClick={onNext}
          disabled={isNextDisabled || isLoading}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {nextLabel}
        </Button>
      )}
    </div>
  );
}
