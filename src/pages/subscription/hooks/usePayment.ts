import { useCallback } from "react";
import { toast } from "sonner";
import { useVerifyPaymentMutation } from "../api/subscriptionApi";
import { useAppSelector, useAppDispatch } from "../../../store/Store";
import { updateUserSubscription } from "../../../slice/AuthSlice";
import { RazorpayService } from "../services/razorpay.service";
import { SubscriptionService } from "../services/subscription.service";
import { razorpayKey } from "../config/plans.config";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../utils/constants";
import type { UsePaymentResult, Plan, RazorpayPaymentResponse } from "../types";
import type { RootState } from "../../../store/Store";

/**
 * Hook for payment operations
 */
export const usePayment = (): UsePaymentResult => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state: RootState) => state.auth);
  const [verifyMutation, { isLoading: isVerifying }] =
    useVerifyPaymentMutation();

  const razorpayService = new RazorpayService(razorpayKey);

  /**
   * Verify payment with backend
   */
  const verifyPayment = useCallback(
    async (data: {
      razorpay_payment_id: string;
      subscription_id: string;
      razorpay_signature?: string;
      razorpay_subscription_id?: string;
    }) => {
      try {
        const result = await verifyMutation(data).unwrap();
        return result;
      } catch (error) {
        console.error("Payment verification error:", error);
        toast.error(ERROR_MESSAGES.PAYMENT_VERIFICATION_FAILED);
        throw error;
      }
    },
    [verifyMutation]
  );

  /**
   * Initiate payment flow
   */
  const initiatePayment = useCallback(
    async (subscriptionId: string, plan: Plan) => {
      if (!user) {
        toast.error("User not found. Please login again.");
        return;
      }

      const handleSuccess = async (response: RazorpayPaymentResponse) => {
        try {
          const verificationData = {
            razorpay_payment_id: response.razorpay_payment_id,
            subscription_id: subscriptionId,
            razorpay_signature: response.razorpay_signature,
            razorpay_subscription_id: response.razorpay_subscription_id,
          };

          await verifyPayment(verificationData);

          // Update Redux store
          dispatch(
            updateUserSubscription({
              subscriptionId,
              subscriptionType:
                SubscriptionService.getSubscriptionTypeForUpdate(plan.period),
              subscriptionStatus: "Active",
            })
          );

          toast.success(
            SUCCESS_MESSAGES.PAYMENT_SUCCESS(response.razorpay_payment_id)
          );

          // Redirect to success page
          window.location.href = "/subscription/success";
        } catch (error) {
          console.error("Error verifying payment:", error);
          // Error already handled in verifyPayment
        }
      };

      const handleDismiss = () => {
        toast.info("Payment cancelled. You can try again anytime.");
      };

      try {
        razorpayService.openCheckout(
          subscriptionId,
          plan,
          { email: user.email, name: user.firstName },
          handleSuccess,
          handleDismiss
        );
      } catch (error) {
        console.error("Error launching payment:", error);
        const message =
          error instanceof Error
            ? error.message
            : "Failed to launch payment. Please try again.";
        toast.error(message);
      }
    },
    [user, razorpayService, verifyPayment, dispatch]
  );

  return {
    initiatePayment,
    verifyPayment,
    isProcessing: isVerifying,
  };
};
