import { z } from "zod";

// Validation Schemas
export const emailSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export const otpSchema = z.object({
  otp: z.string().min(6, "OTP must be 6 digits").max(6, "OTP must be 6 digits"),
});

// Inferred types from schemas
export type EmailFormData = z.infer<typeof emailSchema>;
export type OtpFormData = z.infer<typeof otpSchema>;
