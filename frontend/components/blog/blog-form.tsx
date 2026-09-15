"use client";

import { useEffect, useState } from "react";
import {
  Send,
  LoaderCircle,
  CheckCircle2,
  RotateCcw,
  Sparkles,
  Edit3,
  X,
  Eye,
  EyeOff,
  ImagePlus,
} from "lucide-react";
import { BlogEditor } from "./blog-editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert } from "@/components/ui/alert";
import {
  BlogPost,
  useCreateBlogMutation,
  useUpdateBlogMutation,
  useUploadBlogImageMutation,
} from "@/lib/api";

interface BlogFormProps {
  editingBlog?: BlogPost | null;
  onCancelEdit?: () => void;
  onSuccess?: () => void;
}

export function BlogForm({
  editingBlog = null,
  onCancelEdit,
  onSuccess,
}: BlogFormProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isShow, setIsShow] = useState(true);
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [createBlog, { isLoading: isCreating }] = useCreateBlogMutation();
  const [updateBlog, { isLoading: isUpdating }] = useUpdateBlogMutation();
  const [uploadBlogImage, { isLoading: isUploadingImage }] = useUploadBlogImageMutation();

  const isSaving = isCreating || isUpdating || isUploadingImage;
  const isEditing = Boolean(editingBlog);

  // Synchronize when editingBlog changes
  useEffect(() => {
    if (editingBlog) {
      setTitle(editingBlog.title);
      setContent(editingBlog.content);
      setIsShow(editingBlog.isShow ?? true);
      setCoverImageUrl(editingBlog.coverImageUrl ?? "");
      setValidationError(null);
      setSuccessMessage(null);
    } else {
      handleReset();
    }
  }, [editingBlog]);

  const handleReset = () => {
    setTitle("");
    setContent("");
    setIsShow(true);
    setCoverImageUrl("");
    setValidationError(null);
  };

  const handleCancel = () => {
    handleReset();
    if (onCancelEdit) onCancelEdit();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    setSuccessMessage(null);

    const trimmedTitle = title.trim();
    // Strip HTML tags to verify actual text or media exists
    const strippedContent = content.replace(/<[^>]*>/g, "").trim();

    if (!trimmedTitle) {
      setValidationError("Please enter a blog name / title.");
      return;
    }

    if (!strippedContent && !content.includes("<img") && !content.includes("<iframe")) {
      setValidationError("Please write some content for your blog post.");
      return;
    }

    try {
      if (isEditing && editingBlog) {
        await updateBlog({
          id: editingBlog.id,
          title: trimmedTitle,
          content,
          coverImageUrl: coverImageUrl || undefined,
          isShow,
        }).unwrap();

        setSuccessMessage(`Blog post "${trimmedTitle}" updated successfully!`);
        if (onSuccess) onSuccess();
      } else {
        await createBlog({
          title: trimmedTitle,
          content,
          coverImageUrl: coverImageUrl || undefined,
          isShow,
        }).unwrap();

        setSuccessMessage(`Blog post "${trimmedTitle}" published successfully!`);
        handleReset();
        if (onSuccess) onSuccess();
      }

      // Auto clear success message after 5 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
    } catch (err: any) {
      const errorMessage =
        err?.data?.message ||
        err?.message ||
        "Failed to save blog post. Please check your connection and try again.";
      setValidationError(
        typeof errorMessage === "string" ? errorMessage : "Could not process blog."
      );
    }
  };

  return (
    <div
      id="blog-form-section"
      className={`rounded-2xl border bg-white p-6 sm:p-8 shadow-xs transition-colors ${
        isEditing
          ? "border-teal-500 ring-2 ring-teal-500/10"
          : "border-slate-200/80"
      }`}
    >
      <div className="mb-6 flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-teal-700">
            {isEditing ? <Edit3 size={18} /> : <Sparkles size={18} />}
            <span className="text-xs font-bold uppercase tracking-wider">
              {isEditing ? `Editing Post #${editingBlog?.id}` : "Blog Creator"}
            </span>
          </div>

          {isEditing && (
            <button
              type="button"
              onClick={handleCancel}
              className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition"
            >
              <X size={14} />
              Cancel Edit
            </button>
          )}
        </div>

        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          {isEditing ? "Edit Blog Post" : "Write & Publish Blog"}
        </h2>
        <p className="text-sm text-slate-500">
          {isEditing
            ? "Modify the title, TinyMCE content, or toggle visibility flag for this post."
            : "Craft rich blog posts with headings, rich text formatting, lists, tables, links, and media."}
        </p>
      </div>

      {validationError && (
        <div className="mb-6">
          <Alert tone="error">{validationError}</Alert>
        </div>
      )}

      {successMessage && (
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
          <span>{successMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 1. Blog Name */}
        <div className="space-y-2">
          <label htmlFor="blog-name" className="block text-sm font-semibold text-slate-800">
            Blog Name <span className="text-rose-500">*</span>
          </label>
          <Input
            id="blog-name"
            type="text"
            placeholder="e.g. 10 Proven Health Benefits of Cold-Pressed Nut Oils"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (validationError) setValidationError(null);
            }}
            disabled={isSaving}
            className="text-base font-medium"
            maxLength={255}
          />
        </div>

        {/* 2. Blog Content (TinyMCE) */}
        <div className="space-y-2">
          <label htmlFor="blog-cover-image" className="block text-sm font-semibold text-slate-800">
            Cover Image
          </label>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
              <ImagePlus size={16} />
              {isUploadingImage ? "Uploading..." : "Choose image"}
              <input
                id="blog-cover-image"
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="sr-only"
                disabled={isSaving}
                onChange={async (event) => {
                  const file = event.target.files?.[0];
                  if (!file) return;
                  try {
                    setCoverImageUrl((await uploadBlogImage(file).unwrap()).url);
                    setValidationError(null);
                  } catch {
                    setValidationError("Could not upload the cover image.");
                  }
                  event.target.value = "";
                }}
              />
            </label>
            {coverImageUrl && (
              <div className="flex min-w-0 items-center gap-3">
                <img src={coverImageUrl} alt="Cover preview" className="h-16 w-24 rounded-lg object-cover" />
                <button
                  type="button"
                  onClick={() => setCoverImageUrl("")}
                  disabled={isSaving}
                  className="text-xs font-medium text-rose-600 hover:text-rose-700"
                >
                  Remove
                </button>
              </div>
            )}
          </div>
          <p className="text-xs text-slate-500">Stored securely in Cloudinary and used as the post cover.</p>
        </div>

        {/* 3. Blog Content (TinyMCE) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-semibold text-slate-800">
              Blog Content <span className="text-rose-500">*</span>
            </label>
            <span className="text-xs text-slate-400 font-medium">Powered by TinyMCE</span>
          </div>

          <BlogEditor
            value={content}
            onChange={(newContent) => {
              setContent(newContent);
              if (validationError) setValidationError(null);
            }}
            disabled={isSaving}
            onUploadImage={async (file) => (await uploadBlogImage(file).unwrap()).url}
            placeholder="Start drafting your blog content here... Use the toolbar above for formatting, headings, lists, tables, images, and embeds."
          />
        </div>

        {/* 4. isShow Toggle Flag */}
        <div className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-4 sm:p-5">
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 font-semibold text-slate-900 text-sm">
                {isShow ? (
                  <Eye className="h-4 w-4 text-emerald-600" />
                ) : (
                  <EyeOff className="h-4 w-4 text-slate-400" />
                )}
                <span>Display on Website (isShow Flag)</span>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                    isShow
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-slate-200 text-slate-600"
                  }`}
                >
                  {isShow ? "ON (Visible)" : "OFF (Hidden)"}
                </span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                When enabled, frontend developers can fetch this blog via{" "}
                <code className="rounded bg-slate-200/70 px-1 py-0.5 font-mono text-[11px] text-slate-800">
                  GET /api/blogs?onlyVisible=true
                </code>
                . When disabled, this blog remains hidden from public view.
              </p>
            </div>

            <label className="relative inline-flex cursor-pointer items-center shrink-0">
              <input
                type="checkbox"
                checked={isShow}
                onChange={(e) => setIsShow(e.target.checked)}
                disabled={isSaving}
                className="peer sr-only"
              />
              <div className="peer h-7 w-12 rounded-full bg-slate-300 transition-colors after:absolute after:left-[3px] after:top-[3px] after:h-[22px] after:w-[22px] after:rounded-full after:bg-white after:shadow-sm after:transition-all after:content-[''] peer-checked:bg-teal-600 peer-checked:after:translate-x-5 peer-focus:outline-none"></div>
            </label>
          </div>
        </div>

        {/* 5. Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-2">
            {isEditing ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleCancel}
                disabled={isSaving}
                className="text-slate-600 hover:text-slate-800"
              >
                <X size={15} />
                Cancel Edit
              </Button>
            ) : (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleReset}
                disabled={isSaving || (!title && !content)}
                className="text-slate-600 hover:text-slate-800"
              >
                <RotateCcw size={15} />
                Reset
              </Button>
            )}
          </div>

          <Button
            type="submit"
            disabled={isSaving}
            className="min-w-[150px] shadow-sm"
          >
            {isSaving ? (
              <>
                <LoaderCircle className="animate-spin" size={17} />
                {isEditing ? "Updating..." : "Publishing..."}
              </>
            ) : (
              <>
                {isEditing ? <Edit3 size={16} /> : <Send size={16} />}
                {isEditing ? "Update Blog" : "Publish Blog"}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
