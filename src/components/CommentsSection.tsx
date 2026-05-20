"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Author {
  id: string;
  name: string;
  email: string;
}

interface Comment {
  id: string;
  content: string;
  postId: string;
  authorId: string;
  createdAt: string | Date;
  author: {
    id: string;
    name: string;
    email: string;
  };
}

interface CommentsSectionProps {
  postId: string;
  initialComments: any[];
  currentUser: { id: string; name: string; email: string } | null;
  postAuthorId: string;
}

export default function CommentsSection({
  postId,
  initialComments,
  currentUser,
  postAuthorId,
}: CommentsSectionProps) {
  const router = useRouter();
  const [comments, setComments] = useState<any[]>(initialComments);
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setError("");
    setLoading(true);

    try {
      const res = await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to post comment");
      }

      // Add new comment to list
      setComments([data.comment, ...comments]);
      setContent("");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (commentId: string) => {
    if (!confirm("Are you sure you want to delete this comment?")) return;

    try {
      const res = await fetch(`/api/comments/${commentId}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to delete comment");
      }

      // Remove deleted comment from list
      setComments(comments.filter((c) => c.id !== commentId));
      router.refresh();
    } catch (err: any) {
      alert(err.message || "Could not delete comment");
    }
  };

  return (
    <div className="mt-12 border-t border-zinc-200/80 pt-10 dark:border-zinc-800/85">
      <h3 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white font-serif mb-6">
        Discussion ({comments.length})
      </h3>

      {/* Add Comment Form */}
      {currentUser ? (
        <form onSubmit={handleSubmit} className="mb-10 space-y-4">
          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-xs font-semibold text-red-800 dark:bg-red-950/30 dark:text-red-400 border border-red-200/60 dark:border-red-900/50">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="comment" className="sr-only">
              Add a comment
            </label>
            <textarea
              id="comment"
              rows={3}
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Join the conversation. Write a respectful comment..."
              className="block w-full rounded-lg border border-zinc-200 bg-zinc-55 px-3 py-2.5 text-sm text-zinc-955 placeholder-zinc-400 focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white dark:placeholder-zinc-650 dark:focus:border-zinc-100 dark:focus:ring-zinc-100 transition-all outline-none leading-relaxed resize-none"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading || !content.trim()}
              className="inline-flex h-9 items-center justify-center rounded-lg bg-zinc-900 px-4 text-xs font-semibold text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-zinc-200 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed hover:-translate-y-0.5 cursor-pointer shadow-sm"
            >
              {loading ? "Posting..." : "Post Comment"}
            </button>
          </div>
        </form>
      ) : (
        <div className="mb-10 rounded-xl bg-zinc-50 border border-zinc-200 p-6 text-center dark:bg-zinc-900/20 dark:border-zinc-800/80">
          <p className="text-sm text-zinc-600 dark:text-zinc-455">
            You must be signed in to post a comment.
          </p>
          <div className="mt-4 flex items-center justify-center gap-3">
            <Link
              href="/login"
              className="inline-flex h-8 items-center justify-center rounded-lg bg-zinc-900 px-3 text-xs font-semibold text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-zinc-200 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="inline-flex h-8 items-center justify-center rounded-lg border border-zinc-200 bg-white px-3 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-850 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 transition-colors"
            >
              Register
            </Link>
          </div>
        </div>
      )}

      {/* Comments List */}
      {comments.length > 0 ? (
        <div className="space-y-6">
          {comments.map((comment) => {
            const formattedDate = new Date(comment.createdAt).toLocaleDateString(
              "en-US",
              {
                month: "short",
                day: "numeric",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              }
            );

            // Can delete if logged in user is either comment author OR post author
            const canDelete =
              currentUser &&
              (comment.authorId === currentUser.id || postAuthorId === currentUser.id);

            return (
              <div
                key={comment.id}
                className="group relative flex flex-col rounded-xl border border-zinc-200/50 bg-white/50 p-5 dark:border-zinc-850/80 dark:bg-zinc-900/10 shadow-sm transition-all duration-300 hover:border-zinc-250 dark:hover:border-zinc-800"
              >
                <div className="flex items-center justify-between gap-4">
                  {/* Meta */}
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-250 font-bold text-xs">
                      {comment.author.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-zinc-855 dark:text-zinc-200">
                        {comment.author.name}
                        {comment.authorId === postAuthorId && (
                          <span className="ml-1.5 rounded-full bg-zinc-100 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-zinc-650 dark:bg-zinc-800 dark:text-zinc-400">
                            Author
                          </span>
                        )}
                      </span>
                      <span className="text-[10px] text-zinc-450 dark:text-zinc-400">
                        {formattedDate}
                      </span>
                    </div>
                  </div>

                  {/* Deletion Control */}
                  {canDelete && (
                    <button
                      onClick={() => handleDelete(comment.id)}
                      className="cursor-pointer text-zinc-400 hover:text-red-600 dark:text-zinc-550 dark:hover:text-red-400 p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-955/20 transition-all duration-200"
                      title="Delete Comment"
                    >
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  )}
                </div>

                <div className="mt-3.5 pl-10 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap">
                  {comment.content}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8 text-sm text-zinc-400 dark:text-zinc-550">
          No comments yet. Start the discussion!
        </div>
      )}
    </div>
  );
}
