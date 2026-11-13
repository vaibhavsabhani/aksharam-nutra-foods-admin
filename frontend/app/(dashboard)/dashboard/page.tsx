"use client";

import Link from "next/navigation";
import {
  PenTool,
  MessageSquareQuote,
  ArrowRight,
  Sparkles,
  BookOpen,
  CheckCircle2,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGetBlogsQuery, useGetTestimonialsQuery, useGetMeQuery } from "@/lib/api";

export default function DashboardOverviewPage() {
  const { data: user } = useGetMeQuery();
  const { data: blogs = [], isLoading: blogsLoading } = useGetBlogsQuery();
  const { data: testimonials = [], isLoading: testimonialsLoading } = useGetTestimonialsQuery();

  const publishedBlogs = blogs.filter((b) => b.isShow).length;
  const publishedTestimonials = testimonials.filter((t) => t.isShow).length;

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="rounded-2xl border border-teal-100 bg-gradient-to-r from-teal-800 to-teal-950 p-6 text-white shadow-sm sm:p-8">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-teal-700/60 px-3 py-1 text-xs font-semibold text-teal-100 backdrop-blur-xs">
            <Sparkles className="h-3.5 w-3.5 text-teal-300" />
            <span>Admin Overview</span>
          </div>
          <h2 className="mt-3 text-2xl font-black tracking-tight sm:text-3xl">
            Welcome back{user?.name ? `, ${user.name}` : ""}!
          </h2>
          <p className="mt-2 text-sm text-teal-100/90 leading-relaxed">
            Manage your food & nutrition content, publish recipes and blog posts, and curate customer
            testimonials for the Aksharam Nutra Foods platform.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <a
              href="/dashboard/blogs"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-bold text-teal-900 shadow-xs hover:bg-teal-50 transition-colors"
            >
              <PenTool className="h-4 w-4 text-teal-700" />
              Write New Blog
            </a>
            <a
              href="/dashboard/testimonials"
              className="inline-flex items-center gap-2 rounded-xl border border-teal-400/40 bg-teal-800/60 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700/70 transition-colors"
            >
              <MessageSquareQuote className="h-4 w-4 text-teal-300" />
              Manage Testimonials
            </a>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {/* Blogs Card */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total Blog Posts
            </span>
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-teal-50 text-teal-700">
              <BookOpen className="h-5 w-5" />
            </span>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">
              {blogsLoading ? "..." : blogs.length}
            </span>
            <span className="text-xs font-medium text-slate-500">posts created</span>
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-600">
            <span className="flex items-center gap-1.5 text-teal-700 font-medium">
              <Eye className="h-3.5 w-3.5" />
              {publishedBlogs} Live on Website
            </span>
            <a
              href="/dashboard/blogs"
              className="inline-flex items-center gap-1 font-semibold text-teal-700 hover:text-teal-800"
            >
              Manage <ArrowRight className="h-3 w-3" />
            </a>
          </div>
        </div>

        {/* Testimonials Card */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Customer Testimonials
            </span>
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-amber-50 text-amber-700">
              <MessageSquareQuote className="h-5 w-5" />
            </span>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">
              {testimonialsLoading ? "..." : testimonials.length}
            </span>
            <span className="text-xs font-medium text-slate-500">reviews added</span>
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-600">
            <span className="flex items-center gap-1.5 text-amber-700 font-medium">
              <CheckCircle2 className="h-3.5 w-3.5" />
              {publishedTestimonials} Visible
            </span>
            <a
              href="/dashboard/testimonials"
              className="inline-flex items-center gap-1 font-semibold text-teal-700 hover:text-teal-800"
            >
              Manage <ArrowRight className="h-3 w-3" />
            </a>
          </div>
        </div>

        {/* Quick Tips */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs sm:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Quick Actions
            </span>
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-slate-100 text-slate-700">
              <Sparkles className="h-5 w-5 text-teal-600" />
            </span>
          </div>
          <div className="mt-4 space-y-2.5 text-xs text-slate-600">
            <a
              href="/dashboard/blogs"
              className="flex items-center justify-between rounded-lg border border-slate-100 p-2.5 hover:bg-slate-50 transition-colors"
            >
              <span className="font-medium text-slate-800">Add Nutrition Article</span>
              <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
            </a>
            <a
              href="/dashboard/testimonials"
              className="flex items-center justify-between rounded-lg border border-slate-100 p-2.5 hover:bg-slate-50 transition-colors"
            >
              <span className="font-medium text-slate-800">Review Feedback</span>
              <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
            </a>
          </div>
        </div>
      </div>

      {/* Recent Content Preview */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Recent Blog Posts</h3>
            <p className="text-xs text-slate-500">Latest content saved in your portal</p>
          </div>
          <a
            href="/dashboard/blogs"
            className="text-xs font-semibold text-teal-700 hover:text-teal-800"
          >
            View all ({blogs.length})
          </a>
        </div>

        <div className="mt-4 divide-y divide-slate-100">
          {blogs.slice(0, 4).map((post) => (
            <div key={post.id} className="flex items-center justify-between py-3">
              <div className="pr-4">
                <p className="text-sm font-semibold text-slate-800 line-clamp-1">{post.title}</p>
                <p className="text-xs text-slate-400">
                  {new Date(post.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
              <span
                className={`inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                  post.isShow
                    ? "bg-teal-50 text-teal-700"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                {post.isShow ? "Published" : "Draft"}
              </span>
            </div>
          ))}

          {blogs.length === 0 && !blogsLoading && (
            <p className="py-6 text-center text-xs text-slate-400">
              No blog posts published yet. Click "Write New Blog" to get started!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

