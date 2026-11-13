"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, LoaderCircle, Mail, Lock } from "lucide-react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthShell } from "@/components/auth/auth-shell";
import { FormField } from "@/components/auth/form-field";
import { PasswordInput } from "@/components/auth/password-input";
import { useLoginMutation } from "@/lib/api";
import { getApiError } from "@/lib/hooks";
import { loginSchema, type LoginValues } from "@/lib/validations";
import { useEffect } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [login, { isLoading, error }] = useLoginMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem("accessToken")) {
      router.replace("/dashboard");
    }
  }, [router]);

  async function onSubmit(values: LoginValues) {
    try {
      const session = await login(values).unwrap();
      localStorage.setItem("accessToken", session.accessToken);
      localStorage.setItem("refreshToken", session.refreshToken);
      router.replace("/dashboard");
    } catch {
      // Handled through RTK error state
    }
  }

  return (
    <AuthShell
      eyebrow="Welcome Back"
      title="Sign in to your workspace"
      description="Manage your products, orders, and customers from one calm, focused space."
      footer={
        <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500">
          <span>Trouble signing in?</span>
          <Link
            className="font-bold text-teal-700 hover:text-teal-800 hover:underline transition-colors"
            href="/forgot-password"
          >
            Reset password
          </Link>
        </div>
      }
    >
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        {error && (
          <Alert>
            {getApiError(
              error,
              "We could not sign you in. Check your details and try again."
            )}
          </Alert>
        )}

        <FormField id="email" label="Work email" error={errors.email?.message}>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@company.com"
              className="pl-10 h-12 bg-slate-50/50 hover:bg-white focus:bg-white text-slate-900 border-slate-200 transition-all"
              {...register("email")}
            />
          </div>
        </FormField>

        <FormField
          id="password"
          label="Password"
          error={errors.password?.message}
          action={
            <Link
              href="/forgot-password"
              className="text-xs font-semibold text-teal-700 hover:text-teal-800 hover:underline"
            >
              Forgot?
            </Link>
          }
        >
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <PasswordInput
              id="password"
              autoComplete="current-password"
              placeholder="Enter your password"
              className="pl-10 h-12 bg-slate-50/50 hover:bg-white focus:bg-white text-slate-900 border-slate-200 transition-all"
              {...register("password")}
            />
          </div>
        </FormField>

        <div className="flex items-center justify-between pt-1 text-xs text-slate-600">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              defaultChecked
              className="h-4 w-4 rounded border-slate-300 text-teal-700 focus:ring-teal-600/30 accent-teal-700"
            />
            <span className="font-medium text-slate-600">Remember this device for 30 days</span>
          </label>
        </div>

        <Button
          className="group relative mt-2 w-full h-12 text-sm font-bold tracking-wide bg-teal-800 hover:bg-teal-900 text-white shadow-md shadow-teal-950/15 hover:shadow-lg hover:shadow-teal-950/25 active:scale-[0.99] transition-all"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <LoaderCircle className="h-4 w-4 animate-spin text-white" />
              <span>Signing in...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <span>Sign in</span>
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </div>
          )}
        </Button>
      </form>
    </AuthShell>
  );
}
