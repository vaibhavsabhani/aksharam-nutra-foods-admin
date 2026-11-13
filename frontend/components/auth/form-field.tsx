import type { ReactNode } from "react";
import { Label } from "@/components/ui/label";

export function FormField({
  id,
  label,
  error,
  children,
  action,
}: {
  id: string;
  label: string;
  error?: string;
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <Label
          htmlFor={id}
          className="mb-0 text-xs font-semibold uppercase tracking-wider text-slate-700"
        >
          {label}
        </Label>
        {action}
      </div>
      {children}
      {error && (
        <p className="mt-1 text-xs font-medium text-rose-600 animate-in fade-in duration-200">
          {error}
        </p>
      )}
    </div>
  );
}
