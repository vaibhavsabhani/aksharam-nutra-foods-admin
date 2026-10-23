"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, LoaderCircle, LogOut, MessageSquareQuote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Testimonial, useGetMeQuery, useLogoutMutation } from "@/lib/api";
import { TestimonialForm } from "@/components/testimonial/testimonial-form";
import { TestimonialList } from "@/components/testimonial/testimonial-list";

export default function TestimonialsPage() {
  const router = useRouter();
  const { data: user } = useGetMeQuery();
  const [logout, { isLoading }] = useLogoutMutation();
  const [editing, setEditing] = useState<Testimonial | null>(null);
  useEffect(() => { if (!localStorage.getItem("accessToken")) router.replace("/login"); }, [router]);
  async function signOut() { const refreshToken = localStorage.getItem("refreshToken"); try { if (refreshToken) await logout({ refreshToken }).unwrap(); } finally { localStorage.removeItem("accessToken"); localStorage.removeItem("refreshToken"); router.replace("/login"); } }
  return <main className="min-h-screen bg-[#f5f8f6] px-4 py-8 text-slate-900 sm:px-8 lg:px-12"><header className="mx-auto flex max-w-6xl items-center justify-between border-b border-slate-200/60 pb-6"><div className="flex items-center gap-3 text-lg font-bold"><span className="grid h-10 w-10 place-items-center rounded-xl bg-teal-700 text-white">A</span>Aksharam Nutra Foods</div><div className="flex items-center gap-4"><span className="hidden text-right text-sm sm:block">{user?.name}<br /><span className="text-xs text-slate-500">{user?.email}</span></span><Button variant="outline" size="sm" onClick={signOut} disabled={isLoading}>{isLoading ? <LoaderCircle className="animate-spin" size={16} /> : <LogOut size={16} />}Sign out</Button></div></header><div className="mx-auto mt-10 max-w-6xl"><Button variant="ghost" size="sm" onClick={() => router.push("/dashboard")}><ArrowLeft size={16} />Back to dashboard</Button><div className="mb-8 mt-5"><div className="inline-flex items-center gap-2 rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700"><MessageSquareQuote size={14} />Testimonial Management</div><h1 className="mt-3 text-3xl font-extrabold tracking-tight">Customer voices, kept current.</h1><p className="mt-2 text-slate-600">Add, edit, publish, hide, or remove testimonials independently from blog content.</p></div><TestimonialForm editing={editing} onCancel={() => setEditing(null)} onSuccess={() => setEditing(null)} /><TestimonialList onEdit={setEditing} /></div></main>;
}