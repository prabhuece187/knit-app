import type { RazorpayOptions, RazorpayPaymentResponse, Plan } from "../types";
import { RAZORPAY_CONFIG, ERROR_MESSAGES } from "../utils/constants";
import { extractNameFromEmail } from "../utils/helpers";

declare global {
  interface Window {
    Razorpay: {
      new (options: RazorpayOptions): {
        open: () => void;
        close: () => void;
      };
    };
  }
}

/**
 * Razorpay payment service
 */
export class RazorpayService {
  private razorpayKey: string;

  constructor(razorpayKey: string) {
    this.razorpayKey = razorpayKey;
  }

  /**
   * Check if Razorpay is loaded
   */
  isLoaded(): boolean {
    return typeof window !== "undefined" && !!window.Razorpay;
  }

  /**
   * Open Razorpay checkout
   */
  openCheckout(
    subscriptionId: string,
    plan: Plan,
    user: { email: string; name?: string },
    onSuccess: (response: RazorpayPaymentResponse) => void | Promise<void>,
    onDismiss: () => void
  ): void {
    if (!this.isLoaded()) {
      throw new Error(ERROR_MESSAGES.RAZORPAY_NOT_LOADED);
    }

    const options: RazorpayOptions = {
      key: this.razorpayKey,
      subscription_id: subscriptionId,
      name: RAZORPAY_CONFIG.BRAND_NAME,
      description: `${plan.name} - ${plan.description}`,
      currency: RAZORPAY_CONFIG.CURRENCY,
      handler: onSuccess,
      prefill: {
        name: user.name || extractNameFromEmail(user.email),
        email: user.email,
        contact: RAZORPAY_CONFIG.DEFAULT_CONTACT,
      },
      theme: {
        color: RAZORPAY_CONFIG.THEME_COLOR,
      },
      modal: {
        ondismiss: onDismiss,
      },
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  }
}
