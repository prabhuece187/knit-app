// src/features/subscription/services/validation.service.ts

import type {
  SubscriptionResponse,
  ValidationResult,
  SubscriptionValidation,
} from "../types";
import { isPaymentMethodRestricted, isStatusUpdatable } from "../utils/helpers";
import { ERROR_MESSAGES } from "../utils/constants";

/**
 * Validation service for subscription business rules
 */
export class SubscriptionValidationService {
  /**
   * Validate if subscription can be updated
   */
  static canUpdate(
    subscription: SubscriptionResponse | null,
    targetPlanId: string
  ): ValidationResult {
    if (!subscription) {
      return {
        isValid: false,
        error: ERROR_MESSAGES.NO_SUBSCRIPTION_ID,
      };
    }

    // Check if trying to update to same plan
    if (subscription.plan_id === targetPlanId) {
      return {
        isValid: false,
        error: ERROR_MESSAGES.SAME_PLAN,
      };
    }

    // Check status
    if (!isStatusUpdatable(subscription.status)) {
      return {
        isValid: false,
        error: ERROR_MESSAGES.INVALID_STATUS(subscription.status),
      };
    }

    // Check payment method
    if (isPaymentMethodRestricted(subscription.payment_method)) {
      return {
        isValid: false,
        error: ERROR_MESSAGES.RESTRICTED_PAYMENT_METHOD(
          subscription.payment_method || "unknown"
        ),
      };
    }

    return { isValid: true };
  }

  /**
   * Validate if subscription can be cancelled
   */
  static canCancel(
    subscription: SubscriptionResponse | null
  ): ValidationResult {
    if (!subscription) {
      return {
        isValid: false,
        error: ERROR_MESSAGES.NO_SUBSCRIPTION_ID,
      };
    }

    // Can cancel if active, authenticated, or paused
    if (
      subscription.status !== "active" &&
      subscription.status !== "authenticated" &&
      subscription.status !== "paused"
    ) {
      return {
        isValid: false,
        error: `Cannot cancel subscription in ${subscription.status} state.`,
      };
    }

    return { isValid: true };
  }

  /**
   * Validate if subscription can be paused
   */
  static canPause(subscription: SubscriptionResponse | null): ValidationResult {
    if (!subscription) {
      return {
        isValid: false,
        error: ERROR_MESSAGES.NO_SUBSCRIPTION_ID,
      };
    }

    // Can only pause active subscriptions
    if (subscription.status !== "active") {
      return {
        isValid: false,
        error: ERROR_MESSAGES.PAUSE_INVALID_STATUS(subscription.status),
      };
    }

    return { isValid: true };
  }

  /**
   * Validate if subscription can be resumed
   */
  static canResume(
    subscription: SubscriptionResponse | null
  ): ValidationResult {
    if (!subscription) {
      return {
        isValid: false,
        error: ERROR_MESSAGES.NO_SUBSCRIPTION_ID,
      };
    }

    // Can only resume paused subscriptions
    if (subscription.status !== "paused") {
      return {
        isValid: false,
        error: ERROR_MESSAGES.RESUME_INVALID_STATUS(subscription.status),
      };
    }

    return { isValid: true };
  }

  /**
   * Get all validation results for a subscription
   */
  static validateAll(
    subscription: SubscriptionResponse | null,
    targetPlanId?: string
  ): SubscriptionValidation {
    return {
      canUpdate: targetPlanId
        ? this.canUpdate(subscription, targetPlanId)
        : { isValid: false, error: "No target plan specified" },
      canCancel: this.canCancel(subscription),
      canPause: this.canPause(subscription),
      canResume: this.canResume(subscription),
    };
  }
}
