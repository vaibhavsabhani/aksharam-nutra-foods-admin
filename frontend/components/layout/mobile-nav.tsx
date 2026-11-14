"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  X,
  LayoutDashboard,
  PenTool,
  MessageSquareQuote,
  Mail,
  LogOut,
  ShieldCheck,
  Plus,
  LoaderCircle,
  ExternalLink,
} from "lucide-react";
import { useGetMeQuery, useLogoutMutation } from "@/lib/api";
import { cn } from "@/lib/utils";

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

const NAV_ITEMS = [
  {
    title: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
    exact: true,
    description: "Metrics & recent activity",
  },
  {
    title: "Blogs",
    href: "/dashboard/blogs",
    icon: PenTool,
    exact: false,
    description: "Articles, recipes & nutrition",
  },
  {
    title: "Testimonials",
    href: "/dashboard/testimonials",
    icon: MessageSquareQuote,
    exact: false,
    description: "Customer reviews & feedback",
  },
  {
    title: "Inquiries",
    href: "/dashboard/contacts",
    icon: Mail,
    exact: false,
    description: "Customer leads & landing inquiries",
  },
];

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: user } = useGetMeQuery();
  const [logout, { isLoading: isLoggingOut }] = useLogoutMutation();

  async function handleSignOut() {
    const refreshToken =
      typeof window !== "undefined" ? localStorage.getItem("refreshToken") : null;
    try {
      if (refreshToken) await logout({ refreshToken }).unwrap();
    } catch {
      // Ignore network errors
    } finally {
      if (typeof window !== "undefined") {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
      }
      onClose();
      router.replace("/login");
    }
  }

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "A";

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 lg:hidden transition-all duration-300",
        isOpen ? "visible pointer-events-auto" : "invisible pointer-events-none delay-300"
      )}
    >
      {/* 1. Backdrop Overlay */}
      <div
        className={cn(
          "fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity duration-300 ease-out",
          isOpen ? "opacity-100" : "opacity-0"
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* 2. Slide-Over Drawer Sheet */}
      <div
        className={cn(
          "relative flex h-full w-80 max-w-[85vw] flex-col justify-between bg-white shadow-2xl transition-transform duration-300 ease-out border-r border-slate-200/90",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Drawer Header with Brand Logo and Close Button */}
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-tr from-teal-800 to-emerald-700 font-black text-white shadow-sm shadow-teal-900/20">
              A
            </span>
            <div>
              <h2 className="text-sm font-black tracking-tight text-slate-900 leading-tight">
                Aksharam
              </h2>
              <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700">
                Nutra Foods Admin
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 active:scale-95 transition-all"
            aria-label="Close navigation"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Scrollable Navigation Area */}
        <div className="flex-1 overflow-y-auto px-4 py-5 space-y-6">
          {/* Main Navigation Links */}
          <div>
            <div className="flex items-center justify-between px-3 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                Menu
              </span>
              <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>

            <nav className="space-y-1.5">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = item.exact
                  ? pathname === item.href
                  : pathname === item.href || pathname?.startsWith(`${item.href}/`);

                return (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={cn(
                      "group flex items-center justify-between rounded-2xl p-3 text-sm font-semibold transition-all duration-200",
                      isActive
                        ? "bg-gradient-to-r from-teal-50 to-emerald-50/70 border border-teal-200/80 text-teal-900 shadow-xs"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={cn(
                          "grid h-9 w-9 place-items-center rounded-xl transition-all duration-200",
                          isActive
                            ? "bg-teal-700 text-white shadow-xs"
                            : "bg-slate-100 text-slate-500 group-hover:bg-teal-50 group-hover:text-teal-700"
                        )}
                      >
                        <Icon className="h-4 w-4" />
                      </span>
                      <div>
                        <p className="font-bold leading-tight">{item.title}</p>
                        <p className="text-[11px] font-normal text-slate-400 mt-0.5">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    {isActive && (
                      <span className="h-2 w-2 rounded-full bg-teal-600 shadow-xs shadow-teal-600 mr-1" />
                    )}
                  </a>
                );
              })}
            </nav>
          </div>

          {/* Quick Actions Shortcuts */}
          <div className="rounded-2xl border border-slate-200/80 bg-slate-50/60 p-3.5 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-1">
              Quick Actions
            </span>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <a
                href="/dashboard/blogs"
                onClick={onClose}
                className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white p-3 text-center transition-all hover:bg-teal-50 hover:border-teal-200 active:scale-95 shadow-2xs"
              >
                <span className="grid h-7 w-7 place-items-center rounded-lg bg-teal-50 text-teal-700 mb-1.5">
                  <Plus className="h-4 w-4" />
                </span>
                <span className="text-xs font-bold text-slate-800">New Blog</span>
              </a>

              <a
                href="/dashboard/testimonials"
                onClick={onClose}
                className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white p-3 text-center transition-all hover:bg-teal-50 hover:border-teal-200 active:scale-95 shadow-2xs"
              >
                <span className="grid h-7 w-7 place-items-center rounded-lg bg-amber-50 text-amber-700 mb-1.5">
                  <Plus className="h-4 w-4" />
                </span>
                <span className="text-xs font-bold text-slate-800">Review</span>
              </a>
            </div>
          </div>
        </div>

        {/* Drawer Bottom User Profile & Sign Out */}
        <div className="border-t border-slate-100 p-4 space-y-3 bg-slate-50/50 pb-8 sm:pb-6">
          {user && (
            <div className="flex items-center gap-3 rounded-2xl bg-white p-3 border border-slate-200/80 shadow-2xs">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-tr from-teal-700 to-emerald-600 text-xs font-black text-white shadow-xs">
                {initials}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-bold text-slate-900">{user.name}</p>
                <p className="truncate text-[11px] text-slate-500">{user.email}</p>
              </div>
              <span className="rounded-full bg-teal-50 px-2 py-0.5 text-[10px] font-bold text-teal-800 border border-teal-200/60">
                Admin
              </span>
            </div>
          )}

          <button
            type="button"
            onClick={handleSignOut}
            disabled={isLoggingOut}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-rose-200/90 bg-rose-50/70 py-2.5 text-xs font-bold text-rose-700 hover:bg-rose-100 active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {isLoggingOut ? (
              <LoaderCircle className="h-4 w-4 animate-spin text-rose-700" />
            ) : (
              <LogOut className="h-4 w-4" />
            )}
            <span>Sign Out from Workspace</span>
          </button>

          <div className="flex items-center justify-between px-1 text-[10px] text-slate-400">
            <span className="flex items-center gap-1">
              <ShieldCheck className="h-3 w-3 text-teal-600" />
              <span>SSL Protected</span>
            </span>
            <span>v2.0 Console</span>
          </div>
        </div>
      </div>
    </div>
  );
}

