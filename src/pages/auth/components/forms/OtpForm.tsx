import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { otpSchema, type OtpFormData } from "../../types/login.types";

interface OtpFormProps {
  onSubmit: (data: OtpFormData) => void;
  onResend?: () => void;
  onBack?: () => void;
  isLoading?: boolean;
  isResending?: boolean;
  canResend?: boolean;
  email?: string;
}

export default function OtpForm({
  onSubmit,
  onResend,
  onBack,
  isLoading = false,
  isResending = false,
  canResend = true,
  email,
}: OtpFormProps) {
  const form = useForm<OtpFormData>({
    resolver: zodResolver(otpSchema),
  });

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="otp">Verification Code</Label>
        {email && (
          <p className="text-sm text-gray-600">
            Enter the 6-digit code sent to <strong>{email}</strong>
          </p>
        )}
        <Input
          id="otp"
          type="text"
          placeholder="Enter 6-digit code"
          maxLength={6}
          className="text-center text-lg tracking-widest"
          {...form.register("otp")}
          disabled={isLoading}
          autoComplete="one-time-code"
        />
        {form.formState.errors.otp && (
          <p className="text-sm text-red-600">
            {form.formState.errors.otp.message}
          </p>
        )}
      </div>

      <div className="space-y-3">
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Verify OTP
        </Button>

        <div className="flex justify-between text-sm">
          {onBack && (
            <Button
              type="button"
              variant="ghost"
              onClick={onBack}
              disabled={isLoading}
            >
              ← Back to email
            </Button>
          )}

          {onResend && (
            <Button
              type="button"
              variant="ghost"
              onClick={onResend}
              disabled={isResending || !canResend || isLoading}
              className="text-blue-600 hover:text-blue-800"
            >
              {isResending ? "Sending..." : "Resend OTP"}
            </Button>
          )}
        </div>
      </div>
    </form>
  );
}
