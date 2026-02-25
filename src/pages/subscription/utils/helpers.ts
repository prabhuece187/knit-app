import type {
  Plan,
  SubscriptionStatus,
  PaymentMethod,
  PlanPeriod,
} from "../types";
import {
  PERIOD_TO_TYPE_MAP,
  RESTRICTED_PAYMENT_METHODS,
  UPDATABLE_STATUSES,
} from "./constants";

/**
 * Get subscription type from plan period
 */
export const getSubscriptionType = (period: PlanPeriod): string => {
  return PERIOD_TO_TYPE_MAP[period];
};

/**
 * Check if payment method allows updates
 */
export const isPaymentMethodRestricted = (method?: PaymentMethod): boolean => {
  return method ? RESTRICTED_PAYMENT_METHODS.includes(method) : false;
};

/**
 * Check if subscription status allows updates
 */
export const isStatusUpdatable = (status: SubscriptionStatus): boolean => {
  return UPDATABLE_STATUSES.includes(status);
};

/**
 * Get plan by ID from plans object
 */
export const getPlanById = (
  plans: Record<string, Plan>,
  planId: string
): Plan | null => {
  return Object.values(plans).find((plan) => plan.id === planId) || null;
};

/**
 * Extract user name from email
 */
export const extractNameFromEmail = (email: string): string => {
  return email.split("@")[0];
};

/**
 * Check if subscription is active or authenticated
 */
export const isSubscriptionActive = (status: SubscriptionStatus): boolean => {
  return status === "active" || status === "authenticated";
};

/**
 * Check if subscription can be managed (not cancelled/completed)
 */
export const canManageSubscription = (status: SubscriptionStatus): boolean => {
  return status !== "cancelled" && status !== "completed";
};
