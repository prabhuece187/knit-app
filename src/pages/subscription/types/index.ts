import type { SubscriptionResponse } from "@/api/subscriptionApi";

// ============================================================================
// CORE DOMAIN TYPES
// ============================================================================

export interface Plan {
  id: string;
  name: string;
  price: number;
  duration: string;
  period: PlanPeriod;
  description: string;
  features: string[];
  color: string;
  textColor: string;
  borderColor: string;
}

export type PlanPeriod = "monthly" | "quarterly" | "yearly";

export type SubscriptionStatus =
  | "created"
  | "authenticated"
  | "active"
  | "paused"
  | "cancelled"
  | "completed"
  | "halted";

export type PaymentMethod = "card" | "upi" | "emandate" | "netbanking";

// ============================================================================
// API TYPES
// ============================================================================

// Import SubscriptionResponse from API layer to avoid duplication
export type { SubscriptionResponse } from "@/api/subscriptionApi";

export interface CreateSubscriptionRequest {
  userId: number;
  plan_id: string;
  period?: PlanPeriod;
  total_count?: number;
  quantity?: number;
  customer_notify?: number;
  notes?: Record<string, unknown>;
  notify_info?: {
    notify_email: string;
    notify_phone?: string;
  };
  addons?: SubscriptionAddon[];
}

export interface SubscriptionAddon {
  item: {
    name: string;
    amount: number;
    currency: string;
  };
}

export interface UpdateSubscriptionRequest {
  plan_id?: string;
  quantity?: number;
  remaining_count?: number;
  start_at?: number;
  expire_by?: number;
  customer_notify?: number;
  notes?: Record<string, unknown>;
}

export interface CancelSubscriptionRequest {
  cancel_at_cycle_end?: boolean;
}

export interface PauseSubscriptionRequest {
  pause_at: "now" | "cycle";
}

export interface ResumeSubscriptionRequest {
  resume_at: "now" | "cycle";
}

export interface PaymentVerificationRequest {
  razorpay_payment_id: string;
  subscription_id: string;
  razorpay_signature?: string;
  razorpay_subscription_id?: string;
}

export interface PaymentVerificationResponse {
  status: string;
  paymentId: string;
}

// ============================================================================
// RAZORPAY TYPES
// ============================================================================

export interface RazorpayOptions {
  key: string;
  subscription_id: string;
  name: string;
  description: string;
  currency: string;
  handler: (response: RazorpayPaymentResponse) => void | Promise<void>;
  prefill: {
    name: string;
    email: string;
    contact?: string;
  };
  theme: {
    color: string;
  };
  modal: {
    ondismiss: () => void;
  };
}

export interface RazorpayPaymentResponse {
  razorpay_payment_id: string;
  razorpay_subscription_id?: string;
  razorpay_signature?: string;
}

// ============================================================================
// UI STATE TYPES
// ============================================================================

export type SubscriptionView = "dashboard" | "plans";

export type ActionType = "cancel" | "pause" | "resume" | "update" | "create";

export interface ConfirmAction {
  type: ActionType;
  data?: unknown;
  message: string;
  onConfirm: () => void | Promise<void>;
}

// ============================================================================
// COMPONENT PROPS TYPES
// ============================================================================

export interface PlanCardProps {
  plan: Plan;
  isSelected: boolean;
  isCurrentPlan: boolean;
  onSelect: (planId: string) => void;
}

export interface SubscriptionStatsProps {
  subscription: SubscriptionResponse;
}

export interface StatusBadgeProps {
  status: SubscriptionStatus;
}

export interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "default" | "destructive" | "warning";
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

// ============================================================================
// HOOK RETURN TYPES
// ============================================================================

export interface UseSubscriptionResult {
  subscription: SubscriptionResponse | null;
  currentPlan: Plan | null;
  isLoading: boolean;
  error: Error | null;
}

// export interface UseSubscriptionActionsResult {
//   createSubscription: (request: CreateSubscriptionRequest) => Promise<void>;
//   updateSubscription: (planId: string) => Promise<void>;
//   cancelSubscription: (cancelAtEnd: boolean) => Promise<void>;
//   pauseSubscription: (pauseAt: "now" | "cycle") => Promise<void>;
//   resumeSubscription: (resumeAt: "now" | "cycle") => Promise<void>;
//   isProcessing: boolean;
// }

export interface UseSubscriptionActionsResult {
  createSubscription: (
    request: CreateSubscriptionRequest
  ) => Promise<SubscriptionResponse>;
  updateSubscription: (planId: string) => Promise<void>;
  cancelSubscription: (cancelAtEnd: boolean) => Promise<void>;
  pauseSubscription: (pauseAt: "now" | "cycle") => Promise<void>;
  resumeSubscription: (resumeAt: "now" | "cycle") => Promise<void>;
  isProcessing: boolean;
}

export interface UsePaymentResult {
  initiatePayment: (subscriptionId: string, plan: Plan) => Promise<void>;
  verifyPayment: (
    data: PaymentVerificationRequest
  ) => Promise<PaymentVerificationResponse>;
  isProcessing: boolean;
}

// ============================================================================
// VALIDATION TYPES
// ============================================================================

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export interface SubscriptionValidation {
  canUpdate: ValidationResult;
  canCancel: ValidationResult;
  canPause: ValidationResult;
  canResume: ValidationResult;
}
