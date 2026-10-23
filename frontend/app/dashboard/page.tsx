"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, LoaderCircle, PenTool, MessageSquareQuote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BlogPost, useGetMeQuery, useLogoutMutation } from "@/lib/api";
import { BlogForm } from "@/components/blog/blog-form";
import { BlogList } from "@/components/blog/blog-list";

export default function DashboardPage() {
  const router = useRouter();
  const { data: user, isLoading } = useGetMeQuery();
  const [logout, { isLoading: loggingOut }] = useLogoutMutation();
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
    if (!token) {
      router.replace("/login");
    }
  }, [router]);

  async function signOut() {
    const refreshToken = localStorage.getItem("refreshToken");
    try {
      if (refreshToken) await logout({ refreshToken }).unwrap();
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      router.replace("/login");
    }
  }

  return (
    <main className="min-h-screen bg-[#f5f8f6] px-4 py-8 text-slate-900 sm:px-8 lg:px-12">
      <header className="mx-auto flex max-w-6xl items-center justify-between border-b border-slate-200/60 pb-6">
        <div className="flex items-center gap-3 text-lg font-bold text-slate-900">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-teal-700 font-black text-white shadow-sm">
            A
          </span>
          <span>Aksharam Nutra Foods</span>
        </div>

        <div className="flex items-center gap-4">
          {user && (
            <div className="hidden sm:block text-right">
              <p className="text-sm font-semibold text-slate-800">{user.name}</p>
              <p className="text-xs text-slate-500">{user.email}</p>
            </div>
          )}
          <Button variant="outline" size="sm" onClick={signOut} disabled={loggingOut}>
            {loggingOut ? (
              <LoaderCircle className="animate-spin" size={16} />
            ) : (
              <LogOut size={16} />
            )}
            Sign out
          </Button>
        </div>
      </header>

      <div className="mx-auto mt-10 max-w-6xl">
        {/* Welcome Section */}
        <section className="mb-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700 mb-3">
            <PenTool size={14} />
            Workspace & Blog Management
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            Good to see you{user?.name ? `, ${user.name}` : ""}.
          </h1>
          <p className="mt-2 text-base text-slate-600">
            Create, edit, toggle visibility (isShow), and publish rich blog articles with TinyMCE editor.
          </p>
          <Button variant="outline" className="mt-4" onClick={() => router.push("/dashboard/testimonials")}>
            <MessageSquareQuote size={16} /> Manage testimonials
          </Button>
          {isLoading && (
            <div className="mt-4 flex items-center gap-2 text-teal-700 text-sm">
              <LoaderCircle className="animate-spin" size={18} />
              Loading profile...
            </div>
          )}
        </section>

        {/* Blog Creation / Edit Section */}
        <section>
          <BlogForm
            editingBlog={editingBlog}
            onCancelEdit={() => setEditingBlog(null)}
            onSuccess={() => setEditingBlog(null)}
          />
        </section>

        {/* Published Blogs Section */}
        <section>
          <BlogList onEdit={(blog) => setEditingBlog(blog)} />
        </section>
      </div>
    </main>
  );
}