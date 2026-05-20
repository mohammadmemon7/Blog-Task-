import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

type RouteParams = {
  params: Promise<{ commentId: string }>;
};

// DELETE a comment
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { commentId } = await params;
    const user = await getSessionUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized. Please log in first" },
        { status: 401 }
      );
    }

    // Fetch the comment along with its post details to determine authors
    const comment = await db.comment.findUnique({
      where: { id: commentId },
      include: {
        post: {
          select: {
            authorId: true,
          },
        },
      },
    });

    if (!comment) {
      return NextResponse.json(
        { error: "Comment not found" },
        { status: 404 }
      );
    }

    // Verify if the current user is either the author of the comment OR the author of the post
    const isCommentAuthor = comment.authorId === user.id;
    const isPostAuthor = comment.post.authorId === user.id;

    if (!isCommentAuthor && !isPostAuthor) {
      return NextResponse.json(
        { error: "Forbidden. You are not allowed to delete this comment" },
        { status: 403 }
      );
    }

    await db.comment.delete({
      where: { id: commentId },
    });

    return NextResponse.json({ success: true, message: "Comment deleted successfully" });
  } catch (error) {
    console.error("Delete Comment Error:", error);
    return NextResponse.json(
      { error: "Failed to delete comment" },
      { status: 500 }
    );
  }
}
