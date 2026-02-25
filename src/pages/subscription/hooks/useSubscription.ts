import { useMemo } from "react";

import { getPlanById } from "../utils/helpers";
import { plans } from "../config/plans.config";
import type { UseSubscriptionResult } from "../types";
import { useAppSelector } from "@/store/hooks";
import { useGetSubscriptionQuery } from "@/api/subscriptionApi";

/**
 * Main hook for subscription data
 */
export const useSubscription = (): UseSubscriptionResult => {
  const { user } = useAppSelector((state) => state.auth);

  const {
    data: subscription,
    isLoading,
    error,
  } = useGetSubscriptionQuery(user?.subscriptionId || "", {
    skip: !user?.subscriptionId,
  });

  // Get current plan details
  const currentPlan = useMemo(() => {
    if (!subscription?.plan_id) return null;
    return getPlanById(plans, subscription.plan_id);
  }, [subscription?.plan_id]);

  // Only return subscription if it's manageable
  const activeSubscription = useMemo(() => {
    if (!subscription) return null;

    const manageableStatuses = ["active", "authenticated", "paused"];
    return manageableStatuses.includes(subscription.status)
      ? subscription
      : null;
  }, [subscription]);

  return {
    subscription: activeSubscription,
    currentPlan,
    isLoading,
    error: error as Error | null,
  };
};
