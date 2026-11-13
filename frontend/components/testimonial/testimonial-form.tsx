"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, LoaderCircle, MessageSquareQuote, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert } from "@/components/ui/alert";
import {
  Testimonial,
  useCreateTestimonialMutation,
  useUpdateTestimonialMutation,
} from "@/lib/api";

export function TestimonialForm({
  editing,
  onCancel,
  onSuccess,
}: {
  editing: Testimonial | null;
  onCancel: () => void;
  onSuccess: () => void;
}) {
  const [quote, setQuote] = useState("");
  const [author, setAuthor] = useState("");
  const [isShow, setIsShow] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [create, createState] = useCreateTestimonialMutation();
  const [update, updateState] = useUpdateTestimonialMutation();
  const editingMode = Boolean(editing);
  const saving = createState.isLoading || updateState.isLoading;

  useEffect(() => {
    setQuote(editing?.quote ?? "");
    setAuthor(editing?.author ?? "");
    setIsShow(editing?.isShow ?? true);
    setError(null);
    setSuccess(null);
  }, [editing]);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    const trimmedQuote = quote.trim();
    const trimmedAuthor = author.trim();
    if (!trimmedQuote || !trimmedAuthor) {
      setError("Quote and author are required.");
      return;
    }
    setError(null);
    try {
      if (editing) {
        await update({
          id: editing.id,
          quote: trimmedQuote,
          author: trimmedAuthor,
          isShow,
        }).unwrap();
      } else {
        await create({
          quote: trimmedQuote,
          author: trimmedAuthor,
          isShow,
        }).unwrap();
      }
      setSuccess(
        editingMode
          ? "Testimonial updated successfully."
          : "Testimonial added successfully."
      );
      if (!editing) {
        setQuote("");
        setAuthor("");
        setIsShow(true);
      }
      onSuccess();
    } catch (requestError: unknown) {
      const err = requestError as { data?: { message?: string } };
      setError(err?.data?.message ?? "Could not save testimonial.");
    }
  }

  return (
    <section
      id="testimonial-form-section"
      className={`rounded-2xl border bg-white p-6 shadow-xs sm:p-8 transition-colors ${
        editingMode
          ? "border-teal-500 ring-2 ring-teal-500/10"
          : "border-slate-200/80"
      }`}
    >
      <div className="mb-6 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 text-teal-700">
            <MessageSquareQuote size={18} />
            <span className="text-xs font-bold uppercase tracking-wider">
              {editingMode ? `Editing #${editing?.id}` : "Testimonial Creator"}
            </span>
          </div>
          <h2 className="mt-1 text-2xl font-bold text-slate-900">
            {editingMode ? "Edit Testimonial" : "Add Testimonial"}
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Manage the customer quotes shown on your website.
          </p>
        </div>
        {editingMode && (
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs text-slate-500 hover:bg-slate-100 transition-colors"
          >
            <X size={14} />
            Cancel
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4">
          <Alert tone="error">{error}</Alert>
        </div>
      )}

      {success && (
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          <CheckCircle2 size={17} />
          {success}
        </div>
      )}

      <form onSubmit={submit} className="space-y-5">
        <div className="space-y-2">
          <label
            htmlFor="testimonial-quote"
            className="text-sm font-semibold text-slate-800"
          >
            Quote <span className="text-rose-500">*</span>
          </label>
          <textarea
            id="testimonial-quote"
            value={quote}
            onChange={(event) => setQuote(event.target.value)}
            disabled={saving}
            rows={5}
            className="flex w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm outline-none placeholder:text-slate-400 focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 transition-all disabled:opacity-50"
            placeholder="Share the customer's experience..."
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="testimonial-author"
            className="text-sm font-semibold text-slate-800"
          >
            Author <span className="text-rose-500">*</span>
          </label>
          <Input
            id="testimonial-author"
            value={author}
            onChange={(event) => setAuthor(event.target.value)}
            disabled={saving}
            maxLength={255}
            placeholder="Customer or company name"
            className="h-11 rounded-xl"
          />
        </div>

        <label className="flex items-center gap-2.5 text-sm font-medium text-slate-700 select-none cursor-pointer">
          <input
            type="checkbox"
            checked={isShow}
            onChange={(event) => setIsShow(event.target.checked)}
            disabled={saving}
            className="h-4 w-4 rounded border-slate-300 text-teal-700 accent-teal-700"
          />
          <span>Visible on website (isShow)</span>
        </label>

        <Button type="submit" disabled={saving}>
          {saving ? (
            <>
              <LoaderCircle className="h-4 w-4 animate-spin mr-1.5" />
              <span>Saving...</span>
            </>
          ) : editingMode ? (
            "Update Testimonial"
          ) : (
            "Add Testimonial"
          )}
        </Button>
      </form>
    </section>
  );
}
