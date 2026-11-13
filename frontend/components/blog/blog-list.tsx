"use client";

import { useState } from "react";
import {
  BookOpen,
  Calendar,
  Trash2,
  Eye,
  EyeOff,
  Edit,
  LoaderCircle,
  CheckCircle2,
} from "lucide-react";
import {
  useGetBlogsQuery,
  useDeleteBlogMutation,
  useToggleBlogVisibilityMutation,
  BlogPost,
} from "@/lib/api";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { BlogPreviewModal } from "./blog-preview-modal";

interface BlogListProps {
  onEdit?: (blog: BlogPost) => void;
}

export function BlogList({ onEdit }: BlogListProps) {
  const { data: blogs, isLoading, isError } = useGetBlogsQuery();
  const [deleteBlog, { isLoading: isDeleting }] = useDeleteBlogMutation();
  const [toggleVisibility, { isLoading: isToggling }] = useToggleBlogVisibilityMutation();
  const [selectedBlog, setSelectedBlog] = useState<BlogPost | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<BlogPost | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      setDeleteError(null);
      await deleteBlog(deleteTarget.id).unwrap();
      const deletedTitle = deleteTarget.title;
      setDeleteTarget(null);
      setActionSuccess(`Blog "${deletedTitle}" was successfully deleted.`);
      setTimeout(() => setActionSuccess(null), 4000);
    } catch (err: unknown) {
      const errorMsg =
        (err as { data?: { message?: string } })?.data?.message ||
        "Failed to delete the blog post. Please try again.";
      setDeleteError(errorMsg);
    }
  };

  const handleToggle = async (id: number, currentStatus: boolean, title: string) => {
    try {
      await toggleVisibility(id).unwrap();
      setActionSuccess(
        `"${title}" is now ${!currentStatus ? "visible on website" : "hidden from website"}.`
      );
      setTimeout(() => setActionSuccess(null), 4000);
    } catch {
      setActionError("Failed to toggle blog visibility. Please try again.");
      setTimeout(() => setActionError(null), 4000);
    }
  };

  const handleEditClick = (blog: BlogPost) => {
    if (onEdit) {
      onEdit(blog);
      // Smoothly scroll to the form
      const el = document.getElementById("blog-form-section");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="mt-12 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/80 pb-4">
        <div>
          <h3 className="text-xl font-bold tracking-tight text-slate-900">
            Published Blogs
          </h3>
          <p className="text-sm text-slate-500">
            Manage blogs, toggle website visibility (isShow), edit in TinyMCE, or delete.
          </p>
        </div>

        {blogs && blogs.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700">
              {blogs.length} {blogs.length === 1 ? "Total Post" : "Total Posts"}
            </span>
            <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
              {blogs.filter((b) => b.isShow).length} Active (isShow: true)
            </span>
          </div>
        )}
      </div>

      {actionSuccess && (
        <div className="flex items-center gap-2 rounded-xl border border-teal-200 bg-teal-50/80 px-4 py-3 text-xs font-medium text-teal-800 animate-in fade-in">
          <CheckCircle2 size={16} className="text-teal-600 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {actionError && (
        <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50/80 px-4 py-3 text-xs font-medium text-rose-800 animate-in fade-in">
          <span>{actionError}</span>
        </div>
      )}

      {isLoading && (
        <div className="flex items-center justify-center py-12 text-slate-400">
          <LoaderCircle className="h-6 w-6 animate-spin text-teal-600 mr-2" />
          <span className="text-sm">Loading blog posts...</span>
        </div>
      )}

      {isError && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          Could not load published blogs.
        </div>
      )}

      {!isLoading && (!blogs || blogs.length === 0) && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300/80 bg-white p-12 text-center">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-teal-50 text-teal-700 mb-4">
            <BookOpen size={24} />
          </div>
          <h4 className="text-base font-semibold text-slate-800">No blog posts yet</h4>
          <p className="mt-1 text-sm text-slate-500 max-w-sm">
            Use the form above to write your first blog post with TinyMCE rich-text editor.
          </p>
        </div>
      )}

      {blogs && blogs.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {blogs.map((blog) => (
            <div
              key={blog.id}
              className="flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs hover:shadow-md transition-all group"
            >
              <div className="space-y-3">
                {blog.coverImageUrl && (
                  <img
                    src={blog.coverImageUrl}
                    alt={blog.title}
                    className="h-44 w-full rounded-xl object-cover"
                  />
                )}

                {/* Header with Date, Author & isShow status */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Calendar size={13} className="text-teal-600" />
                    <span>{formatDate(blog.createdAt)}</span>
                    {blog.author?.name && (
                      <>
                        <span>•</span>
                        <span className="font-medium text-slate-700">{blog.author.name}</span>
                      </>
                    )}
                  </div>

                  {/* isShow Status Badge */}
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold transition-colors ${
                      blog.isShow
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        blog.isShow ? "bg-emerald-500" : "bg-slate-400"
                      }`}
                    />
                    {blog.isShow ? "Visible" : "Hidden"}
                  </span>
                </div>

                <h4 className="text-lg font-bold text-slate-900 line-clamp-2">
                  {blog.title}
                </h4>

                {/* Plain text preview snippet */}
                <div className="text-sm text-slate-600 line-clamp-3 leading-relaxed">
                  {blog.content.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim()}
                </div>
              </div>

              {/* Bottom Actions: Toggle Visibility, Edit, Delete, Read */}
              <div className="mt-6 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-4">
                <div className="flex items-center gap-1.5">
                  {/* Quick isShow Toggle */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggle(blog.id, blog.isShow, blog.title)}
                    disabled={isToggling}
                    className={`text-xs h-8 px-2.5 ${
                      blog.isShow
                        ? "text-slate-600 hover:text-amber-700 hover:border-amber-300"
                        : "text-emerald-700 border-emerald-300 bg-emerald-50/50 hover:bg-emerald-100"
                    }`}
                    title={blog.isShow ? "Click to hide from website" : "Click to show on website"}
                  >
                    {blog.isShow ? <EyeOff size={13} /> : <Eye size={13} />}
                    {blog.isShow ? "Hide" : "Show"}
                  </Button>

                  {/* Edit Button */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditClick(blog)}
                    className="text-xs h-8 px-2.5 text-teal-700 hover:bg-teal-50 hover:border-teal-300"
                  >
                    <Edit size={13} />
                    Edit
                  </Button>

                  {/* Read Post Modal */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedBlog(blog)}
                    className="text-xs h-8 px-2 text-slate-600 hover:text-slate-900"
                  >
                    Preview
                  </Button>
                </div>

                {/* Delete Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setDeleteTarget(blog);
                    setDeleteError(null);
                  }}
                  disabled={isDeleting && deleteTarget?.id === blog.id}
                  className="text-xs h-8 px-2 text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                >
                  <Trash2 size={13} />
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Animated Magazine Blog Preview Dialog */}
      <BlogPreviewModal
        blog={selectedBlog}
        onClose={() => setSelectedBlog(null)}
        onEdit={onEdit}
      />

      {/* Animated Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => {
          if (!isDeleting) {
            setDeleteTarget(null);
            setDeleteError(null);
          }
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Blog Post?"
        description="Are you sure you want to permanently delete this blog post? This action cannot be undone and will immediately purge the article and its cover image from your website."
        itemName={deleteTarget?.title}
        itemType="Blog Article"
        confirmText="Delete Permanently"
        tone="danger"
        isLoading={isDeleting}
        error={deleteError}
      />
    </div>
  );
}
