"use client";

import { useState } from "react";
import { PenTool } from "lucide-react";
import { BlogPost } from "@/lib/api";
import { BlogForm } from "@/components/blog/blog-form";
import { BlogList } from "@/components/blog/blog-list";

export default function BlogsPage() {
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);

  return (
    <div className="space-y-8">
      <div>
        <div className="inline-flex items-center gap-2 rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-800">
          <PenTool className="h-3.5 w-3.5" />
          <span>Blog Management</span>
        </div>
        <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
          Articles, Nutrition Guides & Recipes
        </h2>
        <p className="mt-1.5 text-sm text-slate-600">
          Create, edit, format with rich text, upload cover images, and publish blog content.
        </p>
      </div>

      <section>
        <BlogForm
          editingBlog={editingBlog}
          onCancelEdit={() => setEditingBlog(null)}
          onSuccess={() => setEditingBlog(null)}
        />
      </section>

      <section className="pt-4">
        <div className="mb-4">
          <h3 className="text-lg font-bold text-slate-800">Published & Draft Posts</h3>
          <p className="text-xs text-slate-500">Manage existing articles and control public visibility.</p>
        </div>
        <BlogList onEdit={(blog: BlogPost) => {
          setEditingBlog(blog);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }} />
      </section>
    </div>
  );
}
