"use client";

import { useState } from "react";
import { MessageSquareQuote } from "lucide-react";
import { Testimonial } from "@/lib/api";
import { TestimonialForm } from "@/components/testimonial/testimonial-form";
import { TestimonialList } from "@/components/testimonial/testimonial-list";

export default function TestimonialsPage() {
  const [editing, setEditing] = useState<Testimonial | null>(null);

  return (
    <div className="space-y-8">
      <div>
        <div className="inline-flex items-center gap-2 rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-800">
          <MessageSquareQuote className="h-3.5 w-3.5" />
          <span>Customer Testimonials</span>
        </div>
        <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
          Customer voices, kept current
        </h2>
        <p className="mt-1.5 text-sm text-slate-600">
          Add, edit, publish, hide, or remove testimonials from genuine customers.
        </p>
      </div>

      <section>
        <TestimonialForm
          editing={editing}
          onCancel={() => setEditing(null)}
          onSuccess={() => setEditing(null)}
        />
      </section>

      <section className="pt-4">
        <div className="mb-4">
          <h3 className="text-lg font-bold text-slate-800">All Testimonials</h3>
          <p className="text-xs text-slate-500">Filter, toggle visibility, and update customer feedback.</p>
        </div>
        <TestimonialList onEdit={(item) => {
          setEditing(item);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }} />
      </section>
    </div>
  );
}

