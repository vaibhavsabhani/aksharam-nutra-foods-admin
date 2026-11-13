"use client";

import { useEffect, useState } from "react";
import {
  PenTool,
  MessageSquareQuote,
  ArrowRight,
  Sparkles,
  BookOpen,
  CheckCircle2,
  Eye,
  TrendingUp,
  Clock,
  Plus,
} from "lucide-react";
import { MetricCard } from "@/components/dashboard/metric-card";
import { useGetBlogsQuery, useGetTestimonialsQuery, useGetMeQuery } from "@/lib/api";

export default function DashboardOverviewPage() {
  const { data: user } = useGetMeQuery();
  const { data: blogs = [], isLoading: blogsLoading } = useGetBlogsQuery();
  const { data: testimonials = [], isLoading: testimonialsLoading } = useGetTestimonialsQuery();

  const [greeting, setGreeting] = useState("Welcome back");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  const publishedBlogs = blogs.filter((b) => b.isShow).length;
  const publishedTestimonials = testimonials.filter((t) => t.isShow).length;
  const blogRatio = blogs.length ? Math.round((publishedBlogs / blogs.length) * 100) : 0;
  const testimonialRatio = testimonials.length ? Math.round((publishedTestimonials / testimonials.length) * 100) : 0;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-500">
      {/* ---------------- 1. HERO BANNER WITH ANIMATED BOTANICAL GLOW ---------------- */}
      <div className="relative overflow-hidden rounded-3xl border border-teal-800/40 bg-gradient-to-r from-[#022c22] via-[#064e3b] to-[#042f2e] p-7 text-white shadow-xl shadow-teal-950/15 sm:p-10">
        {/* Ambient floating blurred light spheres */}
        <div className="pointer-events-none absolute -right-16 -top-16 h-72 w-72 rounded-full bg-lime-400/15 blur-3xl animate-pulse-glow" />
        <div className="pointer-events-none absolute -bottom-16 left-1/3 h-64 w-64 rounded-full bg-teal-400/20 blur-3xl animate-float-slow" />

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-lime-400/30 bg-lime-400/10 px-3.5 py-1 text-xs font-bold tracking-widest text-lime-300 uppercase backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 text-lime-300 animate-pulse" />
            <span>Admin Executive Console</span>
          </div>

          <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl text-white">
            {greeting}
            {user?.name ? `, ${user.name}` : ""}!
          </h2>

          <p className="mt-3 text-sm sm:text-base text-teal-100/85 leading-relaxed font-normal">
            Your live central hub for Aksharam Nutra Foods. Publish rich nutrition articles, manage
            product recipes, and curate genuine customer testimonials.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="/dashboard/blogs"
              className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-lime-400 to-emerald-300 px-5 py-2.5 text-sm font-bold text-teal-950 shadow-md shadow-lime-400/20 transition-all duration-200 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]"
            >
              <PenTool className="h-4 w-4 text-teal-950 transition-transform group-hover:rotate-12" />
              <span>Create Blog Post</span>
            </a>

            <a
              href="/dashboard/testimonials"
              className="inline-flex items-center gap-2 rounded-xl border border-teal-400/40 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-200 hover:bg-white/20 active:scale-[0.98]"
            >
              <MessageSquareQuote className="h-4 w-4 text-teal-300" />
              <span>Manage Testimonials</span>
            </a>
          </div>
        </div>
      </div>

      {/* ---------------- 2. ANIMATED KPI STATS ---------------- */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <MetricCard
          title="Total Blog Posts"
          value={blogsLoading ? "..." : blogs.length}
          subtitle="articles created"
          icon={<BookOpen className="h-5 w-5" />}
          iconBg="bg-teal-50"
          iconColor="text-teal-700"
          progressPercent={blogRatio}
          highlightText={`${publishedBlogs} Live on Website (${blogRatio}%)`}
          linkHref="/dashboard/blogs"
          linkLabel="Manage Blogs"
        />

        <MetricCard
          title="Customer Testimonials"
          value={testimonialsLoading ? "..." : testimonials.length}
          subtitle="reviews recorded"
          icon={<MessageSquareQuote className="h-5 w-5" />}
          iconBg="bg-amber-50"
          iconColor="text-amber-700"
          progressPercent={testimonialRatio}
          highlightText={`${publishedTestimonials} Publicly Visible (${testimonialRatio}%)`}
          linkHref="/dashboard/testimonials"
          linkLabel="Manage Testimonials"
        />

        {/* Quick Launchpad Card */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs sm:col-span-2 lg:col-span-1 transition-all duration-300 hover:border-teal-300/60 hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Content Shortcuts
            </span>
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-50 text-emerald-700">
              <Sparkles className="h-5 w-5" />
            </span>
          </div>

          <div className="mt-4 space-y-2.5">
            <a
              href="/dashboard/blogs"
              className="group flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/60 p-3 transition-all duration-200 hover:bg-teal-50/70 hover:border-teal-200/70"
            >
              <div className="flex items-center gap-2.5">
                <span className="grid h-7 w-7 place-items-center rounded-lg bg-teal-100 text-teal-800 transition-transform group-hover:scale-110">
                  <Plus className="h-3.5 w-3.5" />
                </span>
                <span className="text-xs font-bold text-slate-800 group-hover:text-teal-900">
                  New Nutrition Post
                </span>
              </div>
              <ArrowRight className="h-3.5 w-3.5 text-slate-400 transition-transform group-hover:translate-x-1 group-hover:text-teal-700" />
            </a>

            <a
              href="/dashboard/testimonials"
              className="group flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/60 p-3 transition-all duration-200 hover:bg-teal-50/70 hover:border-teal-200/70"
            >
              <div className="flex items-center gap-2.5">
                <span className="grid h-7 w-7 place-items-center rounded-lg bg-amber-100 text-amber-800 transition-transform group-hover:scale-110">
                  <Plus className="h-3.5 w-3.5" />
                </span>
                <span className="text-xs font-bold text-slate-800 group-hover:text-teal-900">
                  Add Customer Review
                </span>
              </div>
              <ArrowRight className="h-3.5 w-3.5 text-slate-400 transition-transform group-hover:translate-x-1 group-hover:text-teal-700" />
            </a>
          </div>
        </div>
      </div>

      {/* ---------------- 3. RECENT ACTIVITY LIST ---------------- */}
      <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs transition-all duration-300">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-base sm:text-lg font-black tracking-tight text-slate-900">
              Latest Blog Content
            </h3>
            <p className="text-xs text-slate-500">Articles published on your platform</p>
          </div>
          <a
            href="/dashboard/blogs"
            className="group inline-flex items-center gap-1 text-xs font-bold text-teal-700 hover:text-teal-900"
          >
            <span>View all articles ({blogs.length})</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </a>
        </div>

        <div className="mt-4 divide-y divide-slate-100">
          {blogs.slice(0, 5).map((post) => (
            <div
              key={post.id}
              className="group flex items-center justify-between py-3.5 px-2 rounded-xl transition-colors hover:bg-slate-50/80"
            >
              <div className="flex items-center gap-3.5 pr-4">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-teal-50 text-teal-700 font-bold text-xs transition-transform group-hover:scale-105">
                  <BookOpen className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-sm font-bold text-slate-800 line-clamp-1 group-hover:text-teal-900 transition-colors">
                    {post.title}
                  </p>
                  <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                    <Clock className="h-3 w-3" />
                    <span>
                      {new Date(post.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </p>
                </div>
              </div>

              <span
                className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                  post.isShow
                    ? "bg-emerald-50 text-emerald-800 border border-emerald-200/60"
                    : "bg-slate-100 text-slate-600 border border-slate-200"
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    post.isShow ? "bg-emerald-500 animate-pulse" : "bg-slate-400"
                  }`}
                />
                <span>{post.isShow ? "Published" : "Draft"}</span>
              </span>
            </div>
          ))}

          {blogs.length === 0 && !blogsLoading && (
            <div className="py-12 text-center">
              <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-teal-50 text-teal-700 mb-3">
                <BookOpen className="h-6 w-6" />
              </span>
              <p className="text-sm font-bold text-slate-700">No blog posts yet</p>
              <p className="text-xs text-slate-400 mt-1">
                Click "Create Blog Post" to publish your first article.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
