import { z } from "zod";

const password = z.string().min(8, "Use at least 8 characters.").regex(/[a-z]/, "Add a lowercase letter.").regex(/[A-Z]/, "Add an uppercase letter.").regex(/[0-9]/, "Add a number.").regex(/[^A-Za-z0-9]/, "Add a special character.");

export const loginSchema = z.object({ email: z.string().trim().email("Enter a valid email address."), password: z.string().min(1, "Enter your password.") });
export const forgotPasswordSchema = z.object({ email: z.string().trim().email("Enter a valid email address.") });
export const resetPasswordSchema = z.object({ token: z.string().min(32, "Paste the reset token from your email."), password, confirmPassword: z.string() }).refine((data) => data.password === data.confirmPassword, { path: ["confirmPassword"], message: "Passwords do not match." });
export type LoginValues = z.infer<typeof loginSchema>;
export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;