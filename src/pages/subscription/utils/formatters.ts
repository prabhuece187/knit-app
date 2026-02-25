import type { PlanPeriod } from "../types";

/**
 * Format unix timestamp to readable date string
 */
export const formatDate = (timestamp: number | null): string => {
  if (!timestamp) return "N/A";
  return new Date(timestamp * 1000).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

/**
 * Format currency with Indian Rupee symbol
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
  }).format(amount);
};

/**
 * Calculate monthly price for yearly/quarterly plans
 */
export const calculateMonthlyPrice = (
  price: number,
  period: PlanPeriod
): string => {
  const months = period === "yearly" ? 12 : period === "quarterly" ? 3 : 1;
  const monthlyPrice = price / months;
  return formatCurrency(monthlyPrice);
};

/**
 * Format date range
 */
export const formatDateRange = (
  start: number | null,
  end: number | null
): string => {
  if (!start || !end) return "N/A";
  return `${formatDate(start)} - ${formatDate(end)}`;
};
