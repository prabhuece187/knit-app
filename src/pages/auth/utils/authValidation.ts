/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate OTP format
 */
export function isValidOtp(otp: string): boolean {
  return /^\d{6}$/.test(otp);
}

/**
 * Validate mobile number (Indian format)
 */
export function isValidMobileNumber(mobile: string): boolean {
  return /^[6-9]\d{9}$/.test(mobile);
}

/**
 * Validate phone number with country code
 */
export function isValidPhoneNumber(phone: string): boolean {
  return /^\+?[1-9]\d{1,14}$/.test(phone);
}

/**
 * Format phone number for display
 */
export function formatPhoneNumber(phone: string): string {
  if (!phone) return "";

  // Remove all non-digits
  const cleaned = phone.replace(/\D/g, "");

  // Indian format: +91 XXXXX XXXXX
  if (cleaned.length === 10) {
    return `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
  }

  return phone;
}

/**
 * Mask email for display (e.g., j***@example.com)
 */
export function maskEmail(email: string): string {
  if (!email || !email.includes("@")) return email;

  const [username, domain] = email.split("@");
  if (username.length <= 2) return email;

  const maskedUsername = username[0] + "***" + username[username.length - 1];
  return `${maskedUsername}@${domain}`;
}

/**
 * Validate required field
 */
export function isRequired(value: unknown): boolean {
  if (typeof value === "string") {
    return value.trim().length > 0;
  }
  return value !== null && value !== undefined;
}

/**
 * Validate minimum length
 */
export function minLength(value: string, min: number): boolean {
  return value.trim().length >= min;
}

/**
 * Validate maximum length
 */
export function maxLength(value: string, max: number): boolean {
  return value.trim().length <= max;
}

/**
 * Check if string contains only numbers
 */
export function isNumeric(value: string): boolean {
  return /^\d+$/.test(value);
}

/**
 * Check if string contains only alphabets and spaces
 */
export function isAlphabetic(value: string): boolean {
  return /^[a-zA-Z\s]+$/.test(value);
}

/**
 * Sanitize input (remove special characters)
 */
export function sanitizeInput(value: string): string {
  return value.replace(/[<>'"]/g, "");
}
