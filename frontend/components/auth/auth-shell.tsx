import Link from "next/link";
import type { ReactNode } from "react";

export function AuthShell({ eyebrow, title, description, children, footer }: { eyebrow: string; title: string; description: string; children: ReactNode; footer: ReactNode }) {
  return <main className="relative flex min-h-screen overflow-hidden bg-[#f5f8f6] text-slate-900">
    <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-teal-100/60 blur-3xl" />
    <section className="relative hidden w-[44%] flex-col justify-between overflow-hidden bg-teal-950 p-12 text-white lg:flex">
      <Link href="/login" className="flex items-center gap-3 text-lg font-bold tracking-tight"><span className="grid h-10 w-10 place-items-center rounded-xl bg-lime-300 text-teal-950">A</span> Aksharam</Link>
      <div className="max-w-md pb-10"><p className="mb-5 text-sm font-semibold uppercase tracking-[0.24em] text-lime-300">Nourish with intention</p><h2 className="text-5xl font-semibold leading-[1.08] tracking-tight">Good food makes room for a good life.</h2><p className="mt-6 text-base leading-7 text-teal-100/75">A quieter, simpler way to manage your nutrition business.</p></div>
      <p className="text-xs text-teal-100/50">© 2026 Aksharam Nutra Foods</p>
    </section>
    <section className="relative flex w-full items-center justify-center px-5 py-12 sm:px-8 lg:w-[56%]">
      <div className="w-full max-w-md"><div className="mb-8 lg:hidden"><Link href="/login" className="flex items-center gap-3 text-lg font-bold"><span className="grid h-10 w-10 place-items-center rounded-xl bg-teal-700 text-white">A</span> Aksharam</Link></div><p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-teal-700">{eyebrow}</p><h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">{title}</h1><p className="mt-3 text-sm leading-6 text-slate-500">{description}</p><div className="mt-8">{children}</div><div className="mt-8 text-center text-sm text-slate-500">{footer}</div></div>
    </section>
  </main>;
}