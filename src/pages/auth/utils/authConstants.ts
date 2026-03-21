// Authentication step identifiers
export const AUTH_STEPS = {
  EMAIL: "email",
  OTP: "otp",
  REGISTRATION: "registration",
  DASHBOARD: "dashboard",
} as const;

export type AuthStep = (typeof AUTH_STEPS)[keyof typeof AUTH_STEPS];

// Registration step identifiers
export const REGISTRATION_STEPS = {
  PROFESSIONAL: "professional",
  SURVEY: "survey",
  COMPLETE: "complete",
} as const;

export type RegistrationStepType =
  (typeof REGISTRATION_STEPS)[keyof typeof REGISTRATION_STEPS];

// Backend registration step statuses
export const BACKEND_REGISTRATION_STEPS = {
  EMAIL_VERIFICATION_PENDING: "EMAIL_VERIFICATION_PENDING",
  EMAIL_VERIFIED: "EMAIL_VERIFIED",
  PROFESSIONAL_DETAILS_ADDED: "PROFESSIONAL_DETAILS_ADDED",
  SURVEY_COMPLETED: "SURVEY_COMPLETED",
  REGISTRATION_COMPLETE: "REGISTRATION_COMPLETE",
} as const;

// OTP configuration
export const OTP_CONFIG = {
  LENGTH: 6,
  RESEND_COOLDOWN: 60, // seconds
  EXPIRY_TIME: 300, // 5 minutes in seconds
} as const;

// Route paths
export const AUTH_ROUTES = {
  LOGIN: "/",
  DASHBOARD: "/dashboard",
} as const;

// Error message keys
export const ERROR_TYPES = {
  NETWORK: "network",
  USER_NOT_ACTIVE: "user_not_active",
  INVALID_OTP: "invalid_otp",
  OTP_EXPIRED: "otp_expired",
  EMAIL_NOT_FOUND: "email_not_found",
  RATE_LIMIT: "rate_limit",
  REGISTRATION_INCOMPLETE: "registration_incomplete",
  UNKNOWN: "unknown",
  FORBIDDEN: "forbidden",
} as const;

export type ErrorType = (typeof ERROR_TYPES)[keyof typeof ERROR_TYPES];

// Success message keys
export const SUCCESS_MESSAGES = {
  OTP_SENT: "OTP sent successfully. Please check your email.",
  OTP_RESENT: "OTP resent successfully!",
  EMAIL_VERIFIED: "Email verified! Please complete your registration.",
  PROFESSIONAL_SAVED: "Professional details saved successfully!",
  REGISTRATION_COMPLETE: "Registration completed successfully!",
  LOGIN_SUCCESS: "Login successful! Redirecting...",
} as const;

// Registration Step Constants
export const RegistrationStep = {
  EMAIL_VERIFICATION_PENDING: "EMAIL_VERIFICATION_PENDING",
  EMAIL_VERIFIED: "EMAIL_VERIFIED",
  PROFESSIONAL_DETAILS_ADDED: "PROFESSIONAL_DETAILS_ADDED",
  SURVEY_COMPLETED: "SURVEY_COMPLETED",
  REGISTRATION_COMPLETE: "REGISTRATION_COMPLETE",
} as const;

export type RegistrationStep =
  (typeof RegistrationStep)[keyof typeof RegistrationStep];
