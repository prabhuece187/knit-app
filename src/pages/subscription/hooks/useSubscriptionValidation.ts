import { useMemo } from "react";
import { SubscriptionValidationService } from "../services/validation.service";
import type { SubscriptionResponse, SubscriptionValidation } from "../types";

/**
 * Hook for subscription validation
 */
export const useSubscriptionValidation = (
  subscription: SubscriptionResponse | null,
  targetPlanId?: string
): SubscriptionValidation => {
  return useMemo(() => {
    return SubscriptionValidationService.validateAll(
      subscription,
      targetPlanId
    );
  }, [subscription, targetPlanId]);
};
