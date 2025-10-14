import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { ApiResponse } from "@/types/api";
import { QuestionDetails } from "@/types/question";

import { Vote } from "@/types/vote";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

// Get question
export const GET = async (
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  try {
    const { id: questionId } = await params;
    const session = await auth.api.getSession({ headers: await headers() });
    const userId = session?.user?.id;

    if (!questionId) {
      return NextResponse.json<ApiResponse<never>>(
        {
          success: false,
          error: "QuestionId is required!",
        },
        { status: 400 },
      );
    }

    const question = await prisma.question.findUnique({
      where: {
        id: questionId,
      },
      include: {
        author: {
          select: {
            image: true,
            name: true,
            username: true,
          },
        },
        tags: {
          select: {
            name: true,
          },
        },
        _count: { select: { comments: true } },
      },
    });

    if (!question) {
      return NextResponse.json<ApiResponse<never>>(
        {
          success: false,
          error: "Question not found.",
        },
        { status: 404 },
      );
    }

    const votes: Vote[] = await prisma.vote.findMany({ where: { questionId } });

    const upVotes = votes.filter((v) => v.type === "UP").length;
    const downVotes = votes.filter((v) => v.type === "DOWN").length;
    const score = upVotes - downVotes;

    const userVote = userId
      ? votes.find((v) => v.userId === userId)?.type || null
      : null;

    const questionDetails = {
      ...question,
      upVotes,
      downVotes,
      score,
      userVote,
      commentCount: question._count.comments,
    };

    return NextResponse.json<ApiResponse<QuestionDetails>>({
      success: true,
      data: questionDetails,
    });
  } catch (error) {
    console.log("Error in getting question:", error);
    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: "Internal server error." },
      { status: 500 },
    );
  }
};
