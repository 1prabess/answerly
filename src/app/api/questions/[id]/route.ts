import { Vote } from "@/generated/prisma";
import prisma from "@/lib/prisma";
import { ApiResponse } from "@/types/api";
import { NextRequest, NextResponse } from "next/server";

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
    console.log("Error in questions vote [POST]", error);
    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: "Internal server error." },
      { status: 500 }
    );
  }
};
