import prisma from "@/lib/prisma";
import { ApiResponse } from "@/types/api";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  _request: NextRequest,
  { params }: { params: Promise<{ questionId: string }> },
) => {
  try {
    const { questionId } = await params;
    const commentCount = await prisma.comment.count({
      where: {
        questionId,
      },
    });

    return NextResponse.json<ApiResponse<{ commentCount: number }>>({
      success: true,
      data: { commentCount },
    });
  } catch (error) {
    console.log("Error in getting comment count:", error);
    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: "Internal server error." },
      { status: 500 },
    );
  }
};
