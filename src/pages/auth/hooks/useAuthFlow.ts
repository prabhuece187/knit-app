import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAppDispatch } from "@/store/Store";
import { addTokensAndUser } from "@/slice/AuthSlice";
import { useAdminRequestOtpMutation, useAdminValidateOtpMutation, useRequestOtpMutation, useValidateOtpMutation } from "../api/AuthApi";
import {
  getUserFriendlyError,
  classifyError,
  shouldRedirectToEmail,
  // shouldClearForm,
} from "../utils/authErrors";
import {
  AUTH_STEPS,
  SUCCESS_MESSAGES,
  BACKEND_REGISTRATION_STEPS,
} from "../utils/authConstants";
import type { EmailFormData, OtpFormData } from "../types/login.types";
import type { AuthStep } from "../utils/authConstants";
import type { LoginResponse } from "../types/auth.types";

interface UseAuthFlowReturn {
  // State
  currentStep: AuthStep;
  userEmail: string;
  isRequestingOtp: boolean;
  isValidatingOtp: boolean;

  // Actions
  handleEmailSubmit: (data: EmailFormData) => Promise<void>;
  handleOtpSubmit: (data: OtpFormData) => Promise<void>;
  handleResendOtp: () => Promise<void>;
  handleBackToEmail: () => void;
  setCurrentStep: (step: AuthStep) => void;
  role?: "admin" | "user";
}

export function useAuthFlow(role?: "admin" | "user"): UseAuthFlowReturn {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [currentStep, setCurrentStep] = useState<AuthStep>(AUTH_STEPS.EMAIL);
  const [userEmail, setUserEmail] = useState("");

  const [requestOtp, { isLoading: isRequestingOtp }] = useRequestOtpMutation();
  const [validateOtp, { isLoading: isValidatingOtp }] =
    useValidateOtpMutation();

  const [adminRequestOtp, { isLoading: isRequestingAdminOtp }] = useAdminRequestOtpMutation();
  const [adminValidateOtp, { isLoading: isValidatingAdminOtp }] = useAdminValidateOtpMutation();

  /**
   * Handle email submission
   */
  const handleEmailSubmit = async (data: EmailFormData) => {
    try {
      if (role === "admin") {
        await adminRequestOtp({ email: data.email }).unwrap();
      } else {
        await requestOtp({ email: data.email }).unwrap();
      }

      setUserEmail(data.email);
      setCurrentStep(AUTH_STEPS.OTP);
      toast.success(`${SUCCESS_MESSAGES.OTP_SENT}\nSent to: ${data.email}`);
    } catch (err: unknown) {
      const errorMessage = getUserFriendlyError(err, "Failed to send OTP");
      toast.error(errorMessage);

      // const errorType = classifyError(
      //   (err as { data?: { message?: string } })?.data?.message
      // );

      // Stay on email step for all errors
      // User can retry or fix their email
    }
  };

  /**
   * Handle OTP submission
   */
  const handleOtpSubmit = async (data: OtpFormData) => {
    try {
      let response: LoginResponse;
      if (role === "admin") {
        response = await adminValidateOtp({ email: userEmail, otp: data.otp }).unwrap();
      } else {
        response = await validateOtp({ email: userEmail, otp: data.otp }).unwrap();
      }


      // Store tokens and user data in Redux
      dispatch(
        addTokensAndUser({
          accessToken: response.accessToken,
          refreshToken: response.refreshToken,
          user: response.user,
        })
      );

      // Check registration status
      if (
        response.user.registrationStep ===
        BACKEND_REGISTRATION_STEPS.EMAIL_VERIFIED
      ) {
        toast.success(SUCCESS_MESSAGES.EMAIL_VERIFIED);
        setCurrentStep(AUTH_STEPS.REGISTRATION);
        return;
      }

      if (
        response.user.registrationStep ===
        BACKEND_REGISTRATION_STEPS.PROFESSIONAL_DETAILS_ADDED
      ) {
        toast.success("Welcome back! Please complete your survey.");
        setCurrentStep(AUTH_STEPS.REGISTRATION);
        return;
      }

      // Registration complete - redirect to dashboard
      toast.success(SUCCESS_MESSAGES.LOGIN_SUCCESS);

      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);

    } catch (err: unknown) {
      const errorMessage = getUserFriendlyError(err, "Failed to validate OTP");
      const errorType = classifyError(
        (err as { data?: { message?: string } })?.data?.message
      );

      toast.error(errorMessage);

      // Handle different error types
      if (shouldRedirectToEmail(errorType)) {
        setCurrentStep(AUTH_STEPS.EMAIL);
        setUserEmail("");
      }

      // Form will be cleared if shouldClearForm returns true
      // This is handled by the component itself
    }
  };

  /**
   * Handle resend OTP
   */
  const handleResendOtp = async () => {
    if (!userEmail) {
      toast.error("Email not found. Please go back and enter your email.");
      return;
    }

    try {
      if (role === "admin") {
        await adminRequestOtp({ email: userEmail }).unwrap();
      } else {
        await requestOtp({ email: userEmail }).unwrap();
      }
      toast.success(SUCCESS_MESSAGES.OTP_RESENT);
    } catch (err: unknown) {
      const errorMessage = getUserFriendlyError(err, "Failed to resend OTP");
      const errorType = classifyError(
        (err as { data?: { message?: string } })?.data?.message
      );

      toast.error(errorMessage);

      if (shouldRedirectToEmail(errorType)) {
        setCurrentStep(AUTH_STEPS.EMAIL);
        setUserEmail("");
      }
    }
  };

  /**
   * Handle back to email step
   */
  const handleBackToEmail = () => {
    setCurrentStep(AUTH_STEPS.EMAIL);
    setUserEmail("");
  };

  return {
    // State
    currentStep,
    userEmail,
    isRequestingOtp,
    isValidatingOtp,

    // Actions
    handleEmailSubmit,
    handleOtpSubmit,
    handleResendOtp,
    handleBackToEmail,
    setCurrentStep,
  };
}
