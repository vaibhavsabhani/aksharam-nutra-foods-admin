"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, CheckCircle2, LoaderCircle } from "lucide-react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AuthShell } from "@/components/auth/auth-shell";
import { FormField } from "@/components/auth/form-field";
import { PasswordInput } from "@/components/auth/password-input";
import { useResetPasswordMutation } from "@/lib/api";
import { getApiError } from "@/lib/hooks";
import {
  resetPasswordSchema,
  type ResetPasswordValues,
} from "@/lib/validations";

function ResetForm() {
  const params = useSearchParams();
  const router = useRouter();
  const [complete, setComplete] = useState(false);
  const [resetPassword, { isLoading, error }] = useResetPasswordMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token: params.get("token") ?? "",
      password: "",
      confirmPassword: "",
    },
  });
  async function onSubmit(values: ResetPasswordValues) {
    try {
      await resetPassword({
        token: values.token,
        password: values.password,
      }).unwrap();
      setComplete(true);
    } catch {
      /* handled through mutation state */
    }
  }
  if (complete)
    return (
      <div className="space-y-5">
        <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-800">
          <CheckCircle2 className="mt-0.5 shrink-0" size={19} />
          <p className="text-sm leading-6">
            Your password has been updated. You can now sign in with your new
            password.
          </p>
        </div>
        <Button className="w-full" onClick={() => router.replace("/login")}>
          Return to sign in <ArrowRight size={18} />
        </Button>
      </div>
    );
  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
      {error && (
        <Alert>
          {getApiError(error, "This reset link is invalid or has expired.")}
        </Alert>
      )}
      <FormField id="token" label="Reset token" error={errors.token?.message}>
        <input id="token" type="hidden" {...register("token")} />
        <p className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-500">
          {params.get("token")
            ? "A secure reset token was detected from your link."
            : "Your reset link is missing a valid token."}
        </p>
      </FormField>
      <FormField
        id="password"
        label="New password"
        error={errors.password?.message}
      >
        <PasswordInput
          id="password"
          autoComplete="new-password"
          placeholder="Create a strong password"
          className="h-12 bg-slate-50/50 hover:bg-white focus:bg-white text-slate-900 border-slate-200 transition-all"
          {...register("password")}
        />
      </FormField>
      <FormField
        id="confirmPassword"
        label="Confirm new password"
        error={errors.confirmPassword?.message}
      >
        <PasswordInput
          id="confirmPassword"
          autoComplete="new-password"
          placeholder="Repeat your new password"
          className="h-12 bg-slate-50/50 hover:bg-white focus:bg-white text-slate-900 border-slate-200 transition-all"
          {...register("confirmPassword")}
        />
      </FormField>
      <Button
        className="group relative mt-2 w-full h-12 text-sm font-bold tracking-wide bg-teal-800 hover:bg-teal-900 text-white shadow-md shadow-teal-950/15 hover:shadow-lg hover:shadow-teal-950/25 active:scale-[0.99] transition-all"
        type="submit"
        disabled={isLoading || !params.get("token")}
      >
        {isLoading ? (
          <div className="flex items-center justify-center gap-2">
            <LoaderCircle className="h-4 w-4 animate-spin text-white" />
            <span>Updating password...</span>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2">
            <span>Update password</span>
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
          </div>
        )}
      </Button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <AuthShell
      eyebrow="Secure reset"
      title="Create a new password"
      description="Choose a strong password you have not used before."
      footer={
        <>
          Need a new link?{" "}
          <Link
            className="font-semibold text-teal-700 hover:text-teal-800"
            href="/forgot-password"
          >
            Start again
          </Link>
        </>
      }
    >
      <Suspense
        fallback={
          <div className="h-48 animate-pulse rounded-xl bg-slate-100" />
        }
      >
        <ResetForm />
      </Suspense>
    </AuthShell>
  );
}
