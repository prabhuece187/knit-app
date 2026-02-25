import type { Plan } from "../types";

export const plans: Record<string, Plan> = {
  monthly: {
    id: import.meta.env.VITE_RAZORPAY_MONTHLY_PLAN_ID as string,
    name: "Monthly Plan",
    price: 200,
    duration: "Monthly",
    period: "monthly",
    description: "Flexible monthly billing for short-term access",
    features: [
      "Full platform access",
      "Priority support",
      "Basic analytics",
      "Appointment scheduling",
    ],
    color: "bg-blue-500",
    textColor: "text-blue-600",
    borderColor: "border-blue-200",
  },
  quarterly: {
    id: import.meta.env.VITE_RAZORPAY_QUARTERLY_PLAN_ID as string,
    name: "Quarterly Plan",
    price: 600,
    duration: "3 Months",
    period: "quarterly",
    description: "Cost-effective plan for quarterly access",
    features: [
      "All Monthly features",
      "Advanced analytics",
      "Team member management",
      "Discounted rate",
    ],
    color: "bg-purple-500",
    textColor: "text-purple-600",
    borderColor: "border-purple-200",
  },
  yearly: {
    id: import.meta.env.VITE_RAZORPAY_YEARLY_PLAN_ID as string,
    name: "Yearly Plan",
    price: 2000,
    duration: "Yearly",
    period: "yearly",
    description: "Best value for long-term commitment",
    features: [
      "All Quarterly features",
      "WhatsApp integration",
      "Review management",
      "Premium support",
    ],
    color: "bg-gradient-to-r from-purple-500 to-pink-500",
    textColor: "text-purple-600",
    borderColor: "border-purple-200",
  },
};

export const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY as string;
