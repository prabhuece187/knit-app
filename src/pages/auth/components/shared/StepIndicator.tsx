import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step {
  id: string;
  label: string;
  icon?: LucideIcon;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStepId: string;
  completedStepIds?: string[];
  className?: string;
}

export default function StepIndicator({
  steps,
  currentStepId,
  completedStepIds = [],
  className,
}: StepIndicatorProps) {
  const currentIndex = steps.findIndex((step) => step.id === currentStepId);

  return (
    <div
      className={cn(
        "flex items-center justify-center space-x-4 mb-6",
        className
      )}
    >
      {steps.map((step, index) => {
        const isActive = step.id === currentStepId;
        const isCompleted = completedStepIds.includes(step.id);
        const isPast = index < currentIndex;
        const Icon = step.icon;

        return (
          <div key={step.id} className="flex items-center">
            {/* Step Circle */}
            <div
              className={cn(
                "flex items-center space-x-2",
                isActive && "text-blue-600",
                (isCompleted || isPast) && "text-green-600",
                !isActive && !isCompleted && !isPast && "text-gray-400"
              )}
            >
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center transition-colors",
                  isActive && "bg-blue-600 text-white",
                  (isCompleted || isPast) && "bg-green-600 text-white",
                  !isActive && !isCompleted && !isPast && "bg-gray-200"
                )}
              >
                {Icon ? (
                  <Icon className="w-4 h-4" />
                ) : (
                  <span className="text-sm font-medium">{index + 1}</span>
                )}
              </div>
              <span className="text-sm font-medium hidden sm:inline">
                {step.label}
              </span>
            </div>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "w-8 h-0.5 mx-2",
                  isPast || isCompleted ? "bg-green-600" : "bg-gray-200"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
