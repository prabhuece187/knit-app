import { Shield } from "lucide-react";
import AuthHeader from "../shared/AuthHeader";
import OtpForm from "../forms/OtpForm";
import type { OtpFormData } from "../../types/login.types";

interface OtpStepProps {
  email: string;
  onSubmit: (data: OtpFormData) => void;
  onResend: () => void;
  onBack: () => void;
  isLoading: boolean;
  isResending: boolean;
  role?: "admin" | "user";
}

export default function OtpStep({
  email,
  onSubmit,
  onResend,
  onBack,
  isLoading,
  isResending,
  role,
}: OtpStepProps) {
  return (
    <div className="space-y-6">
      <AuthHeader
        icon={Shield}
        title="Verify Your Email"
        description={`We've sent a 6-digit code to ${email}`}
      />

      <OtpForm
        email={email}
        onSubmit={onSubmit}
        onResend={onResend}
        onBack={onBack}
        isLoading={isLoading}
        isResending={isResending}
        canResend={!isResending}
      />

      <div className="text-center text-sm text-gray-600">
        <p>
          Didn&apos;t receive the code? Check your spam folder or try resending.
        </p>
      </div>
    </div>
  );
}
