import prisma from "@/lib/prisma";
import { ApiResponse } from "@/types/api";
import { CommunityDetails } from "@/types/community";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export const GET = async (
  _request: NextRequest,
  { params }: { params: Promise<{ name: string }> },
) => {
  try {
    const { name } = await params;

    // Get current user session
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    const currentUserId = session?.user.id;

    // Fetch community and include member count and total posts
    const community = await prisma.community.findUnique({
      where: { name },
      include: {
        _count: {
          select: {
            CommunityMember: true,
            question: true, // total posts
          },
        },
      },
    });

    if (!community) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "Community not found." },
        { status: 404 },
      );
    }

    // Check if current user has joined this community
    let hasJoined = false;
    if (currentUserId) {
      const memberCount = await prisma.communityMember.count({
        where: {
          userId: currentUserId,
          communityId: community.id,
        },
      });
      hasJoined = memberCount > 0;
    }

    const communityAdmins = await prisma.communityMember.findMany({
      where: {
        communityId: community.id,
        role: "ADMIN",
      },
      include: {
        user: true,
      },
    });

    // Fetch questions in this community with votes, tags, comments
    const questions = await prisma.question.findMany({
      where: { communityId: community.id },
      include: {
        author: true,
        votes: true,
        tags: true,
        _count: { select: { comments: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    // Format questions with upVotes, downVotes, score, userVoted
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

    const communityDetails: CommunityDetails = {
      id: community.id,
      name: community.name,
      description: community.description,
      avatar: community.avatar ?? null,
      banner: community.banner ?? null,
      createdAt: community.createdAt,
      joined: hasJoined,
      memberCount: community._count.CommunityMember,
      totalQuestions: community._count.question,
      questions: formattedQuestions,
      admins: communityAdmins.map((a) => ({
        id: a.user.id,
        name: a.user.name,
        username: a.user.username,
        email: a.user.email,
        image: a.user.image,
      })),
    };

    return NextResponse.json<ApiResponse<CommunityDetails>>({
      success: true,
      message: "Community fetched successfully.",
      data: communityDetails,
    });
  } catch (error) {
    console.error("Error in fetching community:", error);
    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: "Internal server error." },
      { status: 500 },
    );
  }
};
