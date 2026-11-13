"use client";

import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  PenTool,
  MessageSquareQuote,
  ShieldCheck,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  {
    title: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
    exact: true,
    badge: "Main",
  },
  {
    title: "Blogs",
    href: "/dashboard/blogs",
    icon: PenTool,
    exact: false,
    badge: "Content",
  },
  {
    title: "Testimonials",
    href: "/dashboard/testimonials",
    icon: MessageSquareQuote,
    exact: false,
    badge: "Social",
  },
];

interface AdminSidebarProps {
  onItemClick?: () => void;
}

export function AdminSidebar({ onItemClick }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-64 flex-col justify-between border-r border-slate-200/80 bg-white p-4 overflow-y-auto">
      <div className="space-y-6">
        <div>
          <div className="flex items-center justify-between px-3">
            <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
              Admin Workspace
            </p>
            <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>

          <nav className="mt-3 space-y-1.5">
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
                    "group relative flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-all duration-200",
                    isActive
                      ? "bg-gradient-to-r from-teal-50 to-emerald-50/60 font-bold text-teal-900 shadow-xs border border-teal-200/60"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={cn(
                        "grid h-7 w-7 place-items-center rounded-lg transition-all duration-200 group-hover:scale-110",
                        isActive
                          ? "bg-teal-700 text-white shadow-xs"
                          : "text-slate-400 group-hover:text-teal-700"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                    </span>
                    <span>{item.title}</span>
                  </div>

                  {isActive ? (
                    <span className="h-1.5 w-1.5 rounded-full bg-teal-600 shadow-xs shadow-teal-600" />
                  ) : (
                    <span className="text-[10px] font-medium text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      {item.badge}
                    </span>
                  )}
                </a>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Bottom Status Card */}
      <div className="space-y-3">
        <div className="rounded-2xl border border-slate-200/80 bg-gradient-to-br from-slate-50 to-teal-50/40 p-3.5 shadow-2xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
              <ShieldCheck className="h-4 w-4 text-teal-700" />
              <span>Admin Console</span>
            </div>
            <span className="inline-flex items-center rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
              Active
            </span>
          </div>
          <p className="mt-2 text-[11px] text-slate-500 leading-relaxed">
            Aksharam Nutra Foods Enterprise v2.0
          </p>
        </div>
      </div>
    </aside>
  );
}
