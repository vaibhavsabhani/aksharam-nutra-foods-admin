"use client";

import { useRouter } from "next/navigation";
import { LogOut, LoaderCircle, Menu, Shield, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGetMeQuery, useLogoutMutation } from "@/lib/api";

interface AdminHeaderProps {
  onToggleSidebar?: () => void;
}

export function AdminHeader({ onToggleSidebar }: AdminHeaderProps) {
  const router = useRouter();
  const { data: user } = useGetMeQuery();
  const [logout, { isLoading }] = useLogoutMutation();

  async function handleSignOut() {
    const refreshToken =
      typeof window !== "undefined" ? localStorage.getItem("refreshToken") : null;
    try {
      if (refreshToken) await logout({ refreshToken }).unwrap();
    } catch {
      // Ignore network errors on logout
    } finally {
      if (typeof window !== "undefined") {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
      }
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
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200/80 bg-white/95 px-4 backdrop-blur-md sm:px-6 lg:px-8">
      <div className="flex items-center gap-3">
        {onToggleSidebar && (
          <button
            type="button"
            onClick={onToggleSidebar}
            className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors lg:hidden"
            aria-label="Toggle navigation"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-tr from-teal-800 to-emerald-700 font-black text-white shadow-sm shadow-teal-900/20 transition-transform duration-300 hover:scale-105">
            A
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-black tracking-tight text-slate-900 sm:text-base">
                Aksharam Nutra Foods
              </h1>
              <span className="hidden rounded-full bg-teal-50 px-2 py-0.5 text-[10px] font-bold text-teal-800 border border-teal-200/60 sm:inline-block">
                Admin
              </span>
            </div>
            <p className="hidden text-[11px] font-medium text-slate-500 sm:block">
              Content & Nutrition Management Portal
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        {user && (
          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-xs font-bold text-slate-900">{user.name}</p>
              <p className="text-[11px] text-slate-500">{user.email}</p>
            </div>
            <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-tr from-teal-700 to-emerald-600 text-xs font-black text-white shadow-xs">
              {initials}
            </div>
          </div>
        )}

        <Button
          variant="outline"
          size="sm"
          onClick={handleSignOut}
          disabled={isLoading}
          className="h-9 gap-1.5 rounded-xl border-slate-200 text-slate-700 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 transition-colors"
        >
          {isLoading ? (
            <LoaderCircle className="h-4 w-4 animate-spin text-teal-700" />
          ) : (
            <LogOut className="h-4 w-4" />
          )}
          <span className="hidden sm:inline">Sign out</span>
        </Button>
      </div>
    </header>
  );
}
