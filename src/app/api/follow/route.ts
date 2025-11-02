import { Follow } from "@/generated/prisma";
import prisma from "@/lib/prisma";
import { ApiResponse } from "@/types/api";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
  try {
    const { followerId, followingId } = await request.json();

    if (followerId === followingId) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "You cannot follow yourself." },
        { status: 400 },
      );
    }

    const existing = await prisma.follow.findFirst({
      where: { followerId, followingId },
    });

    if (existing) {
      // toggle: unfollow
      await prisma.follow.delete({
        where: { id: existing.id },
      });

      return NextResponse.json<ApiResponse<never>>(
        { success: true, error: "Unfollowed successfully." },
        { status: 200 },
      );
    } else {
      // toggle: follow
      const follow = await prisma.follow.create({
        data: { followerId, followingId },
      });

      return NextResponse.json<ApiResponse<Follow>>(
        { success: true, data: follow },
        { status: 201 },
      );
    }
  } catch (error) {
    console.log("Error in toggling follow:", error);
    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: "Internal server error." },
      { status: 500 },
    );
  }
};
