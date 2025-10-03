import prisma from "@/lib/prisma";
import { ApiResponse } from "@/types/api";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
  try {
    const { userId } = await request.json();

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        name: true,
        email: true,
        emailVerified: true,
        image: true,
        createdAt: true,
        questions: true,
      },
    });

    const following = await prisma.follow.findMany({
      where: {
        followerId: userId,
      },
      select: {
        followingId: true,
      },
    });

    const followingIds = following.map((f) => f.followingId);

    const followers = await prisma.follow.findMany({
      where: {
        followingId: userId,
      },
      select: {
        followerId: true,
      },
    });

    const followersIds = followers.map((f) => f.followerId);

    const profile = {
      ...user,
      following: followingIds,
      followers: followersIds,
    };

    return NextResponse.json({
      profile,
    });
  } catch (error) {
    console.log("Error in profile [POST]", error);
    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: "Internal server error." },
      { status: 500 }
    );
  }
};
