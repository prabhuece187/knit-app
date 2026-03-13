import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLoginMutation } from "@/api/AuthApi";
import { useNavigate } from "react-router-dom";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const loginSchema = z.object({
  email: z.string().email("Enter valid email"),
  password: z.string().min(6, "Minimum 6 characters required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const [postLogin] = useLoginMutation();
  const navigate = useNavigate();

  const onSubmit = async (data: LoginFormValues) => {
    try {
      await postLogin(data).unwrap();
      navigate("/");
    } catch (error: unknown) {
      if (typeof error === "object" && error !== null && "data" in error) {
        const err = error as FetchBaseQueryError & {
          data?: { message?: string };
        };

        alert(err.data?.message ?? "Invalid credentials");
      } else {
        alert("Invalid credentials");
      }
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left Branding Section */}
      <div className="hidden lg:flex flex-col justify-center items-center bg-gradient-to-br from-violet-600 to-indigo-700 text-white p-12">
        <h1 className="text-4xl font-bold mb-4">Welcome Back</h1>
        <p className="text-lg opacity-90 text-center max-w-sm">
          Manage your customers, invoices, and reports with our modern ERP
          system.
        </p>

        <div className="mt-10 text-sm opacity-70">Secure • Fast • Reliable</div>
      </div>

      {/* Login Section */}
      <div className="flex items-center justify-center bg-muted/40 p-6">
        <div className="w-full max-w-md backdrop-blur-lg bg-white/70 border shadow-2xl rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-center mb-2">Login Account</h2>

          <p className="text-center text-muted-foreground mb-6">
            Enter your credentials to continue
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                placeholder="example@email.com"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Password</Label>
              <Input
                type="password"
                placeholder="Enter password"
                {...register("password")}
              />
              {errors.password && (
                <p className="text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full rounded-xl text-md py-5 bg-violet-600 hover:bg-violet-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Logging in..." : "Login"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
