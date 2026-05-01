import { createApi } from "@reduxjs/toolkit/query/react";
import customFetchBase from "../../../api/CustomFetchBase";

// Define subscription types to match backend Prisma enum
export const SubscriptionType = {
  FREE_TRIAL: "FREE_TRIAL",
  NORMAL: "NORMAL",
  MONTHLY: "MONTHLY",
  QUARTERLY: "QUARTERLY",
  YEARLY: "YEARLY",
};

// Define request/response interfaces
export interface SubscriptionResponse {
  id: string;
  plan_id: string;
  customer_id: string;
  status: string;
  current_start: number | null;
  current_end: number | null;
  end_at: number | null;
  total_count: number;
  paid_count: number;
  remaining_count: number;
  customer_notify: {
    email: string;
    phone: string | null;
  };
  notes: Record<string, unknown>;
  payment_method?: string;
}

interface CreateSubscriptionRequest {
  userId: number;
  plan_id: string;
  period?: "monthly" | "quarterly" | "yearly"; // Optional for plan selection
  total_count?: number;
  quantity?: number;
  customer_notify?: number;
  notes?: Record<string, unknown>;
  notify_info?: {
    notify_email: string;
    notify_phone?: string;
  };
  addons?: Array<{
    item: {
      name: string;
      amount: number;
      currency: string;
    };
  }>;
}

interface SubscriptionFilters {
  count?: number;
  from?: number;
  to?: number;
  plan_id?: string;
  customer_id?: string;
  status?: string;
}

interface CancelSubscriptionRequest {
  cancel_at_cycle_end?: boolean;
}

interface PauseSubscriptionRequest {
  pause_at: "now" | "cycle";
}

interface ResumeSubscriptionRequest {
  resume_at: "now" | "cycle";
}

interface UpdateSubscriptionRequest {
  plan_id?: string;
  quantity?: number;
  remaining_count?: number;
  start_at?: number;
  expire_by?: number;
  customer_notify?: number;
  notes?: Record<string, unknown>;
}

interface PaymentVerificationRequest {
  razorpay_payment_id: string;
  razorpay_subscription_id?: string;
  razorpay_signature?: string;
}

interface PaymentVerificationResponse {
  status: string;
  paymentId: string;
}

export const subscriptionApi = createApi({
  reducerPath: "subscriptionApi",
  baseQuery: customFetchBase,
  tagTypes: ["Subscription", "Payment"],
  endpoints: (builder) => ({
    // Create a subscription
    createSubscription: builder.mutation<
      SubscriptionResponse,
      CreateSubscriptionRequest
    >({
      query: (args) => ({
        method: "POST",
        url: "razorpay/subscriptions",
        body: args,
      }),
      transformResponse: (response: {
        status: string;
        data: SubscriptionResponse;
      }) => response.data,
      invalidatesTags: ["Subscription"],
    }),

    // Get subscription details
    getSubscription: builder.query<SubscriptionResponse, string>({
      query: (subscriptionId) => ({
        method: "GET",
        url: `razorpay/subscriptions/${subscriptionId}`,
      }),
      transformResponse: (response: {
        status: string;
        data: SubscriptionResponse;
      }) => response.data,
      providesTags: ["Subscription"],
    }),

    // Get all subscriptions with filters
    getSubscriptions: builder.query<
      { items: SubscriptionResponse[] },
      SubscriptionFilters
    >({
      query: (filters) => ({
        method: "GET",
        url: "razorpay/subscriptions",
        params: filters,
      }),
      transformResponse: (response: {
        status: string;
        data: { items: SubscriptionResponse[] };
      }) => response.data,
      providesTags: ["Subscription"],
    }),

    // Cancel a subscription
    cancelSubscription: builder.mutation<
      SubscriptionResponse,
      { subscriptionId: string; data: CancelSubscriptionRequest }
    >({
      query: ({ subscriptionId, data }) => ({
        method: "PATCH",
        url: `razorpay/subscriptions/${subscriptionId}/cancel`,
        body: data,
      }),
      transformResponse: (response: {
        status: string;
        data: SubscriptionResponse;
      }) => response.data,
      invalidatesTags: ["Subscription"],
    }),

    // Pause a subscription
    pauseSubscription: builder.mutation<
      SubscriptionResponse,
      { subscriptionId: string; data: PauseSubscriptionRequest }
    >({
      query: ({ subscriptionId, data }) => ({
        method: "PATCH",
        url: `razorpay/subscriptions/${subscriptionId}/pause`,
        body: data,
      }),
      transformResponse: (response: {
        status: string;
        data: SubscriptionResponse;
      }) => response.data,
      invalidatesTags: ["Subscription"],
    }),

    // Resume a paused subscription
    resumeSubscription: builder.mutation<
      SubscriptionResponse,
      { subscriptionId: string; data: ResumeSubscriptionRequest }
    >({
      query: ({ subscriptionId, data }) => ({
        method: "PATCH",
        url: `razorpay/subscriptions/${subscriptionId}/resume`,
        body: data,
      }),
      transformResponse: (response: {
        status: string;
        data: SubscriptionResponse;
      }) => response.data,
      invalidatesTags: ["Subscription"],
    }),

    // Update a subscription
    updateSubscription: builder.mutation<
      SubscriptionResponse,
      { subscriptionId: string; data: UpdateSubscriptionRequest }
    >({
      query: ({ subscriptionId, data }) => ({
        method: "PATCH",
        url: `razorpay/subscriptions/${subscriptionId}`,
        body: data,
      }),
      transformResponse: (response: {
        status: string;
        data: SubscriptionResponse;
      }) => response.data,
      invalidatesTags: ["Subscription"],
    }),

    // Get subscription payments
    getSubscriptionPayments: builder.query<unknown, string>({
      query: (subscriptionId) => ({
        method: "GET",
        url: `razorpay/subscriptions/${subscriptionId}/payments`,
      }),
      transformResponse: (response: { status: string; data: unknown }) =>
        response.data,
      providesTags: ["Payment"],
    }),

    // Verify payment
    verifyPayment: builder.mutation<
      PaymentVerificationResponse,
      PaymentVerificationRequest
    >({
      query: (args) => ({
        method: "POST",
        url: "razorpay/verify",
        body: args,
      }),
      transformResponse: (response: {
        status: string;
        data: PaymentVerificationResponse;
      }) => response.data,
      invalidatesTags: ["Payment"],
    }),
  }),
});

export const {
  useCreateSubscriptionMutation,
  useGetSubscriptionQuery,
  useGetSubscriptionsQuery,
  useCancelSubscriptionMutation,
  usePauseSubscriptionMutation,
  useResumeSubscriptionMutation,
  useUpdateSubscriptionMutation,
  useGetSubscriptionPaymentsQuery,
  useVerifyPaymentMutation,
} = subscriptionApi;
