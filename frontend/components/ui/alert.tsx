import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Alert({ children, tone = "error" }: { children: ReactNode; tone?: "error" | "success" }) {
  return <div role="alert" className={cn("rounded-xl border px-4 py-3 text-sm", tone === "error" ? "border-red-200 bg-red-50 text-red-700" : "border-emerald-200 bg-emerald-50 text-emerald-700")}>{children}</div>;
}