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
import { resetPasswordSchema, type ResetPasswordValues } from "@/lib/validation";

function ResetForm() {
  const params = useSearchParams(); const router = useRouter(); const [complete, setComplete] = useState(false); const [resetPassword, { isLoading, error }] = useResetPasswordMutation();
  const { register, handleSubmit, formState: { errors } } = useForm<ResetPasswordValues>({ resolver: zodResolver(resetPasswordSchema), defaultValues: { token: params.get("token") ?? "", password: "", confirmPassword: "" } });
  async function onSubmit(values: ResetPasswordValues) { try { await resetPassword({ token: values.token, password: values.password }).unwrap(); setComplete(true); } catch { /* handled through mutation state */ } }
  if (complete) return <div className="space-y-5"><div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-800"><CheckCircle2 className="mt-0.5 shrink-0" size={19} /><p className="text-sm leading-6">Your password has been updated. You can now sign in with your new password.</p></div><Button className="w-full" onClick={() => router.replace("/login")}>Return to sign in <ArrowRight size={18} /></Button></div>;
  return <form className="space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>{error && <Alert>{getApiError(error, "This reset link is invalid or has expired.")}</Alert>}<FormField id="token" label="Reset token" error={errors.token?.message}><input id="token" type="hidden" {...register("token")} /><p className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-500">{params.get("token") ? "A reset token was added from your link." : "Your reset link is missing its token."}</p></FormField><FormField id="password" label="New password" error={errors.password?.message}><PasswordInput id="password" autoComplete="new-password" placeholder="Create a strong password" {...register("password")} /></FormField><FormField id="confirmPassword" label="Confirm new password" error={errors.confirmPassword?.message}><PasswordInput id="confirmPassword" autoComplete="new-password" placeholder="Repeat your new password" {...register("confirmPassword")} /></FormField><Button className="w-full" type="submit" disabled={isLoading || !params.get("token")}>{isLoading ? <LoaderCircle className="animate-spin" size={18} /> : <ArrowRight size={18} />}{isLoading ? "Updating..." : "Update password"}</Button></form>;
}

export default function ResetPasswordPage() { return <AuthShell eyebrow="Secure reset" title="Create a new password" description="Choose a strong password you have not used before." footer={<>Need a new link? <Link className="font-semibold text-teal-700 hover:text-teal-800" href="/forgot-password">Start again</Link></>}><Suspense fallback={<div className="h-48 animate-pulse rounded-xl bg-slate-100" />}><ResetForm /></Suspense></AuthShell>; }