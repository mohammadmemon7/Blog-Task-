import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

type RouteParams = {
  params: Promise<{ id: string }>;
};

// POST add a comment to a post
export async function POST(request: Request, { params }: RouteParams) {
  try {
    const { id: postId } = await params;
    const user = await getSessionUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized. Please log in to comment" },
        { status: 401 }
      );
    }

    const { content } = await request.json();

    if (!content || !content.trim()) {
      return NextResponse.json(
        { error: "Comment content cannot be empty" },
        { status: 400 }
      );
    }

    // Check if post exists
    const post = await db.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return NextResponse.json(
        { error: "Post not found" },
        { status: 404 }
      );
    }

    // Create comment
    const comment = await db.comment.create({
      data: {
        content: content.trim(),
        postId,
        authorId: user.id,
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
    });

    return NextResponse.json({ success: true, comment }, { status: 201 });
  } catch (error) {
    console.error("Create Comment Error:", error);
    return NextResponse.json(
      { error: "Failed to add comment" },
      { status: 500 }
    );
  }
}
