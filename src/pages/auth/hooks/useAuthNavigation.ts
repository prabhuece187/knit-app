import { useState, useCallback } from "react";

interface UseAuthNavigationProps<T extends string> {
  initialStep: T;
  steps: readonly T[];
}

interface UseAuthNavigationReturn<T extends string> {
  currentStep: T;
  currentStepIndex: number;
  isFirstStep: boolean;
  isLastStep: boolean;
  goToStep: (step: T) => void;
  goToNext: () => void;
  goToPrevious: () => void;
  goToFirst: () => void;
  goToLast: () => void;
  canGoNext: boolean;
  canGoPrevious: boolean;
}

/**
 * Generic hook for managing step-based navigation
 */
export function useAuthNavigation<T extends string>({
  initialStep,
  steps,
}: UseAuthNavigationProps<T>): UseAuthNavigationReturn<T> {
  const [currentStep, setCurrentStep] = useState<T>(initialStep);

  const currentStepIndex = steps.indexOf(currentStep);
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === steps.length - 1;
  const canGoNext = !isLastStep;
  const canGoPrevious = !isFirstStep;

  /**
   * Go to a specific step
   */
  const goToStep = useCallback(
    (step: T) => {
      if (steps.includes(step)) {
        setCurrentStep(step);
      }
    },
    [steps]
  );

  /**
   * Go to next step
   */
  const goToNext = useCallback(() => {
    if (canGoNext) {
      setCurrentStep(steps[currentStepIndex + 1]);
    }
  }, [canGoNext, currentStepIndex, steps]);

  /**
   * Go to previous step
   */
  const goToPrevious = useCallback(() => {
    if (canGoPrevious) {
      setCurrentStep(steps[currentStepIndex - 1]);
    }
  }, [canGoPrevious, currentStepIndex, steps]);

  /**
   * Go to first step
   */
  const goToFirst = useCallback(() => {
    setCurrentStep(steps[0]);
  }, [steps]);

  /**
   * Go to last step
   */
  const goToLast = useCallback(() => {
    setCurrentStep(steps[steps.length - 1]);
  }, [steps]);

  return {
    currentStep,
    currentStepIndex,
    isFirstStep,
    isLastStep,
    goToStep,
    goToNext,
    goToPrevious,
    goToFirst,
    goToLast,
    canGoNext,
    canGoPrevious,
  };
}
