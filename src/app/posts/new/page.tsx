import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import CreatePostForm from "./CreatePostForm";

export default async function NewPostPage() {
  // Secure server-side check. Non-authenticated users are redirected to login.
  const user = await getSessionUser();
  if (!user) {
    redirect("/login?redirect=/posts/new");
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6">
      <div className="mb-10">
        <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white font-serif">
          Write a new story
        </h1>
        <p className="mt-2 text-sm text-zinc-550 dark:text-zinc-400">
          Craft your thoughts, edit, and share them with the PenCraft community.
        </p>
      </div>

      <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-md dark:border-zinc-800/85 dark:bg-zinc-900/60 backdrop-blur-sm sm:p-10">
        <CreatePostForm />
      </div>
    </div>
  );
}
