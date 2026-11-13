"use client";

import { type ReactNode } from "react";
import { ArrowRight, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: ReactNode;
  iconBg?: string;
  iconColor?: string;
  trend?: string;
  linkHref?: string;
  linkLabel?: string;
  highlightText?: string;
  progressPercent?: number;
  className?: string;
}

export function MetricCard({
  title,
  value,
  subtitle,
  icon,
  iconBg = "bg-teal-50",
  iconColor = "text-teal-700",
  trend,
  linkHref,
  linkLabel = "Manage",
  highlightText,
  progressPercent,
  className,
}: MetricCardProps) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-teal-300/60 hover:shadow-xl hover:shadow-teal-950/[0.06]",
        className
      )}
    >
      {/* Subtle top glow highlight */}
      <div className="pointer-events-none absolute -top-12 -right-12 h-24 w-24 rounded-full bg-teal-500/10 blur-2xl group-hover:scale-150 transition-transform duration-500" />

      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
          {title}
        </span>
        <span
          className={cn(
            "grid h-10 w-10 place-items-center rounded-xl transition-transform duration-300 group-hover:scale-110",
            iconBg,
            iconColor
          )}
        >
          {icon}
        </span>
      </div>

      <div className="mt-4 flex items-baseline gap-2.5">
        <span className="text-3xl font-black tracking-tight text-slate-900">
          {value}
        </span>
        <span className="text-xs font-medium text-slate-500">{subtitle}</span>
      </div>

      {progressPercent !== undefined && (
        <div className="mt-3.5 space-y-1">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-gradient-to-r from-teal-600 to-emerald-400 transition-all duration-700"
              style={{ width: `${Math.min(100, Math.max(0, progressPercent))}%` }}
            />
          </div>
        </div>
      )}

      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
        {highlightText ? (
          <span className="flex items-center gap-1.5 font-semibold text-teal-700">
            <span className="h-1.5 w-1.5 rounded-full bg-teal-600 animate-pulse" />
            {highlightText}
          </span>
        ) : trend ? (
          <span className="flex items-center gap-1 font-semibold text-emerald-600">
            <TrendingUp className="h-3.5 w-3.5" />
            {trend}
          </span>
        ) : (
          <span className="text-slate-400">Live on website</span>
        )}

        {linkHref && (
          <a
            href={linkHref}
            className="inline-flex items-center gap-1 font-bold text-teal-700 hover:text-teal-900 transition-colors group-hover:translate-x-0.5"
          >
            <span>{linkLabel}</span>
            <ArrowRight className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-1" />
          </a>
        )}
      </div>
    </div>
  );
}

