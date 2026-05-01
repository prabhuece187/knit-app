// src/features/subscription/hooks/useSubscriptionActions.ts

import { useCallback } from "react";
import { toast } from "sonner";
import {
  useCreateSubscriptionMutation,
  useUpdateSubscriptionMutation,
  useCancelSubscriptionMutation,
  usePauseSubscriptionMutation,
  useResumeSubscriptionMutation,
} from "../api/subscriptionApi";
import { useAppSelector, useAppDispatch } from "../../../store/Store";
import { updateUserSubscription } from "../../../slice/AuthSlice";
import { SubscriptionValidationService } from "../services/validation.service";
import { SubscriptionService } from "../services/subscription.service";
import { getPlanById } from "../utils/helpers";
import { plans } from "../config/plans.config";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../utils/constants";
import { useSubscription } from "./useSubscription";
import type {
  UseSubscriptionActionsResult,
  CreateSubscriptionRequest,
} from "../types";
import type { RootState } from "../../../store/Store";

/**
 * Hook for subscription CRUD operations
 */
export const useSubscriptionActions = (
  currentSubscription: ReturnType<typeof useSubscription>["subscription"]
): UseSubscriptionActionsResult => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state: RootState) => state.auth);

  const [createMutation, { isLoading: isCreating }] =
    useCreateSubscriptionMutation();
  const [updateMutation, { isLoading: isUpdating }] =
    useUpdateSubscriptionMutation();
  const [cancelMutation, { isLoading: isCancelling }] =
    useCancelSubscriptionMutation();
  const [pauseMutation, { isLoading: isPausing }] =
    usePauseSubscriptionMutation();
  const [resumeMutation, { isLoading: isResuming }] =
    useResumeSubscriptionMutation();

  const isProcessing =
    isCreating || isUpdating || isCancelling || isPausing || isResuming;

  /**
   * Create new subscription
   */
  const createSubscription = useCallback(
    async (request: CreateSubscriptionRequest) => {
      try {
        const result = await createMutation(request).unwrap();
        return result;
      } catch (error) {
        console.error("Error creating subscription:", error);
        toast.error(ERROR_MESSAGES.SUBSCRIPTION_CREATION_FAILED);
        throw error;
      }
    },
    [createMutation]
  );

  /**
   * Update subscription plan
   */
  const updateSubscription = useCallback(
    async (planId: string) => {
      if (!user?.subscriptionId) {
        toast.error(ERROR_MESSAGES.NO_SUBSCRIPTION_ID);
        return;
      }

      // Validate update
      const validation = SubscriptionValidationService.canUpdate(
        currentSubscription,
        planId
      );

      if (!validation.isValid) {
        toast.error(validation.error);
        return;
      }

      // Get target plan
      const targetPlan = getPlanById(plans, planId);
      if (!targetPlan) {
        toast.error(ERROR_MESSAGES.PLAN_NOT_FOUND);
        return;
      }

      try {
        const updateData = SubscriptionService.buildUpdateRequest(
          targetPlan,
          currentSubscription?.notes
        );

        await updateMutation({
          subscriptionId: user.subscriptionId,
          data: updateData,
        }).unwrap();

        // Update Redux store
        dispatch(
          updateUserSubscription({
            subscriptionId: user.subscriptionId,
            subscriptionType: SubscriptionService.getSubscriptionTypeForUpdate(
              targetPlan.period
            ),
            subscriptionStatus: "Active",
          })
        );

        toast.success(SUCCESS_MESSAGES.UPDATE_SCHEDULED(targetPlan.name));
      } catch (error) {
        console.error("Error updating subscription:", error);

        // Handle specific errors
        const errorMessage = (error as any)?.data?.message;
        if (errorMessage) {
          if (
            errorMessage.includes("UPI") ||
            errorMessage.includes("Emandate")
          ) {
            toast.error(
              ERROR_MESSAGES.RESTRICTED_PAYMENT_METHOD("UPI/Emandate")
            );
          } else if (
            errorMessage.includes("not in Authenticated or Active state")
          ) {
            toast.error(
              ERROR_MESSAGES.INVALID_STATUS(
                currentSubscription?.status || "unknown"
              )
            );
          } else {
            toast.error(`Failed to update: ${errorMessage}`);
          }
        } else {
          toast.error("Failed to update subscription. Please try again.");
        }
        throw error;
      }
    },
    [user, currentSubscription, updateMutation, dispatch]
  );

  /**
   * Cancel subscription
   */
  const cancelSubscription = useCallback(
    async (cancelAtEnd: boolean = true) => {
      if (!user?.subscriptionId) {
        toast.error(ERROR_MESSAGES.NO_SUBSCRIPTION_ID);
        return;
      }

      // Validate cancellation
      const validation =
        SubscriptionValidationService.canCancel(currentSubscription);
      if (!validation.isValid) {
        toast.error(validation.error);
        return;
      }

      try {
        await cancelMutation({
          subscriptionId: user.subscriptionId,
          data: { cancel_at_cycle_end: cancelAtEnd },
        }).unwrap();

        // Update Redux store
        dispatch(
          updateUserSubscription({
            subscriptionId: null,
            subscriptionType: null,
            subscriptionStatus: "Cancelled",
          })
        );

        toast.success(
          cancelAtEnd
            ? SUCCESS_MESSAGES.CANCEL_AT_CYCLE_END
            : SUCCESS_MESSAGES.CANCEL_IMMEDIATE
        );
      } catch (error) {
        console.error("Error cancelling subscription:", error);
        toast.error("Failed to cancel subscription. Please try again.");
        throw error;
      }
    },
    [user, currentSubscription, cancelMutation, dispatch]
  );

  /**
   * Pause subscription
   */
  const pauseSubscription = useCallback(
    async (pauseAt: "now" | "cycle" = "now") => {
      if (!user?.subscriptionId) {
        toast.error(ERROR_MESSAGES.NO_SUBSCRIPTION_ID);
        return;
      }

      // Validate pause
      const validation =
        SubscriptionValidationService.canPause(currentSubscription);
      if (!validation.isValid) {
        toast.error(validation.error);
        return;
      }

      try {
        await pauseMutation({
          subscriptionId: user.subscriptionId,
          data: { pause_at: pauseAt },
        }).unwrap();

        // Update Redux store
        dispatch(
          updateUserSubscription({
            subscriptionId: user.subscriptionId,
            subscriptionType: user.subscriptionType,
            subscriptionStatus: "Paused",
          })
        );

        toast.success(
          pauseAt === "now"
            ? SUCCESS_MESSAGES.PAUSE_NOW
            : SUCCESS_MESSAGES.PAUSE_AT_CYCLE
        );
      } catch (error) {
        console.error("Error pausing subscription:", error);
        toast.error("Failed to pause subscription. Please try again.");
        throw error;
      }
    },
    [user, currentSubscription, pauseMutation, dispatch]
  );

  /**
   * Resume subscription
   */
  const resumeSubscription = useCallback(
    async (resumeAt: "now" | "cycle" = "now") => {
      if (!user?.subscriptionId) {
        toast.error(ERROR_MESSAGES.NO_SUBSCRIPTION_ID);
        return;
      }

      // Validate resume
      const validation =
        SubscriptionValidationService.canResume(currentSubscription);
      if (!validation.isValid) {
        toast.error(validation.error);
        return;
      }

      try {
        await resumeMutation({
          subscriptionId: user.subscriptionId,
          data: { resume_at: resumeAt },
        }).unwrap();

        // Update Redux store
        dispatch(
          updateUserSubscription({
            subscriptionId: user.subscriptionId,
            subscriptionType: user.subscriptionType,
            subscriptionStatus: "Active",
          })
        );

        toast.success(
          resumeAt === "now"
            ? SUCCESS_MESSAGES.RESUME_NOW
            : SUCCESS_MESSAGES.RESUME_AT_CYCLE
        );
      } catch (error) {
        console.error("Error resuming subscription:", error);
        toast.error("Failed to resume subscription. Please try again.");
        throw error;
      }
    },
    [user, currentSubscription, resumeMutation, dispatch]
  );

  return {
    createSubscription,
    updateSubscription,
    cancelSubscription,
    pauseSubscription,
    resumeSubscription,
    isProcessing,
  };
};
