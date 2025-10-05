import { Comment } from "@/generated/prisma";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { ApiResponse } from "@/types/api";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user) {
      return NextResponse.json<ApiResponse<never>>(
        {
          success: false,
          error: "Unauthorized!",
        },
        { status: 401 }
      );
    }

    const userId = session?.user.id;

    const body = await request.json();

    const { questionId, content } = body;

    if (!questionId || !content) {
      return NextResponse.json<ApiResponse<never>>(
        {
          success: false,
          error: "QuestionId and content is required!",
        },
        { status: 400 }
      );
    }

    const comment = await prisma.comment.create({
      data: {
        userId,
        questionId,
        content,
      },
    });

    return NextResponse.json<ApiResponse<Comment>>({
      success: true,
      message: "Comment created successfully.",
      data: comment,
    });
  } catch (error) {
    console.log("Error in creating comment:", error);
    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: "Internal server error." },
      { status: 500 }
    );
  }
};
