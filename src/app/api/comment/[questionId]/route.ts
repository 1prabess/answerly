import prisma from "@/lib/prisma";
import { ApiResponse } from "@/types/api";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  _request: NextRequest,
  { params }: { params: Promise<{ questionId: string }> }
) => {
  try {
    const { questionId } = await params;

    if (!questionId) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "QuestionId is required!" },
        { status: 400 }
      );
    }

    const comments = await prisma.comment.findMany({
      where: { questionId },
      orderBy: { createdAt: "desc" },
      include: { user: { select: { id: true, name: true, image: true } } },
    });

    return NextResponse.json<ApiResponse<typeof comments>>({
      success: true,
      message: "Comments fetched successfully.",
      data: comments,
    });
  } catch (error) {
    console.log("Error in creating comment:", error);
    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: "Internal server error." },
      { status: 500 }
    );
  }
};
