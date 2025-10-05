import { Question } from "@/generated/prisma";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import {
  ApiResponse,
  QuestionDetails,
  QuestionWithAuthorAndTags,
} from "@/types/api";
import { Vote } from "@/types/vote";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

// Get question
export const GET = async (
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
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
        { status: 400 }
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
      },
    });

    if (!question) {
      return NextResponse.json<ApiResponse<never>>(
        {
          success: false,
          error: "Question not found.",
        },
        { status: 404 }
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
    };

    return NextResponse.json<ApiResponse<QuestionDetails>>({
      success: true,
      data: questionDetails,
    });
  } catch (error) {
    console.log("Error in getting question:", error);
    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: "Internal server error." },
      { status: 500 }
    );
  }
};

// Vote question
export const POST = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const { id } = await params;
    const body = await request.json();

    if (!body.userId || !body.type)
      return NextResponse.json<ApiResponse<never>>({
        success: false,
        error: "UserId and Vote Type is required!",
      });

    const existingVote = await prisma.vote.findFirst({
      where: {
        userId: body.userId,
        questionId: id,
      },
    });

    let vote: Vote;

    if (existingVote) {
      if (existingVote.type === body.type) {
        await prisma.vote.delete({
          where: { id: existingVote.id },
        });
        return NextResponse.json<ApiResponse<never>>({
          success: true,
          message: "Vote removed successfully!",
        });
      } else {
        vote = await prisma.vote.update({
          where: { id: existingVote.id },
          data: { type: body.type },
        });
      }
    } else {
      vote = await prisma.vote.create({
        data: {
          userId: body.userId,
          questionId: id,
          type: body.type,
        },
      });
    }

    return NextResponse.json<ApiResponse<Vote>>({
      success: true,
      message: "Vote created successfully!",
      data: vote,
    });
  } catch (error) {
    console.log("Error in voting question:", error);
    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: "Internal server error." },
      { status: 500 }
    );
  }
};
