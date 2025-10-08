import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { ApiResponse } from "@/types/api";
import { Vote, VoteStats } from "@/types/vote";
import { NextRequest, NextResponse } from "next/server";

// Get votes of a question
export const GET = async (
  request: NextRequest,
  { params }: { params: Promise<{ questionId: string }> },
) => {
  try {
    const { questionId } = await params;

    const session = await auth.api.getSession({ headers: request.headers });
    const userId = session?.user?.id;

    if (!questionId) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "questionId is required" },
        { status: 400 },
      );
    }

    const votes: Vote[] = await prisma.vote.findMany({ where: { questionId } });

    const upVotes = votes.filter((v) => v.type === "UP").length;
    const downVotes = votes.filter((v) => v.type === "DOWN").length;
    const score = upVotes - downVotes;

    const userVote = userId
      ? votes.find((v) => v.userId === userId)?.type || null
      : null;

    return NextResponse.json<ApiResponse<VoteStats>>({
      success: true,
      data: { upVotes, downVotes, score, userVote },
    });
  } catch (error) {
    console.error("Error in getting votes:", error);

    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: "Internal server error." },
      { status: 500 },
    );
  }
};

// Vote question
export const POST = async (
  request: NextRequest,
  { params }: { params: Promise<{ questionId: string }> },
) => {
  try {
    const { questionId } = await params;
    const body = await request.json();

    if (!body.userId || !body.type)
      return NextResponse.json<ApiResponse<never>>({
        success: false,
        error: "UserId and Vote Type is required!",
      });

    const existingVote = await prisma.vote.findFirst({
      where: {
        userId: body.userId,
        questionId,
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
          questionId,
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
      { status: 500 },
    );
  }
};
