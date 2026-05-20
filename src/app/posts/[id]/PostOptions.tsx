"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface PostOptionsProps {
  postId: string;
}

export default function PostOptions({ postId }: PostOptionsProps) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this story? This action cannot be undone.")) {
      return;
    }

    setDeleting(true);

    try {
      const res = await fetch(`/api/posts/${postId}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to delete post");
      }

      router.push("/");
      router.refresh();
    } catch (err: any) {
      alert(err.message || "An error occurred");
      setDeleting(false);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <Link
        href={`/posts/${postId}/edit`}
        className="inline-flex h-9 items-center justify-center rounded-lg border border-zinc-200 bg-white px-4 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 transition-colors"
      >
        Edit Story
      </Link>
      <button
        onClick={handleDelete}
        disabled={deleting}
        className="cursor-pointer inline-flex h-9 items-center justify-center rounded-lg bg-red-650 px-4 text-xs font-semibold text-white hover:bg-red-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5"
      >
        {deleting ? "Deleting..." : "Delete Story"}
      </button>
    </div>
  );
}
