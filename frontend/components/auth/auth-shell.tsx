"use client";

import Link from "next/link";
import { type ReactNode, useState } from "react";
import { Sparkles, Leaf, ShieldCheck, HeartHandshake } from "lucide-react";
import { AnimatedBrandCanvas } from "./animated-brand-canvas";

interface AuthShellProps {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
  footer: ReactNode;
}

export function AuthShell({
  eyebrow,
  title,
  description,
  children,
  footer,
}: AuthShellProps) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <main className="relative flex min-h-screen overflow-hidden bg-[#f4f7f5] text-slate-900">
      {/* ---------------- LEFT PANEL: 3D ANIMATED BRAND EXPERIENCE ---------------- */}
      <section className="relative hidden w-[46%] flex-col justify-between overflow-hidden bg-[#02231c] p-10 text-white lg:flex xl:p-14">
        {/* Deep ambient backdrop gradients */}
        <div className="pointer-events-none absolute -left-20 -top-20 h-96 w-96 rounded-full bg-teal-500/15 blur-[120px]" />
        <div className="pointer-events-none absolute -bottom-20 -right-20 h-96 w-96 rounded-full bg-lime-400/10 blur-[130px]" />
        <div className="pointer-events-none absolute top-1/2 left-1/3 h-72 w-72 -translate-y-1/2 rounded-full bg-emerald-600/10 blur-[100px]" />

        {/* Interactive 3D Canvas */}
        <AnimatedBrandCanvas />

        {/* Brand Header */}
        <div className="relative z-10 flex items-center justify-between">
          <Link
            href="/login"
            className="group flex items-center gap-3 text-lg font-bold tracking-tight"
          >
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-tr from-lime-400 via-lime-300 to-emerald-300 font-black text-teal-950 shadow-lg shadow-lime-400/20 transition-transform duration-300 group-hover:scale-105">
              A
            </span>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-white">
                Aksharam
              </span>
              <span className="block text-[11px] font-medium tracking-wider text-teal-200/70 uppercase">
                Nutra Foods
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-1.5 rounded-full border border-teal-500/20 bg-teal-900/40 px-3 py-1 text-xs font-medium text-teal-200 backdrop-blur-md">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span>Admin Portal</span>
          </div>
        </div>

        {/* Hero Narrative with Floating Accents */}
        <div className="relative z-10 my-auto max-w-lg py-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-lime-400/30 bg-lime-400/10 px-3.5 py-1.5 text-xs font-bold tracking-[0.2em] text-lime-300 uppercase backdrop-blur-md shadow-xs">
            <Leaf className="h-3.5 w-3.5 text-lime-300 animate-pulse" />
            <span>Nourish with intention</span>
          </div>

          <h2 className="mt-5 text-4xl font-extrabold leading-[1.12] tracking-tight text-white sm:text-5xl">
            Good food makes room for a{" "}
            <span className="bg-gradient-to-r from-lime-300 via-emerald-300 to-teal-200 bg-clip-text text-transparent">
              good life.
            </span>
          </h2>

          <p className="mt-5 text-base leading-relaxed text-teal-100/80 font-normal">
            A quieter, simpler, and beautifully focused workspace to manage your
            nutrition products, recipes, wellness insights, and customer
            stories.
          </p>

          {/* Floating Feature Badges */}
          <div className="mt-8 flex flex-wrap gap-2.5">
            <div className="animate-float-slow flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-teal-100 backdrop-blur-md">
              <ShieldCheck className="h-3.5 w-3.5 text-lime-300" />
              <span>Enterprise Grade Security</span>
            </div>
            <div className="animate-float-reverse flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-teal-100 backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 text-emerald-300" />
              <span>Realtime Content Management</span>
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-teal-100 backdrop-blur-md">
              <HeartHandshake className="h-3.5 w-3.5 text-teal-300" />
              <span>Verified Testimonials</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 flex items-center justify-between border-t border-teal-800/40 pt-6 text-xs text-teal-200/50">
          <p>© 2026 Aksharam Nutra Foods Inc.</p>
          <p className="text-teal-300/60 font-mono text-[11px]">
            Secure Workspace v2.0
          </p>
        </div>
      </section>

      {/* ---------------- RIGHT PANEL: POLISHED ENTERPRISE CARD ---------------- */}
      <section
        onMouseMove={handleMouseMove}
        className="relative flex w-full flex-col items-center justify-center min-h-screen px-4 py-12 sm:px-8 lg:w-[54%] xl:px-16 overflow-hidden bg-[#f8faf9]"
      >
        {/* Subtle Luxury Dot Grid Pattern */}
        <div
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(#0d9488 1.2px, transparent 1.2px)",
            backgroundSize: "24px 24px",
          }}
        />

        {/* Ambient Luminous Halo Behind Card */}
        <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-gradient-to-tr from-teal-200/25 via-emerald-100/20 to-transparent blur-[110px]" />

        {/* Interactive Subtle Cursor Glow */}
        <div
          className="pointer-events-none absolute -inset-px opacity-50 transition-opacity duration-300"
          style={{
            background: `radial-gradient(550px circle at ${mousePos.x}px ${mousePos.y}px, rgba(20, 184, 166, 0.08), transparent 80%)`,
          }}
        />

        {/* Unified Card Container */}
        <div className="relative z-10 w-full max-w-[460px]">
          {/* Mobile Brand Identity */}
          <div className="mb-6 flex items-center justify-between lg:hidden">
            <Link
              href="/login"
              className="flex items-center gap-2.5 text-base font-bold"
            >
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-teal-700 font-bold text-white shadow-xs">
                A
              </span>
              <span className="font-extrabold text-slate-900">
                Aksharam Nutra Foods
              </span>
            </Link>
            <span className="rounded-full bg-teal-50 px-2.5 py-0.5 text-[11px] font-semibold text-teal-700">
              Admin Portal
            </span>
          </div>

          {/* Elevated Unified Surface */}
          <div className="rounded-3xl border border-slate-200/90 bg-white p-7 sm:p-9 shadow-[0_12px_40px_-8px_rgba(2,44,34,0.07),0_2px_6px_-2px_rgba(2,44,34,0.03)] backdrop-blur-md transition-all duration-300 hover:border-teal-300/50 hover:shadow-[0_16px_45px_-8px_rgba(2,44,34,0.1)]">
            {/* Header integrated inside card */}
            <div className="border-b border-slate-100 pb-5">
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-1.5 rounded-full border border-teal-200/80 bg-teal-50/90 px-3 py-1 text-[11px] font-bold tracking-widest text-teal-800 uppercase shadow-2xs">
                  <span className="h-1.5 w-1.5 rounded-full bg-teal-600 animate-pulse" />
                  <span>{eyebrow}</span>
                </div>
                <div className="flex items-center gap-1 text-[11px] font-medium text-slate-600">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  <span>256-Bit SSL</span>
                </div>
              </div>

              <h1 className="mt-3.5 text-2xl sm:text-[28px] font-black tracking-tight text-slate-900 leading-snug">
                {title}
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-slate-500 leading-relaxed">
                {description}
              </p>
            </div>

            {/* Form Fields & Actions */}
            <div className="pt-5">{children}</div>

            {/* Footer Action inside card */}
            {footer && (
              <div className="mt-6 border-t border-slate-100 pt-5 text-center text-xs text-slate-500">
                {footer}
              </div>
            )}
          </div>

          {/* Bottom Trust Badge */}
          <div className="mt-5 flex items-center justify-center gap-2 text-center text-[11px] text-slate-600">
            <ShieldCheck className="h-3.5 w-3.5 text-teal-700" />
            <span>Authorized access only • Secured by Aksharam Guard</span>
          </div>
        </div>
      </section>
    </main>
  );
}
