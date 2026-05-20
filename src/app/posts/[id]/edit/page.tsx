import { notFound, redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import EditPostForm from "./EditPostForm";

interface EditPostPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const { id } = await params;
  const user = await getSessionUser();

  // Securely load post details
  const post = await db.post.findUnique({
    where: { id },
  });

  if (!post) {
    notFound();
  }

  // Strictly verify authorization on the server side
  if (!user || post.authorId !== user.id) {
    redirect(`/posts/${id}`);
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6">
      <div className="mb-10">
        <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white font-serif">
          Edit your story
        </h1>
        <p className="mt-2 text-sm text-zinc-550 dark:text-zinc-400">
          Make updates, correct typos, and polish your content.
        </p>
      </div>

      <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-md dark:border-zinc-800/85 dark:bg-zinc-900/60 backdrop-blur-sm sm:p-10">
        <EditPostForm post={post} />
      </div>
    </div>
  );
}
