import Link from "next/link";
import { getSessionUser } from "@/lib/auth";
import { handleLogout } from "@/app/actions/logout";

export default async function Navbar() {
  const user = await getSessionUser();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200/80 bg-white/80 backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-950/80">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 shadow-md transition-transform duration-300 group-hover:scale-105">
            <span className="font-serif text-xl font-bold">P</span>
          </div>
          <span className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white font-sans transition-colors group-hover:text-zinc-600 dark:group-hover:text-zinc-300">
            PenCraft
          </span>
        </Link>

        {/* Navigation Items */}
        <nav className="flex items-center gap-4 sm:gap-6">
          <Link
            href="/"
            className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors"
          >
            Explore
          </Link>
          
          {user ? (
            <div className="flex items-center gap-4 sm:gap-6">
              <Link
                href="/posts/new"
                className="hidden sm:inline-flex items-center justify-center h-9 px-4 rounded-lg bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-zinc-200 text-xs font-semibold shadow transition-all duration-200 hover:-translate-y-0.5"
              >
                Create Post
              </Link>
              <Link
                href="/posts/new"
                className="sm:hidden text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors"
              >
                Write
              </Link>
              <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800" />
              <div className="flex items-center gap-3">
                <span className="hidden md:inline-block text-xs font-medium text-zinc-500 dark:text-zinc-400">
                  Hi, <span className="font-semibold text-zinc-800 dark:text-zinc-200">{user.name}</span>
                </span>
                <form action={handleLogout}>
                  <button
                    type="submit"
                    className="cursor-pointer inline-flex h-9 items-center justify-center rounded-lg border border-zinc-200 bg-white px-3 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-850 dark:hover:text-white transition-all duration-200"
                  >
                    Log Out
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 sm:gap-4">
              <Link
                href="/login"
                className="inline-flex h-9 items-center justify-center rounded-lg px-4 text-xs font-semibold text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-900 transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="inline-flex h-9 items-center justify-center rounded-lg bg-zinc-900 px-4 text-xs font-semibold text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-zinc-200 shadow transition-all duration-200 hover:-translate-y-0.5"
              >
                Get Started
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
