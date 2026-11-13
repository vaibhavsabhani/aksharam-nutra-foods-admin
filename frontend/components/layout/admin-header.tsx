"use client";

import { useRouter } from "next/navigation";
import { LogOut, LoaderCircle, Menu } from "lucide-react";
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

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200/80 bg-white/95 px-4 backdrop-blur sm:px-6 lg:px-8">
      <div className="flex items-center gap-3">
        {onToggleSidebar && (
          <button
            type="button"
            onClick={onToggleSidebar}
            className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 lg:hidden"
            aria-label="Toggle navigation"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}
        <div className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-teal-700 font-black text-white shadow-sm">
            A
          </span>
          <div>
            <h1 className="text-sm font-bold tracking-tight text-slate-900 sm:text-base">
              Aksharam Nutra Foods
            </h1>
            <p className="hidden text-[11px] font-medium text-slate-500 sm:block">
              Admin Portal
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        {user && (
          <div className="hidden text-right sm:block">
            <p className="text-xs font-semibold text-slate-800">{user.name}</p>
            <p className="text-[11px] text-slate-500">{user.email}</p>
          </div>
        )}

        <Button
          variant="outline"
          size="sm"
          onClick={handleSignOut}
          disabled={isLoading}
          className="border-slate-300 text-slate-700 hover:bg-slate-100 hover:text-slate-900"
        >
          {isLoading ? (
            <LoaderCircle className="h-4 w-4 animate-spin text-teal-700" />
          ) : (
            <LogOut className="h-4 w-4 text-slate-500" />
          )}
          <span className="hidden sm:inline">Sign out</span>
        </Button>
      </div>
    </header>
  );
}

