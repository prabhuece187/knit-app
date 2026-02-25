import { useState, useCallback } from "react";
import { toast } from "sonner";
import {
  getUserFriendlyError,
  classifyError,
  shouldRedirectToEmail,
  shouldClearForm,
  isRetryableError,
} from "../utils/authErrors";
import type { ErrorType } from "../utils/authConstants";

interface UseAuthErrorReturn {
  error: string | null;
  errorType: ErrorType | null;
  hasError: boolean;

  handleError: (err: unknown, fallbackMessage?: string) => void;
  clearError: () => void;
  showErrorToast: (message: string) => void;
  shouldRedirect: boolean;
  shouldClear: boolean;
  canRetry: boolean;
}

/**
 * Centralized error handling for auth flows
 */
export function useAuthError(): UseAuthErrorReturn {
  const [error, setError] = useState<string | null>(null);
  const [errorType, setErrorType] = useState<ErrorType | null>(null);

  /**
   * Handle error
   */
  const handleError = useCallback((err: unknown, fallbackMessage?: string) => {
    const errorMessage = getUserFriendlyError(err, fallbackMessage);
    const type = classifyError(
      (err as { data?: { message?: string } })?.data?.message
    );

    setError(errorMessage);
    setErrorType(type);
    toast.error(errorMessage);
  }, []);

  /**
   * Clear error
   */
  const clearError = useCallback(() => {
    setError(null);
    setErrorType(null);
  }, []);

  /**
   * Show error toast
   */
  const showErrorToast = useCallback((message: string) => {
    toast.error(message);
  }, []);

  const hasError = error !== null;
  const shouldRedirect = errorType ? shouldRedirectToEmail(errorType) : false;
  const shouldClear = errorType ? shouldClearForm(errorType) : false;
  const canRetry = errorType ? isRetryableError(errorType) : false;

  return {
    error,
    errorType,
    hasError,
    handleError,
    clearError,
    showErrorToast,
    shouldRedirect,
    shouldClear,
    canRetry,
  };
}
