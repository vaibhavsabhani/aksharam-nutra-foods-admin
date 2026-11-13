"use client";

import { useEffect } from "react";
import {
  X,
  Calendar,
  Clock,
  User,
  CheckCircle2,
  EyeOff,
  Edit,
  Globe,
  Sparkles,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { BlogPost } from "@/types";

interface BlogPreviewModalProps {
  blog: BlogPost | null;
  onClose: () => void;
  onEdit?: (blog: BlogPost) => void;
}

export function BlogPreviewModal({
  blog,
  onClose,
  onEdit,
}: BlogPreviewModalProps) {
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (blog) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [blog, onClose]);

  if (!blog) return null;

  // Calculate estimated reading time
  const textContent = blog.content.replace(/<[^>]*>/g, "");
  const wordCount = textContent.trim().split(/\s+/).filter(Boolean).length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 180));

  const formattedDate = new Date(blog.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-hidden">
      {/* 1. Animated Frosted Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-md transition-opacity animate-in fade-in duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* 2. Animated Modal Window */}
      <div className="relative flex max-h-[92vh] w-full max-w-4xl flex-col rounded-3xl border border-slate-200/90 bg-white shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-5 duration-300 ease-out">
        {/* Modal Header */}
        <div className="border-b border-slate-100 bg-white/95 px-6 py-5 sm:px-8 backdrop-blur-sm shrink-0">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-teal-200/80 bg-teal-50 px-3 py-0.5 text-[11px] font-bold tracking-widest text-teal-800 uppercase">
                  <Sparkles className="h-3 w-3 text-teal-600 animate-pulse" />
                  <span>Article Preview</span>
                </span>

                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-bold border ${
                    blog.isShow
                      ? "border-emerald-200/80 bg-emerald-50 text-emerald-800"
                      : "border-slate-200 bg-slate-100 text-slate-600"
                  }`}
                >
                  {blog.isShow ? (
                    <>
                      <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                      <span>Live on Website</span>
                    </>
                  ) : (
                    <>
                      <EyeOff className="h-3 w-3 text-slate-500" />
                      <span>Draft / Hidden</span>
                    </>
                  )}
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-slate-900 leading-snug line-clamp-2">
                {blog.title}
              </h2>

              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-0.5">
                <span className="flex items-center gap-1.5 font-semibold text-slate-700">
                  <User className="h-3.5 w-3.5 text-teal-700" />
                  <span>By {blog.author?.name || "Aksharam Editorial"}</span>
                </span>

                <span className="text-slate-300">•</span>

                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-slate-400" />
                  <span>{formattedDate}</span>
                </span>

                <span className="text-slate-300">•</span>

                <span className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-slate-400" />
                  <span>{readingTime} min read</span>
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-900 active:scale-95 transition-all shadow-2xs"
              aria-label="Close dialog"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6 sm:px-10 sm:py-8 space-y-6">
          {/* Cover Image Banner with subtle frame */}
          {blog.coverImageUrl && (
            <div className="group relative overflow-hidden rounded-2xl border border-slate-200/80 shadow-xs max-h-[380px] bg-slate-50">
              <img
                src={blog.coverImageUrl}
                alt={blog.title}
                className="w-full object-cover transition-transform duration-500 group-hover:scale-102"
              />
            </div>
          )}

          {/* Formatted Rich HTML from TinyMCE */}
          <div
            className="prose prose-slate max-w-none text-slate-700 leading-relaxed sm:text-base prose-headings:font-black prose-headings:tracking-tight prose-headings:text-slate-900 prose-a:font-semibold prose-a:text-teal-700 hover:prose-a:text-teal-800 prose-img:rounded-2xl prose-img:shadow-md prose-img:my-6 prose-blockquote:border-l-4 prose-blockquote:border-teal-600 prose-blockquote:bg-teal-50/50 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:rounded-r-xl prose-blockquote:italic"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        </div>

        {/* Modal Footer Controls */}
        <div className="border-t border-slate-100 bg-slate-50/80 px-6 py-4 sm:px-8 flex flex-col-reverse sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Globe className="h-4 w-4 text-teal-700 shrink-0" />
            <span>
              {blog.isShow
                ? "This article is accessible to public website visitors."
                : "This article is currently hidden from the public API."}
            </span>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            {onEdit && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  onClose();
                  onEdit(blog);
                }}
                className="flex-1 sm:flex-none gap-1.5 border-slate-300 text-slate-700 hover:bg-slate-100 hover:text-slate-900"
              >
                <Edit className="h-4 w-4 text-teal-700" />
                <span>Edit Article</span>
              </Button>
            )}

            <Button
              size="sm"
              onClick={onClose}
              className="flex-1 sm:flex-none bg-teal-800 hover:bg-teal-900 text-white shadow-xs"
            >
              Close Preview
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

