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

// Delete a question
export const DELETE = async (
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    const userId = session?.user.id;

    if (!session || !userId) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "Unauthorized!" },
        { status: 401 },
      );
    }

    const { id: questionId } = await params;

    const question = await prisma.question.findUnique({
      where: { id: questionId },
    });

    if (!question) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "Question not found!" },
        { status: 404 },
      );
    }

    if (question.authorId !== userId) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "Forbidden!" },
        { status: 403 },
      );
    }

    await prisma.question.delete({
      where: { id: questionId },
    });

    return NextResponse.json<ApiResponse<never>>(
      { success: true, message: "Question deleted successfully!" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting question:", error);
    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: "Internal server error." },
      { status: 500 },
    );
  }
};
