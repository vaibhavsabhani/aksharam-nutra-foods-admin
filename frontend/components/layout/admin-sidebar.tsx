"use client";

import Link from "next/navigation";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  PenTool,
  MessageSquareQuote,
  ShieldCheck,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  {
    title: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    title: "Blogs",
    href: "/dashboard/blogs",
    icon: PenTool,
    exact: false,
  },
  {
    title: "Testimonials",
    href: "/dashboard/testimonials",
    icon: MessageSquareQuote,
    exact: false,
  },
];

interface AdminSidebarProps {
  onItemClick?: () => void;
}

export function AdminSidebar({ onItemClick }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-64 flex-col justify-between border-r border-slate-200/80 bg-white p-4">
      <div className="space-y-6">
        <div>
          <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Management
          </p>
          <nav className="mt-2 space-y-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = item.exact
                ? pathname === item.href
                : pathname === item.href || pathname?.startsWith(`${item.href}/`);

              return (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={onItemClick}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-teal-50 font-semibold text-teal-800"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  )}
                >
                  <Icon
                    className={cn(
                      "h-4 w-4",
                      isActive ? "text-teal-700" : "text-slate-400"
                    )}
                  />
                  <span>{item.title}</span>
                </a>
              );
            })}
          </nav>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
          <ShieldCheck className="h-4 w-4 text-teal-600" />
          <span>Role: Admin</span>
        </div>
        <p className="mt-1 text-[11px] text-slate-500">
          Aksharam Nutra Foods Admin Console v1.0
        </p>
      </div>
    </aside>
  );
}

