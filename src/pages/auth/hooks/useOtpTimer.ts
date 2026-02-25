import { useState, useEffect, useCallback, useRef } from "react";
import { OTP_CONFIG } from "../utils/authConstants";

interface UseOtpTimerProps {
  cooldownSeconds?: number;
  autoStart?: boolean;
}

interface UseOtpTimerReturn {
  timeLeft: number;
  isActive: boolean;
  canResend: boolean;
  progress: number;
  formattedTime: string;

  start: () => void;
  reset: () => void;
  pause: () => void;
  resume: () => void;
}

/**
 * Hook for managing OTP countdown timer
 */
export function useOtpTimer({
  cooldownSeconds = OTP_CONFIG.RESEND_COOLDOWN,
  autoStart = false,
}: UseOtpTimerProps = {}): UseOtpTimerReturn {
  const [timeLeft, setTimeLeft] = useState(cooldownSeconds);
  const [isActive, setIsActive] = useState(autoStart);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Start timer
   */
  const start = useCallback(() => {
    setTimeLeft(cooldownSeconds);
    setIsActive(true);
  }, [cooldownSeconds]);

  /**
   * Reset timer
   */
  const reset = useCallback(() => {
    setTimeLeft(cooldownSeconds);
    setIsActive(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, [cooldownSeconds]);

  /**
   * Pause timer
   */
  const pause = useCallback(() => {
    setIsActive(false);
  }, []);

  /**
   * Resume timer
   */
  const resume = useCallback(() => {
    if (timeLeft > 0) {
      setIsActive(true);
    }
  }, [timeLeft]);

  /**
   * Timer effect
   */
  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, timeLeft]);

  /**
   * Cleanup on unmount
   */
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const canResend = !isActive && timeLeft === 0;
  const progress = ((cooldownSeconds - timeLeft) / cooldownSeconds) * 100;
  const formattedTime = `${Math.floor(timeLeft / 60)}:${String(
    timeLeft % 60
  ).padStart(2, "0")}`;

  return {
    timeLeft,
    isActive,
    canResend,
    progress,
    formattedTime,
    start,
    reset,
    pause,
    resume,
  };
}
