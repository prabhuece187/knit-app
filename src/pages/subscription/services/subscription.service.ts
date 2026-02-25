import type {
  Plan,
  CreateSubscriptionRequest,
  UpdateSubscriptionRequest,
  PlanPeriod,
} from "../types";
import { getSubscriptionType } from "../utils/helpers";

/**
 * Subscription business logic service
 */
export class SubscriptionService {
  /**
   * Build create subscription request
   */
  static buildCreateRequest(
    userId: number,
    plan: Plan,
    userEmail: string
  ): CreateSubscriptionRequest {
    return {
      userId,
      plan_id: plan.id,
      period: plan.period,
      total_count: this.getTotalCount(plan.period),
      notify_info: {
        notify_email: userEmail,
        notify_phone: undefined,
      },
      addons: [
        {
          item: {
            name: "Initial account creation",
            amount: 3000,
            currency: "INR",
          },
        },
      ],
      notes: {
        plan_name: plan.name,
        plan_price: plan.price,
        plan_duration: plan.duration,
      },
    };
  }

  /**
   * Build update subscription request
   */
  static buildUpdateRequest(
    plan: Plan,
    currentNotes?: Record<string, unknown>
  ): UpdateSubscriptionRequest {
    return {
      plan_id: plan.id,
      customer_notify: 1,
      notes: {
        ...currentNotes,
        plan_name: plan.name,
        plan_price: plan.price,
        plan_duration: plan.duration,
        updated_at: new Date().toISOString(),
      },
    };
  }

  /**
   * Get total count based on period
   */
  private static getTotalCount(period: PlanPeriod): number {
    switch (period) {
      case "monthly":
        return 12;
      case "quarterly":
        return 4;
      case "yearly":
        return 1;
      default:
        return 12;
    }
  }

  /**
   * Get subscription type for Redux update
   */
  static getSubscriptionTypeForUpdate(period: PlanPeriod): string {
    return getSubscriptionType(period);
  }
}
