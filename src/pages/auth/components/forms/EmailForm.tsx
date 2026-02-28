import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Loader2 } from "lucide-react";
import { emailSchema, type EmailFormData } from "../../types/login.types";

interface EmailFormProps {
  onSubmit: (data: EmailFormData) => void;
  isLoading?: boolean;
  // defaultEmail?: string;
}

export default function EmailForm({
  onSubmit,
  isLoading = false,
}: // defaultEmail = "",
  EmailFormProps) {
  const form = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
    // defaultValues: {
    //   email: defaultEmail,
    // },
  });

  console.log("form errors", form.formState);
  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
          <Input
            id="email"
            type="email"
            placeholder="Enter your email address"
            className="pl-10"
            {...form.register("email")}
            disabled={isLoading}
          />
        </div>
        {form.formState.errors.email && (
          <p className="text-sm text-red-600">
            {form.formState.errors.email.message}
          </p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Send OTP
      </Button>
    </form>
  );
}
