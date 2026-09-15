"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, LoaderCircle } from "lucide-react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthShell } from "@/components/auth/auth-shell";
import { FormField } from "@/components/auth/form-field";
import { PasswordInput } from "@/components/auth/password-input";
import { useLoginMutation } from "@/lib/api";
import { getApiError } from "@/lib/hooks";
import { loginSchema, type LoginValues } from "@/lib/validation";

import { useEffect } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [login, { isLoading, error }] = useLoginMutation();
  const { register, handleSubmit, formState: { errors } } = useForm<LoginValues>({ resolver: zodResolver(loginSchema), defaultValues: { email: "", password: "" } });

  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem("accessToken")) {
      router.replace("/dashboard");
    }
  }, [router]);

  async function onSubmit(values: LoginValues) { try { const session = await login(values).unwrap(); localStorage.setItem("accessToken", session.accessToken); localStorage.setItem("refreshToken", session.refreshToken); router.replace("/dashboard"); } catch { /* handled through mutation state */ } }
  return <AuthShell eyebrow="Welcome back" title="Sign in to your workspace" description="Manage your products, orders, and customers from one calm, focused space." footer={<>Forgot your password? <Link className="font-semibold text-teal-700 hover:text-teal-800" href="/forgot-password">Reset it</Link></>}>
    <form className="space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>{error && <Alert>{getApiError(error, "We could not sign you in. Check your details and try again.")}</Alert>}<FormField id="email" label="Work email" error={errors.email?.message}><Input id="email" type="email" autoComplete="email" placeholder="you@company.com" {...register("email")} /></FormField><FormField id="password" label="Password" error={errors.password?.message}><PasswordInput id="password" autoComplete="current-password" placeholder="Enter your password" {...register("password")} /></FormField><Button className="w-full" type="submit" disabled={isLoading}>{isLoading ? <LoaderCircle className="animate-spin" size={18} /> : <ArrowRight size={18} />}{isLoading ? "Signing in..." : "Sign in"}</Button></form>
  </AuthShell>;
}