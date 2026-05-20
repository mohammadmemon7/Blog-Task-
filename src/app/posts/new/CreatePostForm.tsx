"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CreatePostForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create post");
      }

      router.push(`/posts/${data.post.id}`);
      router.refresh();
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-xs font-semibold text-red-800 dark:bg-red-950/30 dark:text-red-400 border border-red-200/60 dark:border-red-900/50">
          <span className="font-bold">Error:</span> {error}
        </div>
      )}

      <div>
        <label
          htmlFor="title"
          className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400"
        >
          Post Title
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter a compelling title..."
          className="mt-2 block w-full rounded-lg border border-zinc-200 bg-zinc-55 px-4 py-3 text-base text-zinc-955 placeholder-zinc-400 focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white dark:placeholder-zinc-650 dark:focus:border-zinc-100 dark:focus:ring-zinc-100 transition-all outline-none font-serif font-semibold"
        />
      </div>

      <div>
        <label
          htmlFor="content"
          className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400"
        >
          Story Content
        </label>
        <textarea
          id="content"
          name="content"
          required
          rows={12}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Tell your story. What's on your mind?..."
          className="mt-2 block w-full rounded-lg border border-zinc-200 bg-zinc-55 px-4 py-3 text-sm text-zinc-955 placeholder-zinc-400 focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white dark:placeholder-zinc-650 dark:focus:border-zinc-100 dark:focus:ring-zinc-100 transition-all outline-none leading-relaxed"
        />
      </div>

      <div className="flex items-center justify-end gap-4 border-t border-zinc-100 dark:border-zinc-850 pt-6">
        <Link
          href="/"
          className="inline-flex h-10 items-center justify-center rounded-lg border border-zinc-200 px-4 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-900 transition-colors"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex h-10 items-center justify-center rounded-lg bg-zinc-900 px-5 text-xs font-semibold text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-zinc-200 shadow transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5 cursor-pointer"
        >
          {loading ? "Publishing..." : "Publish Story"}
        </button>
      </div>
    </form>
  );
}
