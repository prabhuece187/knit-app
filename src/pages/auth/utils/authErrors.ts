import { ERROR_TYPES, type ErrorType } from "./authConstants";

// Error message mapping
export const ERROR_MESSAGES: Record<ErrorType, string> = {
  [ERROR_TYPES.NETWORK]:
    "Network error. Please check your internet connection and try again.",
  [ERROR_TYPES.INVALID_OTP]: "Invalid OTP. Please try again.",
  [ERROR_TYPES.OTP_EXPIRED]: "OTP has expired. Please request a new one.",
  [ERROR_TYPES.EMAIL_NOT_FOUND]:
    "Email not found. Please check your email address.",
  [ERROR_TYPES.RATE_LIMIT]:
    "Too many requests. Please wait a moment before trying again.",
  [ERROR_TYPES.REGISTRATION_INCOMPLETE]:
    "Registration incomplete. Please complete all registration steps.",
  [ERROR_TYPES.USER_NOT_ACTIVE]:
    "User not active. Please contact support.",
  [ERROR_TYPES.FORBIDDEN]: "Forbidden. Please contact support.",
  [ERROR_TYPES.UNKNOWN]: "Something went wrong. Please try again.",
};

/**
 * Classify error based on error message
 */
export function classifyError(errorMessage: string | undefined): ErrorType {
  if (!errorMessage) return ERROR_TYPES.UNKNOWN;

  const message = errorMessage.toLowerCase();

  // Network errors
  if (
    message.includes("network error") ||
    message.includes("failed to fetch") ||
    message.includes("timeout") ||
    message.includes("cors")
  ) {
    return ERROR_TYPES.NETWORK;
  }

  // OTP errors
  if (
    message.includes("invalid otp") ||
    message.includes("otp mismatch") ||
    message.includes("incorrect")
  ) {
    return ERROR_TYPES.INVALID_OTP;
  }

  if (message.includes("otp expired")) {
    return ERROR_TYPES.OTP_EXPIRED;
  }

  // Email errors
  if (
    message.includes("email not found") ||
    message.includes("user not found") ||
    message.includes("invalid email")
  ) {
    return ERROR_TYPES.EMAIL_NOT_FOUND;
  }

  if (message.includes("user account is inactive")) {
    console.log("user not active xxxxx");
    return ERROR_TYPES.USER_NOT_ACTIVE;
  }

  // Rate limit errors
  if (message.includes("too many requests") || message.includes("rate limit")) {
    return ERROR_TYPES.RATE_LIMIT;
  }

  // Registration errors
  if (message.includes("registration incomplete")) {
    return ERROR_TYPES.REGISTRATION_INCOMPLETE;
  }

  return ERROR_TYPES.UNKNOWN;
}

/**
 * Get user-friendly error message
 */
export function getUserFriendlyError(
  error: unknown,
  fallbackMessage?: string
): string {
  const errorMessage =
    (error as { data?: { message?: string } })?.data?.message ||
    fallbackMessage;

  const errorType = classifyError(errorMessage);
  return ERROR_MESSAGES[errorType];
}

/**
 * Check if error should redirect to email step
 */
export function shouldRedirectToEmail(errorType: ErrorType): boolean {
  return errorType === ERROR_TYPES.EMAIL_NOT_FOUND;
}

/**
 * Check if error should clear form
 */
export function shouldClearForm(errorType: ErrorType): boolean {
  return (
    errorType === ERROR_TYPES.INVALID_OTP ||
    errorType === ERROR_TYPES.OTP_EXPIRED
  );
}

/**
 * Check if error is retryable
 */
export function isRetryableError(errorType: ErrorType): boolean {
  return (
    errorType === ERROR_TYPES.NETWORK ||
    errorType === ERROR_TYPES.UNKNOWN ||
    errorType === ERROR_TYPES.OTP_EXPIRED
  );
}
