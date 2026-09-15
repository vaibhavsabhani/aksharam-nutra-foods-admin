import type { ReactNode } from "react";
import { Label } from "@/components/ui/label";

export function FormField({ id, label, error, children }: { id: string; label: string; error?: string; children: ReactNode }) {
  return <div><Label htmlFor={id}>{label}</Label>{children}{error && <p className="mt-2 text-xs text-red-600">{error}</p>}</div>;
}