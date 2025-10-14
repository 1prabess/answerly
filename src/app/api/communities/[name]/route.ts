import prisma from "@/lib/prisma";
import { ApiResponse } from "@/types/api";
import { CommunityDetails } from "@/types/community";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export const GET = async (
  request: NextRequest,
  { params }: { params: Promise<{ name: string }> },
) => {
  try {
    const { name } = await params;

    const session = await auth.api.getSession({ headers: await headers() });
    const currentUserId = session?.user.id;

    const community = await prisma.community.findUnique({
      where: {
        name,
      },
      include: {
        _count: {
          select: { CommunityMember: true },
        },
      },
    });

    if (!community) {
      return NextResponse.json<ApiResponse<never>>(
        {
          success: false,
          error: "Community not found.",
        },
        { status: 404 },
      );
    }

    let hasJoined = false;
    if (currentUserId) {
      const memberCount = await prisma.communityMember.count({
        where: {
          userId: currentUserId,
          communityId: community.id,
        },
      });
      hasJoined = memberCount > 0;
      console.log(
        `Checking membership: userId=${currentUserId}, communityId=${community.id}, count=${memberCount}, hasJoined=${hasJoined}`,
      );
    } else {
      console.log("No user session, setting hasJoined to false");
    }

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
      joined: hasJoined,
      memberCount: community._count.CommunityMember,
      questions: formattedQuestions,
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
