import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import PostOptions from "./PostOptions";
import CommentsSection from "@/components/CommentsSection";

interface PostDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function PostDetailPage({ params }: PostDetailPageProps) {
  const { id } = await params;
  const user = await getSessionUser();

  // Load post details, author, and comments from database directly
  const post = await db.post.findUnique({
    where: { id },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      comments: {
        orderBy: {
          createdAt: "desc",
        },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
    },
  });

  if (!post) {
    notFound();
  }

  const formattedDate = new Date(post.createdAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const isAuthor = user && post.authorId === user.id;

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6">
      {/* Navigation breadcrumbs */}
      <div className="mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-550 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors"
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
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Explore
        </Link>
      </div>

      {/* Main post layout */}
      <article className="rounded-2xl border border-zinc-200/60 bg-white p-6 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900/30 backdrop-blur-sm sm:p-10">
        {/* Post Meta Headers */}
        <header className="mb-8 border-b border-zinc-100 dark:border-zinc-800/60 pb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white sm:text-4xl md:text-5xl font-serif leading-tight">
            {post.title}
          </h1>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
            {/* Author info */}
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 font-bold font-serif text-sm">
                {post.author.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-zinc-900 dark:text-white">
                  {post.author.name}
                </span>
                <span className="text-xs text-zinc-500 dark:text-zinc-400">
                  Published on {formattedDate}
                </span>
              </div>
            </div>

            {/* Author edit/delete controls */}
            {isAuthor && <PostOptions postId={post.id} />}
          </div>
        </header>

        {/* Post Content */}
        <div className="prose prose-zinc dark:prose-invert max-w-none">
          <div className="text-base sm:text-lg leading-relaxed text-zinc-700 dark:text-zinc-350 whitespace-pre-wrap font-sans">
            {post.content}
          </div>
        </div>

        {/* Interactive Discussion Section */}
        <CommentsSection
          postId={post.id}
          initialComments={post.comments}
          currentUser={user}
          postAuthorId={post.authorId}
        />
      </article>
    </div>
  );
}
