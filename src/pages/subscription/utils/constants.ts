import type { SubscriptionStatus, PaymentMethod, PlanPeriod } from "../types";

// ============================================================================
// SUBSCRIPTION CONSTANTS
// ============================================================================

export const SUBSCRIPTION_STATUS: Record<string, SubscriptionStatus> = {
  CREATED: "created",
  AUTHENTICATED: "authenticated",
  ACTIVE: "active",
  PAUSED: "paused",
  CANCELLED: "cancelled",
  COMPLETED: "completed",
  HALTED: "halted",
} as const;

export const PAYMENT_METHODS: Record<string, PaymentMethod> = {
  CARD: "card",
  UPI: "upi",
  EMANDATE: "emandate",
  NETBANKING: "netbanking",
} as const;

export const PLAN_PERIODS: Record<string, PlanPeriod> = {
  MONTHLY: "monthly",
  QUARTERLY: "quarterly",
  YEARLY: "yearly",
} as const;

// ============================================================================
// RESTRICTED PAYMENT METHODS
// ============================================================================

export const RESTRICTED_PAYMENT_METHODS: PaymentMethod[] = ["upi", "emandate"];

// ============================================================================
// UPDATABLE STATUS STATES
// ============================================================================

export const UPDATABLE_STATUSES: SubscriptionStatus[] = [
  "active",
  "authenticated",
];

// ============================================================================
// ERROR MESSAGES
// ============================================================================

export const ERROR_MESSAGES = {
  SAME_PLAN: "You are already subscribed to this plan.",
  INVALID_STATUS: (status: string) =>
    `Subscription cannot be updated when it's in "${status}" state. Please ensure your subscription is active or authenticated.`,
  RESTRICTED_PAYMENT_METHOD: (method: string) =>
    `Subscription updates are not available for ${method.toUpperCase()} payment methods. Please contact support for assistance with plan changes.`,
  PAUSE_INVALID_STATUS: (status: string) =>
    `Subscription can only be paused when it's in active state. Your subscription is currently in ${status} state.`,
  RESUME_INVALID_STATUS: (status: string) =>
    `Subscription can only be resumed when it's in paused state. Your subscription is currently in ${status} state.`,
  PAYMENT_VERIFICATION_FAILED:
    "Payment received but verification failed. Your subscription will be activated shortly. Please contact support if issues persist.",
  SUBSCRIPTION_CREATION_FAILED:
    "Failed to create subscription. Please try again.",
  RAZORPAY_NOT_LOADED:
    "Payment gateway not loaded. Please refresh the page and try again.",
  PLAN_NOT_FOUND: "Selected plan not found.",
  NO_SUBSCRIPTION_ID:
    "No subscription found. Please create a subscription first.",
} as const;

// ============================================================================
// SUCCESS MESSAGES
// ============================================================================

export const SUCCESS_MESSAGES = {
  PAYMENT_SUCCESS: (paymentId: string) =>
    `Payment successful! Your subscription is now active. Payment ID: ${paymentId}`,
  UPDATE_SCHEDULED: (planName: string) =>
    `Subscription update scheduled successfully! Your plan will change to ${planName} at the end of your current billing cycle.`,
  CANCEL_AT_CYCLE_END:
    "Subscription cancelled successfully! Your subscription will end at the end of your current billing cycle.",
  CANCEL_IMMEDIATE:
    "Subscription cancelled immediately! Your subscription has been terminated.",
  PAUSE_NOW:
    "Subscription paused successfully! Your subscription is now paused and no further charges will be made.",
  PAUSE_AT_CYCLE:
    "Subscription pause scheduled successfully! Your subscription will be paused at the end of the current billing cycle.",
  RESUME_NOW:
    "Subscription resumed successfully! Your subscription is now active and billing will resume.",
  RESUME_AT_CYCLE:
    "Subscription resume scheduled successfully! Your subscription will be resumed at the end of the current billing cycle.",
} as const;

// ============================================================================
// RAZORPAY CONFIGURATION
// ============================================================================

export const RAZORPAY_CONFIG = {
  BRAND_NAME: "Professional Directory",
  THEME_COLOR: "#8B5CF6",
  CURRENCY: "INR",
  DEFAULT_CONTACT: "9988998899",
} as const;

// ============================================================================
// SUBSCRIPTION TYPE MAPPING
// ============================================================================

export const PERIOD_TO_TYPE_MAP: Record<PlanPeriod, string> = {
  monthly: "MONTHLY",
  quarterly: "QUARTERLY",
  yearly: "YEARLY",
};

// ============================================================================
// RAZORPAY CONFIGURATION
// ============================================================================

export const STATE_TYPE_FILTERS = {
  STATE: "STATE",
  UNION_TERRITORY: "UNION_TERRITORY",
} as const;
