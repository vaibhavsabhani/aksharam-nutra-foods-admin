"use client";

import { useState } from "react";
import { AdminHeader } from "./admin-header";
import { AdminSidebar } from "./admin-sidebar";
import { MobileNav } from "./mobile-nav";
import { AnimatedDashboardCanvas } from "@/components/dashboard/animated-dashboard-canvas";

interface AdminShellProps {
  children: React.ReactNode;
}

export function AdminShell({ children }: AdminShellProps) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-[#f8faf9] text-slate-900">
      {/* 1. Fixed Top Header */}
      <div className="shrink-0 z-30">
        <AdminHeader onToggleSidebar={() => setMobileSidebarOpen(true)} />
      </div>

      {/* 2. Workspace Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Fixed Sidebar */}
        <div className="hidden h-full w-64 shrink-0 lg:block">
          <AdminSidebar />
        </div>

        {/* Animated Mobile & Tablet Drawer */}
        <MobileNav
          isOpen={mobileSidebarOpen}
          onClose={() => setMobileSidebarOpen(false)}
        />

        {/* 3. Main Content Area (Independent Smooth Scrolling) */}
        <main
          onMouseMove={handleMouseMove}
          className="relative flex-1 h-full overflow-y-auto px-4 py-8 sm:px-8 lg:px-12"
        >
          {/* Subtle Ambient Background Canvas */}
          <AnimatedDashboardCanvas />

          {/* Interactive Cursor Spotlight */}
          <div
            className="pointer-events-none absolute -inset-px opacity-30 transition-opacity duration-300"
            style={{
              background: `radial-gradient(700px circle at ${mousePos.x}px ${mousePos.y}px, rgba(13, 148, 136, 0.06), transparent 75%)`,
            }}
          />

          {/* Page Content with Smooth Entrance Animation */}
          <div className="relative z-10 mx-auto max-w-6xl pb-20 animate-in fade-in slide-in-from-bottom-2 duration-400">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
