import prisma from "@/lib/prisma";
import { ApiResponse } from "@/types/api";
import { UserProfile } from "@/types/profile";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

// Get user profile
export const GET = async (request: NextRequest) => {
  try {
    const username = request.nextUrl.searchParams.get("username");
    const page = Number(request.nextUrl.searchParams.get("page") || 1);
    const limit = Number(request.nextUrl.searchParams.get("limit") || 10);
    const skip = (page - 1) * limit;

    if (!username)
      return NextResponse.json<ApiResponse<never>>({
        success: false,
        error: "Username query parameter is required",
      });

    const user = await prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
        image: true,
        createdAt: true,
      },
    });

    if (!user)
      return NextResponse.json<ApiResponse<never>>({
        success: false,
        error: "No user found",
      });

    // Get session to identify the requesting user
    const session = await auth.api.getSession({ headers: await headers() });
    const currentUserId = session?.user?.id;

    const questions = await prisma.question.findMany({
      where: { authorId: user.id },
      include: {
        author: true,
        votes: true,
        tags: true,
        _count: { select: { comments: true } },
      },
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    });

    const formattedQuestions = questions.map((q) => {
      const upVotes = q.votes.filter((v) => v.type === "UP").length;
      const downVotes = q.votes.filter((v) => v.type === "DOWN").length;
      const userVoted = currentUserId
        ? q.votes.find((v) => v.userId === currentUserId)?.type || null
        : null;

      return {
        id: q.id,
        title: q.title,
        description: q.description,
        image: q.image,
        createdAt: q.createdAt,
        updatedAt: q.updatedAt,
        authorId: q.authorId,
        author: q.author,
        tags: q.tags,
        upVotes,
        downVotes,
        score: upVotes - downVotes,
        userVoted,
        commentCount: q._count.comments,
      };
    });

    const totalQuestions = await prisma.question.count({
      where: { authorId: user.id },
    });

    const following = await prisma.follow.findMany({
      where: { followerId: user.id },
      select: { followingId: true },
    });

    const followers = await prisma.follow.findMany({
      where: { followingId: user.id },
      select: { followerId: true },
    });

    const profile = {
      id: user.id,
      name: user.name,
      email: user.email,
      emailVerified: user.emailVerified,
      image: user.image,
      createdAt: user.createdAt,
      questions: formattedQuestions,
      following: following.map((f) => f.followingId),
      followers: followers.map((f) => f.followerId),
      page,
      limit,
      totalQuestions,
    };

    return NextResponse.json<ApiResponse<UserProfile>>({
      success: true,
      data: profile,
    });
  } catch (error) {
    console.log("Error fetching profile:", error);
    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: "Internal server error." },
      { status: 500 },
    );
  }
};
