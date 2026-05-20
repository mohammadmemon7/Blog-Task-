import Link from "next/link";
import { db } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

type SearchParams = Promise<{ q?: string }>;

interface HomeProps {
  searchParams: SearchParams;
}

export default async function Home({ searchParams }: HomeProps) {
  const user = await getSessionUser();
  const { q: searchQuery } = await searchParams;

  // Fetch posts from database, optionally filtered by search query
  const posts = await db.post.findMany({
    where: searchQuery
      ? {
          OR: [
            { title: { contains: searchQuery } },
            { content: { contains: searchQuery } },
          ],
        }
      : undefined,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      author: {
        select: {
          name: true,
          email: true,
        },
      },
      _count: {
        select: {
          comments: true,
        },
      },
    },
  });

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-white to-zinc-100 dark:from-zinc-950 dark:to-zinc-900 border-b border-zinc-200/50 dark:border-zinc-800/50 py-20 md:py-28">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <span className="inline-flex items-center rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200">
            Publish your passion, your way
          </span>
          <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white sm:text-5xl md:text-6xl font-serif">
            Welcome to <span className="underline decoration-wavy decoration-zinc-400">PenCraft</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-zinc-650 dark:text-zinc-400">
            A minimalist space for authors to share ideas, engage with readers, and inspire conversations.
          </p>

          {/* Actions */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            {user ? (
              <Link
                href="/posts/new"
                className="inline-flex h-12 items-center justify-center rounded-xl bg-zinc-900 px-6 font-semibold text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-zinc-200 shadow-lg shadow-zinc-900/10 dark:shadow-none transition-all duration-200 hover:-translate-y-0.5"
              >
                Start Writing Now
              </Link>
            ) : (
              <>
                <Link
                  href="/register"
                  className="inline-flex h-12 items-center justify-center rounded-xl bg-zinc-900 px-6 font-semibold text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-zinc-200 shadow-lg shadow-zinc-900/10 dark:shadow-none transition-all duration-200 hover:-translate-y-0.5"
                >
                  Join PenCraft
                </Link>
                <Link
                  href="/login"
                  className="inline-flex h-12 items-center justify-center rounded-xl border border-zinc-200 bg-white px-6 font-semibold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-850 transition-all duration-200"
                >
                  Sign In to Read
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="mx-auto w-full max-w-6xl flex-1 px-4 py-16 sm:px-6">
        {/* Toolbar: Search and Filter Info */}
        <div className="mb-12 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
              {searchQuery ? `Search results for "${searchQuery}"` : "Latest Stories"}
            </h2>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              {posts.length} {posts.length === 1 ? "story" : "stories"} available
            </p>
          </div>

          {/* Search Form (Pure HTML GET request for instant server reload) */}
          <form method="GET" action="/" className="flex w-full max-w-md items-center gap-2">
            <input
              type="text"
              name="q"
              defaultValue={searchQuery || ""}
              placeholder="Search by keyword..."
              className="block w-full rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm text-zinc-950 placeholder-zinc-400 focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white dark:placeholder-zinc-600 dark:focus:border-zinc-100 dark:focus:ring-zinc-100 transition-all outline-none"
            />
            {searchQuery && (
              <Link
                href="/"
                className="inline-flex items-center justify-center h-10 px-3 rounded-lg border border-zinc-200 text-xs font-semibold text-zinc-500 hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-900 transition-colors"
              >
                Clear
              </Link>
            )}
            <button
              type="submit"
              className="inline-flex h-10 items-center justify-center rounded-lg bg-zinc-900 px-4 text-xs font-semibold text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-zinc-200 transition-colors cursor-pointer"
            >
              Search
            </button>
          </form>
        </div>

        {/* Posts Grid */}
        {posts.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => {
              const snippet =
                post.content.length > 150
                  ? post.content.substring(0, 150) + "..."
                  : post.content;
              const formattedDate = new Date(post.createdAt).toLocaleDateString(
                "en-US",
                {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                }
              );

              return (
                <article
                  key={post.id}
                  className="flex flex-col overflow-hidden rounded-2xl border border-zinc-200/70 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md dark:border-zinc-850 dark:bg-zinc-900/40"
                >
                  <div className="flex flex-1 flex-col p-6 sm:p-8">
                    {/* Meta info */}
                    <div className="flex items-center justify-between gap-2 text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-4">
                      <span>By {post.author.name}</span>
                      <span>{formattedDate}</span>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white mb-3 line-clamp-2 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors">
                      <Link href={`/posts/${post.id}`}>{post.title}</Link>
                    </h3>

                    {/* Content Snippet */}
                    <p className="text-sm leading-relaxed text-zinc-650 dark:text-zinc-400 mb-6 flex-1 line-clamp-3">
                      {snippet}
                    </p>

                    {/* Footer Actions */}
                    <div className="flex items-center justify-between mt-auto border-t border-zinc-100 dark:border-zinc-800/80 pt-4">
                      <span className="inline-flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-450 font-medium">
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
                            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                          />
                        </svg>
                        {post._count.comments}{" "}
                        {post._count.comments === 1 ? "comment" : "comments"}
                      </span>

                      <Link
                        href={`/posts/${post.id}`}
                        className="inline-flex items-center text-xs font-semibold text-zinc-900 dark:text-zinc-100 hover:underline gap-1 group"
                      >
                        Read Post
                        <span className="transition-transform duration-200 group-hover:translate-x-0.5">
                          →
                        </span>
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 rounded-2xl border border-dashed border-zinc-250 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/10">
            <svg
              className="mx-auto h-12 w-12 text-zinc-400 dark:text-zinc-650"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
              />
            </svg>
            <h3 className="mt-4 text-lg font-bold text-zinc-900 dark:text-white">
              {searchQuery ? "No matching stories found" : "No stories written yet"}
            </h3>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-450">
              {searchQuery
                ? "Try searching for a different keyword or check spelling."
                : "Be the pioneer and write the first article on PenCraft!"}
            </p>
            <div className="mt-6">
              {user ? (
                <Link
                  href="/posts/new"
                  className="inline-flex h-10 items-center justify-center rounded-lg bg-zinc-900 px-4 text-xs font-semibold text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-zinc-200 transition-colors"
                >
                  Create Your First Post
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="inline-flex h-10 items-center justify-center rounded-lg bg-zinc-900 px-4 text-xs font-semibold text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-zinc-200 transition-colors"
                >
                  Sign In to Write
                </Link>
              )}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
