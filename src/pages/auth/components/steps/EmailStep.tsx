import { Shield } from "lucide-react";
import AuthHeader from "../shared/AuthHeader";
import EmailForm from "../forms/EmailForm";
import type { EmailFormData } from "../../types/login.types";

interface EmailStepProps {
  onSubmit: (data: EmailFormData) => void;
  isLoading: boolean;
  role?: "admin" | "user";
}

export default function EmailStep({ onSubmit, isLoading, role }: EmailStepProps) {
  return (
    <div className="space-y-6">
      <AuthHeader
        icon={Shield}
        title={role === "admin" ? "Hi, Admin!" : "Welcome Back"}
        description="Enter your email address to receive a verification code"
      />

      <EmailForm onSubmit={onSubmit} isLoading={isLoading} />

      <div className="text-center text-sm text-gray-600">
        <p>
          Don&apos;t have an account? You&apos;ll be able to register after
          email verification.
        </p>
      </div>
    </div>
  );
}
