"use client";

import { useState } from "react";
import {
  Calendar,
  Edit,
  Eye,
  EyeOff,
  LoaderCircle,
  MessageSquareQuote,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import {
  Testimonial,
  useDeleteTestimonialMutation,
  useGetTestimonialsQuery,
  useToggleTestimonialVisibilityMutation,
} from "@/lib/api";

export function TestimonialList({
  onEdit,
}: {
  onEdit: (testimonial: Testimonial) => void;
}) {
  const { data, isLoading, isError } = useGetTestimonialsQuery();
  const [remove, removeState] = useDeleteTestimonialMutation();
  const [toggle, toggleState] = useToggleTestimonialVisibilityMutation();
  const [deleteTarget, setDeleteTarget] = useState<Testimonial | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      setDeleteError(null);
      await remove(deleteTarget.id).unwrap();
      setDeleteTarget(null);
    } catch (err: unknown) {
      const errorMsg =
        (err as { data?: { message?: string } })?.data?.message ||
        "Failed to delete the testimonial. Please try again.";
      setDeleteError(errorMsg);
    }
  };

  if (isLoading)
    return (
      <div className="flex justify-center py-12 text-slate-400">
        <LoaderCircle className="mr-2 animate-spin text-teal-600" />
        Loading testimonials...
      </div>
    );

  if (isError)
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        Could not load testimonials.
      </div>
    );

  return (
    <section className="mt-10 space-y-5">
      <div className="flex items-end justify-between border-b border-slate-200 pb-4">
        <div>
          <h3 className="text-xl font-bold text-slate-900">Testimonials</h3>
          <p className="text-sm text-slate-500">
            Edit, delete, or toggle website visibility.
          </p>
        </div>
        {data && (
          <div className="flex gap-2 text-xs font-semibold">
            <span className="rounded-full bg-teal-50 px-3 py-1 text-teal-700">
              {data.length} Total
            </span>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">
              {data.filter((item) => item.isShow).length} Active
            </span>
          </div>
        )}
      </div>

      {!data?.length && (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <MessageSquareQuote className="mx-auto mb-3 text-teal-700" />
          <p className="font-semibold text-slate-800">No testimonials yet</p>
        </div>
      )}

      <div className="grid gap-5 md:grid-cols-2">
        {data?.map((item) => (
          <article
            key={item.id}
            className="flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs hover:border-slate-300 transition-colors"
          >
            <div>
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <Calendar size={13} />
                  {new Date(item.createdAt).toLocaleDateString()}
                </span>
                <span
                  className={`rounded-full px-2.5 py-1 font-bold ${
                    item.isShow
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {item.isShow ? "Visible" : "Hidden"}
                </span>
              </div>
              <blockquote className="mt-4 line-clamp-5 text-sm leading-relaxed text-slate-600">
                “{item.quote}”
              </blockquote>
              <p className="mt-4 font-semibold text-slate-900">{item.author}</p>
            </div>

            <div className="mt-6 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => toggle(item.id)}
                disabled={toggleState.isLoading}
              >
                {item.isShow ? <EyeOff size={13} /> : <Eye size={13} />}
                {item.isShow ? "Hide" : "Show"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  onEdit(item);
                  document
                    .getElementById("testimonial-form-section")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                <Edit size={13} />
                Edit
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                disabled={removeState.isLoading}
                onClick={() => {
                  setDeleteTarget(item);
                  setDeleteError(null);
                }}
              >
                <Trash2 size={13} />
                Delete
              </Button>
            </div>
          </article>
        ))}
      </div>

      {/* Animated Common Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => {
          if (!removeState.isLoading) {
            setDeleteTarget(null);
            setDeleteError(null);
          }
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Testimonial?"
        description="Are you sure you want to permanently delete this testimonial? It will immediately stop appearing on your live website."
        itemName={`“${deleteTarget?.quote?.slice(0, 80) || ""}”`}
        itemType={`Testimonial by ${deleteTarget?.author || "Author"}`}
        confirmText="Delete Testimonial"
        tone="danger"
        isLoading={removeState.isLoading}
        error={deleteError}
      />
    </section>
  );
}
