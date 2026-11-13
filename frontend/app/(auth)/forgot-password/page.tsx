"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, CheckCircle2, LoaderCircle } from "lucide-react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthShell } from "@/components/auth/auth-shell";
import { FormField } from "@/components/auth/form-field";
import { useForgotPasswordMutation } from "@/lib/api";
import { getApiError } from "@/lib/hooks";
import { forgotPasswordSchema, type ForgotPasswordValues } from "@/lib/validation";

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false); const [resetToken, setResetToken] = useState<string>();
  const [forgotPassword, { isLoading, error }] = useForgotPasswordMutation();
  const { register, handleSubmit, formState: { errors } } = useForm<ForgotPasswordValues>({ resolver: zodResolver(forgotPasswordSchema) });
  async function onSubmit(values: ForgotPasswordValues) { try { const response = await forgotPassword(values).unwrap(); setResetToken(response.resetToken); setSent(true); } catch { /* handled through mutation state */ } }
  return <AuthShell eyebrow="Account recovery" title="Forgot your password?" description="Enter your work email and we will send a secure link to set a new password." footer={<>Remembered it? <Link className="font-semibold text-teal-700 hover:text-teal-800" href="/login">Back to sign in</Link></>}>
    {sent ? <div className="space-y-5"><div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-800"><CheckCircle2 className="mt-0.5 shrink-0" size={19} /><p className="text-sm leading-6">If an account exists for that email, a reset link has been sent. Check your inbox to continue.</p></div>{resetToken && <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-800"><p className="font-semibold">Development reset token</p><p className="mt-2 break-all font-mono">{resetToken}</p><Link className="mt-3 inline-block font-semibold underline" href={`/reset-password?token=${resetToken}`}>Continue to reset password</Link></div>}<Button variant="outline" className="w-full" onClick={() => setSent(false)}>Use another email</Button></div> : <form className="space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>{error && <Alert>{getApiError(error)}</Alert>}<FormField id="email" label="Work email" error={errors.email?.message}><Input id="email" type="email" autoComplete="email" placeholder="you@company.com" {...register("email")} /></FormField><Button className="w-full" type="submit" disabled={isLoading}>{isLoading ? <LoaderCircle className="animate-spin" size={18} /> : <ArrowRight size={18} />}{isLoading ? "Sending..." : "Send reset link"}</Button></form>}
  </AuthShell>;
}